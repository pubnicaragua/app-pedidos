// src/components/CreateProduct.js
import React, { useState } from 'react';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    image: '',
    price: '',
    category: '',
    store: '',
    status: 'available', // 'available' o 'out of stock'
  });

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (
      !product.name ||
      !product.image ||
      !product.price ||
      !product.category ||
      !product.store
    ) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Aquí podrías enviar el producto a tu API o base de datos
    console.log('Producto creado:', product);

    // Limpiar el formulario
    setProduct({
      name: '',
      image: '',
      price: '',
      category: '',
      store: '',
      status: 'available',
    });

    alert('Producto creado con éxito');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Nombre del producto"
            />
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold mb-2">
              URL de la Imagen
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="URL de la imagen del producto"
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold mb-2">
              Precio
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Precio del producto"
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold mb-2">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Selecciona una categoría</option>
              <option value="restaurantes">Restaurantes</option>
              <option value="mercados">Mercados</option>
              <option value="cafe">Café</option>
              <option value="salud">Salud</option>
              <option value="mascotas">Mascotas</option>
              <option value="market">Market</option>
            </select>
          </div>

          {/* Tienda */}
          <div>
            <label htmlFor="store" className="block text-sm font-semibold mb-2">
              Nombre de la Tienda
            </label>
            <input
              type="text"
              id="store"
              name="store"
              value={product.store}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Nombre de la tienda"
            />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold mb-2">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={product.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="available">Disponible</option>
              <option value="out of stock">Agotado</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Crear Producto
            </button>
            <button
              type="button"
              onClick={() => setProduct({
                name: '',
                image: '',
                price: '',
                category: '',
                store: '',
                status: 'available',
              })}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
