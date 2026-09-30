# Model catalog policy

## September 29, 2026 refresh

The current menu adds Claude Sonnet 5.5 (`claude-sonnet-5-5`), Claude Opus 5.5 (`claude-opus-5-5`), GPT-6.1 Sol (`gpt-6.1-sol`), GPT-6 Luna (`gpt-6-luna`), and the missing Gemini 3.6 Flash fallback. Gemini 3.8 Flash remains Google's current general text default. Gemini 2.5 entries are marked for existing users only, per Google's access notice. Older saved choices remain selectable; the update does not overwrite browser settings or keys.

Fresh/default selections: Sonnet 5.5 for Anthropic, GPT-6.1 Sol for OpenAI, Gemini 3.8 Flash for Google. Existing saved selections take precedence. Archive Deep now uses Opus 5.5 or GPT-6.1 Sol; OpenAI Quick uses GPT-6 Luna. Google's archive models and Anthropic Quick remain unchanged.

The new OpenAI choices use low reasoning and omit sampling controls through the existing Chat Completions adapter. Both support this app's text-only use of that endpoint. Sonnet 5.5 omits temperature because non-default sampling is rejected. No live provider requests were made for this refresh; account availability and prose quality are not established by the offline checks.

### Storytelling and cost

Start by auditioning Sonnet 5.5 for quality-first storytelling and GPT-6 Luna for a strict budget; Gemini 3.8 Flash is a middle-cost candidate. GPT-6.1 Sol is another candidate at Sonnet's base token price. This is a selection hypothesis, not a measured ranking of fiction quality. Compare the same campaign branch and a few ordinary, tense, and emotionally nuanced scenes; check distinct voices, agency, continuity, and caricature, not just elegant prose.

Standard uncached text rates per million tokens, checked September 29:

| Model | Input | Output | Illustration: 77K input + 1K output |
| --- | ---: | ---: | ---: |
| Claude Sonnet 5.5 | $2 | $10 | $0.164 |
| GPT-6.1 Sol | $2 | $10 | $0.164 |
| Gemini 3.8 Flash | $0.75 | $3.75 | $0.0615 |
| GPT-6 Luna | $0.10 | $0.50 | $0.0082 |

Illustrations exclude caching, cache-write charges, extra reasoning tokens, taxes, and other services; the app's character-based estimate is not a provider token count. Gemini's quoted introductory pricing expires December 31, 2026. Archive & Trim reduces history, but the full framework still goes into every narrative request. The client does not explicitly request Anthropic prompt caching; cached discounts should not be assumed in budget estimates.

Official sources: [Claude models and rates](https://platform.claude.com/docs/en/models/overview), [Sonnet 5.5 compatibility](https://platform.claude.com/docs/en/models/sonnet-5-5/overview), [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [OpenAI pricing](https://developers.openai.com/api/docs/pricing), [Google model catalog](https://ai.google.dev/gemini-api/docs/models), [Gemini 3.8 announcement and introductory pricing](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/).

## Archived September 6 catalog notes

The catalog in `js/models.js` was checked on 2026-09-06 against provider documentation. Model access and retirement are account/provider dependent; the picker keeps older choices as fallbacks and migrates an unknown saved ID to the provider default.

- Anthropic: `claude-fable-5-1`, `claude-opus-5`, `claude-sonnet-5`, `claude-haiku-4-5-20251001`. Current Sonnet 5 rejects non-default sampling parameters, so the client omits temperature for that model.
- Google: `gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, and 2.5 fallbacks.
- OpenAI: `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-luna`, `chat-latest`, `gpt-5.5`, and `gpt-5.4-mini`. GPT-6 Astra requires unsupported sampling parameters such as temperature to be omitted; this client continues to use Chat Completions for text generation.

The official references used for this release are [OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model), [Claude models overview](https://platform.claude.com/docs/en/models/overview), [Claude Sonnet 5 details](https://platform.claude.com/docs/en/models/sonnet-5/overview), and [Google Gemini models](https://ai.google.dev/gemini-api/docs/models).

This is a small browser application. If a provider rejects a model because it is unavailable to your account, choose another catalog entry in Settings; existing browser keys are unchanged by model migration.
