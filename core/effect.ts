import type { ReadFn } from "./signal";

export type EffectHookType = (result: unknown) => void;
export type EffectFn<T> = {
  type: "effect";
  readFn: ReadFn<T>;
  addHook: (hook: EffectHookType) => void;
  removeHook: (hook: EffectHookType) => void;
  result: unknown;
};

export async function effect<T>(
  readFn: ReadFn<T>,
  fn: (value: T) => Promise<unknown>
): Promise<{
  type: "effect";
  readFn: ReadFn<T>;
  result: unknown;
  addHook: (hook: EffectHookType) => void;
  removeHook: (hook: EffectHookType) => void;
}> {
  let hooks = new Set<(result: unknown) => void>();
  let result: unknown;

  //first call, run fn AND register (register == provide clbk)
  await readFn(async (v) => {
    result = await fn(v as T);
    for (const hook of hooks) {
      hook(result);
    }
  });

  //use to add a hook for eg. dom updates in h.ts
  const addHook = (hook: EffectHookType) => {
    hooks.add(hook);
  };

  //use to remove a hook eg. when unmount
  const removeHook = (hook: EffectHookType) => {
    if (hooks.has(hook) === false) return;
    hooks.delete(hook);
  };

  //return to use in h fn
  return { type: "effect", readFn, result, addHook, removeHook } as EffectFn<T>;
}
