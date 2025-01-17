// src/api/cartFunctions.js

import supabase from "./supabase";

export default async function guardarPedido({ userId, metodoPago, productos, total }) {
    const { data, error } = await supabase
      .from('pedido')
      .insert([
        {
          user_id: userId,
          metodo_pago: metodoPago,
          productos: productos,
          total: total,
        },
      ]);
  
    if (error) {
      console.error('Error al guardar el pedido:', error);
      return null;
    }
    return data;
  }