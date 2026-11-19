ALTER TABLE "publicaciones"
ALTER COLUMN "categoria" TYPE TEXT[]
USING CASE
    WHEN "categoria" IS NULL OR TRIM("categoria") = '' THEN ARRAY[]::TEXT[]
    ELSE ARRAY["categoria"]::TEXT[]
END;

ALTER TABLE "publicaciones"
ALTER COLUMN "categoria" SET DEFAULT ARRAY[]::TEXT[];

UPDATE "publicaciones"
SET "categoria" = ARRAY[]::TEXT[]
WHERE "categoria" IS NULL;