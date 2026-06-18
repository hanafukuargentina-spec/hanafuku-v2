import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import type { Producto } from "../types";
import { formatPrice } from "../data/productos.data";
import { fadeInUp } from "../lib/motion";

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const initials = producto.nombre
    .split(" ")
    .filter((w) => w.length > 1 && w[0] !== '"')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <motion.div variants={fadeInUp} className="group">
      <Link to={`/producto/${producto.id}`} className="block">
        <div className="relative aspect-[3/4] bg-card rounded-sm overflow-hidden border border-border group-hover:border-accent/40 transition-colors duration-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-bold text-text-muted/15 tracking-wider select-none">
              {initials}
            </span>
          </div>

          {producto.descuento > 0 && (
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-accent text-background text-[11px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 rounded-sm">
              -{producto.descuento}%
            </div>
          )}

          <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-200 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
            <span className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-text-primary text-background text-xs font-semibold tracking-wide rounded-sm">
              <ShoppingBag size={14} />
              VER PRODUCTO
            </span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 space-y-1.5">
          <p className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wider">
            {producto.categoria}
          </p>
          <h3 className="text-sm sm:text-base font-medium text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
            {producto.nombre}
          </h3>

          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-accent fill-accent shrink-0" />
            <span className="text-xs text-text-secondary">
              {producto.rating}
            </span>
            <span className="text-xs text-text-muted">
              ({producto.totalOpiniones})
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-semibold text-text-primary">
              {formatPrice(producto.precioActual)}
            </span>
            {producto.descuento > 0 && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(producto.precioOriginal)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
