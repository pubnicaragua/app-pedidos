import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useLocation } from "react-router-dom"; // Importa useLocation
import AddressAndLocationEditor from "../components/pedidos/AddressAndLocationEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import supabase from "../api/supabase";

export default function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [user, setUser] = useState(null);
    const [observations, setObservations] = useState("");

    const location = useLocation(); // Usa useLocation para obtener el estado
    const tiendaId = location.state?.tiendaId; // Obtén tiendaId del estado de navegación


    const navigate = useNavigate();

    useEffect(() => {
        // Load cart from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }

        // Get user data
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) throw error;
                setUser(data.user);
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        getUser();
    }, []);

    const totalPrice = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id || !tiendaId) {
            console.error("Usuario no autenticado o ID inválido.");
            alert("Error: Falta información del usuario o tienda.");
            return;
        }

        const pedido = {
            user_id: user.id,
            tienda_id: tiendaId,
            metodo_pago: paymentMethod,
            productos: cart.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.quantity,
                precio: item.precio,
            })),
            total: totalPrice,
            observaciones: observations,
            estado: "Pendiente", // Estado predeterminado
        };

        try {
            const { data, error } = await supabase.from("pedido").insert([pedido]);

            if (error) throw error;

            console.log("Pedido guardado exitosamente:", data);
            localStorage.removeItem("cart"); // Limpiar el carrito de localStorage
            navigate("/mis-pedidos");
        } catch (error) {
            console.error("Error al guardar el pedido:", error.message);
            alert(`Hubo un error al guardar tu pedido: ${error.message}`);
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Resumen del pedido</h1>

            {/* Resumen del carrito */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Artículos en el carrito</h2>
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                        <span>{item.nombre} x {item.quantity}</span>
                        <span>${(item.precio * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center font-bold">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Dirección y ubicación */}
            {user && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Dirección y Ubicación</h2>
                    <AddressAndLocationEditor userId={user.id} />
                </div>
            )}

            {/* Formulario de método de pago */}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Método de pago</h2>
                <div className="mb-4">
                    <Label htmlFor="payment-method">Selecciona un método de pago</Label>
                    <Select onValueChange={setPaymentMethod} required>
                        <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Selecciona un método de pago" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Tarjeta de crédito">Tarjeta de crédito</SelectItem>
                            <SelectItem value="Tarjeta de débito">Tarjeta de débito</SelectItem>
                            <SelectItem value="Pago contra entrega">Pago contra entrega</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
                <div className="mb-4">
                    <Label htmlFor="observations">Observaciones</Label>
                    <Input
                        id="observations"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Agrega cualquier observación sobre tu pedido"
                        className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Confirmar pedido
                </Button>
            </form>
        </div>
    );
}
