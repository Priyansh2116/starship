const WebSocket = require('ws');
const zmq = require('zeromq');

const wss = new WebSocket.Server({ port: 8786 });
const sock = new zmq.Subscriber();
sock.connect('tcp://127.0.0.1:5555');
sock.subscribe('');

function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

(async () => {
    for await (const message of sock) {
        const msgString = message.toString();
        if (msgString.startsWith("speed ")) {
            const speed = msgString.replace("speed ", "");
            console.log(`Received Speed: ${speed}`);
            broadcastToClients({ type: "speed", value: speed });
        }
        if (msgString.startsWith("camera ")) {
            const frame = msgString.replace("camera ", "");
            console.log("Received Camera Frame");
            broadcastToClients({ type: "camera", value: frame });
        }
        if (msgString.startsWith("compass ")) {
            const compass = msgString.replace("compass ", "");
            console.log(`Received Compass: ${compass}`);
            broadcastToClients({ type: "compass", value: compass });
        }
        if (msgString.startsWith("gasvalue ")) {
            const gasvalue = msgString.replace("gasvalue ", "");
            console.log(`Received gasvalue: ${gasvalue}`);
            broadcastToClients({ type: "gasvalue", value: gasvalue });
        }
    }
})();
wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});
