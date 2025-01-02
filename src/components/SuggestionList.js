import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";  // Cambia el Link dependiendo de tu entorno
import supabase from "../api/supabase";  // Asegúrate de importar la instancia de supabase

export default function SuggestionList() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener las tiendas desde Supabase
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);  // Comienza la carga

        // Consulta a la tabla "tienda" para obtener las tiendas con un límite de 5
        const { data, error } = await supabase
          .from("tienda")
          .select("id, nombre, logo, precio_envio")
          .limit(5);  // Limitamos la consulta a 5 registros

        if (error) {
          console.error("Error al obtener tiendas:", error);
        } else {
          setSuggestions(data);  // Almacenamos las tiendas en el estado
        }
      } catch (error) {
        console.error("Error al obtener tiendas:", error);
      } finally {
        setLoading(false);  // Finaliza la carga
      }
    };

    fetchSuggestions();
  }, []);

  

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Te sugerimos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion.id}  // Usamos "id" como clave única
            to={`/restaurant/${suggestion.id}`}  // Ajusta el uso de Link dependiendo de tu entorno
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative mb-4">
              <img
                src={suggestion.logo}  // Usamos el logo de la tienda
                alt={suggestion.nombre}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-sm text-gray-600">
              Envío C$ {suggestion.precio_envio}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
