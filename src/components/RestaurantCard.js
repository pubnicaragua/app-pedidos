
import { Star } from 'lucide-react';

export function RestaurantCard({ restaurant }) {
  return (
    <div key={restaurant.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={restaurant.logo}
          alt={restaurant.nombre}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{restaurant.nombre}</h3>
              <p className="text-sm text-gray-600">
                {restaurant.precio_envio ? `Envío C$${restaurant.precio_envio}` : 'Envío no disponible'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{restaurant.calificacion || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
