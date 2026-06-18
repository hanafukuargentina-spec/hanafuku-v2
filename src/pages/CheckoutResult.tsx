import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ShoppingBag } from "lucide-react";
import { fadeInUp, stagger } from "../lib/motion";

const statusConfig = {
  approved: {
    icon: CheckCircle,
    iconColor: "text-success",
    title: "Pago aprobado",
    message:
      "Tu compra fue procesada con exito. Vas a recibir un email con los detalles de tu pedido.",
    bgGlow: "bg-success/5",
  },
  rejected: {
    icon: XCircle,
    iconColor: "text-danger",
    title: "Pago rechazado",
    message:
      "No pudimos procesar tu pago. Por favor, intenta nuevamente o usa otro medio de pago.",
    bgGlow: "bg-danger/5",
  },
  pending: {
    icon: Clock,
    iconColor: "text-accent",
    title: "Pago pendiente",
    message:
      "Tu pago esta siendo procesado. Te notificaremos cuando se acredite.",
    bgGlow: "bg-accent/5",
  },
} as const;

export default function CheckoutResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <div className="max-w-lg mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            variants={fadeInUp}
            className={`w-24 h-24 mx-auto rounded-full ${config.bgGlow} flex items-center justify-center mb-6`}
          >
            <Icon size={48} className={config.iconColor} />
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-3"
          >
            {config.title}
          </motion.h1>

          {/* Message */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary leading-relaxed mb-8 max-w-sm mx-auto"
          >
            {config.message}
          </motion.p>

          {/* Payment ID */}
          {searchParams.get("payment_id") && (
            <motion.p
              variants={fadeInUp}
              className="text-xs text-text-muted mb-8"
            >
              ID de pago: {searchParams.get("payment_id")}
            </motion.p>
          )}

          {/* Actions */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <Link
              to="/coleccion"
              className="w-full py-3.5 bg-text-primary text-background font-semibold text-sm tracking-wide rounded-sm hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              SEGUIR COMPRANDO
            </Link>

            <Link
              to="/"
              className="w-full py-3 border border-border text-text-secondary text-sm font-medium rounded-sm hover:border-text-secondary hover:text-text-primary transition-colors text-center"
            >
              Volver al inicio
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
