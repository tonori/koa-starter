import cors from '@koa/cors';
import type Koa from 'koa';

export default function initCors(app: Koa) {
  return app.use(
    cors({
      origin: '*',
    })
  );
}
