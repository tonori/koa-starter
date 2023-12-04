import { SwaggerRouter } from 'koa-swagger-decorator';
import { resolve } from 'path';
import { env } from 'process';
import type Koa from 'koa';

export default function initRoutes(app: Koa) {
  const router = new SwaggerRouter();

  if (env.NODE_ENV === 'development') {
    router.swagger({
      title: env.SWAGGER_TITLE ?? 'Koa API',
      description: env.SWAGGER_DESCRIPTION ?? 'Koa API Documentation',
      version: env.SWAGGER_DOC_VERSION ?? '1.0.0',
      swaggerHtmlEndpoint: env.SWAGGER_DOC_URL,
    });
  }

  router.mapDir(resolve(__dirname, '../controller'), {
    doValidation: false,
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
