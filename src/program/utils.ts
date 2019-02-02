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
