
import { useEffect, useState } from "react";
import PedidoDetalle from "../components/pedidos/PedidoDetalle";
import supabase from "../api/supabase";
import { Spinner } from "../components/ui/spinner";
import { Alert } from "../components/ui/alert";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Spinner size="lg" />
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <Alert variant="info" className="mt-6">
        No tienes pedidos realizados.
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <PedidoDetalle key={pedido.id} pedido={pedido} />
        ))}
      </div>
    </div>
  );
}
