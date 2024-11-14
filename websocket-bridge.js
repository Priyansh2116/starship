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
            if (message) {
                const speed = message.toString().replace('speed ', '');
                console.log(`Processed speed: ${speed}`);
                ws.send(speed);
            }
        }
    })();

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});
