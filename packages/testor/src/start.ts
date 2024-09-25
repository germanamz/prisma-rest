import { Hono } from 'hono';
import { makeBookApi } from './generated/hono/hono';
import { PrismaClient } from './generated/client';
import { BookCrudService } from './generated/hono/services';
import { serve } from '@hono/node-server';

const app = new Hono();
const prisma = new PrismaClient();

app.route('books', makeBookApi(new BookCrudService(prisma)));

serve(app, (data) => {
  console.log(data);
});