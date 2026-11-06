-- CreateEnum
CREATE TYPE "estado_publicacion" AS ENUM ('BORRADOR', 'PUBLICADA', 'ARCHIVADA');

-- CreateTable
CREATE TABLE "publicaciones" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumen" TEXT,
    "contenido" JSONB NOT NULL DEFAULT '{}',
    "tipo" TEXT,
    "categoria" TEXT,
    "fecha" TIMESTAMP(3),
    "imagen" TEXT,
    "lectura" INTEGER NOT NULL DEFAULT 1,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "estado" "estado_publicacion" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publicaciones_slug_key" ON "publicaciones"("slug");

-- CreateIndex
CREATE INDEX "publicaciones_estado_idx" ON "publicaciones"("estado");

-- CreateIndex
CREATE INDEX "publicaciones_fecha_idx" ON "publicaciones"("fecha");

-- CreateIndex
CREATE INDEX "publicaciones_categoria_idx" ON "publicaciones"("categoria");
