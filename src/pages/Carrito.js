// src/components/Cart.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // Estado para manejar los productos en el carrito
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pizza Margarita',
      price: 15.99,
      quantity: 2,
      image: '/placeholder.svg?height=100&width=100',
    },
    {
      id: 2,
      name: 'Coca Cola',
      price: 3.99,
      quantity: 3,
      image: '/placeholder.svg?height=100&width=100',
    },
  ]);

  // Función para eliminar un producto del carrito
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calcular el total del carrito
  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Tu Carrito</h2>

        {cartItems.length === 0 ? (
          <div className="text-center text-lg text-gray-600">
            Tu carrito está vacío. <Link to="/" className="text-blue-600 hover:underline">Explora productos</Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="ml-4">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">C$ {item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Cantidad: {item.quantity}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-xl font-bold">C$ {getTotal().toFixed(2)}</p>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Link to="/" className="text-blue-600 hover:underline">
                  Seguir comprando
                </Link>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                  Proceder al pago
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
