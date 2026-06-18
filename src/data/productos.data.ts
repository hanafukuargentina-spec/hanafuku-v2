import type { Producto } from "../types";

export const CATEGORIAS = [
  "Todas",
  "Remeras",
  "Buzos",
  "Pantalones",
  "Camperas",
  "Accesorios",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const TALLAS = ["XS", "S", "M", "L", "XL"] as const;

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const productosData: Producto[] = [
  {
    id: "1",
    nombre: 'Remera Oversize "Killua"',
    subtitulo: "Edición limitada con estampado eléctrico",
    categoria: "Remeras",
    precioOriginal: 25000,
    precioActual: 21250,
    descuento: 15,
    rating: 4.8,
    totalOpiniones: 124,
    vendidos: 340,
    stock: 45,
    tallas: ["XS", "S", "M", "L", "XL"],
    colores: ["Negro", "Blanco"],
    descripcion:
      "Remera oversize con estampado de Killua Zoldyck en la espalda. Algodón premium 100% peinado, corte boxy fit para un look relajado y urbano. Inspirada en la energía eléctrica del personaje.",
    caracteristicas: [
      "Algodón 100% peinado 24/1",
      "Corte oversize / boxy fit",
      "Estampado serigráfico de alta definición",
      "Costuras reforzadas",
      "Etiqueta tejida HANAFUKU",
    ],
    reviews: [
      {
        id: "r1",
        usuario: "Matías L.",
        rating: 5,
        comentario: "La calidad de la tela es increíble. El estampado no se desgasta.",
        fecha: "2026-05-10",
      },
      {
        id: "r2",
        usuario: "Camila R.",
        rating: 5,
        comentario: "Me encantó el fit oversize, queda perfecto.",
        fecha: "2026-04-28",
      },
    ],
  },
  {
    id: "2",
    nombre: 'Buzo Hoodie "Hunter x Hunter"',
    subtitulo: "Hoodie premium con bordado frontal",
    categoria: "Buzos",
    precioOriginal: 45000,
    precioActual: 38250,
    descuento: 15,
    rating: 4.9,
    totalOpiniones: 89,
    vendidos: 210,
    stock: 30,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro", "Gris Oscuro"],
    descripcion:
      "Hoodie de algodón frisado con bordado frontal del logo Hunter x Hunter. Interior brushed ultra suave, capucha con cordón y bolsillo canguro. La prenda estrella de la colección.",
    caracteristicas: [
      "Algodón frisado 100% premium",
      "Interior brushed ultra suave",
      "Bordado frontal de alta calidad",
      "Capucha doble con cordón",
      "Bolsillo canguro reforzado",
      "Puños y cintura con rib elástico",
    ],
    reviews: [
      {
        id: "r3",
        usuario: "Franco D.",
        rating: 5,
        comentario: "Mejor buzo que tuve en mi vida. La calidad es de otro nivel.",
        fecha: "2026-05-15",
      },
    ],
  },
  {
    id: "3",
    nombre: 'Pantalón Cargo "Phantom"',
    subtitulo: "Cargo táctico de corte recto",
    categoria: "Pantalones",
    precioOriginal: 38000,
    precioActual: 32300,
    descuento: 15,
    rating: 4.7,
    totalOpiniones: 67,
    vendidos: 180,
    stock: 25,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro", "Verde Militar"],
    descripcion:
      "Pantalón cargo con múltiples bolsillos tácticos, inspirado en la Brigada Fantasma. Tela gabardina reforzada con elastano para máxima comodidad y movilidad. Cordón ajustable en el tobillo.",
    caracteristicas: [
      "Gabardina 98% algodón, 2% elastano",
      "6 bolsillos funcionales",
      "Cordón ajustable en tobillo",
      "Cintura con elástico interno",
      "Costuras reforzadas triple puntada",
    ],
    reviews: [
      {
        id: "r4",
        usuario: "Nicolás P.",
        rating: 5,
        comentario: "Los bolsillos son super prácticos y el fit es genial.",
        fecha: "2026-05-02",
      },
    ],
  },
  {
    id: "4",
    nombre: 'Remera "Gon Freecss"',
    subtitulo: "Arte frontal con estilo manga",
    categoria: "Remeras",
    precioOriginal: 22000,
    precioActual: 18700,
    descuento: 15,
    rating: 4.6,
    totalOpiniones: 98,
    vendidos: 290,
    stock: 60,
    tallas: ["XS", "S", "M", "L", "XL"],
    colores: ["Negro", "Blanco", "Verde Oscuro"],
    descripcion:
      "Remera con ilustración exclusiva de Gon Freecss en estilo manga. Algodón peinado suave al tacto, corte regular fit. Diseño exclusivo de artistas locales colaborando con HANAFUKU.",
    caracteristicas: [
      "Algodón 100% peinado 30/1",
      "Corte regular fit",
      "Estampado DTG (impresión directa)",
      "Cuello reforzado sin deformación",
      "Diseño exclusivo de artista local",
    ],
    reviews: [
      {
        id: "r5",
        usuario: "Valentina S.",
        rating: 4,
        comentario: "Muy linda la remera, el estampado es hermoso.",
        fecha: "2026-04-20",
      },
    ],
  },
  {
    id: "5",
    nombre: 'Campera "Zoldyck"',
    subtitulo: "Campera técnica resistente al agua",
    categoria: "Camperas",
    precioOriginal: 55000,
    precioActual: 44000,
    descuento: 20,
    rating: 4.9,
    totalOpiniones: 45,
    vendidos: 95,
    stock: 15,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro", "Gris"],
    descripcion:
      "Campera técnica con tejido repelente al agua, inspirada en la familia Zoldyck. Cierre frontal YKK, bolsillos laterales con cierre y capucha desmontable. Ideal para los días de viento y lluvia leve.",
    caracteristicas: [
      "Tejido técnico water-repellent",
      "Cierre YKK premium",
      "Capucha desmontable con velcro",
      "Bolsillos laterales con cierre",
      "Bolsillo interno para celular",
      "Logo HANAFUKU bordado en manga",
    ],
    reviews: [
      {
        id: "r6",
        usuario: "Tomás G.",
        rating: 5,
        comentario: "Espectacular la campera. Aguanta la lluvia y el viento sin problema.",
        fecha: "2026-05-18",
      },
    ],
  },
  {
    id: "6",
    nombre: 'Gorra "HxH Logo"',
    subtitulo: "Gorra dad hat con bordado",
    categoria: "Accesorios",
    precioOriginal: 15000,
    precioActual: 12750,
    descuento: 15,
    rating: 4.5,
    totalOpiniones: 156,
    vendidos: 420,
    stock: 80,
    tallas: ["Única"],
    colores: ["Negro", "Beige"],
    descripcion:
      "Gorra estilo dad hat con bordado frontal del logo HxH. Estructura desestructurada, visera curva y hebilla metálica de ajuste trasero. Perfecta para completar cualquier outfit streetwear.",
    caracteristicas: [
      "Algodón lavado premium",
      "Bordado frontal 3D",
      "Estructura desestructurada",
      "Visera curva pre-curvada",
      "Hebilla metálica de ajuste",
      "Talle único ajustable",
    ],
    reviews: [
      {
        id: "r7",
        usuario: "Lucía M.",
        rating: 5,
        comentario: "Hermosa gorra, el bordado es impecable.",
        fecha: "2026-05-05",
      },
    ],
  },
];
