import {Express} from 'express';

import {PortService} from './port-service';

export class APIService {
  constructor(private app: Express, private portService: PortService) {
    this.initialize();
  }

  private initialize(): void {
    this.app.get('/get-port', async (request, response) => {
      let {branch} = request.query;

      if (!branch) {
        response.send('Branch should not be empty');

        return;
      }

      let port = await this.portService.generate(branch);

      response.send(String(port));
    });

    this.app.get('/remove-port', (request, response) => {
      let {branch} = request.query;

      if (!branch) {
        response.send('Branch should not be empty');

        return;
      }

      this.portService.remove(branch);

      response.send('Success');
    });
  }
}
