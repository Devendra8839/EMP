import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class TableService {
  constructor(private readonly prisma: PrismaClient) {}

  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.prisma.$queryRawUnsafe<{ exists: boolean }[]>(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_name = $1
       ) AS "exists"`,
      tableName
    );
    return result[0]?.exists ?? false;
  }
}

// -------- CLI EXECUTION BLOCK --------
if (require.main === module) {
  const prisma = new PrismaClient();
  const tableService = new TableService(prisma);

  const tableName = process.argv[2];
  if (!tableName) {
    console.error('❌ Please provide a table name.');
    process.exit(1);
  }

  tableService
    .tableExists(tableName)
    .then((exists) => {
      console.log(`✅ Table "${tableName}" exists:`, exists);
    })
    .catch((err) => {
      console.error('❌ Error:', err);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
