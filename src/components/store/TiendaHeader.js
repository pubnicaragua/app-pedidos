import { Star } from 'lucide-react'

export function CafeHeader({ cafe }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {cafe.logo && (
              <img 
                src={cafe.logo || "/placeholder.svg"} 
                alt={`${cafe.nombre} logo`} 
                className="w-16 h-16 object-contain rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{cafe.nombre}</h1>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span>{cafe.calificacion ? cafe.calificacion.toFixed(1) : "Sin calificación"}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}

