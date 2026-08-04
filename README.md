# The Nexus

**Version 3.4** — Compiled Edition. An immersive RPG engine powered by AI — your Game Master for genre-flexible, consequence-driven adventures across Claude, ChatGPT, and Gemini.

## What's New in 3.4

### The Agency Gate (Priority 0)
- **Final Gate**: PLAYER AGENCY restated as an enforceable pre-output check at the end of the document, where it is read last before generation — it overrides every other section, including prose calibration and scene tension
- **One-Action Ceiling**: At most one PC action per response, and only one the player explicitly stated
- **The Negation Trap**: "You don't linger / you do not raise a hand" named as a violation class — writing what the PC declines is writing what the PC does
- **The Interiority Line**: Senses may receive; the mind may not conclude. Sensory input is permitted, interpretation and verdict are not
- **PC Memory Is Player Property**: Canon backstory goes into the world as a trigger, never narrated as the PC recalling it
- **Pre-Output Gate**: A four-question scan run on every response, no scene types exempt

### Machinery Containment
- **Banned Machinery Leak**: The framework's own vocabulary — tension axis labels, engine and amendment names, structural and mechanical terms — is barred from narration and dialogue
- **Craft Vocabulary Ban**: Prose-calibration anchors instruct the Nexus and are not facts about the world; no author, genre, or stylistic mode may be named inside the fiction
- **The Audibility Test**: If a sentence only parses to someone holding the framework, it gets cut
- **Header Carve-Out**: `[NEXUS SYSTEM]` blocks and Export State remain the designated out-of-world channel and *should* name axes, clocks, and DCs precisely

### Difficulty Band Repair
- **Full Fixed Scale**: Trivial (5), Easy (10), Moderate (15), Hard (20), Formidable (25), Legendary (30) — replaces the previous three-label scale that left most Legend-tier checks unnamed
- **Inheritance Rule**: Intermediate DCs take the band at or below them (DC 17 is Moderate, DC 22 is Hard)
- **No Relabeling for Drama**: The label follows the number, never the tension of the moment

### Amendments 2.0–2.10
- **The Repertory Principle**: Cast economy — richness accrues through recurrence, not novelty
- **Reputation Distortion Engine**: The world reacts to the story told, not the fact
- **Faction Clocks**: Organizations as NPCs at scale, with inheritor ranking
- **Motif Registry**: Image systems that repeat on purpose
- **Planted Gun Registry**: Foreshadowing audit with payoff horizons
- **Location Arcs**: Places age and wear as cast members
- **Interlude Protocol**: Sanctioned dramatic irony — opt-in NPC-perspective scenes
- **Diegetic Recap**: Re-immersion over re-information
- **Living Speech Lexicon**: Curses, blessings, and idiom per culture
- **The World's Clock**: Continuity of sky — hour, weather, season
- **Series Finale Protocol**: Endless by default, endable by player invocation only

### Compilation
- Fully self-contained — sections formerly carried by reference from v3.0 are now inlined
- Sections marked `[RESTORED]` (original pre-3.0 wording) or `[RECONSTRUCTED]` (rebuilt from internal evidence)
- Deduplication and cross-reference repairs throughout

## What Was New in 3.2

### Narrative Scope System
- **Narrative Scope per Tier**: Each tier defines scope boundaries (Personal→Local, Local→Regional, Regional→Galactic, Galactic→Mythic)
- **Narrative Scope Enforcement**: Mandatory rules prevent scope creep — not every story saves the galaxy
- **The Authority Figure Problem**: When PC defers to seniors, they actually handle it (no fake agency)
- **Scope Escalation Rules**: Scope only expands after characters earn story arcs at current level
- **When the PC Defers**: 4-step protocol honoring chain of command and NPC autonomy
- **Scope Violation Red Flag**: Added to railroading safeguards — watch for artificial scope inflation

### PC Aspiration & Specialization
- **Aspiration Trajectory**: Long-term goal tracking with milestone markers (separate from immediate arcs)
- **Arc-Milestone Alignment**: Every arc connects meaningfully to the character's aspiration
- **Milestone Check**: Progress verification every 2-3 arcs keeps aspiration relevant
- **Organic Specialization Recognition**: World notices PC's demonstrated aptitudes and proactively offers advancement tracks
- **Pattern Tracking**: Silent aptitude monitoring (3-5 instances threshold) — specialization emerges from play, not character sheet

### Storytelling Refinements
- **Observational Appraisal**: Full physical description tier added — triggered when PC actively looks at someone
- **Complication Type Rotation**: 7 categories (positional, environmental, resource, social, temporal, informational, physical) — no defaulting to injury
- **Anti-Spiral Rule**: Max one injury per encounter from complications (prevents injury stacking)
- **Tier-Scaled Injury Severity**: Tier 1 gets bruises/cuts, not torn muscles or broken bones
- **Fail-Margin Injury Scaling**: Fail by 1-4 is a nick, Fail by 10+ is catastrophic
- **Injury Description Calibration**: Use full spectrum of injury language appropriate to severity
- **Meta-Language Bleed**: New railroading red flag — no game mechanics exposed in dialogue (no "roll for this")
- **Setup Phase Meta-Language Rule**: Framework terms (DC, Pressure, Tension Axis) allowed in menus only, forbidden in narrative
- **Context Integrity Protocol**: Anti-drift safeguard for long sessions — Hard Canon Lock, NPC Continuity, Offer/Promise Tracking

### Technical & Dependency Updates
- **Claude Opus 4.7** added to model list
- **Summary token limit doubled**: 4096 → 8192 (deeper continuity preservation)
- **JSON archive loading**: Reference documents now support `.json` files in addition to `.txt`, `.md`, `.pdf`
- **Character Sheet viewer/editor**: Button (📋) in web UI for real-time sheet editing
- **Mobile save fix**: Web Share API with MIME cycling for reliable mobile saves
- **Google AI migration**: `pip install google-genai` (was `google-generativeai`)

## What Was New in 3.1

### Dialogue Overhaul
- **Advance the Ball Directive**: NPCs must escalate, pivot, concede, or misdirect — never re-litigate
- **The Silent Turn**: NPCs with nothing new to add use physical beats instead of filler dialogue
- **Scene Disruption Protocol**: Mundane intrusions break conversational loops organically

### Combat & Action Rework
- **Threat Vector Pause**: Incoming attacks described and STOPPED — player decides response
- **Combat Environment Mandate**: 1-2 tactical environmental elements per fight, battlefield degrades with missed strikes
- **Anatomical Consequence**: Injuries degrade specific capabilities (no abstract HP)
- **Complication Engine**: Narrow success/failure margins always produce tactical trade-offs

### NPC Autonomy Expansion
- **Agenda Clocks**: Significant NPCs pursue tracked off-screen goals that advance during time skips
- **Missed Connection**: PC encounters aftermath of NPC actions (resources already taken, safehouses already compromised)
- **Unprompted Intercept**: NPCs interrupt when their clock completes or tension axis tips

### Conditioned Response Upgrades
- **Threshold Carryover**: Physical friction of previous scene persists into new environments
- **Ghost Sensations**: 1-3 scene micro-flashbacks from mundane stimuli post-priming

### Arc & Pacing Improvements
- **The Season Premiere**: New arcs get hard cut cold opens, not smooth transitions
- **Arc Escalation Directive**: Dramatic questions must shift axes between arcs (physical → social → moral)
- **Resolution Rupture**: Arc endings set Pressure Gauge to Rupture/Collapsed — next arc begins in friction

### Intimacy & Trauma Refinements
- **The Invisible Ledger**: Bond/Trauma updates noted via system log, not immersion-breaking announcements
- **Cool-Down Mandate**: 1-3 scene buffer after Tier 3/4 intimacy or trauma events
- **Sensory Triggers (Scar Tissue)**: Registered sensory inputs per trauma, fed through Conditioned Response Engine
- **Intimacy Bleed**: Bond history surfaces as subtext during conflict with bonded NPCs

### Nomenclature Hardening
- **"Cheap Alien" Prohibition**: No gratuitous apostrophes, edgy starting consonants, or double vowels
- **Linguistic Blend Mandate**: Names blend two cultural anchors, not one
- **Occupational Drift**: Name length/formality reflects world state (Frontier shortens, Gilded expands)

### Prose Calibration Updates
- **Stylistic Primer**: Internal alignment step before every response prevents style drift
- **Lexical Bounty**: World State vocabulary profile actively incorporated (Anglo-Saxon for Dystopian, brand-adjacent for Gilded, etc.)

### World State Engine Expansion
- Every world state now defines **Information** (how truth works), **Currency** (what holds value), **Justice** (how disruption is punished), and **Mobility** (barriers to movement)

### New Commands
- **"Nexus, Export State"**: Outputs dense technical summary (PC, NPCs, world state, threads, cold open seed) for pasting into a fresh session

### OpenAI Integration
- Full ChatGPT API support across all three interfaces (desktop, web, mobile)
- GPT-5.2, GPT-5.2 Instant, GPT-5 Mini, GPT-4o, GPT-4o Mini

## What Was New in 3.0

### Origin Arc System
- **4 Character Tiers**: Origin, Journeyman, Veteran, Legend — each with distinct skill budgets, entry styles, and gameplay feel
- **Origin Arc**: A guided 3-8 scene prologue for new characters that builds who they are before the main story
- **Cold Open** preserved for experienced characters (Tier 3-4 mandatory, Tier 2 optional)
- **Tier-adjusted difficulty**: DCs, skill caps, and advancement rates scale to character experience
- **Legacy Complications**: Tier 4 (Legend) characters carry narrative weight — debts, enemies, promises

### Narrative Architecture Engine
- **Story Spine Tracking**: Every scene connects through status quo → disruption → choice → new status quo
- **Dramatic Question Engine**: Each arc has a core question shaping choices, NPC behavior, and resolution
- **Thematic Thread Registration**: Emergent themes woven into environment, dialogue, and choice framing
- **Scene Tension Curve**: Every scene must move — entry tension ≠ exit tension
- **Breath Protocol**: Mandated quiet beats after 2-3 high-tension scenes
- **Contrast Pulse**: Strategic prose style breaks every 5-7 responses for human-feeling narration

### NPC Arc Engine
- **Tension Axis**: NPCs have internal conflicts that shift based on PC actions
- **Progressive Revelation**: Secrets discovered through play, not exposition
- **Dialogue Fingerprinting**: NPCs identifiable by voice alone

### Enhanced Continuity (Archive & Trim v2)
- **Rolling Summary**: Character sheets consolidated into one coherent document (not stacked appendages)
- **Causal Chain**: Tracks *why* things are the way they are, not just what
- **Campaign Chronicle**: Append-only timeline persisting across all archives
- **Smart Trim**: Finds natural scene breaks near your requested trim point
- **Bridge Context**: Auto-generated "Previously..." message connecting archive to remaining conversation
- **Summary Quality Choice**: Quick (Haiku) or Deep (Sonnet) summary generation
- **Reference Doc Awareness**: Summary generation knows which game rules/playbooks are in play

## Features

### Core System
- **Nexus Framework v3.4**: Complete RPG system with tiered character creation, narrative scope enforcement, aspiration tracking, organic specialization, and refined storytelling mechanics
- **13 World States**: Dystopian, Utopian, Frontier, Balanced, Chaos, Decadent, Occupied, Gilded, Liminal, Enclave, Noir, Dying, Mythic — each with Information, Currency, Justice, and Mobility profiles
- **Dynamic State Shifts**: World states blend, shift, and rupture based on your actions
- **Player Agency Protection**: Multiple redundant safeguards prevent AI from narrating your character's actions, terminating in a Priority 0 pre-output gate that overrides every other rule in the framework
- **Conditioned Response Engine**: NPCs react based on accumulated emotional/physical context, not just immediate stimulus

### Technical Features
- **📚 Reference Documents**: Upload playbooks, rules, maps (supports `.txt`, `.md`, `.pdf`, `.json`)
- **Prose Calibration Engine**: Fine-tune writing style with author references and density controls
- **Character Sheet Continuity**: Persistent tracking with rolling summary consolidation
- **Character Sheet Editor**: Real-time editing via 📋 button in web UI
- **Save/Load Sessions**: Pick up any campaign where you left off
- **Model Selection**: Claude Opus 5, Sonnet 5, Opus 4.8, Opus 4.7, Sonnet 4.6, Haiku 4.5
- **Multi-Provider Support**: Anthropic Claude, Google Gemini (up to 3.1 Pro), and OpenAI (GPT-5.2, GPT-5 Mini, GPT-4o)
- **Temperature Control**: Dial creativity up for wild sessions, down for consistency
- **Mobile Server**: Play on your phone while running locally on desktop
- **Dark UI**: Easy on the eyes for marathon sessions

## Quick Start

### 1. Install dependencies

```bash
pip install customtkinter anthropic PyPDF2 --break-system-packages

# Optional: for Google AI support
pip install google-genai --break-system-packages

# Optional: for OpenAI support
pip install openai --break-system-packages
```

### 2. Set your API key

```bash
# Linux/Mac: add to ~/.bashrc or ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Optional: for Google AI
export GOOGLE_API_KEY="your-google-key-here"

# Optional: for OpenAI
export OPENAI_API_KEY="sk-your-key-here"

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Or just run the app — it'll prompt you for the key on first message.

### 3. Run

```bash
python storyteller.py
```

### 4. Begin

Type `Begin` to start a new session. The Nexus will guide you through:
1. World State selection (13 options with blending support)
2. Genre selection (Cyberpunk, Fantasy, Sci-Fi, etc.)
3. Optional prose style calibration
4. **Character Tier selection** (Origin, Journeyman, Veteran, Legend)
5. Character creation with tier-appropriate skill point distribution
6. **Origin Arc** (Tier 1-2) or **Cold Open** (Tier 2-4) — your story begins

## Character Tiers

| Tier | Name | Skill Budget | Skill Range | Entry Style | Scope | Example |
|------|------|-------------|-------------|-------------|-------|---------|
| 1 | **Origin** | 15 points | -2 to +5 | Origin Arc (default) | Personal | Farm boy, raw recruit, untrained Force-sensitive |
| 2 | **Journeyman** | 27 points | -2 to +7 | Origin Arc or Cold Open | Local | Padawan, seasoned merc, junior detective |
| 3 | **Veteran** | 36 points | -2 to +9 | Cold Open (mandatory) | Regional | Jedi Knight, master thief, spec-ops |
| 4 | **Legend** | 45 points | -2 to +9 | Cold Open + Legacy Complication | Galactic | Jedi Master, Sith Lord, galactic crime boss |

### Tier-Adjusted Gameplay
- **Difficulty**: DCs scale with tier (Tier 1: Easy–Moderate 10-15, Tier 4: Hard–Formidable 18-25, with Legendary 30 reserved for arc-defining feats). Band labels are fixed to numbers and never shift to raise stakes
- **Advancement**: Origin Arc characters level faster; Legends grow in depth, not numbers
- **Skill Caps**: Tier 1 caps at +5 during Origin, rising to +7 after. Tier 3-4 cap at +9
- **Narrative Scope**: Each tier operates at a specific scope level; scope expansion requires earned story progression

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Send message |
| `Ctrl+S` | Save session |
| `Ctrl+O` | Load session |
| `Ctrl+N` | New session |

## Archive & Trim (v2)

The enhanced Archive & Trim system maintains continuity across long campaigns:

### Rolling Summary
Instead of stacking session summaries, the system generates a **single consolidated character sheet** that merges new content with existing data. Outdated information is updated, not preserved.

### Smart Trim
Instead of cutting at an arbitrary message count, the system finds a **natural scene break** near your requested trim point — scene transitions, choice prompts, or time skips.

### Bridge Context
After trimming, a **"Previously..."** message is generated to connect the archived content to the remaining conversation.

### Summary Quality
Choose between:
- **Quick** (Haiku): Fast, cheaper — good for routine trims
- **Deep** (Sonnet): Better continuity preservation — recommended for complex campaigns

### Summary Depth
- **Token limit**: 8192 (doubled from 4096) for deeper preservation of narrative texture

### Character Sheet Format
The consolidated sheet includes:
1. **Narrative Lens** — Voice, tension, pacing, thematic threads, dramatic questions
2. **Technical Continuity** — Hard facts, tier, skills, NPCs, inventory
3. **Sensory Snapshot** — Where the scene was cut, physical details
4. **Active Micro-Dynamics** — NPC internal states, tension axes, secrets, dialogue fingerprints
5. **Golden Moments** — Prose style anchors from the session
6. **Causal Chain** — How decisions led to current state
7. **Open Loops** — Immediate, short-term, and long-game threads
8. **Campaign Chronicle** — Append-only timeline of major events
9. **Aspiration & Specialization** — Character's long-term goals and recognized aptitudes

## In-Game Commands

- **"Veil this"** — Pull back from explicit content
- **"Nexus, Pause"** — Halt the scene entirely
- **"Rewind"** — Reset to before a failed choice
- **"Nexus, Export State"** — Output dense technical summary for pasting into a new session
- **"Nexus, show naming convention"** — See current cultural naming rules
- **"Nexus, adjust prose: [style]"** — Change writing style mid-session
- **"Read the room"** — Get current state analysis
- **"What would shift this?"** — Query world state destabilization triggers

## Model Recommendations

### Anthropic (Claude)

| Model | Best For | Context | $/M in | $/M out |
|-------|----------|--------:|-------:|--------:|
| **Opus 5** | Maximum instruction adherence — the framework's rule hierarchy applied reliably under pressure | 1M | $5.00 | $25.00 |
| **Sonnet 5** | **Recommended default.** Near-Opus adherence at Sonnet pricing | 1M | $3.00 | $15.00 |
| **Opus 4.8** | Previous-generation Opus, strong long-horizon coherence | 1M | $5.00 | $25.00 |
| **Opus 4.7** | Older Opus; adaptive thinking, high-resolution vision | 1M | $5.00 | $25.00 |
| **Sonnet 4.6** | Older Sonnet, solid all-around | 1M | $3.00 | $15.00 |
| **Haiku 4.5** | Summary generation and side tasks only — **not** for running the Nexus (see below) | 200K | $1.00 | $5.00 |

**On Haiku 4.5:** it has a 200K context window and does not support the `effort` parameter. With the framework (~54K tokens) plus reference documents and a growing transcript, a real campaign session exceeds its window outright, and long-context selective rule adherence is the axis where the tier gap is widest. Use it for Quick summaries and side tasks; run the Nexus on Sonnet 5 or better.

### OpenAI (ChatGPT)

| Model | Best For | Cost* |
|-------|----------|------|
| **GPT-5.2** | Thinking/reasoning model, deep narrative, complex problem-solving | ~$0.013/exchange |
| **GPT-5.2 Instant** | **Recommended default.** Fast, capable everyday model | ~$0.013/exchange |
| **GPT-5 Mini** | Budget-friendly, quick sessions | ~$0.002/exchange |
| **GPT-4o** | Legacy multimodal, still solid | ~$0.009/exchange |
| **GPT-4o Mini** | Cheapest option for testing | ~$0.001/exchange |

### Google AI (Gemini)

| Model | Best For | $/M in | $/M out |
|-------|----------|-------:|--------:|
| **Gemini 3.1 Pro** (≤200K prompt) | Top-tier reasoning, long context | $2.00 | $12.00 |
| **Gemini 3.1 Pro** (>200K prompt) | Same model, long-context tier | $4.00 | $18.00 |
| **Gemini 3 Pro** | Strong all-around performance | — | — |
| **Gemini 3 Flash** | Fast and cheap | — | — |

**Watch the 200K cliff.** Gemini 3.1 Pro doubles input price and raises output 50% once a prompt crosses 200K tokens. A Nexus session with the framework, a dossier, and sideloaded archives crosses it early and stays there — so the effective rate is the lower row, not the headline. Claude models have no long-context premium across their full 1M window.

### Cost Note

Per-exchange estimates are misleading for this framework. The dominant cost is the ~54K-token framework prefix re-sent on every turn, not the exchange itself — so **prompt caching is the single biggest lever on your bill**, worth more than the choice between Sonnet and Opus. Cached reads run ~0.1× input price on both Claude and Gemini. Verify caching is actually working before optimizing anything else.

Token counts here are estimates. Use each provider's own token-counting endpoint against `framework.txt` for real numbers — cross-vendor token counts are not directly comparable, and third-party tokenizers (tiktoken and friends) are wrong for both Claude and Gemini.

## Temperature Guide

- **0.3-0.5**: Tight, consistent, predictable — good for mechanical/rules-heavy sessions
- **0.7-0.8**: Reliable characterization with room to breathe
- **0.9** : Slightly more creative, occasional surprises
- **1.0** (default, max): Full creative range — best for narrative-heavy play

## Anti-Railroading Safeguards

The Nexus respects player agency with multiple protections:

- ✅ Stops after describing situations (never assumes PC actions)
- ✅ Never narrates "you feel/think/decide" without player input
- ✅ Never narrates what the PC *declines* to do — a refused option is still a decision
- ✅ One PC action per response, maximum
- ✅ Explicit checkpoints in combat and social scenes
- ✅ Scope enforcement — stories stay at character tier scope level
- ✅ Meta-language isolation — no game mechanics or engine vocabulary in narrative dialogue
- ✅ Concrete examples of violations in framework
- ✅ **Priority 0 Final Gate** — a per-response pre-output scan that outranks every other rule, placed last in the document so it is read immediately before generation

If the AI ever railroads: **"Stop. You're narrating my character's actions. Let me decide."** The framework treats this as a hard override equivalent to "Nexus, Pause" — the Nexus must stop, acknowledge in a `[NEXUS SYSTEM]` header, and hand control back. Anything it wrongly narrated is reversible, and your version is canon.

## Mobile Server

1. Click **📱 Mobile Server** in the app
2. Note the URL (e.g., `http://192.168.1.100:8080`)
3. Open on your phone (same WiFi network)
4. Click **Stop Server** when done

## File Structure

```
nexus/
├── storyteller.py       # Desktop application
├── framework.txt        # Nexus Framework v3.4 (single source of truth)
├── character_sheet.txt  # Persistent character data (rolling summary)
├── index.html           # Web version
├── nexus.html           # Mobile-optimized web version
├── stories/             # Saved session files
└── README.md
```

## Version History

**v3.4** (Current) — Compiled Edition
- Priority 0 Agency Gate: one-action ceiling, negation trap, interiority line, PC-memory rule, per-response pre-output scan
- Banned Machinery Leak: engine/axis/structural vocabulary and prose-calibration anchors barred from narration; `[NEXUS SYSTEM]` header carved out as the out-of-world channel
- Difficulty bands rebuilt as a full fixed scale (Trivial 5 → Legendary 30) with an inheritance rule and a no-relabeling prohibition
- Amendments 2.0–2.10: Repertory Principle, Reputation Distortion Engine, Faction Clocks, Motif Registry, Planted Gun Registry, Location Arcs, Interlude Protocol, Diegetic Recap, Living Speech Lexicon, The World's Clock, Series Finale Protocol
- Fully self-contained compilation — v3.0 carry-by-reference sections inlined, marked `[RESTORED]` / `[RECONSTRUCTED]`
- Deduplication and cross-reference repairs throughout

**v3.2** — Scope & Aspiration Edition
- Narrative Scope system: scope enforcement, tier-based scope levels, scope escalation rules
- Authority Figure Problem + When the PC Defers (4-step chain-of-command protocol)
- PC Aspiration Trajectory with milestone tracking and arc alignment
- Organic Specialization Recognition via pattern tracking
- Observational Appraisal (full physical descriptions)
- Complication Type Rotation (7 categories, no injury defaults)
- Anti-Spiral Rule (max one injury per encounter)
- Tier-Scaled Injury Severity + Fail-Margin Scaling
- Meta-Language Bleed detection + Setup Phase Meta-Language Rule
- Context Integrity Protocol (Hard Canon Lock, NPC Continuity, Offer/Promise Tracking)
- Claude Opus 4.7 added to model list
- Summary token limit doubled (4096 → 8192)
- JSON archive document support
- Character Sheet viewer/editor (📋 button)
- Mobile save fix (Web Share API with MIME cycling)
- Google AI migration: `google-generativeai` → `google-genai`

**v3.1** — Master Engine Edition
- OpenAI ChatGPT API integration (GPT-5.2, GPT-5 Mini, GPT-4o across all interfaces)
- Advance the Ball Directive + Silent Turn (dialogue anti-looping)
- Scene Disruption Protocol (organic loop-breaking)
- Threat Vector Pause (combat attacks require player response before resolution)
- Combat Environment Mandate (tactical terrain + degrading battlefields)
- Anatomical Consequence system (injuries degrade specific capabilities, no abstract HP)
- Complication Engine (narrow margins produce tactical trade-offs)
- NPC Agenda Clocks + Missed Connection + Unprompted Intercept
- Conditioned Response upgrades: Threshold Carryover + Ghost Sensations
- Season Premiere (hard cut arc transitions), Arc Escalation Directive, Resolution Rupture
- Invisible Ledger, Cool-Down Mandate, Sensory Triggers, Intimacy Bleed
- "Cheap Alien" Prohibition, Linguistic Blend Mandate, Occupational Drift
- Stylistic Primer + Lexical Bounty (prose calibration hardening)
- World State expansion: Information, Currency, Justice, Mobility profiles for all 13 states
- "Nexus, Export State" command for session migration

**v3.0** — Origin Arc Edition
- Added Claude Sonnet 4.6 support (new default model)
- Character Tier system (Origin, Journeyman, Veteran, Legend)
- Origin Arc guided prologue
- Narrative Architecture Engine (story spine, dramatic questions, thematic threads)
- NPC Arc Engine (tension axes, progressive revelation, dialogue fingerprinting)
- Scene Tension Curve, Breath Protocol, Contrast Pulse
- Rolling Summary continuity (consolidated character sheets)
- Causal Chain and Campaign Chronicle tracking
- Smart Trim with natural scene break detection
- Bridge Context generation
- Summary quality selection (Quick/Deep)
- Increased max tokens (12288)
- Character sheet preservation across new sessions
- Character Integrity Directive (anti-redemption-railroading)
- Dynamic Nomenclature with LLM ban lists
- Echo Chamber of Awe prohibition
- Conditioned Response Engine
- UI redesign (Wope-inspired gradient aesthetic)

**v2.1**
- Reference Documents with PDF support
- Prose Calibration Engine
- Enhanced anti-railroading safeguards
- Claude Opus 4.6 support

**v2.0**
- Dynamic World States (13 states)
- Personal State Engine
- Multi-Axis Intimacy System
- Archive & Trim feature

**v1.0**
- Initial release

## License

MIT License — Use freely, modify as needed.

## Credits

Built for immersive AI storytelling. Framework designed for use with Claude (Anthropic), ChatGPT (OpenAI), and Gemini (Google) language models.