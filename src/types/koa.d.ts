import type { Error, Phrase } from '@/middlewares/ApiResponse';
import type { DefaultState, ParameterizedContext } from 'koa';

declare module 'koa' {
  interface DefaultContext {
    success: (data?: any, phrase?: Phrase) => void;
    error: (error?: Error) => void;
    validateValue: Record<string, any>;
  }

  type Context = ParameterizedContext<DefaultState, DefaultContext>;
}
