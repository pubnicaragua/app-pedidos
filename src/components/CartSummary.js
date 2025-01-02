export function CartSummary({ cart, onContinue }) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg mb-6">
      <h3 className="font-semibold text-lg">Carrito</h3>
      <div className="space-y-2 mt-2">
        {cart.length === 0 ? (
          <p className="text-gray-500">No has agregado productos al carrito.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.nombre} x{item.cantidad}</span>
              <span>C${item.precio * item.cantidad}</span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">Total: C${total}</p>
        <button
          onClick={onContinue}
          navigate="/carrito"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
