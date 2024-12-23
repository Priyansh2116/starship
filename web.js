const WebSocket = require('ws');
const zmq = require('zeromq');

const wss = new WebSocket.Server({ port: 8786 });
const subSock = new zmq.Subscriber();
const reqSock = new zmq.Request();

subSock.connect('tcp://127.0.0.1:5555');
subSock.subscribe('');
reqSock.connect('tcp://127.0.0.1:5556');

function broadcastToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(JSON.stringify(data));
            } catch (error) {
                console.error("Error broadcasting to client:", error);
            }
        }
    });
}

(async () => {
    for await (const message of subSock) {
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
            console.log(`Received Gas Value: ${gasvalue}`);
            broadcastToClients({ type: "gasvalue", value: gasvalue });
        }
        if (msgString.startsWith("spectroscopy ")) {
            const spectroscopy = msgString.replace("spectroscopy ", "");
            console.log(`Received Spectroscopy:`);
            broadcastToClients({ type: "spectroscopy", value: spectroscopy });
        }
    }
})();

wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");

    ws.on('message', async (message) => {
        console.log(`Received message from client: ${message}`);
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === "REQUEST_SPECTROSCOPY") {
                console.log("Client requested spectroscopy data");
                try {
                    await reqSock.send("REQUEST_SPECTROSCOPY");
                    const [response] = await reqSock.receive();
                    const responseStr = response.toString();
                } catch (error) {
                    console.error("Error communicating with ZMQ REP server:", error);
                    ws.send(JSON.stringify({
                        type: "error",
                        message: "Failed to fetch spectroscopy data",
                    }));
                }
            }
        } catch (error) {
            console.error("Error handling client message:", error);
            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid request format",
            }));
        }
    });

    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});

process.on('SIGINT', async () => {
    console.log("Shutting down...");
    await subSock.close();
    await reqSock.close();
    wss.close();
    process.exit(0);
});

