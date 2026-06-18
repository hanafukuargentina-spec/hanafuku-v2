import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-bold tracking-[0.2em] text-text-primary mb-2">
              HANAFUKU
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xs">
              Streetwear con alma japonesa. Hecho en Argentina.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-text-primary mb-3 tracking-wide uppercase">
              Navegacion
            </h4>
            <ul className="space-y-1.5">
              {[
                { to: "/", label: "Inicio" },
                { to: "/coleccion", label: "Coleccion" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-text-primary mb-3 tracking-wide uppercase">
              Categorias
            </h4>
            <ul className="space-y-1.5">
              {["Remeras", "Buzos", "Pantalones", "Accesorios"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/coleccion?categoria=${cat}`}
                    className="text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[10px] sm:text-xs font-semibold text-text-primary mb-3 tracking-wide uppercase">
              Contacto
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://instagram.com/hanafuku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  <Instagram size={14} />
                  @hanafuku
                </a>
              </li>
              <li>
                <a
                  href="mailto:hola@hanafuku.com.ar"
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  <Mail size={14} />
                  hola@hanafuku.com.ar
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-text-muted">
            &copy; {new Date().getFullYear()} HANAFUKU. Todos los derechos
            reservados.
          </p>
          <p className="text-[10px] text-text-muted">
            Desarrollado por{" "}
            <span className="text-text-secondary font-medium">Trivar&reg;</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
