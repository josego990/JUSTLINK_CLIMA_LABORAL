import {
  TranslateService
} from "./chunk-J7XWAFEK.js";
import {
  OrganizacionService,
  axios_default
} from "./chunk-ITHPGOKL.js";
import {
  Router
} from "./chunk-WZAKLMWR.js";
import {
  BehaviorSubject,
  Injectable,
  Subject,
  catchError,
  from,
  map,
  of,
  setClassMetadata,
  tap,
  throwError,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-BHZ7HWLX.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-IIGRIO22.js";

// src/app/core/service/auth.service.ts
var AuthService = class _AuthService {
  static {
    this.axiosInterceptorsConfigured = false;
  }
  constructor(organizationService, router) {
    this.organizationService = organizationService;
    this.router = router;
    this.tokenExpirationTimerId = null;
    this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem("currentUser") || "null"));
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.syncAxiosAuthorizationHeader();
    this.configureAxiosInterceptors();
    this.scheduleTokenExpirationRedirect();
  }
  get currentUserValue() {
    return this.currentUserSubject.value;
  }
  /**
   * Llama al endpoint de login y actualiza el estado interno.
   * Retorna un Observable<User> con el objeto de sesión.
   */
  login(user, pass) {
    return from(this.organizationService.login({ user, pass })).pipe(map((response) => this.normalizeLoginUser(response)), tap((userData) => {
      if (userData.isValid && userData.token && !this.isTokenExpired(userData.token)) {
        localStorage.setItem("currentUser", JSON.stringify(userData));
        this.currentUserSubject.next(userData);
        this.syncAxiosAuthorizationHeader();
        this.scheduleTokenExpirationRedirect();
      } else {
        this.clearCurrentUser();
      }
    }), catchError((err) => {
      this.clearCurrentUser();
      return throwError(() => err?.response?.data?.message || err?.message || "Login failed");
    }));
  }
  /**
   * Limpia el estado del usuario en memoria y storage.
   */
  clearCurrentUser() {
    this.clearTokenExpirationTimer();
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("routes");
    delete axios_default.defaults.headers.common["Authorization"];
    this.currentUserSubject.next(null);
  }
  /**
   * Termina la sesión del usuario.
   */
  logout() {
    this.clearCurrentUser();
    return of({ success: true });
  }
  logoutAndRedirect() {
    this.clearCurrentUser();
    this.router.navigate(["/authentication/signin"]);
  }
  isAuthenticated() {
    const currentUser = this.currentUserValue;
    return !!currentUser?.token && !this.isTokenExpired(currentUser.token);
  }
  isTokenExpired(token) {
    if (!token) {
      return true;
    }
    const payload = this.decodeJwtPayload(token);
    if (!payload) {
      return true;
    }
    if (!payload.exp) {
      return false;
    }
    return Date.now() >= payload.exp * 1e3;
  }
  configureAxiosInterceptors() {
    if (_AuthService.axiosInterceptorsConfigured) {
      return;
    }
    axios_default.interceptors.request.use((config) => {
      const token = this.currentUserValue?.token;
      if (!token) {
        return config;
      }
      if (this.isTokenExpired(token)) {
        this.logoutAndRedirect();
        return Promise.reject(new Error("SESSION_EXPIRED"));
      }
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    });
    axios_default.interceptors.response.use((response) => response, (error) => {
      if (error.response?.status === 401) {
        this.logoutAndRedirect();
      }
      return Promise.reject(error);
    });
    _AuthService.axiosInterceptorsConfigured = true;
  }
  syncAxiosAuthorizationHeader() {
    const token = this.currentUserValue?.token;
    if (token && !this.isTokenExpired(token)) {
      axios_default.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return;
    }
    delete axios_default.defaults.headers.common["Authorization"];
  }
  scheduleTokenExpirationRedirect() {
    this.clearTokenExpirationTimer();
    const token = this.currentUserValue?.token;
    const payload = token ? this.decodeJwtPayload(token) : null;
    if (!payload?.exp) {
      return;
    }
    const millisecondsUntilExpiration = payload.exp * 1e3 - Date.now();
    if (millisecondsUntilExpiration <= 0) {
      this.logoutAndRedirect();
      return;
    }
    const maxTimeout = 2147483647;
    this.tokenExpirationTimerId = setTimeout(() => {
      if (millisecondsUntilExpiration > maxTimeout) {
        this.scheduleTokenExpirationRedirect();
        return;
      }
      this.logoutAndRedirect();
    }, Math.min(millisecondsUntilExpiration, maxTimeout));
  }
  clearTokenExpirationTimer() {
    if (!this.tokenExpirationTimerId) {
      return;
    }
    clearTimeout(this.tokenExpirationTimerId);
    this.tokenExpirationTimerId = null;
  }
  normalizeLoginUser(response) {
    const responseBody = response?.data ?? response;
    const data = responseBody?.data ?? responseBody;
    const userData = data?.user ?? data?.usuario ?? data;
    const token = this.extractToken(responseBody, data, userData);
    const normalizedUser = __spreadProps(__spreadValues({}, userData), {
      token
    });
    if (normalizedUser.isValid && (!normalizedUser.token || this.isTokenExpired(normalizedUser.token))) {
      normalizedUser.isValid = false;
    }
    return normalizedUser;
  }
  extractToken(...sources) {
    for (const source of sources) {
      const token = source?.token ?? source?.jwt ?? source?.jwtToken ?? source?.accessToken ?? source?.access_token ?? source?.idToken ?? source?.Token ?? source?.JWT;
      if (typeof token === "string" && token.trim()) {
        return token.trim();
      }
    }
    return "";
  }
  decodeJwtPayload(token) {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }
    try {
      const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
      const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4, "=");
      const decodedPayload = atob(paddedPayload);
      const jsonPayload = decodeURIComponent(decodedPayload.split("").map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
  static {
    this.\u0275fac = function AuthService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AuthService)(\u0275\u0275inject(OrganizacionService), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: OrganizacionService }, { type: Router }], null);
})();

// src/app/core/service/direction.service.ts
var DirectionService = class _DirectionService {
  constructor() {
    this.data = new BehaviorSubject("");
    this.currentData = this.data.asObservable();
  }
  updateDirection(item) {
    this.data.next(item);
  }
  static {
    this.\u0275fac = function DirectionService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DirectionService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DirectionService, factory: _DirectionService.\u0275fac });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DirectionService, [{
    type: Injectable
  }], () => [], null);
})();

// src/app/core/service/language.service.ts
var LanguageService = class _LanguageService {
  constructor(translate) {
    this.translate = translate;
    this.languages = ["en", "es", "de"];
    this.languageChangeSubject = new Subject();
    let browserLang;
    translate.addLangs(this.languages);
    if (localStorage.getItem("lang")) {
      browserLang = localStorage.getItem("lang");
    } else {
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|es|de/) ? browserLang : "en");
  }
  setLanguage(lang) {
    this.translate.use(lang);
    localStorage.setItem("lang", lang);
    this.languageChangeSubject.next(lang);
  }
  //jjg
  getLanguageChangeSubject() {
    return this.languageChangeSubject.asObservable();
  }
  static {
    this.\u0275fac = function LanguageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LanguageService)(\u0275\u0275inject(TranslateService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LanguageService, factory: _LanguageService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LanguageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: TranslateService }], null);
})();

// src/app/core/service/rightsidebar.service.ts
var RightSidebarService = class _RightSidebarService {
  constructor() {
    this.sidebarSubject = new BehaviorSubject(false);
    this.sidebarState = this.sidebarSubject.asObservable();
    this.setRightSidebar = (value) => {
      this.sidebarSubject.next(value);
    };
  }
  static {
    this.\u0275fac = function RightSidebarService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RightSidebarService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RightSidebarService, factory: _RightSidebarService.\u0275fac });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RightSidebarService, [{
    type: Injectable
  }], () => [], null);
})();

export {
  AuthService,
  DirectionService,
  LanguageService,
  RightSidebarService
};
//# sourceMappingURL=chunk-JPZDBAQQ.js.map
