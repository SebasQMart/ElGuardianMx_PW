-- CreateEnum
CREATE TYPE "estado_audiencia" AS ENUM ('PROGRAMADA', 'EN_PROCESO', 'CELEBRADA', 'REPROGRAMADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "audiencias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "juzgado" TEXT NOT NULL,
    "estado" "estado_audiencia" NOT NULL DEFAULT 'PROGRAMADA',
    "ubicacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audiencias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audiencias_fechaHora_idx" ON "audiencias"("fechaHora");

-- CreateIndex
CREATE INDEX "audiencias_tipo_idx" ON "audiencias"("tipo");

-- CreateIndex
CREATE INDEX "audiencias_juzgado_idx" ON "audiencias"("juzgado");

-- CreateIndex
CREATE INDEX "audiencias_estado_idx" ON "audiencias"("estado");
