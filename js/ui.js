// Existing UI helpers, shared by both entry points.
const GEMINI_REINFORCEMENT = `
================================================================================
PROVIDER-SPECIFIC ENFORCEMENT NOTE (Google models only)
================================================================================

This note exists because session review has shown specific, repeated violations of rules already stated above. These are not new rules. They are the SAME rules, restated because they were skipped.

VIOLATION PATTERN 1 — RAILROADING VIA ACTION CHAINING
Confirmed failure example from a real session: the player said "I take the drink and meander over to the bar." The response chained: takes drink -> stares at her foot -> narrates internal arousal -> walks inside -> crouches -> inventories the minibar -> delivers four lines of new dialogue -> leans on a doorframe -> THEN asks "what do you do?"
That is one player input expanded into eight-plus unauthorized beats, including a narrated internal sensation ("that low, heavy pull of arousal") the player never established.

THE FIX: After the player's stated action is resolved, STOP. Do not invent the next leg of the journey, the next room, or the next block of dialogue unless the player asked for a time skip or said "continue" / "and then." One input, one beat, then hand back control. If you are not certain whether the player's sentence covers what you are about to narrate, it does not.

VIOLATION PATTERN 2 — ANATOMICAL FIXATION
Confirmed failure example: across two consecutive responses, in an ordinary Tier 0-1 bar conversation with no Intimacy Check-in initiated, the same NPC's breasts and bare foot each received a full descriptive paragraph in BOTH responses, using near-identical language ("shapely breasts," "full and perfectly formed," toes curling on a brass rail) regardless of what the dialogue was actually about.

THE FIX: A feature does not get re-described just because it is available to describe. If the previous response already gave a body part a full descriptive beat, this response does NOT repeat it. In Tier 0-1 social scenes, physical description is ONE small beat woven into the action — not a standalone paragraph, and not the majority of the response. Dialogue and subtext carry the scene. The Observational Appraisal rules (full anatomical detail) apply when the player actively looks or asks, or the scene has actually escalated — not by default, and not on a loop. See: THE FIXATION PROHIBITION, Physical Description Framework.

BOTH PATTERNS SHARE ONE ROOT CAUSE: writing what's vivid or available to write, rather than writing only what the player's actual input and the actual escalation state authorize. Before finalizing this response, check: did the player's last message authorize everything I am about to narrate? Did the previous response already cover this body part or feature? If either answer gives you pause, cut the response back until both answers are clean.
`;
function getApiKey() {
    return localStorage.getItem('nexus_api_key') || '';
}

function getGoogleApiKey() {
    return localStorage.getItem('nexus_google_api_key') || '';
}

function getOpenaiApiKey() {
    return localStorage.getItem('nexus_openai_api_key') || '';
}

function getTemperature() {
    return parseFloat(localStorage.getItem('nexus_temperature') || '1.0');
}

function onProviderChange() {
    const provider = document.getElementById('provider-select').value;
    document.getElementById('anthropic-key-section').style.display = provider === 'anthropic' ? 'block' : 'none';
    document.getElementById('google-key-section').style.display   = provider === 'google'   ? 'block' : 'none';
    document.getElementById('openai-key-section').style.display   = provider === 'openai'   ? 'block' : 'none';
    renderModelOptions(provider);
}

function showSettings() {
    document.getElementById('provider-select').value = getProvider();
    document.getElementById('api-key-input').value = getApiKey();
    document.getElementById('google-api-key-input').value = getGoogleApiKey();
    document.getElementById('openai-api-key-input').value = getOpenaiApiKey();
    document.getElementById('temp-slider').value = getTemperature();
    onProviderChange();  // renders model options + restores saved selection
    updateTempDisplay();
    document.getElementById('settings-modal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function saveSettings() {
    const provider = document.getElementById('provider-select').value;
    const apiKey = document.getElementById('api-key-input').value.trim();
    const googleApiKey = document.getElementById('google-api-key-input').value.trim();
    const openaiApiKey = document.getElementById('openai-api-key-input').value.trim();
    const model = document.getElementById('model-select').value;
    const temp = document.getElementById('temp-slider').value;

    localStorage.setItem('nexus_provider', provider);
    if (apiKey) {
        localStorage.setItem('nexus_api_key', apiKey);
    }
    if (googleApiKey) {
        localStorage.setItem('nexus_google_api_key', googleApiKey);
    }
    if (openaiApiKey) {
        localStorage.setItem('nexus_openai_api_key', openaiApiKey);
    }
    localStorage.setItem('nexus_model', model);
    localStorage.setItem('nexus_temperature', temp);

    closeSettings();
    setStatus('Settings saved', 'success');
}

function updateTempDisplay() {
    const val = document.getElementById('temp-slider').value;
    document.getElementById('temp-display').textContent = parseFloat(val).toFixed(1);
}

function closeSessions() {
    document.getElementById('sessions-modal').classList.remove('active');
}

function showCharacterSheet() {
    const editor = document.getElementById('character-sheet-editor');
    editor.value = characterSheet || '';
    document.getElementById('character-sheet-modal').classList.add('active');
    // Focus with slight delay so modal animation completes
    setTimeout(() => editor.focus(), 100);
}

function closeCharacterSheet() {
    document.getElementById('character-sheet-modal').classList.remove('active');
}

function showReferenceDocs() {
    renderReferenceDocsList();
    document.getElementById('reference-docs-modal').classList.add('active');
}

function closeReferenceDocs() {
    document.getElementById('reference-docs-modal').classList.remove('active');
}

function renderReferenceDocsList() {
    const list = document.getElementById('reference-docs-list');

    if (referenceDocuments.length === 0) {
        list.innerHTML = '<p style="color: var(--text-muted);">No reference documents uploaded.</p>';
        return;
    }

    const html = referenceDocuments.map((doc, index) => `
        <div class="session-item" style="cursor: default;">
            <div>
                <div class="name">${escapeHtml(doc.name)}</div>
                <div class="date">${(doc.content.length / 1024).toFixed(1)} KB</div>
            </div>
            <button class="delete-btn" onclick="deleteReferenceDoc(${index})">×</button>
        </div>
    `).join('');

    list.innerHTML = html;
}

async function uploadReferenceDoc(event) {
    const file = event.target.files[0];
    if (!file) return;

    setStatus('Processing file...', '');

    try {
        let content = '';
        const fileName = file.name;

        if (file.name.endsWith('.pdf')) {
            // Extract text from PDF using PDF.js
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                setStatus(`Extracting text from ${pdf.numPages} pages...`, '');

                // Extract text from all pages
                const textPromises = [];
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    textPromises.push(
                        pdf.getPage(pageNum).then(async (page) => {
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items
                                .map(item => item.str)
                                .join(' ');
                            return `\n--- Page ${pageNum} ---\n${pageText}`;
                        })
                    );
                }

                const pages = await Promise.all(textPromises);
                content = pages.join('\n\n');

                if (!content.trim()) {
                    throw new Error('No text could be extracted from this PDF. It may be image-based or encrypted.');
                }

            } catch (pdfErr) {
                console.error('PDF extraction error:', pdfErr);
                throw new Error(`PDF extraction failed: ${pdfErr.message}`);
            }
        } else if (file.name.endsWith('.json')) {
            // Parse JSON — check if it's a Nexus archive
            const rawText = await file.text();
            let jsonData;
            try {
                jsonData = JSON.parse(rawText);
            } catch (parseErr) {
                throw new Error('Invalid JSON file: ' + parseErr.message);
            }

            // Detect Nexus archive format (has messages array)
            if (jsonData.messages && Array.isArray(jsonData.messages)) {
                // This is a Nexus session archive — convert to readable reference doc
                const parts = [];
                parts.push('=== NEXUS SESSION ARCHIVE (Loaded as Reference) ===');
                if (jsonData.created) parts.push(`Archived: ${jsonData.created}`);
                if (jsonData.model) parts.push(`Model: ${jsonData.model}`);
                if (jsonData.type) parts.push(`Type: ${jsonData.type}`);
                parts.push('');

                // Include character sheet if present
                if (jsonData.character_sheet) {
                    parts.push('=== CHARACTER SHEET (from archive) ===');
                    parts.push(jsonData.character_sheet);
                    parts.push('');
                }

                // Convert messages to readable transcript
                parts.push('=== SESSION TRANSCRIPT ===');
                parts.push('(This is a prior session loaded for continuity reference. Events described here are ESTABLISHED CANON.)');
                parts.push('');

                for (const msg of jsonData.messages) {
                    const role = msg.role === 'user' ? 'PLAYER' : 'NEXUS';
                    // Keep the complete transcript: archival lore is not safe to truncate silently.
                    let msgContent = msg.content;
                    parts.push(`--- ${role} ---`);
                    parts.push(msgContent);
                    parts.push('');
                }

                content = parts.join('\n');

                // Also load the character sheet if present and current sheet is empty
                if (jsonData.character_sheet && !characterSheet) {
                    if (confirm('This archive contains a character sheet. Load it into your current session?')) {
                        characterSheet = jsonData.character_sheet;
                    }
                }
            } else {
                // Generic JSON — just stringify it readable
                content = JSON.stringify(jsonData, null, 2);
            }
        } else {
            // Read as text for .txt and .md files
            content = await file.text();
        }

        // Check if content is reasonable
        if (content.length > 500000) {
            if (!confirm(`This file is ${(content.length / 1024).toFixed(1)} KB. Large files may slow down responses. Continue?`)) {
                event.target.value = '';
                setStatus('Upload cancelled', '');
                return;
            }
        }

        // Add to reference documents
        referenceDocuments.push({
            name: fileName,
            content: content,
            uploadedAt: new Date().toISOString()
        });

        renderReferenceDocsList();
        setStatus(`Added: ${fileName} (${(content.length / 1024).toFixed(1)} KB)`, 'success');

        // Reset file input
        event.target.value = '';

    } catch (err) {
        console.error('Upload error:', err);
        setStatus('Upload failed', 'error');
        alert('Failed to upload file: ' + err.message);
        event.target.value = '';
    }
}

function _mobileFallbackSave(jsonString, filename) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        try {
            const dataUri = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(jsonString);
            const win = window.open(dataUri, '_blank');
            if (!win) {
                navigator.clipboard.writeText(jsonString).then(() => {
                    alert(`Session copied to clipboard as JSON text.\n\nPaste into a text file and save as "${filename}"`);
                    setStatus('Copied to clipboard', 'success');
                }).catch(() => {
                    alert('Unable to save on this browser. Try using "Save to Browser" instead, or switch to desktop.');
                    setStatus('Save failed — use Save to Browser', 'error');
                });
            } else {
                setStatus(`Saving: ${filename}`, 'success');
            }
        } catch (err) {
            alert('Unable to save on this browser. Try using "Save to Browser" instead.');
            setStatus('Save failed', 'error');
        }
    } else {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
        setStatus(`Downloaded: ${filename}`, 'success');
    }
}

function renderMessages() {
    const container = document.getElementById('chat-container');

    if (messages.length === 0) {
        container.innerHTML = `
            <div class="welcome">
                <h2>The Nexus Awaits</h2>
                <p>The framework loads from framework.txt.<br>Type "Begin" to start a new session.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = messages.map(msg => `
        <div class="message ${msg.role}">
            <div class="message-role">${msg.role === 'user' ? 'You' : 'The Nexus'}${['failed','interrupted','pending'].includes(msg.status) ? ' · ' + msg.status : ''}</div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
    `).join('');

    scrollToBottom();
}

function addMessage(role, content) {
    const container = document.getElementById('chat-container');

    // Remove welcome if present
    const welcome = container.querySelector('.welcome');
    if (welcome) welcome.remove();

    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = `
        <div class="message-role">${role === 'user' ? 'You' : 'The Nexus'}</div>
        <div class="message-content">${escapeHtml(content)}</div>
    `;
    container.appendChild(div);
    scrollToBottom();

    return div;
}

function updateLastMessage(content) {
    const messages = document.querySelectorAll('.message.assistant');
    const last = messages[messages.length - 1];
    if (last) {
        last.querySelector('.message-content').textContent = content;
        scrollToBottom();
    }
}

function scrollToBottom() {
    const container = document.getElementById('chat-container');
    container.scrollTop = container.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setStatus(text, type = '') {
    const status = document.getElementById('status');
    status.textContent = text;
    status.className = 'status ' + type;
}
