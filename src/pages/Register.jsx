import React, { useState } from 'react';
import supabase from '../api/supabase'; 

const Register = () => {
 // Estado para manejar los campos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Estado para manejar errores
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

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
      setError('Por favor, completa todos los campos.');
      return;
    }

    setError('');
    setSuccessMessage(''); // Limpiar cualquier mensaje de éxito previo

    try {
      // Registrar al usuario con Supabase
      const { error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      // Verificar si hay un error en el registro
      if (signupError) {
        console.error('Error al registrar el usuario:', signupError);
        setError(signupError.message);
        return;
      }

      // Mensaje de éxito
      setSuccessMessage('¡Registro exitoso! Por favor, verifica tu correo electrónico.');

    } catch (error) {
      console.error('Error en el proceso de registro:', error); // Mostrar el error completo en consola
      setError('Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>} {/* Mensaje de éxito */}

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
            Registrarse
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
