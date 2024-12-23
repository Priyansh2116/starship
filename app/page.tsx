import React from 'react';
import Link from 'next/link';
import Speedometer from '../components/Speedometer'; 
import Stopwatch from '../components/Stopwatch';
import Compass from '../components/Compass';
import Camera from '../components/Camera';
import './page.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-1/4 p-4">
        <h1 className="text-lg font-bold mb-4">Camera Feed</h1>
        {/* Camera Views */}
        <div className="space-y-4">
          {/* Rear View */}
          <div className="relative">
            <div> {/* Add the Rear View Component or whatever camera feed you want */}
              <Camera type="rear" /> {/* Assuming you have a Camera component to handle different types of views */}
            </div>
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Rear View
            </span>
          </div>
          {/* Arm View */}
          <div className="relative">
            <div> {/* Add the Arm View Component or camera feed here */}
              <Camera type="arm" /> {/* Assuming this Camera component handles multiple types of camera views */}
            </div>
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Arm View
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-3 rounded-lg">
      <Link href="/lifescience">
        <button className="bg-gray-700 px-4 py-2 rounded">
          LifeSciences
        </button>
      </Link>
      <span>Rover Control</span>
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
              <label className="text-gray-500">Latitude</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">20.667409</div>
            </div>
            <div>
              <label className="text-gray-500">Longitude</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">-103.464555</div>
            </div>
            <div>
              <label className="text-gray-500">Elevation</label>
              <div className="bg-gray-200 rounded p-2 text-gray-800">--</div>
            </div>
          </div>
        </div>

        {/* Instruments */}
        <div className="flex justify-around items-center mt-4">
          {/* Speedometer Component */}
          <div className="text-center">
            <Speedometer />
            <p className="mt-2 text-sm">Speedometer</p>
          </div>
          {/* Stopwatch */}
          <div className="text-center">
           <Stopwatch/>
            <p className="mt-2 text-sm">Stopwatch</p>
          </div>
          {/* Compass */}
          <div className="text-center">
            <Compass/>
            <p className="mt-2 text-sm">Compass</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
