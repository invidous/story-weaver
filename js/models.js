// Official model catalogs checked 2026-09-06. Account access is provider-specific.
// Sources and compatibility decisions: docs/models.md. Credentials remain in existing browser settings.
const MODEL_CATALOG = {
    anthropic:{default:'claude-sonnet-5',summary:{deep:'claude-opus-5',quick:'claude-haiku-4-5-20251001'},models:[
        {id:'claude-fable-5-1',label:'Claude Fable 5.1 — premium',sampling:false},
        {id:'claude-opus-5',label:'Claude Opus 5 — deep reasoning',sampling:false},
        {id:'claude-sonnet-5',label:'Claude Sonnet 5 — balanced',sampling:false},
        {id:'claude-haiku-4-5-20251001',label:'Claude Haiku 4.5 — fast',sampling:true}
    ]},
    google:{default:'gemini-3.8-flash',summary:{deep:'gemini-3.1-pro-preview',quick:'gemini-3.5-flash-lite'},models:[
        {id:'gemini-3.8-flash',label:'Gemini 3.8 Flash — current stable',sampling:true},
        {id:'gemini-3.7-flash',label:'Gemini 3.7 Flash',sampling:true},
        {id:'gemini-3.5-flash',label:'Gemini 3.5 Flash — previous selection',sampling:true},
        {id:'gemini-3.5-flash-lite',label:'Gemini 3.5 Flash-Lite — fast',sampling:true},
        {id:'gemini-3.1-pro-preview',label:'Gemini 3.1 Pro — preview',sampling:true},
        {id:'gemini-3.1-flash-lite',label:'Gemini 3.1 Flash-Lite',sampling:true},
        {id:'gemini-2.5-pro',label:'Gemini 2.5 Pro — legacy',sampling:true},
        {id:'gemini-2.5-flash',label:'Gemini 2.5 Flash — legacy',sampling:true}
    ]},
    openai:{default:'chat-latest',summary:{deep:'gpt-6-astra',quick:'gpt-5.4-mini'},models:[
        {id:'gpt-6-astra',label:'GPT-6 Astra — deep reasoning',sampling:false,reasoning:'low'},
        {id:'gpt-5.6-sol',label:'GPT-5.6 Sol',sampling:false},
        {id:'gpt-5.6-luna',label:'GPT-5.6 Luna — fast reasoning',sampling:false},
        {id:'chat-latest',label:'Chat Latest — current Instant (rolling alias)',sampling:false},
        {id:'gpt-5.5',label:'GPT-5.5 — previous generation',sampling:false},
        {id:'gpt-5.4-mini',label:'GPT-5.4 Mini — economical',sampling:false}
    ]}
};
function modelInfo(provider,id) { return MODEL_CATALOG[provider]?.models.find(m=>m.id===id)||null; }
function getProvider() { const p=localStorage.getItem('nexus_provider'); return MODEL_CATALOG[p]?p:'anthropic'; }
function getModel() {
    const provider=getProvider();
    const saved=localStorage.getItem('nexus_model_'+provider)||localStorage.getItem('nexus_model');
    return modelInfo(provider,saved)?saved:MODEL_CATALOG[provider].default;
}
function renderModelOptions(provider) {
    const select=document.getElementById('model-select'); select.replaceChildren();
    for(const m of MODEL_CATALOG[provider].models) select.add(new Option(m.label,m.id));
    const saved=localStorage.getItem('nexus_model_'+provider)||localStorage.getItem('nexus_model');
    select.value=modelInfo(provider,saved)?saved:MODEL_CATALOG[provider].default;
    document.getElementById('model-note').textContent=saved&&!modelInfo(provider,saved)?'Previous model is not in the current catalog. The displayed model will be used; choose another if preferred.':'Catalog checked September 6, 2026. Availability depends on your API account.';
}
if(typeof module!=='undefined') module.exports=MODEL_CATALOG;
