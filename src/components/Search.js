import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
    const fetchStores = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .rpc('search_stores_by_category', { query })
          .select('*');

        if (error) throw error;

        setRestaurants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchStores();
    }
  }, [query]);

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

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].cantidad += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, cantidad: quantity }]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const handleContinue = () => {
    console.log('Continuar con la compra');
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
                  {/* Mostrar restaurantes */}
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} onClick={() => handleStoreClick(restaurant)}>
                      <RestaurantCard restaurant={restaurant} />
                    </div>
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
