"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Login.module.css";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function Login() {
    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    async function manejarLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setCargando(true);

        try {
            const respuesta = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: correo,
                    password: contrasena,
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                setError(
                    respuesta.status === 401
                        ? "Correo o contraseña incorrectos."
                        : datos.message || "No fue posible iniciar sesión.",
                );
                return;
            }

            setContrasena("");

            router.replace("/admin/dashboard");
            router.refresh();
        } catch {
            setError(
                "No fue posible conectar con el servidor. Intenta nuevamente.",
            );
        } finally {
            setCargando(false);
        }
    }

    return (
        <main className={styles.paginaLogin}>
            <section className={styles.contenedorLogin}>
                <header className={styles.encabezado}>
                    <Link
                        href="/"
                        className={styles.marca}
                        aria-label="Volver a El Guardián MX"
                    >
                        <span className={styles.logo}>G</span>
                        <span className={styles.nombreMarca}>
                            El Guardián MX
                        </span>
                    </Link>

                    <span className={styles.etiqueta}>
                        ACCESO AL OBSERVATORIO
                    </span>
                </header>

                <div className={styles.tarjetaLogin}>
                    <div className={styles.iconoAcceso} aria-hidden="true">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="4"
                                y="10"
                                width="16"
                                height="11"
                                rx="2"
                            />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            <circle cx="12" cy="15" r="1" />
                            <path d="M12 16v2" />
                        </svg>
                    </div>

                    <h1>Iniciar sesión</h1>

                    <p className={styles.descripcion}>
                        Ingresa tus credenciales para acceder al
                        panel de administración.
                    </p>

                    <form
                        className={styles.formulario}
                        onSubmit={manejarLogin}
                    >
                        <div className={styles.campo}>
                            <label htmlFor="correo">
                                Correo electrónico
                            </label>

                            <input
                                id="correo"
                                name="correo"
                                type="email"
                                placeholder="admin@elguardianmx.mx"
                                autoComplete="username"
                                value={correo}
                                onChange={(event) =>
                                    setCorreo(event.target.value)
                                }
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="contrasena">
                                Contraseña
                            </label>

                            <input
                                id="contrasena"
                                name="contrasena"
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                autoComplete="current-password"
                                value={contrasena}
                                onChange={(event) =>
                                    setContrasena(event.target.value)
                                }
                                required
                                disabled={cargando}
                            />
                        </div>

                        {error && (
                            <p role="alert" aria-live="polite">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className={styles.botonIngresar}
                            disabled={cargando}
                        >
                            {cargando ? "Verificando..." : "Ingresar"}
                            {!cargando && (
                                <span aria-hidden="true"> →</span>
                            )}
                        </button>
                    </form>

                    <p className={styles.aviso}>
                        <span aria-hidden="true">●</span>
                        Acceso exclusivo para personal autorizado
                    </p>
                </div>

                <footer className={styles.pie}>
                    <span>El Guardián MX</span>
                    <span>Información · Transparencia · Ciudadanía</span>
                </footer>
            </section>
        </main>
    );
}