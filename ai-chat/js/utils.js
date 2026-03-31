// Utility Functions

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(isoString) {
    return new Date(isoString).toLocaleTimeString('id-ID');
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleString('id-ID');
}

function generateChatTitle() {
    return 'Chat ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}
