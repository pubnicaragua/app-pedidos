import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../api/supabase";

export default function PedidoDetallePage() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [loadingPedido, setLoadingPedido] = useState(true);
  const [loadingDireccion, setLoadingDireccion] = useState(true);

  // Fetch pedido details including user_id and tienda
  useEffect(() => {
    const fetchPedido = async () => {
      setLoadingPedido(true);
      const { data, error } = await supabase
        .from("pedido")
        .select("id, created_at, productos, total, estado, tienda:tienda_id(nombre), user_id")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching pedido:", error.message);
      } else {
        setPedido(data);
      }
      setLoadingPedido(false);
    };

    fetchPedido();
  }, [id]);

  // Fetch direccion from perfil
  useEffect(() => {
    const fetchDireccion = async () => {
      if (pedido?.user_id) {
        setLoadingDireccion(true);
        const { data, error } = await supabase
          .from("perfil")
          .select("direccion")
          .eq("id", pedido.user_id)
          .single();

        if (error) {
          console.error("Error fetching direccion:", error.message);
        } else {
          setDireccion(data?.direccion);
        }
        setLoadingDireccion(false);
      }
    };

    fetchDireccion();
  }, [pedido]);

  if (!pedido) return <p>No se encontró el pedido.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Detalles del Pedido</h1>
      <div className="border p-4 rounded shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Pedido #{pedido.id}</h2>
        <p className="mb-4">Estado: <span className="font-semibold">{pedido.estado}</span></p>
        {pedido.estado === "Pendiente" && <p className="text-yellow-500">Tu pedido está siendo preparado.</p>}
        {pedido.estado === "En camino" && <p className="text-green-500">Tu pedido está en camino.</p>}
        <p className="mb-4">Tienda: <span className="font-semibold">{pedido.tienda.nombre}</span></p>
        <p className="mb-4">Dirección de entrega: <span className="font-semibold">{direccion || "No disponible"}</span></p>
        <ul className="mb-4">
          {pedido.productos.map((producto, index) => (
            <li key={index} className="flex justify-between">
              <span>{producto.nombre}</span>
              <span>{producto.cantidad} x C${producto.precio.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="font-bold">Total: C${pedido.total.toFixed(2)}</p>
      </div>
    </div>
  );
}
