import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { CafeHeader } from '../components/store/TiendaHeader'
import { CategoryTabs } from '../components/store/CategoryTabs'
import { ProductList } from '../components/store/ProductList'
import { CartSidebar } from '../components/store/CartSidebar'
import { AddToCartModal } from '../components/store/AddToCartModal'
import { CheckoutModal } from '../components/store/CheckOutModal'
import { useToast } from "../components/ui/toast"
import supabase from '../api/supabase';

export default function Tienda() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { toast } = useToast();
  const { nombreTienda } = useParams();
  const [tiendaData, setTiendaData] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    // Cargar carrito desde localStorage al inicializar
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error al cargar el carrito desde localStorage:", error);
      return [];
    }
  });

  // Sincronizar carrito con localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cart]);

  // // Recuperar carrito desde localStorage al iniciar
  // useEffect(() => {
  //   const storedCart = localStorage.getItem("cart");
  //   if (storedCart) {
  //     setCart(JSON.parse(storedCart));
  //   }
  // }, []);

  // // Guardar carrito en localStorage cada vez que cambie
  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);

  useEffect(() => {
    async function fetchTiendaData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("tienda")
        .select(`
          id,
          nombre,
          calificacion,
          productos (
            id,
            nombre,
            descripcion,
            precio,
            imagen,
            categoria_id
          ),
          categorias:productos!inner(categoria_id)
        `)
        .eq("nombre", decodeURIComponent(nombreTienda))
        .single();

      if (error) {
        console.error("Error fetching tienda data:", error);
      } else {
        setTiendaData({
          id: data.id,
          nombre: data.nombre,
          calificacion: data.calificacion,
        });
        setProductos(data.productos || []);
        setCategorias([...new Set(data.productos.map(p => p.categoria_id))]);
        setActiveCategory(data.productos[0]?.categoria_id || null);
      }

      setLoading(false);
    }

    fetchTiendaData();
  }, [nombreTienda]);

  if (loading) return <div>Cargando...</div>;
  if (!tiendaData) return <div>No se encontró la tienda.</div>;
  console.log("Tienda ID en Tienda.jsx:", tiendaData.id);


  const openAddToCartModal = (product) => {
    setSelectedProduct(product)
    setIsAddToCartModalOpen(true)
  }

  const closeAddToCartModal = () => {
    setIsAddToCartModalOpen(false)
    setSelectedProduct(null)
  }

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };


  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // const openCheckoutModal = () => {
  //   setIsCheckoutModalOpen(true)
  // }

  // const closeCheckoutModal = () => {
  //   setIsCheckoutModalOpen(false)
  // }

  // const completeOrder = () => {
  //   console.log("Pedido completado:", cart);
  //   setCart([]); // Limpia el carrito tras finalizar el pedido
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-grow">
        <CafeHeader cafe={tiendaData} />
        <main className="container mx-auto px-4 py-8">
          <CategoryTabs
            categories={categorias}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <ProductList
            products={productos.filter((p) => p.categoria_id === activeCategory)}
            onAddToCart={(product) => {
              setSelectedProduct(product);
              setIsAddToCartModalOpen(true);
            }}
          />
        </main>

      </div>

      <CartSidebar

        cart={cart}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
        onCheckout={() => setIsCheckoutModalOpen(true)}
        tiendaId={tiendaData?.id} // Asegúrate de pasar correctamente el ID de la tienda
      />

      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        product={selectedProduct}
        onAddToCart={(product, quantity) => {
          addToCart(product, quantity);
          setIsAddToCartModalOpen(false);
        }}
      />
      {/* <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        onCompleteOrder={completeOrder}
      /> */}
    </div>
  );
}

