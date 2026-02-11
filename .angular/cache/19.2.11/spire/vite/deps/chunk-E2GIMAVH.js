import {
  MatOptgroup,
  MatOption
} from "./chunk-LUCD6LBG.js";
import {
  MatPseudoCheckboxModule
} from "./chunk-SM5O4Y4I.js";
import {
  MatRippleModule
} from "./chunk-WCRMOZP4.js";
import {
  MatCommonModule
} from "./chunk-7PAZUSFO.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-2IQXLFEV.js";

// node_modules/@angular/material/fesm2022/index-DOxJc1m4.mjs
var MatOptionModule = class _MatOptionModule {
  static ɵfac = function MatOptionModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatOptionModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatOptionModule,
    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
    exports: [MatOption, MatOptgroup]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOptionModule, [{
    type: NgModule,
    args: [{
      imports: [MatRippleModule, MatCommonModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
      exports: [MatOption, MatOptgroup]
    }]
  }], null, null);
})();

export {
  MatOptionModule
};
//# sourceMappingURL=chunk-E2GIMAVH.js.map
