import {
  MatDivider,
  MatDividerModule
} from "./chunk-R26NSZYP.js";
import {
  MatChipsModule
} from "./chunk-4BZTFYMB.js";
import {
  MatRadioButton,
  MatRadioGroup,
  MatRadioModule
} from "./chunk-LHQOYH62.js";
import {
  MatExpansionModule
} from "./chunk-6F5SWNYE.js";
import {
  require_sweetalert2_all
} from "./chunk-IOETN73U.js";
import {
  LanguageService
} from "./chunk-JPZDBAQQ.js";
import {
  TranslateModule,
  TranslatePipe,
  TranslateService
} from "./chunk-J7XWAFEK.js";
import {
  OrganizacionService
} from "./chunk-ITHPGOKL.js";
import {
  MatTableModule
} from "./chunk-GYT2RHCJ.js";
import {
  MatDialogModule
} from "./chunk-FO3S3GOD.js";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "./chunk-DD5M7VBH.js";
import {
  MatOptionModule,
  MatSelectModule
} from "./chunk-QV4DNMNF.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import {
  MatTooltipModule
} from "./chunk-4AQ2Q7XZ.js";
import {
  MatProgressSpinnerModule
} from "./chunk-IMXEXKMD.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHint
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  RangeValueAccessor,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-76BSNCUT.js";
import {
  MatButton,
  MatButtonModule,
  MatRippleModule
} from "./chunk-6OUKOU55.js";
import {
  CommonModule,
  NgForOf,
  NgIf
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-BHZ7HWLX.js";
import {
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/quiz/dynamic-form/dynamic-form.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());

// src/app/quiz/form-builder.service.ts
var FormBuilderService = class _FormBuilderService {
  constructor(fb) {
    this.fb = fb;
  }
  buildForm(formConfig) {
    const formGroup = this.fb.group({});
    const addField = (field) => {
      const validators = [];
      if (field.required)
        validators.push(Validators.required);
      let initial = null;
      switch (field.type) {
        case "radio":
        case "text":
        case "iatext":
          initial = field.value ?? "";
          break;
        case "slider":
          initial = Number(field.value ?? field.min ?? 0);
          if (field.min !== void 0)
            validators.push(Validators.min(Number(field.min)));
          if (field.max !== void 0)
            validators.push(Validators.max(Number(field.max)));
          break;
        default:
          initial = field.value ?? "";
          break;
      }
      formGroup.addControl(field.name, new FormControl(initial, validators));
    };
    if (Array.isArray(formConfig.GranFactores)) {
      for (const gf of formConfig.GranFactores) {
        for (const serie of gf.series ?? []) {
          for (const field of serie.fields ?? [])
            addField(field);
        }
      }
    } else if (Array.isArray(formConfig.series)) {
      for (const serie of formConfig.series) {
        for (const field of serie.fields ?? [])
          addField(field);
      }
    }
    return formGroup;
  }
  static {
    this.\u0275fac = function FormBuilderService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FormBuilderService)(\u0275\u0275inject(FormBuilder));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FormBuilderService, factory: _FormBuilderService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormBuilderService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: FormBuilder }], null);
})();

// src/app/quiz/dynamic-form/dynamic-form.component.ts
var _c0 = [[["", "security-verification", ""]]];
var _c1 = ["[security-verification]"];
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_1_mat_error_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", field_r1.label, " ", \u0275\u0275pipeBind1(2, 2, "MENUITEMS.ALONE.REQUIRED"), " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 30);
    \u0275\u0275element(8, "input", 31);
    \u0275\u0275elementStart(9, "mat-hint", 32);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_1_mat_error_11_Template, 3, 4, "mat-error", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", field_r1.qIndex, ".");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControlName", field_r1.name)("maxlength", field_r1.maxLength || 500);
    \u0275\u0275attribute("aria-label", field_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ((tmp_13_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_13_0.value == null ? null : tmp_13_0.value.length) || 0, "/", field_r1.maxLength || 500, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_14_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_14_0.invalid);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_2_mat_error_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", field_r1.label, " ", \u0275\u0275pipeBind1(2, 2, "MENUITEMS.ALONE.REQUIRED"), " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-form-field", 30);
    \u0275\u0275element(8, "textarea", 33);
    \u0275\u0275elementStart(9, "mat-hint", 32);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_2_mat_error_11_Template, 3, 4, "mat-error", 25);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_12_0;
    let tmp_13_0;
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", field_r1.qIndex, ".");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275property("formControlName", field_r1.name)("maxlength", field_r1.maxLength || 800);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ((tmp_12_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_12_0.value == null ? null : tmp_12_0.value.length) || 0, "/", field_r1.maxLength || 800, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_13_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_13_0.invalid);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_mat_radio_button_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-radio-button", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r3 = ctx.$implicit;
    \u0275\u0275property("value", option_r3.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r3.label, " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "mat-icon", 15);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "MENUITEMS.ALONE.REQUIRED"), " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-radio-group", 34);
    \u0275\u0275template(8, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_mat_radio_button_8_Template, 2, 2, "mat-radio-button", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_div_9_Template, 5, 3, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", field_r1.qIndex, ".");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("formControlName", field_r1.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", field_r1.options)("ngForTrackBy", ctx_r1.trackByIdx);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_13_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_13_0.invalid);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 44);
    \u0275\u0275element(1, "i", 45);
    \u0275\u0275elementStart(2, "em", 46);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r5);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const field_r1 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", field_r1.label, " ", \u0275\u0275pipeBind1(2, 2, "MENUITEMS.ALONE.REQUIRED"), " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 39)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "input", 40);
    \u0275\u0275listener("input", function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_Template_input_input_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const field_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onSliderInput(field_r1.name, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 41);
    \u0275\u0275template(9, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_span_9_Template, 4, 1, "span", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 43);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_div_12_Template, 3, 4, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_10_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_17_0;
    let tmp_18_0;
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", field_r1.qIndex, ".");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.label);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.getRangeBackground(field_r1.name, (tmp_10_0 = field_r1.min) !== null && tmp_10_0 !== void 0 ? tmp_10_0 : 0, (tmp_10_0 = field_r1.max) !== null && tmp_10_0 !== void 0 ? tmp_10_0 : 100));
    \u0275\u0275property("formControlName", field_r1.name);
    \u0275\u0275attribute("min", (tmp_12_0 = field_r1.min) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : 0)("max", (tmp_13_0 = field_r1.max) !== null && tmp_13_0 !== void 0 ? tmp_13_0 : 100)("step", (tmp_14_0 = field_r1.step) !== null && tmp_14_0 !== void 0 ? tmp_14_0 : 1);
    \u0275\u0275advance();
    \u0275\u0275styleProp("grid-template-columns", "repeat(" + ctx_r1.getTickCount(field_r1) + ", 1fr)");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getTicks(field_r1));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Selecci\xF3n: ", (tmp_17_0 = (tmp_17_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_17_0.value) !== null && tmp_17_0 !== void 0 ? tmp_17_0 : (tmp_17_0 = field_r1.min) !== null && tmp_17_0 !== void 0 ? tmp_17_0 : 0, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_18_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_18_0.invalid);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_mat_radio_button_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-radio-button", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    \u0275\u0275property("value", option_r6.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r6.label, " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "mat-icon", 15);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(4, 1, "MENUITEMS.ALONE.REQUIRED"), " ");
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "mat-radio-group", 34);
    \u0275\u0275template(8, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_mat_radio_button_8_Template, 2, 2, "mat-radio-button", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275template(9, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_div_9_Template, 5, 3, "div", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const field_r1 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", field_r1.qIndex, ".");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(field_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("formControlName", field_r1.name);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", field_r1.options)("ngForTrackBy", ctx_r1.trackByIdx);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_13_0 = ctx_r1.form.get(field_r1.name)) == null ? null : tmp_13_0.invalid);
  }
}
function DynamicFormComponent_section_3_div_9_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_1_Template, 12, 8, "ng-container", 25)(2, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_2_Template, 12, 7, "ng-container", 25)(3, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_3_Template, 10, 6, "ng-container", 25)(4, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_4_Template, 13, 13, "ng-container", 25)(5, DynamicFormComponent_section_3_div_9_ng_container_6_ng_container_5_Template, 10, 6, "ng-container", 25);
    \u0275\u0275element(6, "mat-divider", 26);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const field_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r1.type === "text");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r1.type === "iatext");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r1.type === "radio");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r1.type === "slider");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", field_r1.type === "select" || field_r1.type === "selectdem");
  }
}
function DynamicFormComponent_section_3_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "mat-card", 20)(2, "mat-card-header", 21)(3, "mat-card-title", 22);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "mat-card-content", 23);
    \u0275\u0275template(6, DynamicFormComponent_section_3_div_9_ng_container_6_Template, 7, 5, "ng-container", 24);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const serie_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", serie_r7.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", serie_r7.fields)("ngForTrackBy", ctx_r1.trackByIdx);
  }
}
function DynamicFormComponent_section_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 11)(1, "div", 12);
    \u0275\u0275element(2, "div", 13);
    \u0275\u0275elementStart(3, "div", 14)(4, "mat-icon", 15);
    \u0275\u0275text(5, "layers");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h2", 16);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "div", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, DynamicFormComponent_section_3_div_9_Template, 7, 3, "div", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const gf_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", gf_r8.Etiqueta);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(gf_r8.Etiqueta);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", gf_r8.series)("ngForTrackBy", ctx_r1.trackByIdx);
  }
}
function DynamicFormComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275projection(1);
    \u0275\u0275elementEnd();
  }
}
var DynamicFormComponent = class _DynamicFormComponent {
  constructor(formBuilderService, languageService, translate, organizacionService) {
    this.formBuilderService = formBuilderService;
    this.languageService = languageService;
    this.translate = translate;
    this.organizacionService = organizacionService;
    this.requireTurnstile = false;
    this.turnstileToken = "";
    this.turnstileResetRequested = new EventEmitter();
    this.idFlujo = 0;
    this.btnIsDisabled = false;
    this.isSubmitting = false;
    this.trackByIdx = (_, __) => _;
  }
  ngOnInit() {
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((l) => this.translate.use(l));
    this.langStoreValue = this.lang;
    console.log("this.formconfig:: ", this.formConfig);
    this.form = this.formBuilderService.buildForm(this.formConfig);
    this.idFlujo = this.formConfig.Id;
    this.asignarIndicesGlobales();
  }
  /** Progreso visual de preguntas, sin controles técnicos como Turnstile. */
  get totalFields() {
    return this.getActiveSurveyFields().length;
  }
  get answeredCount() {
    return this.getActiveSurveyFields().filter((field) => this.isFieldAnswered(field)).length;
  }
  get progress() {
    if (!this.totalFields)
      return 0;
    return Math.max(0, Math.min(100, Math.round(this.answeredCount / this.totalFields * 100)));
  }
  getActiveSurveyFields() {
    const fields = [];
    const grandFactors = this.formConfig?.GranFactores;
    const series = Array.isArray(grandFactors) && grandFactors.length > 0 ? grandFactors.flatMap((grandFactor) => grandFactor?.series ?? []) : this.formConfig?.series ?? [];
    for (const serie of series) {
      for (const field of serie?.fields ?? []) {
        if (field?.name && field?.is_active !== 0 && ["radio", "text", "iatext", "slider", "select", "selectdem"].includes(field.type)) {
          fields.push(field);
        }
      }
    }
    const uniqueFields = /* @__PURE__ */ new Map();
    fields.forEach((field) => uniqueFields.set(field.name, field));
    return Array.from(uniqueFields.values());
  }
  isFieldAnswered(field) {
    const control = this.form?.get(field.name);
    if (!control) {
      return false;
    }
    const value = control.value;
    if (field.type === "slider") {
      return control.dirty && value !== null && value !== void 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== void 0 && String(value).trim() !== "";
  }
  onSubmit() {
    if (this.form.invalid) {
      this.scrollToFirstInvalid();
      import_sweetalert2.default.fire({
        icon: "error",
        title: this.translate.instant("MENUITEMS.DYNAMIC.INVALIDFORM"),
        text: this.translate.instant("MENUITEMS.DYNAMIC.INVALIDFORMMESSAGE"),
        timer: 3e3,
        showConfirmButton: false
      });
      return;
    }
    if (this.requireTurnstile && !this.turnstileToken) {
      import_sweetalert2.default.fire({
        icon: "warning",
        title: this.translate.instant("MENUITEMS.TURNSTILE.TITLE"),
        text: this.translate.instant("MENUITEMS.TURNSTILE.REQUIRED")
      });
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    const respuestas = this.form.value;
    console.log("respuestas:: ", respuestas);
    const entries = Object.entries(respuestas);
    const g_d = {
      res: [],
      head: [{ IdEmpleado: this.idEmpleado }, { IdFlujo: this.idFlujo }],
      IdEncuestaEmpleado: this.idEncuestaEmpleado,
      Estado: "Contestada",
      FechaInicio: null,
      FechaFinalizacion: /* @__PURE__ */ new Date()
    };
    entries.forEach(([name, valor]) => {
      console.log("name,valor: ", name + ", " + valor);
      if (name.substring(0, 6) == "seldem") {
        const newid = this.getFieldIdByName(name);
        const tipo = name.substring(0, 6);
        g_d.res.push({ idPregunta: (newid ?? "").toString(), valor, tipo });
      } else {
        const newid = this.getFieldIdByName(name);
        const tipo = name.substring(0, 3);
        g_d.res.push({ idPregunta: (newid ?? "").toString(), valor, tipo });
      }
    });
    import_sweetalert2.default.fire({
      title: this.translate.instant("MENUITEMS.DYNAMIC.UPLOAD"),
      html: this.translate.instant("MENUITEMS.DYNAMIC.SAVING"),
      timerProgressBar: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => import_sweetalert2.default.showLoading()
    });
    this.isSubmitting = true;
    this.organizacionService.savePreguntas(g_d, this.turnstileToken).then((resilxis) => {
      if (resilxis.data.message === "Respuestas guardadas y encuesta actualizada correctamente") {
        import_sweetalert2.default.fire({
          icon: "success",
          title: this.translate.instant("MENUITEMS.DYNAMIC.SURVEYSUCCESS"),
          text: this.translate.instant("MENUITEMS.DYNAMIC.THANKS"),
          timer: 3e3,
          showConfirmButton: false
        });
        this.btnIsDisabled = true;
        this.form.reset();
        this.form.disable();
      }
    }).catch((err) => {
      this.turnstileResetRequested.emit();
      import_sweetalert2.default.fire({
        icon: "error",
        title: this.translate.instant("MENUITEMS.DYNAMIC.SURVEYERROR"),
        text: err?.response?.data?.message || err?.message || String(err),
        timer: 3e3,
        showConfirmButton: false
      });
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
  getRangeBackground(ctrlName, min, max) {
    const val = Number(this.form.get(ctrlName)?.value ?? min);
    const pct = (val - min) * 100 / Math.max(1, max - min);
    const active = "#f58b2a";
    const base = "#f2e4d3";
    return `linear-gradient(to right, ${active} 0%, ${active} ${pct}%, ${base} ${pct}%, ${base} 100%)`;
  }
  // cuántas marcas mostrar (una por paso, acotando para no saturar)
  getTickCount(field) {
    const min = Number(field.min ?? 0);
    const max = Number(field.max ?? 10);
    const step = Math.max(1, Number(field.step ?? 1));
    return Math.min(20, Math.floor((max - min) / step) + 1);
  }
  getTicks(field) {
    const min = Number(field.min ?? 0);
    const max = Number(field.max ?? 10);
    const step = Math.max(1, Number(field.step ?? 1));
    const ticks = [];
    for (let v = min; v <= max && ticks.length < 20; v += step)
      ticks.push(v);
    return ticks;
  }
  scrollToFirstInvalid() {
    const el = document.querySelector(".ng-invalid[formcontrolname]");
    if (el?.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus?.();
    }
  }
  onSliderInput(ctrlName, ev) {
    const v = Number(ev.target.value);
    this.form.get(ctrlName)?.setValue(v, { emitEvent: true });
  }
  getFieldIdByName(targetName) {
    for (const serie of this.formConfig.series) {
      const match = serie.fields.find((field) => field.name === targetName);
      if (match)
        return match.id;
    }
    return void 0;
  }
  updateClimaEncuesta(data) {
    this.organizacionService.updateClimaEncuesta(data);
  }
  asignarIndicesGlobales() {
    if (!this.formConfig?.GranFactores)
      return;
    let counter = 0;
    for (const gf of this.formConfig.GranFactores) {
      for (const serie of gf.series ?? []) {
        for (const field of serie.fields ?? []) {
          if (["radio", "text", "iatext", "slider", "select", "selectdem"].includes(field.type)) {
            counter += 1;
            field.qIndex = counter;
          }
        }
      }
    }
  }
  translateRadioOptionLabels(config, lang) {
    this.lang = lang;
    this.langStoreValue = this.lang;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((lang2) => {
      this.translate.use(lang2);
    });
    const translationMap = {
      "TOTALMENTE DE ACUERDO": "TOTALLY AGREE",
      "DE ACUERDO": "AGREE",
      "EN DESACUERDO": "DISAGREE",
      "TOTALMENTE EN DESACUERDO": "TOTALLY DISAGREE"
    };
    const reverseMap = Object.fromEntries(Object.entries(translationMap).map(([es, en]) => [en.toUpperCase(), es]));
    if (!config?.fields)
      return;
    config.fields.forEach((field) => {
      if (field.type === "radio" && Array.isArray(field.options)) {
        field.options.forEach((option) => {
          const label = option.label?.trim().toUpperCase();
          if (lang === "en" && translationMap[label]) {
            option.label = translationMap[label];
          } else if (lang === "es" && reverseMap[label]) {
            option.label = reverseMap[label];
          }
        });
      }
    });
  }
  getSeriesGroupedByGranFactor() {
    if (!this.formConfig?.series)
      return [];
    const grupos = [];
    this.formConfig.series.forEach((serie) => {
      let grupo = grupos.find((g) => g.idGranFactor === serie.IdGranFactor);
      if (!grupo) {
        grupo = { idGranFactor: serie.IdGranFactor, etiqueta: serie.Etiqueta, series: [] };
        grupos.push(grupo);
      }
      grupo.series.push(serie);
    });
    return grupos;
  }
  static {
    this.\u0275fac = function DynamicFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DynamicFormComponent)(\u0275\u0275directiveInject(FormBuilderService), \u0275\u0275directiveInject(LanguageService), \u0275\u0275directiveInject(TranslateService), \u0275\u0275directiveInject(OrganizacionService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DynamicFormComponent, selectors: [["app-dynamic-form"]], inputs: { formConfig: "formConfig", idEmpleado: "idEmpleado", idEncuestaEmpleado: "idEncuestaEmpleado", lang: "lang", requireTurnstile: "requireTurnstile", turnstileToken: "turnstileToken" }, outputs: { turnstileResetRequested: "turnstileResetRequested" }, ngContentSelectors: _c1, decls: 17, vars: 15, consts: [[1, "df-body"], [1, "df-container"], ["novalidate", "", 3, "formGroup"], ["class", "gf-card", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "security-verification", 4, "ngIf"], [1, "submit-bar"], [1, "submit-bar__progress"], [1, "progress-line"], [1, "progress-line__fill"], [1, "progress-text"], ["type", "submit", "mat-raised-button", "", "color", "primary", 3, "click", "disabled"], [1, "gf-card"], ["role", "group", 1, "gf-card__header"], [1, "gf-card__accent"], [1, "gf-card__titles"], ["aria-hidden", "true"], [1, "gf-card__title"], [1, "gf-card__meta"], ["class", "serie", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "serie"], [1, "serie-card"], [1, "serie-card__header"], [1, "serie-card__title"], [1, "serie-card__content"], [4, "ngFor", "ngForOf", "ngForTrackBy"], [4, "ngIf"], [1, "q-divider"], [1, "q-block"], [1, "q-title"], [1, "q-index"], ["appearance", "outline", 1, "w-100"], ["matInput", "", 3, "formControlName", "maxlength"], ["align", "end"], ["matInput", "", "rows", "3", 3, "formControlName", "maxlength"], [1, "q-radio-group", 3, "formControlName"], ["class", "q-radio", 3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "q-error", 4, "ngIf"], [1, "q-radio", 3, "value"], [1, "q-error"], [1, "q-block", "slider-block"], ["type", "range", 1, "q-range", 3, "input", "formControlName"], [1, "q-ticks"], ["class", "q-tick", 4, "ngFor", "ngForOf"], [1, "q-range-value", 2, "font-size", "20px"], [1, "q-tick"], [1, "q-tick-mark"], [1, "q-tick-label"], [1, "security-verification"]], template: function DynamicFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c0);
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "form", 2);
        \u0275\u0275template(3, DynamicFormComponent_section_3_Template, 10, 4, "section", 3)(4, DynamicFormComponent_div_4_Template, 2, 0, "div", 4);
        \u0275\u0275elementStart(5, "div", 5)(6, "div", 6)(7, "div", 7);
        \u0275\u0275element(8, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 9);
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "button", 10);
        \u0275\u0275listener("click", function DynamicFormComponent_Template_button_click_12_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275elementStart(13, "mat-icon");
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275text(15);
        \u0275\u0275pipe(16, "translate");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.formConfig.GranFactores)("ngForTrackBy", ctx.trackByIdx);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.requireTurnstile);
        \u0275\u0275advance(4);
        \u0275\u0275styleProp("width", ctx.progress, "%");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate2(" ", ctx.progress, "% ", \u0275\u0275pipeBind1(11, 11, "MENUITEMS.ALONE.COMPLETED"), " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.form.invalid || ctx.btnIsDisabled || ctx.isSubmitting || ctx.requireTurnstile && !ctx.turnstileToken);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isSubmitting ? "sync" : "send");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(16, 13, "MENUITEMS.ALONE.SEND"), " ");
      }
    }, dependencies: [
      MatDialogModule,
      MatTableModule,
      MatIconModule,
      MatIcon,
      MatExpansionModule,
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      RangeValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      MaxLengthValidator,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      MatDividerModule,
      MatDivider,
      MatFormFieldModule,
      MatFormField,
      MatHint,
      MatError,
      MatTooltipModule,
      MatChipsModule,
      MatOptionModule,
      MatRippleModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatRadioGroup,
      MatRadioButton,
      MatInputModule,
      MatInput,
      MatSelectModule,
      CommonModule,
      NgForOf,
      NgIf,
      MatButtonModule,
      MatButton,
      MatCardModule,
      MatCard,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      TranslateModule,
      TranslatePipe
    ], styles: ['\n\n[_nghost-%COMP%] {\n  --jl-navy: #112d40;\n  --jl-navy-soft: #173d56;\n  --jl-orange: #f58b2a;\n  --jl-orange-strong: #d97018;\n  --jl-orange-soft: #fff0df;\n  --jl-cream: #fffaf4;\n  --jl-surface: #fffdf9;\n  --jl-border: #eadfce;\n  --jl-border-strong: #dec9ae;\n  --jl-text: #1f3748;\n  --jl-muted: #6e7d87;\n  --jl-danger: #c03945;\n  display: block;\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.df-body[_ngcontent-%COMP%] {\n  padding: 6px 12px 92px;\n  background: transparent;\n}\n.df-container[_ngcontent-%COMP%] {\n  max-width: 1080px;\n  margin: 0 auto;\n}\n.w-100[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.gf-card[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  margin: 18px 0 22px;\n  border: 1px solid var(--jl-border);\n  border-radius: 8px;\n  background: var(--jl-surface);\n  box-shadow: 0 10px 26px rgba(18, 43, 61, 0.07);\n}\n.gf-card__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 16px 18px;\n  border-bottom: 1px solid #efe2d3;\n  background:\n    linear-gradient(\n      90deg,\n      #fff4e6 0%,\n      #fffdf9 100%);\n}\n.gf-card__accent[_ngcontent-%COMP%] {\n  align-self: stretch;\n  width: 5px;\n  min-height: 42px;\n  border-radius: 6px;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 4px rgba(245, 139, 42, 0.12);\n}\n.gf-card__titles[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  gap: 10px;\n}\n.gf-card__titles[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  display: inline-grid;\n  flex: 0 0 auto;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: var(--jl-orange-strong);\n  border-radius: 6px;\n  background: var(--jl-orange-soft);\n  font-family: "Material Icons" !important;\n  font-size: 20px;\n  line-height: 32px;\n}\n.gf-card__title[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  margin: 0;\n  color: var(--jl-navy);\n  font-size: 1.12rem;\n  font-weight: 780;\n  line-height: 1.2;\n}\n.gf-card__meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--jl-muted);\n  font-size: 0.85rem;\n}\n.serie[_ngcontent-%COMP%] {\n  padding: 14px 16px 18px;\n}\n.serie-card[_ngcontent-%COMP%] {\n  overflow: hidden;\n  border: 1px solid #eadfce;\n  border-radius: 8px;\n  background: #ffffff;\n  box-shadow: none;\n}\n.serie-card__header[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-bottom: 1px solid #f0e6da;\n  background: #fffaf4;\n}\n.serie-card__title[_ngcontent-%COMP%] {\n  color: var(--jl-navy);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-size: 1rem;\n  font-weight: 750;\n  line-height: 1.25;\n}\n.serie-card__content[_ngcontent-%COMP%] {\n  padding: 16px 18px 8px;\n}\n.q-block[_ngcontent-%COMP%] {\n  margin: 10px 0 16px;\n}\n.q-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.55rem;\n  margin-bottom: 12px;\n  color: var(--jl-text);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-size: 17px;\n  font-weight: 720;\n  line-height: 1.35;\n}\n.q-index[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  color: var(--jl-orange-strong);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-weight: 820;\n}\n.q-radio-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px 18px;\n}\n.q-radio[_ngcontent-%COMP%] {\n  --mdc-radio-selected-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-hover-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-focus-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-pressed-icon-color: var(--jl-orange-strong);\n  --mdc-radio-unselected-hover-icon-color: var(--jl-navy);\n  color: #3e5361;\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.q-radio[_ngcontent-%COMP%]     .mdc-form-field {\n  align-items: center;\n}\n[_nghost-%COMP%]     .q-radio .mdc-form-field, \n[_nghost-%COMP%]     .q-radio .mdc-label, \n[_nghost-%COMP%]     .gf-card__title, \n[_nghost-%COMP%]     .serie-card__title, \n[_nghost-%COMP%]     .mat-mdc-card-title, \n[_nghost-%COMP%]     .mat-mdc-card-subtitle, \n[_nghost-%COMP%]     .mat-mdc-card-content, \n[_nghost-%COMP%]     .mat-mdc-card-content *, \n[_nghost-%COMP%]     .q-title, \n[_nghost-%COMP%]     .q-title *, \n[_nghost-%COMP%]     .q-index, \n[_nghost-%COMP%]     .mat-mdc-radio-button .mdc-form-field, \n[_nghost-%COMP%]     .mat-mdc-radio-button .mdc-label, \n[_nghost-%COMP%]     .mat-mdc-form-field, \n[_nghost-%COMP%]     .mat-mdc-input-element, \n[_nghost-%COMP%]     .mat-mdc-select-value, \n[_nghost-%COMP%]     .mdc-button__label {\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n}\n.q-error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n  color: var(--jl-danger);\n  font-size: 0.9rem;\n  font-weight: 650;\n}\n.q-error[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  display: none;\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.q-divider[_ngcontent-%COMP%] {\n  margin: 14px 0;\n  border-top-color: #efe2d3;\n}\n.q-range[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: 6px;\n  border-radius: 999px;\n  appearance: none;\n  background: #f1e4d5;\n  outline: none;\n  pointer-events: auto;\n}\n.q-range[_ngcontent-%COMP%]::-webkit-slider-thumb {\n  width: 19px;\n  height: 19px;\n  cursor: pointer;\n  border-radius: 50%;\n  appearance: none;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);\n}\n.q-range[_ngcontent-%COMP%]::-moz-range-thumb {\n  width: 19px;\n  height: 19px;\n  cursor: pointer;\n  border: none;\n  border-radius: 50%;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);\n}\n.q-ticks[_ngcontent-%COMP%] {\n  display: grid;\n  align-items: start;\n  margin-top: 10px;\n}\n.q-tick[_ngcontent-%COMP%] {\n  position: relative;\n  text-align: center;\n}\n.q-tick-mark[_ngcontent-%COMP%] {\n  display: block;\n  width: 1px;\n  height: 8px;\n  margin: 0 auto 3px;\n  background: #d2c1ad;\n}\n.q-tick-label[_ngcontent-%COMP%] {\n  color: #6e7d87;\n  font-size: 12px;\n  font-style: normal;\n}\n.q-range-value[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  color: var(--jl-navy);\n  font-weight: 700;\n}\n.security-verification[_ngcontent-%COMP%] {\n  max-width: 1080px;\n  margin: 2px auto 12px;\n  padding: 14px 16px;\n  border: 1px solid var(--jl-border);\n  border-radius: 8px;\n  background: rgba(255, 253, 249, 0.9);\n  box-shadow: 0 8px 20px rgba(18, 43, 61, 0.045);\n}\n.submit-bar[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 12px 16px;\n  border-top: 1px solid var(--jl-border);\n  background: rgba(255, 250, 244, 0.96);\n  box-shadow: 0 -10px 28px rgba(18, 43, 61, 0.1);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.submit-bar__progress[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: min(720px, 78vw);\n}\n.progress-line[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 8px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #f2e4d3;\n}\n.progress-line__fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--jl-orange) 0%,\n      #ffb052 100%);\n}\n.progress-text[_ngcontent-%COMP%] {\n  min-width: 122px;\n  color: var(--jl-navy);\n  font-weight: 760;\n  text-align: right;\n}\n[_nghost-%COMP%]     .mat-mdc-form-field {\n  --mdc-outlined-text-field-outline-color: #dac7af;\n  --mdc-outlined-text-field-hover-outline-color: #bb9165;\n  --mdc-outlined-text-field-focus-outline-color: var(--jl-orange-strong);\n  --mdc-outlined-text-field-focus-label-text-color: var(--jl-orange-strong);\n  --mat-form-field-focus-select-arrow-color: var(--jl-orange-strong);\n}\n[_nghost-%COMP%]     .submit-bar .mat-mdc-raised-button.mat-primary {\n  min-height: 42px;\n  padding: 0 22px;\n  color: var(--jl-navy);\n  border-radius: 6px;\n  background-color: var(--jl-orange);\n  box-shadow: 0 7px 16px rgba(217, 112, 24, 0.18);\n  font-weight: 760;\n}\n[_nghost-%COMP%]     .submit-bar .mat-mdc-raised-button.mat-primary:hover:not(:disabled) {\n  background-color: var(--jl-orange-strong);\n}\n[_nghost-%COMP%]     .submit-bar .mat-mdc-raised-button.mat-primary:disabled {\n  color: #8e958f;\n  background-color: #ece5dd;\n  box-shadow: none;\n}\n@media (max-width: 720px) {\n  .df-body[_ngcontent-%COMP%] {\n    padding: 4px 10px 118px;\n  }\n  .gf-card__header[_ngcontent-%COMP%], \n   .serie-card__content[_ngcontent-%COMP%] {\n    padding: 14px;\n  }\n  .serie[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .q-radio-group[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 8px;\n  }\n  .submit-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 9px;\n  }\n  .submit-bar__progress[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .progress-text[_ngcontent-%COMP%] {\n    min-width: auto;\n    text-align: center;\n  }\n}\n.dark[_nghost-%COMP%], .dark   [_nghost-%COMP%], \n.dark-theme[_nghost-%COMP%], .dark-theme   [_nghost-%COMP%] {\n  --jl-navy: #e1e8ee;\n  --jl-navy-soft: #cbd5df;\n  --jl-surface: #171d25;\n  --jl-border: #354452;\n  --jl-border-strong: #465564;\n  --jl-text: #e1e8ee;\n  --jl-muted: #9cabb7;\n}\n.dark[_nghost-%COMP%]   .gf-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .gf-card[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .gf-card[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .gf-card[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .serie-card[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .serie-card[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .serie-card[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .serie-card[_ngcontent-%COMP%] {\n  border-color: #354452;\n  background: #171d25;\n}\n.dark[_nghost-%COMP%]   .gf-card__header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .gf-card__header[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .gf-card__header[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .gf-card__header[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .serie-card__header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .serie-card__header[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .serie-card__header[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .serie-card__header[_ngcontent-%COMP%] {\n  border-color: #354452;\n  background: #202832;\n}\n.dark[_nghost-%COMP%]   .gf-card__title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .gf-card__title[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .gf-card__title[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .gf-card__title[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .serie-card__title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .serie-card__title[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .serie-card__title[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .serie-card__title[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .q-title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .q-title[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .q-title[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .q-title[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .progress-text[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .progress-text[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .progress-text[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .progress-text[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .q-range-value[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .q-range-value[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .q-range-value[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .q-range-value[_ngcontent-%COMP%] {\n  color: #e1e8ee;\n}\n.dark[_nghost-%COMP%]   .q-radio[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .q-radio[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .q-radio[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .q-radio[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .q-tick-label[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .q-tick-label[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .q-tick-label[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .q-tick-label[_ngcontent-%COMP%] {\n  color: #c7d1da;\n}\n.dark[_nghost-%COMP%]   .q-divider[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .q-divider[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .q-divider[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .q-divider[_ngcontent-%COMP%] {\n  border-top-color: #354452;\n}\n.dark[_nghost-%COMP%]   .security-verification[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .security-verification[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .security-verification[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .security-verification[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .submit-bar[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .submit-bar[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .submit-bar[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .submit-bar[_ngcontent-%COMP%] {\n  border-color: #354452;\n  background: rgba(17, 24, 32, 0.96);\n}\n.dark[_nghost-%COMP%]   .progress-line[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .progress-line[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .progress-line[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .progress-line[_ngcontent-%COMP%] {\n  background: #29323c;\n}\n/*# sourceMappingURL=dynamic-form.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynamicFormComponent, [{
    type: Component,
    args: [{ selector: "app-dynamic-form", imports: [
      MatDialogModule,
      MatTableModule,
      MatIconModule,
      MatExpansionModule,
      FormsModule,
      ReactiveFormsModule,
      MatDividerModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatChipsModule,
      MatOptionModule,
      MatRippleModule,
      MatProgressSpinnerModule,
      MatRadioModule,
      MatInputModule,
      MatSelectModule,
      CommonModule,
      MatButtonModule,
      MatCardModule,
      TranslateModule
    ], template: `
  <div class="df-body">

    <!-- Contenedor principal -->
    <div class="df-container">
      <form [formGroup]="form" novalidate>

        <!-- Gran Factores -->
       <section class="gf-card" *ngFor="let gf of formConfig!.GranFactores; trackBy: trackByIdx">
          <div class="gf-card__header" role="group" [attr.aria-label]="gf.Etiqueta">
            <div class="gf-card__accent"></div>
            <div class="gf-card__titles">
              <mat-icon aria-hidden="true">layers</mat-icon>
              <h2 class="gf-card__title">{{ gf.Etiqueta }}</h2>
              <div class="gf-card__meta">
               
              </div>
            </div>
          </div>

          <!-- Factores -->
          <div class="serie" *ngFor="let serie of gf.series; trackBy: trackByIdx">
            <mat-card class="serie-card">
              <mat-card-header class="serie-card__header">
                <mat-card-title class="serie-card__title">
                  {{ serie.label }}
                </mat-card-title>
              </mat-card-header>

              <mat-card-content class="serie-card__content">

                <!-- Preguntas -->
                <ng-container *ngFor="let field of serie.fields; let i = index; trackBy: trackByIdx">

                  <!-- TEXT -->
                  <ng-container *ngIf="field.type === 'text'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <mat-form-field appearance="outline" class="w-100">
                        <input
                          matInput
                          [formControlName]="field.name"
                          [attr.aria-label]="field.label"
                          [maxlength]="field.maxLength || 500"
                        />
                        <mat-hint align="end">
                          {{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 500 }}
                        </mat-hint>
                        <mat-error *ngIf="form.get(field.name)?.invalid">
                          {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </ng-container>

                  <!-- IATEXT -->
                  <ng-container *ngIf="field.type === 'iatext'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <mat-form-field appearance="outline" class="w-100">
                        <textarea
                          matInput
                          rows="3"
                          [formControlName]="field.name"
                          [maxlength]="field.maxLength || 800"
                        ></textarea>
                        <mat-hint align="end">
                          {{ (form.get(field.name)?.value?.length || 0) }}/{{ field.maxLength || 800 }}
                        </mat-hint>
                        <mat-error *ngIf="form.get(field.name)?.invalid">
                          {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                        </mat-error>
                      </mat-form-field>
                    </div>
                  </ng-container>


                  <!-- RADIO -->
                  <ng-container *ngIf="field.type === 'radio'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>
                      <mat-radio-group [formControlName]="field.name" class="q-radio-group">
                        <mat-radio-button *ngFor="let option of field.options; trackBy: trackByIdx"
                                          [value]="option.value" class="q-radio">
                          {{ option.label }}
                        </mat-radio-button>
                      </mat-radio-group>
                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        <mat-icon aria-hidden="true">error</mat-icon>
                        {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>

                  <!-- SLIDER -->
                  <ng-container *ngIf="field.type === 'slider'">
                    <div class="q-block slider-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>

                      <input class="q-range"
                            type="range"
                            [formControlName]="field.name"
                            [attr.min]="(field.min ?? 0)"
                            [attr.max]="(field.max ?? 100)"
                            [attr.step]="(field.step ?? 1)"
                            (input)="onSliderInput(field.name, $event)"
                            [style.background]="getRangeBackground(field.name, field.min ?? 0, field.max ?? 100)" />

                      <!-- Regla / ticks -->
                      <div class="q-ticks" [style.gridTemplateColumns]="'repeat(' + getTickCount(field) + ', 1fr)'">
                        <span *ngFor="let t of getTicks(field); let i = index"
                              class="q-tick">
                          <i class="q-tick-mark"></i>
                          <em class="q-tick-label">{{ t }}</em>
                        </span>
                      </div>

                      <div class="q-range-value" style="font-size: 20px">
                        Selecci\xF3n: {{ form.get(field.name)?.value ?? (field.min ?? 0) }}
                      </div>

                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        {{ field.label }} {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>

                  <!-- SELECT (lista y lista demogr\xE1fica) -->
                  <ng-container *ngIf="field.type === 'select' || field.type === 'selectdem'">
                    <div class="q-block">
                      <div class="q-title">
                        <span class="q-index">{{ field.qIndex }}.</span>
                        <span>{{ field.label }}</span>
                      </div>
                      <mat-radio-group [formControlName]="field.name" class="q-radio-group">
                        <mat-radio-button *ngFor="let option of field.options; trackBy: trackByIdx"
                                          [value]="option.value" class="q-radio">
                          {{ option.label }}
                        </mat-radio-button>
                      </mat-radio-group>
                      <div class="q-error" *ngIf="form.get(field.name)?.invalid">
                        <mat-icon aria-hidden="true">error</mat-icon>
                        {{ 'MENUITEMS.ALONE.REQUIRED' | translate }}
                      </div>
                    </div>
                  </ng-container>


                  <mat-divider class="q-divider"></mat-divider>
                </ng-container>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <div class="security-verification" *ngIf="requireTurnstile">
          <ng-content select="[security-verification]"></ng-content>
        </div>

        <!-- Barra fija de env\xEDo -->
        <div class="submit-bar">
          <div class="submit-bar__progress">
            <div class="progress-line">
              <div class="progress-line__fill" [style.width.%]="progress"></div>
            </div>
            <div class="progress-text">
              {{ progress }}% {{ 'MENUITEMS.ALONE.COMPLETED' | translate }}
            </div>
          </div>

          <button type="submit" mat-raised-button color="primary"
                  [disabled]="form.invalid || btnIsDisabled || isSubmitting || (requireTurnstile && !turnstileToken)"
                  (click)="onSubmit()">
            <mat-icon>{{ isSubmitting ? 'sync' : 'send' }}</mat-icon>
            {{ 'MENUITEMS.ALONE.SEND' | translate }}
          </button>
        </div>

      </form>
    </div>
  </div>
  `, styles: ['/* angular:styles/component:scss;8d5458b261e9b582e4c094708c06801df8d8f12a350dbe8dbc40703f1b3d2336;/Users/juanjosegonzalez/Documents/myapps/justlink/JL_CLIMAS_ANGULAR_19/src/app/quiz/dynamic-form/dynamic-form.component.ts */\n:host {\n  --jl-navy: #112d40;\n  --jl-navy-soft: #173d56;\n  --jl-orange: #f58b2a;\n  --jl-orange-strong: #d97018;\n  --jl-orange-soft: #fff0df;\n  --jl-cream: #fffaf4;\n  --jl-surface: #fffdf9;\n  --jl-border: #eadfce;\n  --jl-border-strong: #dec9ae;\n  --jl-text: #1f3748;\n  --jl-muted: #6e7d87;\n  --jl-danger: #c03945;\n  display: block;\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.df-body {\n  padding: 6px 12px 92px;\n  background: transparent;\n}\n.df-container {\n  max-width: 1080px;\n  margin: 0 auto;\n}\n.w-100 {\n  width: 100%;\n}\n.gf-card {\n  position: relative;\n  overflow: hidden;\n  margin: 18px 0 22px;\n  border: 1px solid var(--jl-border);\n  border-radius: 8px;\n  background: var(--jl-surface);\n  box-shadow: 0 10px 26px rgba(18, 43, 61, 0.07);\n}\n.gf-card__header {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 16px 18px;\n  border-bottom: 1px solid #efe2d3;\n  background:\n    linear-gradient(\n      90deg,\n      #fff4e6 0%,\n      #fffdf9 100%);\n}\n.gf-card__accent {\n  align-self: stretch;\n  width: 5px;\n  min-height: 42px;\n  border-radius: 6px;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 4px rgba(245, 139, 42, 0.12);\n}\n.gf-card__titles {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  gap: 10px;\n}\n.gf-card__titles mat-icon {\n  display: inline-grid;\n  flex: 0 0 auto;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: var(--jl-orange-strong);\n  border-radius: 6px;\n  background: var(--jl-orange-soft);\n  font-family: "Material Icons" !important;\n  font-size: 20px;\n  line-height: 32px;\n}\n.gf-card__title {\n  overflow-wrap: anywhere;\n  margin: 0;\n  color: var(--jl-navy);\n  font-size: 1.12rem;\n  font-weight: 780;\n  line-height: 1.2;\n}\n.gf-card__meta {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--jl-muted);\n  font-size: 0.85rem;\n}\n.serie {\n  padding: 14px 16px 18px;\n}\n.serie-card {\n  overflow: hidden;\n  border: 1px solid #eadfce;\n  border-radius: 8px;\n  background: #ffffff;\n  box-shadow: none;\n}\n.serie-card__header {\n  padding: 12px 16px;\n  border-bottom: 1px solid #f0e6da;\n  background: #fffaf4;\n}\n.serie-card__title {\n  color: var(--jl-navy);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-size: 1rem;\n  font-weight: 750;\n  line-height: 1.25;\n}\n.serie-card__content {\n  padding: 16px 18px 8px;\n}\n.q-block {\n  margin: 10px 0 16px;\n}\n.q-title {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.55rem;\n  margin-bottom: 12px;\n  color: var(--jl-text);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-size: 17px;\n  font-weight: 720;\n  line-height: 1.35;\n}\n.q-index {\n  flex: 0 0 auto;\n  color: var(--jl-orange-strong);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n  font-weight: 820;\n}\n.q-radio-group {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px 18px;\n}\n.q-radio {\n  --mdc-radio-selected-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-hover-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-focus-icon-color: var(--jl-orange-strong);\n  --mdc-radio-selected-pressed-icon-color: var(--jl-orange-strong);\n  --mdc-radio-unselected-hover-icon-color: var(--jl-navy);\n  color: #3e5361;\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.q-radio ::ng-deep .mdc-form-field {\n  align-items: center;\n}\n:host ::ng-deep .q-radio .mdc-form-field,\n:host ::ng-deep .q-radio .mdc-label,\n:host ::ng-deep .gf-card__title,\n:host ::ng-deep .serie-card__title,\n:host ::ng-deep .mat-mdc-card-title,\n:host ::ng-deep .mat-mdc-card-subtitle,\n:host ::ng-deep .mat-mdc-card-content,\n:host ::ng-deep .mat-mdc-card-content *,\n:host ::ng-deep .q-title,\n:host ::ng-deep .q-title *,\n:host ::ng-deep .q-index,\n:host ::ng-deep .mat-mdc-radio-button .mdc-form-field,\n:host ::ng-deep .mat-mdc-radio-button .mdc-label,\n:host ::ng-deep .mat-mdc-form-field,\n:host ::ng-deep .mat-mdc-input-element,\n:host ::ng-deep .mat-mdc-select-value,\n:host ::ng-deep .mdc-button__label {\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif) !important;\n}\n.q-error {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 8px;\n  color: var(--jl-danger);\n  font-size: 0.9rem;\n  font-weight: 650;\n}\n.q-error mat-icon {\n  display: none;\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.q-divider {\n  margin: 14px 0;\n  border-top-color: #efe2d3;\n}\n.q-range {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: 6px;\n  border-radius: 999px;\n  appearance: none;\n  background: #f1e4d5;\n  outline: none;\n  pointer-events: auto;\n}\n.q-range::-webkit-slider-thumb {\n  width: 19px;\n  height: 19px;\n  cursor: pointer;\n  border-radius: 50%;\n  appearance: none;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);\n}\n.q-range::-moz-range-thumb {\n  width: 19px;\n  height: 19px;\n  cursor: pointer;\n  border: none;\n  border-radius: 50%;\n  background: var(--jl-orange);\n  box-shadow: 0 0 0 3px #fffdf9, 0 0 0 6px rgba(245, 139, 42, 0.22);\n}\n.q-ticks {\n  display: grid;\n  align-items: start;\n  margin-top: 10px;\n}\n.q-tick {\n  position: relative;\n  text-align: center;\n}\n.q-tick-mark {\n  display: block;\n  width: 1px;\n  height: 8px;\n  margin: 0 auto 3px;\n  background: #d2c1ad;\n}\n.q-tick-label {\n  color: #6e7d87;\n  font-size: 12px;\n  font-style: normal;\n}\n.q-range-value {\n  margin-top: 8px;\n  color: var(--jl-navy);\n  font-weight: 700;\n}\n.security-verification {\n  max-width: 1080px;\n  margin: 2px auto 12px;\n  padding: 14px 16px;\n  border: 1px solid var(--jl-border);\n  border-radius: 8px;\n  background: rgba(255, 253, 249, 0.9);\n  box-shadow: 0 8px 20px rgba(18, 43, 61, 0.045);\n}\n.submit-bar {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n  padding: 12px 16px;\n  border-top: 1px solid var(--jl-border);\n  background: rgba(255, 250, 244, 0.96);\n  box-shadow: 0 -10px 28px rgba(18, 43, 61, 0.1);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.submit-bar__progress {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: min(720px, 78vw);\n}\n.progress-line {\n  flex: 1;\n  height: 8px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #f2e4d3;\n}\n.progress-line__fill {\n  height: 100%;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      90deg,\n      var(--jl-orange) 0%,\n      #ffb052 100%);\n}\n.progress-text {\n  min-width: 122px;\n  color: var(--jl-navy);\n  font-weight: 760;\n  text-align: right;\n}\n:host ::ng-deep .mat-mdc-form-field {\n  --mdc-outlined-text-field-outline-color: #dac7af;\n  --mdc-outlined-text-field-hover-outline-color: #bb9165;\n  --mdc-outlined-text-field-focus-outline-color: var(--jl-orange-strong);\n  --mdc-outlined-text-field-focus-label-text-color: var(--jl-orange-strong);\n  --mat-form-field-focus-select-arrow-color: var(--jl-orange-strong);\n}\n:host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary {\n  min-height: 42px;\n  padding: 0 22px;\n  color: var(--jl-navy);\n  border-radius: 6px;\n  background-color: var(--jl-orange);\n  box-shadow: 0 7px 16px rgba(217, 112, 24, 0.18);\n  font-weight: 760;\n}\n:host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary:hover:not(:disabled) {\n  background-color: var(--jl-orange-strong);\n}\n:host ::ng-deep .submit-bar .mat-mdc-raised-button.mat-primary:disabled {\n  color: #8e958f;\n  background-color: #ece5dd;\n  box-shadow: none;\n}\n@media (max-width: 720px) {\n  .df-body {\n    padding: 4px 10px 118px;\n  }\n  .gf-card__header,\n  .serie-card__content {\n    padding: 14px;\n  }\n  .serie {\n    padding: 12px;\n  }\n  .q-radio-group {\n    flex-direction: column;\n    gap: 8px;\n  }\n  .submit-bar {\n    flex-direction: column;\n    gap: 9px;\n  }\n  .submit-bar__progress {\n    width: 100%;\n  }\n  .progress-text {\n    min-width: auto;\n    text-align: center;\n  }\n}\n:host-context(.dark),\n:host-context(.dark-theme) {\n  --jl-navy: #e1e8ee;\n  --jl-navy-soft: #cbd5df;\n  --jl-surface: #171d25;\n  --jl-border: #354452;\n  --jl-border-strong: #465564;\n  --jl-text: #e1e8ee;\n  --jl-muted: #9cabb7;\n}\n:host-context(.dark) .gf-card,\n:host-context(.dark-theme) .gf-card,\n:host-context(.dark) .serie-card,\n:host-context(.dark-theme) .serie-card {\n  border-color: #354452;\n  background: #171d25;\n}\n:host-context(.dark) .gf-card__header,\n:host-context(.dark-theme) .gf-card__header,\n:host-context(.dark) .serie-card__header,\n:host-context(.dark-theme) .serie-card__header {\n  border-color: #354452;\n  background: #202832;\n}\n:host-context(.dark) .gf-card__title,\n:host-context(.dark-theme) .gf-card__title,\n:host-context(.dark) .serie-card__title,\n:host-context(.dark-theme) .serie-card__title,\n:host-context(.dark) .q-title,\n:host-context(.dark-theme) .q-title,\n:host-context(.dark) .progress-text,\n:host-context(.dark-theme) .progress-text,\n:host-context(.dark) .q-range-value,\n:host-context(.dark-theme) .q-range-value {\n  color: #e1e8ee;\n}\n:host-context(.dark) .q-radio,\n:host-context(.dark-theme) .q-radio,\n:host-context(.dark) .q-tick-label,\n:host-context(.dark-theme) .q-tick-label {\n  color: #c7d1da;\n}\n:host-context(.dark) .q-divider,\n:host-context(.dark-theme) .q-divider {\n  border-top-color: #354452;\n}\n:host-context(.dark) .security-verification,\n:host-context(.dark-theme) .security-verification,\n:host-context(.dark) .submit-bar,\n:host-context(.dark-theme) .submit-bar {\n  border-color: #354452;\n  background: rgba(17, 24, 32, 0.96);\n}\n:host-context(.dark) .progress-line,\n:host-context(.dark-theme) .progress-line {\n  background: #29323c;\n}\n/*# sourceMappingURL=dynamic-form.component.css.map */\n'] }]
  }], () => [{ type: FormBuilderService }, { type: LanguageService }, { type: TranslateService }, { type: OrganizacionService }], { formConfig: [{
    type: Input
  }], idEmpleado: [{
    type: Input
  }], idEncuestaEmpleado: [{
    type: Input
  }], lang: [{
    type: Input
  }], requireTurnstile: [{
    type: Input
  }], turnstileToken: [{
    type: Input
  }], turnstileResetRequested: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DynamicFormComponent, { className: "DynamicFormComponent", filePath: "src/app/quiz/dynamic-form/dynamic-form.component.ts", lineNumber: 690 });
})();

export {
  DynamicFormComponent
};
//# sourceMappingURL=chunk-VWN6FOJ7.js.map
