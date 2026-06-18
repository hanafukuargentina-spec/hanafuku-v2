import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isConfigured = supabaseUrl.length > 0
  && supabaseAnonKey.length > 0
  && !supabaseUrl.includes("placeholder");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DbProducto {
  id: string;
  nombre: string;
  subtitulo: string;
  categoria: string;
  precio_original: number;
  precio_actual: number;
  descuento: number;
  rating: number;
  total_opiniones: number;
  vendidos: number;
  stock: number;
  tallas: string[];
  colores: string[];
  descripcion: string;
  caracteristicas: string[];
  imagen_url: string | null;
  imagenes: string[] | null;
  created_at: string;
}

export function mapDbProducto(db: DbProducto) {
  return {
    id: db.id,
    nombre: db.nombre,
    subtitulo: db.subtitulo,
    categoria: db.categoria,
    precioOriginal: db.precio_original,
    precioActual: db.precio_actual,
    descuento: db.descuento,
    rating: db.rating,
    totalOpiniones: db.total_opiniones,
    vendidos: db.vendidos,
    stock: db.stock,
    tallas: db.tallas,
    colores: db.colores,
    descripcion: db.descripcion,
    caracteristicas: db.caracteristicas,
    imagen_url: db.imagen_url ?? undefined,
    imagenes: db.imagenes ?? undefined,
    reviews: [],
  };
}
