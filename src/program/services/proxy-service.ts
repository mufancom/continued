import {Express} from 'express';
import proxy from 'http-ws-proxy-middleware';

import {config} from '../config';
import {getBranchFromHostname} from '../utils';

import {PortService} from './port-service';

const PROXY_API_HOSTNAME = 'localhost';

export class ProxyService {
  private portToProxyMap = new Map<number, proxy.Proxy>();

  constructor(private app: Express, private portService: PortService) {
    this.initialize();
  }

  removeProxy(port: number): void {
    this.portToProxyMap.delete(port);
  }

  private initialize(): void {
    this.app.use('/', (request, response, next) => {
      let {hostname} = request;

      if (hostname === PROXY_API_HOSTNAME) {
        next();
        return;
      }

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

      this.getProxy(port)(request, response, next);
    });
  }

  private getProxy(port: number): proxy.Proxy {
    let middleware = this.portToProxyMap.get(port);

    if (!middleware) {
      middleware = proxy({
        target: `http://${config.PROXY_TARGET_HOSTNAME}:${port}`,
        changeOrigin: true,
        ws: true,
        logLevel: 'silent',
      });

      this.portToProxyMap.set(port, middleware);
    }

    return middleware;
  }
}
