/**
 * polyfill.ts — Must be its own module (separate import)
 * so esbuild places this code BEFORE React's module initialization.
 *
 * In ESM, imported modules with no dependencies run their top-level
 * code first (depth-first evaluation). By making this a separate file
 * imported before the server bundle, we guarantee MessageChannel
 * is set before React 19's scheduler tries to use it.
 */

// MessageChannel is part of the Web Workers API spec but may not be
// available in some Cloudflare Workers environments.
if (typeof globalThis.MessageChannel === "undefined") {
  class MockMessagePort extends EventTarget {
    onmessage: ((ev: MessageEvent) => unknown) | null = null;
    onmessageerror: ((ev: MessageEvent) => unknown) | null = null;
    _other: MockMessagePort | null = null;

    _setOther(p: MockMessagePort) {
      this._other = p;
    }
    postMessage(data: unknown) {
      if (this._other) {
        const ev = new MessageEvent("message", { data });
        this._other.dispatchEvent(ev);
        if (this._other.onmessage) this._other.onmessage(ev);
      }
    }
    start() {}
    close() {}
  }

  class MockMessageChannel {
    port1: MockMessagePort;
    port2: MockMessagePort;
    constructor() {
      this.port1 = new MockMessagePort();
      this.port2 = new MockMessagePort();
      this.port1._setOther(this.port2);
      this.port2._setOther(this.port1);
    }
  }

  // @ts-ignore
  globalThis.MessageChannel = MockMessageChannel;
  // @ts-ignore
  globalThis.MessagePort = MockMessagePort;
}
