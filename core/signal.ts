// signal.ts
// Synchronous signal with ref-counted subscriptions (prop-safe, leak-safe)

type UUID = string;

export type ReadFn<T> = ((cb?: (value: T) => void) => T) & {
  type: "signal";
};

export function signal<T>(initialValue: T) {
  let value = initialValue;
  const uuid = crypto.randomUUID();

  connector.addTopic(uuid);

  const read: ReadFn<T> = (cb?: (v: T) => void): T => {
    if (cb) {
      connector.registerClbk(uuid, cb);
      cb(value);
    }
    return value;
  };

  read.type = "signal";

  const write = async (fn: (prev: T) => T | Promise<T>): Promise<void> => {
    const next = fn(value);
    value = next instanceof Promise ? await next : next;
    connector.update(uuid, value);
  };

  return [read, write] as const;
}

/* ============================================================
 * Connector
 * ============================================================ */

interface CallbackEntry {
  uuid: UUID;
  refCount: number;
}

export interface ConnectorInterface {
  addTopic(uuid: UUID): void;
  removeTopic(uuid: UUID): void;

  registerClbk<T>(uuid: UUID, cb: (value: T) => void): void;
  removeClbk<T>(uuid: UUID, cb: (value: T) => void): void;

  update<T>(uuid: UUID, value: T): void;
  getUuidByClbk<T>(cb: (value: T) => void): UUID;
}

class Connector implements ConnectorInterface {
  // uuid → listeners
  private topics = new Map<UUID, Set<(value: any) => void>>();

  // callback → { uuid, refCount }
  private callbackMap = new Map<(value: any) => void, CallbackEntry>();

  public addTopic(uuid: UUID): void {
    this.topics.set(uuid, new Set());
  }

  public removeTopic(uuid: UUID): void {
    const listeners = this.topics.get(uuid);
    if (listeners) {
      for (const cb of listeners) {
        this.callbackMap.delete(cb);
      }
    }
    this.topics.delete(uuid);
  }

  public registerClbk<T>(uuid: UUID, cb: (value: T) => void): void {
    const listeners = this.topics.get(uuid);
    if (!listeners) {
      throw new Error(`Connector: unknown topic ${uuid}`);
    }

    const existing = this.callbackMap.get(cb as any);
    if (existing) {
      existing.refCount++;
      return;
    }

    listeners.add(cb as any);
    this.callbackMap.set(cb as any, {
      uuid,
      refCount: 1,
    });
  }

  public removeClbk<T>(uuid: UUID, cb: (value: T) => void): void {
    const entry = this.callbackMap.get(cb as any);
    if (!entry) return;

    entry.refCount--;
    if (entry.refCount > 0) return;

    const listeners = this.topics.get(entry.uuid);
    listeners?.delete(cb as any);

    this.callbackMap.delete(cb as any);
  }

  public update<T>(uuid: UUID, value: T): void {
    const listeners = this.topics.get(uuid);
    if (!listeners) return;

    for (const listener of listeners) {
      listener(value);
    }
  }

  public getUuidByClbk<T>(cb: (value: T) => void): UUID {
    const entry = this.callbackMap.get(cb as any);
    if (!entry) {
      throw new Error("Connector: no UUID for callback");
    }
    return entry.uuid;
  }
}

export const connector = new Connector();
