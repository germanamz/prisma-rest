import { serve } from '@hono/node-server';
import { app } from './app';

serve(app, (data) => {
  // eslint-disable-next-line no-console
  console.log(data);
});
