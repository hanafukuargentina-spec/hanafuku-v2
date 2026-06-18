import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Package,
  Search,
} from "lucide-react";
import { supabase, type DbProducto } from "../../lib/supabase";
import { productosData, formatPrice } from "../../data/productos.data";
import type { Producto } from "../../types";
import { fadeInUp, stagger } from "../../lib/motion";

export default function Dashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    setLoading(true);
    if (!supabase) { setProductos(productosData); setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setProductos(productosData);
      } else {
        setProductos(
          (data as DbProducto[]).map((db) => ({
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
          }))
        );
      }
    } catch {
      setProductos(productosData);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Estas seguro de que queres eliminar este producto?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase!.from("productos").delete().eq("id", id);
      if (!error) {
        setProductos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // Silently fail
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const filtered = productos.filter(
    (p) =>
      busqueda === "" ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-1">
              <Package size={20} className="text-accent" />
              <h1 className="text-xl font-bold text-text-primary">
                Panel de Productos
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              {productos.length} productos en total
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <Link
              to="/admin/producto/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-background text-sm font-semibold rounded-sm hover:bg-accent-hover transition-colors"
            >
              <Plus size={16} />
              Nuevo Producto
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium text-text-secondary rounded-sm hover:text-danger hover:border-danger/30 transition-colors"
            >
              <LogOut size={16} />
              Salir
            </button>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </motion.div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-card rounded-sm border border-border animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Producto
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Categoria
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Precio
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Stock
                  </th>
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Tallas
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider py-3 px-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((producto) => (
                  <motion.tr
                    key={producto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-card/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-card rounded-sm border border-border flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-text-muted/40">
                            {producto.nombre
                              .split(" ")
                              .filter(
                                (w) => w.length > 1 && w[0] !== '"'
                              )
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary line-clamp-1">
                            {producto.nombre}
                          </p>
                          <p className="text-xs text-text-muted line-clamp-1">
                            {producto.subtitulo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-medium text-text-secondary px-2 py-1 bg-card rounded-sm border border-border">
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-text-primary">
                        {formatPrice(producto.precioActual)}
                      </p>
                      {producto.descuento > 0 && (
                        <p className="text-xs text-text-muted line-through">
                          {formatPrice(producto.precioOriginal)}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-medium ${
                          producto.stock <= 10
                            ? "text-danger"
                            : "text-text-primary"
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-text-secondary">
                        {producto.tallas.join(", ")}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/producto/${producto.id}`}
                          className="p-2 text-text-muted hover:text-accent transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          disabled={deleting === producto.id}
                          className="p-2 text-text-muted hover:text-danger transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deleting === producto.id ? (
                            <div className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-text-secondary">
              No se encontraron productos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
