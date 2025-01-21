import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import supabase from "../api/supabase";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CheckoutPage({ cart = [], onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCVC: "",
  });
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (Array.isArray(cart)) {
      const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
      setTotalPrice(total);
    }
  }, [cart]);

  const guardarPedido = async ({ userId, metodoPago, productos, total, direccion, ubicacion }) => {
    try {
      const { data, error } = await supabase
        .from("pedido")
        .insert([
          {
            user_id: userId,
            metodo_pago: metodoPago,
            productos: productos,
            total: total,
            direccion: direccion,
            ubicacion: ubicacion,
          },
        ]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      return { success: false, message: error.message };
    }
  };

  const handleConfirmOrder = async () => {
    const user = await supabase.auth.getUser();

    if (!user?.data?.user?.id) {
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    const pedido = {
      userId: user.data.user.id,
      metodoPago: paymentMethod === "cash" ? "Pago contra entrega" : "Tarjeta",
      productos: Array.isArray(cart)
        ? cart.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.quantity,
            precio: item.precio,
          }))
        : [],
      total: totalPrice,
      direccion: address,
      ubicacion: location,
    };

    const resultado = await guardarPedido(pedido);
    if (resultado.success) {
      onCompleteOrder();
      alert("¡Pedido confirmado exitosamente!");
    } else {
      alert(`Error al confirmar el pedido: ${resultado.message}`);
    }
  };

  function LocationSelector() {
    useMapEvents({
      click: (e) => {
        setLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return location ? <Marker position={location} /> : null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Revisar Pedido</h1>

      {/* Resumen del pedido */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumen</h2>
        {Array.isArray(cart) && cart.length > 0 ? (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between border-b py-2">
                <span>{item.nombre} (x{item.quantity})</span>
                <span>${(item.precio * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos en el carrito.</p>
        )}
        <div className="flex justify-between font-bold mt-4">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Método de pago */}
      <div className="mb-6">
        <Label>Método de pago</Label>
        <Select onValueChange={setPaymentMethod} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un método de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit">Tarjeta de crédito</SelectItem>
            <SelectItem value="debit">Tarjeta de débito</SelectItem>
            <SelectItem value="cash">Pago contra entrega</SelectItem>
          </SelectContent>
        </Select>
        {paymentMethod !== "cash" && paymentMethod && (
          <div className="mt-4 space-y-2">
            <Input
              placeholder="Número de tarjeta"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
              required
            />
            <Input
              placeholder="Nombre en la tarjeta"
              value={cardDetails.cardName}
              onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Input
                placeholder="MM/AA"
                value={cardDetails.cardExpiry}
                onChange={(e) => setCardDetails({ ...cardDetails, cardExpiry: e.target.value })}
                required
              />
              <Input
                placeholder="CVC"
                value={cardDetails.cardCVC}
                onChange={(e) => setCardDetails({ ...cardDetails, cardCVC: e.target.value })}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Dirección */}
      <div className="mb-6">
        <Label>Dirección de entrega</Label>
        <Input
          placeholder="Ingresa tu dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      {/* Ubicación en el mapa */}
      <div className="mb-6">
        <Label>Selecciona tu ubicación en el mapa</Label>
        <MapContainer
          center={[12.114992, -86.236174]} // Centro inicial
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationSelector />
        </MapContainer>
      </div>

      <Button className="w-full" onClick={handleConfirmOrder}>
        Confirmar pedido
      </Button>
    </div>
  );
}
