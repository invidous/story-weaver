// Official model catalogs checked 2026-10-30. Account access is provider-specific.
// Sources and compatibility decisions: docs/models.md. Credentials remain in existing browser settings.
const MODEL_CATALOG = {
    anthropic:{default:'claude-sonnet-5-5',summary:{deep:'claude-opus-5-5',quick:'claude-haiku-5-5'},models:[
        // Claude 5.x thinking is on by default and counts toward max_tokens; their tokenizer averages ~2.5 characters per token.
        {id:'claude-sonnet-5-5',label:'Claude Sonnet 5.5 — balanced ($2 in / $10 out per 1M)',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-opus-5-5',label:'Claude Opus 5.5 — premium ($4 in / $20 out per 1M)',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-fable-5-1',label:'Claude Fable 5.1 — top tier ($10 in / $50 out per 1M)',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-haiku-5-5',label:'Claude Haiku 5.5 — fast ($0.10 in / $0.50 out per 1M; $0.50 / $2.50 above 100K-token prompts)',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-opus-5',label:'Claude Opus 5 — older selection',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-sonnet-5',label:'Claude Sonnet 5 — older selection',sampling:false,minOutputTokens:32768,charsPerToken:2.5},
        {id:'claude-haiku-4-5-20251001',label:'Claude Haiku 4.5 — older selection',sampling:true}
    ]},
    google:{default:'gemini-3.8-flash',summary:{deep:'gemini-3.1-pro-preview',quick:'gemini-3.5-flash-lite'},models:[
        {id:'gemini-3.8-flash',label:'Gemini 3.8 Flash — current stable ($0.75 in / $3.75 out per 1M through Dec 31, 2026)',sampling:true},
        // Argon ignores temperature and spends part of its output limit on thinking; Google advises at least 32K.
        {id:'gemini-4-argon',label:'Gemini 4 Argon — flagship reasoning ($2 in / $10 out per 1M through Nov 30, 2026; then $4 / $20)',sampling:false,minOutputTokens:32768},
        {id:'gemini-3.6-flash',label:'Gemini 3.6 Flash — previous generation',sampling:true},
        {id:'gemini-3.5-flash-lite',label:'Gemini 3.5 Flash-Lite — fast',sampling:true},
        {id:'gemini-3.1-pro-preview',label:'Gemini 3.1 Pro — preview ($2 in / $12 out per 1M)',sampling:true},
        {id:'gemini-3.1-flash-lite',label:'Gemini 3.1 Flash-Lite — shuts down May 7, 2027',sampling:true},
        {id:'gemini-2.5-pro',label:'Gemini 2.5 Pro — existing users only',sampling:true},
        {id:'gemini-2.5-flash',label:'Gemini 2.5 Flash — existing users only',sampling:true}
    ]},
    openai:{default:'gpt-6.1-sol',summary:{deep:'gpt-6.1-sol',quick:'gpt-6-luna'},models:[
        {id:'gpt-6.1-sol',label:'GPT-6.1 Sol — balanced ($2 in / $10 out per 1M)',sampling:false,reasoning:'low'},
        {id:'gpt-6.1-terra',label:'GPT-6.1 Terra — efficient ($1 in / $5 out per 1M below 272K-token prompts)',sampling:false,reasoning:'low'},
        {id:'gpt-6-luna',label:'GPT-6 Luna — budget ($0.10 in / $0.50 out per 1M)',sampling:false,reasoning:'low',calibration:'luna'},
        {id:'gpt-6-astra',label:'GPT-6 Astra — flagship, deep reasoning ($10 in / $50 out per 1M)',sampling:false,reasoning:'low'},
        {id:'gpt-5.6-sol',label:'GPT-5.6 Sol',sampling:false},
        {id:'gpt-5.6-luna',label:'GPT-5.6 Luna — fast reasoning',sampling:false,calibration:'luna'},
        {id:'chat-latest',label:'Chat Latest — current ChatGPT Instant, rolling alias ($5 in / $30 out per 1M)',sampling:false},
        {id:'gpt-5.5',label:'GPT-5.5 — previous generation',sampling:false},
        {id:'gpt-5.4-mini',label:'GPT-5.4 Mini — economical',sampling:false}
    ]}
};
// Saved IDs the provider now reroutes go to its named replacement, not the generic default.
const MODEL_REPLACEMENTS = {google:{'gemini-3.7-flash':'gemini-3.8-flash','gemini-3.5-flash':'gemini-3.6-flash'}};
function modelInfo(provider,id) { return MODEL_CATALOG[provider]?.models.find(m=>m.id===id)||null; }
function getProvider() { const p=localStorage.getItem('nexus_provider'); return MODEL_CATALOG[p]?p:'anthropic'; }
function savedModel(provider) { return localStorage.getItem('nexus_model_'+provider)||localStorage.getItem('nexus_model'); }
function resolveModel(provider,saved=savedModel(provider)) {
    if(modelInfo(provider,saved)) return saved;
    return MODEL_REPLACEMENTS[provider]?.[saved]||MODEL_CATALOG[provider].default;
}
function getModel() { return resolveModel(getProvider()); }
// Sent with every narrative request so the framework's Luna-only calibration [LUNA-BEATS] follows the active model.
function hostModelNote(provider,model) {
    const info=modelInfo(provider,model),name=info?info.label.split(' — ')[0]:model;
    return 'HOST MODEL CONTEXT\nActive model: '+model+' ('+name+'). '+(info?.calibration==='luna'
        ?'The host identifies this model as Luna, so LUNA CALIBRATION [LUNA-BEATS], including 6A, applies unless the player has turned Luna calibration off.'
        :'This model is not Luna, so LUNA CALIBRATION [LUNA-BEATS] does not apply, whatever earlier turns or preferences say; use the default pacing and prose rules.');
}
function renderModelOptions(provider) {
    const select=document.getElementById('model-select'); select.replaceChildren();
    for(const m of MODEL_CATALOG[provider].models) select.add(new Option(m.label,m.id));
    const saved=savedModel(provider),replacement=MODEL_REPLACEMENTS[provider]?.[saved];
    select.value=resolveModel(provider,saved);
    document.getElementById('model-note').textContent=(replacement?'Your saved model '+saved+' is now served by '+replacement+', which is selected. Save to keep it. ':
        saved&&!modelInfo(provider,saved)?'Previous model is not in the current catalog. The displayed model will be used; choose another if preferred. ':'')+
        'Catalog checked October 30, 2026. Saved choices are retained. Prices shown are standard uncached text rates, before reasoning tokens or long-context premiums. Availability depends on your API account.';
}
if(typeof module!=='undefined') module.exports=MODEL_CATALOG;
