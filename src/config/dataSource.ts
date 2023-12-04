import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { env } from 'process';
import chalk from 'chalk';

const config: Record<string, DataSourceOptions> = {
  development: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'test',
  },
  production: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'test',
  },
};

const AppDataSource = new DataSource({
  ...config[env.NODE_ENV as string],
  synchronize: true,
  entities: ['src/entity/*.ts'],
  migrations: ['migrations/*.ts'],
});

export const initDataSource = () => {
  AppDataSource.initialize()
    .then(() => {
      const datasource = config[env.NODE_ENV as string] as MysqlConnectionOptions;
      console.log(
        chalk.green.underline(
          `🏠 数据库 ${chalk.whiteBright.bold(
            `${datasource.type}@${datasource.host}:${datasource.database}`
          )} 链接成功`
        )
      );
    })
    .catch(err => {
      console.error('数据库链接失败', err);
    });
};

export default AppDataSource;
