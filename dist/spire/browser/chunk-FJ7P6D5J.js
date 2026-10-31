import {
  AuthService
} from "./chunk-JPZDBAQQ.js";
import {
  FormsModule,
  NgControlStatusGroup,
  NgForm,
  ɵNgNoValidate
} from "./chunk-76BSNCUT.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-6OUKOU55.js";
import {
  Router
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵtext
} from "./chunk-BHZ7HWLX.js";

// src/app/authentication/page404/page404.component.ts
var Page404Component = class _Page404Component {
  constructor(aut, router) {
    this.aut = aut;
    this.router = router;
  }
  LogoutAnRedirect() {
    this.aut.clearCurrentUser();
    this.router.navigate(["/authentication/signin"]);
  }
  static {
    this.\u0275fac = function Page404Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Page404Component)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Page404Component, selectors: [["app-page404"]], decls: 19, vars: 0, consts: [[1, "auth-container"], [1, "row", "auth-main"], [1, "col-sm-6", "px-0", "d-none", "d-sm-block"], [1, "left-img", 2, "background-image", "url(assets/images/pages/bg-04.png)"], [1, "col-sm-6", "auth-form-section"], [1, "form-section"], [1, "auth-wrapper"], [1, "error-header", "p-b-45"], [1, "error-subheader", "p-b-5"], [1, "error-subheader2", "p-b-5"], [1, "container-auth-form-btn", "mt-5"], ["mat-flat-button", "", "color", "accent", "type", "submit", 1, "auth-form-btn", 3, "click"], [1, "w-full", "p-t-15", "p-b-15", "text-center"]], template: function Page404Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "div", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "form")(8, "span", 7);
        \u0275\u0275text(9, " 404 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "span", 8);
        \u0275\u0275text(11, " Parece que est\xE1s perdido ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "span", 9);
        \u0275\u0275text(13, " La p\xE1gina que intentas ver no est\xE1 disponible o no tienes permiso para verla. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "div", 10)(15, "button", 11);
        \u0275\u0275listener("click", function Page404Component_Template_button_click_15_listener() {
          return ctx.LogoutAnRedirect();
        });
        \u0275\u0275text(16, " Ir al Login ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "div", 12);
        \u0275\u0275element(18, "div");
        \u0275\u0275elementEnd()()()()()()();
      }
    }, dependencies: [FormsModule, \u0275NgNoValidate, NgControlStatusGroup, NgForm, MatButtonModule, MatButton], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Page404Component, [{
    type: Component,
    args: [{ selector: "app-page404", imports: [
      FormsModule,
      MatButtonModule
    ], template: '<div class="auth-container">\r\n  <div class="row auth-main">\r\n    <div class="col-sm-6 px-0 d-none d-sm-block">\r\n      <div class="left-img" style="background-image: url(assets/images/pages/bg-04.png);">\r\n      </div>\r\n    </div>\r\n    <div class="col-sm-6 auth-form-section">\r\n      <div class="form-section">\r\n        <div class="auth-wrapper">\r\n          <form >\r\n            <span class="error-header p-b-45">\r\n              404\r\n            </span>\r\n            <span class="error-subheader p-b-5">\r\n              Parece que est\xE1s perdido\r\n            </span>\r\n            <span class="error-subheader2 p-b-5">\r\n              La p\xE1gina que intentas ver no est\xE1 disponible o no tienes permiso para verla.\r\n            </span>\r\n            <div class="container-auth-form-btn mt-5">\r\n              <button mat-flat-button color="accent" class="auth-form-btn" type="submit" (click)="LogoutAnRedirect()">\r\n                Ir al Login\r\n              </button>\r\n            </div>\r\n            <div class="w-full p-t-15 p-b-15 text-center">\r\n              <div>\r\n                \r\n              </div>\r\n            </div>\r\n          </form>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>' }]
  }], () => [{ type: AuthService }, { type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Page404Component, { className: "Page404Component", filePath: "src/app/authentication/page404/page404.component.ts", lineNumber: 17 });
})();

export {
  Page404Component
};
//# sourceMappingURL=chunk-FJ7P6D5J.js.map
