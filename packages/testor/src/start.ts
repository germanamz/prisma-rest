import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PrismaClient } from '@prisma/client';
import { BookCrudService, makeBookApi } from './generated/hono';

const app = new Hono();
const prisma = new PrismaClient();

app.route('books', makeBookApi(new BookCrudService(prisma)));

serve(app, (data) => {
  // eslint-disable-next-line no-console
  console.log(data);
});
