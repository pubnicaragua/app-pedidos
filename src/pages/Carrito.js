import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, MapPin, CreditCard, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

const Cart = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(location.state ? location.state.cart : []);

  // Static user information
  const user = {
    name: "Juan Pérez",
    address: "Calle Principal 123, Managua, Nicaragua",
    paymentMethod: "Visa terminada en 1234"
  };

  // Función para eliminar un item del carrito
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  // Función para calcular el total
  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Función para agregar un producto al carrito o actualizar la cantidad
  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      // Verifica si el producto ya está en el carrito
      const existingProductIndex = prevCartItems.findIndex(item => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, solo actualiza la cantidad
        const updatedCart = [...prevCartItems];
        updatedCart[existingProductIndex].quantity += 1; // Aumenta la cantidad
        return updatedCart;
      } else {
        // Si el producto no está en el carrito, lo agrega con cantidad 1
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingBag className="mr-2" />
          Tu Carrito
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center text-lg text-gray-600 bg-white p-8 rounded-lg shadow-md">
                Tu carrito está vacío. <Link to="/" className="text-blue-600 hover:underline">Explora productos</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="ml-4">
                        <p className="font-semibold text-lg">{item.name}</p>
                        <p className="text-gray-600">C$ {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 px-2 py-1 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 px-2 py-1 rounded-r"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="mr-2" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2" />
                  <span>{user.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="mr-2" />
                  <span>{user.paymentMethod}</span>
                </div>
              </div>

              <Separator />

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>C$ {getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>C$ 50.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>C$ {(getTotal() + 50).toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
                Proceder al pago
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="mr-2" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

const Separator = () => <div className="border-t border-gray-200 my-4"></div>;

export default Cart;
