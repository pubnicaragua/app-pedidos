// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Solo importa Routes y Route, no el Router
import Header from './components/Header';
import CategoryList from './components/CategoryList';
import SuggestionList from './components/SuggestionList';
import PromotionList from './components/PromotionList';
import Sidebar from './components/Sidebar';
import Dashboard from './components/DashboardStats';
import Register from './pages/Register';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import CreateProduct from './components/CreateProduct';

const categories = [
  { name: 'Restaurantes', slug: 'restaurantes', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Market', slug: 'market', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Mercados', slug: 'mercados', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Café', slug: 'cafe', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Salud', slug: 'salud', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Mascotas', slug: 'mascotas', image: '/placeholder.svg?height=200&width=300' },
];

const suggestions = [
  { name: 'Restaurant 1', slug: 'restaurant-1', logo: '/placeholder.svg?height=200&width=200', deliveryFee: 9 },
  { name: 'Restaurant 2', slug: 'restaurant-2', logo: '/placeholder.svg?height=200&width=200', deliveryFee: 15 },
  { name: 'Restaurant 3', slug: 'restaurant-3', logo: '/placeholder.svg?height=200&width=200', deliveryFee: 19 },
  { name: 'Restaurant 4', slug: 'restaurant-4', logo: '/placeholder.svg?height=200&width=200', deliveryFee: 25 },
  { name: 'Restaurant 5', slug: 'restaurant-5', logo: '/placeholder.svg?height=200&width=200', deliveryFee: 9 },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto px-4 py-8">
        <Routes> {/* Usa Routes aquí, sin necesidad de Router */}
          <Route path="/" element={
            <>
            <Header />
              <CategoryList categories={categories} />
              <SuggestionList suggestions={suggestions} />
              <PromotionList />
            </>
          } />
          
          <Route path="/admin" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1 p-6">
                <Dashboard />
                
              </div>
            </div>
          } />
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/carrito" element={<Carrito />} />

          <Route path="/admin/productos/crear" element={<CreateProduct />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
