//mount.ts
export type MountCallback = (el: Element) => void | Promise<void>;
export type UnmountCallback = () => void | Promise<void>;

// Stack of mount/unmount callback queues per component render
const mountStack: MountCallback[][] = [];
const unmountStack: UnmountCallback[][] = [];

export function hasActiveMountSession(): boolean {
  return mountStack.length > 0;
}

// Called by the renderer before a component function is executed.
// Initializes a new mount/unmount session for that component.
export function beginComponentMountSession(): void {
  mountStack.push([]);
  unmountStack.push([]);
}

// Called by the renderer once the component's DOM root element is known.
// - Executes all registered mount callbacks
// - Attaches all unmount callbacks to the root element
export function endComponentMountSession(el: Element): void {
  const mounts = mountStack.pop();
  const unmounts = unmountStack.pop();

  if (!mounts || !unmounts) return;

  // Execute mount callbacks (fire-and-forget)
  for (const cb of mounts) {
    try {
      const r = cb(el);
      if (r instanceof Promise) {
        r.catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Store unmount callbacks on the element (DOM-first lifecycle)
  if (unmounts.length > 0) {
    const store = (el as any).__unmountCbs as UnmountCallback[] | undefined;
    if (store && Array.isArray(store)) {
      store.push(...unmounts);
    } else {
      (el as any).__unmountCbs = [...unmounts];
    }
  }
}

//Used inside components to register an on-mount callback.
export function mount(cb: MountCallback): void {
  const queue = mountStack[mountStack.length - 1];
  if (!queue) {
    throw new Error("mount(cb) was called outside of a component.");
  }
  queue.push(cb);
}

// Used internally to register cleanup logic for the current component session.
export function registerUnmount(cb: UnmountCallback): void {
  const queue = unmountStack[unmountStack.length - 1];
  if (!queue) {
    throw new Error("unmount(cb) was called outside of a component.");
  }
  queue.push(cb);
}

// Used by the destroy() path:
// Executes all unmount callbacks registered on the element (LIFO order).
export async function runUnmountsForElement(el: Element): Promise<void> {
  const list = (el as any).__unmountCbs as UnmountCallback[] | undefined;
  if (!list || list.length === 0) return;

  for (let i = list.length - 1; i >= 0; i--) {
    const fn = list[i];
    if (!fn) continue;
    try {
      const r = fn();
      if (r instanceof Promise) {
        await r;
      }
    } catch (err) {
      console.error(err);
    }
  }

  (el as any).__unmountCbs = undefined;
}
