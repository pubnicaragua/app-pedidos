import React, { useState, useEffect } from "react";
import { Camera, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { Textarea } from "../../../components/ui/textarea";
import supabase from "../../../api/supabase";
import Layout from "./Layout";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function PersonalizarTienda() {
  const [storeConfig, setStoreConfig] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch authenticated user and store data
  useEffect(() => {
    const fetchUserAndStore = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      setUser(user);

      const { data: tienda, error: tiendaError } = await supabase
        .from("tienda")
        .select("*, categoria_tienda(nombre, id)")
        .eq("propietario_id", user.id)
        .single();

      if (tiendaError) {
        console.error("Error fetching tienda:", tiendaError);
        return;
      }

      setStoreConfig({
        name: tienda.nombre,
        category: tienda.categoria_id,
        location: `${tienda.latitud}, ${tienda.longitud}`,
        logo: tienda.logo,
        backgroundImage: tienda.imagen_fondo,
        acceptsCard: tienda.acepta_tarjeta,
        shippingCost: tienda.precio_envio || 0,
        schedule: {},
      });
    };

    fetchUserAndStore();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categoria_tienda").select("id, nombre");
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name) => (value) => {
    setStoreConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name) => (checked) => {
    setStoreConfig((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (event, imageType) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreConfig((prev) => ({ ...prev, [imageType]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {
      nombre: storeConfig.name,
      categoria_id: storeConfig.category,
      latitud: storeConfig.location.split(",")[0].trim(),
      longitud: storeConfig.location.split(",")[1].trim(),
      logo: storeConfig.logo,
      imagen_fondo: storeConfig.backgroundImage,
      acepta_tarjeta: storeConfig.acceptsCard,
      precio_envio: storeConfig.shippingCost,
    };

    const { error } = await supabase
      .from("tienda")
      .update(updates)
      .eq("propietario_id", user.id);

    if (error) {
      console.error("Error updating store config:", error);
      alert("Error al guardar la configuración");
      return;
    }

    alert("Configuración guardada con éxito");
  };

  if (!storeConfig) {
    return <div>Cargando configuración...</div>;
  }

  return (
    <Layout>  
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la Tienda</Label>
            <Input id="name" name="name" value={storeConfig.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="category">Categoría de la Tienda</Label>
            <Select onValueChange={handleSelectChange("category")} value={storeConfig.category}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Ubicación</Label>
            <div className="flex">
              <Input
                id="location"
                name="location"
                value={storeConfig.location}
                onChange={handleInputChange}
                className="flex-grow"
              />
              <Button type="button" variant="outline" className="ml-2">
                <MapPin className="mr-2 h-4 w-4" /> Usar GPS
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo">Logo de la Tienda</Label>
            <div className="flex items-center space-x-4">
              <img
                src={storeConfig.logo || "https://via.placeholder.com/100"}
                alt="Logo de la tienda"
                className="rounded-full w-24 h-24 object-cover"
              />
              <Input id="logo" type="file" onChange={(e) => handleImageUpload(e, "logo")} accept="image/*" />
            </div>
          </div>
          <div>
            <Label htmlFor="backgroundImage">Imagen de Fondo</Label>
            <div className="flex items-center space-x-4">
              <img
                src={storeConfig.backgroundImage || "https://via.placeholder.com/200x100"}
                alt="Imagen de fondo"
                className="rounded w-full h-24 object-cover"
              />
              <Input
                id="backgroundImage"
                type="file"
                onChange={(e) => handleImageUpload(e, "backgroundImage")}
                accept="image/*"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Pagos y Envíos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="acceptsCard"
              checked={storeConfig.acceptsCard}
              onCheckedChange={handleSwitchChange("acceptsCard")}
            />
            <Label htmlFor="acceptsCard">Acepta pagos con tarjeta</Label>
          </div>
          <div>
            <Label htmlFor="shippingCost">Precio de Envío ($)</Label>
            <Input
              id="shippingCost"
              name="shippingCost"
              type="number"
              value={storeConfig.shippingCost}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Guardar Cambios
      </Button>
    </form>
    </Layout>
  );
}