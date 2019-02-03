import {Express} from 'express';

import {DockerService} from './docker-service';
import {PortService} from './port-service';

export class APIService {
  constructor(
    private app: Express,
    private portService: PortService,
    private dockerService: DockerService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.app.get('/start-mr-server', async (request, response) => {
      let {branch} = request.query;

      if (!branch) {
        response.send('Branch should not be empty');

        return;
      }

      let port = await this.portService.generate(branch);

      response.send(String(port));

      this.dockerService
        .run(branch, port)
        .then(() => {
          this.portService.remove(branch);
        })
        .then(async () => {
          await this.dockerService.cleanImage(branch);
        })
        .catch(console.error);
    });

    this.app.get('/stop-mr-server', (request, response) => {
      let {merge_request: mrInfo} = request.body;

      if (!mrInfo) {
        response.send('Can only be called by GitLab merge request hook');

        return;
      }

      let {source_branch: branch, state} = mrInfo;

      if (!branch) {
        response.send('Unknown source branch');

        return;
      }

      if (!state) {
        response.send('Unknown merge request state');

        return;
      }

      if (state === 'opened') {
        response.send('Merge request still opened');

        return;
      }

      response.send('Stopping...');

      this.dockerService.stop(branch).catch(console.error);
    });
  }
}
