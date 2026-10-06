function toggleMobileMenu() {
    document.getElementById("menu").classList.toggle("active");
}

const RESUME_FILE_NAME = 'Yurii_Khliebnikov_CV.pdf';

document.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const chatInput = document.querySelector('.chat-message input');
    const sendButton = document.querySelector('.chat-message button');

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage('user', 'User', message);
        chatInput.value = '';

        const loadingId = appendMessage('bot', 'AI', 'Thinking...');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            const botMessage = data.reply || "Sorry, I couldn't understand that.";
            updateMessage(loadingId, botMessage);

        } catch (error) {
            console.error("Error calling API:", error);
            updateMessage(loadingId, "Oops, something went wrong connecting to the AI.");
        }
    }

    function appendMessage(role, name, text) {
        const id = 'msg-' + Math.random().toString(36).substr(2, 9);
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="avatar ${role}">${name}</span>
            <div class="message" id="${id}">${text}</div>
        `;
        chatLog.appendChild(li);
        chatLog.parentElement.scrollTop = chatLog.parentElement.scrollHeight;
        return id;
    }

    function updateMessage(id, text) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.innerHTML = text.replace(/\n/g, '<br>');
            chatLog.parentElement.scrollTop = chatLog.parentElement.scrollHeight;
        }
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});