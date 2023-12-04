import {
  body,
  middlewares,
  path,
  request,
  responses,
  summary,
} from 'koa-swagger-decorator';
import query from '@/decorator/query';
import validate from '@/decorator/validate';
import controller from '@/decorator/controller';
import { Context } from 'koa';
import Example from '@/entity/example';
import AppDataSource from '@/config/dataSource';

@controller('Test')
export default class Index {
  @request('GET', '/')
  @summary('Greetings from Koa~')
  @responses({
    200: {
      description: 'say hello',
      type: 'object',
      properties: {
        hello: { type: 'string', required: true, example: 'world' },
      },
    },
  })
  static helloWorld(ctx: Context) {
    ctx.success({
      hello: 'world',
    });
  }

  @request('GET', '/validate/{method}')
  @summary('请求校验，会同时校验路径参数和查询参数')
  @query(
    {
      method: {
        type: 'string',
        default: 'test',
        required: true,
        description: '校验请求参数 method 值必须为 test',
      },
    },
    true
  )
  @path({
    method: {
      type: 'string',
      default: 'test',
      required: true,
      description: '校验路径参数 method 值必须为 test',
    },
  })
  @middlewares([
    validate(
      {
        query: {
          method: {
            type: 'enum',
            enum: ['test'],
            required: true,
          },
        },
        params: {
          method: {
            type: 'enum',
            enum: ['test'],
            required: true,
          },
        },
      },
      true
    ),
  ])
  static Validate(ctx: Context) {
    ctx.success({
      path: ctx.validateValue.params,
      query: ctx.validateValue.query,
    });
  }

  @request('POST', '/insert')
  @summary('调用 TypeORM 向数据库插入数据')
  @body({
    name: { type: 'string', required: true, description: '姓名', example: '小红' },
    age: { type: 'number', required: true, description: '年龄', example: 20 },
  })
  @middlewares([
    validate({
      body: {
        name: { type: 'string', required: true },
        age: { type: 'number', required: true },
      },
    }),
  ])
  static async Insert(ctx: Context) {
    const { body } = ctx.validateValue;

    const user = new Example();
    user.name = body.name;
    user.age = body.age;

    await AppDataSource.manager.insert(Example, user);

    ctx.success(
      {
        success: true,
      },
      'CREATED'
    );
  }
}
