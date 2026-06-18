import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { productosData } from "../data/productos.data";
import ProductCard from "./ProductCard";
import { fadeInUp, stagger } from "../lib/motion";

export default function ProductosSection() {
  const featured = productosData.slice(0, 4);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.p
            variants={fadeInUp}
            className="text-[10px] sm:text-xs text-accent font-medium tracking-widest uppercase mb-2"
          >
            Lo mas vendido
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-bold tracking-tight text-text-primary"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
          >
            PRODUCTOS DESTACADOS
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {featured.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-10"
        >
          <Link
            to="/coleccion"
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Ver toda la coleccion
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
