"use client";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Tooltip, 
  Legend
);

const Spectroscopy: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8786");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Add more detailed logging
        console.log("Received message:", message);

        if (message.type === "spectroscopy") {
          const spectroscopyData = message.value;
          
          console.log("Spectroscopy data received:", spectroscopyData);
          
          if (Array.isArray(spectroscopyData)) {
            const newTimestamps = spectroscopyData.map(() => new Date().toLocaleTimeString());
            
            // Update state with new data and timestamps
            setDataPoints((prev) => {
              const updatedPoints = [...prev, ...spectroscopyData].slice(-50);
              console.log("Updated data points:", updatedPoints);
              return updatedPoints;
            });
            
            setLabels((prev) => {
              const updatedLabels = [...prev, ...newTimestamps].slice(-50);
              console.log("Updated labels:", updatedLabels);
              return updatedLabels;
            });
          } else {
            console.error("Received spectroscopy data is not an array:", spectroscopyData);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Spectroscopy Data",
        data: dataPoints,
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.3)",
        pointRadius: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    maintainAspectRatio: false,
  };

  const containerStyle = {
    backgroundColor: "black",
    padding: "20px",
    borderRadius: "10px",
    color: "white",
    height: "400px",
    width: "800px",
    margin: "0 auto",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center" }}>Real-Time Spectroscopy Graph</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default Spectroscopy;
