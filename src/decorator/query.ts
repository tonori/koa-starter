import { query } from 'koa-swagger-decorator';

type Fields = Record<
  string,
  {
    type: 'number' | 'string' | 'boolean' | 'object' | 'array' | 'paginate';
    required?: boolean;
    default?: any;
    description?: string;
    properties?: Fields;
  }
>;

export default function (fields: Fields, paginate?: boolean) {
  const paginateField = {
    page: { type: 'number', required: true, default: 1, description: '页码' },
    size: { type: 'number', required: true, default: 10, description: '单页数量' },
  };
  return query(Object.assign(fields, paginate === true ? paginateField : {}));
}
