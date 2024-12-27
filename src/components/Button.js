import React from "react";

export function Button({ children, variant = "default" }) {
  const baseStyle = "px-3 pt-1.5 pb-1.5 rounded-md font-semibold transition-all duration-200";

  const variantStyles = {
    default: "bg-gray-800 text-white hover:bg-gray-700",  // Fondo oscuro con texto blanco
    ghost: "bg-transparent border-2 border-gray-800 text-gray-800 hover:bg-gray-200",  // Fondo transparente con borde oscuro y texto gris
    primary: "bg-blue-600 text-white hover:bg-blue-500", // Fondo azul con texto blanco
    secondary: "bg-green-600 text-white hover:bg-green-500", // Fondo verde con texto blanco
    // Puedes agregar más variantes según lo necesites
  };

  return <button className={`${baseStyle} ${variantStyles[variant]}`}>{children}</button>;
}
