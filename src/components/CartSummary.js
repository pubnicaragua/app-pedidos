import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function CartSummary({ cart }) {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Redirige a la página del carrito y pasa los datos del carrito como state
    navigate('/carrito', { state: { cart } });
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
              <span>{item.name} x{item.quantity}</span>
              <span>C${item.price * item.quantity}</span>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
  <button onClick={handleContinue} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
    Continuar
  </button>
</div>

    </div>
  );
}
