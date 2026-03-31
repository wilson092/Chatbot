// UI Rendering Functions

function renderMessages() {
    if (currentChat.messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-comments"></i></div>
                <h2>Mulai Percakapan</h2>
                <p>Ketik pesan untuk memulai obrolan dengan AI</p>
            </div>
        `;
        return;
    }

    chatMessages.innerHTML = currentChat.messages.map((msg, idx) => `
        <div class="message ${msg.type}">
            <div class="message-avatar">${msg.type === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(msg.content)}</div>
                ${settings.showTimestamp ? `<div class="message-time">${formatTime(msg.timestamp)}</div>` : ''}
                <div class="message-actions">
                    <button class="message-action-btn" onclick="copyMessage(${idx})" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="message-action-btn" onclick="deleteMessage(${idx})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderChatList() {
    const filtered = allChats.filter(chat =>
        chat.title.toLowerCase().includes(searchBox.value.toLowerCase())
    );

    chatList.innerHTML = filtered.map(chat => `
        <div class="chat-item ${chat.id === currentChat.id ? 'active' : ''}" onclick="loadChat(${chat.id})">
            <span>${chat.title}</span>
            <button class="chat-item-delete" onclick="event.stopPropagation(); deleteChat(${chat.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
}

function addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message ai';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// Message Actions
function copyMessage(idx) {
    navigator.clipboard.writeText(currentChat.messages[idx].content);
    showToast('✓ Copied!');
}

function deleteMessage(idx) {
    currentChat.messages.splice(idx, 1);
    renderMessages();
    showToast('✓ Deleted');
}

// Modal Functions
function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active');
    document.getElementById('modelSelect').value = settings.model;
    document.getElementById('temperatureSlider').value = settings.temperature;
    document.getElementById('tempValue').textContent = settings.temperature;
    document.getElementById('maxTokensInput').value = settings.maxTokens;
    document.getElementById('autoSaveCheckbox').checked = settings.autoSave;
    document.getElementById('timestampCheckbox').checked = settings.showTimestamp;
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function openExportModal() {
    document.getElementById('exportModal').classList.add('active');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function openInfoModal() {
    document.getElementById('infoModal').classList.add('active');
}

function closeInfoModal() {
    document.getElementById('infoModal').classList.remove('active');
}

function resetSettings() {
    settings = {
        model: 'openai/gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
        autoSave: true,
        showTimestamp: true,
        isDarkMode: true
    };
    saveSettings();
    openSettingsModal();
    showToast('✓ Reset');
}

function toggleTheme() {
    settings.isDarkMode = !settings.isDarkMode;
    document.body.style.filter = settings.isDarkMode ? 'none' : 'invert(1) hue-rotate(180deg)';
    themeBtn.innerHTML = settings.isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    saveSettings();
}
