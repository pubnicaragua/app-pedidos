import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import supabase from "../../api/supabase";
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CheckoutModal({ isOpen, onClose, cart, onCompleteOrder }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        console.log('Usuario obtenido desde checkout:', data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    getUser();
  }, []);

  const guardarPedido = async ({ userId, metodoPago, productos, total }) => {
    if (!userId) {
      console.error("El ID del usuario no está definido. No se puede guardar el pedido.");
      return { success: false, message: "ID de usuario no definido" };
    }

    try {
      const { data, error } = await supabase
        .from('pedido')
        .insert([
          {
            user_id: userId,
            metodo_pago: metodoPago,
            productos: productos,
            total: total,
          },
        ]);

      if (error) {
        console.error('Error al guardar el pedido:', error.message);
        return { success: false, message: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Error inesperado al guardar el pedido:", err);
      return { success: false, message: "Error inesperado al guardar el pedido" };
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error("Usuario no autenticado o ID inválido.");
      alert("Debes iniciar sesión para realizar un pedido.");
      return;
    }

    const pedido = {
      userId: user.id,
      metodoPago: paymentMethod === "cash" ? "Pago contra entrega" : "Tarjeta",
      productos: cart.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio: item.precio,
      })),
      total: totalPrice,
    };

    console.log("Datos del pedido antes de guardar:", pedido);

    const resultado = await guardarPedido(pedido);
    if (resultado.success) {
      console.log("Pedido guardado exitosamente:", resultado.data);
      navigate('/pedidos');
      onCompleteOrder();
    } else {
      console.error("Error al guardar el pedido:", resultado.message);
      alert(`Hubo un error al guardar tu pedido: ${resultado.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar pedido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="payment-method">Método de pago</Label>
              <Select onValueChange={setPaymentMethod} required>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Tarjeta de crédito</SelectItem>
                  <SelectItem value="debit">Tarjeta de débito</SelectItem>
                  <SelectItem value="cash">Pago contra entrega</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod !== "cash" && paymentMethod && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card-expiry">Fecha de expiración</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-cvc">CVC</Label>
                    <Input
                      id="card-cvc"
                      placeholder="123"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {paymentMethod === "cash"
                ? "Confirmar pedido"
                : `Pagar C$${totalPrice.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
