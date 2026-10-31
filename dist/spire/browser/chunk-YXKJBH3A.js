import {
  environment
} from "./chunk-ITHPGOKL.js";
import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-BHZ7HWLX.js";

// src/app/config/demo-limits.config.ts
var DEMO_LIMITS_CONFIG = {
  maxEmployeesPerOrganization: 10,
  maxDemographicsPerOrganization: 6,
  maxClimatesPerOrganization: 1,
  maxQuestionsPerClimate: 10,
  maxComposeEmailsPerSession: 5,
  maxPerformanceModelsPerOrganization: 1,
  maxPerformanceDimensionsPerModel: 3,
  maxPerformanceCriteriaPerDimension: 2,
  maxPerformanceItemsPerCriterion: 3
};
var DEMO_LIMITS_SESSION_KEYS = {
  composeEmailsSent: "demo.compose.emails.sent"
};

// src/app/config/demo-limits.service.ts
var DemoLimitsService = class _DemoLimitsService {
  constructor() {
    this.limits = DEMO_LIMITS_CONFIG;
  }
  isDemoBuildEnabled() {
    return !!environment.demo?.enabled;
  }
  isDemoModeActive() {
    return this.isDemoBuildEnabled();
  }
  isSuperAdminRole(roles) {
    return (roles ?? []).some(({ roleName }) => {
      const normalizedRole = String(roleName ?? "").trim().toUpperCase().replace(/[\s_-]+/g, "");
      return normalizedRole === "ADMIN" || normalizedRole === "SUPERADMIN";
    });
  }
  getLimit(key) {
    return this.limits[key];
  }
  exceedsLimit(key, currentCount, incomingCount = 1) {
    if (!this.isDemoModeActive()) {
      return false;
    }
    return currentCount + incomingCount > this.getLimit(key);
  }
  getRemaining(key, currentCount) {
    if (!this.isDemoModeActive()) {
      return Number.MAX_SAFE_INTEGER;
    }
    return Math.max(this.getLimit(key) - currentCount, 0);
  }
  getComposeEmailsSentCount() {
    if (!this.isDemoModeActive()) {
      return 0;
    }
    const rawValue = sessionStorage.getItem(DEMO_LIMITS_SESSION_KEYS.composeEmailsSent);
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }
  getComposeEmailsRemainingCount() {
    if (!this.isDemoModeActive()) {
      return Number.MAX_SAFE_INTEGER;
    }
    return Math.max(this.getLimit("maxComposeEmailsPerSession") - this.getComposeEmailsSentCount(), 0);
  }
  canConsumeComposeEmails(requestedCount) {
    const normalizedRequested = Math.max(0, Math.floor(requestedCount));
    if (!this.isDemoModeActive()) {
      return {
        allowed: true,
        limit: this.getLimit("maxComposeEmailsPerSession"),
        used: 0,
        remaining: Number.MAX_SAFE_INTEGER,
        requested: normalizedRequested
      };
    }
    const limit = this.getLimit("maxComposeEmailsPerSession");
    const used = this.getComposeEmailsSentCount();
    const remaining = Math.max(limit - used, 0);
    return {
      allowed: normalizedRequested <= remaining,
      limit,
      used,
      remaining,
      requested: normalizedRequested
    };
  }
  registerComposeEmailsSent(sentCount) {
    if (!this.isDemoModeActive()) {
      return;
    }
    const normalizedCount = Math.max(0, Math.floor(sentCount));
    if (!normalizedCount) {
      return;
    }
    const nextCount = this.getComposeEmailsSentCount() + normalizedCount;
    sessionStorage.setItem(DEMO_LIMITS_SESSION_KEYS.composeEmailsSent, String(nextCount));
  }
  static {
    this.\u0275fac = function DemoLimitsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DemoLimitsService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DemoLimitsService, factory: _DemoLimitsService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DemoLimitsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  DemoLimitsService
};
//# sourceMappingURL=chunk-YXKJBH3A.js.map
