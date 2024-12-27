import { useState } from 'react';
import { X } from 'lucide-react';

export function CartModal({ isOpen, onClose, product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;  // Si no está abierto, no renderizamos el modal

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity }); // Agrega el producto al carrito
    onClose();  // Cierra el modal después de agregar al carrito
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-black">{product.name}</h3>
          <button
            className="bg-transparent border-none text-black text-lg"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Precio: C${product.price}</p>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <button
            className="bg-gray-200 text-gray-700 p-2 rounded"
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="bg-gray-200 text-gray-700 p-2 rounded"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
