# The Nexus

**Version 3.6 — Continuity Edition**

A browser-based AI Game Master for genre-flexible, consequence-driven adventures with Claude, OpenAI, and Gemini.

[Open The Nexus](https://invidous.github.io/story-weaver/)

## Start playing

1. Open the site and wait for **Nexus 3.6 ready**.
2. Open **Settings**, choose a provider and model, and enter that provider's API key.
3. Type **Begin**, or open **Sessions** to import a campaign.

Provider API access and billing are separate from consumer chat subscriptions. Model availability depends on your provider account; see the [catalog notes](docs/models.md).

Keys remain in browser local storage and are sent to the selected provider for requests. Campaign exports exclude keys. Campaigns and drafts save in IndexedDB, without automatic synchronization between devices, browsers, or site addresses. Use **Download** for portable backups before clearing browser data.

## What's new in 3.6

- One responsive desktop/mobile client; `nexus.html` redirects to `index.html`.
- Buffered streaming preserves fragmented text and reports abnormal endings. **Stop** remains available.
- Autosaved campaigns and drafts, versioned saves, legacy import, recovery checkpoints, and branches.
- Sourced continuity records distinguish player knowledge from GM-only information and retain history.
- **Archive & Trim** offers a complete turn boundary and summary preview before applying; Recovery retains the original transcript.
- **Campaign Desk** shows known records, records rolls with intent and stakes, and accepts OOC canon corrections.
- Updated model catalog preserves existing keys and settings.
- Startup diagnostics identify missing scripts; optional browser UUID/fingerprint APIs no longer block startup.

Existing world states, progression, narrative architecture, knowledge and mystery systems, and player agency boundaries remain present.

## Storytelling revisions

Characters develop through choices, relationships, and different circumstances. Needing help does not imply helplessness; authority does not imply contempt; enthusiasm does not imply sidekick status. Cast audits examine enacted behavior, especially stereotyped portrayals of women, rather than decorative biography.

Natural, appreciative physical description is available for adults of every gender, including breasts and other appealing features. Context, pacing, and player preferences guide attention; description needs no plot payoff or romantic milestone. The player retains control of their character's attraction, feelings, and actions.

Attraction may be direct or reserved. Familiarity need not expose a hidden wound or softer “true self.” Bodily reactions and sensory carryover are possibilities, not mandatory beats. Generosity does not automatically create debt. Failed social reads preserve uncertain evidence rather than prescribing a false belief.

These instructions guide models; consistent storytelling quality still needs live playtesting.

## Publish with GitHub Pages

**Publish the entire client, including the `js` folder. HTML alone displays the page but leaves its buttons unresponsive.**

Required layout:

```text
index.html
nexus.html
framework.txt
js/
  core.js
  models.js
  providers.js
  store.js
  ui.js
  app.js
```

For GitHub's web uploader, extract the release ZIP and drag its contents into the repository root, preserving `js/`. Do not upload the ZIP itself or nest everything in an extra folder. Commit to the branch/folder configured for Pages. After deployment finishes, press **Ctrl+F5**.

If startup stays at **Loading…**, check the site's `js/core.js` address. A 404 means the deployment is incomplete. The repaired client reports script failures visibly. Clearing browser data cannot repair missing site files.

## Run locally

With Node.js and npm installed:

```sh
npm install
npm start
```

Open `http://127.0.0.1:8080/`. The server binds to this computer's loopback address. Use HTTP: opening HTML through `file://` prevents the normal framework fetch.

PDF.js and fonts load from external CDNs. Provider requests need network access.

## Development and checks

```sh
npm test
npm run test:browser
npm run framework:check
```

Browser tests use Microsoft Edge through Playwright with mocked provider responses; they do not spend API credits or validate live model availability.

- `framework.txt`: self-contained gameplay and prose rules, fetched at startup.
- `rules/cadence.json`: cadence registry; run `npm run framework:build` after changing it.
- `js/`: shared campaign, storage, provider, model, and UI code.
- `scripts/`: local server and cadence generator.
- `tests/`: unit/browser checks and qualitative narrative scenarios.

Reload to use framework edits. Campaign exports record framework metadata; supported browser contexts also record a fingerprint.

## Previous versions

The [archived v3.5 README](docs/README-v3.5.md) preserves earlier feature history and instructions. It is historical documentation; use the current setup above. Prior source versions remain in Git history, with additional pre-edit archives retained in the local development repository.

## License and credits

MIT License — use freely and modify as needed.

Built for immersive AI storytelling with Anthropic, OpenAI, and Google language models.
