import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { productosData, formatPrice } from "../data/productos.data";
import { supabase, mapDbProducto, type DbProducto } from "../lib/supabase";
import type { Producto } from "../types";
import SizeSelector from "../components/SizeSelector";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { fadeInUp, stagger } from "../lib/motion";

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProducto() {
      setLoading(true);
      if (!supabase) {
        setProducto(productosData.find((p) => p.id === id) || null);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          setProducto(productosData.find((p) => p.id === id) || null);
        } else {
          setProducto(mapDbProducto(data as DbProducto));
        }
      } catch {
        setProducto(productosData.find((p) => p.id === id) || null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducto();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (producto) {
      setSelectedTalla(producto.tallas[0] || "");
      setSelectedColor(producto.colores[0] || "");
    }
  }, [producto]);

  const handleAddToCart = () => {
    if (!producto || !selectedTalla) return;
    addItem(producto, selectedTalla);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!producto || !selectedTalla) return;
    addItem(producto, selectedTalla);
    navigate("/checkout");
  };

  const related = productosData
    .filter((p) => p.categoria === producto?.categoria && p.id !== producto?.id)
    .slice(0, 4);

  if (loading) {
    return (
      <div className="pt-28 sm:pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 animate-pulse">
            <div className="aspect-square bg-card rounded-sm border border-border" />
            <div className="space-y-3 py-2">
              <div className="h-3 bg-card rounded w-16" />
              <div className="h-7 bg-card rounded w-3/4" />
              <div className="h-3 bg-card rounded w-1/2" />
              <div className="h-5 bg-card rounded w-1/3 mt-3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="pt-28 sm:pt-36 pb-16 text-center">
        <p className="text-sm text-text-secondary mb-3">Producto no encontrado</p>
        <Link to="/coleccion" className="text-xs text-accent hover:underline">
          Volver a la coleccion
        </Link>
      </div>
    );
  }

  const initials = producto.nombre
    .split(" ")
    .filter((w) => w.length > 1 && w[0] !== '"')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div className="pt-28 sm:pt-36 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-5"
        >
          <Link
            to="/coleccion"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-2.5"
          >
            <div className="aspect-square bg-card rounded-sm border border-border flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl sm:text-8xl font-bold text-text-muted/10 tracking-wider select-none">
                {initials}
              </span>

              {producto.descuento > 0 && (
                <div className="absolute top-3 left-3 bg-accent text-background text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-sm">
                  -{producto.descuento}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square bg-card rounded-sm border flex items-center justify-center ${
                    i === 0 ? "border-accent" : "border-border"
                  }`}
                >
                  <span className="text-xs font-bold text-text-muted/15 select-none">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="py-1"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[10px] sm:text-xs text-accent font-medium tracking-widest uppercase mb-1.5"
            >
              {producto.categoria}
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="font-bold text-text-primary tracking-tight mb-1"
              style={{ fontSize: "clamp(1.25rem, 3vw, 1.875rem)" }}
            >
              {producto.nombre}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xs sm:text-sm text-text-secondary"
            >
              {producto.subtitulo}
            </motion.p>

            {/* Rating */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-1.5 sm:gap-2 mt-3 flex-wrap"
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.round(producto.rating)
                        ? "text-accent fill-accent"
                        : "text-text-muted"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-text-secondary">
                {producto.rating}
              </span>
              <span className="text-[10px] text-text-muted">
                ({producto.totalOpiniones} opiniones)
              </span>
              <span className="text-[10px] text-text-muted">
                · {producto.vendidos} vendidos
              </span>
            </motion.div>

            {/* Price */}
            <motion.div
              variants={fadeInUp}
              className="flex items-baseline gap-2.5 mt-4"
            >
              <span
                className="font-bold text-text-primary"
                style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
              >
                {formatPrice(producto.precioActual)}
              </span>
              {producto.descuento > 0 && (
                <span className="text-sm text-text-muted line-through">
                  {formatPrice(producto.precioOriginal)}
                </span>
              )}
            </motion.div>

            <motion.hr variants={fadeInUp} className="border-border my-5" />

            {/* Color selector */}
            {producto.colores.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-4">
                <p className="text-xs font-medium text-text-primary mb-2">
                  Color:{" "}
                  <span className="text-text-secondary font-normal">
                    {selectedColor}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {producto.colores.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-[11px] font-medium border rounded-sm transition-colors duration-200 ${
                        selectedColor === color
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border text-text-secondary hover:border-text-secondary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Size selector */}
            <motion.div variants={fadeInUp} className="mb-5">
              <p className="text-xs font-medium text-text-primary mb-2">
                Talla:{" "}
                <span className="text-text-secondary font-normal">
                  {selectedTalla}
                </span>
              </p>
              <SizeSelector
                tallas={producto.tallas}
                selected={selectedTalla}
                onChange={setSelectedTalla}
              />
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <button
                onClick={handleBuyNow}
                disabled={!selectedTalla || producto.stock === 0}
                className="w-full py-3 bg-accent hover:bg-accent-hover text-background font-semibold text-xs sm:text-sm tracking-wide rounded-sm transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                COMPRAR AHORA
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedTalla || producto.stock === 0}
                className={`w-full py-3 font-semibold text-xs sm:text-sm tracking-wide rounded-sm transition-colors duration-200 flex items-center justify-center gap-2 border ${
                  added
                    ? "bg-success/10 border-success text-success"
                    : producto.stock === 0
                    ? "bg-card border-border text-text-muted cursor-not-allowed"
                    : "border-border text-text-primary hover:border-accent hover:text-accent"
                }`}
              >
                <ShoppingBag size={14} />
                {added
                  ? "AGREGADO"
                  : producto.stock === 0
                  ? "SIN STOCK"
                  : "AGREGAR AL CARRITO"}
              </button>
            </motion.div>

            {producto.stock > 0 && producto.stock <= 10 && (
              <motion.p
                variants={fadeInUp}
                className="text-[10px] text-accent mt-2"
              >
                Ultimas {producto.stock} unidades
              </motion.p>
            )}

            {/* Trust badges */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 pt-5 border-t border-border"
            >
              {[
                { icon: Truck, text: "Envio nacional" },
                { icon: Shield, text: "Pago seguro" },
                { icon: RotateCcw, text: "Cambio gratis" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="text-center">
                  <Icon
                    size={16}
                    className="mx-auto text-text-muted mb-1"
                  />
                  <p className="text-[10px] text-text-muted leading-tight">
                    {text}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp} className="mt-6">
              <h3 className="text-xs font-semibold text-text-primary mb-2">
                Descripcion
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {producto.descripcion}
              </p>
            </motion.div>

            {/* Characteristics */}
            <motion.div variants={fadeInUp} className="mt-5">
              <h3 className="text-xs font-semibold text-text-primary mb-2">
                Caracteristicas
              </h3>
              <ul className="space-y-1.5">
                {producto.caracteristicas.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary"
                  >
                    <span className="w-1 h-1 bg-accent rounded-full mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews */}
        {producto.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mt-12 sm:mt-16 pt-10 border-t border-border"
          >
            <h2 className="text-sm sm:text-base font-semibold text-text-primary mb-5">
              Opiniones ({producto.reviews.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {producto.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-card rounded-sm border border-border"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className={
                            i < review.rating
                              ? "text-accent fill-accent"
                              : "text-text-muted"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-text-muted ml-auto">
                      {review.fecha}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    "{review.comentario}"
                  </p>
                  <p className="text-[10px] text-text-muted font-medium">
                    — {review.usuario}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="mt-12 sm:mt-16 pt-10 border-t border-border"
          >
            <h2 className="text-sm sm:text-base font-semibold text-text-primary mb-5">
              Productos relacionados
            </h2>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
            >
              {related.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
