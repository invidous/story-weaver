'use strict';
const Core=NexusCore, store=new CampaignStore();
let campaign=Core.migrate({messages:[]}), messages=[],characterSheet='',referenceDocuments=[],sessionExtras={};
let currentStoryName='',NEXUS_FRAMEWORK=null,frameworkMeta=null,isGenerating=false,abortController=null;
let ready=false,operation=null,draftTimer;
const $=id=>document.getElementById(id);
function snapshot() {return Core.migrate({...sessionExtras,...campaign,messages,character_sheet:characterSheet,reference_documents:referenceDocuments,name:currentStoryName});}
function install(data) {
    campaign=Core.migrate(data); messages=campaign.messages;characterSheet=campaign.character_sheet;referenceDocuments=campaign.reference_documents;
    sessionExtras=campaign;currentStoryName=campaign.name||'';
    $('session-name-input').value=currentStoryName;renderMessages();updateDeskStatus();
}
function idle() { if(!ready){setStatus('Still loading browser storage and framework.','error');return false;} if(operation){setStatus('Finish or stop the current '+operation+' first.','error');return false;} return true; }
function busy(label,canStop=false,background=false) {
    operation=label; isGenerating=true;
    // Draft writes retain the operation lock without blurring a focused mobile input.
    if(background)return;
    $('send-btn').disabled=!canStop;$('send-btn').textContent=canStop?'Stop':'Working…';$('send-btn').onclick=canStop?stopGeneration:()=>{};
    $('message-input').disabled=true;
    document.querySelectorAll('.header-btn').forEach(b=>b.disabled=true);
}
function release() {
    operation=null;isGenerating=false;abortController=null;
    $('send-btn').disabled=false;$('send-btn').textContent='Send';$('send-btn').onclick=sendMessage;
    $('message-input').disabled=false;document.querySelectorAll('.header-btn').forEach(b=>b.disabled=false);
}
function checkpoint(data,label) {return {checkpoint_id:Core.id(),campaign_id:data.campaign_id,date:new Date().toISOString(),label,data:Core.clone(data)};}
async function commit(data,{backup=null,label='Checkpoint'}={}) {
    data=Core.migrate(data);data.revision=campaign.revision+1;data.date=new Date().toISOString();
    data.framework=data.framework||frameworkMeta;
    await store.save(data,data.campaign_id===campaign.campaign_id?campaign.revision:0,backup?checkpoint(backup,label):null);
    install(data);$('save-status').textContent='Saved '+new Date().toLocaleTimeString();
}
async function loadFramework() {
    const response=await fetch('framework.txt',{cache:'no-cache'});
    if(!response.ok) throw Error('Cannot load framework.txt. Serve this folder over HTTP.');
    const text=await response.text();
    if(text.length<5000||!text.includes('NEXUS CONSTITUTION')) throw Error('Framework is missing or incomplete.');
    // Fingerprinting is optional on HTTP LAN origins where SubtleCrypto is unavailable.
    const hash=crypto.subtle?Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(n=>n.toString(16).padStart(2,'0')).join(''):null;
    frameworkMeta={version:text.match(/^Version (.+)$/m)?.[1]||'unknown',sha256:hash};NEXUS_FRAMEWORK=text;
}
function providerOptions(model=getModel()) {
    const provider=getProvider();return {provider,model,key:provider==='anthropic'?getApiKey():provider==='google'?getGoogleApiKey():getOpenaiApiKey(),temperature:getTemperature(),info:modelInfo(provider,model),signal:abortController?.signal};
}
async function sendMessage() {
    if(!idle())return;const content=$('message-input').value.trim();if(!content)return;
    if(!providerOptions().key){showSettings();setStatus('Enter the selected provider’s API key in Settings.','error');return;}
    busy('response',true);abortController=new AbortController();
    const before=snapshot(), turnId=Core.id(),user={id:Core.id(),role:'user',content,status:'pending'};
    let partial='',started=false;
    try {
        const pending={...before,messages:[...before.messages,user]};
        await commit(pending); started=true;
        $('message-input').value='';$('message-input').style.height='auto';
        const full=await NexusProviders.generate({...providerOptions(),system:Core.buildPrompt(NEXUS_FRAMEWORK,pending,getProvider()==='google'?GEMINI_REINFORCEMENT:'',turnId),
            messages:pending.messages.map(m=>({...m,content:'[Turn '+m.id+']\n'+m.content}))},text=>{
                partial=Core.visibleText(text);$('stream-preview').textContent=partial||'The Nexus is thinking…';
            });
        const reply=Core.splitReply(full);if(!reply.prose)throw Error('No narrative text received.');
        let state=campaign.campaign_state,warning=reply.warning;
        if(reply.delta) {
            try {state=Core.applyDelta(state,reply.delta,turnId,new Set([...messages.map(m=>m.id),...state.records.flatMap(r=>r.source_turns),turnId]));}
            catch(error){warning='Continuity update rejected: '+error.message;}
        }
        const updated={...snapshot(),campaign_state:state,messages:[...messages.map(m=>m.id===user.id?{...m,status:'complete'}:m),{id:turnId,role:'assistant',content:reply.prose,status:'complete'}],draft:''};
        await commit(updated,{backup:before,label:'Before turn '+(before.messages.length+1)});
        setStatus(warning||'Ready',warning?'error':'success');
    } catch(error) {
        if(started) {
            const failed={...snapshot(),messages:messages.map(m=>m.id===user.id?{...m,status:'failed'}:m)};
            if(partial)failed.messages.push({id:turnId,role:'assistant',content:partial,status:'interrupted'});
            try{await commit(failed);}catch{install(failed);$('save-status').textContent='Unsaved — download a recovery copy';}
        }
        $('message-input').value=content;
        setStatus((error.name==='AbortError'?'Stopped.':error.message)+' Your action is in the input for retry.','error');
    } finally {$('stream-preview').textContent='';release();}
}
function stopGeneration(){abortController?.abort();}

async function showSessions() {
    if(!idle())return;
    const list=$('sessions-list');list.replaceChildren();
    try{
        const sessions=(await store.all('campaigns')).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
        for(const data of sessions){
            const row=document.createElement('div');row.className='session-item';
            const load=document.createElement('button');load.className='modal-btn secondary';load.textContent=(data.name||'Untitled campaign')+' · '+data.messages.length+' messages';load.onclick=()=>loadSession(data.campaign_id);
            const remove=document.createElement('button');remove.className='delete-btn';remove.textContent='×';remove.setAttribute('aria-label','Delete '+(data.name||'campaign'));remove.onclick=()=>deleteSession(data.campaign_id);
            row.append(load,remove);list.append(row);
        }
        if(!sessions.length)list.textContent='No saved campaigns yet.';
        $('session-name-input').value=currentStoryName;$('sessions-modal').classList.add('active');
    }catch(error){setStatus(error.message,'error');}
}
async function saveSession(){
    if(!idle())return;const name=$('session-name-input').value.trim();if(!name){alert('Enter a campaign name.');return;}
    busy('save');try{await commit({...snapshot(),name});setStatus('Campaign saved.','success');closeSessions();}catch(e){setStatus(e.message,'error');}finally{release();}
}
async function loadSession(id){
    if(!idle())return;busy('load');try{const data=await store.read('campaigns',id);if(!data)throw Error('Campaign not found.');install(data);$('message-input').value=data.draft||'';closeSessions();setStatus('Campaign loaded.','success');}catch(e){setStatus(e.message,'error');}finally{release();}
}
async function deleteSession(id){
    if(!idle()||!confirm('Delete this browser campaign? Download a copy first if you need it. Recovery checkpoints will remain.'))return;
    busy('delete');try{await store.remove(id);if(id===campaign.campaign_id)install(Core.migrate({messages:[]}));}catch(e){setStatus(e.message,'error');}finally{release();}await showSessions();
}
function loadFromFile(){
    if(!idle())return;const input=document.createElement('input');input.type='file';input.accept='.json';
    input.onchange=async()=>{
        if(!idle()||!input.files[0])return;busy('import');
        try{
            const file=input.files[0],data=Core.migrate(JSON.parse(await file.text()));
            // Import creates a separate copy, never overwrites an existing campaign by ID.
            data.parent_campaign_id=data.campaign_id;data.campaign_id=Core.id();data.revision=0;
            data.name=data.name||file.name.replace(/\.json$/i,'');
            await commit(data);closeSessions();setStatus('Imported as a separate campaign. Provider settings and keys retained.','success');
        }catch(e){setStatus('Import failed: '+e.message,'error');}finally{release();}
    };input.click();
}
async function downloadJSON(data,filename){
    const json=JSON.stringify(data,null,2),blob=new Blob([json],{type:'application/json'});
    const mobile=/Android|iPhone|iPad/i.test(navigator.userAgent);
    if(mobile&&navigator.canShare)for(const type of ['application/json','text/plain','application/octet-stream']){
        const file=new File([json],filename,{type});if(!navigator.canShare({files:[file]}))continue;
        try{await navigator.share({files:[file],title:'Nexus campaign'});return true;}catch(e){if(e.name==='AbortError')return false;}
    }
    const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    return true;
}
async function saveToFile(){
    const data=snapshot();data.provider=getProvider();data.model=getModel();data.temperature=getTemperature();data.created=new Date().toISOString();
    if(await downloadJSON(data,(data.name||'nexus')+'_'+Date.now()+'.json'))setStatus('Download requested.','success');
}
async function newSession(){
    if(!idle()||!confirm('Start another campaign? This campaign remains in browser saves.'))return;
    const keep=characterSheet&&confirm('Carry the character sheet, references, and campaign records forward?');
    busy('new campaign');try{
        const data=Core.migrate(keep?{...snapshot(),messages:[],campaign_id:Core.id(),revision:0,parent_campaign_id:campaign.campaign_id,name:'',draft:''}:{messages:[]});
        await commit(data);$('message-input').value='';setStatus('New campaign ready.','success');
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
async function saveCharacterSheet(){
    if(!idle())return;busy('sheet update');try{
        await commit({...snapshot(),character_sheet:$('character-sheet-editor').value},{backup:snapshot(),label:'Before sheet edit'});closeCharacterSheet();setStatus('Sheet saved. Recovery checkpoint retained.','success');
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
function clearCharacterSheet(){if(idle()&&confirm('Clear the sheet? Save to apply; a recovery checkpoint will be kept.'))$('character-sheet-editor').value='';}
async function deleteReferenceDoc(index){
    if(!idle()||!referenceDocuments[index]||!confirm('Remove '+referenceDocuments[index].name+'?'))return;
    busy('reference update');try{await commit({...snapshot(),reference_documents:referenceDocuments.filter((_,i)=>i!==index)},{backup:snapshot(),label:'Before reference removal'});renderReferenceDocsList();}catch(e){setStatus(e.message,'error');}finally{release();}
}
// Retain the PDF/text/JSON upload implementation, but make its mutations atomic and block session switches during file reads.
const originalUpload=uploadReferenceDoc;
uploadReferenceDoc=async function(event){
    if(!idle())return;const before=snapshot();busy('reference upload');
    try{await originalUpload(event);await commit(snapshot(),{backup:before,label:'Before reference upload'});}catch(e){install(before);setStatus(e.message,'error');}finally{release();}
};
const originalSaveSettings=saveSettings;
saveSettings=function(){if(!idle())return;try{originalSaveSettings();localStorage.setItem('nexus_model_'+getProvider(),$('model-select').value);updateDeskStatus();}catch(e){setStatus('Settings could not be saved: '+e.message,'error');}};

// A reusable review dialog: avoids interpreting Cancel as another destructive choice.
function reviewDialog(title,text,choices=null){
    return new Promise(resolve=>{
        const dialog=$('review-dialog');$('review-title').textContent=title;$('review-text').textContent=text;
        const select=$('review-select');select.replaceChildren();select.hidden=!choices;
        if(choices)for(const c of choices)select.add(new Option(c.label,c.value));
        const finish=value=>{dialog.close();resolve(value);};
        $('review-accept').onclick=()=>finish(choices?select.value:true);$('review-cancel').onclick=()=>finish(null);
        dialog.oncancel=e=>{e.preventDefault();finish(null);};dialog.showModal();
    });
}
async function archiveAndTrim(){
    if(!idle())return;
    if(messages.length<15){alert('Archive after at least 15 messages.');return;}
    if(!providerOptions().key){showSettings();return;}
    busy('archive',true);abortController=new AbortController();const before=snapshot();
    try{
        let cut=Core.trimIndex(messages,campaign.campaign_state.scene_breaks);
        const choices=messages.map((m,i)=>({m,i})).filter(({m,i})=>m.role==='assistant'&&m.status!=='interrupted'&&i>=1&&i<messages.length-3&&messages[i+1].role==='user');
        if(!choices.length)throw Error('No complete turn boundary is available for archival.');
        const selection=await reviewDialog('Choose the archive boundary','Messages through this response will be archived. The remaining conversation stays active. Choose a genuine scene boundary; cancel leaves everything unchanged.',choices.map(({m,i})=>({value:String(i+1),label:(i+1===cut?'Suggested · ':'')+'Through message '+(i+1)+': '+m.content.slice(0,85)})).sort((a,b)=>Number(b.value===String(cut))-Number(a.value===String(cut))));
        if(selection===null)return;cut=Number(selection);
        const quality=await reviewDialog('Summary quality','Review the proposed player-facing sheet before applying. Existing campaign ledgers and the original transcript are preserved.',[{value:'deep',label:'Deep — stronger continuity'},{value:'quick',label:'Quick — lower cost'}]);
        if(!quality||abortController.signal.aborted)return;
        // Persist the original before any provider call or trimming. Even a cancelled download is recoverable.
        await store.save(before,before.revision,checkpoint(before,'Before archive'));
        setStatus('Preparing archive summary…');
        const input=before.messages.slice(0,cut).filter(m=>!['failed','interrupted'].includes(m.status));
        const archiveId='archive_'+Core.id();
        const rawSummary=await NexusProviders.generate({...providerOptions(MODEL_CATALOG[getProvider()].summary[quality]),stream:false,maxTokens:8192,
            system:'You are a continuity editor. Return a factual player-facing summary with headings PLAYER SHEET, SCENE BRIDGE, OPEN LOOPS. Preserve exact skills, injuries, items, promises, names, and known relationships. No new facts or inferred secrets. Do not reveal GM-only records. Do not narrate new events. The bridge describes the situation at the cut, not a new scene. Existing structured ledgers are preserved by the application. Append a nexus-state block to capture consequential facts from the prior sheet and archived transcript not yet recorded; do not rewrite existing records based on older events. No scene_end or chronicle additions during archival. Cite original transcript turn IDs, or legacy_sheet for explicit facts from the previous sheet. Keep secrets GM-only. If uncertain about visibility, use gm. Do not invent knowledge sources.\n'+Core.stateContract(archiveId),
            messages:[{role:'user',content:JSON.stringify({previous_sheet:characterSheet,existing_records:before.campaign_state.records,transcript:input})}]});
        const parsed=Core.splitReply(rawSummary),summary=parsed.prose;
        Core.validateSummary(summary);
        if(!parsed.delta)throw Error('Archive summary lacked a valid continuity block; nothing was trimmed.');
        const preservedState=Core.applyDelta(before.campaign_state,{...parsed.delta,chronicle:[],scene_end:false},archiveId,new Set([...input.map(m=>m.id),...before.campaign_state.records.flatMap(r=>r.source_turns),'legacy_sheet']));
        if(abortController.signal.aborted)return;
        const accepted=await reviewDialog('Review archive summary',summary+'\n\nContinuity records: '+before.campaign_state.records.length+' → '+preservedState.records.length+'. Existing records retain history. Apply replaces the readable sheet and trims the active transcript. The original is available in Recovery.');
        if(!accepted||abortController.signal.aborted)return;
        const next={...before,character_sheet:summary,campaign_state:preservedState,messages:before.messages.slice(cut),archive_history:[...(before.archive_history||[]),{id:archiveId,date:new Date().toISOString(),through_turn:before.messages[cut-1].id,count:cut}]};
        await commit(next);closeSessions();setStatus('Archive applied. Original retained in Recovery; use Download for a portable copy.','success');
    }catch(e){setStatus(e.name==='AbortError'?'Archive stopped; transcript retained.':e.message,'error');}finally{release();}
}
async function showRecovery(){
    if(!idle())return;busy('recovery');
    try{
        const rows=(await store.all('checkpoints')).sort((a,b)=>b.date.localeCompare(a.date));
        if(!rows.length){alert('No recovery checkpoints yet.');return;}
        const selected=await reviewDialog('Recovery and branches','Restore opens a separate campaign copy. Your current campaign remains saved. Entries include checkpoints from deleted campaigns.',rows.map(r=>({value:r.checkpoint_id,label:(r.data.name||'Untitled')+' · '+r.label+' · '+new Date(r.date).toLocaleString()})));
        if(!selected)return;const row=rows.find(r=>r.checkpoint_id===selected);
        await commit({...Core.clone(row.data),parent_campaign_id:row.campaign_id,campaign_id:Core.id(),revision:0,name:(row.data.name||'Campaign')+' — recovered',draft:''});
        closeSessions();setStatus('Opened recovery as a separate campaign.','success');
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
async function branchCampaign(){
    if(!idle())return;busy('branch');
    try{
        const rows=await store.checkpoints(campaign.campaign_id),now={checkpoint_id:'now',label:'Current position',data:snapshot()};
        const options=[now,...rows.reverse()];
        const selected=await reviewDialog('Branch campaign','Choose a position. Both the original and the new branch remain available in Sessions.',options.map(r=>({value:r.checkpoint_id,label:r.label})));
        if(!selected)return;const source=options.find(r=>r.checkpoint_id===selected).data;
        await commit({...Core.clone(source),parent_campaign_id:campaign.campaign_id,campaign_id:Core.id(),revision:0,name:(source.name||'Campaign')+' — branch',draft:''});
        setStatus('Branch created.','success');
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
async function correctCanon(){
    if(!idle())return;const text=$('correction-input').value.trim();if(!text)return;busy('correction');
    try{
        const before=snapshot(),turn=Core.id(),state=Core.clone(before.campaign_state);
        state.records.push({id:'correction_'+Core.id(),kind:'preference',text:'Explicit OOC canon correction (takes precedence over superseded statements): '+text,visibility:'player',certainty:'fact',source_turns:[turn]});
        state.chronicle.push({turn_id:turn,text:'Player correction: '+text});
        await commit({...before,campaign_state:state,messages:[...messages,{id:turn,role:'user',content:'Nexus, OOC canon correction: '+text,status:'complete'}]},{backup:before,label:'Before canon correction'});
        $('correction-input').value='';showDesk();setStatus('Correction recorded with its original history retained.','success');
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
async function recordRoll(){
    if(!idle())return;busy('roll');
    try{
        const before=snapshot(),raw=$('roll-die').value;
        const roll=Core.roll({intent:$('roll-intent').value,approach:$('roll-approach').value,stakes:$('roll-stakes').value,skill:$('roll-skill').value,modifier:Number($('roll-modifier').value),dc:Number($('roll-dc').value),die:raw?Number(raw):undefined});
        const state=Core.clone(before.campaign_state);state.rolls.push(roll);
        await commit({...before,campaign_state:state},{backup:before,label:'Before recorded roll'});
        $('roll-result').textContent='Recorded d20 '+roll.die+' + '+roll.modifier+' = '+roll.total+' vs DC '+roll.dc+' (margin '+roll.margin+').';
        $('message-input').value='Resolve recorded roll '+roll.id+' for '+roll.intent+'. Honor its established approach, stakes, and result.';
    }catch(e){setStatus(e.message,'error');}finally{release();}
}
function showDesk(){
    const list=$('campaign-records');list.replaceChildren();
    for(const rec of campaign.campaign_state.records.filter(r=>r.visibility==='player')){
        const item=document.createElement('p');item.textContent=rec.kind+' · '+rec.certainty+': '+rec.text;list.append(item);
    }
    if(!list.children.length)list.textContent='Known campaign facts will appear here as play establishes them.';
    $('desk-title').textContent=currentStoryName||'Campaign desk';$('desk-modal').classList.add('active');
}
function updateDeskStatus(){
    if(!$('context-status'))return;
    const chars=(NEXUS_FRAMEWORK?.length||0)+characterSheet.length+JSON.stringify(campaign.campaign_state).length+referenceDocuments.reduce((s,d)=>s+d.content.length,0)+messages.reduce((s,m)=>s+m.content.length,0);
    $('context-status').textContent='Input estimate ~'+Math.ceil(chars/4).toLocaleString()+' tokens (rough) · '+messages.length+' messages'+(messages.length>=60?' · consider Archive & Trim':'');
}
const input=$('message-input');
input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}});
input.addEventListener('input',()=>{
    input.style.height='auto';input.style.height=Math.min(input.scrollHeight,150)+'px';
    clearTimeout(draftTimer);const capturedId=campaign.campaign_id;
    draftTimer=setTimeout(async()=>{
        if(!ready||operation||campaign.campaign_id!==capturedId)return;
        busy('draft save',false,true);try{await commit({...snapshot(),draft:input.value});}catch(e){$('save-status').textContent='Draft not saved: '+e.message;}finally{release();}
    },700);
});
window.addEventListener('beforeunload',e=>{if(operation||input.value!==(campaign.draft||'')){e.preventDefault();e.returnValue='';}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.active').forEach(m=>m.classList.remove('active'));});
async function init(){
    $('send-btn').disabled=true;
    try{
        await Promise.all([store.open(),loadFramework()]);
        const failures=await store.importLegacy(localStorage,Core);
        const last=await store.read('meta','last_active'),data=last&&await store.read('campaigns',last);
        if(data){install(data);input.value=data.draft||'';}
        const interrupted=messages.some(m=>m.status==='pending');
        if(interrupted){input.value=messages.findLast(m=>m.status==='pending')?.content||input.value;messages=messages.map(m=>m.status==='pending'?{...m,status:'failed'}:m);await commit({...snapshot(),draft:input.value});}
        ready=true;release();updateDeskStatus();
        $('save-status').textContent=data?'Browser recovery ready — saved campaign restored.':'Browser recovery ready — no saved campaign yet.';
        window.nexusStartupComplete=true;
        const mismatch=campaign.framework?.sha256&&frameworkMeta.sha256&&campaign.framework.sha256!==frameworkMeta.sha256;
        setStatus(failures.length?'Some legacy sessions could not be imported; original browser saves retained.':mismatch?'Framework updated since this campaign was saved; prior version is recorded in its export.':interrupted?'Recovered an interrupted turn. Retry its action when ready.':'Nexus 3.6 ready. Existing provider keys retained.',failures.length?'error':'success');
    }catch(e){window.nexusStartupComplete=true;setStatus(e.message,'error');$('save-status').textContent='Startup incomplete — reload after resolving the error';}
}
init();
