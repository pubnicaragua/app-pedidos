import { useEffect, useState } from "react";
import  PedidoDetalle  from "../components/pedidos/PedidoDetalle";
import supabase from "../api/supabase";

export default function ListaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("pedido")
        .select("id, created_at, productos, total, estado")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pedidos:", error.message);
      } else {
        setPedidos(data);
      }
      setLoading(false);
    };

    fetchPedidos();
  }, []);

  if (loading) return <p>Cargando pedidos...</p>;
  if (pedidos.length === 0) return <p>No tienes pedidos realizados.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
      {pedidos.map((pedido) => (
        <PedidoDetalle key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
}
