import type { ReadFn } from "./signal";

export async function effect<T>(
  readFn: ReadFn<T>,
  fn: (value: T) => Promise<unknown> | unknown
): Promise<void> {
  //call, run fn AND register (register == provide clbk)
  await readFn(async (v) => {
    await fn(v as T);
  });
}
