// Main Application Logic

// STATE
let currentChat = {
    id: Date.now(),
    title: generateChatTitle(),
    messages: [],
    createdAt: new Date().toISOString(),
    model: 'openai/gpt-3.5-turbo'
};

let allChats = [];
let settings = {
    model: 'openai/gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    autoSave: true,
    showTimestamp: true,
    isDarkMode: true
};

// DOM Elements
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatList = document.getElementById('chatList');
const newChatBtn = document.getElementById('newChatBtn');
const saveChatBtn = document.getElementById('saveChatBtn');
const exportBtn = document.getElementById('exportBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const settingsBtn = document.getElementById('settingsBtn');
const themeBtn = document.getElementById('themeBtn');
const infoBtn = document.getElementById('infoBtn');
const searchBox = document.getElementById('searchBox');
const toast = document.getElementById('toast');

// Initialize App
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    renderChatList();
    renderMessages();
}

// Setup Event Listeners
function setupEventListeners() {
    // Chat input
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Sidebar buttons
    newChatBtn.addEventListener('click', createNewChat);
    saveChatBtn.addEventListener('click', () => saveChat(currentChat));
    exportBtn.addEventListener('click', openExportModal);
    loadBtn.addEventListener('click', openLoadModal);
    clearBtn.addEventListener('click', clearAllChats);

    // Header buttons
    settingsBtn.addEventListener('click', openSettingsModal);
    themeBtn.addEventListener('click', toggleTheme);
    infoBtn.addEventListener('click', openInfoModal);

    // Search
    searchBox.addEventListener('input', filterChats);

    // Settings
    document.getElementById('modelSelect').addEventListener('change', (e) => {
        settings.model = e.target.value;
        currentChat.model = e.target.value;
        saveSettings();
    });

    document.getElementById('temperatureSlider').addEventListener('change', (e) => {
        settings.temperature = parseFloat(e.target.value);
        document.getElementById('tempValue').textContent = e.target.value;
        saveSettings();
    });

    document.getElementById('maxTokensInput').addEventListener('change', (e) => {
        settings.maxTokens = parseInt(e.target.value);
        saveSettings();
    });

    document.getElementById('autoSaveCheckbox').addEventListener('change', (e) => {
        settings.autoSave = e.target.checked;
        saveSettings();
    });

    document.getElementById('timestampCheckbox').addEventListener('change', (e) => {
        settings.showTimestamp = e.target.checked;
        renderMessages();
        saveSettings();
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

// Chat Management
function createNewChat() {
    currentChat = {
        id: Date.now(),
        title: generateChatTitle(),
        messages: [],
        createdAt: new Date().toISOString(),
        model: settings.model
    };
    renderMessages();
    renderChatList();
    chatInput.focus();
    showToast('✓ New chat');
}

function saveChat(chat) {
    const existing = allChats.findIndex(c => c.id === chat.id);
    if (existing >= 0) {
        allChats[existing] = chat;
    } else {
        allChats.push(chat);
    }
    saveToLocalStorage();
    renderChatList();
    showToast('✓ Saved');
}

function loadChat(chatId) {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
        currentChat = JSON.parse(JSON.stringify(chat));
        renderMessages();
        renderChatList();
        showToast('✓ Loaded');
    }
}

function deleteChat(chatId) {
    allChats = allChats.filter(c => c.id !== chatId);
    if (allChats.length === 0) {
        createNewChat();
    } else {
        currentChat = JSON.parse(JSON.stringify(allChats[0]));
        renderMessages();
    }
    saveToLocalStorage();
    renderChatList();
    showToast('✓ Deleted');
}

function clearAllChats() {
    if (confirm('Hapus semua percakapan?')) {
        allChats = [];
        createNewChat();
        showToast('✓ All cleared');
    }
}

function filterChats() {
    renderChatList();
}

// Export Functions
function confirmExport() {
    const format = document.getElementById('exportFormat').value;
    exportChat(currentChat, format);
    closeExportModal();
}

function exportChat(chat, format) {
    let content, filename, type;

    if (format === 'json') {
        content = JSON.stringify(chat, null, 2);
        filename = `${chat.title.replace(/\s+/g, '_')}.json`;
        type = 'application/json';
    } else if (format === 'txt') {
        content = `${chat.title}\n${formatDate(chat.createdAt)}\n\n`;
        content += chat.messages.map(msg =>
            `[${msg.type.toUpperCase()}] ${formatTime(msg.timestamp)}:\n${msg.content}\n`
        ).join('\n');
        filename = `${chat.title.replace(/\s+/g, '_')}.txt`;
        type = 'text/plain';
    } else if (format === 'md') {
        content = `# ${chat.title}\n\n_Created: ${formatDate(chat.createdAt)}_\n\n`;
        content += chat.messages.map(msg =>
            `**${msg.type === 'user' ? 'You' : 'AI'}** (\`${formatTime(msg.timestamp)}\`)\n\n${msg.content}\n\n---\n\n`
        ).join('');
        filename = `${chat.title.replace(/\s+/g, '_')}.md`;
        type = 'text/markdown';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Exported');
}

function openLoadModal() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const chat = JSON.parse(event.target.result);
                if (chat.id && chat.messages !== undefined) {
                    saveChat(chat);
                    loadChat(chat.id);
                } else {
                    showToast('❌ Invalid file');
                }
            } catch {
                showToast('❌ Error loading');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Start App
init();
