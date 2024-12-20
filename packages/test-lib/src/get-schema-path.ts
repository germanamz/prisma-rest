import { resolve } from 'node:path';

/**
 * Get the path to the common Prisma schema file.
 *
 * @returns string
 */
export const getSchemaPath = () => resolve(__dirname, '../prisma/schema.prisma');
