import { Star, Clock, MapPin } from 'lucide-react'

export function CafeHeader({ cafe }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{cafe.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{cafe.rating} ({cafe.reviewCount} reseñas)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{cafe.deliveryTime}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{cafe.distance}</span>
              </div>
            </div>
          </div>
          <img src={cafe.image} alt={cafe.name} className="w-24 h-24 rounded-full object-cover" />
        </div>
      </div>
    </header>
  )
}

