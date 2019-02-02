import {Express} from 'express';
import proxy from 'http-proxy-middleware';

import {getBranchFromHostname} from '../utils';

import {PortService} from './port-service';

const PROXY_TARGET_HOSTNAME = 'localhost';

export class ProxyService {
  constructor(private app: Express, private portService: PortService) {
    this.initialize();
  }

  private initialize(): void {
    this.app.use('/', (request, response, next) => {
      let {hostname} = request;

      let branch = getBranchFromHostname(hostname);

      if (!branch) {
        response.send('Not found');
        return;
      }

      let port = this.portService.get(branch);

      if (!port) {
        response.send('Merge request for this branch not exists');
        return;
      }

      proxy({
        target: `http://${PROXY_TARGET_HOSTNAME}:${port}`,
        changeOrigin: true,
      })(request, response, next);
    });
  }
}
