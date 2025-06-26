import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.department.createMany({
    data: [
      { departmentName: 'HR' },
      { departmentName: 'Development' },
      { departmentName: 'Accounts' },
    ],
    skipDuplicates: true, // prevents re-inserting if already exists
  });
}

main()
  .then(() => {
    console.log('Departments seeded');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
