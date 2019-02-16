import getPort from 'get-port';

export class PortService {
  private branchToPortMap = new Map<string, number>();
  private portSet = new Set<number>();

  get(branch: string): number | undefined {
    let port = this.branchToPortMap.get(branch);

    return port;
  }

  async generate(branch: string): Promise<number> {
    let port = this.get(branch);

    if (port) {
      return port;
    }

    while (!port || this.portSet.has(port)) {
      port = await getPort();
    }

    this.branchToPortMap.set(branch, port);
    this.portSet.add(port);

    return port;
  }

  remove(branch: string): boolean {
    let port = this.branchToPortMap.get(branch);

    if (!port) {
      return false;
    }

    let deletedFromSet = this.portSet.delete(port);
    let deletedFromMap = this.branchToPortMap.delete(branch);

    return deletedFromSet && deletedFromMap;
  }
}
