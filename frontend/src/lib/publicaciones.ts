const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Publicacion = {
    id: string;
    slug: string;
    titulo: string;
    resumen: string | null;
    contenido: Record<string, unknown>;
    tipo: string | null;
    categoria: string | null;
    fecha: string | null;
    imagen: string | null;
    imagenPublicId: string | null;
    lectura: number;
    demo: boolean;
    estado: "BORRADOR" | "PUBLICADA" | "ARCHIVADA";
    createdAt: string;
    updatedAt: string;
};

export async function obtenerPublicaciones(): Promise<Publicacion[]> {
    const respuesta = await fetch(`${API_URL}/publicaciones`, {
        cache: "no-store",
    });

    if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las publicaciones.");
    }

    return respuesta.json();
}

export async function obtenerPublicacionPorSlug(
    slug: string,
): Promise<Publicacion | null> {
    const respuesta = await fetch(
        `${API_URL}/publicaciones/${encodeURIComponent(slug)}`,
        { cache: "no-store" },
    );

    if (respuesta.status === 404) {
        return null;
    }

    if (!respuesta.ok) {
        throw new Error("No se pudo obtener la publicación.");
    }

    return respuesta.json();
}