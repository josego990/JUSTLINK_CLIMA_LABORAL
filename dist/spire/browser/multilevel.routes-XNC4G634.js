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

// src/app/multilevel/first3/first3.component.ts
var _c0 = () => ["Home", "Multilevel"];
var First3Component = class _First3Component {
  constructor() {
  }
  static {
    this.\u0275fac = function First3Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _First3Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _First3Component, selectors: [["app-first3"]], decls: 11, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function First3Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2");
        \u0275\u0275text(9, "First Level 3");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "First 3")("items", \u0275\u0275pureFunction0(3, _c0))("active_item", "First 3");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(First3Component, [{
    type: Component,
    args: [{ selector: "app-first3", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'First 3'" [items]="['Home','Multilevel']" [active_item]="'First 3'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>First Level 3</h2>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(First3Component, { className: "First3Component", filePath: "src/app/multilevel/first3/first3.component.ts", lineNumber: 10 });
})();

// src/app/multilevel/first2/first2.component.ts
var _c02 = () => ["Home", "Multilevel"];
var First2Component = class _First2Component {
  constructor() {
  }
  static {
    this.\u0275fac = function First2Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _First2Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _First2Component, selectors: [["app-first2"]], decls: 11, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function First2Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2");
        \u0275\u0275text(9, "First Level 2");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "First 2")("items", \u0275\u0275pureFunction0(3, _c02))("active_item", "First 2");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(First2Component, [{
    type: Component,
    args: [{ selector: "app-first2", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'First 2'" [items]="['Home','Multilevel']" [active_item]="'First 2'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>First Level 2</h2>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(First2Component, { className: "First2Component", filePath: "src/app/multilevel/first2/first2.component.ts", lineNumber: 10 });
})();

// src/app/multilevel/first1/first1.component.ts
var _c03 = () => ["Home", "Multilevel"];
var First1Component = class _First1Component {
  constructor() {
  }
  static {
    this.\u0275fac = function First1Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _First1Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _First1Component, selectors: [["app-first1"]], decls: 11, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function First1Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2");
        \u0275\u0275text(9, "First Level");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(10, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "First 1")("items", \u0275\u0275pureFunction0(3, _c03))("active_item", "First 1");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(First1Component, [{
    type: Component,
    args: [{ selector: "app-first1", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'First 1'" [items]="['Home','Multilevel']" [active_item]="'First 1'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>First Level</h2>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(First1Component, { className: "First1Component", filePath: "src/app/multilevel/first1/first1.component.ts", lineNumber: 10 });
})();

// src/app/multilevel/multilevel.routes.ts
var MULTILEVEL_ROUTE = [
  {
    path: "first1",
    component: First1Component
  },
  {
    path: "first2",
    component: First2Component
  },
  {
    path: "first3",
    component: First3Component
  },
  {
    path: "secondlevel",
    loadChildren: () => import("./secondlevel.routes-UMGOWT2E.js").then((m) => m.SECONDLEVEL_ROUTE)
  },
  {
    path: "thirdlevel",
    loadChildren: () => import("./thirdlevel.routes-ML34HTFC.js").then((m) => m.THIRDLEVEL_ROUTE)
  }
];
export {
  MULTILEVEL_ROUTE
};
//# sourceMappingURL=multilevel.routes-XNC4G634.js.map
