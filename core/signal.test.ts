// signal.test.ts
import { describe, it, expect } from "bun:test";
import { signal, connector } from "./signal";

describe("signal.ts", () => {
  it("returns the initial value on read", () => {
    const [read] = signal(1);

    expect(read()).toBe(1);
  });

  it("updates value synchronously via write", async () => {
    const [read, write] = signal(1);

    await write((prev) => prev + 1);

    expect(read()).toBe(2);
  });

  it("updates value asynchronously via write", async () => {
    const [read, write] = signal(1);

    await write(async (prev) => {
      await new Promise((r) => setTimeout(r, 5));
      return prev + 2;
    });

    expect(read()).toBe(3);
  });

  it("allows multiple listeners on the same signal", async () => {
    const [read, write] = signal(0);

    const a: number[] = [];
    const b: number[] = [];

    read((v) => a.push(v));
    read((v) => b.push(v));

    await write((v) => v + 1);

    expect(a).toEqual([0, 1]);
    expect(b).toEqual([0, 1]);
  });

  it("notifies all listeners on every update", async () => {
    const [read, write] = signal(0);

    const values: number[] = [];
    read((v) => values.push(v));

    await write((v) => v + 1);
    await write((v) => v + 1);

    expect(values).toEqual([0, 1, 2]);
  });

  it("stops notifying a removed listener", async () => {
    const [read, write] = signal(0);

    const values: number[] = [];
    const cb = (v: number) => values.push(v);

    read(cb);

    const uuid = connector.getUuidByClbk(cb);
    connector.removeClbk(uuid, cb);

    await write((v) => v + 1);

    expect(values).toEqual([0]);
  });

  it("supports many listeners without leaking", async () => {
    const [read, write] = signal(0);

    const callbacks = Array.from({ length: 10 }, () => {
      const calls: number[] = [];
      read((v) => calls.push(v));
      return calls;
    });

    await write((v) => v + 1);

    for (const calls of callbacks) {
      expect(calls).toEqual([0, 1]);
    }
  });

  it("allows removing the entire topic", async () => {
    const [read, write] = signal(0);

    let calls = 0;
    const cb = (_: number) => calls++;

    read(cb);

    const uuid = connector.getUuidByClbk(cb);
    connector.removeTopic(uuid);

    await write((v) => v + 1);
    await write((v) => v + 1);

    // only initial call
    expect(calls).toBe(1);
  });

  it("does not leak callbacks after topic removal", () => {
    const [read] = signal(0);

    const cb = (_: number) => {};
    read(cb);

    const uuid = connector.getUuidByClbk(cb);
    connector.removeTopic(uuid);

    expect(() => connector.getUuidByClbk(cb)).toThrow();
  });
});
