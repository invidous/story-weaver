# Prompt caching — September 29, 2026

The full framework remains first in the prompt. Only its exact unchanged text receives an explicit cache boundary; the current sheet, continuity records, reference documents, turn instructions, and conversation follow it without being shortened or omitted. Caching does not reduce the context window needed or replace Archive & Trim.

- Claude: an explicit framework block uses a one-hour cache by default. Settings offers five minutes or Off. One-hour writes cost twice ordinary input; five-minute writes cost 1.25 times. For Sonnet 5.5, reads cost one tenth of ordinary input. A one-hour write plus two full hits costs 2.2 normal framework reads, versus 3 without caching. Isolated turns or expired caches can cost more. Lifetime runs from request start, and hits refresh it.
- OpenAI GPT-5.6 and GPT-6 catalog models: explicit framework boundary, explicit-only mode, 30-minute lifetime. This avoids cache-write charges on the changing suffix. Older models and the unversioned chat alias retain provider automatic caching. No unsupported retention fields are added to older models.
- Gemini: retains automatic implicit caching, with the stable framework first. Hits are not guaranteed. This update does not create separately billed explicit cache storage.

Below the composer, the latest story request reports provider-returned cached input tokens and cache writes when available. Missing usage is shown as unreported, not a fabricated zero. Counts are for the named request/model, not a campaign total or a bill. A first Claude request commonly reports writes and zero reads; later turns with the same framework/model may report reads. Changing models/frameworks or waiting beyond retention may require another write. Output tokens still incur normal output charges.

Existing keys, saves, and selected models remain in the browser. No paid API calls are needed to install this update. Archive requests retain their separate continuity-editor prompt and do not receive the narrative framework marker.

Upload `index.html` to the repository root and `app.js`, `ui.js`, `providers.js`, and `models.js` into `js/`. The package includes the latest model menu. Keep existing `core.js`, `store.js`, `framework.txt`, and `nexus.html`. Updated script URLs prevent reuse of stale JavaScript after deployment. Reload the page after GitHub Pages finishes deploying. The Claude framework cache selector and the cache-usage line identify this build.

Sources checked:

- [Claude prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)
- [OpenAI Chat Completions request schema](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)
- [Gemini Generate Content caching](https://ai.google.dev/gemini-api/docs/generate-content/caching)
