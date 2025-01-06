// src/api/cartFunctions.js

import supabase from "./supabase";

// Función para agregar o actualizar un producto en el carrito
export const addToCart = async (userId, productId, cantidad) => {
    try {
        if (cantidad < 1) throw new Error('La cantidad debe ser al menos 1.');

        // Verificar si el producto ya existe en el carrito del usuario
        const { data, error } = await supabase
            .from('carrito')
            .select('*')
            .eq('usuario_id', userId)
            .eq('producto_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error; // Si no es un error de "producto no encontrado", lanzamos el error
        }

        if (data) {
            // Si el producto ya existe, actualizamos la cantidad
            const updatedQuantity = data.cantidad + cantidad;

            const { error: updateError } = await supabase
                .from('carrito')
                .update({ cantidad: updatedQuantity })
                .eq('id', data.id);

            if (updateError) throw updateError;
        } else {
            // Si no existe, agregamos el producto al carrito
            const { error: insertError } = await supabase
                .from('carrito')
                .insert([{ usuario_id: userId, producto_id: productId, cantidad }]);

            if (insertError) throw insertError;
        }

        return { success: true };
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        return { success: false, message: error.message };
    }
};


// Función para eliminar un producto del carrito
export const removeFromCart = async (userId, productId) => {
    try {
        const { error } = await supabase
            .from('carrito')
            .delete()
            .eq('usuario_id', userId)
            .eq('producto_id', productId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        return { success: false, message: error.message };
    }
};

// Función para actualizar la cantidad de un producto en el carrito
export const updateCartItemQuantity = async (userId, productId, newQuantity) => {
    try {
        const { error } = await supabase
            .from('carrito')
            .update({ cantidad: newQuantity })
            .eq('usuario_id', userId)
            .eq('producto_id', productId);

        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la cantidad:", error);
        return { success: false, message: error.message };
    }
};

// Función para obtener el carrito de un usuario
export const getCart = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('carrito')
            .select('id, cantidad, producto_id, productos(nombre, precio)')
            .eq('usuario_id', userId);


        if (error) throw error;

        return { success: true, cart: data };
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return { success: false, message: error.message };
    }
};


// Función para calcular el total del carrito
export const calculateTotal = (cart) => {
    return cart.reduce((total, item) => {
        if (item.productos && item.productos.precio) {
            return total + item.cantidad * item.productos.precio;
        }
        return total;
    }, 0);
};

