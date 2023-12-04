## 嫌长不看

```typescript
import {
  body,
  middlewares,
  path,
  request,
  responses,
  summary,
  tags
} from "koa-swagger-decorator";
import query from "@/decorator/query";
import validate from "@/decorator/validate";
import controller from "@/decorator/controller";
import { Context } from "koa";

// 体现在 Swagger 中，分类的作用，封装的是 tagsAll
@controller("Test")
export default class Index {
// 可以单独为某个接口声明 Swagger 分类
  @tags(["Test"])
// 注册路由的同时也会在 swagger 中创建对应的 api 接口
  @request("GET", "/")
// swagger 接口描述
  @summary("Greetings from Koa~")
// 响应体示例，体现在 swagger 中，key 为状态码
  @responses({
    200: {
      description: "say hello",
      type: "object",
      properties: {
        hello: { type: "string", required: true, example: "world" }
      }
    }
  })
// Context 为二次封装的类型，只有声明了 Context 才能获取 ctx.succss 等类型提示
  static helloWorld(ctx: Context) {
    ctx.success({
      hello: 'world',
    });
  }
}
```

## 前置知识

[koa-swagger-decorator](https://www.npmjs.com/package/koa-swagger-decorator)

## 环境变量列表

```text
NODE_ENV - 运行环境
HOST - 服务器监听地址
PORT - 服务器监听端口
SWAGGER_TITLE - Swagger 标题
SWAGGER_DESCRIPTION - Swagger 文档描述
SWAGGER_DOC_VERSION - Swagger 文档版本
SWAGGER_DOC_URL - Swagger 文档路径
```

## TypeORM

[TypeORM 文档](https://typeorm.io/)

### 定义数据源

[dataSource 配置项](https://typeorm.io/data-source-options)

```JSON
# package.json
# NODE_ENV 就在这传入
"dev": "NODE_ENV=development nodemon --watch src -e ts --exec ts-node -r tsconfig-paths/register --files src/app.ts",
```

```typescript
// @/config/dataSource.ts
const config: Record<string, DataSourceOptions> = {
// key: NODE_ENV 环境变量
  development: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "test"
  }
};
```

### 实体类

文档：[Entities](https://typeorm.io/entities)

路径：`/src/entity/*.ts`

### 数据库迁移

文档：[migrations](https://typeorm.io/migrations)

脚本路径: `/migrations/*.ts`

#### 数据库创建流程

```bash
# 注意 migrations 的相对路径，migrations 在项目根目录下
# dev:typeorm 或者 prod:typeorm 都可以，这只是生成迁移文件，还没有操作数据库

pnpm run dev:typeorm migration:create /migrations/TABLE_NAME


# 编写 migratio：https://typeorm.io/migrations#using-migration-api-to-write-migrations


# 运行迁移，注意 dataSource 的路径，最好是绝对路径，这一步将操作数据库，需要区分 dev:typeorm 或者 prod:typeorm
pnpm run dev:typeorm migration:run -d /src/config/dataSource.ts
```

## 请求参数校验 / 对象校验

**Koa-swagger-decorator 的校验功能已经关闭，query / body / path 等装饰器只用于书写 swagger。**

**请求参数校验提供了 validate 中间件 (@/middlewares/validate.ts)，但也是基于 async-validator 封装的。**

[async-validator](https://github.com/yiminghe/async-validator)

```typescript
@middlewares([
  validate(
    {
      query: {
        method: {
          type: "enum",
          enum: ["test"],
          required: true
        }
      },
      params: {
        method: {
          type: "enum",
          enum: ["test"],
          required: true
        }
      }
    },
// 第二个参数为 paginate，指示开启中间件对 Page 和 size 的校验规则
    true
  )
])
```

校验不通过会直接返回异常响应，通过后会赋值 `ctx.validateValue` ，其中包含 params（路径参数）/ query（查询参数）/ body（POST
的数据）

```json
// 校验失败时返回的异常响应
{
  "status": 400,
  "name": "Request fields validate error",
  "message": "BAD_REQUEST",
  "details": {
    "message": "params.method must be one of test",
    "fieldValue": "1",
    "field": "params.method"
  }
}
```

```typescript
// validateValue 使用示例
const { body, params, query } = ctx.validateValue;

const user = new Example();
user.name = body.name;
user.age = body.age;
```

## 响应

响应体定义：`@/middlewares/ApiResponse`

```typescript
/*
* 成功响应
* @data: 响应数据，任何数据类型都可以，只要可以被 JSON.stringify 序列化
* @phrase: 状态码短语，根据状态码短语转化为对应的状态码，如果 data 为状态码变为 204 （Not Content）
*/
ctx.success(data, statusCode)

/*
* 异常响应
* @phrase: 状态码短语，根据状态码短语转化为对应的状态码，
* @name: 异常名
* @message: 异常消息，通常是人为返回的错误
* @details: 异常详情，通常是参数校验错误的信息
*/
ctx.error(error)
```

## Swagger

Swagger 只会在 development 环境下启用

Swagger 默认路径：http://127.0.0.1:3000/swagger-html

Swagger 在 @/middlewares/router.ts 中配置，配置项查看 koa-swagger-decorator 的文档

```typescript
router.swagger({
  title: env.SWAGGER_TITLE ?? 'Koa API',
  description: env.SWAGGER_DESCRIPTION ?? 'Koa API Documentation',
  version: env.SWAGGER_DOC_VERSION ?? '1.0.0',
  swaggerHtmlEndpoint: env.SWAGGER_DOC_URL,
});
```

## 工程化

1. Prettier
2. Eslint
3. validate-commit-msg

在 commit 时，如果 commit message 不符合规范，会拒绝提交。

[Commit message 和 Change log 编写指南](https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)
