"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="site-header">
      <Link
        className="brand"
        href="/"
        aria-label="Observatorio de Justicia Morelos, inicio"
        onClick={() => setMobileMenuOpen(false)}
      >
        <Image
          src="/logo-observatorio-justicia-morelos.jpeg"
          alt="Logo del Observatorio de Justicia Morelos"
          width={65}
          height={65}
          priority
          className="brand-logo"
        />

        <span className="brand-text">
          <strong>OBSERVATORIO</strong>
          <small>DE JUSTICIA MORELOS</small>
        </span>
      </Link>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span>{mobileMenuOpen ? "✕" : "☰"}</span>
      </button>

      <div
        id="mobile-navigation"
        className={`header-menu ${mobileMenuOpen ? "is-open" : ""}`}
      >
        <nav className="main-nav" aria-label="Navegación principal">
          <Link
            className={pathname === "/" ? "active" : ""}
            href="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            Inicio
          </Link>

          <Link
            className={pathname === "/conocenos" ? "active" : ""}
            href="/conocenos"
            onClick={() => setMobileMenuOpen(false)}
          >
            Conócenos
          </Link>

          {/* <a href="#aprende" onClick={() => setMobileMenuOpen(false)}>Aprende</a> */}

          <Link
            className={pathname === "/datos" ? "active" : ""}
            href="/datos"
            onClick={() => setMobileMenuOpen(false)}
          >
            Datos
          </Link>

          <Link
            className={pathname === "/audiencias" ? "active" : ""}
            href="/audiencias"
            onClick={() => setMobileMenuOpen(false)}
          >
            Audiencias
          </Link>

          {/* <a href="#procesos" onClick={() => setMobileMenuOpen(false)}>Procesos</a> */}
          {/* <a href="#presupuesto" onClick={() => setMobileMenuOpen(false)}>Presupuesto</a> */}

          <Link
            className={pathname === "/publicaciones" ? "active" : ""}
            href="/publicaciones"
            onClick={() => setMobileMenuOpen(false)}
          >
            Publicaciones
          </Link>

          {/* <a href="#transparencia" onClick={() => setMobileMenuOpen(false)}>Transparencia</a> */}
          {/* <a href="#participa" onClick={() => setMobileMenuOpen(false)}>Participa</a> */}
        </nav>
      </div>
    </header>
  );
}
