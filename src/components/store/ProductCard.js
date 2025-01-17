import { Button } from "../ui/button"

export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={product.imagen} alt={product.nombre} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.nombre}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.descripcion}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold">${product.precio.toFixed(2)}</span>
          <Button onClick={() => onAddToCart(product)}>Agregar</Button>
        </div>
      </div>
    </div>
  )
}

