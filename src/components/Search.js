import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { SearchFilters } from "./SearchFilters";
import { RestaurantCard } from "./RestaurantCard";
import { CategoriesSidebar } from "./CategoriesSidebar";
import supabase from '../api/supabase'; // Asegúrate de que tienes supabase correctamente configurado

export default function SearchPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Carrito en el estado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const { category: categoryId } = useParams(); // `categoryId` será el ID numérico // Captura la categoría desde la URL dinámica
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  // Cargar carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que se actualiza
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const fetchStoresOrProducts = async () => {
      try {
        setLoading(true);
        let data, error;
  
        if (categoryId) {
          // Consulta por categoría
          ({ data, error } = await supabase
            .from("tienda")
            .select("*")
            .eq("categoria_id", categoryId));
        } else if (query) {
          // Consulta por búsqueda de productos o tiendas
          ({ data, error } = await supabase
            .rpc("search_stores_by_category", { query }));
        }
  
        if (error) throw error;
  
        setRestaurants(data); // Almacena los resultados
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStoresOrProducts();
  }, [categoryId, query]);
  


  useEffect(() => {
    if (selectedStore) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('productos')
            .select('id, nombre, imagen, precio')
            .eq('tienda_id', selectedStore.id);

          if (error) throw error;

          setProducts(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [selectedStore]);

  const handleStoreClick = (store) => {
    setSelectedStore(store);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filtros de búsqueda en móviles y tabletas */}
          <div className="md:w-1/4 mb-6 md:mb-0">
            <SearchFilters />
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {selectedStore ? (
              <div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="mb-4 p-2 bg-blue-500 text-white rounded"
                >
                  Volver a las tiendas
                </button>
                <h2 className="text-lg font-semibold mb-4">{selectedStore.nombre}</h2>

              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Restaurantes</h2>
                <div className="space-y-4">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </div>

            )}
          </div>

          {/* Sidebar con resumen del carrito */}
          <div className="w-full md:w-72 mt-6 md:mt-0">
            <CategoriesSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
