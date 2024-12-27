import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/users" className="block py-2 px-4 rounded hover:bg-gray-700">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
              Pedidos
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
              Ajustes
            </Link>
          </li>
          <li>
            <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
              Reportes
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
