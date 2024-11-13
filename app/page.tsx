// Import necessary modules
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-1/4 p-4">
        <h1 className="text-lg font-bold mb-4">Camera Feed</h1>
        {/* Camera Views */}
        <div className="space-y-4">
          {['Isometric View', 'Rear View', 'Arm View', 'Side View'].map((view, index) => (
            <div key={index} className="relative">
              <img src="/path/to/sample-image.jpg" alt={`${view} Image`} className="w-full h-24 object-cover rounded" />
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                {view}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-black text-white px-6 py-3 rounded-lg">
          <button className="bg-gray-700 px-4 py-2 rounded">Dashboard</button>
          <span>Rover Control</span>
          <div className="bg-gray-700 w-8 h-8 rounded-full" />
        </div>

        {/* Camera Feed and Instruments */}
        <div className="grid grid-cols-3 gap-4">
          {/* Main Camera View */}
          <div className="col-span-2 relative">
            <img src="/path/to/main-camera-image.jpg" alt="Front View" className="w-full h-full object-cover rounded" />
            <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Scale
            </span>
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
              Front View
            </span>
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
          {/* Speedometer */}
          <div className="text-center">
            <img src="/path/to/speedometer.png" alt="Speedometer" className="w-24 h-24 mx-auto" />
            <p className="mt-2 text-sm">Speedometer</p>
          </div>
          {/* Stopwatch */}
          <div className="text-center">
            <img src="/path/to/stopwatch.png" alt="Stopwatch" className="w-24 h-24 mx-auto" />
            <p className="mt-2 text-sm">Stopwatch</p>
          </div>
          {/* Compass */}
          <div className="text-center">
            <img src="/path/to/compass.png" alt="Compass" className="w-24 h-24 mx-auto" />
            <p className="mt-2 text-sm">Compass</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
