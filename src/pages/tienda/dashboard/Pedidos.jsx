import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Truck } from "lucide-react";
import supabase from "../../../api/supabase";
import Layout from "./Layout";

export default function PedidosPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [tiendaId, setTiendaId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error fetching user:", userError);
          return;
        }
        setUser(userData.user);
      } catch (err) {
        console.error("Unexpected error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTienda = async () => {
      if (!user) return;

      try {
        const { data: tiendaData, error: tiendaError } = await supabase
          .from("tienda")
          .select("id")
          .eq("propietario_id", user.id)
          .single();

        if (tiendaError) {
          console.error("Error fetching tienda:", tiendaError);
          return;
        }

        setTiendaId(tiendaData.id);
      } catch (err) {
        console.error("Unexpected error fetching tienda:", err);
      }
    };

    fetchTienda();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!tiendaId) return;

      try {
        const { data, error } = await supabase
          .from("pedido")
          .select("id, created_at, user_id, metodo_pago, productos, total, observaciones, estado, tienda_id")
          .eq("tienda_id", tiendaId);

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        const formattedOrders = data.map((order) => ({
          id: order.id,
          customerId: order.user_id,
          paymentMethod: order.metodo_pago,
          products: order.productos,
          total: order.total,
          instructions: order.observaciones,
          status: order.estado,
          createdAt: order.created_at,
        }));

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Unexpected error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [tiendaId]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("pedido")
        .update({ estado: newStatus })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        return;
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Unexpected error updating order status:", err);
    }
  };

  return (
    <Layout>
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gestión de Pedidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Pedido #{order.id}</CardTitle>
              <p>Fecha: {new Date(order.createdAt).toLocaleString()}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
              <h4 className="font-semibold">Cliente: <p className="font-normal">{user?.user_metadata?.full_name}</p></h4>
                <h4 className="font-semibold">Productos:</h4>
                <ul className="list-disc list-inside">
                  {order.products.map((product, index) => (
                    <li key={index}>
                      {product.nombre} x{product.cantidad} - ${product.precio.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="font-bold">Total: ${order.total.toFixed(2)}</p>
                <p>
                  <strong>Instrucciones:</strong> {order.instructions}
                </p>
                <p>
                  <strong>Método de Pago:</strong> {order.paymentMethod}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {order.status === "Pendiente" && (
                <Button
                  className="w-full mb-2"
                  onClick={() => updateOrderStatus(order.id, "Recibido")}
                >
                  Marcar como Recibido
                </Button>
              )}
              {order.status === "Recibido" && (
                <Button
                  className="w-full"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Truck className="mr-2" />
                  Asignar a un Conductor
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedOrder && (
        <AssignDriverDialog
          order={selectedOrder}
          onAssign={(driverName) => updateOrderStatus(selectedOrder.id, "En camino")}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
    </Layout>
  );
}

function AssignDriverDialog({ order, onAssign, onClose }) {
  const [driverName, setDriverName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (driverName.trim()) {
      onAssign(driverName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Asignar Conductor al Pedido #{order.id}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium">
              Nombre del Conductor
            </label>
            <input
              id="driverName"
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" disabled={!driverName.trim()}>
              Asignar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
