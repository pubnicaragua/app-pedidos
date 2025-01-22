import { useState, useEffect } from "react";
import supabase from "../../api/supabase"; // Asegúrate de tener correctamente configurado supabase
import { useNavigate } from "react-router-dom";

export default function CrearUsuario() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    direccion: "",
    ubicacion: "", // En formato "latitud,longitud"
    metodoPago: "contra entrega",
    tarjeta: {
      numero: "",
      vencimiento: "",
      cvv: ""
    },
    imagen: null
  });

  const [usuarioCreado, setUsuarioCreado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setLatitud(lat);
          setLongitud(lon);

          setFormData((prevData) => ({
            ...prevData,
            ubicacion: `${lat},${lon}` // Guardamos latitud y longitud como un string
          }));
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          alert("No se pudo obtener la ubicación.");
        }
      );
    } else {
      alert("La geolocalización no está soportada en este navegador.");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMetodoPagoChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      metodoPago: value,
      tarjeta: { numero: "", vencimiento: "", cvv: "" }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Subir la imagen si es que se ha seleccionado una
    let imagenUrl = null;
    if (formData.imagen) {
      const file = formData.imagen;
      const { data, error: uploadError } = await supabase.storage
        .from("imagenes")
        .upload(`perfil/${file.name}`, file);

      if (uploadError) {
        console.error("Error al subir la imagen:", uploadError.message);
        setLoading(false);
        return;
      }

      imagenUrl = data?.Key ? `https://your-supabase-url/storage/v1/object/public/imagenes/${data.Key}` : null;
    }

    // Extraer latitud y longitud de formData.ubicacion
    const [lat, lon] = formData.ubicacion.split(',').map(Number); // Convertir a números

    // Validar que latitud y longitud sean válidos
    if (isNaN(lat) || isNaN(lon)) {
      alert("Las coordenadas no son válidas.");
      setLoading(false);
      return;
    }

    // Convertir el método de pago
    const metodoPago = formData.metodoPago === "contra entrega" ? 1 : 2;

    // Insertar en la base de datos (tabla perfil)
    const { data, error } = await supabase
      .from("perfil")
      .upsert({
        id: supabase.auth.getUser()?.id, // El id del usuario autenticado
        direccion: formData.direccion,
        metodo_pago: metodoPago,
        latitud: lat, // Guardar latitud como número
        longitud: lon, // Guardar longitud como número
        imagen: imagenUrl
      });

    if (error) {
      console.error("Error al crear el usuario:", error.message);
      alert("Error al crear el usuario.");
      setLoading(false);
      return;
    }

    setUsuarioCreado(true);
    setLoading(false);

    navigate("/usuarios/perfil");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-semibold mb-4 text-center">Crear Usuario</h1>

      {usuarioCreado && <p className="text-green-500 text-center mb-4">Usuario creado con éxito</p>}
      {loading && <p className="text-blue-500 text-center mb-4">Cargando...</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">Ubicación (Latitud, Longitud):</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            disabled
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {latitud && longitud && (
            <p className="text-sm text-gray-500 mt-2">Latitud: {latitud}, Longitud: {longitud}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">Método de pago:</label>
          <select
            id="metodoPago"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleMetodoPagoChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="contra entrega">Contra entrega</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700">Imagen (opcional):</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
