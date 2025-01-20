import React, { useState } from 'react';
import supabase from '../api/supabase'; // Asegúrate de importar tu cliente Supabase correctamente

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpia los mensajes previos
    setMessage('');
    setError('');

    if (!email) {
      setError('Por favor, introduce tu correo electrónico.');
      return;
    }

    try {
      // Llama a la API de Supabase para enviar el correo de restablecimiento
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/reset-password', // Cambia esta URL según tu configuración
      });

      if (error) {
        setError('Ocurrió un error al intentar enviar el enlace. Intenta nuevamente.');
        console.error(error.message);
      } else {
        setMessage('Se ha enviado un enlace de restablecimiento de contraseña a tu correo.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">¿Olvidaste tu contraseña?</h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Introduce tu correo electrónico"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Enviar enlace de restablecimiento
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline">Volver a iniciar sesión</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
