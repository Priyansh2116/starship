"use client"
import React, { useEffect, useState } from 'react';
interface MessageData {
    type: string;
    value: string;
}
const Camera: React.FC = () => {
    const [frame, setFrame] = useState<string | null>(null);
    const wsRef = React.useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:8786');
        wsRef.current.onmessage = (event) => {
            const data: MessageData = JSON.parse(event.data);
            if (data.type === 'camera') {
                setFrame(`data:image/jpeg;base64,${data.value}`);
            }
        };
        wsRef.current.onopen = () => console.log("Connected to WebSocket for Camera Feed");
        wsRef.current.onclose = () => console.log("Disconnected from WebSocket");
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);
    return (
        <div>
            <h1>Camera Feed</h1>
            {frame ? (
                <img src={frame} alt="Camera Feed" style={{ width: '100%', height: 'auto' }} />
            ) : (
                <p>Loading camera feed...</p>
            )}
        </div>
    );
};
export default Camera;

