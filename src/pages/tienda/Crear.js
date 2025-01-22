import React, { useState, useEffect } from 'react';
import supabase from '../../api/supabase';
import HorarioForm from '../../components/tienda/HorarioForm'; // Importa el componente

export default function Tienda() {
  const [user, setUser] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    logo: null,
    imagenFondo: null,
    categoriaId: '',
    latitud: '',
    longitud: '',
    aceptaTarjeta: null,
    horarios: [
      { dia: 'lunes', apertura: '', cierre: '', activo: false },
      { dia: 'martes', apertura: '', cierre: '', activo: false },
      { dia: 'miércoles', apertura: '', cierre: '', activo: false },
      { dia: 'jueves', apertura: '', cierre: '', activo: false },
      { dia: 'viernes', apertura: '', cierre: '', activo: false },
      { dia: 'sábado', apertura: '', cierre: '', activo: false },
      { dia: 'domingo', apertura: '', cierre: '', activo: false },
    ],
  });


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error al obtener el usuario:', error);
      } else {
        setUser(user);
      }
    };

    fetchUser();

    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('categoria_tienda')
        .select('id, nombre');
      if (error) console.error('Error cargando categorías:', error);
      else setCategorias(data);
    };

    fetchCategorias();

    // Obtener la ubicación del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
          alert('No se pudo obtener la ubicación. Por favor, habilita el acceso a la ubicación.');
        }
      );
    } else {
      alert('La geolocalización no es compatible con este navegador.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setFormData((prev) => ({ ...prev, horarios: newHorarios }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes estar autenticado para registrar una tienda.');
      return;
    }

    try {
      // Insertar tienda con la URL proporcionada
      const { data: tiendaData, error: tiendaError } = await supabase
        .from('tienda')
        .insert({
          nombre: formData.nombre,
          logo: formData.logo, // URL ingresada por el usuario
          imagen_fondo: formData.imagenFondo,
          categoria_id: formData.categoriaId,
          latitud: parseFloat(formData.latitud),
          longitud: parseFloat(formData.longitud),
          propietario_id: user.id,
          acepta_tarjeta: formData.aceptaTarjeta,
        })
        .select();

      if (tiendaError) throw tiendaError;

      // Resto del código...
      alert('Tienda registrada exitosamente.');
    } catch (error) {
      console.error('Error al registrar la tienda:', error);
      alert('Ocurrió un error al registrar la tienda.');
    }
  };



  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Registrar Tienda</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la tienda</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="categoriaId" className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="latitud" className="block text-sm font-medium text-gray-700">Latitud</label>
          <input
            type="text"
            id="latitud"
            name="latitud"
            value={formData.latitud}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            placeholder="Latitud obtenida automáticamente"
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="longitud" className="block text-sm font-medium text-gray-700">Longitud</label>
          <input
            type="text"
            id="longitud"
            name="longitud"
            value={formData.longitud}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            placeholder="Longitud obtenida automáticamente"
            readOnly
          />
        </div>


        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">URL del Logo</label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={formData.logo || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
            placeholder="Ingresa la URL del logo"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>


        <div className="mb-4">
          <label htmlFor="aceptaTarjeta" className="block text-sm font-medium text-gray-700">¿Acepta Tarjetas?</label>
          <select
            id="aceptaTarjeta"
            name="aceptaTarjeta"
            value={formData.aceptaTarjeta || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, aceptaTarjeta: e.target.value === 'true' }))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>

        <HorarioForm horarios={formData.horarios} onHorarioChange={handleHorarioChange} />

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Registrar Tienda
          </button>
        </div>
      </form>
    </div>
  );
}
