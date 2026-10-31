import {
  TurnstileComponent
} from "./chunk-HYUO6MWQ.js";
import {
  MatRadioButton,
  MatRadioGroup,
  MatRadioModule
} from "./chunk-LHQOYH62.js";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "./chunk-6F5SWNYE.js";
import {
  require_sweetalert2_all
} from "./chunk-IOETN73U.js";
import "./chunk-J7XWAFEK.js";
import {
  OrganizacionService
} from "./chunk-ITHPGOKL.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-SKPM4PVR.js";
import "./chunk-JURKDGMK.js";
import {
  MatOption,
  MatSelect,
  MatSelectModule
} from "./chunk-QV4DNMNF.js";
import "./chunk-RTX2H4T5.js";
import "./chunk-TWFG2YEX.js";
import "./chunk-AMSP6ESA.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import "./chunk-H3UX3NVF.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-4AQ2Q7XZ.js";
import {
  MatProgressSpinner,
  MatProgressSpinnerModule
} from "./chunk-IMXEXKMD.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import "./chunk-T2IHQNFZ.js";
import "./chunk-V7JA7XTT.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormControl,
  FormControlName,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NumberValueAccessor,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-6OUKOU55.js";
import {
  ActivatedRoute,
  CommonModule,
  DOCUMENT,
  NgForOf,
  NgIf
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  Renderer2,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵNgOnChangesFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import {
  __async,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/completedesempenoalone/completedesempenoalone.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());

// src/app/completedesempenoalone/dynamic-desempeno-form/dynamic-desempeno-form.component.ts
var _c0 = [[["", "security-verification", ""]]];
var _c1 = ["[security-verification]"];
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Obligatoria");
    \u0275\u0275elementEnd();
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_radio_group_6_mat_radio_button_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-radio-button", 32)(1, "span", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const option_r1 = ctx.$implicit;
    \u0275\u0275property("value", option_r1.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r1.valor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(option_r1.etiqueta);
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_radio_group_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-radio-group", 30);
    \u0275\u0275template(1, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_radio_group_6_mat_radio_button_1_Template, 5, 3, "mat-radio-button", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formControlName", ctx_r2.controlName(item_r2));
    \u0275\u0275attribute("aria-label", item_r2.texto);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", item_r2.valoresEscala)("ngForTrackBy", ctx_r2.trackById);
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_7_mat_option_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 38);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    \u0275\u0275property("value", option_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", option_r4.valor, ". ", option_r4.etiqueta, " ");
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 35)(1, "mat-label");
    \u0275\u0275text(2, "Selecciona una o m\xE1s opciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-select", 36);
    \u0275\u0275template(4, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_7_mat_option_4_Template, 2, 3, "mat-option", 37);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControlName", ctx_r2.controlName(item_r2));
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", item_r2.valoresEscala)("ngForTrackBy", ctx_r2.trackById);
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 39)(1, "mat-label");
    \u0275\u0275text(2, "Respuesta");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "textarea", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControlName", ctx_r2.controlName(item_r2));
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-form-field", 35)(1, "mat-label");
    \u0275\u0275text(2, "Valor");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275property("formControlName", ctx_r2.controlName(item_r2));
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_checkbox_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-checkbox", 42);
    \u0275\u0275listener("change", function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_checkbox_10_Template_mat_checkbox_change_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const item_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.toggleNoApply(item_r2, $event.checked));
    });
    \u0275\u0275text(1, " No aplica ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("formControlName", ctx_r2.noApplyControlName(item_r2));
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Selecciona una respuesta para continuar. ");
    \u0275\u0275elementEnd();
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 21)(1, "div", 22)(2, "div")(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_span_5_Template, 2, 0, "span", 23);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_radio_group_6_Template, 2, 4, "mat-radio-group", 24)(7, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_7_Template, 5, 3, "mat-form-field", 25)(8, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_8_Template, 4, 1, "mat-form-field", 26)(9, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_form_field_9_Template, 4, 1, "mat-form-field", 25)(10, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_mat_checkbox_10_Template, 2, 1, "mat-checkbox", 27)(11, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_div_11_Template, 4, 0, "div", 28);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-invalid", ctx_r2.isInvalid(item_r2));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", ctx_r2.questionIndex(item_r2), ". ", item_r2.texto, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r2.requerido);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.shouldShowSingle(item_r2));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.shouldShowMultiple(item_r2));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.shouldShowText(item_r2));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.shouldShowNumber(item_r2));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", item_r2.permiteNoAplica);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.isInvalid(item_r2));
  }
}
function DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-expansion-panel", 19)(1, "mat-expansion-panel-header")(2, "mat-panel-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_article_4_Template, 12, 11, "article", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const criterion_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("expanded", true);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(criterion_r6.nombre);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", criterion_r6.items)("ngForTrackBy", ctx_r2.trackById);
  }
}
function DynamicDesempenoFormComponent_section_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12)(1, "header", 13)(2, "div", 14);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 15)(5, "div", 16)(6, "h2");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "mat-accordion", 17);
    \u0275\u0275template(11, DynamicDesempenoFormComponent_section_1_mat_expansion_panel_11_Template, 5, 4, "mat-expansion-panel", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const dimension_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(dimension_r7.orden);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(dimension_r7.nombre);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(dimension_r7.descripcion);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", dimension_r7.criterios)("ngForTrackBy", ctx_r2.trackById);
  }
}
function DynamicDesempenoFormComponent_small_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Faltan ", ctx_r2.unansweredRequiredCount, " respuestas obligatorias. ");
  }
}
var DynamicDesempenoFormComponent = class _DynamicDesempenoFormComponent {
  constructor() {
    this.disabled = false;
    this.isSavingDraft = false;
    this.isFinalizing = false;
    this.canSaveDraft = true;
    this.canFinalize = true;
    this.draftSaveRequested = new EventEmitter();
    this.finalizeRequested = new EventEmitter();
    this.form = new FormGroup({});
    this.itemContexts = [];
    this.submitted = false;
  }
  ngOnChanges(changes) {
    if (changes["evaluation"]?.currentValue) {
      this.buildForm();
      return;
    }
    if (changes["disabled"]) {
      this.applyDisabledState();
    }
  }
  get totalItems() {
    return this.itemContexts.length;
  }
  get answeredItems() {
    return this.itemContexts.filter(({ item }) => this.hasAnswer(item)).length;
  }
  get progress() {
    return this.totalItems ? Math.round(this.answeredItems / this.totalItems * 100) : 0;
  }
  get unansweredRequiredCount() {
    return this.itemContexts.filter(({ item }) => item.requerido && !this.hasAnswer(item)).length;
  }
  controlName(item) {
    return `item_${item.id}`;
  }
  noApplyControlName(item) {
    return `item_${item.id}_no_aplica`;
  }
  questionIndex(item) {
    return this.itemContexts.findIndex((context) => context.item.id === item.id) + 1;
  }
  getControl(item) {
    return this.form.get(this.controlName(item));
  }
  isInvalid(item) {
    const control = this.getControl(item);
    return !!control?.invalid && (this.submitted || control.touched);
  }
  shouldShowText(item) {
    return item.permiteTexto || item.tipoItemCodigo === "ABIERTA";
  }
  shouldShowNumber(item) {
    return item.tipoItemCodigo === "NUMERICA";
  }
  shouldShowMultiple(item) {
    return item.permiteSeleccionMultiple || item.tipoItemCodigo === "OPCION_MULTIPLE";
  }
  shouldShowSingle(item) {
    return item.usaEscala && !this.shouldShowMultiple(item);
  }
  toggleNoApply(item, checked) {
    if (this.disabled) {
      return;
    }
    const control = this.getControl(item);
    if (!control) {
      return;
    }
    if (checked) {
      control.reset(null);
      control.disable();
    } else {
      control.enable();
    }
    control.updateValueAndValidity();
  }
  saveDraft() {
    if (this.disabled || this.isSavingDraft || this.isFinalizing || !this.canSaveDraft) {
      return;
    }
    this.draftSaveRequested.emit(this.buildPayload());
  }
  finalize() {
    if (this.disabled || this.isSavingDraft || this.isFinalizing || !this.canFinalize) {
      return;
    }
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.scrollToFirstInvalid();
      return;
    }
    this.finalizeRequested.emit(this.buildPayload());
  }
  trackById(_index, value) {
    return value.id;
  }
  buildForm() {
    const controls = {};
    this.itemContexts = [];
    let index = 0;
    this.evaluation.dimensiones.slice().sort((left, right) => left.orden - right.orden).forEach((dimension) => {
      dimension.criterios.slice().sort((left, right) => left.orden - right.orden).forEach((criterion) => {
        criterion.items.slice().sort((left, right) => left.orden - right.orden).forEach((item) => {
          index += 1;
          const validators = item.requerido ? [Validators.required] : [];
          controls[this.controlName(item)] = new FormControl(this.shouldShowMultiple(item) ? [] : null, validators);
          if (item.permiteNoAplica) {
            controls[this.noApplyControlName(item)] = new FormControl(false, { nonNullable: true });
          }
          this.itemContexts.push({ dimension, criterion, item, index });
        });
      });
    });
    this.form = new FormGroup(controls);
    this.submitted = false;
    this.applyDisabledState();
  }
  hasAnswer(item) {
    const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
    if (noApply) {
      return true;
    }
    const value = this.getControl(item)?.value;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== void 0 && String(value).trim() !== "";
  }
  buildPayload() {
    return {
      respuestas: this.itemContexts.map((context) => this.buildAnswer(context))
    };
  }
  buildAnswer({ item }) {
    const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
    const value = noApply ? null : this.getControl(item)?.value;
    const optionIds = Array.isArray(value) ? value.map(Number).filter((optionId) => Number.isFinite(optionId)) : [];
    const selectedOptionId = Number(value);
    const hasSelectedOption = Number.isFinite(selectedOptionId) && selectedOptionId > 0;
    const textValue = typeof value === "string" ? value.trim() : "";
    const numericValue = value === null || value === void 0 || value === "" ? null : Number(value);
    return {
      itemId: item.id,
      escalaValorId: !noApply && this.shouldShowSingle(item) && hasSelectedOption ? selectedOptionId : null,
      valorNumero: !noApply && this.shouldShowNumber(item) && Number.isFinite(numericValue) ? numericValue : null,
      valorTexto: !noApply && this.shouldShowText(item) && textValue ? textValue : null,
      noAplica: noApply,
      opcionIds: !noApply && this.shouldShowMultiple(item) ? optionIds : []
    };
  }
  applyDisabledState() {
    if (this.disabled) {
      this.form.disable({ emitEvent: false });
      return;
    }
    this.form.enable({ emitEvent: false });
    for (const { item } of this.itemContexts) {
      const noApply = this.form.get(this.noApplyControlName(item))?.value === true;
      if (noApply) {
        this.getControl(item)?.disable({ emitEvent: false });
      }
    }
  }
  scrollToFirstInvalid() {
    const invalidElement = document.querySelector(".performance-question.is-invalid");
    invalidElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  static {
    this.\u0275fac = function DynamicDesempenoFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DynamicDesempenoFormComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DynamicDesempenoFormComponent, selectors: [["app-dynamic-desempeno-form"]], inputs: { evaluation: "evaluation", disabled: "disabled", isSavingDraft: "isSavingDraft", isFinalizing: "isFinalizing", canSaveDraft: "canSaveDraft", canFinalize: "canFinalize" }, outputs: { draftSaveRequested: "draftSaveRequested", finalizeRequested: "finalizeRequested" }, features: [\u0275\u0275NgOnChangesFeature], ngContentSelectors: _c1, decls: 23, vars: 13, consts: [["novalidate", "", 1, "performance-form", 3, "ngSubmit", "formGroup"], ["class", "performance-dimension-section", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "security-verification"], [1, "submit-bar"], [1, "progress-area"], [1, "progress-label"], ["aria-hidden", "true", 1, "progress-track"], [1, "progress-fill"], [4, "ngIf"], [1, "submit-actions"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["mat-flat-button", "", "color", "primary", "type", "submit", 3, "disabled"], [1, "performance-dimension-section"], [1, "performance-dimension-header"], [1, "performance-dimension-index"], [1, "performance-dimension-heading"], [1, "performance-dimension-title-line"], ["multi", ""], ["class", "criterion-panel", 3, "expanded", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "criterion-panel", 3, "expanded"], ["class", "performance-question", 3, "is-invalid", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "performance-question"], [1, "question-copy"], ["class", "required-label", 4, "ngIf"], ["class", "likert-options", 3, "formControlName", 4, "ngIf"], ["appearance", "outline", "class", "answer-field", 4, "ngIf"], ["appearance", "outline", "class", "answer-field answer-field--text", 4, "ngIf"], [3, "formControlName", "change", 4, "ngIf"], ["class", "question-error", 4, "ngIf"], [1, "required-label"], [1, "likert-options", 3, "formControlName"], ["class", "likert-option", 3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "likert-option", 3, "value"], [1, "option-value"], [1, "option-label"], ["appearance", "outline", 1, "answer-field"], ["multiple", "", 3, "formControlName"], [3, "value", 4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "value"], ["appearance", "outline", 1, "answer-field", "answer-field--text"], ["matInput", "", "rows", "4", "maxlength", "1500", 3, "formControlName"], ["matInput", "", "type", "number", 3, "formControlName"], [3, "change", "formControlName"], [1, "question-error"]], template: function DynamicDesempenoFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c0);
        \u0275\u0275elementStart(0, "form", 0);
        \u0275\u0275listener("ngSubmit", function DynamicDesempenoFormComponent_Template_form_ngSubmit_0_listener() {
          return ctx.finalize();
        });
        \u0275\u0275template(1, DynamicDesempenoFormComponent_section_1_Template, 12, 5, "section", 1);
        \u0275\u0275elementStart(2, "div", 2);
        \u0275\u0275projection(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "footer", 3)(5, "div", 4)(6, "div", 5)(7, "strong");
        \u0275\u0275text(8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "span");
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 6);
        \u0275\u0275element(12, "div", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275template(13, DynamicDesempenoFormComponent_small_13_Template, 2, 1, "small", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "div", 9)(15, "button", 10);
        \u0275\u0275listener("click", function DynamicDesempenoFormComponent_Template_button_click_15_listener() {
          return ctx.saveDraft();
        });
        \u0275\u0275elementStart(16, "mat-icon");
        \u0275\u0275text(17);
        \u0275\u0275elementEnd();
        \u0275\u0275text(18, " Guardar borrador ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "button", 11)(20, "mat-icon");
        \u0275\u0275text(21);
        \u0275\u0275elementEnd();
        \u0275\u0275text(22, " Finalizar ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("formGroup", ctx.form);
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.evaluation.dimensiones)("ngForTrackBy", ctx.trackById);
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate2("", ctx.answeredItems, " de ", ctx.totalItems, "");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.progress, "% completado");
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.progress, "%");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.unansweredRequiredCount);
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.disabled || ctx.isSavingDraft || ctx.isFinalizing || !ctx.canSaveDraft);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isSavingDraft ? "sync" : "save");
        \u0275\u0275advance(2);
        \u0275\u0275property("disabled", ctx.disabled || ctx.isSavingDraft || ctx.isFinalizing || !ctx.canFinalize);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.isFinalizing ? "sync" : "fact_check");
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, ReactiveFormsModule, FormGroupDirective, FormControlName, MatButtonModule, MatButton, MatCheckboxModule, MatCheckbox, MatExpansionModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormFieldModule, MatFormField, MatLabel, MatIconModule, MatIcon, MatInputModule, MatInput, MatRadioModule, MatRadioGroup, MatRadioButton, MatSelectModule, MatSelect, MatOption], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  color-scheme: light;\n}\n.performance-form[_ngcontent-%COMP%] {\n  padding-bottom: 108px;\n}\n.performance-dimension-section[_ngcontent-%COMP%] {\n  margin-bottom: 18px;\n}\n.performance-dimension-header[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  width: 100%;\n  height: auto;\n  min-height: 52px;\n  max-height: none;\n  box-sizing: border-box;\n  margin-bottom: 8px;\n  padding: 8px 12px;\n  border: 1px solid #dce3e8;\n  border-radius: 6px;\n  background: #fff;\n  color: #17212b;\n  line-height: 1.2;\n  text-align: left;\n}\n.performance-dimension-index[_ngcontent-%COMP%] {\n  display: grid;\n  flex: 0 0 30px;\n  width: 30px;\n  height: 30px;\n  place-items: center;\n  border-radius: 5px;\n  background: #155e75;\n  color: #fff;\n  font-weight: 800;\n}\n.performance-dimension-heading[_ngcontent-%COMP%] {\n  display: block;\n  flex: 1;\n  min-width: 0;\n}\n.performance-dimension-title-line[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  justify-content: space-between;\n}\n.performance-dimension-title-line[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #17212b;\n  font-size: 1.05rem;\n  line-height: 1.25;\n}\n.performance-dimension-title-line[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #155e75;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n.performance-dimension-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  color: #637083;\n  font-size: 0.82rem;\n  line-height: 1.3;\n}\n.criterion-panel[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  border: 1px solid #dce3e8;\n  border-radius: 8px !important;\n  box-shadow: none !important;\n}\n.criterion-panel[_ngcontent-%COMP%]   mat-panel-title[_ngcontent-%COMP%] {\n  color: #243442;\n  font-weight: 700;\n}\n.criterion-panel[_ngcontent-%COMP%]   mat-panel-description[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 0 0 auto;\n  gap: 14px;\n  color: #637083;\n}\n.performance-question[_ngcontent-%COMP%] {\n  padding: 22px 4px;\n  border-top: 1px solid #edf0f2;\n}\n.performance-question.is-invalid[_ngcontent-%COMP%] {\n  border-left: 3px solid #c62828;\n  padding-left: 12px;\n}\n.security-verification[_ngcontent-%COMP%] {\n  margin: 8px 0 20px;\n}\n.question-copy[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  margin-bottom: 16px;\n}\n.question-copy[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #1f2d38;\n  font-size: 1rem;\n  font-weight: 650;\n  line-height: 1.5;\n}\n.required-label[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-top: 6px;\n  color: #8b4450;\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.answer-field--text[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  max-width: none;\n}\n.answer-field--text[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 96px;\n  resize: vertical;\n}\n.likert-options[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(105px, 1fr));\n  gap: 8px;\n}\n.likert-option[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 10px;\n  border: 1px solid #d7dee3;\n  border-radius: 6px;\n  background: #fff;\n}\n.option-value[_ngcontent-%COMP%], \n.option-label[_ngcontent-%COMP%] {\n  display: block;\n}\n.option-value[_ngcontent-%COMP%] {\n  color: #155e75;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.option-label[_ngcontent-%COMP%] {\n  margin-top: 2px;\n  color: #4d5a66;\n  font-size: 0.79rem;\n  line-height: 1.25;\n  white-space: normal;\n}\n.question-error[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  margin-top: 10px;\n  color: #b42318;\n  font-size: 0.85rem;\n}\n.submit-bar[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 20;\n  display: flex;\n  gap: 24px;\n  align-items: center;\n  justify-content: center;\n  padding: 14px 24px;\n  border-top: 1px solid #dce3e8;\n  background: rgba(255, 255, 255, 0.97);\n  box-shadow: 0 -4px 14px rgba(24, 39, 52, 0.08);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n}\n.submit-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 0 0 auto;\n  gap: 10px;\n  align-items: center;\n}\n.progress-area[_ngcontent-%COMP%] {\n  width: min(680px, 65vw);\n}\n.progress-label[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 7px;\n  color: #42515d;\n}\n.progress-label[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #1f2d38;\n}\n.progress-track[_ngcontent-%COMP%] {\n  height: 8px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #e6ebee;\n}\n.progress-fill[_ngcontent-%COMP%] {\n  height: 100%;\n  border-radius: inherit;\n  background: #15803d;\n  transition: width 180ms ease;\n}\n@media (max-width: 860px) {\n  .likert-options[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .criterion-panel[_ngcontent-%COMP%]   mat-panel-description[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n@media (max-width: 620px) {\n  .performance-form[_ngcontent-%COMP%] {\n    padding-bottom: 150px;\n  }\n  .performance-dimension-title-line[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  .submit-bar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 10px;\n    align-items: stretch;\n    padding: 12px 16px;\n  }\n  .progress-area[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .submit-actions[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .submit-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n/*# sourceMappingURL=dynamic-desempeno-form.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynamicDesempenoFormComponent, [{
    type: Component,
    args: [{ selector: "app-dynamic-desempeno-form", standalone: true, imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatCheckboxModule,
      MatExpansionModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatRadioModule,
      MatSelectModule
    ], template: `<form class="performance-form" [formGroup]="form" (ngSubmit)="finalize()" novalidate>
  <section
    class="performance-dimension-section"
    *ngFor="let dimension of evaluation.dimensiones; trackBy: trackById">
    <header class="performance-dimension-header">
      <div class="performance-dimension-index">{{ dimension.orden }}</div>
      <div class="performance-dimension-heading">
        <div class="performance-dimension-title-line">
          <h2>{{ dimension.nombre }}</h2>
        </div>
        <p>{{ dimension.descripcion }}</p>
      </div>
    </header>

    <mat-accordion multi>
      <mat-expansion-panel
        class="criterion-panel"
        *ngFor="let criterion of dimension.criterios; trackBy: trackById"
        [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ criterion.nombre }}</mat-panel-title>
        </mat-expansion-panel-header>

        <article
          class="performance-question"
          *ngFor="let item of criterion.items; trackBy: trackById"
          [class.is-invalid]="isInvalid(item)">
          <div class="question-copy">
            <div>
              <h3>
                {{ questionIndex(item) }}.
                {{ item.texto }}
              </h3>
              <span class="required-label" *ngIf="item.requerido">Obligatoria</span>
            </div>
          </div>

          <mat-radio-group
            *ngIf="shouldShowSingle(item)"
            class="likert-options"
            [formControlName]="controlName(item)"
            [attr.aria-label]="item.texto">
            <mat-radio-button
              class="likert-option"
              *ngFor="let option of item.valoresEscala; trackBy: trackById"
              [value]="option.id">
              <span class="option-value">{{ option.valor }}</span>
              <span class="option-label">{{ option.etiqueta }}</span>
            </mat-radio-button>
          </mat-radio-group>

          <mat-form-field
            *ngIf="shouldShowMultiple(item)"
            appearance="outline"
            class="answer-field">
            <mat-label>Selecciona una o m\xE1s opciones</mat-label>
            <mat-select multiple [formControlName]="controlName(item)">
              <mat-option
                *ngFor="let option of item.valoresEscala; trackBy: trackById"
                [value]="option.id">
                {{ option.valor }}. {{ option.etiqueta }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field
            *ngIf="shouldShowText(item)"
            appearance="outline"
            class="answer-field answer-field--text">
            <mat-label>Respuesta</mat-label>
            <textarea
              matInput
              rows="4"
              maxlength="1500"
              [formControlName]="controlName(item)"></textarea>
          </mat-form-field>

          <mat-form-field
            *ngIf="shouldShowNumber(item)"
            appearance="outline"
            class="answer-field">
            <mat-label>Valor</mat-label>
            <input matInput type="number" [formControlName]="controlName(item)">
          </mat-form-field>

          <mat-checkbox
            *ngIf="item.permiteNoAplica"
            [formControlName]="noApplyControlName(item)"
            (change)="toggleNoApply(item, $event.checked)">
            No aplica
          </mat-checkbox>

          <div class="question-error" *ngIf="isInvalid(item)">
            <mat-icon>error_outline</mat-icon>
            Selecciona una respuesta para continuar.
          </div>
        </article>
      </mat-expansion-panel>
    </mat-accordion>
  </section>

  <div class="security-verification">
    <ng-content select="[security-verification]"></ng-content>
  </div>

  <footer class="submit-bar">
    <div class="progress-area">
      <div class="progress-label">
        <strong>{{ answeredItems }} de {{ totalItems }}</strong>
        <span>{{ progress }}% completado</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" [style.width.%]="progress"></div>
      </div>
      <small *ngIf="unansweredRequiredCount">
        Faltan {{ unansweredRequiredCount }} respuestas obligatorias.
      </small>
    </div>

    <div class="submit-actions">
      <button
        mat-stroked-button
        color="primary"
        type="button"
        (click)="saveDraft()"
        [disabled]="disabled || isSavingDraft || isFinalizing || !canSaveDraft">
        <mat-icon>{{ isSavingDraft ? 'sync' : 'save' }}</mat-icon>
        Guardar borrador
      </button>

      <button
        mat-flat-button
        color="primary"
        type="submit"
        [disabled]="disabled || isSavingDraft || isFinalizing || !canFinalize">
        <mat-icon>{{ isFinalizing ? 'sync' : 'fact_check' }}</mat-icon>
        Finalizar
      </button>
    </div>
  </footer>
</form>
`, styles: ["/* src/app/completedesempenoalone/dynamic-desempeno-form/dynamic-desempeno-form.component.scss */\n:host {\n  display: block;\n  color-scheme: light;\n}\n.performance-form {\n  padding-bottom: 108px;\n}\n.performance-dimension-section {\n  margin-bottom: 18px;\n}\n.performance-dimension-header {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  width: 100%;\n  height: auto;\n  min-height: 52px;\n  max-height: none;\n  box-sizing: border-box;\n  margin-bottom: 8px;\n  padding: 8px 12px;\n  border: 1px solid #dce3e8;\n  border-radius: 6px;\n  background: #fff;\n  color: #17212b;\n  line-height: 1.2;\n  text-align: left;\n}\n.performance-dimension-index {\n  display: grid;\n  flex: 0 0 30px;\n  width: 30px;\n  height: 30px;\n  place-items: center;\n  border-radius: 5px;\n  background: #155e75;\n  color: #fff;\n  font-weight: 800;\n}\n.performance-dimension-heading {\n  display: block;\n  flex: 1;\n  min-width: 0;\n}\n.performance-dimension-title-line {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  justify-content: space-between;\n}\n.performance-dimension-title-line h2 {\n  margin: 0;\n  color: #17212b;\n  font-size: 1.05rem;\n  line-height: 1.25;\n}\n.performance-dimension-title-line span {\n  color: #155e75;\n  font-size: 0.82rem;\n  font-weight: 800;\n}\n.performance-dimension-heading p {\n  margin: 2px 0 0;\n  color: #637083;\n  font-size: 0.82rem;\n  line-height: 1.3;\n}\n.criterion-panel {\n  margin-bottom: 10px;\n  border: 1px solid #dce3e8;\n  border-radius: 8px !important;\n  box-shadow: none !important;\n}\n.criterion-panel mat-panel-title {\n  color: #243442;\n  font-weight: 700;\n}\n.criterion-panel mat-panel-description {\n  display: flex;\n  flex: 0 0 auto;\n  gap: 14px;\n  color: #637083;\n}\n.performance-question {\n  padding: 22px 4px;\n  border-top: 1px solid #edf0f2;\n}\n.performance-question.is-invalid {\n  border-left: 3px solid #c62828;\n  padding-left: 12px;\n}\n.security-verification {\n  margin: 8px 0 20px;\n}\n.question-copy {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  margin-bottom: 16px;\n}\n.question-copy h3 {\n  margin: 0;\n  color: #1f2d38;\n  font-size: 1rem;\n  font-weight: 650;\n  line-height: 1.5;\n}\n.required-label {\n  display: inline-block;\n  margin-top: 6px;\n  color: #8b4450;\n  font-size: 0.76rem;\n  font-weight: 700;\n}\n.answer-field--text {\n  display: block;\n  width: 100%;\n  max-width: none;\n}\n.answer-field--text textarea {\n  width: 100%;\n  min-height: 96px;\n  resize: vertical;\n}\n.likert-options {\n  display: grid;\n  grid-template-columns: repeat(5, minmax(105px, 1fr));\n  gap: 8px;\n}\n.likert-option {\n  min-width: 0;\n  padding: 10px;\n  border: 1px solid #d7dee3;\n  border-radius: 6px;\n  background: #fff;\n}\n.option-value,\n.option-label {\n  display: block;\n}\n.option-value {\n  color: #155e75;\n  font-size: 1rem;\n  font-weight: 800;\n}\n.option-label {\n  margin-top: 2px;\n  color: #4d5a66;\n  font-size: 0.79rem;\n  line-height: 1.25;\n  white-space: normal;\n}\n.question-error {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  margin-top: 10px;\n  color: #b42318;\n  font-size: 0.85rem;\n}\n.submit-bar {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 20;\n  display: flex;\n  gap: 24px;\n  align-items: center;\n  justify-content: center;\n  padding: 14px 24px;\n  border-top: 1px solid #dce3e8;\n  background: rgba(255, 255, 255, 0.97);\n  box-shadow: 0 -4px 14px rgba(24, 39, 52, 0.08);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n}\n.submit-actions {\n  display: flex;\n  flex: 0 0 auto;\n  gap: 10px;\n  align-items: center;\n}\n.progress-area {\n  width: min(680px, 65vw);\n}\n.progress-label {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 7px;\n  color: #42515d;\n}\n.progress-label strong {\n  color: #1f2d38;\n}\n.progress-track {\n  height: 8px;\n  overflow: hidden;\n  border-radius: 999px;\n  background: #e6ebee;\n}\n.progress-fill {\n  height: 100%;\n  border-radius: inherit;\n  background: #15803d;\n  transition: width 180ms ease;\n}\n@media (max-width: 860px) {\n  .likert-options {\n    grid-template-columns: 1fr;\n  }\n  .criterion-panel mat-panel-description {\n    display: none;\n  }\n}\n@media (max-width: 620px) {\n  .performance-form {\n    padding-bottom: 150px;\n  }\n  .performance-dimension-title-line {\n    align-items: flex-start;\n  }\n  .submit-bar {\n    flex-direction: column;\n    gap: 10px;\n    align-items: stretch;\n    padding: 12px 16px;\n  }\n  .progress-area {\n    width: 100%;\n  }\n  .submit-actions {\n    width: 100%;\n  }\n  .submit-actions button {\n    flex: 1;\n  }\n}\n/*# sourceMappingURL=dynamic-desempeno-form.component.css.map */\n"] }]
  }], null, { evaluation: [{
    type: Input,
    args: [{ required: true }]
  }], disabled: [{
    type: Input
  }], isSavingDraft: [{
    type: Input
  }], isFinalizing: [{
    type: Input
  }], canSaveDraft: [{
    type: Input
  }], canFinalize: [{
    type: Input
  }], draftSaveRequested: [{
    type: Output
  }], finalizeRequested: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DynamicDesempenoFormComponent, { className: "DynamicDesempenoFormComponent", filePath: "src/app/completedesempenoalone/dynamic-desempeno-form/dynamic-desempeno-form.component.ts", lineNumber: 53 });
})();

// src/app/completedesempenoalone/completedesempenoalone.component.ts
function CompletedesempenoaloneComponent_mat_icon_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 9);
    \u0275\u0275text(1, " shield ");
    \u0275\u0275elementEnd();
  }
}
function CompletedesempenoaloneComponent_section_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 10);
    \u0275\u0275element(1, "mat-spinner", 11);
    \u0275\u0275elementStart(2, "div")(3, "h1");
    \u0275\u0275text(4, "Cargando evaluaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Estamos preparando las dimensiones y los \xEDtems evaluativos.");
    \u0275\u0275elementEnd()()();
  }
}
function CompletedesempenoaloneComponent_section_13_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function CompletedesempenoaloneComponent_section_13_button_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.loadEvaluation());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Reintentar ");
    \u0275\u0275elementEnd();
  }
}
function CompletedesempenoaloneComponent_section_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h1");
    \u0275\u0275text(5, "No se pudo cargar la evaluaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, CompletedesempenoaloneComponent_section_13_button_8_Template, 4, 0, "button", 13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.evaluatorEmployeeId && ctx_r1.evaluatedEmployeeId);
  }
}
function CompletedesempenoaloneComponent_ng_container_14_section_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 16)(1, "mat-icon");
    \u0275\u0275text(2, "task_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h1");
    \u0275\u0275text(5, "Evaluaci\xF3n no editable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.blockedMessage);
  }
}
function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "mat-icon");
    \u0275\u0275text(2, "lock");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, " Esta evaluaci\xF3n est\xE1 configurada como an\xF3nima. Responde con objetividad y basa tus valoraciones en conductas observables. ");
    \u0275\u0275elementEnd()();
  }
}
function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_section_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 16)(1, "mat-icon");
    \u0275\u0275text(2, "assignment_late");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h1");
    \u0275\u0275text(5, "Evaluaci\xF3n sin contenido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "A\xFAn no hay dimensiones ni \xEDtems configurados para esta asignaci\xF3n.");
    \u0275\u0275elementEnd()()();
  }
}
function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_app_dynamic_desempeno_form_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-dynamic-desempeno-form", 24);
    \u0275\u0275listener("draftSaveRequested", function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_app_dynamic_desempeno_form_35_Template_app_dynamic_desempeno_form_draftSaveRequested_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.saveDraft($event));
    })("finalizeRequested", function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_app_dynamic_desempeno_form_35_Template_app_dynamic_desempeno_form_finalizeRequested_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.finalize($event));
    });
    \u0275\u0275elementStart(1, "app-turnstile", 25);
    \u0275\u0275listener("tokenChange", function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_app_dynamic_desempeno_form_35_Template_app_turnstile_tokenChange_1_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onTurnstileTokenChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const currentEvaluation_r4 = \u0275\u0275nextContext(2).ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("evaluation", currentEvaluation_r4)("disabled", !!ctx_r1.blockedMessage)("isSavingDraft", ctx_r1.isSavingDraft)("isFinalizing", ctx_r1.isFinalizing)("canSaveDraft", !!ctx_r1.turnstileToken)("canFinalize", !!ctx_r1.turnstileToken);
  }
}
function CompletedesempenoaloneComponent_ng_container_14_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 17)(2, "div", 18)(3, "span", 19);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h1");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, " Responde cada \xEDtem considerando el desempe\xF1o observado de ");
    \u0275\u0275elementStart(9, "strong");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, ". ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "dl", 20)(13, "div")(14, "dt");
    \u0275\u0275text(15, "Evaluador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "dd");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div")(19, "dt");
    \u0275\u0275text(20, "Persona evaluada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "dd");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div")(24, "dt");
    \u0275\u0275text(25, "Fecha de cierre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "dd");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div")(29, "dt");
    \u0275\u0275text(30, "Contenido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "dd");
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(33, CompletedesempenoaloneComponent_ng_container_14_ng_container_2_div_33_Template, 5, 0, "div", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275template(34, CompletedesempenoaloneComponent_ng_container_14_ng_container_2_section_34_Template, 8, 0, "section", 15)(35, CompletedesempenoaloneComponent_ng_container_14_ng_container_2_app_dynamic_desempeno_form_35_Template, 2, 6, "app-dynamic-desempeno-form", 22);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const currentEvaluation_r4 = \u0275\u0275nextContext().ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(currentEvaluation_r4.escenario);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(currentEvaluation_r4.evaluacion);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(currentEvaluation_r4.evaluado);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(currentEvaluation_r4.evaluador);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentEvaluation_r4.evaluado);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.formattedClosingDate);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", currentEvaluation_r4.dimensiones.length, " dimensiones \xB7 ", ctx_r1.totalItems, " \xEDtems ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentEvaluation_r4.esAnonima);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentEvaluation_r4.dimensiones.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentEvaluation_r4.dimensiones.length > 0);
  }
}
function CompletedesempenoaloneComponent_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275template(1, CompletedesempenoaloneComponent_ng_container_14_section_1_Template, 8, 1, "section", 15)(2, CompletedesempenoaloneComponent_ng_container_14_ng_container_2_Template, 36, 11, "ng-container", 8);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.blockedMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.blockedMessage);
  }
}
var CompletedesempenoaloneComponent = class _CompletedesempenoaloneComponent {
  constructor(organizationService, route, document2, renderer) {
    this.organizationService = organizationService;
    this.document = document2;
    this.renderer = renderer;
    this.evaluation = null;
    this.isLoading = true;
    this.isSavingDraft = false;
    this.isFinalizing = false;
    this.errorMessage = "";
    this.blockedMessage = "";
    this.responseResult = null;
    this.turnstileToken = "";
    this.originalBodyClassName = "";
    this.managedThemeClasses = [
      "dark",
      "dark-theme",
      "light",
      "theme-white",
      "theme-black",
      "theme-purple",
      "theme-blue",
      "theme-cyan",
      "theme-green",
      "theme-orange",
      "theme-red",
      "menu_dark",
      "menu_light",
      "logo-black",
      "logo-white"
    ];
    this.accessKey = route.snapshot.queryParamMap.get("key");
    this.urlToken = route.snapshot.queryParamMap.get("token") ?? route.snapshot.queryParamMap.get("tokenAcceso") ?? route.snapshot.queryParamMap.get("access_token");
    const employeeId = Number(route.snapshot.queryParamMap.get("id_emp"));
    this.evaluatorEmployeeId = Number.isInteger(employeeId) && employeeId > 0 ? employeeId : null;
    this.evaluatedEmployeeId = this.decodeEvaluatedEmployeeId(this.accessKey);
  }
  ngOnInit() {
    this.forceLightTheme();
    this.loadEvaluation();
  }
  ngOnDestroy() {
    this.document.body.className = this.originalBodyClassName;
  }
  get totalItems() {
    return (this.evaluation?.dimensiones ?? []).reduce((dimensionTotal, dimension) => dimensionTotal + dimension.criterios.reduce((criterionTotal, criterion) => criterionTotal + criterion.items.length, 0), 0);
  }
  get formattedClosingDate() {
    if (!this.evaluation?.fechaCierre) {
      return "";
    }
    const date = /* @__PURE__ */ new Date(`${this.evaluation.fechaCierre}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return this.evaluation.fechaCierre;
    }
    return new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }
  loadEvaluation() {
    if (!this.evaluatorEmployeeId || !this.evaluatedEmployeeId) {
      this.isLoading = false;
      this.errorMessage = "El enlace de la evaluaci\xF3n no contiene identificadores v\xE1lidos.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = "";
    this.resetTurnstile();
    this.organizationService.getDesempenoEvaluationForm(this.evaluatorEmployeeId, this.evaluatedEmployeeId).subscribe({
      next: (response) => {
        const evaluation = response?.data ?? response;
        if (response?.ok === false || !this.isValidEvaluation(evaluation)) {
          this.handleLoadError(response?.message || "La respuesta del servidor no contiene una evaluaci\xF3n v\xE1lida.");
          return;
        }
        this.evaluation = __spreadProps(__spreadValues({}, evaluation), {
          dimensiones: Array.isArray(evaluation.dimensiones) ? evaluation.dimensiones : []
        });
        this.blockedMessage = this.getEvaluationBlockedMessage(this.evaluation);
        this.isLoading = false;
      },
      error: (error) => {
        this.handleLoadError(error?.error?.message || error?.message || "No fue posible cargar la evaluaci\xF3n de desempe\xF1o.");
      }
    });
  }
  saveDraft(payload) {
    const token = this.getResponseToken();
    if (!token) {
      void import_sweetalert2.default.fire("Token no disponible", "No se encontr\xF3 el token de acceso para guardar las respuestas.", "warning");
      return;
    }
    if (!this.turnstileToken) {
      void import_sweetalert2.default.fire("Verificaci\xF3n de seguridad", "Completa la verificaci\xF3n de seguridad antes de guardar las respuestas.", "warning");
      return;
    }
    if (this.isSavingDraft || this.isFinalizing || this.blockedMessage) {
      return;
    }
    this.isSavingDraft = true;
    this.organizationService.saveDesempenoResponseDraft(token, payload, this.turnstileToken).subscribe({
      next: (response) => __async(this, null, function* () {
        this.responseResult = this.normalizeResponseResult(response);
        this.resetTurnstile();
        yield import_sweetalert2.default.fire("Borrador guardado", "Tus respuestas se guardaron correctamente.", "success");
      }),
      error: (error) => {
        this.resetTurnstile();
        void this.handleResponseError(error);
      }
    }).add(() => {
      this.isSavingDraft = false;
    });
  }
  finalize(payload) {
    const token = this.getResponseToken();
    if (!token) {
      void import_sweetalert2.default.fire("Token no disponible", "No se encontr\xF3 el token de acceso para finalizar la encuesta.", "warning");
      return;
    }
    if (!this.turnstileToken) {
      void import_sweetalert2.default.fire("Verificaci\xF3n de seguridad", "Completa la verificaci\xF3n de seguridad antes de finalizar la encuesta.", "warning");
      return;
    }
    if (this.isSavingDraft || this.isFinalizing || this.blockedMessage) {
      return;
    }
    this.isFinalizing = true;
    this.organizationService.finalizeDesempenoResponse(token, payload, this.turnstileToken).subscribe({
      next: (response) => __async(this, null, function* () {
        this.responseResult = this.normalizeResponseResult(response);
        this.blockedMessage = "La encuesta ya fue finalizada.";
        yield import_sweetalert2.default.fire("Encuesta finalizada", "Gracias. Tus respuestas fueron registradas correctamente.", "success");
      }),
      error: (error) => {
        this.resetTurnstile();
        void this.handleResponseError(error);
      }
    }).add(() => {
      this.isFinalizing = false;
    });
  }
  onTurnstileTokenChange(token) {
    this.turnstileToken = token;
  }
  decodeEvaluatedEmployeeId(encodedKey) {
    if (!encodedKey) {
      return null;
    }
    try {
      const normalizedKey = encodedKey.replace(/-/g, "+").replace(/_/g, "/");
      const paddedKey = normalizedKey.padEnd(normalizedKey.length + (4 - normalizedKey.length % 4) % 4, "=");
      const [evaluatedEmployeeId, referenceId] = atob(paddedKey).split("|");
      const parsedEmployeeId = Number(evaluatedEmployeeId);
      const parsedReferenceId = Number(referenceId);
      return Number.isInteger(parsedEmployeeId) && parsedEmployeeId > 0 && Number.isInteger(parsedReferenceId) && parsedReferenceId > 0 ? parsedEmployeeId : null;
    } catch {
      return null;
    }
  }
  isValidEvaluation(value) {
    return value && (Array.isArray(value.dimensiones) || value.respondida === true || value.puedeResponder === false);
  }
  handleLoadError(message) {
    this.evaluation = null;
    this.isLoading = false;
    this.errorMessage = message;
  }
  getResponseToken() {
    return this.urlToken || this.evaluation?.tokenAcceso || null;
  }
  resetTurnstile() {
    this.turnstileToken = "";
    this.turnstileComponent?.reset();
  }
  getEvaluationBlockedMessage(evaluation) {
    if (evaluation.respondida === true || evaluation.puedeResponder === false) {
      return evaluation.mensaje || "La encuesta ya fue llenada.";
    }
    return "";
  }
  forceLightTheme() {
    this.originalBodyClassName = this.document.body.className;
    this.managedThemeClasses.forEach((className) => {
      this.renderer.removeClass(this.document.body, className);
    });
    this.renderer.addClass(this.document.body, "light");
    this.renderer.addClass(this.document.body, "theme-white");
    this.renderer.addClass(this.document.body, "completedesempenoalone-light");
  }
  normalizeResponseResult(response) {
    const payload = response?.data?.data ?? response?.data ?? response ?? {};
    return {
      idRespuesta: Number(payload.idRespuesta ?? payload.IdRespuesta ?? 0),
      finalizada: Boolean(payload.finalizada ?? payload.Finalizada)
    };
  }
  handleResponseError(error) {
    return __async(this, null, function* () {
      const status = Number(error?.status);
      const code = error?.error?.code ?? error?.error?.codigo ?? error?.code;
      const message = error?.error?.message ?? error?.error?.mensaje ?? error?.message ?? "No fue posible guardar las respuestas.";
      if (status === 409 && code === "RESPUESTA_FINALIZADA") {
        this.blockedMessage = "La encuesta ya fue finalizada.";
        yield import_sweetalert2.default.fire("Encuesta finalizada", this.blockedMessage, "info");
        return;
      }
      yield import_sweetalert2.default.fire("Aviso", String(message), status === 422 ? "warning" : "error");
    });
  }
  static {
    this.\u0275fac = function CompletedesempenoaloneComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CompletedesempenoaloneComponent)(\u0275\u0275directiveInject(OrganizacionService), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(Renderer2));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompletedesempenoaloneComponent, selectors: [["app-completedesempenoalone"]], viewQuery: function CompletedesempenoaloneComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(TurnstileComponent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.turnstileComponent = _t.first);
      }
    }, decls: 15, vars: 5, consts: [[1, "performance-page"], [1, "page-toolbar"], [1, "brand"], [1, "toolbar-meta"], ["matTooltip", "Las respuestas se tratar\xE1n de forma an\xF3nima", 4, "ngIf"], [1, "page-content"], ["class", "page-state", 4, "ngIf"], ["class", "page-state error-state", 4, "ngIf"], [4, "ngIf"], ["matTooltip", "Las respuestas se tratar\xE1n de forma an\xF3nima"], [1, "page-state"], ["diameter", "38"], [1, "page-state", "error-state"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "color", "primary", "type", "button", 3, "click"], ["class", "page-state empty-state", 4, "ngIf"], [1, "page-state", "empty-state"], [1, "evaluation-summary"], [1, "summary-heading"], [1, "eyebrow"], [1, "summary-details"], ["class", "privacy-note", 4, "ngIf"], [3, "evaluation", "disabled", "isSavingDraft", "isFinalizing", "canSaveDraft", "canFinalize", "draftSaveRequested", "finalizeRequested", 4, "ngIf"], [1, "privacy-note"], [3, "draftSaveRequested", "finalizeRequested", "evaluation", "disabled", "isSavingDraft", "isFinalizing", "canSaveDraft", "canFinalize"], ["security-verification", "", "action", "desempeno-survey", "language", "es", 3, "tokenChange"]], template: function CompletedesempenoaloneComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "main", 0)(1, "header", 1)(2, "div", 2)(3, "mat-icon");
        \u0275\u0275text(4, "fact_check");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span");
        \u0275\u0275text(6, "Evaluaci\xF3n de desempe\xF1o");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 3)(8, "span");
        \u0275\u0275text(9);
        \u0275\u0275elementEnd();
        \u0275\u0275template(10, CompletedesempenoaloneComponent_mat_icon_10_Template, 2, 0, "mat-icon", 4);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 5);
        \u0275\u0275template(12, CompletedesempenoaloneComponent_section_12_Template, 7, 0, "section", 6)(13, CompletedesempenoaloneComponent_section_13_Template, 9, 2, "section", 7)(14, CompletedesempenoaloneComponent_ng_container_14_Template, 3, 2, "ng-container", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate((ctx.evaluation == null ? null : ctx.evaluation.escenario) || "Formulario de evaluaci\xF3n");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.evaluation == null ? null : ctx.evaluation.esAnonima);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.errorMessage);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && !ctx.errorMessage && ctx.evaluation);
      }
    }, dependencies: [
      CommonModule,
      NgIf,
      MatButtonModule,
      MatButton,
      MatIconModule,
      MatIcon,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatTooltipModule,
      MatTooltip,
      DynamicDesempenoFormComponent,
      TurnstileComponent
    ], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n.performance-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f3f5f6;\n  color: #1f2d38;\n}\n.page-toolbar[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: 52px;\n  min-height: 52px;\n  max-height: 52px;\n  box-sizing: border-box;\n  padding: 0 max(20px, (100vw - 1080px) / 2);\n  border-bottom: 1px solid #d7e0e4;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(22, 37, 47, 0.06);\n  line-height: 1.2;\n  text-align: left;\n}\n.brand[_ngcontent-%COMP%], \n.toolbar-meta[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 9px;\n  align-items: center;\n}\n.brand[_ngcontent-%COMP%] {\n  color: #154f5f;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.toolbar-meta[_ngcontent-%COMP%] {\n  color: #566570;\n  font-size: 0.85rem;\n}\n.brand[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.toolbar-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n}\n.page-content[_ngcontent-%COMP%] {\n  width: min(1080px, 100% - 32px);\n  margin: 0 auto;\n  padding: 18px 0 40px;\n}\n.evaluation-summary[_ngcontent-%COMP%] {\n  margin-bottom: 26px;\n  padding: 26px;\n  border: 1px solid #d9e1e5;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 14px rgba(25, 42, 53, 0.05);\n}\n.page-state[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 18px;\n  align-items: center;\n  min-height: 150px;\n  padding: 28px;\n  border: 1px solid #d9e1e5;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 14px rgba(25, 42, 53, 0.05);\n}\n.page-state[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  color: #176477;\n  font-size: 34px;\n}\n.page-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.page-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.page-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #17252f;\n  font-size: 1.2rem;\n}\n.page-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 5px;\n  color: #637083;\n}\n.page-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-top: 14px;\n}\n.error-state[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  color: #b42318;\n}\n.empty-state[_ngcontent-%COMP%] {\n  min-height: 120px;\n}\n.summary-heading[_ngcontent-%COMP%] {\n  max-width: 760px;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #176477;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.summary-heading[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 7px 0 8px;\n  color: #17252f;\n  font-size: clamp(1.55rem, 3vw, 2.15rem);\n  line-height: 1.2;\n}\n.summary-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #586874;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n.summary-details[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 16px;\n  margin: 24px 0 0;\n  padding-top: 20px;\n  border-top: 1px solid #e4e9ec;\n}\n.summary-details[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.summary-details[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  margin-bottom: 4px;\n  color: #6b7882;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.summary-details[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  margin: 0;\n  overflow-wrap: anywhere;\n  color: #263640;\n  font-weight: 700;\n}\n.privacy-note[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  margin-top: 20px;\n  padding: 12px 14px;\n  border-left: 4px solid #6d5a8a;\n  background: #f5f2f8;\n  color: #524661;\n  line-height: 1.5;\n}\n.privacy-note[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n@media (max-width: 800px) {\n  .summary-details[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 520px) {\n  .page-toolbar[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  .toolbar-meta[_ngcontent-%COMP%] {\n    justify-content: flex-end;\n    text-align: right;\n  }\n  .page-content[_ngcontent-%COMP%] {\n    width: min(100% - 20px, 1080px);\n    padding-top: 12px;\n  }\n  .evaluation-summary[_ngcontent-%COMP%] {\n    padding: 18px;\n  }\n  .summary-details[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=completedesempenoalone.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompletedesempenoaloneComponent, [{
    type: Component,
    args: [{ selector: "app-completedesempenoalone", standalone: true, imports: [
      CommonModule,
      MatButtonModule,
      MatIconModule,
      MatProgressSpinnerModule,
      MatTooltipModule,
      DynamicDesempenoFormComponent,
      TurnstileComponent
    ], template: `<main class="performance-page">
  <header class="page-toolbar">
    <div class="brand">
      <mat-icon>fact_check</mat-icon>
      <span>Evaluaci\xF3n de desempe\xF1o</span>
    </div>
    <div class="toolbar-meta">
      <span>{{ evaluation?.escenario || 'Formulario de evaluaci\xF3n' }}</span>
      <mat-icon
        *ngIf="evaluation?.esAnonima"
        matTooltip="Las respuestas se tratar\xE1n de forma an\xF3nima">
        shield
      </mat-icon>
    </div>
  </header>

  <div class="page-content">
    <section class="page-state" *ngIf="isLoading">
      <mat-spinner diameter="38"></mat-spinner>
      <div>
        <h1>Cargando evaluaci\xF3n</h1>
        <p>Estamos preparando las dimensiones y los \xEDtems evaluativos.</p>
      </div>
    </section>

    <section class="page-state error-state" *ngIf="!isLoading && errorMessage">
      <mat-icon>error_outline</mat-icon>
      <div>
        <h1>No se pudo cargar la evaluaci\xF3n</h1>
        <p>{{ errorMessage }}</p>
        <button
          mat-stroked-button
          color="primary"
          type="button"
          (click)="loadEvaluation()"
          *ngIf="evaluatorEmployeeId && evaluatedEmployeeId">
          <mat-icon>refresh</mat-icon>
          Reintentar
        </button>
      </div>
    </section>

    <ng-container *ngIf="!isLoading && !errorMessage && evaluation as currentEvaluation">
      <section
        class="page-state empty-state"
        *ngIf="blockedMessage">
        <mat-icon>task_alt</mat-icon>
        <div>
          <h1>Evaluaci\xF3n no editable</h1>
          <p>{{ blockedMessage }}</p>
        </div>
      </section>

      <ng-container *ngIf="!blockedMessage">
        <section class="evaluation-summary">
          <div class="summary-heading">
            <span class="eyebrow">{{ currentEvaluation.escenario }}</span>
            <h1>{{ currentEvaluation.evaluacion }}</h1>
            <p>
              Responde cada \xEDtem considerando el desempe\xF1o observado de
              <strong>{{ currentEvaluation.evaluado }}</strong>.
            </p>
          </div>

          <dl class="summary-details">
            <div>
              <dt>Evaluador</dt>
              <dd>{{ currentEvaluation.evaluador }}</dd>
            </div>
            <div>
              <dt>Persona evaluada</dt>
              <dd>{{ currentEvaluation.evaluado }}</dd>
            </div>
            <div>
              <dt>Fecha de cierre</dt>
              <dd>{{ formattedClosingDate }}</dd>
            </div>
            <div>
              <dt>Contenido</dt>
              <dd>
                {{ currentEvaluation.dimensiones.length }} dimensiones \xB7
                {{ totalItems }} \xEDtems
              </dd>
            </div>
          </dl>

          <div class="privacy-note" *ngIf="currentEvaluation.esAnonima">
            <mat-icon>lock</mat-icon>
            <span>
              Esta evaluaci\xF3n est\xE1 configurada como an\xF3nima. Responde con objetividad
              y basa tus valoraciones en conductas observables.
            </span>
          </div>
        </section>

        <section
          class="page-state empty-state"
          *ngIf="currentEvaluation.dimensiones.length === 0">
          <mat-icon>assignment_late</mat-icon>
          <div>
            <h1>Evaluaci\xF3n sin contenido</h1>
            <p>A\xFAn no hay dimensiones ni \xEDtems configurados para esta asignaci\xF3n.</p>
          </div>
        </section>

        <app-dynamic-desempeno-form
          *ngIf="currentEvaluation.dimensiones.length > 0"
          [evaluation]="currentEvaluation"
          [disabled]="!!blockedMessage"
          [isSavingDraft]="isSavingDraft"
          [isFinalizing]="isFinalizing"
          [canSaveDraft]="!!turnstileToken"
          [canFinalize]="!!turnstileToken"
          (draftSaveRequested)="saveDraft($event)"
          (finalizeRequested)="finalize($event)">
          <app-turnstile
            security-verification
            action="desempeno-survey"
            language="es"
            (tokenChange)="onTurnstileTokenChange($event)">
          </app-turnstile>
        </app-dynamic-desempeno-form>
      </ng-container>
    </ng-container>
  </div>
</main>
`, styles: ["/* src/app/completedesempenoalone/completedesempenoalone.component.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n.performance-page {\n  min-height: 100vh;\n  background: #f3f5f6;\n  color: #1f2d38;\n}\n.page-toolbar {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  height: 52px;\n  min-height: 52px;\n  max-height: 52px;\n  box-sizing: border-box;\n  padding: 0 max(20px, (100vw - 1080px) / 2);\n  border-bottom: 1px solid #d7e0e4;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(22, 37, 47, 0.06);\n  line-height: 1.2;\n  text-align: left;\n}\n.brand,\n.toolbar-meta {\n  display: flex;\n  gap: 9px;\n  align-items: center;\n}\n.brand {\n  color: #154f5f;\n  font-size: 0.9rem;\n  font-weight: 800;\n}\n.toolbar-meta {\n  color: #566570;\n  font-size: 0.85rem;\n}\n.brand mat-icon,\n.toolbar-meta mat-icon {\n  width: 20px;\n  height: 20px;\n  font-size: 20px;\n}\n.page-content {\n  width: min(1080px, 100% - 32px);\n  margin: 0 auto;\n  padding: 18px 0 40px;\n}\n.evaluation-summary {\n  margin-bottom: 26px;\n  padding: 26px;\n  border: 1px solid #d9e1e5;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 14px rgba(25, 42, 53, 0.05);\n}\n.page-state {\n  display: flex;\n  gap: 18px;\n  align-items: center;\n  min-height: 150px;\n  padding: 28px;\n  border: 1px solid #d9e1e5;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 14px rgba(25, 42, 53, 0.05);\n}\n.page-state > mat-icon {\n  flex: 0 0 auto;\n  width: 34px;\n  height: 34px;\n  color: #176477;\n  font-size: 34px;\n}\n.page-state h1,\n.page-state p {\n  margin: 0;\n}\n.page-state h1 {\n  color: #17252f;\n  font-size: 1.2rem;\n}\n.page-state p {\n  margin-top: 5px;\n  color: #637083;\n}\n.page-state button {\n  margin-top: 14px;\n}\n.error-state > mat-icon {\n  color: #b42318;\n}\n.empty-state {\n  min-height: 120px;\n}\n.summary-heading {\n  max-width: 760px;\n}\n.eyebrow {\n  color: #176477;\n  font-size: 0.76rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.summary-heading h1 {\n  margin: 7px 0 8px;\n  color: #17252f;\n  font-size: clamp(1.55rem, 3vw, 2.15rem);\n  line-height: 1.2;\n}\n.summary-heading p {\n  margin: 0;\n  color: #586874;\n  font-size: 1rem;\n  line-height: 1.6;\n}\n.summary-details {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 16px;\n  margin: 24px 0 0;\n  padding-top: 20px;\n  border-top: 1px solid #e4e9ec;\n}\n.summary-details div {\n  min-width: 0;\n}\n.summary-details dt {\n  margin-bottom: 4px;\n  color: #6b7882;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.summary-details dd {\n  margin: 0;\n  overflow-wrap: anywhere;\n  color: #263640;\n  font-weight: 700;\n}\n.privacy-note {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  margin-top: 20px;\n  padding: 12px 14px;\n  border-left: 4px solid #6d5a8a;\n  background: #f5f2f8;\n  color: #524661;\n  line-height: 1.5;\n}\n.privacy-note mat-icon {\n  flex: 0 0 auto;\n}\n@media (max-width: 800px) {\n  .summary-details {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 520px) {\n  .page-toolbar {\n    align-items: flex-start;\n  }\n  .toolbar-meta {\n    justify-content: flex-end;\n    text-align: right;\n  }\n  .page-content {\n    width: min(100% - 20px, 1080px);\n    padding-top: 12px;\n  }\n  .evaluation-summary {\n    padding: 18px;\n  }\n  .summary-details {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=completedesempenoalone.component.css.map */\n"] }]
  }], () => [{ type: OrganizacionService }, { type: ActivatedRoute }, { type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }, { type: Renderer2 }], { turnstileComponent: [{
    type: ViewChild,
    args: [TurnstileComponent]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompletedesempenoaloneComponent, { className: "CompletedesempenoaloneComponent", filePath: "src/app/completedesempenoalone/completedesempenoalone.component.ts", lineNumber: 33 });
})();

// src/app/completedesempenoalone/completedesempenoalone.routes.ts
var COMPLETE_DESEMPENO_ROUTE = [
  {
    path: "",
    component: CompletedesempenoaloneComponent
  }
];
export {
  COMPLETE_DESEMPENO_ROUTE
};
//# sourceMappingURL=completedesempenoalone.routes-4PQSRVSU.js.map
