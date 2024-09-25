import { Hono } from 'hono';
import { BookCrudService, makeBookApi } from './generated/hono';
import { PrismaClient } from './generated/client';
import { serve } from '@hono/node-server';

const app = new Hono();
const prisma = new PrismaClient();

app.route('books', makeBookApi(new BookCrudService(prisma)));

serve(app, (data) => {
  console.log(data);
});