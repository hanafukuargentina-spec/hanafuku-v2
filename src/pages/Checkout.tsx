import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productos.data";
import { fadeInUp, stagger } from "../lib/motion";

interface PayerForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<PayerForm>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const set = (key: keyof PayerForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (items.length === 0) {
    return (
      <div className="pt-28 sm:pt-36 pb-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-text-secondary mb-4">Tu carrito esta vacio</p>
          <Link
            to="/coleccion"
            className="text-accent hover:underline text-sm"
          >
            Ir a la coleccion
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        items: items.map((item) => ({
          id: item.producto.id,
          nombre: item.producto.nombre,
          talla: item.talla,
          precioActual: item.producto.precioActual,
          cantidad: item.cantidad,
        })),
        payer: form,
      };

      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la preferencia de pago");
      }

      clearCart();

      const redirectUrl = data.sandbox_init_point || data.init_point;
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el pago"
      );
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm bg-card border border-border rounded-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors";

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link
            to="/coleccion"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} />
            Seguir comprando
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-10"
        >
          Finalizar compra
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
            {/* Left: Buyer info */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Contact */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-widest mb-4">
                  Datos de contacto
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-text-secondary mb-1.5">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nombre}
                        onChange={(e) => set("nombre", e.target.value)}
                        placeholder="Juan"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-1.5">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.apellido}
                        onChange={(e) => set("apellido", e.target.value)}
                        placeholder="Perez"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="juan@email.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1.5">
                      Telefono
                    </label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => set("telefono", e.target.value)}
                      placeholder="11 2345 6789"
                      className={inputClass}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-3 pt-4"
              >
                {[
                  { icon: ShieldCheck, text: "Pago 100% seguro" },
                  { icon: Truck, text: "Envio a todo el pais" },
                  { icon: CreditCard, text: "Hasta 12 cuotas" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex flex-col items-center gap-2 py-4 bg-card border border-border rounded-sm text-center"
                  >
                    <Icon size={18} className="text-accent" />
                    <span className="text-[11px] text-text-secondary leading-tight">
                      {text}
                    </span>
                  </div>
                ))}
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-sm text-sm text-danger"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Right: Order summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card border border-border rounded-sm p-6 sticky top-24">
                <h2 className="text-sm font-semibold text-text-primary uppercase tracking-widest mb-5">
                  Resumen del pedido
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const initials = item.producto.nombre
                      .split(" ")
                      .filter((w) => w.length > 1 && w[0] !== '"')
                      .slice(0, 2)
                      .map((w) => w[0].toUpperCase())
                      .join("");

                    return (
                      <div
                        key={`${item.producto.id}-${item.talla}`}
                        className="flex gap-3"
                      >
                        <div className="w-14 h-16 bg-background border border-border rounded-sm flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-text-muted/30">
                            {initials}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary line-clamp-1">
                            {item.producto.nombre}
                          </p>
                          <p className="text-xs text-text-muted">
                            Talla {item.talla} · Cant. {item.cantidad}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-text-primary shrink-0">
                          {formatPrice(
                            item.producto.precioActual * item.cantidad
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Envio</span>
                    <span
                      className={
                        shipping === 0 ? "text-success" : "text-text-primary"
                      }
                    >
                      {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-text-muted">
                      Envio gratis en compras mayores a {formatPrice(50000)}
                    </p>
                  )}
                </div>

                <div className="border-t border-border mt-4 pt-4 flex justify-between items-baseline">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-[#009EE3] hover:bg-[#007EB8] text-white font-semibold text-sm tracking-wide rounded-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      PAGAR CON MERCADO PAGO
                    </>
                  )}
                </button>

                <p className="text-[10px] text-text-muted text-center mt-3">
                  Seras redirigido a Mercado Pago para completar el pago de
                  forma segura.
                </p>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
