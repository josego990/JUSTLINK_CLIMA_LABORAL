import {
  DomSanitizer
} from "./chunk-WZAKLMWR.js";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgModule,
  Optional,
  SecurityContext,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵinject,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty
} from "./chunk-BHZ7HWLX.js";

// node_modules/angular-feather/fesm2015/angular-feather.js
var _c0 = ["*"];
var Icons = class {
  constructor(icons) {
    this.icons = icons;
  }
};
function uppercamelcase(str) {
  return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (firstLetter) => {
    return firstLetter.toUpperCase();
  }).replace(/[-_]/g, "");
}
var FeatherComponent = class {
  constructor(elem, changeDetector, icons, sanitizer) {
    this.elem = elem;
    this.changeDetector = changeDetector;
    this.icons = icons;
    this.sanitizer = sanitizer;
  }
  ngOnChanges(changes) {
    const icons = Object.assign({}, ...this.icons);
    const svg = icons[uppercamelcase(changes.name.currentValue)] || "";
    if (!svg) {
      console.warn(`Icon not found: ${changes.name.currentValue}
Refer to documentation on https://github.com/michaelbazos/angular-feather`);
    }
    this.elem.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(svg));
    this.changeDetector.markForCheck();
  }
};
FeatherComponent.\u0275fac = function FeatherComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || FeatherComponent)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(Icons), \u0275\u0275directiveInject(DomSanitizer));
};
FeatherComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: FeatherComponent,
  selectors: [["i-feather"], ["feather-icon"]],
  inputs: {
    name: "name"
  },
  standalone: false,
  features: [\u0275\u0275NgOnChangesFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FeatherComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:inline-block;width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}"]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FeatherComponent, [{
    type: Component,
    args: [{
      selector: "i-feather, feather-icon",
      templateUrl: "./feather.component.html",
      styleUrls: ["./feather.component.scss"]
    }]
  }], function() {
    return [{
      type: ElementRef,
      decorators: [{
        type: Inject,
        args: [ElementRef]
      }]
    }, {
      type: ChangeDetectorRef,
      decorators: [{
        type: Inject,
        args: [ChangeDetectorRef]
      }]
    }, {
      type: Icons,
      decorators: [{
        type: Inject,
        args: [Icons]
      }]
    }, {
      type: DomSanitizer,
      decorators: [{
        type: Inject,
        args: [DomSanitizer]
      }]
    }];
  }, {
    name: [{
      type: Input
    }]
  });
})();
var FeatherModule = class _FeatherModule {
  constructor(icons) {
    this.icons = icons;
    if (!this.icons) {
      throw new Error(`No icon provided. Make sure to use 'FeatherModule.pick({ ... })' when importing the module
Refer to documentation on https://github.com/michaelbazos/angular-feather`);
    }
  }
  static pick(icons) {
    return {
      ngModule: _FeatherModule,
      providers: [{
        provide: Icons,
        multi: true,
        useValue: icons
      }]
    };
  }
};
FeatherModule.\u0275fac = function FeatherModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || FeatherModule)(\u0275\u0275inject(Icons, 8));
};
FeatherModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: FeatherModule
});
FeatherModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FeatherModule, [{
    type: NgModule,
    args: [{
      declarations: [FeatherComponent],
      exports: [FeatherComponent]
    }]
  }], function() {
    return [{
      type: Icons,
      decorators: [{
        type: Optional
      }]
    }];
  }, null);
})();

// src/app/shared/components/feather-icons/feather-icons.component.ts
var FeatherIconsComponent = class _FeatherIconsComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function FeatherIconsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FeatherIconsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FeatherIconsComponent, selectors: [["app-feather-icons"]], inputs: { icon: "icon", class: "class" }, decls: 1, vars: 3, consts: [[3, "name"]], template: function FeatherIconsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "i-feather", 0);
      }
      if (rf & 2) {
        \u0275\u0275classMap(ctx.class);
        \u0275\u0275property("name", ctx.icon);
      }
    }, dependencies: [FeatherModule, FeatherComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FeatherIconsComponent, [{
    type: Component,
    args: [{ selector: "app-feather-icons", imports: [FeatherModule], template: '<i-feather [name]="icon!" [class]="class"></i-feather>\r\n' }]
  }], () => [], { icon: [{
    type: Input
  }], class: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FeatherIconsComponent, { className: "FeatherIconsComponent", filePath: "src/app/shared/components/feather-icons/feather-icons.component.ts", lineNumber: 10 });
})();

export {
  FeatherComponent,
  FeatherModule,
  FeatherIconsComponent
};
//# sourceMappingURL=chunk-Y73QBUAC.js.map
