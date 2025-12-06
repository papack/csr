import type { ReadFn } from "./signal";

export async function effect<T>(
  readFn: ReadFn<T>,
  fn: (value: T) => Promise<unknown> | unknown
): Promise<void> {
  let hooks = new Set<(result: unknown) => void>();
  let result: unknown;

  //first call, run fn AND register (register == provide clbk)
  await readFn(async (v) => {
    result = await fn(v as T);
    for (const hook of hooks) {
      hook(result);
    }
  });
}
