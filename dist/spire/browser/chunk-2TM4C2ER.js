import {
  FeatherIconsComponent
} from "./chunk-Y73QBUAC.js";
import {
  RouterLink
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BHZ7HWLX.js";

// src/app/shared/components/breadcrumb/breadcrumb.component.ts
function BreadcrumbComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r1);
  }
}
var BreadcrumbComponent = class _BreadcrumbComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function BreadcrumbComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BreadcrumbComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BreadcrumbComponent, selectors: [["app-breadcrumb"]], inputs: { title: "title", items: "items", active_item: "active_item" }, decls: 15, vars: 6, consts: [[1, "breadcrumb-main"], [1, "row"], [1, "col-6"], [1, "breadcrumb-title"], [1, "page-title"], [1, "breadcrumb-list"], [1, "breadcrumb-item", "bcrumb-1"], [3, "routerLink"], [3, "icon"], [1, "breadcrumb-item"], [1, "breadcrumb-item", "active"]], template: function BreadcrumbComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h4", 4);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(6, "div", 2)(7, "ul", 5)(8, "li", 6)(9, "a", 7);
        \u0275\u0275element(10, "app-feather-icons", 8);
        \u0275\u0275elementEnd()();
        \u0275\u0275repeaterCreate(11, BreadcrumbComponent_For_12_Template, 2, 1, "li", 9, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementStart(13, "li", 10);
        \u0275\u0275text(14);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(4);
        \u0275\u0275property("routerLink", "/profile");
        \u0275\u0275advance();
        \u0275\u0275classMap("breadcrumb-icon");
        \u0275\u0275property("icon", "home");
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.items);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.active_item);
      }
    }, dependencies: [RouterLink, FeatherIconsComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbComponent, [{
    type: Component,
    args: [{ selector: "app-breadcrumb", imports: [RouterLink, FeatherIconsComponent], template: `<div class="breadcrumb-main">\r
  <div class="row">\r
    <div class="col-6">\r
      <div class="breadcrumb-title">\r
        <h4 class="page-title">{{title}}</h4>\r
      </div>\r
    </div>\r
    <div class="col-6">\r
      <ul class="breadcrumb-list">\r
        <li class="breadcrumb-item bcrumb-1">\r
          <a [routerLink]="'/profile'">
            <app-feather-icons [icon]="'home'" [class]="'breadcrumb-icon'"></app-feather-icons>\r
          </a>\r
        </li>\r
        @for (item of items; track item) {\r
          <li class="breadcrumb-item">{{item}}</li>\r
        }\r
        <li class="breadcrumb-item active">{{active_item}}</li>\r
      </ul>\r
    </div>\r
  </div>\r
</div>
` }]
  }], () => [], { title: [{
    type: Input
  }], items: [{
    type: Input
  }], active_item: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BreadcrumbComponent, { className: "BreadcrumbComponent", filePath: "src/app/shared/components/breadcrumb/breadcrumb.component.ts", lineNumber: 11 });
})();

export {
  BreadcrumbComponent
};
//# sourceMappingURL=chunk-2TM4C2ER.js.map
