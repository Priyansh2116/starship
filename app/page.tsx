import React from 'react';
import Speedometer from '../components/Speedometer'; 
import Stopwatch from '../components/Stopwatch';
import Compass from '../components/Compass';
import StatusDisplay from '../components/msgstatus';
import LatitudeDisplay from '../components/latitude';
import LongitudeDisplay from '../components/longitude';
import HeightDisplay from '../components/height';
import numSVDisplay from '../components/nmsv';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-lg font-bold mb-4">System Status</h1>
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <StatusDisplay />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-3 rounded-lg">
          <span>Rover Control</span>
          <div className="bg-gray-700 w-8 h-8 rounded-full" />
        </div>

        {/* Position Info - Full Width Cards */}
         <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-1000 rounded-lg shadow-md p-4">
            <label className="text-gray-500">Latitude</label>
            <div className="mt-2">
              <LatitudeDisplay />
            </div>
          </div>
          <div className="bg-gray-1000 rounded-lg shadow-md p-4">
            <label className="text-gray-500">Longitude</label>
            <div className="mt-2">
              <LongitudeDisplay />
            </div>
          </div>
        </div>

         <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-1000 rounded-lg shadow-md p-4">
            <label className="text-gray-500">height</label>
            <div className="mt-2">
              <HeightDisplay />
            </div>
          </div>
          <div className="bg-gray-1000 rounded-lg shadow-md p-4">
            <label className="text-gray-500">numSV</label>
            <div className="mt-2">
               <numSVDisplay />
            </div>
          </div>
        </div>


        {/* Instruments Grid */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          {/* Speedometer */}
          <div className="bg-gray-1000 rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="flex-1">
              <Speedometer />
            </div>
            <p className="mt-4 text-sm text-gray-500">Speedometer</p>
          </div>

          {/* Stopwatch */}
          <div className="bg-gray-1000 rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="flex-1">
              <Stopwatch />
            </div>
            <p className="mt-4 text-sm text-gray-500">Stopwatch</p>
          </div>

          {/* Compass */}
          <div className="bg-gray-1000 rounded-lg shadow-md p-6 flex flex-col items-center">
            <div className="flex-1">
              <Compass />
            </div>
            <p className="mt-4 text-sm text-gray-500">Compass</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
