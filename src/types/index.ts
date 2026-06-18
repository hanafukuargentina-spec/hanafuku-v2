export interface Review {
  id: string;
  usuario: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface Producto {
  id: string;
  nombre: string;
  subtitulo: string;
  categoria: string;
  precioOriginal: number;
  precioActual: number;
  descuento: number;
  rating: number;
  totalOpiniones: number;
  vendidos: number;
  stock: number;
  tallas: string[];
  colores: string[];
  descripcion: string;
  caracteristicas: string[];
  imagen_url?: string;
  imagenes?: string[];
  reviews: Review[];
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
  talla: string;
}
