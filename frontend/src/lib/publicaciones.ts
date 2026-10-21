export type Publicacion = {
    id: number;
    slug: string;
    titulo: string;
    resumen: string;
    tipo: string;
    categoria: string;
    fecha: string;
    imagen: string;
    lectura: number;
    demo: boolean;
};

export const publicaciones: Publicacion[] = [
  {
        id: 1,
        slug: "contratos-proveedores-justicia",
        titulo: "La red de contratos que conectó a proveedores y jueces",
        resumen: "Documentos de ejemplo muestran cómo analizar contratos, adjudicaciones y posibles relaciones institucionales.",
        tipo: "Investigación",
        categoria: "Justicia",
        fecha: "2026-09-18",
        imagen: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
        lectura: 8,
        demo: true,
    },
    {
        id: 2,
        slug: "radiografia-presupuesto-judicial",
        titulo: "Radiografía del presupuesto judicial",
        resumen: "Una guía ilustrativa para explorar cómo se distribuyen los recursos públicos y cómo leer sus variaciones.",
        tipo: "Análisis",
        categoria: "Presupuesto",
        fecha: "2026-09-12",
        imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
        lectura: 6,
        demo: true,
    },
    {
        id: 3,
        slug: "mapa-impunidad-mexico",
        titulo: "Mapa de impunidad en México",
        resumen: "Ejemplo de visualización para comparar indicadores por entidad y conocer las limitaciones de los datos.",
        tipo: "Datos",
        categoria: "Justicia",
        fecha: "2026-09-08",
        imagen: "https://images.unsplash.com/photo-1524666041070-9fc7f9b4a4e5?auto=format&fit=crop&w=1000&q=80",
        lectura: 5,
        demo: true,
    },
    {
        id: 4,
        slug: "percepcion-justicia",
        titulo: "¿Qué tan cerca está la justicia de la ciudadanía?",
        resumen: "Una propuesta de análisis sobre acceso a la justicia, confianza institucional y barreras de atención.",
        tipo: "Reporte",
        categoria: "Ciudadanía",
        fecha: "2026-09-02",
        imagen: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80",
        lectura: 7,
        demo: true,
    },
    {
        id: 5,
        slug: "tiempos-procesos-judiciales",
        titulo: "Los tiempos de los procesos judiciales",
        resumen: "Ejemplo de cómo presentar etapas, plazos y datos necesarios para comprender la duración de un proceso.",
        tipo: "Investigación",
        categoria: "Justicia",
        fecha: "2026-08-25",
        imagen: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=1000&q=80",
        lectura: 10,
        demo: true,
    },
    {
        id: 6,
        slug: "gasto-publico-datos-abiertos",
        titulo: "Cómo leer el gasto público con datos abiertos",
        resumen: "Una guía práctica para identificar partidas, revisar documentos y contrastar cifras presupuestales.",
        tipo: "Guía",
        categoria: "Presupuesto",
        fecha: "2026-08-19",
        imagen: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80",
        lectura: 4,
        demo: true,
    },
    {
        id: 7,
        slug: "acceso-informacion-publica",
        titulo: "Solicitudes de información: por dónde empezar",
        resumen: "Pasos ilustrativos para formular preguntas claras y localizar documentos de interés público.",
        tipo: "Guía",
        categoria: "Transparencia",
        fecha: "2026-08-10",
        imagen: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80",
        lectura: 5,
        demo: true,
    },
    {
        id: 8,
        slug: "indicadores-rendicion-cuentas",
        titulo: "Indicadores para evaluar la rendición de cuentas",
        resumen: "Un recorrido de demostración por indicadores, fuentes y criterios para interpretar información institucional.",
        tipo: "Datos",
        categoria: "Transparencia",
        fecha: "2026-08-03",
        imagen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
        lectura: 6,
        demo: true,
    },
];
