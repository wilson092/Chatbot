// Local Storage Management

const STORAGE_KEYS = {
    ALL_CHATS: 'allChats',
    CURRENT_CHAT: 'currentChat',
    SETTINGS: 'settings'
};

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEYS.ALL_CHATS, JSON.stringify(allChats));
    localStorage.setItem(STORAGE_KEYS.CURRENT_CHAT, JSON.stringify(currentChat));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_CHATS);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const savedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_CHAT);

    if (saved) allChats = JSON.parse(saved);
    if (savedSettings) settings = { ...settings, ...JSON.parse(savedSettings) };
    if (savedCurrent) currentChat = JSON.parse(savedCurrent);

    if (currentChat.messages === undefined) currentChat.messages = [];
}

function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
