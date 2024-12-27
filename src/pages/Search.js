import { useState } from 'react';
import { SearchHeader } from "../components/SearchHeader"
import { SearchFilters } from "../components/SearchFilters"
import { ProductCard } from "../components/ProductCard"
import { RestaurantCard } from "../components/RestaurantCard"
import { CategoriesSidebar } from "../components/CategoriesSidebar"
import { CartModal } from "../components/CartModal"
import { CartSummary } from "../components/CartSummary"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { X } from 'lucide-react'

export default function SearchPage() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const restaurants = [
    {
      name: "Fiero Pizza",
      image: "/placeholder.svg?height=96&width=96",
      deliveryTime: "45-65 min",
      deliveryFee: "NaN",
      rating: 4.5,
      sponsored: true,
      products: [
        { name: "Pizza Margarita", price: 120, image: "/placeholder.svg" },
        { name: "Pizza Pepperoni", price: 150, image: "/placeholder.svg" },
      ],
    },
    {
      name: "Entre Amigos - Los Robles",
      image: "/placeholder.svg?height=96&width=96",
      deliveryTime: "45-65 min",
      deliveryFee: "NaN",
      rating: 5.0,
      sponsored: true,
      isNew: true,
      products: [
        { name: "Tacos al Pastor", price: 100, image: "/placeholder.svg" },
        { name: "Burritos", price: 130, image: "/placeholder.svg" },
      ],
    },
    {
      name: "Little Caesars Gran Vía",
      image: "/placeholder.svg?height=96&width=96",
      deliveryTime: "40-60 min",
      deliveryFee: "NaN",
      rating: 4.6,
      sponsored: true,
      products: [
        { name: "Pizza de 4 Quesos", price: 140, image: "/placeholder.svg" },
        { name: "Pizza Hawaiana", price: 160, image: "/placeholder.svg" },
      ],
    },
  ];

  const handleStoreClick = (store) => {
    setSelectedStore(store);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);  // Actualiza el carrito con el nuevo producto
    setIsModalOpen(false);  // Cierra el modal después de agregar al carrito
  };

  const handleContinue = () => {
    console.log('Continuar con la compra');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6 justify-center">
          <div className="flex gap-1 flex-1 max-w-xl relative items-center">
            <Input
              type="search"
              placeholder="Buscar"
              defaultValue="pizza"
              className="pr-10 w-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <div className="flex items-center ">
                <X className="h-4 w-4" />
                <span className="ml-2">Cerrar</span>
              </div>
            </Button>
          </div>
        </div>



        <div className="flex gap-6">
          <SearchFilters />

          <div className="flex-1">
            {selectedStore ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">{selectedStore.name}</h2>
                <div className="space-y-4">
                  {selectedStore.products.map((product) => (
                    <div
                      key={product.name}
                      onClick={() => handleOpenModal(product)}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">43 Resultados</h2>
                <div className="space-y-4">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant.name}
                      onClick={() => handleStoreClick(restaurant)}
                    >
                      <RestaurantCard restaurant={restaurant} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-72">
            {/* Carrito */}
            <CartSummary cart={cart} onContinue={handleContinue} />
            <CategoriesSidebar />
          </div>

        </div>
      </main>

      {/* Modal para agregar al carrito */}
      <CartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
