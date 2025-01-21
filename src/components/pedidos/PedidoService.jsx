import supabase from "../../api/supabase";

export async function fetchPedidos() {
  try {
    const { data, error } = await supabase
      .from("pedido")
      .select("id, created_at, productos, total")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching pedidos:", error);
    return [];
  }
}
