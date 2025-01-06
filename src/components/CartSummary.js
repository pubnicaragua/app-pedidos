import { useNavigate } from 'react-router-dom';

export function CartSummary({ cart, onContinue, onRemove, onUpdateQuantity }) {
  const navigate = useNavigate(); // Hook de navegación
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleQuantityChange = (event, itemId) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const handleContinue = () => {
    // Navegar hacia /carrito cuando el usuario haga clic en "Continuar"
    navigate('/carrito');
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg mb-6">
      <h3 className="font-semibold text-lg">Carrito</h3>
      <div className="space-y-2 mt-2">
        {cart.length === 0 ? (
          <p className="text-gray-500">No has agregado productos al carrito.</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">{item.nombre} x</span>
                <input
                  type="number"
                  value={item.cantidad}
                  onChange={(event) => handleQuantityChange(event, item.id)}
                  className="w-16 p-1 border rounded-md"
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <span>C${item.precio * item.cantidad}</span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">Total: C${total}</p>
        <button
          onClick={handleContinue}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
