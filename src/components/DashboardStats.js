import React from 'react';

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold">Total Users</h3>
        <p className="text-xl mt-2">1,245</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold">Revenue</h3>
        <p className="text-xl mt-2">$25,540</p>
      </div>
      <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold">Orders Today</h3>
        <p className="text-xl mt-2">312</p>
      </div>
    </div>
  );
}
