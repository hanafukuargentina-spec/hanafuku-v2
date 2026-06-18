import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, PartyPopper, Mail } from "lucide-react";

const DISMISSED_KEY = "hanafuku_promo_dismissed";

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(dismiss, 3000);
  };

  const handleSkip = () => {
    setSubmitted(true);
    setTimeout(dismiss, 3000);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md bg-card border border-border rounded-sm overflow-hidden"
          >
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 p-1.5 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="bg-accent/10 border-b border-accent/20 px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles size={16} className="text-accent" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-accent">
                  Exclusivo
                </span>
                <Sparkles size={16} className="text-accent" />
              </div>
              <h2
                className="font-bold text-text-primary tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}
              >
                15% OFF
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                en tu primera compra
              </p>
            </div>

            {!submitted ? (
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start gap-3 p-3 bg-background rounded-sm border border-border">
                  <PartyPopper size={18} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary mb-0.5">
                      Fiestas HANAFUKU en Buenos Aires
                    </p>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      Accede a descuentos exclusivos en nuestros eventos y fiestas en CABA y GBA. Solo para suscriptores.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Tu email (opcional)"
                      className="w-full pl-9 pr-3 py-3 bg-background border border-border rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent hover:bg-accent-hover text-background font-semibold text-sm tracking-wide rounded-sm transition-colors duration-200"
                  >
                    QUIERO MI DESCUENTO
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-2 text-[11px] text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Ver descuento sin suscribirme
                  </button>
                </form>

                <p className="text-[10px] text-text-muted text-center leading-relaxed">
                  Al suscribirte recibis ofertas, acceso anticipado a drops y descuentos en eventos.
                </p>
              </div>
            ) : (
              <div className="px-6 py-8 text-center space-y-3">
                <div className="w-14 h-14 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                  <Sparkles size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    Tu codigo de descuento
                  </p>
                  <div className="inline-block px-5 py-2.5 bg-background border border-accent/30 rounded-sm">
                    <span className="text-lg font-bold tracking-[0.2em] text-accent">
                      HANAFUKU15
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-text-secondary">
                  Usalo en el checkout. Valido por 48hs.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
