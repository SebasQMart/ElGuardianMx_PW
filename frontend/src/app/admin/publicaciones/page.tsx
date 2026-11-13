"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Publicacion } from "@/lib/publicaciones";
import AlertaEliminacion from "@/components/ui/AlertaEliminacion";
import Image from "next/image";
import type { JSONContent } from "@tiptap/core";
import EditorContenido from "@/components/admin/EditorContenido";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function generarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function obtenerFechaActual(): string {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

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
  const [imagenEliminada, setImagenEliminada] = useState(false);

  const [publicacionPorEliminar, setPublicacionPorEliminar] =
    useState<Publicacion | null>(null);

  const [eliminando, setEliminando] = useState(false);

  const [publicacionEditando, setPublicacionEditando] = useState<string | null>(
    null,
  );

  const [personalizarSlug, setPersonalizarSlug] = useState(false);

  const [formulario, setFormulario] = useState({
    titulo: "",
    slug: "",
    resumen: "",
    contenido: {
      type: "doc",
      content: [{ type: "paragraph" }],
    } as JSONContent,
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
    setImagenSeleccionada(null);
    setVistaPreviaImagen(publicacion.imagen ?? "");
    setImagenEliminada(false);

    setFormulario({
      titulo: publicacion.titulo,
      slug: publicacion.slug,
      resumen: publicacion.resumen ?? "",
      contenido:
        publicacion.contenido &&
        typeof publicacion.contenido === "object" &&
        "type" in publicacion.contenido &&
        publicacion.contenido.type === "doc"
          ? (publicacion.contenido as JSONContent)
          : {
              type: "doc",
              content: [{ type: "paragraph" }],
            },
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
    setPersonalizarSlug(false);
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
    setImagenEliminada(false);

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
      const contenido = formulario.contenido;

      const esEdicion = publicacionEditando !== null;

      const url = esEdicion
        ? `${API_URL}/publicaciones/${publicacionEditando}`
        : `${API_URL}/publicaciones`;

      let imagen: string | null | undefined =
        formulario.imagen.trim() || undefined;

      let imagenPublicId: string | null | undefined =
        formulario.imagenPublicId.trim() || undefined;

      if (imagenEliminada) {
        imagen = null;
        imagenPublicId = null;
      }

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
          slug: generarSlug(formulario.slug.trim() || formulario.titulo),
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
        contenido: {
          type: "doc",
          content: [{ type: "paragraph" }],
        } as JSONContent,
        tipo: "",
        categoria: "",
        fecha: "",
        imagen: "",
        imagenPublicId: "",
        lectura: 5,
        demo: false,
        estado: "BORRADOR",
      });
      setPersonalizarSlug(false);
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
                  onChange={(e) => {
                    const nuevoTitulo = e.target.value;

                    setFormulario((prev) => ({
                      ...prev,
                      titulo: nuevoTitulo,
                      slug:
                        personalizarSlug || publicacionEditando
                          ? prev.slug
                          : generarSlug(nuevoTitulo),
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900"
                  placeholder="Título de la publicación"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Personalizar URL
                  </p>
                  <p className="text-xs text-gray-500">
                    Permite modificar el enlace de esta publicación.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={personalizarSlug}
                  onClick={() => {
                    setPersonalizarSlug((prev) => {
                      const nuevoEstado = !prev;

                      if (!nuevoEstado) {
                        setFormulario((form) => ({
                          ...form,
                          slug: generarSlug(form.titulo),
                        }));
                      }

                      return nuevoEstado;
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    personalizarSlug ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      personalizarSlug ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {personalizarSlug && (
                <div>
                  <label
                    htmlFor="slug"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    URL personalizada (Slug)
                  </label>

                  <input
                    id="slug"
                    type="text"
                    value={formulario.slug}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        slug: e.target.value,
                      })
                    }
                    placeholder="ejemplo-de-url"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Se eliminarán automáticamente acentos y caracteres
                    especiales al guardar.
                  </p>
                </div>
              )}

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
                  Contenido *
                </label>

                <EditorContenido
                  contenido={formulario.contenido}
                  onChange={(contenido) =>
                    setFormulario((prev) => ({ ...prev, contenido }))
                  }
                />
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Fecha */}
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

                {/* Tiempo de lectura */}
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

                {/* Estado */}
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Imagen de la publicación
                </label>

                {!vistaPreviaImagen ? (
                  <label
                    htmlFor="imagen-publicacion"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16V4m0 0L7 9m5-5 5 5M4 16v4h16v-4"
                      />
                    </svg>
                    Subir imagen
                  </label>
                ) : (
                  <div className="relative mt-3 max-w-2xl">
                    <Image
                      src={vistaPreviaImagen}
                      alt="Vista previa de la publicación"
                      width={800}
                      height={450}
                      unoptimized
                      className="h-48 w-full rounded-lg border border-slate-200 object-contain bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        seleccionarImagen(null);
                        setImagenEliminada(true);
                      }}
                      title="Eliminar imagen"
                      aria-label="Eliminar imagen"
                      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                <input
                  id="imagen-publicacion"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  onChange={(e) => {
                    seleccionarImagen(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Formatos permitidos: JPG, JPEG y PNG. Máximo 5 MB.
                </p>
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
                    setPersonalizarSlug(false);
                    setMostrarFormulario(false);
                    setPublicacionEditando(null);
                    setErrorFormulario("");
                    setMensaje("");

                    setFormulario({
                      titulo: "",
                      slug: "",
                      resumen: "",
                      contenido: {
                        type: "doc",
                        content: [{ type: "paragraph" }],
                      } as JSONContent,
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
                  setPersonalizarSlug(false);
                  setFormulario((prev) => ({
                    ...prev,
                    fecha: obtenerFechaActual(),
                  }));
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
