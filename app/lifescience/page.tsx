'use client';
import React from 'react';
import Spectrograph from '../../components/Spectrograph'; // Fixed quotation mark
import Camera from '../../components/Camera';
import GasSensor from '../../components/Gassesnor';
import './page.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-between p-4">
      {/* Life Sciences Section */}
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="relative">
          <Camera />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            Cam 1
          </span>
        </div>
        <div className="relative">
          <Camera />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            Cam 2
          </span>
        </div>
        <div className="relative">
          <Camera />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            Cam 3
          </span>
        </div>
        <div className="relative">
          <Camera />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
            Cam 4
          </span>
        </div>
      </div>

      {/* Sensor and Spectroscopy Section */}
      <div className="grid grid-cols-2 gap-4 w-full mt-8">
        {/* Sensors */}
        <div className="bg-gray-1000 rounded p-4">
          <h2 className="text-lg font-bold mb-4">Five Sensors</h2>
          <GasSensor />
          <GasSensor />
          <GasSensor />
        </div>

        {/* Spectroscopy */}
        <div className="bg-gray-1000 rounded p-4">
          <h2 className="text-lg font-bold mb-4">Spectroscopy</h2>
          <Spectrograph />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

