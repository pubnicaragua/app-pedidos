import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function ProductForm({ initialData = {}, onSubmit, categories }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: initialData.nombre || "",
      imagen: initialData.imagen || "",
      descripcion: initialData.descripcion || "",
      precio: initialData.precio || "",
      categoria_id: initialData.categoria_id || "",
    },
  });

  const handleCategoryChange = (value) => {
    setValue("categoria_id", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre del Producto</Label>
        <Input
          id="nombre"
          {...register("nombre", { required: "El nombre del producto es obligatorio" })}
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
      </div>

      <div>
        <Label htmlFor="imagen">URL de la Imagen</Label>
        <Input
          id="imagen"
          {...register("imagen", { required: "La URL de la imagen es obligatoria" })}
        />
        {errors.imagen && <p className="text-red-500 text-sm">{errors.imagen.message}</p>}
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          {...register("descripcion", { required: "La descripción es obligatoria" })}
        />
        {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion.message}</p>}
      </div>

      <div>
        <Label htmlFor="precio">Precio</Label>
        <Input
          id="precio"
          type="number"
          step="0.01"
          {...register("precio", { required: "El precio es obligatorio" })}
        />
        {errors.precio && <p className="text-red-500 text-sm">{errors.precio.message}</p>}
      </div>

      <div>
        <Label htmlFor="categoria_id">Categoría</Label>
        <Select onValueChange={handleCategoryChange} defaultValue={initialData.categoria_id || ""}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoria_id && <p className="text-red-500 text-sm">{errors.categoria_id.message}</p>}
      </div>

      <Button type="submit">Guardar Producto</Button>
    </form>
  );
}
