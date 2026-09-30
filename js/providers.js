/* One buffered SSE implementation and three provider adapters. */
(function(root) {
    'use strict';
    async function readEvents(body, onEvent) {
        if(!body) throw Error('Response body is missing.');
        const reader=body.getReader(),decoder=new TextDecoder();
        let buffer='',lines=[];
        function line(value) {
            if(value==='') {
                if(lines.length) onEvent(lines.join('\n'));
                lines=[];
            } else if(value.startsWith('data:')) lines.push(value.slice(5).replace(/^ /,''));
        }
        try {
            while(true) {
                const {done,value}=await reader.read();
                buffer += done ? decoder.decode() : decoder.decode(value,{stream:true});
                let at;
                while((at=buffer.indexOf('\n'))>=0) { line(buffer.slice(0,at).replace(/\r$/,'')); buffer=buffer.slice(at+1); }
                if(done) break;
            }
            if(buffer.trim() || lines.length) throw Error('Stream ended in an incomplete event. Retry the turn.');
        } finally { await reader.cancel().catch(()=>{}); reader.releaseLock(); }
    }
    function request({provider,model,key,temperature=1,system,messages,maxTokens=12288,stream=true,cachePrefix='',cacheTtl='1h'}, info={}) {
        if(cachePrefix && !system.startsWith(cachePrefix)) throw Error('Cache prefix must match the beginning of the system prompt.');
        const cache=cachePrefix && cacheTtl!=='off';
        // Never forward local IDs, status, snapshots, or continuity metadata as API message properties.
        const conversation=messages.filter(m=>m.status!=='failed'&&m.status!=='interrupted'&&m.role!=='system').map(({role,content})=>({role,content}));
        let url,headers={'Content-Type':'application/json'},body;
        if(provider==='anthropic') {
            url='https://api.anthropic.com/v1/messages';
            headers={...headers,'x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'};
            body={model,system,messages:conversation,max_tokens:maxTokens,stream};
            if(cache) body.system=[{type:'text',text:cachePrefix,cache_control:{type:'ephemeral',ttl:cacheTtl==='5m'?'5m':'1h'}},
                ...(system.length>cachePrefix.length?[{type:'text',text:system.slice(cachePrefix.length)}]:[])];
            if(info.sampling===true) body.temperature=temperature;
        } else if(provider==='openai') {
            url='https://api.openai.com/v1/chat/completions';
            headers.Authorization='Bearer '+key;
            body={model,messages:[{role:'system',content:system},...conversation],max_completion_tokens:maxTokens,stream};
            if(stream) body.stream_options={include_usage:true};
            // Explicit breakpoints are supported starting with GPT-5.6. Older models retain automatic caching.
            if(cache && /^gpt-(?:6(?:[.-]|$)|5\.[6-9](?:[.-]|$))/.test(model)) {
                body.messages[0].content=[{type:'text',text:cachePrefix,prompt_cache_breakpoint:{mode:'explicit'}},
                    ...(system.length>cachePrefix.length?[{type:'text',text:system.slice(cachePrefix.length)}]:[])];
                body.prompt_cache_options={mode:'explicit',ttl:'30m'};
            }
            if(info.sampling===true) body.temperature=temperature;
            if(info.reasoning) body.reasoning_effort=info.reasoning;
        } else if(provider==='google') {
            url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(model)+(stream?':streamGenerateContent?alt=sse':':generateContent');
            headers['x-goog-api-key']=key;
            body={systemInstruction:{parts:[{text:system}]},contents:conversation.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]})),generationConfig:{maxOutputTokens:maxTokens}};
            if(info.sampling===true) body.generationConfig.temperature=temperature;
        } else throw Error('Unknown provider.');
        return {url,init:{method:'POST',headers,body:JSON.stringify(body)}};
    }
    async function generate(options,onText=()=>{},transport=fetch) {
        const {url,init}=request(options,options.info);
        const response=await transport(url,{...init,signal:options.signal});
        if(!response.ok) {
            const data=await response.json().catch(()=>({}));
            throw Error(data.error?.message || 'Provider HTTP '+response.status);
        }
        let text='',finish=null,terminal=false;
        let usage={provider:options.provider,model:options.model};
        function reportUsage(data) {
            const raw=options.provider==='google'?data.usageMetadata:(data.usage||data.message?.usage);
            if(!raw)return;
            const fields=options.provider==='anthropic'?{cachedTokens:raw.cache_read_input_tokens,cacheWriteTokens:raw.cache_creation_input_tokens}:
                options.provider==='google'?{cachedTokens:raw.cachedContentTokenCount}:
                {cachedTokens:raw.prompt_tokens_details?.cached_tokens,cacheWriteTokens:raw.prompt_tokens_details?.cache_write_tokens};
            for(const [key,value] of Object.entries(fields)) if(Number.isFinite(value)&&value>=0) usage[key]=value;
            options.onUsage?.({...usage});
        }
        function consume(data) {
            if(data.error || data.type==='error') throw Error(data.error?.message || 'Provider stream error.');
            reportUsage(data);
            if(options.provider==='anthropic') {
                if(data.type==='content_block_delta'&&data.delta?.text) text+=data.delta.text;
                if(data.type==='message_delta'&&data.delta?.stop_reason) finish=data.delta.stop_reason;
                if(data.type==='message_stop') terminal=true;
            } else if(options.provider==='openai') {
                const choice=data.choices?.[0];
                if(choice?.delta?.refusal) throw Error('The model declined this request.');
                text+=choice?.delta?.content||'';
                if(choice?.finish_reason) finish=choice.finish_reason;
            } else {
                if(data.promptFeedback?.blockReason) throw Error('Provider blocked the request: '+data.promptFeedback.blockReason);
                const candidate=data.candidates?.[0];
                text+=(candidate?.content?.parts||[]).filter(p=>!p.thought).map(p=>p.text||'').join('');
                if(candidate?.finishReason) { finish=candidate.finishReason; terminal=true; }
            }
            onText(text);
        }
        if(options.stream===false) {
            const data=await response.json();
            if(options.provider!=='google')reportUsage(data);
            if(options.provider==='anthropic') { text=(data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join(''); finish=data.stop_reason; }
            else if(options.provider==='openai') { text=data.choices?.[0]?.message?.content||''; finish=data.choices?.[0]?.finish_reason; }
            else consume(data);
            terminal=true;
        } else await readEvents(response.body,raw=>{
            if(raw==='[DONE]') {terminal=true;return;}
            let data; try {data=JSON.parse(raw);} catch {throw Error('Malformed provider event.');}
            consume(data);
        });
        if(!terminal || !['end_turn','stop','STOP'].includes(finish)) throw Error('Response did not finish normally ('+(finish||'connection ended')+'). Retry or choose another model.');
        if(!text.trim()) throw Error('The provider returned no text.');
        return text;
    }
    root.NexusProviders={readEvents,request,generate};
    if(typeof module!=='undefined') module.exports=root.NexusProviders;
})(globalThis);
