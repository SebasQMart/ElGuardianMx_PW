"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!mobileMenuOpen) return;

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [mobileMenuOpen]);

    return (
        <header className="site-header">
            <a className="brand" href="#" aria-label="El Guardián MX, inicio">
                <span className="brand-mark">G</span>
                <span>El Guardián MX</span>
            </a>

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
                    <a className="active" href="#" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
                    <a href="#conocenos" onClick={() => setMobileMenuOpen(false)}>Conócenos</a>
                    <a href="#secciones" onClick={() => setMobileMenuOpen(false)}>Aprende</a>
                    <a href="#datos" onClick={() => setMobileMenuOpen(false)}>Datos</a>
                    <a href="#audiencias" onClick={() => setMobileMenuOpen(false)}>Audiencias</a>
                    <a href="#procesos" onClick={() => setMobileMenuOpen(false)}>Procesos</a>
                    <a href="#presupuesto" onClick={() => setMobileMenuOpen(false)}>Presupuesto</a>
                    <a href="#investigaciones" onClick={() => setMobileMenuOpen(false)}>Publicaciones</a>
                    <a href="#transparencia" onClick={() => setMobileMenuOpen(false)}>Transparencia</a>
                    <a href="#participa" onClick={() => setMobileMenuOpen(false)}>Participa</a>
                </nav>

                <div className="header-socials" aria-label="Redes sociales oficiales">
                    <a
                        href="https://www.facebook.com/profile.php?id=61590721940787"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook de El Guardián MX"
                        title="Facebook"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21z"
                            />
                        </svg>
                    </a>

                    <a
                        href="https://www.instagram.com/elguardianmx_oficial/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram de El Guardián MX"
                        title="Instagram"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" />
                        </svg>
                    </a>

                    <a
                        href="https://www.tiktok.com/@el.guardianmx.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="TikTok de El Guardián MX"
                        title="TikTok"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="currentColor"
                                d="M19.6 7.1a6.2 6.2 0 0 1-4.1-1.5v8.1a6.1 6.1 0 1 1-5.3-6.1v3.3a2.9 2.9 0 1 0 2.1 2.8V2.5h3.2a6.2 6.2 0 0 0 4.1 4.6z"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </header>
    );
}