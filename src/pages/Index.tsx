import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import ProductosSection from "../components/ProductosSection";
import { fadeInUp, stagger } from "../lib/motion";

export default function Index() {
  return (
    <>
      <HeroSection />
      <ProductosSection />

      {/* About Section */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="aspect-[4/3] sm:aspect-square bg-background rounded-sm border border-border flex items-center justify-center order-2 lg:order-1"
            >
              <span className="text-5xl sm:text-6xl font-bold text-text-muted/10 tracking-[0.3em] select-none">
                HF
              </span>
            </motion.div>

            <motion.div
              variants={stagger}
              className="space-y-5 order-1 lg:order-2"
            >
              <motion.p
                variants={fadeInUp}
                className="text-[10px] sm:text-xs text-accent font-medium tracking-widest uppercase"
              >
                Nuestra historia
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="font-bold tracking-tight text-text-primary"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
              >
                MAS QUE ROPA,
                <br />
                UN ESTILO DE VIDA
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base text-text-secondary leading-relaxed"
              >
                HANAFUKU nace de la fusion entre la cultura japonesa y el
                streetwear urbano argentino. Cada prenda esta disenada para
                quienes buscan expresar su pasion por el anime a traves de la
                moda.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base text-text-secondary leading-relaxed"
              >
                Trabajamos con materiales premium y procesos de estampado de alta
                calidad para que cada pieza sea unica y duradera.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="grid grid-cols-3 gap-4 sm:gap-6 pt-2"
              >
                {[
                  { value: "100%", label: "Algodon argentino" },
                  { value: "500+", label: "Disenos exclusivos" },
                  { value: "48hs", label: "Envio CABA/GBA" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-base sm:text-xl font-bold text-accent">
                      {item.value}
                    </p>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-sm border border-border bg-card px-6 py-10 sm:p-14 text-center"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-accent/5 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2
                className="font-bold tracking-tight text-text-primary mb-3"
                style={{ fontSize: "clamp(1.25rem, 4vw, 1.875rem)" }}
              >
                UNITE AL MOVIMIENTO
              </h2>
              <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto mb-6 sm:mb-8">
                Seguinos en Instagram para ver las ultimas novedades, drops
                exclusivos y detras de escena.
              </p>
              <Link
                to="/coleccion"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-accent text-background font-semibold text-sm tracking-wide rounded-sm hover:bg-accent-hover transition-colors duration-200"
              >
                VER COLECCION
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
