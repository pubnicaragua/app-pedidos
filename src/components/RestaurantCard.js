import { Star } from 'lucide-react'

export function RestaurantCard({ restaurant }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">
                {restaurant.deliveryTime} · Envío C${restaurant.deliveryFee}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
          </div>
          {restaurant.sponsored && (
            <span className="text-xs text-gray-500 mt-2 block">PATROCINADO</span>
          )}
          {restaurant.isNew && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">NUEVO</span>
          )}
        </div>
      </div>
    </div>
  )
}
