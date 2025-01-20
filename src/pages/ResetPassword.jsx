import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../api/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();

  // Estados para las contraseñas y mensajes
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Extrae el token de la URL al cargar la vista
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const recoveryToken = queryParams.get('token');

    if (recoveryToken) {
      setToken(recoveryToken);
    } else {
      setError('Token no válido. Intenta de nuevo.');
    }
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (!password || !confirmPassword) {
      setError('Por favor, ingresa y confirma tu nueva contraseña.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Limpia errores previos
    setError('');
    setMessage('');

    try {
      // Llama a Supabase para actualizar la contraseña
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError('No se pudo actualizar la contraseña. Intenta nuevamente.');
        console.error(error.message);
      } else {
        setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 3000); // Redirige después de 3 segundos
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Restablecer Contraseña</h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ingresa tu nueva contraseña"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Restablecer Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
