const WebSocket = require('ws');
const zmq = require('zeromq');
const wss = new WebSocket.Server({ port: 8786 });
const sock = new zmq.Subscriber();
sock.connect('tcp://127.0.0.1:5555');
sock.subscribe(''); 
function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
(async () => {
    for await (const message of sock) {
        const speed = message.toString().replace('speed ', '');
        console.log(`Received from ZeroMQ: ${speed}`);
        broadcastToClients(speed);
    }
})();

wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});

