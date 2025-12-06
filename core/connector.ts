type UUID = string;
export interface ConnectorInterface {
  update: (uuid: UUID, value: unknown) => void;
  addTopic: (uuid: UUID) => void;
  removeTopic: (uuid: UUID) => void;
  registerClbk: (uuid: UUID, cb: (value: unknown) => void) => void;
  removeClbk: (uuid: UUID, cb: (value: unknown) => void) => void;
  getUuidByClbk: (cb: (value: unknown) => void) => UUID;
}

class Connector implements ConnectorInterface {
  //listener is a list of uuids that have a set of callbacks
  //it is possible, that a uuid has NO listener at all. this is by
  //design. uuid will be remove by mount and unmount
  private topic = new Map<UUID, Set<(value: any) => void>>();

  //the clbk mapping is to find uuid by fn ref fast
  //we dont want to have search all the listeners. this is the reason for
  //uuidMapping. its just a helper for better performance
  private clbkMapping = new Map<(value: any) => void, UUID>();

  public addTopic(uuid: UUID) {
    this.topic.set(uuid, new Set());
  }

  public removeTopic(uuid: UUID) {
    this.topic.delete(uuid);
  }

  public registerClbk<T>(uuid: string, cb: (value: T) => void) {
    const listeners = this.topic.get(uuid);
    if (!listeners) return;

    this.clbkMapping.set(cb, uuid);
    listeners.add(cb);
  }

  public removeClbk<T>(uuid: UUID, cb: (value: T) => void) {
    const listeners = this.topic.get(uuid);
    if (!listeners) return;
    listeners.delete(cb);
  }

  public update<T>(uuid: UUID, value: T) {
    const listeners = this.topic.get(uuid);
    if (!listeners) return;
    for (const listener of listeners) {
      listener(value);
    }
  }
  public getUuidByClbk(fn: (value: unknown) => void) {
    const uuid = this.clbkMapping.get(fn);
    if (!uuid) {
      throw new Error("Connector: clbkMapping has no uuid for fn " + fn);
    }
    return uuid;
  }
}
export const connector = new Connector();
