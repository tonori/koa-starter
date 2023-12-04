import bodyParser from 'koa-bodyparser';
import type Koa from 'koa';

export default function initBodyParser(app: Koa) {
  return app.use(bodyParser());
}
