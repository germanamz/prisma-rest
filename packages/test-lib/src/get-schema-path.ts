import { resolve } from 'node:path';

export const getSchemaPath = () => resolve(__dirname, '../prisma/schema.prisma');
