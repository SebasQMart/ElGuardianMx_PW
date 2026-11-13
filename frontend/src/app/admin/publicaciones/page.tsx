"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Publicacion } from "@/lib/publicaciones";
import AlertaEliminacion from "@/components/ui/AlertaEliminacion";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function AdminPublicaciones() {
  const router = useRouter();

  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(
    null,
  );
  const [vistaPreviaImagen, setVistaPreviaImagen] = useState("");

  const [publicacionPorEliminar, setPublicacionPorEliminar] =
    useState<Publicacion | null>(null);

  const [eliminando, setEliminando] = useState(false);

  const [publicacionEditando, setPublicacionEditando] = useState<string | null>(
    null,
  );

  const [formulario, setFormulario] = useState({
    titulo: "",
    slug: "",
    resumen: "",
    contenido: '{\n  "secciones": []\n}',
    tipo: "",
    categoria: "",
    fecha: "",
    imagen: "",
    imagenPublicId: "",
    lectura: 5,
    demo: false,
    estado: "BORRADOR" as "BORRADOR" | "PUBLICADA" | "ARCHIVADA",
  });

  function editarPublicacion(publicacion: Publicacion) {
    setPublicacionEditando(publicacion.id);

    setFormulario({
      titulo: publicacion.titulo,
      slug: publicacion.slug,
      resumen: publicacion.resumen ?? "",
      contenido: JSON.stringify(publicacion.contenido, null, 2),
      tipo: publicacion.tipo ?? "",
      categoria: publicacion.categoria ?? "",
      fecha: publicacion.fecha ? publicacion.fecha.substring(0, 10) : "",
      imagen: publicacion.imagen ?? "",
      imagenPublicId: publicacion.imagenPublicId ?? "",
      lectura: publicacion.lectura,
      demo: publicacion.demo,
      estado: publicacion.estado,
    });

    setErrorFormulario("");
    setMensaje("");
    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function seleccionarImagen(archivo: File | null) {
    if (!archivo) {
      setImagenSeleccionada(null);
      setVistaPreviaImagen("");
      return;
    }

    const formatosPermitidos = ["image/jpeg", "image/png"];

    if (!formatosPermitidos.includes(archivo.type)) {
      setErrorFormulario("Selecciona una imagen en formato JPG, JPEG o PNG.");
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setErrorFormulario("La imagen no debe superar los 5 MB.");
      return;
    }

    setErrorFormulario("");
    setImagenSeleccionada(archivo);

    const lector = new FileReader();

    lector.onload = () => {
      if (typeof lector.result === "string") {
        setVistaPreviaImagen(lector.result);
      }
    };

    lector.readAsDataURL(archivo);
  }

  async function subirImagenCloudinary(
    archivo: File,
  ): Promise<{ url: string; publicId: string }> {
    const datos = new FormData();

    datos.append("imagen", archivo);

    const respuesta = await fetch(`${API_URL}/cloudinary/imagen`, {
      method: "POST",
      credentials: "include",
      body: datos,
    });

    if (respuesta.status === 401) {
      router.replace("/login");
      throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");
    }

    if (!respuesta.ok) {
      const datosError = await respuesta.json().catch(() => null);

      const mensajeError = Array.isArray(datosError?.message)
        ? datosError.message.join(", ")
        : datosError?.message;

      throw new Error(
        mensajeError || "No fue posible subir la imagen a Cloudinary.",
      );
    }

    return respuesta.json();
  }

  async function eliminarPublicacion() {
    if (!publicacionPorEliminar) {
      return;
    }

    setEliminando(true);
    setMensaje("");
    setErrorFormulario("");

    try {
      const respuesta = await fetch(
        `${API_URL}/publicaciones/${publicacionPorEliminar.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (respuesta.status === 401) {
        router.replace("/login");
        return;
      }

      if (!respuesta.ok) {
        const datosError = await respuesta.json().catch(() => null);

        throw new Error(
          datosError?.message || "No fue posible eliminar la publicación.",
        );
      }

      setPublicaciones((actuales) =>
        actuales.filter((item) => item.id !== publicacionPorEliminar.id),
      );

      setMensaje("La publicación se eliminó correctamente.");
      setPublicacionPorEliminar(null);
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la publicación.",
      );

      setPublicacionPorEliminar(null);
    } finally {
      setEliminando(false);
    }
  }

  async function guardarPublicacion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setGuardando(true);
    setErrorFormulario("");
    setMensaje("");

    try {
      let contenido: Record<string, unknown>;

      try {
        const contenidoParseado: unknown = JSON.parse(formulario.contenido);

        if (
          typeof contenidoParseado !== "object" ||
          contenidoParseado === null ||
          Array.isArray(contenidoParseado)
        ) {
          throw new Error("El contenido debe ser un objeto JSON.");
        }

        contenido = contenidoParseado as Record<string, unknown>;
      } catch {
        throw new Error("El contenido debe ser un objeto JSON válido.");
      }

      const esEdicion = publicacionEditando !== null;

      const url = esEdicion
        ? `${API_URL}/publicaciones/${publicacionEditando}`
        : `${API_URL}/publicaciones`;

      let imagen = formulario.imagen.trim() || undefined;
      let imagenPublicId = formulario.imagenPublicId.trim() || undefined;

      if (imagenSeleccionada) {
        const imagenSubida = await subirImagenCloudinary(imagenSeleccionada);

        imagen = imagenSubida.url;
        imagenPublicId = imagenSubida.publicId;
      }

      const respuesta = await fetch(url, {
        method: esEdicion ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo: formulario.titulo.trim(),
          slug: formulario.slug.trim(),
          contenido,
          resumen: formulario.resumen.trim() || undefined,
          tipo: formulario.tipo.trim() || undefined,
          categoria: formulario.categoria.trim() || undefined,
          fecha: formulario.fecha || undefined,
          imagen,
          imagenPublicId,
          lectura: formulario.lectura,
          demo: formulario.demo,
          estado: formulario.estado,
        }),
      });

      if (respuesta.status === 401) {
        router.replace("/login");
        return;
      }

      if (!respuesta.ok) {
        const datosError = await respuesta.json().catch(() => null);
        const mensajeError = Array.isArray(datosError?.message)
          ? datosError.message.join(", ")
          : datosError?.message;

        throw new Error(
          mensajeError || "No fue posible guardar la publicación.",
        );
      }

      const publicacionGuardada: Publicacion = await respuesta.json();

      setPublicaciones((actuales) =>
        esEdicion
          ? actuales.map((publicacion) =>
              publicacion.id === publicacionEditando
                ? publicacionGuardada
                : publicacion,
            )
          : [publicacionGuardada, ...actuales],
      );

      setMensaje(
        esEdicion
          ? "La publicación se actualizó correctamente."
          : "La publicación se registró correctamente.",
      );

      setPublicacionEditando(null);

      setFormulario({
        titulo: "",
        slug: "",
        resumen: "",
        contenido: '{\n  "secciones": []\n}',
        tipo: "",
        categoria: "",
        fecha: "",
        imagen: "",
        imagenPublicId: "",
        lectura: 5,
        demo: false,
        estado: "BORRADOR",
      });

      setImagenSeleccionada(null);
      setVistaPreviaImagen("");
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar la publicación.",
      );
    } finally {
      setGuardando(false);
    }
  }

  useEffect(() => {
    let activo = true;

    async function cargarPublicaciones() {
      try {
        const respuesta = await fetch(`${API_URL}/publicaciones/admin/todas`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (respuesta.status === 401) {
          router.replace("/login");
          return;
        }

        if (!respuesta.ok) {
          throw new Error("No fue posible obtener las publicaciones.");
        }

        const datos: Publicacion[] = await respuesta.json();

        if (activo) {
          setPublicaciones(datos);
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

    void cargarPublicaciones();

    return () => {
      activo = false;
    };
  }, [router]);

  if (cargando) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-100">
        <p className="text-slate-600">Cargando publicaciones...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <header className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="mb-5 text-sm font-medium text-slate-600 hover:text-amber-600"
        >
          ← Volver al Dashboard
        </button>

        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Gestión de publicaciones
        </h1>

        <p className="mt-3 text-slate-600">
          Administra las noticias, investigaciones y demás contenido.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {mostrarFormulario && (
            <form
              className="mb-8 space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-6"
              onSubmit={guardarPublicacion}
            >
              <h2 className="text-xl font-bold text-slate-900">
                {publicacionEditando
                  ? "Editar publicación"
                  : "Nueva publicación"}
              </h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Título *
                </label>
                <input
                  required
                  minLength={3}
                  maxLength={180}
                  value={formulario.titulo}
                  onChange={(e) =>
                    setFormulario({ ...formulario, titulo: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  placeholder="Título de la publicación"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slug (URL) *
                </label>
                <input
                  required
                  minLength={3}
                  maxLength={200}
                  value={formulario.slug}
                  onChange={(e) =>
                    setFormulario({ ...formulario, slug: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  placeholder="titulo-de-la-publicacion"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Resumen
                </label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={formulario.resumen}
                  onChange={(e) =>
                    setFormulario({ ...formulario, resumen: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contenido (JSON) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formulario.contenido}
                  onChange={(e) =>
                    setFormulario({ ...formulario, contenido: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Debe contener un objeto JSON válido.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tipo
                  </label>
                  <input
                    maxLength={100}
                    value={formulario.tipo}
                    onChange={(e) =>
                      setFormulario({ ...formulario, tipo: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                    placeholder="Investigación, noticia..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Categoría
                  </label>
                  <input
                    maxLength={100}
                    value={formulario.categoria}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        categoria: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                    placeholder="Justicia, política..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formulario.fecha}
                    onChange={(e) =>
                      setFormulario({ ...formulario, fecha: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tiempo de lectura (minutos)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={formulario.lectura}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        lectura: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Imagen de la publicación
                  </label>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={(e) =>
                      seleccionarImagen(e.target.files?.[0] ?? null)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Formatos permitidos: JPG, JPEG y PNG. Máximo 5 MB.
                  </p>

                  {vistaPreviaImagen && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-slate-700">
                        Vista previa
                      </p>

                      <Image
                        src={vistaPreviaImagen}
                        alt="Vista previa de la publicación"
                        width={800}
                        height={450}
                        unoptimized
                        className="h-48 w-full rounded-lg border border-slate-200 object-contain bg-slate-50"
                      />
                    </div>
                  )}
                </div>

                <input
                  type="url"
                  maxLength={1000}
                  value={formulario.imagen}
                  onChange={(e) =>
                    setFormulario({ ...formulario, imagen: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estado
                </label>
                <select
                  value={formulario.estado}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      estado: e.target.value as
                        | "BORRADOR"
                        | "PUBLICADA"
                        | "ARCHIVADA",
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                >
                  <option value="BORRADOR">Borrador</option>
                  <option value="PUBLICADA">Publicada</option>
                  <option value="ARCHIVADA">Archivada</option>
                </select>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formulario.demo}
                  onChange={(e) =>
                    setFormulario({ ...formulario, demo: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Marcar como publicación de demostración
              </label>

              {errorFormulario && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {errorFormulario}
                </p>
              )}

              {mensaje && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {mensaje}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : publicacionEditando
                      ? "Guardar cambios"
                      : "Guardar publicación"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setPublicacionEditando(null);
                    setErrorFormulario("");
                    setMensaje("");

                    setFormulario({
                      titulo: "",
                      slug: "",
                      resumen: "",
                      contenido: '{\n  "secciones": []\n}',
                      tipo: "",
                      categoria: "",
                      fecha: "",
                      imagen: "",
                      imagenPublicId: "",
                      lectura: 5,
                      demo: false,
                      estado: "BORRADOR",
                    });

                    setImagenSeleccionada(null);
                    setVistaPreviaImagen("");
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Publicaciones registradas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Total: {publicaciones.length}
              </p>
            </div>

            {!mostrarFormulario && (
              <button
                type="button"
                onClick={() => {
                  setMensaje("");
                  setErrorFormulario("");
                  setMostrarFormulario(true);
                }}
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                + Nueva publicación
              </button>
            )}
          </div>

          {publicaciones.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="font-medium text-slate-700">
                Todavía no hay publicaciones registradas.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Cuando registres una publicación, aparecerá en esta sección.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {publicaciones.map((publicacion) => (
                <article
                  key={publicacion.id}
                  className="rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {publicacion.titulo}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {publicacion.categoria ?? "Sin categoría"}
                        {" · "}
                        {publicacion.tipo ?? "Sin tipo"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        publicacion.estado === "PUBLICADA"
                          ? "bg-green-100 text-green-700"
                          : publicacion.estado === "ARCHIVADA"
                            ? "bg-slate-200 text-slate-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {publicacion.estado}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {publicacion.resumen ?? "Sin resumen disponible."}
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    Fecha:{" "}
                    {publicacion.fecha
                      ? new Date(publicacion.fecha).toLocaleDateString(
                          "es-MX",
                          { timeZone: "UTC" },
                        )
                      : "Sin fecha"}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => editarPublicacion(publicacion)}
                      className="rounded-lg border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => setPublicacionPorEliminar(publicacion)}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <AlertaEliminacion
        abierto={publicacionPorEliminar !== null}
        titulo="Eliminar publicación"
        mensaje={
          publicacionPorEliminar
            ? `¿Estás seguro de que deseas eliminar "${publicacionPorEliminar.titulo}"? Esta acción no se puede deshacer.`
            : ""
        }
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar"
        cargando={eliminando}
        onCancelar={() => setPublicacionPorEliminar(null)}
        onConfirmar={eliminarPublicacion}
      />
    </main>
  );
}
