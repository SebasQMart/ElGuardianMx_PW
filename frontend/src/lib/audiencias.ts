export type EstadoAudiencia =
  | "PROGRAMADA"
  | "EN_PROCESO"
  | "CELEBRADA"
  | "REPROGRAMADA"
  | "CANCELADA";

export type Audiencia = {
  id: string;
  titulo: string;
  descripcion: string | null;
  fechaHora: string;
  tipo: string;
  juzgado: string;
  expediente: string | null;
  sala: string | null;
  juez: string | null;
  sede: string | null;
  estado: EstadoAudiencia;
  ubicacion: string | null;
  imagen: string | null;
  imagenPublicId: string | null;
  createdAt: string;
  updatedAt: string;
};
