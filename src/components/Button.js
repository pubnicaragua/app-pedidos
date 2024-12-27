import React from "react";

export function Button({ children, variant = "default" }) {
  const baseStyle = "px-4 py-2 rounded-md font-semibold text-white";
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700",
    ghost: "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-100",
  };

  return <button className={`${baseStyle} ${variantStyles[variant]}`}>{children}</button>;
}

