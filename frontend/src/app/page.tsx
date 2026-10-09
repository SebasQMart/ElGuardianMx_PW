'use client';

import { useEffect, useRef, useState } from 'react';

// EJEMPLOS O DEMO DE CONTENIDO, SE REEMPLAZARÁN CON DATOS REALES EN LA VERSIÓN FINAL
const diapositivas = [
  {
    etiqueta: 'EL GUARDIÁN MX',
    titulo: 'Verdad. Justicia.',
    destacado: 'Transparencia.',
    descripcion:
      'La información es poder y ese poder debe de estar siempre al servicio de la gente.',
    boton: 'Conoce nuestras investigaciones',
    enlace: '#investigaciones',
    imagen:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=85',
  },
  {
    etiqueta: 'EJEMPLO 1 · DATOS',
    titulo: 'Los datos también',
    destacado: 'cuentan historias.',
    descripcion:
      'Explora indicadores y fuentes para comprender mejor el funcionamiento del sistema de justicia.',
    boton: 'Explorar datos',
    enlace: '#secciones',
    imagen:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85',
  },
  {
    etiqueta: 'EJEMPLO 2 · INVESTIGACIÓN',
    titulo: 'Preguntar para',
    destacado: 'llegar a la verdad.',
    descripcion:
      'Investigaciones que analizan información pública y plantean preguntas relevantes para la ciudadanía.',
    boton: 'Ver investigaciones',
    enlace: '#investigaciones',
    imagen:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85',
  },
  {
    etiqueta: 'EJEMPLO 3 · JUSTICIA',
    titulo: 'Entender el sistema',
    destacado: 'es el primer paso.',
    descripcion:
      'Conoce las instituciones, los procedimientos y los retos que existen en el acceso a la justicia.',
    boton: 'Explorar apartados',
    enlace: '#secciones',
    imagen:
      'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=85',
  },
  {
    etiqueta: 'EJEMPLO 4 · TRANSPARENCIA',
    titulo: 'Información pública',
    destacado: 'para todos.',
    descripcion:
      'Consulta publicaciones, metodologías y fuentes para conocer cómo se construye cada análisis.',
    boton: 'Conocer el proyecto',
    enlace: '#conocenos',
    imagen:
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85',
  },
];

// EJEMPLOS O DEMO DE CONTENIDO, SE REEMPLAZARÁN CON DATOS REALES EN LA VERSIÓN FINAL
const secciones = [
  {
    titulo: 'Investigaciones',
    descripcion: 'Profundizamos en los temas que impactan a nuestra sociedad con rigor y evidencia.',
    icono: '⌕',
  },
  {
    titulo: 'Notas',
    descripcion: 'Información clara y verificada sobre lo que ocurre en México y el mundo.',
    icono: '▤',
  },
  {
    titulo: 'Conócenos',
    descripcion: 'Somos un medio independiente comprometido con la verdad, la ética y la ciudadanía.',
    icono: '♧',
  },
  {
    titulo: 'Datos',
    descripcion: 'Consulta indicadores, estadísticas y visualizaciones sobre el sistema de justicia.',
    icono: '▥',
  },
  {
    titulo: 'Audiencias',
    descripcion: 'Panorama agregado de audiencias, resultados y decisiones procesales.',
    icono: '⚖',
  },
  {
    titulo: 'Procesos',
    descripcion: 'Trayectorias, demoras y diagnósticos del sistema de justicia.',
    icono: '▰',
  },
  {
    titulo: 'Presupuesto',
    descripcion: 'Recursos, personal, vacantes y costos de oportunidad.',
    icono: '$',
  },
  {
    titulo: 'Publicaciones',
    descripcion: 'Reportes, fichas, visualizaciones y hemeroteca.',
    icono: '▥',
  },
  {
    titulo: 'Transparencia del proyecto',
    descripcion: 'Quiénes somos, alianzas, metodología, correcciones y contacto.',
    icono: '◇',
  },
  {
    titulo: 'Participa',
    descripcion: 'Convocatorias, servicio social, prácticas y colaboración académica.',
    icono: '♧',
  },
];

// EJEMPLOS O DEMO DE CONTENIDO, SE REEMPLAZARÁN CON DATOS REALES EN LA VERSIÓN FINAL
const investigaciones = [
  {
    categoria: 'CORRUPCIÓN',
    titulo: 'Contratos opacos: millones sin transparencia en obra pública',
    imagen: '🌆',
  },
  {
    categoria: 'JUSTICIA',
    titulo: 'Acceso a la justicia: una deuda pendiente',
    imagen: '⚖️',
  },
  {
    categoria: 'SEGURIDAD',
    titulo: '¿Qué hay detrás del aumento de violencia en México?',
    imagen: '🏢',
  },
];

export default function Home() {
  const [diapositivaActual, setDiapositivaActual] = useState(0);
  const [inicioDeslizamiento, setInicioDeslizamiento] = useState<number | null>(null);

  const diapositiva = diapositivas[diapositivaActual];

  function anteriorDiapositiva() {
    setDiapositivaActual(
      (actual) => (actual - 1 + diapositivas.length) % diapositivas.length,
    );
  }

  function siguienteDiapositiva() {
    setDiapositivaActual(
      (actual) => (actual + 1) % diapositivas.length,
    );
  }

  function iniciarDeslizamiento(e: React.TouchEvent<HTMLElement>) {
    setInicioDeslizamiento(e.touches[0].clientX);
  }

  function terminarDeslizamiento(e: React.TouchEvent<HTMLElement>) {
    if (inicioDeslizamiento === null) return;

    const finalX = e.changedTouches[0].clientX;
    const distancia = finalX - inicioDeslizamiento;

    if (Math.abs(distancia) > 50) {
      if (distancia > 0) {
        anteriorDiapositiva();
      } else {
        siguienteDiapositiva();
      }
    }

    setInicioDeslizamiento(null);
  }

  const categoriasRef = useRef<HTMLDivElement>(null);

  function desplazarCategorias(direccion: 'izquierda' | 'derecha') {
    if (!categoriasRef.current) return;

    categoriasRef.current.scrollBy({
      left: direccion === 'derecha' ? 330 : -330,
      behavior: 'smooth',
    });
  }

  // Conexión con el backend para obtener un mensaje de prueba
  const [mensaje, setMensaje] = useState('Conectando con el backend...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((response) => response.json())
      .then((data) => setMensaje(data.message))
      .catch(() => setMensaje('Portal de información pública'));
  }, []);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#" aria-label="El Guardián MX, inicio">
          <span className="brand-mark">G</span>
          <span>El Guardián MX</span>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a className="active" href="#">Inicio</a>
          <a href="#conocenos">Conócenos</a>
          <a href="#secciones">Aprende</a>
          <a href="#datos">Datos</a>
          <a href="#audiencias">Audiencias</a>
          <a href="#procesos">Procesos</a>
          <a href="#presupuesto">Presupuesto</a>
          <a href="#investigaciones">Publicaciones</a>
          <a href="#transparencia">Transparencia</a>
          <a href="#participa">Participa</a>
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
      </header>

      <section
        className="hero"
        onTouchStart={iniciarDeslizamiento}
        onTouchEnd={terminarDeslizamiento}
        style={{
          backgroundImage: `linear-gradient(90deg, #03111cf5 0%, #071b2acc 48%, #071b2a55 100%), url("${diapositiva.imagen}")`,
        }}
      >
        <div className="hero-content" key={diapositivaActual}>
          <p className="eyebrow">{diapositiva.etiqueta}</p>

          <h1>
            {diapositiva.titulo}
            <br />
            <span>{diapositiva.destacado}</span>
          </h1>

          <p className="hero-description">
            {diapositiva.descripcion}
          </p>

          <div className="hero-actions">
            <a className="button button-gold" href={diapositiva.enlace}>
              {diapositiva.boton} <span>→</span>
            </a>

            <a className="button button-outline" href="#conocenos">
              Sobre nosotros <span>→</span>
            </a>
          </div>
        </div>

        <button
          className="hero-arrow hero-arrow-left"
          type="button"
          onClick={anteriorDiapositiva}
          aria-label="Diapositiva anterior"
        >
          ‹
        </button>

        <button
          className="hero-arrow hero-arrow-right"
          type="button"
          onClick={siguienteDiapositiva}
          aria-label="Siguiente diapositiva"
        >
          ›
        </button>

        <div className="hero-dots" aria-label="Seleccionar diapositiva">
          {diapositivas.map((item, index) => (
            <button
              key={item.etiqueta}
              type="button"
              className={index === diapositivaActual ? 'selected' : ''}
              onClick={() => setDiapositivaActual(index)}
              aria-label={`Mostrar diapositiva ${index + 1}`}
              aria-current={index === diapositivaActual ? 'true' : undefined}
            />
          ))}
        </div>
      </section>

      <section className="section section-categories" id="secciones">
        <div className="section-heading">
          <p className="eyebrow">EXPLORA EL PORTAL</p>
          <h2>Información para comprender la justicia</h2>
          <p>
            Datos, investigaciones y herramientas para conocer mejor el
            funcionamiento del sistema de justicia.
          </p>
        </div>

        <div className="category-carousel">
          <button
            className="category-arrow category-arrow-left"
            type="button"
            onClick={() => desplazarCategorias('izquierda')}
            aria-label="Ver apartados anteriores"
          >
            ‹
          </button>

          <div className="category-grid" ref={categoriasRef}>
            {secciones.map((seccion, index) => (
              <a
                className="category-card"
                href={`#${[
                    'investigaciones',
                    'notas',
                    'conocenos',
                    'datos',
                    'audiencias',
                    'procesos',
                    'presupuesto',
                    'publicaciones',
                    'transparencia',
                    'participa',
                  ][index]
                  }`}
                key={seccion.titulo}
              >
                <span className="category-icon" aria-hidden="true">
                  {seccion.icono}
                </span>

                <div className="category-body">
                  <h3>{seccion.titulo}</h3>
                  <p>{seccion.descripcion}</p>
                  <span className="read-more">
                    Explorar <span>→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <button
            className="category-arrow category-arrow-right"
            type="button"
            onClick={() => desplazarCategorias('derecha')}
            aria-label="Ver más apartados"
          >
            ›
          </button>
        </div>
      </section>

      <section className="section recent-section" id="investigaciones">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">ANÁLISIS E INVESTIGACIÓN</p>
            <h2>Investigaciones recientes</h2>
          </div>
          <a href="#publicaciones" className="text-link">
            Ver publicaciones <span>→</span>
          </a>
        </div>

        <div className="investigation-grid">
          {investigaciones.map((investigacion) => (
            <article className="investigation-card" key={investigacion.titulo}>
              <div className="investigation-image" aria-hidden="true">
                {investigacion.imagen}
              </div>
              <div className="investigation-content">
                <p className="investigation-category">
                  {investigacion.categoria}
                </p>
                <h3>{investigacion.titulo}</h3>
                <a href="#publicaciones" aria-label={`Leer: ${investigacion.titulo}`}>
                  Leer investigación <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="demo-notice">
          Contenido demostrativo: las publicaciones se incorporarán después
          de validar las fuentes y los datos del proyecto.
        </p>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand" id="conocenos">
            <a className="brand" href="#">
              <span className="brand-mark">G</span>
              <span>El Guardián MX</span>
            </a>
            <p>
              La información es poder y ese poder debe de estar siempre
              al servicio de la gente.
            </p>
            <span className="api-status">{mensaje}</span>
          </div>

          <div className="footer-column">
            <h3>Navegación</h3>
            <a href="#">Inicio</a>
            <a href="#conocenos">Conócenos</a>
            <a href="#secciones">Aprende</a>
            <a href="#datos">Datos</a>
            <a href="#audiencias">Audiencias</a>
          </div>

          <div className="footer-column">
            <h3>El proyecto</h3>
            <a href="#investigaciones">Publicaciones</a>
            <a href="#transparencia">Transparencia</a>
            <a href="#participa">Participa</a>
            <a href="#presupuesto">Presupuesto</a>
          </div>

          <div className="footer-column">
            <h3>Información</h3>
            <a href="#transparencia">Metodología</a>
            <a href="#transparencia">Correcciones</a>
            <a href="#transparencia">Aviso de privacidad</a>
            <a href="#transparencia">Contacto</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 El Guardián MX</span>
          <span>Periodismo, datos y rendición de cuentas.</span>
        </div>
      </footer>
    </main>
  );
}