const WebSocket = require('ws');
const zmq = require('zeromq');

const wss = new WebSocket.Server({ port: 8786 });
const subSock = new zmq.Subscriber();

subSock.subscribe("");
subSock.connect('tcp://127.0.0.1:5555');

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

function parseGPSData(message) {
    try {
        const data = JSON.parse(message);
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            height: data.height,
            numSV: data.numSV,
            status: data.msg_status
        };
    } catch (error) {
        console.error("Error parsing GPS data:", error);
        return null;
    }
}

(async () => {
    console.log("Started: Listening for GPS data on port 5555...");
    
    for await (const message of subSock) {
        const msgString = message.toString();
        
        try {
            const gpsData = parseGPSData(msgString);
            if (gpsData) {
                console.log(`Received GPS - Lat: ${gpsData.latitude}, Lon: ${gpsData.longitude}, height: ${gpsData.height},numSV: ${gpsData.numSV}`);
                console.log(`Status: ${gpsData.status}`);
                
                broadcastToClients({
                    type: "gps",
                    data: {
                        latitude: gpsData.latitude,
                        longitude: gpsData.longitude,
                        height: gpsData.height,
                        numSV: gpsData.numSV,
                        status: gpsData.status
                    }
                });
            }

            if (msgString.startsWith("speed ")) {
                const speed = msgString.replace("speed ", "");
                console.log(`Received Speed: ${speed}`);
                broadcastToClients({ type: "speed", value: speed });
            }

            if (msgString.startsWith("compass ")) {
                const compass = msgString.replace("compass ", "");
                console.log(`Received Compass: ${compass}`);
                broadcastToClients({ type: "compass", value: compass });
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    }
})();

wss.on('connection', (ws) => {
    console.log("New WebSocket client connected");
    ws.on('close', () => {
        console.log("WebSocket client disconnected");
    });
});

process.on('SIGINT', async () => {
    console.log("Shutting down...");
    await subSock.close();
    wss.close();
    process.exit(0);
});
