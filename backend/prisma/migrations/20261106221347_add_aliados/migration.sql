-- CreateEnum
CREATE TYPE "tipo_aliado" AS ENUM ('PERSONA', 'ORGANIZACION');

-- CreateTable
CREATE TABLE "aliados" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT,
    "ubicacion" TEXT,
    "tipo" "tipo_aliado" NOT NULL,
    "sitioOficial" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aliados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "aliados_activo_idx" ON "aliados"("activo");

-- CreateIndex
CREATE INDEX "aliados_tipo_idx" ON "aliados"("tipo");
