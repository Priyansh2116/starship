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
	if (msgString.startsWith("spectroscopy ")) {
            const spectroscopyStr = msgString.replace("spectroscopy ", "");
            try {
                const spectroscopy = JSON.parse(spectroscopyStr);
                console.log("Received Spectroscopy Data:", spectroscopy);
                if (Array.isArray(spectroscopy)) {
                    broadcastToClients({ type: "spectroscopy", value: spectroscopy });
                } else {
                    console.error("Spectroscopy data is not an array");
                }
            } catch (error) {
                console.error("Error parsing spectroscopy data:", error);
            }
        }
    }
})();
wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");


    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);

            if (msg.command === "start_spectroscopy") {
                console.log("Received request to start spectroscopy");
                const reqSocket = zmq.socket("push");
                reqSocket.connect("tcp://127.0.0.1:5556"); // Connect to the PUSH endpoint
                reqSocket.send("capture_spectroscopy");
                reqSocket.close();
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    });

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});
