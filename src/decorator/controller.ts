import { tagsAll } from 'koa-swagger-decorator';

export default function (name: string) {
  return tagsAll([name]);
}
