import type Koa from 'koa';
import type HttpStatusCodes from 'http-status-codes';
import { StatusCodes } from 'http-status-codes';
import { type ValidateError } from 'async-validator/dist-types/interface';

export type Phrase = Exclude<
  keyof typeof HttpStatusCodes,
  'getStatusCode' | 'getStatusText'
>;

export interface Error {
  phrase?: Phrase;
  name?: string;
  message?: string;
  details?: ValidateError;
}

export default function ApiResponse(app: Koa) {
  app.use(async (ctx, next) => {
    ctx.success = (data?: any, phrase?: Phrase) => {
      ctx.response.type = 'application/json';
      ctx.response.status = StatusCodes[phrase ?? 'OK'];
      ctx.response.body = JSON.stringify(data);
    };

    ctx.error = (error?: Error) => {
      const phrase = error?.phrase ?? 'INTERNAL_SERVER_ERROR';
      const statusCode = StatusCodes[phrase];

      ctx.response.type = 'application/json';
      ctx.response.status = statusCode;
      ctx.response.body = JSON.stringify({
        status: statusCode,
        name: error?.name ?? phrase,
        message: error?.message ?? phrase,
        details: error?.details,
      });
    };

    return await next();
  });
}
