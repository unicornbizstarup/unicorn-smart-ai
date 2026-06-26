/**
 * inject-polyfill.js — esbuild --inject file
 * This is injected at the TOP of every module via esbuild's --inject flag,
 * which runs BEFORE any module's top-level code including React 19.
 */

// MessageChannel polyfill for Cloudflare Workers
if (typeof globalThis.MessageChannel === "undefined") {
  var _MockPort = (function () {
    function MockPort() {
      this.onmessage = null;
      this.onmessageerror = null;
      this._other = null;
      this._listeners = [];
    }
    MockPort.prototype.dispatchEvent = function (ev) {
      for (var i = 0; i < this._listeners.length; i++) {
        this._listeners[i](ev);
      }
    };
    MockPort.prototype.addEventListener = function (type, fn) {
      if (type === "message") this._listeners.push(fn);
    };
    MockPort.prototype.removeEventListener = function (type, fn) {
      this._listeners = this._listeners.filter(function (l) { return l !== fn; });
    };
    MockPort.prototype._setOther = function (p) { this._other = p; };
    MockPort.prototype.postMessage = function (data) {
      if (this._other) {
        var ev = { type: "message", data: data };
        this._other.dispatchEvent(ev);
        if (this._other.onmessage) this._other.onmessage(ev);
      }
    };
    MockPort.prototype.start = function () {};
    MockPort.prototype.close = function () {};
    return MockPort;
  })();

  globalThis.MessageChannel = function MockMessageChannel() {
    this.port1 = new _MockPort();
    this.port2 = new _MockPort();
    this.port1._setOther(this.port2);
    this.port2._setOther(this.port1);
  };
}
