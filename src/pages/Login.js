// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../api/supabase';  // Importa tu cliente Supabase

const Login = () => {
  const navigate = useNavigate();

  // Estado para manejar los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Estado para manejar errores
  const [error, setError] = useState('');

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!formData.email || !formData.password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    // Limpia el error antes de intentar iniciar sesión
    setError('');

    try {
      // Usar Supabase para autenticar al usuario
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);  // Muestra el mensaje de error de Supabase
      } else {
        // Si la autenticación es exitosa, redirige al usuario
        navigate('/');  // Cambia esta URL si tienes otro destino
      }
    } catch (error) {
      setError('Ocurrió un error, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ingrese su correo electrónico"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
