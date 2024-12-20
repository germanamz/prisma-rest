import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import {
  AssetCrudService,
  BookCrudService,
  EntryCrudService,
  LabelCrudService,
  LedgerCrudService,
  LogCrudService,
  makeAssetApi,
  makeBookApi,
  makeEntryApi,
  makeLabelApi,
  makeLedgerApi,
  makeLogApi,
} from './generated/hono';

const app = new Hono();
const prisma = new PrismaClient();

app.route('books', makeBookApi(new BookCrudService(prisma)));
app.route('entries', makeEntryApi(new EntryCrudService(prisma)));
app.route('assets', makeAssetApi(new AssetCrudService(prisma)));
app.route('labels', makeLabelApi(new LabelCrudService(prisma)));
app.route('ledgers', makeLedgerApi(new LedgerCrudService(prisma)));
app.route('logs', makeLogApi(new LogCrudService(prisma)));

export {
  app,
  prisma,
};
