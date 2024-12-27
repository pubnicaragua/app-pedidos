// src/components/PromotionList.js
export default function PromotionList() {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">No te pierdas estas promociones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-300 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Restaurantes</h3>
            <p>¡Descubre las mejores ofertas!</p>
          </div>
          <div className="bg-pink-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">Bebidas</h3>
            <p className="text-white">Refréscate con nuestras promociones</p>
          </div>
        </div>
      </section>
    );
  }
  