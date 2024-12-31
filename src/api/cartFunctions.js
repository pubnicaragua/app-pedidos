// src/api/cartFunctions.js

import supabase from "./supabase";

// Función para agregar un producto al carrito
export const addToCart = async (productId, userId, quantity) => {
    try {
        // Verificar si el producto ya existe en el carrito del usuario
        const { data: existingCartItems, error: fetchError } = await supabase
            .from('carrito')
            .select('id, cantidad')
            .eq('producto_id', productId)
            .eq('usuario_id', userId)
            .single();


        if (fetchError) throw fetchError;

        if (existingCartItems) {
            // Si ya existe, actualizar la cantidad
            const updatedQuantity = existingCartItems.cantidad + quantity;
            const { error: updateError } = await supabase
                .from('carrito')
                .update({ cantidad: updatedQuantity })
                .eq('id', existingCartItems.id);

            if (updateError) throw updateError;
        } else {
            // Si no existe, agregarlo al carrito
            const { error: insertError } = await supabase
                .from('carrito')
                .insert([
                    {
                        usuario_id: userId,
                        producto_id: productId,
                        cantidad: quantity,
                    },
                ]);

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error("Error al agregar al carrito: ", error.message);
    }
};

// Función para actualizar la cantidad de un producto en el carrito
export const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
        const { error } = await supabase
            .from('carrito')
            .update({ cantidad: quantity })
            .eq('id', cartItemId);

        if (error) throw error;
    } catch (error) {
        console.error("Error al actualizar cantidad: ", error.message);
    }
};

// Función para eliminar un producto del carrito
export const removeFromCart = async (cartItemId) => {
    try {
        const { error } = await supabase
            .from('carrito')
            .delete()
            .eq('id', cartItemId);

        if (error) throw error;
    } catch (error) {
        console.error("Error al eliminar producto del carrito: ", error.message);
    }
};

// Puedes agregar más funciones si es necesario (por ejemplo, obtener todos los productos del carrito)
