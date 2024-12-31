import React, { useState } from "react";

// Componente para agregar productos
function FormularioAgregarProducto({ onAddProduct }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "cafe",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(formData); // Llamar a la función para agregar el producto
    setFormData({ nombre: "", precio: "", categoria: "cafe" }); // Resetear formulario
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del producto:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
            Precio:
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoría:
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="cafe">Café</option>
            <option value="carnes">Carnes</option>
            <option value="comida_rapida">Comida Rápida</option>
            <option value="pizza">Pizza</option>
            <option value="bebidas">Bebidas</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Agregar Producto
        </button>
      </form>
    </div>
  );
}

// Componente para mostrar la lista de productos
function ListaDeProductos({ productos, onDeleteProduct }) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Lista de Productos</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{producto.nombre}</td>
              <td className="px-4 py-2">${producto.precio}</td>
              <td className="px-4 py-2">{producto.categoria}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDeleteProduct(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para el perfil del administrador
function PerfilAdministrador({ adminData, onEditProfile }) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Perfil de Administrador</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre:</label>
        <p className="text-lg font-semibold">{adminData.nombre}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Correo electrónico:</label>
        <p>{adminData.email}</p>
      </div>
      <button
        onClick={onEditProfile}
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Editar Perfil
      </button>
    </div>
  );
}

// Componente principal del dashboard
export default function DashboardAdministrador() {
  const [adminData, setAdminData] = useState({
    nombre: "Juan Pérez",
    email: "juan@tienda.com",
  });

  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddProduct = (newProduct) => {
    setProductos((prevProductos) => [...prevProductos, newProduct]);
  };

  const handleDeleteProduct = (index) => {
    setProductos((prevProductos) => prevProductos.filter((_, i) => i !== index));
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSubmitProfile = (newData) => {
    setAdminData(newData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PerfilAdministrador adminData={adminData} onEditProfile={handleEditProfile} />
        {isEditing && (
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mb-6">
            <h2 className="text-2xl font-semibold mb-4">Editar Perfil</h2>
            {/* Aquí puedes agregar un formulario para editar el perfil */}
            <button
              onClick={() => handleSubmitProfile({ nombre: "Nuevo Nombre", email: "nuevo@correo.com" })}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Guardar Cambios
            </button>
          </div>
        )}
        <FormularioAgregarProducto onAddProduct={handleAddProduct} />
        <ListaDeProductos productos={productos} onDeleteProduct={handleDeleteProduct} />
      </div>
    </div>
  );
}
