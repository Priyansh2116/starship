"use client"
import React from 'react';
import Spectrograph from '../../components/Spectrograph';  // Fixed quotation mark
import Stopwatch from '../../components/Stopwatch';
import Compass from '../../components/Compass';
import Camera from '../../components/Camera';
import GasSensor from '../../components/Gassesnor';
import '././page.css';

const DashboardPage: React.FC = () => {  // Added component declaration
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-1/4 p-4">
        <h1 className="text-lg font-bold mb-4">Camera Feed</h1>
        {/* Camera Views */}
        <div className="space-y-4">
          {/* Rear View */}
          <div className="relative">
            <div>
              <Camera type="rear" />
            </div>
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Biobox view
            </span>
          </div>
          {/* Arm View */}
          <div className="relative">
            <div>
              <Camera type="arm" />
            </div>
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Test-tube view
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-3 rounded-lg">
          <span>BioBox Readings</span>
          <div className="bg-gray-700 w-8 h-8 rounded-full" />
        </div>

        {/* Camera Feed and Instruments */}
        <div className="grid grid-cols-3 gap-4">
          {/* Main Camera View */}
          <div className="col-span-2 relative">
            {/* Apply a custom class to resize the camera */}
            <div className="camera-feed">
              <Camera />
            </div>
          </div>

          {/* Position Info */}
          <div className="space-y-4">
            <div>
              <label className="text-gray-500">Sensor 1</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800"><GasSensor /></div>
            </div>
            <div>
              <label className="text-gray-500">Sensor 2</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">-</div>
            </div>
            <div>
              <label className="text-gray-500">Sensor 3</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">--</div>
            </div>
            <div>
              <label className="text-gray-500">Sensor 4</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">--</div>
            </div>
            <div>
              <label className="text-gray-500">Sensor 5</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">--</div>
            </div>
          </div>
        </div>

        {/* Instruments */}
        <div className="flex justify-around items-center mt-4">
          <div className="text-center">
            <p className="mt-2 text-sm">Spectroscopy Data</p>
            <div className="chart-container mt-4">
              <Spectrograph />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
