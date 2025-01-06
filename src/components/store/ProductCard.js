import { Button } from "../ui/Button"

export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <Button onClick={() => onAddToCart(product)}>Agregar</Button>
        </div>
      </div>
    </div>
  )
}

