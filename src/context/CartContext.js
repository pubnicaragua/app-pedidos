import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto para el carrito
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Función para continuar (ejemplo de lo que podría hacer, como redirigir)
  const handleContinue = () => {
    // Aquí podrías realizar alguna acción antes de redirigir
    // o redirigir directamente a la página de carrito
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, handleContinue }}>
      {children}
    </CartContext.Provider>
  );
}
