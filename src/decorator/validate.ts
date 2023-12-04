import Schema, { type Rules } from 'async-validator';
import { type Context, type Next } from 'koa';
import { type ValidateError } from 'async-validator/dist-types/interface';

export interface ValidateRules {
  params?: Rules;
  query?: Rules;
  body?: Rules;
}

const paginateRules: Rules = {
  page: {
    type: 'number',
    required: true,
    min: 1,
    transform: value => Number(value),
  },
  size: {
    type: 'number',
    required: true,
    min: 0,
    transform: value => Number(value),
  },
};

export default function (rules?: ValidateRules, paginate?: boolean) {
  return async function (ctx: Context, next: Next) {
    const _rules: Rules = {};
    const source: Record<string, unknown> = {};

    if (rules == null && paginate === false) {
      await next();
    }

    Object.keys(rules ?? {}).forEach(field => {
      _rules[field] = {
        type: 'object',
        required: true,
        fields:
          field === 'query' && paginate === true
            ? Object.assign(rules?.[field] != null ?? {}, paginateRules)
            : (rules as Record<string, any>)[field],
      };

      switch (field) {
        case 'query':
          source.query = Object.assign({}, ctx.request.query);
          break;
        case 'params':
          source.params = Object.assign({}, ctx.params);
          break;
        case 'body':
          source.body = Object.assign({}, ctx.request.body);
          break;
      }
    });

    const validator = new Schema(_rules);

    try {
      ctx.validateValue = await validator.validate(source);
      await next();
    } catch (err) {
      const { errors } = err as { errors: ValidateError[] };
      ctx.error({
        phrase: 'BAD_REQUEST',
        name: 'Request fields validate error',
        details: errors?.[0],
      });
    }
  };
}
