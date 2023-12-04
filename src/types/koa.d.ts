import type { Error } from '@/middlewares/ApiResponse';
import type { DefaultState, ParameterizedContext } from 'koa';

declare module 'koa' {
  interface DefaultContext {
    success: (data?: any, statusCode?: number) => void;
    error: (error?: Error) => void;
    validateValue: Record<string, any>;
  }

  type Context = ParameterizedContext<DefaultState, DefaultContext>;
}
