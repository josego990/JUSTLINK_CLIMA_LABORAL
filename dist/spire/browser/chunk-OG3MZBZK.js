import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BHZ7HWLX.js";

// src/app/shared/sub-sink.ts
var SubSink = class {
  /**
   * Subscription sink that holds Observable subscriptions
   * until you call unsubscribe on it in ngOnDestroy.
   *
   * @example
   * In Angular:
   * ```
   *   private subs = new SubSink();
   *   ...
   *   this.subs.sink = observable$.subscribe(
   *   this.subs.add(observable$.subscribe(...));
   *   ...
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   * ```
   */
  constructor() {
    this._subs = [];
  }
  /**
   * Add subscriptions to the tracked subscriptions
   * @example
   *  this.subs.add(observable$.subscribe(...));
   */
  add(...subscriptions) {
    this._subs = this._subs.concat(subscriptions);
  }
  /**
   * Assign subscription to this sink to add it to the tracked subscriptions
   * @example
   *  this.subs.sink = observable$.subscribe(...);
   */
  set sink(subscription) {
    this._subs.push(subscription);
  }
  /**
   * Unsubscribe to all subscriptions in ngOnDestroy()
   * @example
   *   ngOnDestroy() {
   *     this.subs.unsubscribe();
   *   }
   */
  unsubscribe() {
    this._subs.forEach((sub) => sub && sub.unsubscribe());
    this._subs = [];
  }
};

// src/app/shared/UnsubscribeOnDestroyAdapter.ts
var UnsubscribeOnDestroyAdapter = class _UnsubscribeOnDestroyAdapter {
  constructor() {
    this.subs = new SubSink();
  }
  /**
   * The lifecycle hook that unsubscribes all subscriptions when the component / object gets destroyed
   */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  static {
    this.\u0275fac = function UnsubscribeOnDestroyAdapter_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _UnsubscribeOnDestroyAdapter)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UnsubscribeOnDestroyAdapter, factory: _UnsubscribeOnDestroyAdapter.\u0275fac });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UnsubscribeOnDestroyAdapter, [{
    type: Injectable
  }], null, null);
})();

export {
  UnsubscribeOnDestroyAdapter
};
//# sourceMappingURL=chunk-OG3MZBZK.js.map
