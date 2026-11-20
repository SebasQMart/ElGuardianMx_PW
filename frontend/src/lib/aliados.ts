export type Aliado = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
  imagenPublicId: string | null;
  ubicacion: string | null;
  tipo: "PERSONA" | "ORGANIZACION";
  sitioOficial: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};
