import { useNavigate } from "react-router-dom";

export default function PedidoDetalle({ pedido }) {
  const { id, created_at, productos, total, estado } = pedido;
  const navigate = useNavigate();

  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Pedido realizado el: {new Date(created_at).toLocaleDateString()}</h2>
      <ul className="mb-2">
        {productos.map((producto, index) => (
          <li key={index} className="flex justify-between">
            <span>{producto.nombre}</span>
            <span>{producto.cantidad} x C${producto.precio.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="font-bold">Total: C${total.toFixed(2)}</p>
      <p className="mt-2">Estado: <span className="font-semibold">{estado}</span></p>
      {(estado === "Pendiente" || estado === "En camino") && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/mis-pedidos/${id}`)}
        >
          Ver estado actual
        </button>
      )}
    </div>
  );
}
