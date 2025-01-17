// PedidoResumen.js
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../animations/delivery.json';

const PedidoResumen = () => {
    const navigate = useNavigate();


    // Datos ficticios del usuario y del pedido
    const usuario = {
        nombre: 'Juan Pérez',
        correo: 'juan.perez@example.com',
    };

    const pedido = {
        id: '123456',
        fecha: '2025-01-17',
        total: 'C$ 1,500.00',
        items: [
            { nombre: 'Café Espresso', cantidad: 2, precio: 'C$ 100.00' },
            { nombre: 'Croissant', cantidad: 3, precio: 'C$ 50.00' },
        ],
    };

    // Configuración de la animación Lottie
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div className="container mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-md rounded p-6"
            >
                <h2 className="text-2xl font-bold mb-4">Resumen de tu Pedido</h2>
                <p><strong>Nombre:</strong> {usuario.nombre}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>ID del Pedido:</strong> {pedido.id}</p>
                <p><strong>Fecha:</strong> {pedido.fecha}</p>
                <p><strong>Total:</strong> {pedido.total}</p>

                <h3 className="text-xl font-semibold mt-4">Detalles del Pedido:</h3>
                <ul className="list-disc list-inside">
                    {pedido.items.map((item, index) => (
                        <li key={index}>
                            {item.cantidad} x {item.nombre} - {item.precio} cada uno
                        </li>
                    ))}
                </ul>

                <div className="mt-6">
                    <Lottie options={defaultOptions} height={300} width={300} />
                    <p className="text-center mt-2">¡Tu pedido está en camino!</p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Volver al Inicio
                </button>
            </motion.div>
        </div>
    );
};

export default PedidoResumen;
