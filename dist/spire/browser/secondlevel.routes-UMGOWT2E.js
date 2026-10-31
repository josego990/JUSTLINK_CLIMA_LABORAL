import {
  BreadcrumbComponent
} from "./chunk-2TM4C2ER.js";
import "./chunk-Y73QBUAC.js";
import "./chunk-WZAKLMWR.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtext
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/multilevel/secondlevel/second1/second1.component.ts
var _c0 = () => ["Home", "Multilevel", "Second"];
var Second1Component = class _Second1Component {
  constructor() {
  }
  static {
    this.\u0275fac = function Second1Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Second1Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Second1Component, selectors: [["app-second1"]], decls: 11, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function Second1Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2");
        \u0275\u0275text(9, "Second Level");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Second 1")("items", \u0275\u0275pureFunction0(3, _c0))("active_item", "Second 1");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Second1Component, [{
    type: Component,
    args: [{ selector: "app-second1", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Second 1'" [items]="['Home','Multilevel','Second']" [active_item]="'Second 1'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Second Level</h2>\r
          </div>\r
          <div class="body">\r
            <!-- Add content here -->\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Second1Component, { className: "Second1Component", filePath: "src/app/multilevel/secondlevel/second1/second1.component.ts", lineNumber: 10 });
})();

// src/app/multilevel/secondlevel/second2/second2.component.ts
var _c02 = () => ["Home", "Multilevel", "Second"];
var Second2Component = class _Second2Component {
  constructor() {
  }
  static {
    this.\u0275fac = function Second2Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Second2Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Second2Component, selectors: [["app-second2"]], decls: 11, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function Second2Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2");
        \u0275\u0275text(9, "Second Level 2");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Second 2")("items", \u0275\u0275pureFunction0(3, _c02))("active_item", "Second 2");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Second2Component, [{
    type: Component,
    args: [{ selector: "app-second2", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Second 2'" [items]="['Home','Multilevel','Second']" [active_item]="'Second 2'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Second Level 2</h2>\r
          </div>\r
          <div class="body">\r
            <!-- Add content here -->\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Second2Component, { className: "Second2Component", filePath: "src/app/multilevel/secondlevel/second2/second2.component.ts", lineNumber: 10 });
})();

// src/app/multilevel/secondlevel/secondlevel.routes.ts
var SECONDLEVEL_ROUTE = [
  {
    path: "second1",
    component: Second1Component
  },
  {
    path: "second2",
    component: Second2Component
  }
];
export {
  SECONDLEVEL_ROUTE
};
//# sourceMappingURL=secondlevel.routes-UMGOWT2E.js.map
