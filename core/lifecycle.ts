// lifecycle.ts
// Synchronous render lifecycle with async-tolerant mount/unmount callbacks

export type MountCallback = (el: Element) => void | Promise<void>;
export type UnmountCallback = () => void | Promise<void>;

interface Session {
  mounts: MountCallback[];
  unmounts: UnmountCallback[];
}

const sessionStack: Session[] = [];

export function hasActiveMountSession(): boolean {
  return sessionStack.length > 0;
}

export function beginMountSession(): void {
  sessionStack.push({
    mounts: [],
    unmounts: [],
  });
}

export function endMountSession(root: Element): void {
  const session = sessionStack.pop();
  if (!session) {
    throw new Error("endMountSession called without active mount session");
  }

  // fire-and-forget mount callbacks
  for (const cb of session.mounts) {
    try {
      const r = cb(root);
      if (r instanceof Promise) {
        r.catch((err) => console.error("async mount callback failed", err));
      }
    } catch (err) {
      console.error("mount callback failed", err);
    }
  }

  if (session.unmounts.length > 0) {
    const store = (root as any).__unmountCbs as UnmountCallback[] | undefined;
    if (store) {
      store.push(...session.unmounts);
    } else {
      (root as any).__unmountCbs = [...session.unmounts];
    }
  }
}

export function mount(cb: MountCallback): void {
  const session = sessionStack[sessionStack.length - 1];
  if (!session) {
    throw new Error("mount(cb) called outside of a render session");
  }
  session.mounts.push(cb);
}

export function unmount(cb: UnmountCallback): void {
  const session = sessionStack[sessionStack.length - 1];
  if (!session) {
    throw new Error("unmount(cb) called outside of a render session");
  }
  session.unmounts.push(cb);
}

export function runUnmountsForElement(el: Element): void {
  const list = (el as any).__unmountCbs as UnmountCallback[] | undefined;
  if (!list || list.length === 0) return;

  for (let i = list.length - 1; i >= 0; i--) {
    try {
      const r = list[i]!();
      if (r instanceof Promise) {
        r.catch((err) => console.error("async unmount callback failed", err));
      }
    } catch (err) {
      console.error("unmount callback failed", err);
    }
  }

  (el as any).__unmountCbs = undefined;
}
