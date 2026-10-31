import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BHZ7HWLX.js";

// src/app/config/config.service.ts
var ConfigService = class _ConfigService {
  constructor() {
    this.setConfigData();
  }
  setConfigData() {
    this.configData = {
      layout: {
        rtl: false,
        // options: true & false
        variant: "light",
        // options: light & dark
        theme_color: "white",
        // options: white, black, purple, blue, cyan, green, orange
        logo_bg_color: "white",
        // options: white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false,
          // options: true & false
          backgroundColor: "light"
          // options: light & dark
        }
      }
    };
  }
  static {
    this.\u0275fac = function ConfigService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ConfigService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ConfigService, factory: _ConfigService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  ConfigService
};
//# sourceMappingURL=chunk-7W2J6P5T.js.map
