import { Button } from './Button'

export function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Aseguramos que las propiedades coincidan */}
        <img
          src={product.imagen}  // Cambié 'image' por 'imagen'
          alt={product.nombre}  // Cambié 'name' por 'nombre'
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{product.nombre}</h3>  {/* Cambié 'name' por 'nombre' */}
              <p className="text-sm text-gray-600">C${product.precio}</p>  {/* Cambié 'price' por 'precio' */}
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
