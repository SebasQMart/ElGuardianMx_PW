"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Audiencia, EstadoAudiencia } from "@/lib/audiencias";
import { useNotificaciones } from "@/context/NotificacionesContext";
import AlertaEliminacion from "@/components/ui/AlertaEliminacion";
import { API_URL } from "@/lib/api";

export default function AudienciasAdminPage() {
  const router = useRouter();
  const { mostrarNotificacion } = useNotificaciones();

  const [audiencias, setAudiencias] = useState<Audiencia[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [audienciaEditando, setAudienciaEditando] = useState<Audiencia | null>(
    null,
  );

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [tipo, setTipo] = useState("");
  const [juzgado, setJuzgado] = useState("");
  const [expediente, setExpediente] = useState("");
  const [sala, setSala] = useState("");
  const [juez, setJuez] = useState("");
  const [sede, setSede] = useState("");
  const [estado, setEstado] = useState<EstadoAudiencia>("PROGRAMADA");
  const [ubicacion, setUbicacion] = useState("");

  const [imagen, setImagen] = useState("");
  const [imagenPublicId, setImagenPublicId] = useState("");
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [audienciaPorEliminar, setAudienciaPorEliminar] =
    useState<Audiencia | null>(null);

  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargarAudiencias() {
      try {
        const respuesta = await fetch(`${API_URL}/audiencias/admin/todas`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (respuesta.status === 401) {
          router.replace("/login");
          return;
        }

        if (!respuesta.ok) {
          throw new Error("No fue posible cargar las audiencias.");
        }

        const datos: Audiencia[] = await respuesta.json();
        setAudiencias(datos);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ocurrió un error al cargar las audiencias.",
        );
      } finally {
        setCargando(false);
      }
    }

    cargarAudiencias();
  }, [router]);

  function limpiarFormulario() {
    setAudienciaEditando(null);
    setTitulo("");
    setDescripcion("");
    setFechaHora("");
    setTipo("");
    setJuzgado("");
    setExpediente("");
    setSala("");
    setJuez("");
    setSede("");
    setEstado("PROGRAMADA");
    setUbicacion("");
    setImagen("");
    setImagenPublicId("");
    setArchivoImagen(null);
    setVistaPrevia("");
    setErrorFormulario("");
  }

  function abrirFormularioNuevo() {
    limpiarFormulario();
    setMostrarFormulario(true);
  }

  function abrirFormularioEdicion(audiencia: Audiencia) {
    limpiarFormulario();

    setAudienciaEditando(audiencia);
    setTitulo(audiencia.titulo);
    setDescripcion(audiencia.descripcion ?? "");

    const fecha = new Date(audiencia.fechaHora);
    const fechaLocal = new Date(
      fecha.getTime() - fecha.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setFechaHora(fechaLocal);
    setTipo(audiencia.tipo);
    setJuzgado(audiencia.juzgado);
    setExpediente(audiencia.expediente ?? "");
    setSala(audiencia.sala ?? "");
    setJuez(audiencia.juez ?? "");
    setSede(audiencia.sede ?? "");
    setEstado(audiencia.estado);
    setUbicacion(audiencia.ubicacion ?? "");
    setImagen(audiencia.imagen ?? "");
    setImagenPublicId(audiencia.imagenPublicId ?? "");
    setVistaPrevia(audiencia.imagen ?? "");

    setMostrarFormulario(true);
  }

  function seleccionarImagen(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];

    if (!archivo) return;

    if (!["image/jpeg", "image/png"].includes(archivo.type)) {
      setErrorFormulario("Solo se permiten imágenes JPG o PNG.");
      evento.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      setErrorFormulario("La imagen no debe superar los 5 MB.");
      evento.target.value = "";
      return;
    }

    setErrorFormulario("");
    setArchivoImagen(archivo);
    setVistaPrevia(URL.createObjectURL(archivo));
  }

  function eliminarImagenSeleccionada() {
    setImagen("");
    setImagenPublicId("");
    setArchivoImagen(null);
    setVistaPrevia("");
  }

  async function subirImagen(): Promise<{
    url: string;
    publicId: string;
  } | null> {
    if (!archivoImagen) return null;

    setSubiendoImagen(true);

    try {
      const formulario = new FormData();
      formulario.append("imagen", archivoImagen);

      const respuesta = await fetch(`${API_URL}/cloudinary/imagen/audiencia`, {
        method: "POST",
        credentials: "include",
        body: formulario,
      });

      if (respuesta.status === 401) {
        router.replace("/login");
        throw new Error("Tu sesión ha expirado.");
      }

      if (!respuesta.ok) {
        throw new Error("No fue posible subir la imagen.");
      }

      const datos = await respuesta.json();

      return {
        url: datos.url,
        publicId: datos.publicId,
      };
    } finally {
      setSubiendoImagen(false);
    }
  }

  async function guardarAudiencia(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setGuardando(true);
    setErrorFormulario("");

    try {
      let imagenFinal = imagen;
      let publicIdFinal = imagenPublicId;

      if (archivoImagen) {
        const imagenSubida = await subirImagen();

        if (!imagenSubida) {
          throw new Error("No fue posible subir la imagen.");
        }

        imagenFinal = imagenSubida.url;
        publicIdFinal = imagenSubida.publicId;
      }

      const datos = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        fechaHora: new Date(fechaHora).toISOString(),
        tipo: tipo.trim(),
        juzgado: juzgado.trim(),
        expediente: expediente.trim() || null,
        sala: sala.trim() || null,
        juez: juez.trim() || null,
        sede: sede.trim() || null,
        estado,
        ubicacion: ubicacion.trim() || null,
        imagen: imagenFinal || null,
        imagenPublicId: publicIdFinal || null,
      };

      const editando = Boolean(audienciaEditando);

      const respuesta = await fetch(
        editando
          ? `${API_URL}/audiencias/${audienciaEditando!.id}`
          : `${API_URL}/audiencias`,
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
        throw new Error("Tu sesión ha expirado.");
      }

      if (!respuesta.ok) {
        const resultado = await respuesta.json().catch(() => null);
        throw new Error(
          resultado?.message || "No fue posible guardar la audiencia.",
        );
      }

      const audienciaGuardada: Audiencia = await respuesta.json();

      setAudiencias((actuales) =>
        editando
          ? actuales.map((item) =>
              item.id === audienciaGuardada.id ? audienciaGuardada : item,
            )
          : [audienciaGuardada, ...actuales],
      );

      setMostrarFormulario(false);
      limpiarFormulario();

      mostrarNotificacion(
        editando
          ? "La audiencia se actualizó correctamente."
          : "La audiencia se registró correctamente.",
        "exito",
      );
    } catch (error) {
      setErrorFormulario(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar la audiencia.",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAudiencia() {
    if (!audienciaPorEliminar) return;

    setEliminando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/audiencias/${audienciaPorEliminar.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (respuesta.status === 401) {
        router.replace("/login");
        throw new Error("Tu sesión ha expirado.");
      }

      if (!respuesta.ok) {
        throw new Error("No fue posible eliminar la audiencia.");
      }

      setAudiencias((actuales) =>
        actuales.filter((item) => item.id !== audienciaPorEliminar.id),
      );

      setAudienciaPorEliminar(null);

      mostrarNotificacion("La audiencia se eliminó correctamente.", "exito");
    } catch (error) {
      mostrarNotificacion(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar la audiencia.",
        "error",
      );
    } finally {
      setEliminando(false);
    }
  }

  return (
    <main className="p-6">
      <button
        type="button"
        onClick={() => router.push("/admin/dashboard")}
        className="mb-5 text-sm font-medium text-slate-600 hover:text-amber-600"
      >
        ← Volver al Dashboard
      </button>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audiencias</h1>

          <p className="mt-2 text-gray-600">
            Administra las audiencias del sistema de justicia.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirFormularioNuevo}
          className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
        >
          + Agregar audiencia
        </button>
      </div>

      {cargando && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Cargando audiencias...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            No fue posible cargar las audiencias
          </h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      )}

      {!cargando && !error && audiencias.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Todavía no hay audiencias registradas.
          </h3>
          <p className="mt-2 text-gray-500">
            Cuando registres una, aparecerá aquí.
          </p>
        </div>
      )}

      {!cargando && !error && audiencias.length > 0 && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {audiencias.map((audiencia) => (
            <article
              key={audiencia.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              {audiencia.imagen && (
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={audiencia.imagen}
                    alt={`Imagen de ${audiencia.titulo}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                    {audiencia.tipo}
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {audiencia.estado.replaceAll("_", " ")}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  {audiencia.titulo}
                </h2>

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(audiencia.fechaHora).toLocaleString("es-MX", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>

                  <p>
                    <strong>Juzgado:</strong> {audiencia.juzgado}
                  </p>

                  {audiencia.expediente && (
                    <p>
                      <strong>Expediente:</strong> {audiencia.expediente}
                    </p>
                  )}

                  {audiencia.sala && (
                    <p>
                      <strong>Sala:</strong> {audiencia.sala}
                    </p>
                  )}

                  {audiencia.juez && (
                    <p>
                      <strong>Juez:</strong> {audiencia.juez}
                    </p>
                  )}
                </div>

                {audiencia.descripcion && (
                  <p className="mt-4 line-clamp-3 text-sm text-gray-500">
                    {audiencia.descripcion}
                  </p>
                )}

                <div className="mt-5 flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => abrirFormularioEdicion(audiencia)}
                    className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setAudienciaPorEliminar(audiencia)}
                    className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {audienciaEditando
                    ? "Editar audiencia"
                    : "Registrar audiencia"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Completa la información de la audiencia.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  limpiarFormulario();
                }}
                className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarAudiencia}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Título *
                  </label>

                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                    maxLength={180}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Ej. Audiencia inicial"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Fecha y hora *
                  </label>

                  <input
                    type="datetime-local"
                    value={fechaHora}
                    onChange={(e) => setFechaHora(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tipo de audiencia *
                  </label>

                  <input
                    type="text"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Ej. Audiencia inicial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Juzgado *
                  </label>

                  <input
                    type="text"
                    value={juzgado}
                    onChange={(e) => setJuzgado(e.target.value)}
                    required
                    maxLength={180}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Nombre del juzgado"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Número de expediente
                  </label>

                  <input
                    type="text"
                    value={expediente}
                    onChange={(e) => setExpediente(e.target.value)}
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Ej. 123/2026"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sala
                  </label>

                  <input
                    type="text"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Ej. Sala 2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Juez
                  </label>

                  <input
                    type="text"
                    value={juez}
                    onChange={(e) => setJuez(e.target.value)}
                    maxLength={180}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Nombre del juez"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sede
                  </label>

                  <input
                    type="text"
                    value={sede}
                    onChange={(e) => setSede(e.target.value)}
                    maxLength={180}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Ej. Ciudad Judicial"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Ubicación
                  </label>

                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    maxLength={500}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Dirección o ubicación de la audiencia"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Descripción
                  </label>

                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Información adicional sobre la audiencia..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Estado de la audiencia *
                  </label>

                  <select
                    value={estado}
                    onChange={(e) =>
                      setEstado(e.target.value as EstadoAudiencia)
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option value="PROGRAMADA">Programada</option>
                    <option value="EN_PROCESO">En proceso</option>
                    <option value="CELEBRADA">Celebrada</option>
                    <option value="REPROGRAMADA">Reprogramada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Imagen de la audiencia
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={seleccionarImagen}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Formatos permitidos: JPG y PNG. Tamaño máximo: 5 MB.
                  </p>

                  {vistaPrevia && (
                    <div className="mt-4">
                      <div className="relative h-56 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        <Image
                          src={vistaPrevia}
                          alt="Vista previa de la audiencia"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      <button
                        type="button"
                        onClick={eliminarImagenSeleccionada}
                        className="mt-3 rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Quitar imagen
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {errorFormulario && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorFormulario}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    limpiarFormulario();
                  }}
                  disabled={guardando}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando || subiendoImagen}
                  className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : audienciaEditando
                      ? "Guardar cambios"
                      : "Registrar audiencia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertaEliminacion
        abierto={audienciaPorEliminar !== null}
        titulo="Eliminar audiencia"
        mensaje={`¿Estás seguro de que deseas eliminar la audiencia "${audienciaPorEliminar?.titulo}"? Esta acción no se puede deshacer.`}
        textoCancelar="Cancelar"
        textoConfirmar="Eliminar"
        cargando={eliminando}
        onCancelar={() => setAudienciaPorEliminar(null)}
        onConfirmar={eliminarAudiencia}
      />
    </main>
  );
}
