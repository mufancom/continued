import express from 'express';

import {config} from './config';
import {
  APIService,
  DockerService,
  IndexService,
  PortService,
  ProxyService,
} from './services';

let app = express();

export const portService = new PortService();

export const dockerService = new DockerService();

export const indexService = new IndexService(app, portService);

export const proxyService = new ProxyService(app, portService);

export const apiService = new APIService(
  app,
  portService,
  dockerService,
  proxyService,
);

export function listen(): void {
  let port = parseInt(config.PROXY_PORT) || 80;

  app.listen(port, () => console.info(`Listening on port ${port}...`));
}
