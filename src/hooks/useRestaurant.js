// hooks/useRestaurants.js
import { useState, useEffect } from 'react';
import supabase from '../api/supabase'; // Asegúrate de tener la configuración correcta

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const { data, error } = await supabase
          .from('tienda') // Nombre de la tabla en Supabase
          .select('id, nombre, logo, imagen_fondo, precio_envio, calificacion');

        if (error) throw error;

        setRestaurants(data); // Almacena los restaurantes en el estado
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []); // Solo se ejecuta una vez cuando se monta el componente

  return { restaurants, loading, error };
}
