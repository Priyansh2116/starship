const zmq = require('zeromq');
const sock = new zmq.Subscriber();

sock.connect('tcp://127.0.0.1:5555');
sock.subscribe(''); // Subscribe to all topics

(async () => {
    for await (const message of sock) {
        console.log("Received message from ZeroMQ:", message.toString());
    }
})();

