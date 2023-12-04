import dotenv from 'dotenv';

import Koa from 'koa';
import initCors from '@/middlewares/cors';
import initBodyParser from '@/middlewares/bodyParser';
import ApiResponse from '@/middlewares/ApiResponse';
import initRoutes from '@/middlewares/router';
import { initDataSource } from '@/config/dataSource';
import { env } from 'process';
import chalk from 'chalk';

const app = new Koa();

dotenv.config({
  path: `.env.${env.NODE_ENV ?? 'development'}`,
});

initCors(app);
initBodyParser(app);
ApiResponse(app);
initDataSource();
initRoutes(app);

app.listen(Number(env.PORT ?? 3000), env.HOST, () => {
  console.log(
    chalk.underline.blueBright(
      `🚀 ${env.NODE_ENV} server start at: http://${env.HOST ?? '127.0.0.1'}:${
        env.PORT ?? 3000
      }`
    )
  );
});
