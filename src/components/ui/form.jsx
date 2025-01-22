import React from "react";
import { cn } from "../../lib/utils"; // Función para combinar clases de Tailwind
import { Input as ShadInput } from "../ui/input";
import { Button as ShadButton } from "../ui/button";

export function Input({ className, ...props }) {
  return (
    <ShadInput
      className={cn("block w-full", className)}
      {...props}
    />
  );
}

export function Button({ children, variant = "default", className, ...props }) {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    default: "bg-white text-black border hover:bg-gray-100",
  };

  return (
    <ShadButton
      className={cn(
        "px-4 py-2 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </ShadButton>
  );
}