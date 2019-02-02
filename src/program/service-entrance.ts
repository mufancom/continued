import express from 'express';

import {APIService, PortService, ProxyService} from './services';

let app = express();

export const portService = new PortService();

export const apiService = new APIService(app, portService);

export const proxyService = new ProxyService(app, portService);

export function listen(): void {
  let port = process.env.PORT || 80;
  app.listen(port, () => console.info(`Listening on port ${port}...`));
}
