import Link from "next/link";
import styles from "./Login.module.css";

export default function Login() {
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

                    <form className={styles.formulario}>
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
                                required
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
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.botonIngresar}
                        >
                            Ingresar
                            <span aria-hidden="true"> →</span>
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