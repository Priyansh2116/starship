"use client"
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const StatusDisplay = () => {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8786');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'gps') {
        setStatus(data.data.status);
      }
    };

    return () => ws.close();
  }, []);

  const hasError = status !== 'No errors detected';

  return (
    <div className="p-4 bg-gray-1000 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-2">System Status</h2>
      <div className="flex items-start space-x-2">
        {status ? (
          <>
            {hasError ? (
              <AlertCircle className="text-red-500 mt-1" size={20} />
            ) : (
              <CheckCircle className="text-green-500 mt-1" size={20} />
            )}
            <div className={`flex-1 ${hasError ? 'text-red-600' : 'text-green-600'}`}>
              {status}
            </div>
          </>
        ) : (
          <div className="text-white">status updates</div>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;
