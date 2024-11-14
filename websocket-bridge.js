const WebSocket = require('ws');
const zmq = require('zeromq');
const wss = new WebSocket.Server({port:8786});
const sock = new zmq.Subscriber();
sock.connect('tcp://127.0.0.1:5555');
sock.subscribe('');

wss.on('connection',(ws)  =>   {
    console.log("connected to server");
    (async () => {
        for await (const message of sock) {
            console.log("Received message from ZeroMQ:", message);
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
        }
    })();

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});
