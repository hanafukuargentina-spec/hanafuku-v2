import { createClient } from "@supabase/supabase-js";
import type { Producto } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbProducto {
  id: string;
  nombre: string;
  subtitulo: string | null;
  categoria: string;
  precio_original: number | null;
  precio_actual: number | null;
  descuento: number | null;
  stock: number;
  tallas: string[];
  colores: string[];
  descripcion: string | null;
  caracteristicas: string[];
  imagen_principal: string | null;
  galeria: string[];
  created_at: string;
}

export function mapDbToProducto(db: DbProducto): Producto {
  return {
    id: db.id,
    nombre: db.nombre,
    subtitulo: db.subtitulo ?? "",
    categoria: db.categoria,
    precioOriginal: db.precio_original ?? 0,
    precioActual: db.precio_actual ?? 0,
    descuento: db.descuento ?? 0,
    rating: 0,
    totalOpiniones: 0,
    vendidos: 0,
    stock: db.stock,
    tallas: db.tallas,
    colores: db.colores,
    descripcion: db.descripcion ?? "",
    caracteristicas: db.caracteristicas,
    imagen_url: db.imagen_principal ?? undefined,
    imagenes: db.galeria.length > 0 ? db.galeria : undefined,
    reviews: [],
  };
}

export async function uploadImage(file: File, path: string): Promise<string> {
  const { error } = await supabase.storage
    .from("productos")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("productos").getPublicUrl(path);
  return data.publicUrl;
}
