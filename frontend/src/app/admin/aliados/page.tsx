"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Aliado } from "@/lib/aliados";
import { useNotificaciones } from "@/context/NotificacionesContext";
import AlertaEliminacion from "@/components/ui/AlertaEliminacion";
import { API_URL } from "@/lib/api";

export default function AliadosPage() {
  const router = useRouter();
  const { mostrarNotificacion } = useNotificaciones();

  const [aliados, setAliados] = useState<Aliado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [aliadoEditando, setAliadoEditando] = useState<Aliado | null>(null);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState<"PERSONA" | "ORGANIZACION">("ORGANIZACION");
  const [sitioOficial, setSitioOficial] = useState("");
  const [activo, setActivo] = useState(true);
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenPublicId, setImagenPublicId] = useState<string | null>(null);
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aliadoPorEliminar, setAliadoPorEliminar] = useState<Aliado | null>(
    null,
  );
  const [eliminando, setEliminando] = useState(false);

  function limpiarFormulario() {
    setAliadoEditando(null);
    setNombre("");
    setDescripcion("");
    setUbicacion("");
    setTipo("ORGANIZACION");
    setSitioOficial("");
    setActivo(true);

    setImagen(null);
    setImagenPublicId(null);
    setArchivoImagen(null);
    setVistaPrevia(null);

    setMostrarFormulario(false);
  }

  function abrirFormularioNuevo() {
    limpiarFormulario();
    setMostrarFormulario(true);
  }

  function abrirFormularioEdicion(aliado: Aliado) {
    setAliadoEditando(aliado);

    setNombre(aliado.nombre);
    setDescripcion(aliado.descripcion);
    setUbicacion(aliado.ubicacion || "");
    setTipo(aliado.tipo);
    setSitioOficial(aliado.sitioOficial || "");
    setActivo(aliado.activo);

    setImagen(aliado.imagen);
    setImagenPublicId(aliado.imagenPublicId);
    setArchivoImagen(null);
    setVistaPrevia(aliado.imagen);

    setMostrarFormulario(true);
  }

  function seleccionarImagen(archivo: File | null) {
    if (!archivo) return;

    const formatosPermitidos = ["image/jpeg", "image/jpg", "image/png"];

    if (!formatosPermitidos.includes(archivo.type)) {
      mostrarNotificacion(
        "Formato no válido. Utiliza una imagen JPG o PNG.",
        "error",
      );
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarNotificacion("La imagen no debe superar los 5 MB.", "error");
      return;
    }

    setArchivoImagen(archivo);

    const lector = new FileReader();

    lector.onloadend = () => {
      setVistaPrevia(lector.result as string);
    };

    lector.readAsDataURL(archivo);
  }

  function eliminarImagenSeleccionada() {
    setImagen(null);
    setImagenPublicId(null);
    setArchivoImagen(null);
    setVistaPrevia(null);
  }

  async function subirImagen(): Promise<{
    url: string | null;
    publicId: string | null;
  } | null> {
    if (!archivoImagen) {
      return {
        url: imagen,
        publicId: imagenPublicId,
      };
    }

    try {
      setSubiendoImagen(true);

      const formulario = new FormData();
      formulario.append("imagen", archivoImagen);

      const respuesta = await fetch(`${API_URL}/cloudinary/imagen/aliado`, {
        method: "POST",
        credentials: "include",
        body: formulario,
      });

      if (respuesta.status === 401) {
        router.replace("/login");
        return null;
      }

      if (!respuesta.ok) {
        throw new Error("No fue posible subir la imagen.");
      }

      const datos = await respuesta.json();

      setImagen(datos.url);
      setImagenPublicId(datos.publicId);
      setArchivoImagen(null);

      return {
        url: datos.url,
        publicId: datos.publicId,
      };

      return {
        url: datos.url,
        publicId: datos.publicId,
      };
    } catch (error) {
      console.error("Error al subir imagen:", error);

      mostrarNotificacion(
        "No fue posible subir la imagen. Intenta nuevamente.",
        "error",
      );

      return null;
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function guardarAliado() {
    if (nombre.trim().length < 2) {
      mostrarNotificacion(
        "El nombre debe tener al menos 2 caracteres.",
        "error",
      );
      return;
    }

    if (descripcion.trim().length < 10) {
      mostrarNotificacion(
        "La descripción debe tener al menos 10 caracteres.",
        "error",
      );
      return;
    }

    if (sitioOficial.trim()) {
      try {
        new URL(sitioOficial.trim());
      } catch {
        mostrarNotificacion(
          "Ingresa una URL válida para el sitio oficial.",
          "error",
        );
        return;
      }
    }

    setGuardando(true);

    try {
      const resultadoImagen = await subirImagen();

      if (!resultadoImagen) return;

      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        ubicacion: ubicacion.trim() || null,
        tipo,
        sitioOficial: sitioOficial.trim() || null,
        imagen: resultadoImagen.url,
        imagenPublicId: resultadoImagen.publicId,
      };

      const editando = aliadoEditando !== null;

      const respuesta = await fetch(
        editando
          ? `${API_URL}/aliados/${aliadoEditando.id}`
          : `${API_URL}/aliados`,
        {
          method: editando ? "PATCH" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        },
      );

      if (respuesta.status === 401) {
        router.replace("/login");
        return;
      }

      if (!respuesta.ok) {
        const errorServidor = await respuesta.json().catch(() => null);
        throw new Error(
          errorServidor?.message || "No fue posible guardar el aliado.",
        );
      }

      const aliadoGuardado: Aliado = await respuesta.json();

      setAliados((actuales) =>
        editando
          ? actuales.map((item) =>
              item.id === aliadoGuardado.id ? aliadoGuardado : item,
            )
          : [aliadoGuardado, ...actuales],
      );

      mostrarNotificacion(
        editando
          ? "El aliado se actualizó correctamente."
          : "El aliado se registró correctamente.",
        "exito",
      );

      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar aliado:", error);

      mostrarNotificacion(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el aliado.",
        "error",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAliado() {
    if (!aliadoPorEliminar) return;

    setEliminando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/aliados/${aliadoPorEliminar.id}`,
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
        throw new Error("No fue posible eliminar el aliado.");
      }

      setAliados((actuales) =>
        actuales.filter((item) => item.id !== aliadoPorEliminar.id),
      );

      setAliadoPorEliminar(null);

      mostrarNotificacion("El aliado se eliminó correctamente.", "exito");
    } catch (error) {
      console.error("Error al eliminar aliado:", error);

      mostrarNotificacion(
        "No fue posible eliminar el aliado. Intenta nuevamente.",
        "error",
      );
    } finally {
      setEliminando(false);
    }
  }

  async function cambiarEstadoAliado(aliado: Aliado) {
    try {
      const respuesta = await fetch(`${API_URL}/aliados/${aliado.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activo: !aliado.activo,
        }),
      });

      if (respuesta.status === 401) {
        router.replace("/login");
        return;
      }

      if (!respuesta.ok) {
        throw new Error("No fue posible cambiar el estado del aliado.");
      }

      const aliadoActualizado: Aliado = await respuesta.json();

      setAliados((actuales) =>
        actuales.map((item) =>
          item.id === aliadoActualizado.id ? aliadoActualizado : item,
        ),
      );

      mostrarNotificacion(
        aliadoActualizado.activo
          ? "El aliado se activó correctamente."
          : "El aliado se desactivó correctamente.",
        "exito",
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);

      mostrarNotificacion(
        "No fue posible cambiar el estado del aliado.",
        "error",
      );
    }
  }

  useEffect(() => {
    async function cargarAliados() {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch(`${API_URL}/aliados/admin/todos`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (respuesta.status === 401) {
          router.replace("/login");
          return;
        }

        if (!respuesta.ok) {
          throw new Error("No fue posible cargar los aliados.");
        }

        const datos: Aliado[] = await respuesta.json();
        setAliados(datos);
      } catch (error) {
        console.error("Error al cargar aliados:", error);
        setError(
          "No fue posible conectar con el servidor. Intenta nuevamente.",
        );
      } finally {
        setCargando(false);
      }
    }

    cargarAliados();
  }, [router]);

  return (
    <main className="p-6">
      <button
        type="button"
        onClick={() => router.push("/admin/dashboard")}
        className="mb-5 text-sm font-medium text-slate-600 hover:text-amber-600"
      >
        ← Volver al Dashboard
      </button>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aliados</h1>
          <p className="mt-1 text-sm text-gray-600">
            Administra las personas y organizaciones aliadas.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirFormularioNuevo}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + Agregar aliado
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {aliadoEditando ? "Editar aliado" : "Registrar nuevo aliado"}
            </h2>

            <button
              type="button"
              onClick={limpiarFormulario}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>

          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              guardarAliado();
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(evento) => setNombre(evento.target.value)}
                  required
                  minLength={2}
                  maxLength={180}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Nombre de la persona u organización"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo de aliado *
                </label>
                <select
                  value={tipo}
                  onChange={(evento) =>
                    setTipo(evento.target.value as "PERSONA" | "ORGANIZACION")
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="PERSONA">Persona</option>
                  <option value="ORGANIZACION">Organización</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <textarea
                value={descripcion}
                onChange={(evento) => setDescripcion(evento.target.value)}
                required
                minLength={10}
                maxLength={1000}
                rows={4}
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                placeholder="Describe a la persona u organización..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(evento) => setUbicacion(evento.target.value)}
                  maxLength={180}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Ej. Morelos, México"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sitio oficial
                </label>
                <input
                  type="url"
                  value={sitioOficial}
                  onChange={(evento) => setSitioOficial(evento.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="https://ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Imagen del aliado
              </label>

              {vistaPrevia && (
                <div className="relative mb-3 h-48 w-48 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={vistaPrevia}
                    alt="Vista previa del aliado"
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={eliminarImagenSeleccionada}
                    className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50"
                    title="Eliminar imagen"
                    aria-label="Eliminar imagen"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="m19 6-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={(evento) =>
                  seleccionarImagen(evento.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-200"
              />

              <p className="mt-1 text-xs text-gray-500">
                Formatos JPG y PNG. Tamaño máximo: 5 MB.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={activo}
                onChange={(evento) => setActivo(evento.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Aliado activo
            </label>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={limpiarFormulario}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={guardando || subiendoImagen}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {guardando
                  ? "Guardando..."
                  : aliadoEditando
                    ? "Guardar cambios"
                    : "Registrar aliado"}
              </button>
            </div>
          </form>
        </div>
      )}

      {cargando ? (
        <p className="text-sm text-gray-500">Cargando aliados...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : aliados.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="font-medium text-gray-700">
            Todavía no hay aliados registrados.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Cuando registres uno, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {aliados.map((aliado) => (
            <article
              key={aliado.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {aliado.imagen ? (
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={aliado.imagen}
                    alt={aliado.nombre}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center bg-gray-100 text-sm text-gray-400">
                  Sin imagen
                </div>
              )}

              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">
                    {aliado.nombre}
                  </h2>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      aliado.activo
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {aliado.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <p className="mb-3 text-sm text-gray-600">
                  {aliado.descripcion}
                </p>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    Tipo:{" "}
                    {aliado.tipo === "PERSONA" ? "Persona" : "Organización"}
                  </p>

                  {aliado.ubicacion && <p>Ubicación: {aliado.ubicacion}</p>}

                  {aliado.sitioOficial && (
                    <a
                      href={aliado.sitioOficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 hover:underline"
                    >
                      Sitio oficial
                    </a>
                  )}
                </div>

                {/* Acciones del aliado */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => abrirFormularioEdicion(aliado)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => cambiarEstadoAliado(aliado)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      aliado.activo
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {aliado.activo ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAliadoPorEliminar(aliado)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertaEliminacion
        abierto={aliadoPorEliminar !== null}
        titulo="Eliminar aliado"
        mensaje={`¿Estás seguro de que deseas eliminar a "${aliadoPorEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar"
        cargando={eliminando}
        onCancelar={() => setAliadoPorEliminar(null)}
        onConfirmar={eliminarAliado}
      />
    </main>
  );
}
