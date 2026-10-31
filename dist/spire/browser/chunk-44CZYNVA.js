import {
  DemoLimitsService
} from "./chunk-YXKJBH3A.js";
import {
  AuthService
} from "./chunk-JPZDBAQQ.js";
import {
  Router
} from "./chunk-WZAKLMWR.js";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BHZ7HWLX.js";

// src/app/core/guard/demo-super-admin.guard.ts
var DemoSuperAdminGuard = class _DemoSuperAdminGuard {
  constructor(authService, demoLimitsService, router) {
    this.authService = authService;
    this.demoLimitsService = demoLimitsService;
    this.router = router;
  }
  canActivate() {
    if (!this.demoLimitsService.isDemoModeActive() || this.demoLimitsService.isSuperAdminRole(this.authService.currentUserValue?.roles)) {
      return true;
    }
    return this.router.createUrlTree(["/profile"]);
  }
  static {
    this.\u0275fac = function DemoSuperAdminGuard_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DemoSuperAdminGuard)(\u0275\u0275inject(AuthService), \u0275\u0275inject(DemoLimitsService), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DemoSuperAdminGuard, factory: _DemoSuperAdminGuard.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoSuperAdminGuard, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: AuthService }, { type: DemoLimitsService }, { type: Router }], null);
})();

export {
  DemoSuperAdminGuard
};
//# sourceMappingURL=chunk-44CZYNVA.js.map
