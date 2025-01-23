import React from "react";
import { Button } from "../../../components/ui/button";
import { Package, ShoppingBag, Paintbrush, UserCircle } from "lucide-react";

export default function DashboardLayout({ children }) {
  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard de la Tienda</h1>
        <div className="flex gap-4">
          <Button className="flex items-center" variant="ghost">
            <a href="/tienda/dashboard/personalizar" className="flex items-center">
              <Paintbrush className="mr-2" /> Personalizar Tienda
            </a>
          </Button>
          <Button className="flex items-center" variant="ghost">
            <a href="/tienda/dashboard/productos" className="flex items-center">
              <Package className="mr-2" /> Productos
            </a>
          </Button>
          <Button className="flex items-center" variant="ghost">
            <a href="/tienda/dashboard/pedidos" className="flex items-center">
              <ShoppingBag className="mr-2" /> Pedidos
            </a>
          </Button>
          <Button className="flex items-center" variant="ghost">
            <a href="/dashboard/perfil" className="flex items-center">
              <UserCircle className="mr-2" /> Perfil
            </a>
          </Button>
        </div>
      </nav>
      {children}
    </div>
  );
}
