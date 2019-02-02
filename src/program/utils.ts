import * as ChildProcess from 'child_process';

import {Dict} from 'tslang';
import * as v from 'villa';

import {PROJECT_DIR} from './paths';

const REGEX_BRANCH_IN_HOSTNAME = /(.*?)\.mr\.makeflow\.io$/;

export function getBranchFromHostname(hostname: string): string | undefined {
  let matches = REGEX_BRANCH_IN_HOSTNAME.exec(hostname);

  if (!matches) {
    return undefined;
  }

  let subDomain = matches[1];

  let branch = subDomain
    .split('.')
    .reverse()
    .join('/');

  return branch;
}

export async function runCommand(
  command: string,
  env?: Dict<string> | undefined,
): Promise<void> {
  console.info(`$ ${command}`);

  let commandProcess = ChildProcess.exec(command, {cwd: PROJECT_DIR, env});

  commandProcess.stdout.pipe(process.stdout);
  commandProcess.stderr.pipe(process.stderr);

  await v.awaitable(commandProcess);
}
