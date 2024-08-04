const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        // Handle incoming messages if needed
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

// Function to broadcast messages to all connected clients
function broadcast(message) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

module.exports = { broadcast };
