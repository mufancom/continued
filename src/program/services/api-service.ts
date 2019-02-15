import bodyParser from 'body-parser';
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

    this.app.use('/stop-mr-server', bodyParser.json());

    this.app.post('/stop-mr-server', (request, response) => {
      let tag = '[API][stop-mr-server]';

      console.info(tag, 'client in');

      console.info('[Visit]', {
        path: request.path,
        params: request.params,
        body: request.body,
        query: request.query,
        headers: request.headers,
      });

      if (!request.body || !request.body.merge_request) {
        response.send('Can only be called by GitLab merge request hook');
        console.info(tag, 'unknown call');

        return;
      }

      let {merge_request: mrInfo} = request.body;

      let {source_branch: branch, state} = mrInfo;

      if (!branch) {
        response.send('Unknown source branch');
        console.info(tag, 'empty source branch');

        return;
      }

      if (!state) {
        response.send('Unknown merge request state');
        console.info(tag, 'unknown merge request state');

        return;
      }

      if (state === 'opened') {
        response.send('Merge request still opened');
        console.info(tag, 'merge request still opened');

        return;
      }

      response.send('Stopping...');
      console.info(tag, 'stopping', branch);

      this.dockerService.stop(branch).catch(console.error);
    });
  }
}
