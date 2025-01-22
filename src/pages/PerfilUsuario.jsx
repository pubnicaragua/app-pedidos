import React, { useEffect, useState } from "react";
import supabase from "../api/supabase"; // Asegúrate de que esta importación sea correcta

// Función para obtener el usuario autenticado
const obtenerUsuario = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};

// Función para obtener el perfil del usuario
const obtenerPerfil = async (userId) => {
  const { data, error } = await supabase
    .from("perfil")
    .select("direccion, metodo_pago, latitud, longitud, imagen")
    .eq("id", userId)
    .single(); // Usamos `.single()` para asegurarnos de que solo hay un registro

  if (error) {
    throw error;
  }
  return data;
};

// Función para actualizar el perfil
const actualizarPerfil = async (userId, perfilData) => {
  const { data, error } = await supabase
    .from("perfil")
    .update(perfilData)
    .eq("id", userId);

  if (error) {
    throw error;
  }
  return data;
};

export default function PerfilUsuario() {
  const [perfil, setPerfil] = useState(null); // Para almacenar los datos del perfil
  const [usuario, setUsuario] = useState(null); // Para almacenar los datos del usuario (auth)
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Para mostrar errores
  const [isEditing, setIsEditing] = useState(false); // Para controlar si estamos en modo de edición
  const [formData, setFormData] = useState({
    direccion: "",
    metodo_pago: 1, // Contra entrega por defecto
    imagen: null,
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Primero, obtenemos los datos del usuario autenticado
        const usuarioData = await obtenerUsuario();
        if (!usuarioData) {
          setError("No estás autenticado.");
          setLoading(false);
          return;
        }

        // Guardamos los datos del usuario
        setUsuario(usuarioData);

        // Luego, obtenemos los datos del perfil
        const perfilData = await obtenerPerfil(usuarioData.id);
        setPerfil(perfilData); // Guardamos los datos del perfil

        // Inicializamos el formulario con los datos del perfil
        setFormData({
          direccion: perfilData.direccion || "",
          metodo_pago: perfilData.metodo_pago || 1,
          imagen: perfilData.imagen || null,
        });
      } catch (error) {
        setError(error.message || "Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparamos los datos del formulario
    const updatedProfile = { ...formData };

    // Si la imagen está cambiando, podrías cargarla a Supabase Storage antes de guardar el URL
    if (updatedProfile.imagen) {
      const filePath = `${usuario.id}/${updatedProfile.imagen.name}`;
      const { error: uploadError } = await supabase.storage
        .from("profiles") // Asumiendo que tienes un bucket "profiles"
        .upload(filePath, updatedProfile.imagen);

      if (uploadError) {
        setError("Error al cargar la imagen.");
        return;
      }

      const { publicURL } = supabase.storage.from("profiles").getPublicUrl(filePath);
      updatedProfile.imagen = publicURL; // Guardamos la URL pública de la imagen
    }

    // Ahora actualizamos los datos en la tabla 'perfil'
    try {
      await actualizarPerfil(usuario.id, updatedProfile);
      setIsEditing(false); // Salimos del modo de edición
      setPerfil(updatedProfile); // Actualizamos el estado local con los nuevos datos
    } catch (error) {
      setError("Error al actualizar el perfil.");
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-semibold mb-4 text-center">Perfil de Usuario</h1>

      {/* Mostrar imagen si existe */}
      {perfil?.imagen && !isEditing && (
        <div className="mb-4 text-center">
          <img
            src={perfil.imagen}
            alt="Imagen del perfil"
            className="w-32 h-32 rounded-full mx-auto"
          />
        </div>
      )}

      {/* Si estamos en modo de edición, mostramos los campos de formulario */}
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Método de pago:</label>
            <select
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={1}>Contra entrega</option>
              <option value={2}>Tarjeta</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Imagen (opcional):</label>
            <input
              type="file"
              name="imagen"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Guardar Cambios
          </button>
        </form>
      ) : (
        // Si no estamos en modo de edición, mostramos los datos de solo lectura
        <>
          {/* Datos del usuario (nombre, email, teléfono) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre:</label>
            <p className="mt-1 text-gray-600">{usuario?.user_metadata?.full_name || "No proporcionado"}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <p className="mt-1 text-gray-600">{usuario?.email || "No proporcionado"}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Teléfono:</label>
            <p className="mt-1 text-gray-600">{usuario?.user_metadata?.phone || "No proporcionado"}</p>
          </div>

          {/* Datos del perfil (dirección, método de pago, ubicación) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dirección:</label>
            <p className="mt-1 text-gray-600">{perfil?.direccion || "No proporcionada"}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Método de pago:</label>
            <p className="mt-1 text-gray-600">
              {perfil?.metodo_pago === 1 ? "Contra entrega" : perfil?.metodo_pago === 2 ? "Tarjeta" : "No especificado"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ubicación:</label>
            <p className="mt-1 text-gray-600">
              {perfil?.latitud && perfil?.longitud
                ? `Latitud: ${perfil.latitud}, Longitud: ${perfil.longitud}`
                : "No disponible"}
            </p>
          </div>

          {/* Botón para editar */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Editar Perfil
          </button>
        </>
      )}
    </div>
  );
}
