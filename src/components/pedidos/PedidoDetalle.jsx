import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function PedidoDetalle({ pedido }) {
  const { id, created_at, productos, total, estado } = pedido;
  const navigate = useNavigate();

  return (
    <Card className="mb-4 shadow-md">
      <CardHeader>
        <CardTitle>
          Pedido realizado el: {new Date(created_at).toLocaleDateString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {productos.map((producto, index) => (
            <li key={index} className="flex justify-between">
              <span>{producto.nombre}</span>
              <span>{producto.cantidad} x C${producto.precio.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="font-bold mt-4">Total: C${total.toFixed(2)}</p>
        <p className="mt-2">
          Estado: <Badge variant={estado === "Pendiente" ? "warning" : "info"}>{estado}</Badge>
        </p>
      </CardContent>
      {(estado === "Pendiente" || estado === "En camino") && (
        <CardFooter>
          <Button
            onClick={() => navigate(`/mis-pedidos/${id}`)}
            variant="primary"
            className="w-full"
          >
            Ver estado actual
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
