import React from "react";

export function Input({ type, placeholder, className }) {
  return <input type={type} placeholder={placeholder} className={`border border-gray-300 px-4 py-2 rounded-md ${className}`} />;
}
