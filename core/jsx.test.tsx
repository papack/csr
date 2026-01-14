// jsx.test.tsx
import { describe, it, expect } from "bun:test";
import { jsx } from "./jsx";
import { signal } from "./signal";

describe("jsx.ts", () => {
  it("creates an element node from JSX", () => {
    const node = <div id="root">hello</div>;

    expect(node.kind).toBe("element");
    expect(node.tag).toBe("div");
    expect(node.props.id).toBe("root");
    expect(node.children).toEqual([{ kind: "text", value: "hello" }]);
  });

  it("supports multiple JSX children", () => {
    const node = (
      <div>
        <span>a</span>
        <span>b</span>
      </div>
    );

    expect(node.children.length).toBe(2);
    expect(node.children[0].tag).toBe("span");
    expect(node.children[1].tag).toBe("span");
  });

  it("flattens JSX fragments and arrays", () => {
    const node = <div>{["a", ["b", "c"]]}</div>;

    expect(node.children.map((c: any) => c.value)).toEqual(["a", "b", "c"]);
  });

  it("ignores null, undefined and boolean JSX children", () => {
    const node = (
      <div>
        {null}
        {false}
        {true}
        ok
      </div>
    );

    expect(node.children).toEqual([{ kind: "text", value: "ok" }]);
  });

  it("wraps signals passed via JSX expressions without evaluating them", () => {
    const [read] = signal("value");

    const node = <div>{read}</div>;

    expect(node.children.length).toBe(1);
    expect(node.children[0].kind).toBe("signal");
    expect((node.children[0] as any).read).toBe(read);
  });

  it("does not execute component functions during JSX creation", () => {
    let called = false;

    const Comp = () => {
      called = true;
      return <div />;
    };

    const node = <Comp />;

    expect(called).toBe(false);
    expect(node.kind).toBe("element");
    expect(node.tag).toBe(Comp);
  });

  it("preserves props exactly as provided in JSX", () => {
    const [read] = signal(1);

    const node = <input value={read} disabled />;

    expect(node.props.value).toBe(read);
    expect(node.props.disabled).toBe(true);
  });

  it("produces a stable AST from nested JSX", () => {
    const node = (
      <div class="a">
        <span>x</span>
        <span>y</span>
      </div>
    );

    expect(node).toEqual({
      kind: "element",
      tag: "div",
      props: { class: "a" },
      children: [
        {
          kind: "element",
          tag: "span",
          props: {},
          children: [{ kind: "text", value: "x" }],
        },
        {
          kind: "element",
          tag: "span",
          props: {},
          children: [{ kind: "text", value: "y" }],
        },
      ],
    });
  });
});
