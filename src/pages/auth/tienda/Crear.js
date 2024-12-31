import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://ynwkrvwxapjvfqgjkhfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud2tydnd4YXBqdmZxZ2praGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1Nzk5ODMsImV4cCI6MjA1MTE1NTk4M30.gCe9ZbGxjJjJJElcV51Vz5Pk_ZhLX0FHoXbiamB3DFs';

// Inicializar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Tienda() {
  const user = useUser();
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    logo: null,
    imagenFondo: null,
    categoriaId: '',
    latitud: '',
    longitud: '',
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
    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          latitud: position.coords.latitude.toString(),
          longitud: position.coords.longitude.toString(),
        }));
      }, (error) => {
        console.error("Error obteniendo la ubicación:", error);
      });
    }

    // Cargar categorías desde Supabase
    const fetchCategorias = async () => {
      const { data, error } = await supabase
        .from('categoria_tienda')
        .select('id, nombre');
      if (error) console.error('Error cargando categorías:', error);
      else setCategorias(data);
    };

    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorarios = [...formData.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setFormData(prev => ({ ...prev, horarios: newHorarios }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes estar autenticado para registrar una tienda.');
      return;
    }

    // Insertar la tienda
    const { data: tiendaData, error: tiendaError } = await supabase
      .from('tienda')
      .insert({
        nombre: formData.nombre,
        logo: formData.logo,
        imagen_fondo: formData.imagenFondo,
        categoria_id: formData.categoriaId,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        propietario_id: user.id,
      })
      .select();

    if (tiendaError) {
      console.error('Error al registrar la tienda:', tiendaError);
      alert('Error al registrar la tienda');
      return;
    }

    // Insertar los horarios
    const horariosToInsert = formData.horarios
      .filter(h => h.activo)
      .map(h => ({
        tienda_id: tiendaData[0].id,
        dia: h.dia,
        hora_inicio: h.apertura,
        hora_fin: h.cierre,
      }));

    const { error: horariosError } = await supabase
      .from('horarios_tienda')
      .insert(horariosToInsert);

    if (horariosError) {
      console.error('Error al registrar los horarios:', horariosError);
      alert('Error al registrar los horarios');
      return;
    }

    alert('Tienda registrada exitosamente');
    // Aquí podrías redirigir al usuario o limpiar el formulario
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
          <h3 className="text-sm font-medium text-gray-700">Horario de Atención</h3>
          {formData.horarios.map((horario, index) => (
            <div key={horario.dia} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={horario.activo}
                onChange={(e) => handleHorarioChange(index, 'activo', e.target.checked)}
              />
              <span className="w-24">{horario.dia}</span>
              <input
                type="time"
                value={horario.apertura}
                onChange={(e) => handleHorarioChange(index, 'apertura', e.target.value)}
                disabled={!horario.activo}
                className="p-1 border border-gray-300 rounded"
              />
              <span>a</span>
              <input
                type="time"
                value={horario.cierre}
                onChange={(e) => handleHorarioChange(index, 'cierre', e.target.value)}
                disabled={!horario.activo}
                className="p-1 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="latitud"
              value={formData.latitud}
              onChange={handleInputChange}
              placeholder="Latitud"
              className="p-2 border border-gray-300 rounded"
              readOnly
            />
            <input
              type="text"
              name="longitud"
              value={formData.longitud}
              onChange={handleInputChange}
              placeholder="Longitud"
              className="p-2 border border-gray-300 rounded"
              readOnly
            />
          </div>
        </div>

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

