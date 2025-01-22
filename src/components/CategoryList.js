import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../api/supabase';  // Asegúrate de tener configurado supabase correctamente
import { ClipLoader } from 'react-spinners';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las categorías desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);  // Comienza la carga
        const { data, error } = await supabase
          .from('categoria_tienda')
          .select('id, nombre, imagen');  // Seleccionamos los campos necesarios

        if (error) {
          console.error('Error al obtener categorías:', error);
        } else {
          setCategories(data);  // Guardamos las categorías en el estado
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      } finally {
        setLoading(false);  // Finaliza la carga
      }
    };

    fetchCategories();
  }, []);

  // Mientras se están cargando las categorías, muestra un cargador
  if (loading) {
    return (
      <div className="loading-screen">
        <ClipLoader color="#3498db" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Hola. ¿Qué vas a pedir hoy?</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            className="relative overflow-hidden rounded-lg aspect-[4/3] group"
            key={category.id}
            to={`/category/${category.id}`} // URL dinámica
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            <img
              src={category.imagen}
              alt={category.nombre}
              className="object-cover w-full h-full"
            />
            <span className="absolute bottom-3 left-3 text-white font-medium">{category.nombre}</span>
          </Link>

        ))}
      </div>
    </section>
  );
}
