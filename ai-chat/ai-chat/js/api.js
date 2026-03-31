// API Functions

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    sendBtn.disabled = true;
    chatInput.value = '';
    chatInput.style.height = 'auto';

    const userMessage = {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
    };

    currentChat.messages.push(userMessage);
    renderMessages();
    chatInput.focus();
    addTypingIndicator();

    try {
        const response = await fetch('http://localhost:3000/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                model: currentChat.model,
                temperature: settings.temperature,
                maxTokens: settings.maxTokens
            })
        });

        removeTypingIndicator();

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const aiMessage = {
            type: 'ai',
            content: data.reply,
            timestamp: new Date().toISOString()
        };

        currentChat.messages.push(aiMessage);
        renderMessages();

        if (settings.autoSave) saveChat(currentChat);
        showToast('✓ Pesan terkirim');

    } catch (error) {
        removeTypingIndicator();
        showToast('❌ Error: ' + error.message);
    } finally {
        sendBtn.disabled = false;
    }
}
