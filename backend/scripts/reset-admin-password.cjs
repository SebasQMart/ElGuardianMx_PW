require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Faltan el correo o la nueva contraseña.');
  }

  const passwordBytes = Buffer.byteLength(password, 'utf8');

  if (passwordBytes < 12 || passwordBytes > 72) {
    throw new Error('La contraseña debe tener entre 12 y 72 bytes.');
  }

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error('No existe un administrador con ese correo.');
  }

  const passwordHash = await hash(password, 12);

  await prisma.admin.update({
    where: { email },
    data: { passwordHash },
  });

  console.log(`Contraseña actualizada correctamente para: ${email}`);
}

main()
  .catch((error) => {
    console.error('No fue posible actualizar la contraseña:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });