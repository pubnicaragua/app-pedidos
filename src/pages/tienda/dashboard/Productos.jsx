import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import ProductForm from "../../../components/tienda/ProductForm";
import supabase from "../../../api/supabase";
import Layout from "./Layout";

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [tiendaId, setTiendaId] = useState(null);

  // Fetch user and store
  useEffect(() => {
    const fetchUserAndStore = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }
      setUser(userData.user);

      const { data: tiendaData, error: tiendaError } = await supabase
        .from("tienda")
        .select("id")
        .eq("propietario_id", userData.user.id)
        .single();

      if (tiendaError) {
        console.error("Error fetching store:", tiendaError);
        return;
      }
      setTiendaId(tiendaData.id);
    };

    fetchUserAndStore();
  }, []);

  // Fetch products
  useEffect(() => {
    if (!tiendaId) return;

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select(`
          id,
          nombre,
          imagen,
          descripcion,
          precio,
          categoria_id,
          categoria_productos (nombre)
        `)
        .eq("tienda_id", tiendaId);

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data);
    };

    fetchProducts();
  }, [tiendaId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categoria_productos").select("id, nombre");
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleAddProduct = async (data) => {
    const newProduct = {
      ...data,
      precio: parseFloat(data.precio),
      tienda_id: tiendaId,
    };
  
    const { data: addedProduct, error } = await supabase
      .from("productos")
      .insert(newProduct)
      .select(`
        id,
        nombre,
        imagen,
        descripcion,
        precio,
        categoria_id,
        categoria_productos (nombre)
      `)
      .single();
  
    if (error) {
      console.error("Error adding product:", error);
      alert("Error al agregar producto");
      return;
    }
  
    setProducts((prevProducts) => [...prevProducts, addedProduct]);
    setIsAdding(false);
  };
  

  const handleEditProduct = async (data) => {
    if (!editingProduct) return;
  
    const updatedProduct = {
      ...data,
      precio: parseFloat(data.precio),
    };
  
    const { data: updated, error } = await supabase
      .from("productos")
      .update(updatedProduct)
      .eq("id", editingProduct.id)
      .select(`
        id,
        nombre,
        imagen,
        descripcion,
        precio,
        categoria_id,
        categoria_productos (nombre)
      `)
      .single();
  
    if (error) {
      console.error("Error editing product:", error);
      alert("Error al editar producto");
      return;
    }
  
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === editingProduct.id ? updated : p))
    );
    setEditingProduct(null);
  };
  

  const handleDeleteProduct = async (id) => {
    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
      return;
    }

    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
  };

  const filteredProducts = products.filter(
    (product) =>
      (filterCategory === "all" || product.categoria_id === parseInt(filterCategory)) &&
      (searchTerm ? product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : true)
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6 flex justify-between items-center">
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2" /> Agregar Producto
          </Button>
          <div className="flex gap-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isAdding && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevo Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm onSubmit={handleAddProduct} categories={categories} />
            </CardContent>
          </Card>
        )}

        {editingProduct && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Editar Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductForm
                initialData={{
                  nombre: editingProduct.nombre,
                  imagen: editingProduct.imagen,
                  descripcion: editingProduct.descripcion,
                  precio: editingProduct.precio.toString(),
                  categoria_id: editingProduct.categoria_id,
                }}
                onSubmit={handleEditProduct}
                categories={categories}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product.imagen || "https://via.placeholder.com/150"}
                  alt={product.nombre}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <p className="mb-2">{product.descripcion}</p>
                <p className="font-bold mb-2">Precio: ${product.precio.toFixed(2)}</p>
                <p className="mb-4">Categoría: {product.categoria_productos.nombre}</p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditingProduct(product)}>
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}