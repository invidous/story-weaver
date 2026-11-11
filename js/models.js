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
        {id:'gpt-6.1-sol',label:'GPT-6.1 Sol — balanced ($2 in / $10 out per 1M)',sampling:false,reasoning:'medium',minOutputTokens:32768,calibration:'develop'},
        {id:'gpt-6.1-terra',label:'GPT-6.1 Terra — efficient ($1 in / $5 out per 1M below 272K-token prompts)',sampling:false,reasoning:'low'},
        {id:'gpt-6-luna',label:'GPT-6 Luna — budget ($0.10 in / $0.50 out per 1M)',sampling:false,reasoning:'low',calibration:'develop'},
        {id:'gpt-6-astra',label:'GPT-6 Astra — flagship, deep reasoning ($10 in / $50 out per 1M)',sampling:false,reasoning:'low'},
        {id:'gpt-5.6-sol',label:'GPT-5.6 Sol',sampling:false},
        {id:'gpt-5.6-luna',label:'GPT-5.6 Luna — fast reasoning',sampling:false,calibration:'develop'},
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
// A short, campaign-neutral sample of the target narrator voice, sent only to host-marked models.
// It deliberately avoids any campaign's names, history, or Facets, and the framework's banned vocabulary.
const VOICE_EXEMPLAR=`VOICE EXEMPLAR (narrator stance and craft only; never reuse its names, images, or phrasing. Adapt register to the active world state and prose target. Find each scene's own governing idea.)

The Ministry does not govern the city so much as digest it.

Rain works at the tall windows of the Tribunal Hall and finds every seam the architects paid to hide. Tiered benches climb toward the dais; the lowest hold the clerks, who write nothing down, because the verdicts were typed before the hearing was called. Wet wool, scrubbed floors, the sweet rot of lamp oil burned by people who can afford to waste it.

Four winters since the strike. Four winters of ration lines and sealed doors. The Magistrates remember every one, and mean to be remembered for none of them.

Magistrate Oren leans back until his chair complains. "A petitioner from the harbor wards," he says, to the benches rather than to you. "They arrive quoting the charter and leave quoting the sentence."

Laughter, brief and well trained.

Beside him, Magistrate Vael does not laugh. She is slight, silver-haired, immaculately kind. "Let the petitioner speak, Oren. Not all of us have had your thirty years to practice sounding certain. And do be gentle. The poor have so little practice at being heard." She smiles at the room, then at you, the way a surgeon smiles at a patient who has been told it will not hurt.

Somewhere above the dais a ventilator stutters and recovers. Nobody looks at it. Nobody in this hall looks at anything that might be fixed.

The floor is yours.`;
// Sent with every narrative request. Meaningful-beats pacing applies to every model; section 6A and the voice exemplar apply only to marked models.
function hostModelNote(provider,model) {
    const info=modelInfo(provider,model),name=info?info.label.split(' — ')[0]:model,marked=info?.calibration==='develop';
    return 'HOST MODEL CONTEXT\nActive model: '+model+' ('+name+'). '+(marked
        ?'Section 6A of PACING AND PLAYER AGENCY: MEANINGFUL BEATS applies to this model.\n\n'+VOICE_EXEMPLAR
        :'Section 6A of PACING AND PLAYER AGENCY: MEANINGFUL BEATS (host-marked models only) does not apply to this model, whatever earlier turns say.');
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
