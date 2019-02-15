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
    await runCommand(
      `docker rmi --force makeflow-web-mr-${getSubdomainFromBranch(branch)}`,
    );

    await runCommand(`docker image prune --force`);
  }

  async stop(branch: string): Promise<void> {
    let subdomain = getSubdomainFromBranch(branch);

    let projectName = `makeflow-web-mr-${subdomain}`;

    let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-mr.yml`;

    await runCommand(`${composeCommand} down`, {
      ENVIRONMENT: 'mr',
      MERGE_REQUEST_SUBDOMAIN: subdomain,
    });
  }
}
