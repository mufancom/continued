import {config} from '../config';
import {runCommand} from '../utils';

export class DockerService {
  async run(branch: string, port: number): Promise<void> {
    let projectName = `makeflow-web-${branch}`;

    let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-mr.yml`;

    let {PROXY_PORT, PROXY_TARGET_HOSTNAME, ...dockerEnv} = config;

    await runCommand(
      `${composeCommand} up --force-recreate --always-recreate-deps --renew-anon-volumes`,
      {
        CI_MERGE_REQUEST_SOURCE_BRANCH_NAME: branch,
        MAKEFLOW_MR_PORT: String(port),
        ...dockerEnv,
      },
    );
  }

  async cleanImage(branch: string): Promise<void> {
    await runCommand(`docker rmi --force makeflow-web-mr:${branch}`);
  }

  async stop(branch: string): Promise<void> {
    let projectName = `makeflow-web-${branch}`;

    let composeCommand = `docker-compose --project-name ${projectName} --file docker-compose-mr.yml`;

    await runCommand(`${composeCommand} down`);
  }
}
