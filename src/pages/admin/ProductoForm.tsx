import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { supabase, uploadImage, type DbProducto } from "../../lib/supabase";
import { CATEGORIAS } from "../../data/productos.data";
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
  imagen_principal_url: string;
  galeria_urls: string[];
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
  imagen_principal_url: "",
  galeria_urls: [],
};

export default function ProductoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) return;

    async function fetchProducto() {
      const { data, error: fetchError } = await supabase
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

      if (!fetchError && data) {
        const db = data as DbProducto;
        setForm({
          nombre: db.nombre,
          subtitulo: db.subtitulo ?? "",
          categoria: db.categoria,
          precio_original: db.precio_original ?? 0,
          precio_actual: db.precio_actual ?? 0,
          descuento: db.descuento ?? 0,
          stock: db.stock,
          tallas: db.tallas,
          colores: db.colores,
          descripcion: db.descripcion ?? "",
          caracteristicas: db.caracteristicas.join("\n"),
          imagen_principal_url: db.imagen_principal ?? "",
          galeria_urls: db.galeria ?? [],
        });
        if (db.imagen_principal) setMainImagePreview(db.imagen_principal);
        if (db.galeria) setGalleryPreviews(db.galeria);
      }
      setFetching(false);
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

  const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setGalleryFiles((prev) => [...prev, ...newFiles]);
    setGalleryPreviews((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    const isExisting = index < form.galeria_urls.length;
    if (isExisting) {
      setForm((prev) => ({
        ...prev,
        galeria_urls: prev.galeria_urls.filter((_, i) => i !== index),
      }));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - form.galeria_urls.length;
      setGalleryFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const productId = isEditing ? id! : crypto.randomUUID();

      let imagenPrincipalUrl = form.imagen_principal_url;
      if (mainImageFile) {
        const ext = mainImageFile.name.split(".").pop();
        const path = `${productId}/principal.${ext}`;
        imagenPrincipalUrl = await uploadImage(mainImageFile, path);
      }

      const existingGaleria = form.galeria_urls;
      const newGaleriaUrls: string[] = [];
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${productId}/galeria-${Date.now()}-${i}.${ext}`;
        const url = await uploadImage(file, path);
        newGaleriaUrls.push(url);
      }
      const galeriaFinal = [...existingGaleria, ...newGaleriaUrls];

      const payload = {
        nombre: form.nombre,
        subtitulo: form.subtitulo,
        categoria: form.categoria,
        precio_original: form.precio_original,
        precio_actual: form.precio_actual,
        descuento: form.descuento,
        stock: form.stock,
        tallas: form.tallas,
        colores: form.colores,
        descripcion: form.descripcion,
        caracteristicas: form.caracteristicas
          .split("\n")
          .filter((c) => c.trim() !== ""),
        imagen_principal: imagenPrincipalUrl || null,
        galeria: galeriaFinal,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", id);
        if (updateError) {
          setError("Error al actualizar: " + updateError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase
          .from("productos")
          .insert({ id: productId, ...payload });
        if (insertError) {
          setError("Error al crear: " + insertError.message);
          setLoading(false);
          return;
        }
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError("Error inesperado: " + (err instanceof Error ? err.message : "Intenta nuevamente."));
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

            {/* Main Image */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Imagen principal
              </label>
              <div className="flex items-start gap-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 bg-background border border-dashed border-border rounded-sm flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors overflow-hidden shrink-0"
                >
                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload size={20} className="mx-auto text-text-muted mb-1" />
                      <p className="text-[10px] text-text-muted">Subir imagen</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImage}
                  className="hidden"
                />
                {mainImagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setMainImagePreview(null);
                      setMainImageFile(null);
                      setForm((prev) => ({ ...prev, imagen_principal_url: "" }));
                    }}
                    className="p-1.5 text-text-muted hover:text-danger transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Galeria de imagenes
              </label>
              <div className="flex flex-wrap gap-2">
                {galleryPreviews.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-border">
                    <img src={url} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center text-text-muted hover:text-danger transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-20 h-20 border border-dashed border-border rounded-sm flex items-center justify-center hover:border-accent/50 transition-colors"
                >
                  <ImageIcon size={16} className="text-text-muted" />
                </button>
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImages}
                className="hidden"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">
                Nombre del producto
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
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
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                  onChange={(e) => setForm({ ...form, precio_original: Number(e.target.value) })}
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
                  onChange={(e) => setForm({ ...form, precio_actual: Number(e.target.value) })}
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
                  onChange={(e) => setForm({ ...form, descuento: Number(e.target.value) })}
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
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
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
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
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
                onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
                rows={4}
                placeholder={"Algodon 100% peinado\nCorte oversize\nEstampado serigrafico"}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
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
