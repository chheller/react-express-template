import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Express from 'express';
import { buildProviderModule } from 'inversify-binding-decorators';
import { isNil } from 'lodash';
import { Connection } from 'mongoose';
import morgan from 'morgan';
import 'reflect-metadata';
import config from '../common/configuration';
import { iocContainer } from '../common/ioc';
import { MongoDbConnection } from '../db/mongo/mongo-db';
import error400Middleware from '../middleware/400.mw';
import error404Middleware from '../middleware/404.mw';
// @ts-ignore
import { RegisterRoutes } from '../routes';

export async function initializeApp(serverConfiguration?: any) {
  try {
    const mongooseConnection = await MongoDbConnection.getConnection();
    if (isNil(mongooseConnection))
      throw new Error('Unable to connect to mongo');

    iocContainer
      .bind<Connection>(Connection)
      .toConstantValue(mongooseConnection);

    iocContainer.load(buildProviderModule());

    const app = Express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser(config.cookieSecret));
    app.use(morgan('dev'));

    RegisterRoutes(app);

    app.use(error400Middleware);
    app.use(error404Middleware);

    return app;
  } catch (err) {
    throw err;
  }
}

export async function listen() {}

export async function close() {
  await MongoDbConnection.close();
}
