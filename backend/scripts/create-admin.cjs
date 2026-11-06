require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const admins = [1, 2, 3].map((number) => ({
    email: process.env[`ADMIN_EMAIL_${number}`]?.trim().toLowerCase(),
    password: process.env[`ADMIN_PASSWORD_${number}`],
  }));

  for (const [index, admin] of admins.entries()) {
    if (!admin.email || !admin.password) {
      throw new Error(`Faltan los datos del administrador ${index + 1}.`);
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email) ||
      admin.email.length > 254
    ) {
      throw new Error(`El correo del administrador ${index + 1} no es válido.`);
    }

    const passwordBytes = Buffer.byteLength(admin.password, 'utf8');

    if (passwordBytes < 12 || passwordBytes > 72) {
      throw new Error(
        `La contraseña del administrador ${index + 1} debe tener entre 12 y 72 bytes.`,
      );
    }
  }

  const emails = admins.map((admin) => admin.email);

  if (new Set(emails).size !== 3) {
    throw new Error('Los tres administradores deben tener correos diferentes.');
  }

  const passwordHashes = await Promise.all(
    admins.map((admin) => hash(admin.password, 12)),
  );

  await prisma.$transaction(async (transaction) => {
    const existingAdmin = await transaction.admin.findFirst();

    if (existingAdmin) {
      throw new Error(
        'Ya existen administradores. No se crearán cuentas adicionales.',
      );
    }

    await transaction.admin.createMany({
      data: admins.map((admin, index) => ({
        email: admin.email,
        passwordHash: passwordHashes[index],
      })),
    });
  });

  console.log('Se crearon correctamente los tres administradores:');

  for (const admin of admins) {
    console.log(`- ${admin.email}`);
  }
}

main()
  .catch((error) => {
    console.error('No fue posible crear los administradores:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });