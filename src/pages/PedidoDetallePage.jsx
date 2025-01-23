import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../api/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input, Button } from "../components/ui/form";

const statusMessages = {
  Pendiente: "La tienda ha recibido tu pedido.",
  Recibido: "La tienda está preparando tu pedido.",
  "En camino": "Tu pedido ha sido asignado a un conductor.",
  Completado: "El conductor está en tu ubicación.",
};

export default function PedidoDetallePage() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [observacionEditada, setObservacionEditada] = useState("");
  const [loadingPedido, setLoadingPedido] = useState(true);
  const [loadingDireccion, setLoadingDireccion] =useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPedido = async () => {
      setLoadingPedido(true);
      const { data, error } = await supabase
        .from("pedido")
        .select("id, created_at, productos, total, estado, observaciones, tienda:tienda_id(nombre), user_id")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching pedido:", error.message);
      } else {
        setPedido(data);
        setObservacionEditada(data?.observaciones || "");
      }
      setLoadingPedido(false);
    };

    fetchPedido();
  }, [id]);

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

  const handleSaveObservaciones = async () => {
    const { error } = await supabase
      .from("pedido")
      .update({ observaciones: observacionEditada })
      .eq("id", id);

    if (error) {
      console.error("Error updating observaciones:", error.message);
      alert("No se pudo actualizar la observación.");
    } else {
      setPedido((prev) => ({ ...prev, observaciones: observacionEditada }));
      setIsEditing(false);
      alert("Observación actualizada con éxito.");
    }
  };

  if (!pedido) return <p>No se encontró el pedido.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Tu Pedido</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            Estado del Pedido:{" "}
            <Badge
              variant={
                pedido.estado === "Pendiente"
                  ? "warning"
                  : pedido.estado === "Completado"
                  ? "success"
                  : "info"
              }
            >
              {pedido.estado}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-yellow-500">
            <p className="animate-pulse">{statusMessages[pedido.estado]}</p>
          </div>

          <ul className="mb-4">
            {pedido.productos.map((producto, index) => (
              <li key={index} className="flex justify-between">
                <span>{producto.nombre}</span>
                <span>{producto.cantidad} x C${producto.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mb-4">
            Tienda: <span className="font-semibold">{pedido.tienda.nombre}</span>
          </p>
          <p className="mb-4">
            Dirección de entrega:{" "}
            <span className="font-semibold">{direccion || "No disponible"}</span>
          </p>
          <div className="mb-4">
            <p className="font-semibold mb-2">Observaciones:</p>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={observacionEditada}
                  onChange={(e) => setObservacionEditada(e.target.value)}
                  placeholder="Edita tus observaciones"
                />
                <Button onClick={handleSaveObservaciones} variant="primary">
                  Guardar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="secondary">
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>{pedido.observaciones || "Sin observaciones"}</span>
                <Button onClick={() => setIsEditing(true)} variant="secondary">
                  Editar
                </Button>
              </div>
            )}
          </div>
          <p className="font-bold">Total: C${pedido.total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
