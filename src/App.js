import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

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
import Search from './components/Search'
import CompletarPerfil from './pages/CompletarPerfil';
import CrearTienda from './pages/auth/tienda/Crear';
import PerfilUsuario from './pages/auth/usuarios/PerfilUsuario';
import CrearUsuario from './pages/auth/usuarios/Crear';
import Tienda from './pages/auth/tienda/Tienda';

import supabase from './api/supabase';
import { CategoriesSidebar } from './components/CategoriesSidebar';
import { RestaurantCard } from './components/RestaurantCard';
import Footer from './components/Footer';

const categories = [
  { name: 'Restaurantes', slug: 'restaurantes', image: '/placeholder.svg?height=200&width=300' },
  { name: 'Comida Rápida', slug: 'market', image: '/placeholder.svg?height=200&width=300' },
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
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        console.log('Usuario obtenido:', data.user);

        setUser(data.user);

        // Verificamos si el usuario tiene rol
        if (data.user) {
          const { data: roleData, error: roleError } = await supabase
            .from('roles_usuarios')
            .select('rol_id')
            .eq('user_id', data.user.id)
            .single();

          if (roleError) {
            console.error('Error al obtener el rol:', roleError);
          } else {
            setRole(roleData?.rol_id);
          }
        }

        setLoading(false); // Cargado finalizado
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        setLoading(false);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (loading) return;  // No hacer nada si estamos cargando aún

    // Si el usuario está autenticado y no tiene rol, redirigir a completar perfil
    if (user && (role === null || role === undefined)) {
      if (location.pathname !== '/completar-perfil') {
        setRedirectTo(location.pathname);
        navigate('/completar-perfil');
      }
    } else if (redirectTo) {
      navigate(redirectTo);  // Redirige a la página original después de completar el perfil
    }
  }, [role, navigate, location, redirectTo, loading, user]);

  if (loading) {
    return (
      <div className="loading-screen">
        <ClipLoader color="#3498db" loading={loading} size={50} />
      </div>  // Aquí puedes agregar un spinner o un mensaje de carga
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} role={role} />
      <main className="container mx-auto px-4 py-8">
        {user && (
          <div className="text-xl font-semibold">
            <p>
              ¡Hola, {role ? `Rol: ${role}` : 'Usuario sin rol'}!
            </p>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <>
              <CategoryList categories={categories} />
              <SuggestionList suggestions={suggestions} />
              <PromotionList />
            </>
          } />
          <Route path="/search" element={
            <>
              <Search />
              
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
          <Route path="/search" element={<Search />} />

          {/* rutas protegidas */}
          <Route path="/completar-perfil" element={<CompletarPerfil />} />
          <Route path="/tienda/crear" element={<CrearTienda />} />
          <Route path="/tienda/perfil" element={<Tienda />} />
          <Route path="/usuarios/crear" element={<CrearUsuario />} />
          <Route path="/usuarios/perfil" element={<PerfilUsuario />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/admin/productos/crear" element={<CreateProduct />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
