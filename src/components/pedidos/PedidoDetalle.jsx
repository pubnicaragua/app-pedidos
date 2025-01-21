export default function PedidoDetalle({ pedido }) {
    const { created_at, productos, total } = pedido;
  
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
      </div>
    );
  }
  