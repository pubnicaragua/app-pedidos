import { useEffect, useState } from 'react';
import { addToCart, updateCartItemQuantity, removeFromCart } from '../api/cartFunctions';

import { SearchHeader } from "../components/SearchHeader";
import { SearchFilters } from "../components/SearchFilters";
import { ProductCard } from "../components/ProductCard";
import { RestaurantCard } from "../components/RestaurantCard";
import { CategoriesSidebar } from "../components/CategoriesSidebar";
import { CartModal } from "../components/CartModal";
import { CartSummary } from "../components/CartSummary";
import supabase from '../api/supabase'; // Asegúrate de que tienes supabase correctamente configurado

export default function SearchPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [restaurants, setRestaurants] = useState([]); // Estado para los restaurantes
  const [products, setProducts] = useState([]); // Estado para los productos de la tienda seleccionada
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad
  const [error, setError] = useState(null);

  // Fetch restaurants from Supabase
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tienda')
          .select('id, nombre, logo, imagen_fondo, precio_envio, calificacion')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Elimina duplicados de la lista de restaurantes
        setRestaurants((prevRestaurants) => {
          const uniqueRestaurants = [...prevRestaurants, ...data].filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.id === value.id)
          );
          return uniqueRestaurants;
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []); // Solo se ejecuta al cargar el componente

  // Fetch products when a store is selected
  useEffect(() => {
    if (selectedStore) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('productos')
            .select('id, nombre, imagen, precio')
            .eq('tienda_id', selectedStore.id);  // Filtra por el id de la tienda seleccionada

          if (error) throw error;

          setProducts(data); // Guarda los productos obtenidos en el estado
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [selectedStore]); // Solo se ejecuta cuando se selecciona una tienda

  const handleStoreClick = (store) => {
    setSelectedStore(store);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product) => {
    // Revisamos si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
      // Si ya está, actualizamos la cantidad
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].cantidad += quantity;  // Aumentamos la cantidad
      setCart(updatedCart);
    } else {
      // Si no está, lo agregamos al carrito con la cantidad seleccionada
      setCart([...cart, { ...product, cantidad: quantity }]);
    }
    setIsModalOpen(false); // Cerrar el modal
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
        <div className="flex gap-6">
          <SearchFilters />

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
                  {/* Verificamos que los productos estén disponibles */}
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
                  {/* Renderizamos la lista de restaurantes */}
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} onClick={() => handleStoreClick(restaurant)}>
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="w-72">
            <CartSummary cart={cart} onContinue={handleContinue} />
            <CategoriesSidebar />
          </div>
        </div>
      </main>

      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        quantity={quantity}  // Pasamos la cantidad
        setQuantity={setQuantity}  // Pasamos la función para cambiar la cantidad
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
