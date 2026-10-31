import {
  TranslateModule,
  TranslatePipe
} from "./chunk-J7XWAFEK.js";
import {
  environment
} from "./chunk-ITHPGOKL.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import {
  CommonModule,
  NgIf
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵloadQuery,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";

// src/app/shared/components/turnstile/turnstile.component.ts
var _c0 = ["turnstileContainer"];
function TurnstileComponent_small_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 8);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.TURNSTILE.CONFIG_REQUIRED"), " ");
  }
}
function TurnstileComponent_small_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 9);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.TURNSTILE.LOAD_ERROR"), " ");
  }
}
function TurnstileComponent_small_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small", 9);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.TURNSTILE.EXPIRED"), " ");
  }
}
var TurnstileComponent = class _TurnstileComponent {
  constructor(zone) {
    this.zone = zone;
    this.action = "survey-submit";
    this.language = "auto";
    this.theme = "light";
    this.tokenChange = new EventEmitter();
    this.siteKey = environment.turnstileSiteKey?.trim() ?? "";
    this.token = "";
    this.isLoading = false;
    this.loadFailed = false;
    this.expired = false;
    this.widgetId = null;
    this.viewInitialized = false;
    this.scriptId = "cloudflare-turnstile-script";
  }
  get isConfigured() {
    return this.siteKey.length > 0;
  }
  ngAfterViewInit() {
    this.viewInitialized = true;
    this.initialize();
  }
  ngOnChanges(changes) {
    if (this.viewInitialized && (changes["language"] || changes["theme"] || changes["action"])) {
      this.removeWidget();
      this.initialize();
    }
  }
  ngOnDestroy() {
    this.removeWidget();
  }
  reset() {
    this.setToken("");
    this.expired = false;
    const turnstile = this.getTurnstileApi();
    if (turnstile && this.widgetId) {
      turnstile.reset(this.widgetId);
    }
  }
  initialize() {
    if (!this.isConfigured) {
      return;
    }
    this.isLoading = true;
    this.loadFailed = false;
    this.loadScript().then(() => this.renderWidget()).catch((error) => {
      console.error("No se pudo cargar Cloudflare Turnstile:", error);
      this.zone.run(() => {
        this.isLoading = false;
        this.loadFailed = true;
        this.setToken("");
      });
    });
  }
  loadScript() {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        resolve();
        return;
      }
      if (this.getTurnstileApi()) {
        resolve();
        return;
      }
      const existingScript = document.getElementById(this.scriptId);
      if (existingScript) {
        this.waitForApi(resolve, reject);
        return;
      }
      const script = document.createElement("script");
      script.id = this.scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => this.waitForApi(resolve, reject);
      script.onerror = () => reject(new Error("Turnstile script load failed"));
      document.head.appendChild(script);
    });
  }
  waitForApi(resolve, reject) {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      if (this.getTurnstileApi()) {
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
  renderWidget() {
    const container = this.turnstileContainer?.nativeElement;
    const turnstile = this.getTurnstileApi();
    if (!container || !turnstile || this.widgetId) {
      return;
    }
    container.innerHTML = "";
    this.widgetId = turnstile.render(container, {
      sitekey: this.siteKey,
      theme: this.theme,
      language: this.language || "auto",
      action: this.action,
      callback: (token) => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadFailed = false;
          this.expired = false;
          this.setToken(token);
        });
      },
      "expired-callback": () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.expired = true;
          this.setToken("");
        });
      },
      "error-callback": () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadFailed = true;
          this.setToken("");
        });
      }
    });
  }
  removeWidget() {
    const turnstile = this.getTurnstileApi();
    if (turnstile && this.widgetId) {
      turnstile.remove(this.widgetId);
    }
    this.widgetId = null;
    this.setToken("");
  }
  setToken(token) {
    if (this.token === token) {
      return;
    }
    this.token = token;
    this.tokenChange.emit(token);
  }
  getTurnstileApi() {
    return typeof window === "undefined" ? void 0 : window.turnstile;
  }
  static {
    this.\u0275fac = function TurnstileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TurnstileComponent)(\u0275\u0275directiveInject(NgZone));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TurnstileComponent, selectors: [["app-turnstile"]], viewQuery: function TurnstileComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.turnstileContainer = _t.first);
      }
    }, inputs: { action: "action", language: "language", theme: "theme" }, outputs: { tokenChange: "tokenChange" }, features: [\u0275\u0275NgOnChangesFeature], decls: 18, vars: 11, consts: [["turnstileContainer", ""], [1, "turnstile-card"], [1, "turnstile-copy"], ["aria-hidden", "true", 1, "turnstile-icon"], [1, "turnstile-widget"], [1, "turnstile-host"], ["class", "turnstile-status turnstile-status--warning", 4, "ngIf"], ["class", "turnstile-status turnstile-status--error", 4, "ngIf"], [1, "turnstile-status", "turnstile-status--warning"], [1, "turnstile-status", "turnstile-status--error"]], template: function TurnstileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 1)(1, "div", 2)(2, "span", 3)(3, "mat-icon");
        \u0275\u0275text(4, "verified_user");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div")(6, "strong");
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "small");
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "div", 4);
        \u0275\u0275element(13, "div", 5, 0);
        \u0275\u0275template(15, TurnstileComponent_small_15_Template, 3, 3, "small", 6)(16, TurnstileComponent_small_16_Template, 3, 3, "small", 7)(17, TurnstileComponent_small_17_Template, 3, 3, "small", 7);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275classProp("turnstile-card--error", ctx.loadFailed || !ctx.isConfigured);
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 7, "MENUITEMS.TURNSTILE.TITLE"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 9, "MENUITEMS.TURNSTILE.DESCRIPTION"));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", !ctx.isConfigured);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.loadFailed && ctx.isConfigured);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.expired && !ctx.loadFailed);
      }
    }, dependencies: [CommonModule, NgIf, MatIconModule, MatIcon, TranslateModule, TranslatePipe], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n.turnstile-card[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  margin: 18px 0 22px;\n  padding: 14px 16px;\n  border: 1px solid #dbe4e8;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(23, 42, 54, 0.04);\n}\n.turnstile-card--error[_ngcontent-%COMP%] {\n  border-color: #e7c4c4;\n}\n.turnstile-copy[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  min-width: 0;\n}\n.turnstile-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.turnstile-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.turnstile-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f2d38;\n  font-size: 0.94rem;\n}\n.turnstile-copy[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  color: #64727d;\n  line-height: 1.35;\n}\n.turnstile-icon[_ngcontent-%COMP%] {\n  display: grid;\n  flex: 0 0 38px;\n  width: 38px;\n  height: 38px;\n  place-items: center;\n  border-radius: 6px;\n  background: #e7f2f5;\n  color: #176477;\n}\n.turnstile-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.turnstile-widget[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n.turnstile-host[_ngcontent-%COMP%] {\n  min-width: 300px;\n  min-height: 65px;\n}\n.turnstile-status[_ngcontent-%COMP%] {\n  display: block;\n  max-width: 300px;\n  margin-top: 5px;\n  line-height: 1.35;\n}\n.turnstile-status--warning[_ngcontent-%COMP%] {\n  color: #8a5a00;\n}\n.turnstile-status--error[_ngcontent-%COMP%] {\n  color: #b42318;\n}\n@media (max-width: 680px) {\n  .turnstile-card[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .turnstile-widget[_ngcontent-%COMP%] {\n    overflow-x: auto;\n  }\n}\n/*# sourceMappingURL=turnstile.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TurnstileComponent, [{
    type: Component,
    args: [{ selector: "app-turnstile", standalone: true, imports: [CommonModule, MatIconModule, TranslateModule], template: `<section class="turnstile-card" [class.turnstile-card--error]="loadFailed || !isConfigured">
  <div class="turnstile-copy">
    <span class="turnstile-icon" aria-hidden="true">
      <mat-icon>verified_user</mat-icon>
    </span>
    <div>
      <strong>{{ 'MENUITEMS.TURNSTILE.TITLE' | translate }}</strong>
      <small>{{ 'MENUITEMS.TURNSTILE.DESCRIPTION' | translate }}</small>
    </div>
  </div>

  <div class="turnstile-widget">
    <div #turnstileContainer class="turnstile-host"></div>

    <small class="turnstile-status turnstile-status--warning" *ngIf="!isConfigured">
      {{ 'MENUITEMS.TURNSTILE.CONFIG_REQUIRED' | translate }}
    </small>
    <small class="turnstile-status turnstile-status--error" *ngIf="loadFailed && isConfigured">
      {{ 'MENUITEMS.TURNSTILE.LOAD_ERROR' | translate }}
    </small>
    <small class="turnstile-status turnstile-status--error" *ngIf="expired && !loadFailed">
      {{ 'MENUITEMS.TURNSTILE.EXPIRED' | translate }}
    </small>
  </div>
</section>
`, styles: ["/* src/app/shared/components/turnstile/turnstile.component.scss */\n:host {\n  display: block;\n  width: 100%;\n}\n.turnstile-card {\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  margin: 18px 0 22px;\n  padding: 14px 16px;\n  border: 1px solid #dbe4e8;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(23, 42, 54, 0.04);\n}\n.turnstile-card--error {\n  border-color: #e7c4c4;\n}\n.turnstile-copy {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  min-width: 0;\n}\n.turnstile-copy strong,\n.turnstile-copy small {\n  display: block;\n}\n.turnstile-copy strong {\n  color: #1f2d38;\n  font-size: 0.94rem;\n}\n.turnstile-copy small {\n  margin-top: 3px;\n  color: #64727d;\n  line-height: 1.35;\n}\n.turnstile-icon {\n  display: grid;\n  flex: 0 0 38px;\n  width: 38px;\n  height: 38px;\n  place-items: center;\n  border-radius: 6px;\n  background: #e7f2f5;\n  color: #176477;\n}\n.turnstile-icon mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.turnstile-widget {\n  flex: 0 0 auto;\n}\n.turnstile-host {\n  min-width: 300px;\n  min-height: 65px;\n}\n.turnstile-status {\n  display: block;\n  max-width: 300px;\n  margin-top: 5px;\n  line-height: 1.35;\n}\n.turnstile-status--warning {\n  color: #8a5a00;\n}\n.turnstile-status--error {\n  color: #b42318;\n}\n@media (max-width: 680px) {\n  .turnstile-card {\n    flex-direction: column;\n    align-items: stretch;\n  }\n  .turnstile-widget {\n    overflow-x: auto;\n  }\n}\n/*# sourceMappingURL=turnstile.component.css.map */\n"] }]
  }], () => [{ type: NgZone }], { turnstileContainer: [{
    type: ViewChild,
    args: ["turnstileContainer"]
  }], action: [{
    type: Input
  }], language: [{
    type: Input
  }], theme: [{
    type: Input
  }], tokenChange: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TurnstileComponent, { className: "TurnstileComponent", filePath: "src/app/shared/components/turnstile/turnstile.component.ts", lineNumber: 47 });
})();

export {
  TurnstileComponent
};
//# sourceMappingURL=chunk-HYUO6MWQ.js.map
