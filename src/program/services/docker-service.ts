import * as v from 'villa';

import {config} from '../config';
import {getSubdomainFromBranch, runCommand} from '../utils';

export class DockerService {
  async run(branch: string, port: number): Promise<void> {
    let subdomain = getSubdomainFromBranch(branch);

    let projectName = `makeflow-web-mr-${subdomain}`;

    let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-mr.yml`;

    let {PROXY_PORT, PROXY_TARGET_HOSTNAME, ...dockerEnv} = config;

    await runCommand(
      `${composeCommand} up --force-recreate --always-recreate-deps --renew-anon-volumes`,
      {
        ENVIRONMENT: 'mr',
        MERGE_REQUEST_SUBDOMAIN: subdomain,
        MAKEFLOW_MR_PORT: String(port),
        ...dockerEnv,
      },
    );
  }

  async cleanImage(branch: string): Promise<void> {
    let subdomain = getSubdomainFromBranch(branch);

    await runCommand('./scripts/clean-mr-images.sh', {
      MERGE_REQUEST_SUBDOMAIN: subdomain,
    });
  }

  async stop(branch: string): Promise<void> {
    let subdomain = getSubdomainFromBranch(branch);

    let projectName = `makeflow-web-mr-${subdomain}`;

    let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-mr.yml`;

    await runCommand(`${composeCommand} down`, {
      ENVIRONMENT: 'mr',
      MERGE_REQUEST_SUBDOMAIN: subdomain,
    });

    await v.sleep(10000);
  }
}
