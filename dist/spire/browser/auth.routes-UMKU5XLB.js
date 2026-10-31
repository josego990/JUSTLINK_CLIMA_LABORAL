import {
  Page404Component
} from "./chunk-FJ7P6D5J.js";
import "./chunk-CAQCEW54.js";
import {
  UnsubscribeOnDestroyAdapter
} from "./chunk-OG3MZBZK.js";
import "./chunk-PTBHIFLI.js";
import "./chunk-PO3BZ2ER.js";
import "./chunk-75G4SHEF.js";
import {
  require_sweetalert2_all
} from "./chunk-IOETN73U.js";
import {
  AuthService,
  LanguageService
} from "./chunk-JPZDBAQQ.js";
import {
  TranslateModule,
  TranslatePipe,
  TranslateService
} from "./chunk-J7XWAFEK.js";
import {
  OrganizacionService,
  environment
} from "./chunk-ITHPGOKL.js";
import "./chunk-Y2ZBDXTZ.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  ReactiveFormsModule,
  RequiredValidator,
  UntypedFormBuilder,
  Validators,
  ɵNgNoValidate
} from "./chunk-76BSNCUT.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-6OUKOU55.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import {
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/authentication/signin/signin.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
var _c0 = ["turnstileContainer"];
function SigninComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.LOGIN.USERNAMEREQUIRED"), " ");
  }
}
function SigninComponent_Conditional_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.LOGIN.PASSWORDREQUIRED"), " ");
  }
}
function SigninComponent_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error);
  }
}
function SigninComponent_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.LOGIN.TURNSTILE_CONFIG_REQUIRED"), " ");
  }
}
function SigninComponent_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.LOGIN.TURNSTILE_LOAD_ERROR"), " ");
  }
}
function SigninComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.LOGIN.TURNSTILE_REQUIRED"), " ");
  }
}
var SigninComponent = class _SigninComponent extends UnsubscribeOnDestroyAdapter {
  constructor(languageService, translate, organizationService, formBuilder, route, router, authService) {
    super();
    this.languageService = languageService;
    this.translate = translate;
    this.organizationService = organizationService;
    this.formBuilder = formBuilder;
    this.route = route;
    this.router = router;
    this.authService = authService;
    this.submitted = false;
    this.loading = false;
    this.error = "";
    this.hide = true;
    this.turnstileToken = "";
    this.turnstileTouched = false;
    this.turnstileLoadFailed = false;
    this.isDemoMode = environment.demo?.enabled ?? false;
    this.turnstileSiteKey = environment.turnstileSiteKey?.trim() ?? "";
    this.turnstileWidgetId = null;
    this.turnstileScriptId = "cloudflare-turnstile-script";
  }
  ngOnInit() {
    this.langStoreValue = localStorage.getItem("lang");
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((lang) => {
      this.translate.use(lang);
    });
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      //borrar en producción --josego
      password: ["", Validators.required]
      //borrar en producción --30749
    });
  }
  ngAfterViewInit() {
    this.initializeTurnstile();
  }
  get f() {
    return this.authForm.controls;
  }
  get isTurnstileConfigured() {
    return this.turnstileSiteKey.length > 0;
  }
  get canSubmit() {
    return this.authForm.valid && !this.loading && !!this.turnstileToken && this.isTurnstileConfigured;
  }
  onSubmit() {
    this.submitted = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username and Password not valid !";
      return;
    }
    if (!this.isTurnstileConfigured) {
      this.error = this.translate.instant("MENUITEMS.LOGIN.TURNSTILE_CONFIG_REQUIRED");
      return;
    }
    if (!this.turnstileToken) {
      this.turnstileTouched = true;
      this.error = this.translate.instant("MENUITEMS.LOGIN.TURNSTILE_REQUIRED");
      return;
    }
    this.loading = true;
    this.authService.login(this.f["username"].value, this.f["password"].value).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.isValid) {
          console.log("user v\xE1lido:: ", user);
          this.organizationService.getMenuAccess(user.roles[0].roleId).then((resultexx) => {
            sessionStorage.setItem("routes", JSON.stringify(resultexx.data ?? []));
            void this.router.navigate(["/profile"]);
          }).catch((error) => {
            console.error("No fue posible cargar el men\xFA del usuario:", error);
            sessionStorage.setItem("routes", JSON.stringify([]));
            void this.router.navigate(["/profile"]);
          });
        } else {
          this.resetTurnstile();
          this.error = "Invalid Login";
          import_sweetalert2.default.fire({
            title: this.translate.instant("MENUITEMS.LOGIN.INVALIDACCESS"),
            text: this.translate.instant("MENUITEMS.LOGIN.INVALIDACCESSMSG"),
            icon: "warning"
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.resetTurnstile();
      }
    });
  }
  ngOnDestroy() {
    this.removeTurnstile();
    super.ngOnDestroy();
  }
  initializeTurnstile() {
    if (!this.isTurnstileConfigured) {
      return;
    }
    this.loadTurnstileScript().then(() => this.renderTurnstile()).catch((error) => {
      console.error("No se pudo cargar Cloudflare Turnstile:", error);
      this.turnstileLoadFailed = true;
    });
  }
  loadTurnstileScript() {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      if (window.turnstile) {
        resolve();
        return;
      }
      const existingScript = document.getElementById(this.turnstileScriptId);
      if (existingScript) {
        this.waitForTurnstile(resolve, reject);
        return;
      }
      const script = document.createElement("script");
      script.id = this.turnstileScriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => this.waitForTurnstile(resolve, reject);
      script.onerror = () => reject(new Error("Turnstile script load failed"));
      document.head.appendChild(script);
    });
  }
  waitForTurnstile(resolve, reject) {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(intervalId);
        resolve();
        return;
      }
      attempts += 1;
      if (attempts >= 100) {
        window.clearInterval(intervalId);
        reject(new Error("Turnstile API not available"));
      }
    }, 100);
  }
  renderTurnstile() {
    if (!this.turnstileContainer?.nativeElement || !window.turnstile || this.turnstileWidgetId) {
      return;
    }
    this.turnstileLoadFailed = false;
    this.turnstileContainer.nativeElement.innerHTML = "";
    this.turnstileWidgetId = window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: this.turnstileSiteKey,
      theme: "light",
      callback: (token) => {
        this.turnstileToken = token;
        this.turnstileTouched = false;
        this.turnstileLoadFailed = false;
      },
      "expired-callback": () => {
        this.turnstileToken = "";
        this.turnstileTouched = true;
      },
      "error-callback": () => {
        this.turnstileToken = "";
        this.turnstileLoadFailed = true;
      }
    });
  }
  resetTurnstile() {
    this.turnstileToken = "";
    this.turnstileTouched = false;
    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
  }
  removeTurnstile() {
    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.remove(this.turnstileWidgetId);
      this.turnstileWidgetId = null;
    }
  }
  static {
    this.\u0275fac = function SigninComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SigninComponent)(\u0275\u0275directiveInject(LanguageService), \u0275\u0275directiveInject(TranslateService), \u0275\u0275directiveInject(OrganizacionService), \u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SigninComponent, selectors: [["app-signin"]], viewQuery: function SigninComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.turnstileContainer = _t.first);
      }
    }, features: [\u0275\u0275InheritDefinitionFeature], decls: 55, vars: 36, consts: [["turnstileContainer", ""], [1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/justlink-360-logo_background.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "welcome-msg", 2, "color", "#ff9629"], [1, "login-title"], [1, "validate-form", 3, "ngSubmit", "formGroup"], [1, "row"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], ["appearance", "outline", 1, "example-full-width"], ["matInput", "", "formControlName", "username"], ["matSuffix", "", 1, "material-icons-two-tone", "color-icon", "p-3"], [1, "col-xl-12col-lg-12", "col-md-12", "col-sm-12", "mb-2"], ["matInput", "", "formControlName", "password", 3, "type"], ["href", "#", "onClick", "return false;", "matSuffix", "", 3, "click"], ["matSuffix", "", 1, "material-icons-two-tone", "color-icon", "m-3"], [1, "alert", "alert-danger", "mt-3", "mb-0"], [1, "turnstile-wrapper"], [1, "turnstile-shell"], [1, "turnstile-host"], [1, "turnstile-help", "turnstile-help--warning"], [1, "turnstile-help", "turnstile-help--danger"], [1, "container-auth-form-btn"], [2, "text-align", "center"], ["mat-flat-button", "", "color", "accent", "type", "submit", 1, "auth-form-btn", 2, "background-color", "#002737", 3, "disabled"], [1, "social-login-title"], [2, "text-align", "center", "padding", "10px", "font-size", "14px", "color", "#555"], ["id", "anio"]], template: function SigninComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3);
        \u0275\u0275element(3, "div", 4);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 5)(5, "div", 6)(6, "div", 7)(7, "h6", 8);
        \u0275\u0275text(8);
        \u0275\u0275pipe(9, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "h2", 9);
        \u0275\u0275text(11);
        \u0275\u0275pipe(12, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "form", 10);
        \u0275\u0275listener("ngSubmit", function SigninComponent_Template_form_ngSubmit_13_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onSubmit());
        });
        \u0275\u0275elementStart(14, "div", 11)(15, "div", 12)(16, "mat-form-field", 13)(17, "mat-label");
        \u0275\u0275text(18);
        \u0275\u0275pipe(19, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275element(20, "input", 14);
        \u0275\u0275elementStart(21, "mat-icon", 15);
        \u0275\u0275text(22, "face");
        \u0275\u0275elementEnd();
        \u0275\u0275template(23, SigninComponent_Conditional_23_Template, 3, 3, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(24, "div", 11)(25, "div", 16)(26, "mat-form-field", 13)(27, "mat-label");
        \u0275\u0275text(28);
        \u0275\u0275pipe(29, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275element(30, "input", 17);
        \u0275\u0275elementStart(31, "a", 18);
        \u0275\u0275listener("click", function SigninComponent_Template_a_click_31_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.hide = !ctx.hide);
        });
        \u0275\u0275elementStart(32, "mat-icon", 19);
        \u0275\u0275text(33);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(34, SigninComponent_Conditional_34_Template, 3, 3, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(35, SigninComponent_Conditional_35_Template, 2, 1, "div", 20);
        \u0275\u0275elementStart(36, "div", 21)(37, "div", 22);
        \u0275\u0275element(38, "div", 23, 0);
        \u0275\u0275elementEnd();
        \u0275\u0275template(40, SigninComponent_Conditional_40_Template, 3, 3, "div", 24)(41, SigninComponent_Conditional_41_Template, 3, 3, "div", 25)(42, SigninComponent_Conditional_42_Template, 3, 3, "div", 25);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(43, "div", 26)(44, "div", 27)(45, "button", 28);
        \u0275\u0275text(46);
        \u0275\u0275pipe(47, "translate");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(48, "h6", 29);
        \u0275\u0275text(49, "v01.05.06");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "footer", 30);
        \u0275\u0275text(51, " \xA9 ");
        \u0275\u0275element(52, "span", 31);
        \u0275\u0275text(53);
        \u0275\u0275pipe(54, "translate");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        let tmp_5_0;
        let tmp_11_0;
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 24, ctx.isDemoMode ? "MENUITEMS.LOGIN.WELCOME_DEMO" : "MENUITEMS.LOGIN.WELCOME"), " ");
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 26, "MENUITEMS.LOGIN.ACCESS"));
        \u0275\u0275advance(2);
        \u0275\u0275property("formGroup", ctx.authForm);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 28, "MENUITEMS.LOGIN.USERNAME"));
        \u0275\u0275advance(5);
        \u0275\u0275conditional(((tmp_5_0 = ctx.authForm.get("username")) == null ? null : tmp_5_0.hasError("required")) ? 23 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 30, "MENUITEMS.LOGIN.PASSWORD"));
        \u0275\u0275advance(2);
        \u0275\u0275property("type", ctx.hide ? "password" : "text");
        \u0275\u0275advance();
        \u0275\u0275attribute("aria-label", "Hide password")("aria-pressed", ctx.hide);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.hide ? "visibility_off" : "visibility", "");
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_11_0 = ctx.authForm.get("password")) == null ? null : tmp_11_0.hasError("required")) ? 34 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.error ? 35 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("turnstile-shell--disabled", !ctx.isTurnstileConfigured);
        \u0275\u0275advance();
        \u0275\u0275classProp("turnstile-host--disabled", !ctx.isTurnstileConfigured);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx.isTurnstileConfigured ? 40 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.turnstileLoadFailed ? 41 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.turnstileTouched && !ctx.turnstileToken ? 42 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275classProp("auth-spinner", ctx.loading);
        \u0275\u0275property("disabled", !ctx.canSubmit);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(47, 32, "MENUITEMS.LOGIN.ACCESS"));
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate1(" Just-Link Guatemala. ", \u0275\u0275pipeBind1(54, 34, "MENUITEMS.LOGIN.ALLRIGHTS"), " ");
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, TranslateModule, TranslatePipe, ReactiveFormsModule, FormGroupDirective, FormControlName, MatFormFieldModule, MatFormField, MatLabel, MatError, MatSuffix, MatInputModule, MatInput, MatIconModule, MatIcon, MatButtonModule, MatButton], styles: ["\n\n.turnstile-wrapper[_ngcontent-%COMP%] {\n  margin: 1rem 0 1.25rem;\n  width: 100%;\n}\n.turnstile-shell[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 76px;\n  padding: 0.75rem 1rem;\n  border: 1px solid #d7dde8;\n  border-radius: 8px;\n  background: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.turnstile-shell--disabled[_ngcontent-%COMP%] {\n  padding: 0;\n  min-height: 0;\n  border: 0;\n  background: transparent;\n}\n.turnstile-host[_ngcontent-%COMP%] {\n  min-height: 65px;\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n.turnstile-host--disabled[_ngcontent-%COMP%] {\n  min-height: 0;\n}\n.turnstile-help[_ngcontent-%COMP%] {\n  margin-top: 0.5rem;\n  font-size: 0.875rem;\n}\n.turnstile-help--warning[_ngcontent-%COMP%] {\n  color: #b45309;\n}\n.turnstile-help--danger[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n/*# sourceMappingURL=signin.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SigninComponent, [{
    type: Component,
    args: [{ selector: "app-signin", imports: [
      FormsModule,
      TranslateModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule
    ], template: `<div class="auth-container">\r
  <div class="row auth-main">\r
    <div class="col-sm-6 px-0 d-none d-sm-block">\r
      <div class="left-img" style="background-image: url(assets/images/pages/justlink-360-logo_background.png);">\r
      </div>\r
    </div>\r
    <div class="col-sm-6 auth-form-section">\r
      <div class="form-section">\r
        <div class="auth-wrapper">\r
          <h6 style="color: #ff9629 " class="welcome-msg">\r
            {{ (isDemoMode ? 'MENUITEMS.LOGIN.WELCOME_DEMO' : 'MENUITEMS.LOGIN.WELCOME') | translate }}\r
          </h6>\r
          <!-- \r
          <p class="auth-signup-text text-muted">Necesitas una cuenta?<a routerLink="/authentication/signup"\r
              class="sign-up-link">Obtener una\r
            </a></p>\r
-->\r
          <h2 class="login-title">{{'MENUITEMS.LOGIN.ACCESS' | translate}}</h2>\r
          <form class="validate-form" [formGroup]="authForm" (ngSubmit)="onSubmit()">\r
            <div class="row">\r
              <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>{{'MENUITEMS.LOGIN.USERNAME' | translate}}</mat-label>\r
                  <input matInput formControlName="username" />\r
                  <mat-icon class="material-icons-two-tone color-icon p-3" matSuffix>face</mat-icon>\r
                  @if (authForm.get('username')?.hasError('required')) {\r
                  <mat-error>\r
                    {{'MENUITEMS.LOGIN.USERNAMEREQUIRED' | translate}}\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-xl-12col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>{{'MENUITEMS.LOGIN.PASSWORD' | translate}}</mat-label>\r
                  <input matInput [type]="hide ? 'password' : 'text'" formControlName="password">\r
                  <a href="#" onClick="return false;" matSuffix (click)="hide = !hide"\r
                    [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">\r
                    <mat-icon class="material-icons-two-tone color-icon m-3" matSuffix>\r
                      {{hide ? 'visibility_off' : 'visibility'}}</mat-icon>\r
                  </a>\r
                  @if (authForm.get('password')?.hasError('required')) {\r
                  <mat-error>\r
                    {{'MENUITEMS.LOGIN.PASSWORDREQUIRED' | translate}}\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
\r
             <!-- \r
            <div class="d-flex justify-content-between align-items-center mb-5">\r
              <div class="form-check">\r
                <label class="form-check-label">\r
                  <input class="form-check-input" type="checkbox" value=""> Remember me\r
                  <span class="form-check-sign">\r
                    <span class="check"></span>\r
                  </span>\r
                </label>\r
              </div>\r
              <a class="txt1" routerLink="/authentication/forgot-password">Forgot Password?</a>\r
            </div>\r
\r
-->\r
            @if (error) {\r
            <div class="alert alert-danger mt-3 mb-0">{{error}}</div>\r
            }\r
            <div class="turnstile-wrapper">\r
              <div class="turnstile-shell" [class.turnstile-shell--disabled]="!isTurnstileConfigured">\r
                <div #turnstileContainer class="turnstile-host" [class.turnstile-host--disabled]="!isTurnstileConfigured"></div>\r
              </div>\r
\r
              @if (!isTurnstileConfigured) {\r
              <div class="turnstile-help turnstile-help--warning">\r
                {{ 'MENUITEMS.LOGIN.TURNSTILE_CONFIG_REQUIRED' | translate }}\r
              </div>\r
              }\r
\r
              @if (turnstileLoadFailed) {\r
              <div class="turnstile-help turnstile-help--danger">\r
                {{ 'MENUITEMS.LOGIN.TURNSTILE_LOAD_ERROR' | translate }}\r
              </div>\r
              }\r
\r
              @if (turnstileTouched && !turnstileToken) {\r
              <div class="turnstile-help turnstile-help--danger">\r
                {{ 'MENUITEMS.LOGIN.TURNSTILE_REQUIRED' | translate }}\r
              </div>\r
              }\r
            </div>\r
            <div class="container-auth-form-btn">\r
              <div style="text-align:center">\r
                <button mat-flat-button color="accent" [class.auth-spinner]="loading"\r
                  class="auth-form-btn" style="background-color: #002737" [disabled]="!canSubmit" \r
                  type="submit">{{'MENUITEMS.LOGIN.ACCESS' | translate}}</button>\r
              </div>\r
            </div>\r
          </form>\r
          <h6 class="social-login-title">v01.05.06</h6>\r
\r
\r
          <footer style="text-align: center; padding: 10px; font-size: 14px; color: #555;">\r
            \xA9 <span id="anio"></span> Just-Link Guatemala. {{'MENUITEMS.LOGIN.ALLRIGHTS' | translate}}\r
          </footer>\r
\r
      \r
\r
<!-- \r
          <ul class="list-unstyled social-icon mb-0 mt-3">\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-google"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded flex-c-m">\r
                <i class="fab fa-facebook-f"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-twitter"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-linkedin-in"></i>\r
              </a></li>\r
          </ul>\r
-->\r
\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/authentication/signin/signin.component.scss */\n.turnstile-wrapper {\n  margin: 1rem 0 1.25rem;\n  width: 100%;\n}\n.turnstile-shell {\n  width: 100%;\n  min-height: 76px;\n  padding: 0.75rem 1rem;\n  border: 1px solid #d7dde8;\n  border-radius: 8px;\n  background: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.turnstile-shell--disabled {\n  padding: 0;\n  min-height: 0;\n  border: 0;\n  background: transparent;\n}\n.turnstile-host {\n  min-height: 65px;\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n.turnstile-host--disabled {\n  min-height: 0;\n}\n.turnstile-help {\n  margin-top: 0.5rem;\n  font-size: 0.875rem;\n}\n.turnstile-help--warning {\n  color: #b45309;\n}\n.turnstile-help--danger {\n  color: #b91c1c;\n}\n/*# sourceMappingURL=signin.component.css.map */\n"] }]
  }], () => [{ type: LanguageService }, { type: TranslateService }, { type: OrganizacionService }, { type: UntypedFormBuilder }, { type: ActivatedRoute }, { type: Router }, { type: AuthService }], { turnstileContainer: [{
    type: ViewChild,
    args: ["turnstileContainer"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SigninComponent, { className: "SigninComponent", filePath: "src/app/authentication/signin/signin.component.ts", lineNumber: 52 });
})();

// src/app/authentication/signup/signup.component.ts
function SignupComponent_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Username is required ");
    \u0275\u0275elementEnd();
  }
}
function SignupComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please enter a valid email address ");
    \u0275\u0275elementEnd();
  }
}
function SignupComponent_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
function SignupComponent_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Confirm Password is required ");
    \u0275\u0275elementEnd();
  }
}
var SignupComponent = class _SignupComponent {
  constructor(formBuilder, route, router) {
    this.formBuilder = formBuilder;
    this.route = route;
    this.router = router;
    this.submitted = false;
    this.hide = true;
    this.chide = true;
  }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      password: ["", Validators.required],
      cpassword: ["", Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(["/admin/dashboard/main"]);
    }
  }
  static {
    this.\u0275fac = function SignupComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SignupComponent)(\u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SignupComponent, selectors: [["app-signup"]], decls: 74, vars: 14, consts: [[1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/bg-02.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "welcome-msg"], [1, "auth-signup-text", "text-muted"], [1, "validate-form", 3, "ngSubmit", "formGroup"], [1, "row"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], ["appearance", "outline", 1, "example-full-width"], ["matInput", "", "formControlName", "username", "required", ""], ["matSuffix", "", 1, "material-icons-two-tone", "color-icon", "p-3"], [1, "col-xl-12col-lg-12", "col-md-12", "col-sm-12", "mb-2"], ["matInput", "", "formControlName", "email", "required", ""], ["matInput", "", "formControlName", "password", "required", "", 3, "type"], ["href", "#", "onClick", "return false;", "matSuffix", "", 3, "click"], ["matSuffix", "", 1, "material-icons-two-tone", "color-icon", "m-3"], ["matInput", "", "formControlName", "cpassword", "required", "", 3, "type"], [1, "flex-sb-m", "w-full", "p-b-20"], ["routerLink", "/authentication/signin"], [1, "container-auth-form-btn"], ["mat-flat-button", "", "color", "accent", "type", "submit", 1, "auth-form-btn", 3, "disabled"], [1, "social-login-title"], [1, "list-unstyled", "social-icon", "mb-0", "mt-3"], [1, "list-inline-item"], ["href", "javascript:void(0)", 1, "rounded"], [1, "fab", "fa-google"], ["href", "javascript:void(0)", 1, "rounded", "flex-c-m"], [1, "fab", "fa-facebook-f"], [1, "fab", "fa-twitter"], [1, "fab", "fa-linkedin-in"]], template: function SignupComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "h6", 7);
        \u0275\u0275text(8, " Sign Up ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 8);
        \u0275\u0275text(10, "Enter details to create your account");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "form", 9);
        \u0275\u0275listener("ngSubmit", function SignupComponent_Template_form_ngSubmit_11_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(12, "div", 10)(13, "div", 11)(14, "mat-form-field", 12)(15, "mat-label");
        \u0275\u0275text(16, "Username");
        \u0275\u0275elementEnd();
        \u0275\u0275element(17, "input", 13);
        \u0275\u0275elementStart(18, "mat-icon", 14);
        \u0275\u0275text(19, "face");
        \u0275\u0275elementEnd();
        \u0275\u0275template(20, SignupComponent_Conditional_20_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(21, "div", 10)(22, "div", 15)(23, "mat-form-field", 12)(24, "mat-label");
        \u0275\u0275text(25, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(26, "input", 16);
        \u0275\u0275elementStart(27, "mat-icon", 14);
        \u0275\u0275text(28, "mail");
        \u0275\u0275elementEnd();
        \u0275\u0275template(29, SignupComponent_Conditional_29_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(30, "div", 10)(31, "div", 15)(32, "mat-form-field", 12)(33, "mat-label");
        \u0275\u0275text(34, "Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(35, "input", 17);
        \u0275\u0275elementStart(36, "a", 18);
        \u0275\u0275listener("click", function SignupComponent_Template_a_click_36_listener() {
          return ctx.hide = !ctx.hide;
        });
        \u0275\u0275elementStart(37, "mat-icon", 19);
        \u0275\u0275text(38);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(39, SignupComponent_Conditional_39_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(40, "div", 10)(41, "div", 15)(42, "mat-form-field", 12)(43, "mat-label");
        \u0275\u0275text(44, "Confirm Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(45, "input", 20);
        \u0275\u0275elementStart(46, "a", 18);
        \u0275\u0275listener("click", function SignupComponent_Template_a_click_46_listener() {
          return ctx.chide = !ctx.chide;
        });
        \u0275\u0275elementStart(47, "mat-icon", 19);
        \u0275\u0275text(48);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(49, SignupComponent_Conditional_49_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(50, "div", 21)(51, "div")(52, "span");
        \u0275\u0275text(53, "Already Registered? ");
        \u0275\u0275elementStart(54, "a", 22);
        \u0275\u0275text(55, " Login ");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(56, "div", 23)(57, "button", 24);
        \u0275\u0275text(58, " Register ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(59, "h6", 25);
        \u0275\u0275text(60, "OR");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(61, "ul", 26)(62, "li", 27)(63, "a", 28);
        \u0275\u0275element(64, "i", 29);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(65, "li", 27)(66, "a", 30);
        \u0275\u0275element(67, "i", 31);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(68, "li", 27)(69, "a", 28);
        \u0275\u0275element(70, "i", 32);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(71, "li", 27)(72, "a", 28);
        \u0275\u0275element(73, "i", 33);
        \u0275\u0275elementEnd()()()()()()()();
      }
      if (rf & 2) {
        let tmp_1_0;
        let tmp_2_0;
        let tmp_7_0;
        let tmp_12_0;
        \u0275\u0275advance(11);
        \u0275\u0275property("formGroup", ctx.authForm);
        \u0275\u0275advance(9);
        \u0275\u0275conditional(((tmp_1_0 = ctx.authForm.get("username")) == null ? null : tmp_1_0.hasError("required")) ? 20 : -1);
        \u0275\u0275advance(9);
        \u0275\u0275conditional(((tmp_2_0 = ctx.authForm.get("email")) == null ? null : tmp_2_0.hasError("required")) || ((tmp_2_0 = ctx.authForm.get("email")) == null ? null : tmp_2_0.touched) ? 29 : -1);
        \u0275\u0275advance(6);
        \u0275\u0275property("type", ctx.hide ? "password" : "text");
        \u0275\u0275advance();
        \u0275\u0275attribute("aria-label", "Hide password")("aria-pressed", ctx.hide);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.hide ? "visibility_off" : "visibility", "");
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_7_0 = ctx.authForm.get("password")) == null ? null : tmp_7_0.hasError("required")) ? 39 : -1);
        \u0275\u0275advance(6);
        \u0275\u0275property("type", ctx.chide ? "password" : "text");
        \u0275\u0275advance();
        \u0275\u0275attribute("aria-label", "Hide password")("aria-pressed", ctx.chide);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.hide ? "visibility_off" : "visibility", "");
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_12_0 = ctx.authForm.get("cpassword")) == null ? null : tmp_12_0.hasError("required")) ? 49 : -1);
        \u0275\u0275advance(8);
        \u0275\u0275property("disabled", !ctx.authForm.valid);
      }
    }, dependencies: [
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatError,
      MatSuffix,
      MatInputModule,
      MatInput,
      MatIconModule,
      MatIcon,
      RouterLink,
      MatButtonModule,
      MatButton
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SignupComponent, [{
    type: Component,
    args: [{ selector: "app-signup", imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      RouterLink,
      MatButtonModule
    ], template: `<div class="auth-container">\r
  <div class="row auth-main">\r
    <div class="col-sm-6 px-0 d-none d-sm-block">\r
      <div class="left-img" style="background-image: url(assets/images/pages/bg-02.png);">\r
      </div>\r
    </div>\r
    <div class="col-sm-6 auth-form-section">\r
      <div class="form-section">\r
        <div class="auth-wrapper">\r
          <h6 class="welcome-msg"> Sign Up </h6>\r
          <p class="auth-signup-text text-muted">Enter details to create your account</p>\r
          <form class="validate-form" [formGroup]="authForm" (ngSubmit)="onSubmit()">\r
            <div class="row">\r
              <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Username</mat-label>\r
                  <input matInput formControlName="username" required>\r
                  <mat-icon class="material-icons-two-tone color-icon p-3" matSuffix>face</mat-icon>\r
                  @if (authForm.get('username')?.hasError('required')) {\r
                  <mat-error>\r
                    Username is required\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-xl-12col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Email</mat-label>\r
                  <input matInput formControlName="email" required>\r
                  <mat-icon class="material-icons-two-tone color-icon p-3" matSuffix>mail</mat-icon>\r
                  @if (authForm.get('email')?.hasError('required') || authForm.get('email')?.touched) {\r
                  <mat-error>\r
                    Please enter a valid email address\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-xl-12col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Password</mat-label>\r
                  <input matInput formControlName="password" [type]="hide ? 'password' : 'text'" required>\r
                  <a href="#" onClick="return false;" matSuffix (click)="hide = !hide"\r
                    [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">\r
                    <mat-icon class="material-icons-two-tone color-icon m-3" matSuffix>\r
                      {{hide ? 'visibility_off' : 'visibility'}}</mat-icon>\r
                  </a>\r
                  @if (authForm.get('password')?.hasError('required')) {\r
                  <mat-error>\r
                    Password is required\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-xl-12col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Confirm Password</mat-label>\r
                  <input matInput formControlName="cpassword" [type]="chide ? 'password' : 'text'" required>\r
                  <a href="#" onClick="return false;" matSuffix (click)="chide = !chide"\r
                    [attr.aria-label]="'Hide password'" [attr.aria-pressed]="chide">\r
                    <mat-icon class="material-icons-two-tone color-icon m-3" matSuffix>\r
                      {{hide ? 'visibility_off' : 'visibility'}}</mat-icon>\r
                  </a>\r
                  @if (authForm.get('cpassword')?.hasError('required')) {\r
                  <mat-error>\r
                    Confirm Password is required\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="flex-sb-m w-full  p-b-20">\r
              <div>\r
                <span>Already Registered? <a routerLink="/authentication/signin">\r
                    Login\r
                  </a></span>\r
              </div>\r
            </div>\r
            <div class="container-auth-form-btn">\r
              <button mat-flat-button color="accent" class="auth-form-btn" [disabled]="!authForm.valid " type="submit">\r
                Register\r
              </button>\r
            </div>\r
          </form>\r
          <h6 class="social-login-title">OR</h6>\r
          <ul class="list-unstyled social-icon mb-0 mt-3">\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-google"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded flex-c-m">\r
                <i class="fab fa-facebook-f"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-twitter"></i>\r
              </a></li>\r
            <li class="list-inline-item"><a href="javascript:void(0)" class="rounded">\r
                <i class="fab fa-linkedin-in"></i>\r
              </a></li>\r
          </ul>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>` }]
  }], () => [{ type: UntypedFormBuilder }, { type: ActivatedRoute }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SignupComponent, { className: "SignupComponent", filePath: "src/app/authentication/signup/signup.component.ts", lineNumber: 22 });
})();

// src/app/authentication/forgot-password/forgot-password.component.ts
function ForgotPasswordComponent_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please enter a valid email address ");
    \u0275\u0275elementEnd();
  }
}
var ForgotPasswordComponent = class _ForgotPasswordComponent {
  constructor(formBuilder, route, router) {
    this.formBuilder = formBuilder;
    this.route = route;
    this.router = router;
    this.submitted = false;
  }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)]
      ]
    });
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(["/dashboard/main"]);
    }
  }
  static {
    this.\u0275fac = function ForgotPasswordComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ForgotPasswordComponent)(\u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForgotPasswordComponent, selectors: [["app-forgot-password"]], decls: 30, vars: 3, consts: [[1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/bg-03.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "welcome-msg"], [1, "auth-signup-text", "text-muted"], [1, "validate-form", 3, "ngSubmit", "formGroup"], [1, "row"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], [1, "error-subheader2", "p-t-20", "p-b-15"], ["appearance", "outline", 1, "example-full-width"], ["matInput", "", "formControlName", "email", "required", ""], ["matSuffix", "", 1, "material-icons-two-tone", "color-icon", "p-3"], [1, "container-auth-form-btn", "mt-5"], ["mat-flat-button", "", "color", "accent", "type", "submit", 1, "auth-form-btn", 3, "disabled"], [1, "w-full", "p-t-25", "text-center"], ["routerLink", "/authentication/signin", 1, "txt1"]], template: function ForgotPasswordComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "h5", 7);
        \u0275\u0275text(8, " Reset Password ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "p", 8);
        \u0275\u0275text(10, "Let Us Help You");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "form", 9);
        \u0275\u0275listener("ngSubmit", function ForgotPasswordComponent_Template_form_ngSubmit_11_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(12, "div", 10)(13, "div", 11)(14, "span", 12);
        \u0275\u0275text(15, " Enter your registered email address. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "mat-form-field", 13)(17, "mat-label");
        \u0275\u0275text(18, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(19, "input", 14);
        \u0275\u0275elementStart(20, "mat-icon", 15);
        \u0275\u0275text(21, "mail");
        \u0275\u0275elementEnd();
        \u0275\u0275template(22, ForgotPasswordComponent_Conditional_22_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(23, "div", 16)(24, "button", 17);
        \u0275\u0275text(25, " Reset My Password ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(26, "div", 18)(27, "div")(28, "a", 19);
        \u0275\u0275text(29, " Login? ");
        \u0275\u0275elementEnd()()()()()()()()();
      }
      if (rf & 2) {
        let tmp_1_0;
        \u0275\u0275advance(11);
        \u0275\u0275property("formGroup", ctx.authForm);
        \u0275\u0275advance(11);
        \u0275\u0275conditional(((tmp_1_0 = ctx.authForm.get("email")) == null ? null : tmp_1_0.hasError("required")) || ((tmp_1_0 = ctx.authForm.get("email")) == null ? null : tmp_1_0.touched) ? 22 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", !ctx.authForm.valid);
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, ReactiveFormsModule, FormGroupDirective, FormControlName, MatFormFieldModule, MatFormField, MatLabel, MatError, MatSuffix, MatInputModule, MatInput, MatIconModule, MatIcon, MatButtonModule, MatButton, RouterLink], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForgotPasswordComponent, [{
    type: Component,
    args: [{ selector: "app-forgot-password", imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      RouterLink
    ], template: `<div class="auth-container">\r
  <div class="row auth-main">\r
    <div class="col-sm-6 px-0 d-none d-sm-block">\r
      <div class="left-img" style="background-image: url(assets/images/pages/bg-03.png);">\r
      </div>\r
    </div>\r
    <div class="col-sm-6 auth-form-section">\r
      <div class="form-section">\r
        <div class="auth-wrapper">\r
          <h5 class="welcome-msg"> Reset Password </h5>\r
          <p class="auth-signup-text text-muted">Let Us Help You</p>\r
          <form class="validate-form" [formGroup]="authForm" (ngSubmit)="onSubmit()">\r
            <div class="row">\r
              <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <span class="error-subheader2 p-t-20 p-b-15">\r
                  Enter your registered email address.\r
                </span>\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Email</mat-label>\r
                  <input matInput formControlName="email" required>\r
                  <mat-icon class="material-icons-two-tone color-icon p-3" matSuffix>mail</mat-icon>\r
                  @if (authForm.get('email')?.hasError('required') || authForm.get('email')?.touched) {\r
                  <mat-error>\r
                    Please enter a valid email address\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="container-auth-form-btn mt-5">\r
              <button mat-flat-button color="accent" class="auth-form-btn" [disabled]="!authForm.valid " type="submit">\r
                Reset My Password\r
              </button>\r
            </div>\r
            <div class="w-full p-t-25 text-center">\r
              <div>\r
                <a routerLink="/authentication/signin" class="txt1">\r
                  Login?\r
                </a>\r
              </div>\r
            </div>\r
          </form>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>` }]
  }], () => [{ type: UntypedFormBuilder }, { type: ActivatedRoute }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForgotPasswordComponent, { className: "ForgotPasswordComponent", filePath: "src/app/authentication/forgot-password/forgot-password.component.ts", lineNumber: 22 });
})();

// src/app/authentication/locked/locked.component.ts
function LockedComponent_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Password is required ");
    \u0275\u0275elementEnd();
  }
}
var LockedComponent = class _LockedComponent {
  constructor(formBuilder, router, authService) {
    this.formBuilder = formBuilder;
    this.router = router;
    this.authService = authService;
    this.submitted = false;
    this.hide = true;
  }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      password: ["", Validators.required]
    });
    this.userImg = this.authService.currentUserValue.img;
    this.userFullName = this.authService.currentUserValue.firstName + " " + this.authService.currentUserValue.lastName;
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      this.router.navigate(["/profile"]);
    }
  }
  static {
    this.\u0275fac = function LockedComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LockedComponent)(\u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(AuthService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LockedComponent, selectors: [["app-locked"]], decls: 34, vars: 7, consts: [[1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/bg-01.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "validate-form", 3, "ngSubmit", "formGroup"], [1, "auth-locked"], [1, "image"], ["alt", "User", 3, "src"], [1, "auth-locked-title", "p-b-34", "p-t-27"], [1, "text-center"], [1, "txt1", "p-b-20"], [1, "row"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], [1, "error-subheader2", "p-t-20", "p-b-15"], ["appearance", "outline", 1, "example-full-width"], ["matInput", "", "formControlName", "password", "required", "", 3, "type"], ["matSuffix", "", 3, "click"], [1, "container-auth-form-btn", "mt-5"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "auth-form-btn", 3, "disabled"], [1, "w-full", "p-t-15", "p-b-15", "text-center"], ["routerLink", "/authentication/signin", 1, "txt1"]], template: function LockedComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "form", 7);
        \u0275\u0275listener("ngSubmit", function LockedComponent_Template_form_ngSubmit_7_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(8, "div", 8)(9, "div", 9);
        \u0275\u0275element(10, "img", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "span", 11);
        \u0275\u0275text(12);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "div", 12)(14, "p", 13);
        \u0275\u0275text(15, " Locked ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "div", 14)(17, "div", 15)(18, "span", 16);
        \u0275\u0275text(19, " Enter your password here. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "mat-form-field", 17)(21, "mat-label");
        \u0275\u0275text(22, "Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(23, "input", 18);
        \u0275\u0275elementStart(24, "mat-icon", 19);
        \u0275\u0275listener("click", function LockedComponent_Template_mat_icon_click_24_listener() {
          return ctx.hide = !ctx.hide;
        });
        \u0275\u0275text(25);
        \u0275\u0275elementEnd();
        \u0275\u0275template(26, LockedComponent_Conditional_26_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(27, "div", 20)(28, "button", 21);
        \u0275\u0275text(29, " Reset My Password ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(30, "div", 22)(31, "div")(32, "a", 23);
        \u0275\u0275text(33, " Need Help? ");
        \u0275\u0275elementEnd()()()()()()()()();
      }
      if (rf & 2) {
        let tmp_5_0;
        \u0275\u0275advance(7);
        \u0275\u0275property("formGroup", ctx.authForm);
        \u0275\u0275advance(3);
        \u0275\u0275propertyInterpolate("src", ctx.userImg, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.userFullName, " ");
        \u0275\u0275advance(11);
        \u0275\u0275property("type", ctx.hide ? "password" : "text");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.hide ? "visibility_off" : "visibility", "");
        \u0275\u0275advance();
        \u0275\u0275conditional(((tmp_5_0 = ctx.authForm.get("password")) == null ? null : tmp_5_0.hasError("required")) ? 26 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", !ctx.authForm.valid);
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, ReactiveFormsModule, FormGroupDirective, FormControlName, MatFormFieldModule, MatFormField, MatLabel, MatError, MatSuffix, MatInputModule, MatInput, MatIconModule, MatIcon, MatButtonModule, MatButton, RouterLink], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LockedComponent, [{
    type: Component,
    args: [{ selector: "app-locked", imports: [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      RouterLink
    ], template: `<div class="auth-container">\r
  <div class="row auth-main">\r
    <div class="col-sm-6 px-0 d-none d-sm-block">\r
      <div class="left-img" style="background-image: url(assets/images/pages/bg-01.png);">\r
      </div>\r
    </div>\r
    <div class="col-sm-6 auth-form-section">\r
      <div class="form-section">\r
        <div class="auth-wrapper">\r
          <form class="validate-form" [formGroup]="authForm" (ngSubmit)="onSubmit()">\r
            <div class="auth-locked">\r
              <div class="image">\r
                <img src={{userImg}} alt="User">\r
              </div>\r
            </div>\r
            <span class="auth-locked-title p-b-34 p-t-27">\r
              {{userFullName}}\r
            </span>\r
            <div class="text-center">\r
              <p class="txt1 p-b-20">\r
                Locked\r
              </p>\r
            </div>\r
            <div class="row">\r
              <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                <span class="error-subheader2 p-t-20 p-b-15">\r
                  Enter your password here.\r
                </span>\r
                <mat-form-field class="example-full-width" appearance="outline">\r
                  <mat-label>Password</mat-label>\r
                  <input matInput formControlName="password" [type]="hide ? 'password' : 'text'" required>\r
                  <mat-icon matSuffix (click)="hide = !hide">\r
                    {{hide ? 'visibility_off' : 'visibility'}}</mat-icon>\r
                  @if (authForm.get('password')?.hasError('required')) {\r
                  <mat-error>\r
                    Password is required\r
                  </mat-error>\r
                  }\r
                </mat-form-field>\r
              </div>\r
            </div>\r
            <div class="container-auth-form-btn mt-5">\r
              <button mat-flat-button color="primary" class="auth-form-btn" [disabled]="!authForm.valid " type="submit">\r
                Reset My Password\r
              </button>\r
            </div>\r
            <div class="w-full p-t-15 p-b-15 text-center">\r
              <div>\r
                <a routerLink="/authentication/signin" class="txt1">\r
                  Need Help?\r
                </a>\r
              </div>\r
            </div>\r
          </form>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>` }]
  }], () => [{ type: UntypedFormBuilder }, { type: Router }, { type: AuthService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LockedComponent, { className: "LockedComponent", filePath: "src/app/authentication/locked/locked.component.ts", lineNumber: 23 });
})();

// src/app/authentication/page500/page500.component.ts
var Page500Component = class _Page500Component {
  constructor() {
  }
  static {
    this.\u0275fac = function Page500Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Page500Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Page500Component, selectors: [["app-page500"]], decls: 19, vars: 0, consts: [[1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/bg-05.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "error-header", "p-b-45"], [1, "error-subheader2", "p-b-5"], [1, "container-auth-form-btn", "mt-5"], ["mat-flat-button", "", "color", "accent", "type", "submit", 1, "auth-form-btn"], [1, "w-full", "p-t-15", "p-b-15", "text-center"], ["routerLink", "/authentication/signin", 1, "txt1"]], template: function Page500Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "form")(8, "span", 7);
        \u0275\u0275text(9, " 500 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "span", 8);
        \u0275\u0275text(11, " Oops, Something went wrong. Please try after some times. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 9)(13, "button", 10);
        \u0275\u0275text(14, " Go To Home Page ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "div", 11)(16, "div")(17, "a", 12);
        \u0275\u0275text(18, " Need Help? ");
        \u0275\u0275elementEnd()()()()()()()()();
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, NgControlStatusGroup, NgForm, MatButtonModule, MatButton, RouterLink], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Page500Component, [{
    type: Component,
    args: [{ selector: "app-page500", imports: [
      FormsModule,
      MatButtonModule,
      RouterLink
    ], template: '<div class="auth-container">\r\n  <div class="row auth-main">\r\n    <div class="col-sm-6 px-0 d-none d-sm-block">\r\n      <div class="left-img" style="background-image: url(assets/images/pages/bg-05.png);">\r\n      </div>\r\n    </div>\r\n    <div class="col-sm-6 auth-form-section">\r\n      <div class="form-section">\r\n        <div class="auth-wrapper">\r\n          <form>\r\n            <span class="error-header p-b-45">\r\n              500\r\n            </span>\r\n            <span class="error-subheader2 p-b-5">\r\n              Oops, Something went wrong. Please try after some times.\r\n            </span>\r\n            <div class="container-auth-form-btn mt-5">\r\n              <button mat-flat-button color="accent" class="auth-form-btn" type="submit">\r\n                Go To Home Page\r\n              </button>\r\n            </div>\r\n            <div class="w-full p-t-15 p-b-15 text-center">\r\n              <div>\r\n                <a routerLink="/authentication/signin" class="txt1">\r\n                  Need Help?\r\n                </a>\r\n              </div>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>' }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Page500Component, { className: "Page500Component", filePath: "src/app/authentication/page500/page500.component.ts", lineNumber: 15 });
})();

// src/app/authentication/auth.routes.ts
var AUTH_ROUTE = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full"
  },
  {
    path: "signin",
    component: SigninComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "locked",
    component: LockedComponent
  },
  {
    path: "page404",
    component: Page404Component
  },
  {
    path: "page500",
    component: Page500Component
  }
];
export {
  AUTH_ROUTE
};
//# sourceMappingURL=auth.routes-UMKU5XLB.js.map
