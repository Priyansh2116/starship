"use client"
import React, { useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Spectrograph: React.FC = () => {
  const [spectralData, setSpectralData] = useState<{ wavelength: number; intensity: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = (imageData: ImageData) => {
    const { data, width } = imageData;
    const spectralValues: { wavelength: number; intensity: number }[] = [];
    
    // Process each column of pixels to get the spectral intensity
    for (let x = 0; x < width; x++) {
      let columnIntensity = 0;
      
      // Sum up the RGB values for each pixel in this column
      for (let y = 0; y < data.length / (width * 4); y++) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        
        // Calculate intensity as average of RGB values
        columnIntensity += (r + g + b) / 3;
      }
      
      // Average the column intensity
      columnIntensity /= data.length / (width * 4);
      
      // Convert pixel position to approximate wavelength (400-700nm range)
      const wavelength = 400 + (300 * x / width);
      
      spectralValues.push({
        wavelength: Math.round(wavelength),
        intensity: columnIntensity
      });
    }
    
    return spectralValues;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Process the image data to get spectral values
        const processedData = processImage(imageData);
        setSpectralData(processedData);
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 relative">
            Spectrograph
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isProcessing}
            />
          </button>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Spectral Graph */}
        {spectralData.length > 0 && (
          <div className="mt-4">
            <LineChart
              width={800}
              height={400}
              data={spectralData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="wavelength" 
                label={{ value: 'Wavelength (nm)', position: 'bottom' }} 
              />
              <YAxis 
                label={{ value: 'Intensity', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </div>
        )}

        {isProcessing && (
          <div className="text-center">Processing image...</div>
        )}
      </div>
    </div>
  );
};

export default Spectrograph;
