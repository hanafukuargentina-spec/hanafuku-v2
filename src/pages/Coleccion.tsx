import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { CATEGORIAS, type Categoria } from "../data/productos.data";
import { supabase, mapDbToProducto, type DbProducto } from "../lib/supabase";
import type { Producto } from "../types";
import ProductCard from "../components/ProductCard";
import { stagger } from "../lib/motion";

export default function Coleccion() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>(
    (searchParams.get("categoria") as Categoria) || "Todas"
  );
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProductos((data as DbProducto[]).map(mapDbToProducto));
      }
      setLoading(false);
    }

    fetchProductos();
  }, []);

  const handleCategoriaChange = (cat: Categoria) => {
    setCategoriaActiva(cat);
    if (cat === "Todas") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: cat });
    }
  };

  const filtered = productos.filter((p) => {
    const matchCategoria =
      categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    const matchBusqueda =
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.subtitulo.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  return (
    <div className="pt-28 sm:pt-36 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8 sm:mb-12"
        >
          <p className="text-[10px] sm:text-xs text-accent font-medium tracking-widest uppercase mb-2">
            Catalogo completo
          </p>
          <h1
            className="font-bold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)" }}
          >
            COLECCION
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoriaChange(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-wide rounded-sm border transition-colors duration-200 ${
                  categoriaActiva === cat
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-transparent text-text-secondary hover:border-text-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-sm text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-card rounded-sm border border-border" />
                <div className="mt-2.5 space-y-1.5">
                  <div className="h-2.5 bg-card rounded w-12" />
                  <div className="h-3.5 bg-card rounded w-3/4" />
                  <div className="h-2.5 bg-card rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-sm text-text-secondary">
              No se encontraron productos
            </p>
            <button
              onClick={() => {
                setCategoriaActiva("Todas");
                setBusqueda("");
                setSearchParams({});
              }}
              className="mt-2 text-xs text-accent hover:underline"
            >
              Limpiar filtros
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            key={categoriaActiva + busqueda}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
          >
            {filtered.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </motion.div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-[10px] sm:text-xs text-text-muted text-center mt-6">
            {filtered.length}{" "}
            {filtered.length === 1 ? "producto" : "productos"}
          </p>
        )}
      </div>
    </div>
  );
}
