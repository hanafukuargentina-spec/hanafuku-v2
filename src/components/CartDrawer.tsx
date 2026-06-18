import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/productos.data";
import { slideInRight } from "../lib/motion";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-50"
          />

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">
                  Carrito
                </h2>
                <span className="text-[10px] text-text-muted">
                  ({items.length})
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <ShoppingBag size={40} className="text-text-muted/20 mb-3" />
                  <p className="text-xs text-text-secondary mb-1">
                    Tu carrito esta vacio
                  </p>
                  <p className="text-[10px] text-text-muted">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
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
                        className="flex gap-3 p-4"
                      >
                        <div className="w-16 h-20 bg-card rounded-sm border border-border flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-text-muted/20 select-none">
                            {initials}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-medium text-text-primary line-clamp-1">
                            {item.producto.nombre}
                          </h3>
                          <p className="text-[10px] text-text-muted mt-0.5">
                            Talla: {item.talla}
                          </p>
                          <p className="text-xs font-semibold text-accent mt-1">
                            {formatPrice(item.producto.precioActual)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded-sm">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.producto.id,
                                    item.talla,
                                    item.cantidad - 1
                                  )
                                }
                                className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-medium text-text-primary w-6 text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.producto.id,
                                    item.talla,
                                    item.cantidad + 1
                                  )
                                }
                                className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                removeItem(item.producto.id, item.talla)
                              }
                              className="p-1 text-text-muted hover:text-danger transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-4 py-3 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">Envio</span>
                  <span
                    className={`font-medium ${
                      shipping === 0 ? "text-success" : "text-text-primary"
                    }`}
                  >
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-text-muted">
                    Gratis en compras mayores a {formatPrice(50000)}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-text-primary">
                    Total
                  </span>
                  <span className="text-base font-bold text-accent">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-2.5 bg-text-primary text-background font-semibold text-xs tracking-wide rounded-sm hover:bg-accent transition-colors duration-200"
                >
                  FINALIZAR COMPRA
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-1.5 text-[10px] text-text-muted hover:text-danger transition-colors text-center"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
