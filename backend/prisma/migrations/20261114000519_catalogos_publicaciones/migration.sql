-- CreateTable
CREATE TABLE "opciones_tipos_publicacion" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opciones_tipos_publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_categorias_publicacion" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "opciones_categorias_publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opciones_tipos_publicacion_nombre_key" ON "opciones_tipos_publicacion"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "opciones_categorias_publicacion_nombre_key" ON "opciones_categorias_publicacion"("nombre");
