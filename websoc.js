// web.js
const zmq = require('zeromq');

async function connect() {
    const sock = new zmq.Subscriber;

    sock.connect('tcp://localhost:5556');
    sock.subscribe('rover_data');
    console.log('Subscriber connected to port 5556');

    for await (const [topic, msg] of sock) {
        const data = JSON.parse(msg);
        
        // Process the rover data
        console.log('Received Rover Data:');
        console.log('Joint Data:');
        console.log('  Acceleration:', data.joint.accel);
        console.log('  Gyro:', data.joint.gyro);
        console.log('  Pitch:', data.joint.pitch);
        console.log('  Roll:', data.joint.roll);
        
        console.log('Inverse Kinematics:');
        console.log('  Position:', {
            x: data.inverse.x,
            y: data.inverse.y,
            z: data.inverse.z
        });
        console.log('  Angles:', {
            turn_table: data.inverse.turn_table,
            first_link: data.inverse.first_link,
            second_link: data.inverse.second_link
        });
        
        // Here you can add your own processing logic
        // For example, sending to a websocket for real-time web updates
    }
}

connect().catch(console.error);
