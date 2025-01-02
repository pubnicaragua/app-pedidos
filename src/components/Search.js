import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addToCart, updateCartItemQuantity, removeFromCart } from '../api/cartFunctions';

import { SearchFilters } from "./SearchFilters";
import { ProductCard } from "./ProductCard";
import { RestaurantCard } from "./RestaurantCard";
import { CategoriesSidebar } from "./CategoriesSidebar";
import { CartModal } from "./CartModal";
import { CartSummary } from "./CartSummary";
import supabase from '../api/supabase'; // Asegúrate de que tienes supabase correctamente configurado

export default function SearchPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

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
                <div className="space-y-4">
                  {/* Mostrar productos de la tienda seleccionada */}
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} onClick={() => handleOpenModal(product)}>
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    <div>No hay productos disponibles.</div>
                  )}
                </div>
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
            <CartSummary cart={cart} onContinue={handleContinue} />
            <CategoriesSidebar />
          </div>
        </div>
      </main>

      {/* Modal de carrito */}
      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
