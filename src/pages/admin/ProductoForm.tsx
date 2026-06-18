import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { supabase, type DbProducto } from "../../lib/supabase";
import { productosData, CATEGORIAS } from "../../data/productos.data";
import { fadeInUp, stagger } from "../../lib/motion";

const TALLAS_OPTIONS = ["XS", "S", "M", "L", "XL", "Unica"];
const COLORES_OPTIONS = [
  "Negro",
  "Blanco",
  "Gris",
  "Gris Oscuro",
  "Verde Militar",
  "Verde Oscuro",
  "Beige",
];

interface FormData {
  nombre: string;
  subtitulo: string;
  categoria: string;
  precio_original: number;
  precio_actual: number;
  descuento: number;
  stock: number;
  tallas: string[];
  colores: string[];
  descripcion: string;
  caracteristicas: string;
  imagen_url: string;
}

const emptyForm: FormData = {
  nombre: "",
  subtitulo: "",
  categoria: "Remeras",
  precio_original: 0,
  precio_actual: 0,
  descuento: 0,
  stock: 0,
  tallas: [],
  colores: [],
  descripcion: "",
  caracteristicas: "",
  imagen_url: "",
};

export default function ProductoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function fetchProducto() {
      if (!supabase) { setLoading(false); return; }
      try {
        const { data, error: fetchError } = await supabase
          .from("productos")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError || !data) {
          // Fallback to local data
          const local = productosData.find((p) => p.id === id);
          if (local) {
            setForm({
              nombre: local.nombre,
              subtitulo: local.subtitulo,
              categoria: local.categoria,
              precio_original: local.precioOriginal,
              precio_actual: local.precioActual,
              descuento: local.descuento,
              stock: local.stock,
              tallas: local.tallas,
              colores: local.colores,
              descripcion: local.descripcion,
              caracteristicas: local.caracteristicas.join("\n"),
              imagen_url: local.imagen_url || "",
            });
          }
        } else {
          const db = data as DbProducto;
          setForm({
            nombre: db.nombre,
            subtitulo: db.subtitulo,
            categoria: db.categoria,
            precio_original: db.precio_original,
            precio_actual: db.precio_actual,
            descuento: db.descuento,
            stock: db.stock,
            tallas: db.tallas,
            colores: db.colores,
            descripcion: db.descripcion,
            caracteristicas: db.caracteristicas.join("\n"),
            imagen_url: db.imagen_url || "",
          });
        }
      } catch {
        // Silently fail
      } finally {
        setFetching(false);
      }
    }

    fetchProducto();
  }, [id, isEditing]);

  const toggleTalla = (talla: string) => {
    setForm((prev) => ({
      ...prev,
      tallas: prev.tallas.includes(talla)
        ? prev.tallas.filter((t) => t !== talla)
        : [...prev.tallas, talla],
    }));
  };

  const toggleColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colores: prev.colores.includes(color)
        ? prev.colores.filter((c) => c !== color)
        : [...prev.colores, color],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      nombre: form.nombre,
      subtitulo: form.subtitulo,
      categoria: form.categoria,
      precio_original: form.precio_original,
      precio_actual: form.precio_actual,
      descuento: form.descuento,
      rating: 0,
      total_opiniones: 0,
      vendidos: 0,
      stock: form.stock,
      tallas: form.tallas,
      colores: form.colores,
      descripcion: form.descripcion,
      caracteristicas: form.caracteristicas
        .split("\n")
        .filter((c) => c.trim() !== ""),
      imagen_url: form.imagen_url || null,
      imagenes: null,
    };

    try {
      if (!supabase) { setError("Supabase no configurado."); setLoading(false); return; }
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", id);

        if (updateError) {
          setError("Error al actualizar el producto: " + updateError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("productos")
          .insert(payload);

        if (insertError) {
          setError("Error al crear el producto: " + insertError.message);
          setLoading(false);
          return;
        }
      }

      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const categorias = CATEGORIAS.filter((c) => c !== "Todas");

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Volver al panel
        </Link>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-xl font-bold text-text-primary mb-6"
          >
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </motion.h1>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-sm p-6 space-y-5"
          >
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-sm text-sm text-danger">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Nombre del producto
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                required
                placeholder='Remera Oversize "Killua"'
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Subtitulo
              </label>
              <input
                type="text"
                value={form.subtitulo}
                onChange={(e) =>
                  setForm({ ...form, subtitulo: e.target.value })
                }
                required
                placeholder="Edicion limitada con estampado electrico"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Categoria
              </label>
              <select
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Precio original (ARS)
                </label>
                <input
                  type="number"
                  value={form.precio_original || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      precio_original: Number(e.target.value),
                    })
                  }
                  required
                  min={0}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Precio actual (ARS)
                </label>
                <input
                  type="number"
                  value={form.precio_actual || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      precio_actual: Number(e.target.value),
                    })
                  }
                  required
                  min={0}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  value={form.descuento || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descuento: Number(e.target.value),
                    })
                  }
                  min={0}
                  max={100}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Stock
              </label>
              <input
                type="number"
                value={form.stock || ""}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                required
                min={0}
                className="w-full sm:w-32 px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Tallas */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Tallas disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {TALLAS_OPTIONS.map((talla) => (
                  <button
                    key={talla}
                    type="button"
                    onClick={() => toggleTalla(talla)}
                    className={`min-w-[44px] h-9 px-3 text-xs font-medium border rounded-sm transition-all duration-200 ${
                      form.tallas.includes(talla)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-transparent text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    {talla}
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Colores disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORES_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleColor(color)}
                    className={`h-9 px-3 text-xs font-medium border rounded-sm transition-all duration-200 ${
                      form.colores.includes(color)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-transparent text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Descripcion
              </label>
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                required
                rows={4}
                placeholder="Descripcion detallada del producto..."
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>

            {/* Characteristics */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Caracteristicas (una por linea)
              </label>
              <textarea
                value={form.caracteristicas}
                onChange={(e) =>
                  setForm({ ...form, caracteristicas: e.target.value })
                }
                rows={4}
                placeholder={"Algodon 100% peinado\nCorte oversize\nEstampado serigrafico"}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                URL de imagen (opcional)
              </label>
              <input
                type="url"
                value={form.imagen_url}
                onChange={(e) =>
                  setForm({ ...form, imagen_url: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold text-sm rounded-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isEditing ? "Guardar Cambios" : "Crear Producto"}
              </button>
              <Link
                to="/admin/dashboard"
                className="px-6 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
