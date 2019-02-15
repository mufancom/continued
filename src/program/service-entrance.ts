import express from 'express';

import {config} from './config';
import {APIService, DockerService, PortService, ProxyService} from './services';

let app = express();

export const portService = new PortService();

export const dockerService = new DockerService();

export const apiService = new APIService(app, portService, dockerService);

export const proxyService = new ProxyService(app, portService);

app.post('*', (req, _res, next) => {
  console.info('[Visit]', {
    path: req.path,
    params: req.params,
    body: req.body,
    query: req.query,
    headers: req.headers,
  });

  next();
});

export function listen(): void {
  let port = parseInt(config.PROXY_PORT) || 80;

  app.listen(port, () => console.info(`Listening on port ${port}...`));
}
