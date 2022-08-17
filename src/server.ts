import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import App from './app';
import * as config from './ormconfig';

import AuthenticationController from './authentication/authentication.controller';
import WalletController from './wallet/wallet.controller';

(async () => {
  try {
    const connection = await createConnection(config);
    await connection.runMigrations();
  } catch (error) {
    console.log('Error while connecting to the database', error);
    return error;
  }
  const app = new App([new AuthenticationController(), new WalletController()]);
  app.listen();
})();
