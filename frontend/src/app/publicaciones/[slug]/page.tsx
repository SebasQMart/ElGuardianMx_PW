
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { publicaciones } from "@/lib/publicaciones";
import DetallePublicacion from "@/components/publicaciones/DetallePublicacion";

type PaginaDetalleProps = {
    params: Promise<{
        slug: string;
    }>;
};

async function ContenidoDetalle({
    params,
}: PaginaDetalleProps) {
    const { slug } = await params;

    const publicacion = publicaciones.find(
        (item) => item.slug === slug,
    );

    if (!publicacion) {
        notFound();
    }

    return <DetallePublicacion publicacion={publicacion} />;
}

export default function PaginaDetalle({
    params,
}: PaginaDetalleProps) {
    return (
        <Suspense
            fallback={
                <p style={{ padding: "48px 24px" }}>
                    Cargando publicación...
                </p>
            }
        >
            <ContenidoDetalle params={params} />
        </Suspense>
    );
}
