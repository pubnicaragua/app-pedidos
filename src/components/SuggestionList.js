// src/components/SuggestionList.js
import {Link} from "react-router-dom";  // Cambia el Link dependiendo de tu entorno


export default function SuggestionList({ suggestions }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Te sugerimos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {suggestions.map((suggestion) => (
          <Link
            key={suggestion.name}
            to={`/restaurant/${suggestion.slug}`}  // Ajusta el uso de Link dependiendo de tu entorno
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative mb-4">
                <img
                    src=""
                    alt=""
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="text-sm text-gray-600">
              Envío C$ {suggestion.deliveryFee}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
