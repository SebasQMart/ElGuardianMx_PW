
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface Admin {
    id: string;
    email: string;
}

export default function AdminDashboard() {
    const router = useRouter();

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [cargando, setCargando] = useState(true);
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function verificarSesion() {
            try {
                const respuesta = await fetch(`${API_URL}/auth/me`, {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                });

                if (respuesta.status === 401) {
                    router.replace("/login");
                    return;
                }

                if (!respuesta.ok) {
                    throw new Error("No fue posible verificar la sesión.");
                }

                const datos = await respuesta.json();

                if (activo) {
                    setAdmin(datos.admin);
                }
            } catch {
                if (activo) {
                    setError(
                        "No fue posible conectar con el servidor. Intenta nuevamente.",
                    );
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        }

        void verificarSesion();

        return () => {
            activo = false;
        };
    }, [router]);

    async function cerrarSesion() {
        setCerrandoSesion(true);
        setError("");

        try {
            const respuesta = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!respuesta.ok) {
                throw new Error("No fue posible cerrar la sesión.");
            }

            router.replace("/login");
            router.refresh();
        } catch {
            setError("No fue posible cerrar la sesión. Intenta nuevamente.");
            setCerrandoSesion(false);
        }
    }

    if (cargando) {
        return (
            <main className="min-h-screen grid place-items-center bg-slate-100">
                <p className="text-slate-600">Verificando acceso...</p>
            </main>
        );
    }

    if (!admin) {
        return (
            <main className="min-h-screen grid place-items-center bg-slate-100 p-6">
                <p className="text-center text-red-700" role="alert">
                    {error || "No fue posible verificar tu acceso."}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-100 md:flex">
            <aside className="flex w-full flex-col bg-slate-950 p-6 text-white md:min-h-screen md:w-72">
                <div className="mb-10">
                    <p className="text-2xl font-bold tracking-wide">
                        Observatorio <span className="text-amber-400">de justicia morelos</span>
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                        Panel administrativo
                    </p>
                </div>

                <nav className="flex-1 space-y-2">
                    <div className="rounded-lg bg-amber-400/15 px-4 py-3 font-medium text-amber-300">
                        <span className="mr-3">▦</span>
                        Dashboard
                    </div>

                    <div className="rounded-lg px-4 py-3 text-slate-400">
                        <span className="mr-3">▤</span>
                        Publicaciones
                        <span className="ml-2 text-xs">(Próximamente)</span>
                    </div>

                    <div className="rounded-lg px-4 py-3 text-slate-400">
                        <span className="mr-3">◇</span>
                        Aliados
                        <span className="ml-2 text-xs">(Próximamente)</span>
                    </div>

                    <div className="rounded-lg px-4 py-3 text-slate-400">
                        <span className="mr-3">▣</span>
                        Audiencias
                        <span className="ml-2 text-xs">(Próximamente)</span>
                    </div>
                </nav>

                <div className="mt-8 border-t border-slate-800 pt-6">
                    <p className="mb-3 break-all text-sm text-slate-400">
                        {admin.email}
                    </p>

                    <button
                        type="button"
                        onClick={cerrarSesion}
                        disabled={cerrandoSesion}
                        className="w-full rounded-lg border border-slate-700 px-4 py-3 text-left text-sm transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        {cerrandoSesion ? "Cerrando sesión..." : "↪ Cerrar sesión"}
                    </button>
                </div>
            </aside>

            <section className="flex-1 p-6 md:p-10">
                <header className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                        Administración
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Bienvenido al Observatorio
                    </h1>

                    <p className="mt-3 text-slate-600">
                        Desde aquí podrás administrar el contenido de El Guardián MX.
                    </p>
                </header>

                {error && (
                    <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
                        {error}
                    </p>
                )}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Contenido
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-slate-900">
                            Publicaciones
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Gestiona las noticias, investigaciones y demás publicaciones.
                        </p>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Vinculación
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-slate-900">
                            Aliados
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Administra las instituciones y personas colaboradoras.
                        </p>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                            Seguimiento
                        </p>
                        <h2 className="mt-3 text-xl font-bold text-slate-900">
                            Audiencias
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Registra y actualiza la información de las audiencias.
                        </p>
                    </article>
                </div>
            </section>
        </main>
    );
}
