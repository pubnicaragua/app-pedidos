import { Button } from './Button'

export function ProductCard({ product }) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">C${product.price}</p>
              </div>
              <div>
                <Button variant="primary">Agregar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  