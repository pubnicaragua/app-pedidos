import React, { useEffect, useState } from "react";
import { Star, Package, ShoppingBag, Paintbrush, UserCircle, Camera } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import Layout from "./Layout";
import supabase from "../../../api/supabase";

export default function DashboardTienda() {
  const [tienda, setTienda] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener el usuario autenticado
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Obtener la tienda asociada al usuario autenticado
    const fetchTienda = async () => {
      if (!user) return; // Asegurarse de que user esté definido antes de ejecutar la consulta

      try {
        const { data, error } = await supabase
          .from("tienda")
          .select("*")
          .eq("propietario_id", user.id)
          .single();
        if (error) {
          console.error("Error fetching tienda:", error);
        } else {
          setTienda(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchTienda();
  }, [user]); // Solo ejecuta cuando `user` cambia

  if (!user) {
    return <div>Cargando información del usuario...</div>;
  }

  if (!tienda) {
    return <div>Cargando información de la tienda...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="relative w-full h-48 mb-8">
          <img
            src={tienda.imagen_fondo || "https://via.placeholder.com/800x300"}
            alt="Banner de la tienda"
            className="rounded-lg w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{tienda.nombre}</h1>
          </div>
          <Button className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-200">
            <Camera className="mr-2" /> Cambiar Banner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={tienda.logo || "https://via.placeholder.com/100"}
                  alt="Logo de la tienda"
                  className="rounded-full w-24 h-24 object-cover"
                />
                <div className="flex-grow">
                  <Label htmlFor="nombre-tienda">Nombre de la Tienda</Label>
                  <Input id="nombre-tienda" value={tienda.nombre} readOnly className="mt-1" />
                </div>
              </div>
              <div>
                <Button className="w-full">
                  <Camera className="mr-2" /> Cambiar Logo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-400 mr-2" />
                <span>Calificación: {tienda.calificacion || "N/A"}/5</span>
              </div>
              <h3 className="font-semibold mb-2">Pedidos Recientes</h3>
              <ul>
                <li>No hay pedidos recientes</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Button asChild>
            <a href="/dashboard/productos" className="flex items-center justify-center">
              <Package className="mr-2" /> Productos
            </a>
          </Button>
          <Button className="flex items-center justify-center">
            <ShoppingBag className="mr-2" /> Ver Pedidos
          </Button>
          <Button className="flex items-center justify-center">
            <Paintbrush className="mr-2" /> Personalizar Tienda
          </Button>
          <Button className="flex items-center justify-center">
            <UserCircle className="mr-2" /> Perfil de Usuario
          </Button>
        </div>
      </div>
    </Layout>
  );
}
