import { connector } from "./connector";
import { unmount } from "./unmount";

export type ReadFn<T> = ((
  cb?: (value: unknown) => Promise<void>
) => Promise<T>) & {
  type: "signal";
};

export function signal<T>(value: T) {
  const uuid = crypto.randomUUID();
  connector.addTopic(uuid);

  unmount(() => {
    connector.removeTopic(uuid);
  });

  const read: ReadFn<T> = async (cb?: (v: unknown) => Promise<void>) => {
    if (cb) {
      connector.registerClbk(uuid, cb);
      unmount(() => {
        connector.removeClbk(uuid, cb);
      });
      await cb(value);
    }
    return value;
  };
  read.type = "signal";

  const write = async (cb: (prev: T) => T) => {
    //get new value
    const next: T = cb(value);
    value = next;

    //update signals
    if (connector) {
      connector.update(uuid, next);
    }
  };

  return [read, write] as const;
}
