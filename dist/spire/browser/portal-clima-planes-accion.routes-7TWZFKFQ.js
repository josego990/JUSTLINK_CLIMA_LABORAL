import {
  TurnstileComponent
} from "./chunk-HYUO6MWQ.js";
import {
  MatProgressBar,
  MatProgressBarModule
} from "./chunk-7ORAAJ7E.js";
import "./chunk-J7XWAFEK.js";
import {
  OrganizacionService
} from "./chunk-ITHPGOKL.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-SKPM4PVR.js";
import "./chunk-TWFG2YEX.js";
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
  MatHint,
  MatLabel
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgModel
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton
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
  Inject,
  Renderer2,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
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
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/portal-clima-planes-accion/portal-clima-planes-accion.component.ts
function PortalClimaPlanesAccionComponent_section_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 13);
    \u0275\u0275element(1, "mat-spinner", 14);
    \u0275\u0275elementStart(2, "h1");
    \u0275\u0275text(3, "Consultando tu plan de acci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Estamos recuperando las actividades, responsables y avances registrados.");
    \u0275\u0275elementEnd()();
  }
}
function PortalClimaPlanesAccionComponent_section_11_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function PortalClimaPlanesAccionComponent_section_11_button_7_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.retryLoad());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Intentar de nuevo ");
    \u0275\u0275elementEnd();
  }
}
function PortalClimaPlanesAccionComponent_section_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 15)(1, "mat-icon");
    \u0275\u0275text(2, "link_off");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h1");
    \u0275\u0275text(4, "No pudimos abrir el plan de acci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, PortalClimaPlanesAccionComponent_section_11_button_7_Template, 4, 0, "button", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.loadError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.accessCode);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_mat_spinner_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 37);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "refresh");
    \u0275\u0275elementEnd();
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 38)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r1.loadError, " Se conserva la informaci\xF3n de la \xFAltima consulta exitosa.");
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 39)(1, "div", 40)(2, "span", 21);
    \u0275\u0275text(3, "Tu responsabilidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 41)(9, "div", 42)(10, "span");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div")(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "small");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "div", 43)(18, "mat-icon");
    \u0275\u0275text(19, "priority_high");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const currentPlan_r4 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentPlan_r4.factor);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", currentPlan_r4.survey, " \xB7 ", ctx_r1.planContextLabel, "");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("--progress", ctx_r1.progressFromTasks);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.progressFromTasks, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(currentPlan_r4.statusName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.completedTasks, " de ", ctx_r1.tasks.length, " tareas completadas");
    \u0275\u0275advance();
    \u0275\u0275attribute("data-priority", currentPlan_r4.priority.toLowerCase());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Prioridad ", currentPlan_r4.priority, "");
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "small");
    \u0275\u0275text(2, "Pregunta cr\xEDtica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const currentPlan_r5 = \u0275\u0275nextContext(2).ngIf;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(currentPlan_r5.criticalQuestion);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "small");
    \u0275\u0275text(2, "Motivo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const currentPlan_r5 = \u0275\u0275nextContext(2).ngIf;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(currentPlan_r5.reason);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275template(1, PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_span_1_Template, 5, 1, "span", 12)(2, PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_span_2_Template, 5, 1, "span", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const currentPlan_r5 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentPlan_r5.criticalQuestion);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentPlan_r5.reason);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_67_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r6.fullName);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56)(1, "span", 57)(2, "mat-icon");
    \u0275\u0275text(3, "groups");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "Responsables del plan");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_67_span_5_Template, 2, 1, "span", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngForOf", ctx_r1.planResponsibles);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 44)(1, "article", 45)(2, "div", 46)(3, "span", 47)(4, "mat-icon");
    \u0275\u0275text(5, "flag");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div")(7, "span", 21);
    \u0275\u0275text(8, "Acci\xF3n principal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "h2");
    \u0275\u0275text(10, "Qu\xE9 se har\xE1");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "p", 48);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275template(13, PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_13_Template, 3, 2, "div", 49);
    \u0275\u0275elementStart(14, "div", 50)(15, "div")(16, "mat-icon");
    \u0275\u0275text(17, "event");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span")(19, "small");
    \u0275\u0275text(20, "Fecha l\xEDmite");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "strong");
    \u0275\u0275text(22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div")(24, "mat-icon");
    \u0275\u0275text(25, "repeat");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span")(27, "small");
    \u0275\u0275text(28, "Periodicidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "strong");
    \u0275\u0275text(30);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div")(32, "mat-icon");
    \u0275\u0275text(33, "analytics");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "span")(35, "small");
    \u0275\u0275text(36, "Indicador de \xE9xito");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "strong");
    \u0275\u0275text(38);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(39, "article", 51)(40, "div", 46)(41, "span", 52)(42, "mat-icon");
    \u0275\u0275text(43, "inventory_2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div")(45, "span", 21);
    \u0275\u0275text(46, "Recursos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "h2");
    \u0275\u0275text(48, "Con qu\xE9 se realizar\xE1");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(49, "p");
    \u0275\u0275text(50);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(51, "div", 53)(52, "div")(53, "small");
    \u0275\u0275text(54, "Patrocinador");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "strong");
    \u0275\u0275text(56);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div")(58, "small");
    \u0275\u0275text(59, "Plazo definido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "strong");
    \u0275\u0275text(61);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "div")(63, "small");
    \u0275\u0275text(64, "Validaci\xF3n esperada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "strong");
    \u0275\u0275text(66);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(67, PortalClimaPlanesAccionComponent_ng_container_12_section_24_div_67_Template, 6, 1, "div", 54);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const currentPlan_r5 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(currentPlan_r5.action);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", currentPlan_r5.criticalQuestion || currentPlan_r5.reason);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(currentPlan_r5.dueDate);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(currentPlan_r5.frequency);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(currentPlan_r5.kpi);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(currentPlan_r5.resources);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(currentPlan_r5.sponsor);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentPlan_r5.term);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentPlan_r5.validation);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.planResponsibles.length);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "mat-icon");
    \u0275\u0275text(2, "inventory_2");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(task_r8.deliverable);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_mat_form_field_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 69)(1, "mat-label");
    \u0275\u0275text(2, "Evidencia o nota de la actividad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 70);
    \u0275\u0275twoWayListener("ngModelChange", function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_mat_form_field_17_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const task_r8 = \u0275\u0275nextContext().$implicit;
      \u0275\u0275twoWayBindingSet(task_r8.evidence, $event) || (task_r8.evidence = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_mat_form_field_17_Template_textarea_ngModelChange_3_listener() {
      \u0275\u0275restoreView(_r9);
      const task_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.markTaskChanged(task_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "mat-hint", 71);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", task_r8.evidence);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", task_r8.evidence.length, "/2000");
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_ng_template_18_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73)(1, "small");
    \u0275\u0275text(2, "Evidencia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(task_r8.evidence);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_ng_template_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_ng_template_18_div_0_Template, 5, 1, "div", 72);
  }
  if (rf & 2) {
    const task_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("ngIf", task_r8.evidence);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 62)(1, "mat-checkbox", 63);
    \u0275\u0275listener("change", function PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_Template_mat_checkbox_change_1_listener($event) {
      const task_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      task_r8.completed = $event.checked;
      return \u0275\u0275resetView(ctx_r1.markTaskChanged(task_r8));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 64)(3, "div", 65)(4, "div", 66)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span")(8, "mat-icon");
    \u0275\u0275text(9, "person_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_span_11_Template, 4, 1, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 67)(13, "mat-icon");
    \u0275\u0275text(14, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(17, PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_mat_form_field_17_Template, 6, 2, "mat-form-field", 68)(18, PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_ng_template_18_Template, 1, 1, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r8 = ctx.$implicit;
    const evidenceReadonly_r10 = \u0275\u0275reference(19);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("completed", task_r8.completed);
    \u0275\u0275advance();
    \u0275\u0275property("checked", task_r8.completed)("disabled", !ctx_r1.canEdit || !task_r8.canEdit);
    \u0275\u0275attribute("aria-label", (task_r8.completed ? "Marcar pendiente: " : "Marcar completada: ") + task_r8.title);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(task_r8.title);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(task_r8.owner);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", task_r8.deliverable);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(task_r8.dueDate);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.canEdit && task_r8.canEdit)("ngIfElse", evidenceReadonly_r10);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275template(1, PortalClimaPlanesAccionComponent_ng_container_12_div_37_article_1_Template, 20, 11, "article", 61);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.tasks)("ngForTrackBy", ctx_r1.trackByTaskId);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 74)(1, "mat-icon");
    \u0275\u0275text(2, "checklist");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Este plan todav\xEDa no tiene actividades asignadas.");
    \u0275\u0275elementEnd()();
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 87)(1, "mat-icon");
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, "Cambios pendientes de guardar");
    \u0275\u0275elementEnd();
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_span_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 88)(1, "mat-icon");
    \u0275\u0275text(2, "verified_user");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Verificaci\xF3n requerida para guardar ");
    \u0275\u0275elementEnd();
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_mat_spinner_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 89);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_ng_template_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "save");
    \u0275\u0275elementEnd();
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 90)(1, "mat-icon");
    \u0275\u0275text(2, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.saveMessage);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 91)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.saveError);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75)(1, "mat-form-field", 76)(2, "mat-label");
    \u0275\u0275text(3, "Comentario de seguimiento (opcional)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "textarea", 77);
    \u0275\u0275twoWayListener("ngModelChange", function PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template_textarea_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.followUpComment, $event) || (ctx_r1.followUpComment = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template_textarea_ngModelChange_4_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.clearSaveFeedback());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-hint", 71);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 78)(8, "app-turnstile", 79);
    \u0275\u0275listener("tokenChange", function PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template_app_turnstile_tokenChange_8_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onTurnstileTokenChange($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 80);
    \u0275\u0275template(10, PortalClimaPlanesAccionComponent_ng_container_12_div_40_span_10_Template, 4, 0, "span", 81)(11, PortalClimaPlanesAccionComponent_ng_container_12_div_40_span_11_Template, 4, 0, "span", 82);
    \u0275\u0275elementStart(12, "button", 83);
    \u0275\u0275listener("click", function PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.saveProgress());
    });
    \u0275\u0275template(13, PortalClimaPlanesAccionComponent_ng_container_12_div_40_mat_spinner_13_Template, 1, 0, "mat-spinner", 84)(14, PortalClimaPlanesAccionComponent_ng_container_12_div_40_ng_template_14_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(18, PortalClimaPlanesAccionComponent_ng_container_12_div_40_div_18_Template, 5, 1, "div", 85)(19, PortalClimaPlanesAccionComponent_ng_container_12_div_40_div_19_Template, 5, 1, "div", 86);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const saveIcon_r12 = \u0275\u0275reference(15);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.followUpComment);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.followUpComment.length, "/2000");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.hasPendingChanges);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasPendingChanges && !ctx_r1.turnstileToken);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r1.hasPendingChanges || ctx_r1.isSaving || !ctx_r1.turnstileToken);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isSaving)("ngIfElse", saveIcon_r12);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.isSaving ? "Guardando..." : "Guardar progreso");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saveMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saveError);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_41_article_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 96)(1, "span", 97)(2, "mat-icon");
    \u0275\u0275text(3, "history");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 98);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const followUp_r13 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(followUp_r13.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(followUp_r13.comment);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", followUp_r13.progress, "%");
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_section_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 92)(1, "div", 30)(2, "div")(3, "span", 21);
    \u0275\u0275text(4, "Historial");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h2");
    \u0275\u0275text(6, "Seguimientos registrados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8, "Consulta las actualizaciones compartidas por los responsables.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 93);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 94);
    \u0275\u0275template(12, PortalClimaPlanesAccionComponent_ng_container_12_section_41_article_12_Template, 11, 3, "article", 95);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r1.followUps.length);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.followUps)("ngForTrackBy", ctx_r1.trackByFollowUpId);
  }
}
function PortalClimaPlanesAccionComponent_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 18)(2, "div", 19)(3, "span", 20);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div")(6, "span", 21);
    \u0275\u0275text(7, "Plan asignado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 22)(13, "div", 23)(14, "mat-icon");
    \u0275\u0275text(15, "mail_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "button", 24);
    \u0275\u0275listener("click", function PortalClimaPlanesAccionComponent_ng_container_12_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refreshPlan());
    });
    \u0275\u0275template(19, PortalClimaPlanesAccionComponent_ng_container_12_mat_spinner_19_Template, 1, 0, "mat-spinner", 25)(20, PortalClimaPlanesAccionComponent_ng_container_12_ng_template_20_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(22, PortalClimaPlanesAccionComponent_ng_container_12_section_22_Template, 5, 1, "section", 26)(23, PortalClimaPlanesAccionComponent_ng_container_12_section_23_Template, 22, 11, "section", 27)(24, PortalClimaPlanesAccionComponent_ng_container_12_section_24_Template, 68, 10, "section", 28);
    \u0275\u0275elementStart(25, "section", 29)(26, "div", 30)(27, "div")(28, "span", 21);
    \u0275\u0275text(29, "Seguimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "h2");
    \u0275\u0275text(31, "Actividades del plan");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "p");
    \u0275\u0275text(33, "Marca las actividades realizadas y registra la evidencia correspondiente.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "span", 31);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(36, "mat-progress-bar", 32);
    \u0275\u0275template(37, PortalClimaPlanesAccionComponent_ng_container_12_div_37_Template, 2, 2, "div", 33)(38, PortalClimaPlanesAccionComponent_ng_container_12_ng_template_38_Template, 5, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor)(40, PortalClimaPlanesAccionComponent_ng_container_12_div_40_Template, 20, 10, "div", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275template(41, PortalClimaPlanesAccionComponent_ng_container_12_section_41_Template, 13, 3, "section", 35);
    \u0275\u0275elementStart(42, "footer", 36)(43, "mat-icon");
    \u0275\u0275text(44, "shield");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span");
    \u0275\u0275text(46, "Este enlace es personal. La informaci\xF3n del plan es confidencial para tu organizaci\xF3n.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const currentResponsible_r14 = ctx.ngIf;
    const refreshIcon_r15 = \u0275\u0275reference(21);
    const emptyTasks_r16 = \u0275\u0275reference(39);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(currentResponsible_r14.initials);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentResponsible_r14.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", currentResponsible_r14.position, " \xB7 ", currentResponsible_r14.organization, "");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(currentResponsible_r14.email);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isRefreshing || ctx_r1.isSaving || ctx_r1.hasPendingChanges)("matTooltip", ctx_r1.hasPendingChanges ? "Guarda tus cambios antes de actualizar" : ctx_r1.isRefreshing ? "Actualizando plan" : "Actualizar plan");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isRefreshing)("ngIfElse", refreshIcon_r15);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.loadError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.plan);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.plan);
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate2("", ctx_r1.completedTasks, "/", ctx_r1.tasks.length, "");
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.progressFromTasks);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.tasks.length)("ngIfElse", emptyTasks_r16);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.canEdit);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.followUps.length);
  }
}
var PortalClimaPlanesAccionComponent = class _PortalClimaPlanesAccionComponent {
  constructor(route, organizationService, document, renderer) {
    this.organizationService = organizationService;
    this.document = document;
    this.renderer = renderer;
    this.responsible = null;
    this.climate = null;
    this.plan = null;
    this.planResponsibles = [];
    this.tasks = [];
    this.followUps = [];
    this.followUpComment = "";
    this.isLoading = true;
    this.isRefreshing = false;
    this.isSaving = false;
    this.loadError = "";
    this.saveError = "";
    this.saveMessage = "";
    this.turnstileToken = "";
    this.changedTaskIds = /* @__PURE__ */ new Set();
    this.originalBodyClassName = "";
    this.managedThemeClasses = ["dark", "dark-theme", "theme-black", "theme-purple", "theme-blue", "theme-cyan", "theme-green", "theme-orange", "theme-red", "menu_dark", "menu_light", "logo-black", "logo-white"];
    const encodedContext = route.snapshot.paramMap.get("contexto") ?? route.snapshot.queryParamMap.get("codigoPlanResponsable") ?? route.snapshot.queryParamMap.get("contexto") ?? route.snapshot.queryParamMap.get("ref");
    this.context = this.decodeContext(encodedContext);
    this.accessCode = this.context ? btoa(`${this.context.empleadoId}|${this.context.climaId}|${this.context.planId}`) : null;
    if (!encodedContext) {
      this.loadError = "El enlace no contiene los datos necesarios para consultar el plan de acci\xF3n.";
    } else if (!this.context) {
      this.loadError = "El enlace no tiene un formato v\xE1lido.";
    }
  }
  ngOnInit() {
    this.forceLightTheme();
    this.loadPlan();
  }
  ngOnDestroy() {
    this.dataRequest?.unsubscribe();
    this.saveRequest?.unsubscribe();
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.document.body.className = this.originalBodyClassName;
  }
  get completedTasks() {
    return this.tasks.filter((task) => task.completed).length;
  }
  get progressFromTasks() {
    return this.tasks.length ? Math.round(this.completedTasks / this.tasks.length * 100) : this.plan?.progress ?? 0;
  }
  get canEdit() {
    return Boolean(this.plan?.canEdit);
  }
  get hasPendingChanges() {
    return this.changedTaskIds.size > 0 || Boolean(this.followUpComment.trim());
  }
  get planContextLabel() {
    return this.plan?.scope || this.plan?.area || "Alcance general";
  }
  refreshPlan() {
    this.loadPlan(true);
  }
  retryLoad() {
    this.loadPlan();
  }
  markTaskChanged(task) {
    if (!this.canEdit || !task.canEdit) {
      return;
    }
    this.changedTaskIds.add(task.id);
    this.clearSaveFeedback();
  }
  clearSaveFeedback() {
    this.saveMessage = "";
    this.saveError = "";
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
      this.feedbackTimer = void 0;
    }
  }
  saveProgress() {
    if (!this.accessCode || !this.canEdit || this.isSaving || !this.hasPendingChanges) {
      return;
    }
    if (!this.turnstileToken) {
      this.saveError = "Completa la verificaci\xF3n de seguridad antes de guardar el progreso.";
      return;
    }
    const comment = this.followUpComment.trim();
    const payload = {
      codigoPlanResponsable: this.accessCode,
      tareas: this.tasks.filter((task) => this.changedTaskIds.has(task.id)).map((task) => ({
        id: task.id,
        completada: task.completed,
        evidencia: task.evidence.trim()
      }))
    };
    if (comment) {
      payload.comentario = comment;
    }
    this.isSaving = true;
    this.clearSaveFeedback();
    this.saveRequest?.unsubscribe();
    const request = this.organizationService.saveClimaActionPlanPortalProgress(payload, this.turnstileToken).subscribe({
      next: (response) => {
        const data = response?.data ?? response;
        if (response?.ok === false || !data?.plan || !data?.responsable) {
          this.saveError = response?.message || "El servidor no devolvi\xF3 el plan actualizado.";
          return;
        }
        this.applyResponse(data);
        this.followUpComment = "";
        this.changedTaskIds.clear();
        this.saveMessage = response?.message || "El progreso fue actualizado correctamente.";
        this.scheduleFeedbackClear();
      },
      error: (error) => {
        this.saveError = this.getErrorMessage(error, "No fue posible guardar el progreso. Intenta nuevamente.");
      }
    });
    request.add(() => {
      this.isSaving = false;
      this.resetTurnstile();
    });
    this.saveRequest = request;
  }
  trackByTaskId(_, task) {
    return task.id;
  }
  trackByFollowUpId(_, followUp) {
    return followUp.id;
  }
  onTurnstileTokenChange(token) {
    this.turnstileToken = token;
    if (token && this.saveError === "Completa la verificaci\xF3n de seguridad antes de guardar el progreso.") {
      this.saveError = "";
    }
  }
  loadPlan(refresh = false) {
    if (!this.accessCode) {
      this.isLoading = false;
      return;
    }
    if (refresh) {
      if (this.isRefreshing) {
        return;
      }
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    this.loadError = "";
    this.clearSaveFeedback();
    this.dataRequest?.unsubscribe();
    const request = this.organizationService.getClimaActionPlanPortal(this.accessCode).subscribe({
      next: (response) => {
        const data = response?.data ?? response;
        if (response?.ok === false || !data?.plan || !data?.responsable) {
          this.handleLoadError(response?.message || "La respuesta del servidor no contiene datos v\xE1lidos.", refresh);
          return;
        }
        this.applyResponse(data);
      },
      error: (error) => {
        this.handleLoadError(this.getErrorMessage(error, "No fue posible consultar el plan de acci\xF3n."), refresh);
      }
    });
    request.add(() => {
      this.isLoading = false;
      this.isRefreshing = false;
    });
    this.dataRequest = request;
  }
  applyResponse(data) {
    const responsible = data.responsable ?? {};
    const climate = data.clima ?? {};
    const plan = data.plan ?? {};
    const fullName = String(responsible.nombreCompleto || "Responsable del plan").trim();
    this.responsible = {
      id: this.toPositiveInteger(responsible.id),
      fullName,
      initials: String(responsible.iniciales || this.getInitials(fullName)).trim().slice(0, 3).toUpperCase(),
      position: String(responsible.cargo || "Cargo no especificado"),
      organization: String(responsible.organizacion || "Organizaci\xF3n no especificada"),
      email: String(responsible.email || "Correo no especificado")
    };
    this.climate = {
      id: this.toPositiveInteger(climate.id, this.context?.climaId ?? 0),
      name: String(climate.nombre || "Clima organizacional")
    };
    this.plan = {
      id: this.toPositiveInteger(plan.id, this.context?.planId ?? 0),
      survey: String(plan.encuesta || climate.nombre || "Clima organizacional"),
      factor: String(plan.factor || plan.area || "Plan de acci\xF3n"),
      area: String(plan.area || ""),
      scope: String(plan.alcance || ""),
      criticalQuestion: String(plan.preguntaCritica || ""),
      reason: String(plan.motivo || ""),
      action: String(plan.accion || "Acci\xF3n pendiente de definir."),
      resources: String(plan.recursos || "Recursos pendientes de definir."),
      kpi: String(plan.kpi || "Indicador pendiente de definir."),
      sponsor: String(plan.patrocinador || "No especificado"),
      term: String(plan.plazo || "No especificado"),
      dueDate: this.formatDate(plan.fechaLimite),
      frequency: String(plan.frecuenciaSeguimiento || "No especificada"),
      validation: String(plan.validacion || "Validaci\xF3n pendiente de definir."),
      priority: this.titleCase(plan.prioridad || "MEDIA"),
      statusCode: String(plan.estadoCodigo || "SIN_INICIAR").toUpperCase(),
      statusName: String(plan.estadoNombre || "Sin iniciar"),
      progress: this.clampPercentage(plan.progresoPct),
      totalTasks: this.toNonNegativeInteger(plan.totalTareas),
      completedTasks: this.toNonNegativeInteger(plan.tareasCompletadas),
      canEdit: this.toBoolean(plan.puedeEditar, true)
    };
    this.planResponsibles = (Array.isArray(data.responsables) ? data.responsables : []).map((item) => ({
      id: this.toPositiveInteger(item?.idEmpleado),
      fullName: String(item?.nombreCompleto || "Responsable"),
      position: String(item?.cargo || "Cargo no especificado")
    })).filter((item) => item.id > 0);
    this.tasks = (Array.isArray(data.tareas) ? data.tareas : []).map((item, index) => this.mapTask(item, index)).filter((item) => item !== null).sort((left, right) => left.order - right.order || left.id - right.id);
    this.followUps = (Array.isArray(data.seguimientos) ? data.seguimientos : []).map((item) => this.mapFollowUp(item)).filter((item) => item !== null).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    this.changedTaskIds.clear();
    this.loadError = "";
  }
  mapTask(value, index) {
    const id = this.toPositiveInteger(value?.id);
    if (!id) {
      return null;
    }
    return {
      id,
      title: String(value?.titulo || `Actividad ${index + 1}`),
      owner: String(value?.responsable || "Responsable del plan"),
      deliverable: String(value?.entregable || ""),
      dueDate: this.formatDate(value?.fechaLimite),
      evidence: String(value?.evidencia || ""),
      completed: this.toBoolean(value?.completada),
      order: this.toNonNegativeInteger(value?.orden, index + 1),
      canEdit: this.toBoolean(value?.puedeEditar, true)
    };
  }
  mapFollowUp(value) {
    const id = this.toPositiveInteger(value?.id);
    if (!id) {
      return null;
    }
    return {
      id,
      date: this.formatDate(value?.fecha, "Fecha no especificada"),
      comment: String(value?.comentario || ""),
      progress: this.clampPercentage(value?.avancePct),
      createdAt: String(value?.creadoEn || value?.fecha || "")
    };
  }
  handleLoadError(message, retainCurrentData) {
    this.loadError = message;
    if (!retainCurrentData) {
      this.responsible = null;
      this.climate = null;
      this.plan = null;
      this.planResponsibles = [];
      this.tasks = [];
      this.followUps = [];
    }
  }
  scheduleFeedbackClear() {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedbackTimer = setTimeout(() => {
      this.saveMessage = "";
      this.feedbackTimer = void 0;
    }, 7e3);
  }
  resetTurnstile() {
    this.turnstileToken = "";
    this.turnstileComponent?.reset();
  }
  getErrorMessage(error, fallback) {
    return String(error?.error?.message || error?.response?.data?.message || error?.message || fallback);
  }
  decodeContext(encodedContext) {
    if (!encodedContext)
      return null;
    try {
      const normalized = decodeURIComponent(encodedContext).replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
      const [employeeValue, climaValue, planValue, ...extraValues] = atob(padded).split("|");
      const empleadoId = Number(employeeValue);
      const climaId = Number(climaValue);
      const planId = Number(planValue);
      return extraValues.length === 0 && [empleadoId, climaId, planId].every((value) => Number.isInteger(value) && value > 0) ? { empleadoId, climaId, planId } : null;
    } catch {
      return null;
    }
  }
  formatDate(value, fallback = "Sin fecha l\xEDmite") {
    if (!value) {
      return fallback;
    }
    const rawValue = String(value).trim();
    const date = /^\d{4}-\d{2}-\d{2}$/.test(rawValue) ? /* @__PURE__ */ new Date(`${rawValue}T12:00:00`) : new Date(rawValue);
    if (Number.isNaN(date.getTime())) {
      return rawValue;
    }
    return new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }
  getInitials(fullName) {
    return fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "RP";
  }
  titleCase(value) {
    const text = String(value || "").trim().toLowerCase();
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
  }
  toPositiveInteger(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
  toNonNegativeInteger(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
  }
  clampPercentage(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(100, Math.max(0, Math.round(parsed))) : fallback;
  }
  toBoolean(value, fallback = false) {
    if (value === true || value === 1 || value === "1") {
      return true;
    }
    if (value === false || value === 0 || value === "0") {
      return false;
    }
    const normalized = String(value ?? "").trim().toLowerCase();
    if (["true", "si", "s\xED", "yes"].includes(normalized)) {
      return true;
    }
    if (["false", "no"].includes(normalized)) {
      return false;
    }
    return fallback;
  }
  forceLightTheme() {
    this.originalBodyClassName = this.document.body.className;
    this.managedThemeClasses.forEach((className) => this.renderer.removeClass(this.document.body, className));
    this.renderer.addClass(this.document.body, "light");
    this.renderer.addClass(this.document.body, "theme-white");
    this.renderer.addClass(this.document.body, "portal-clima-action-plan-light");
  }
  static {
    this.\u0275fac = function PortalClimaPlanesAccionComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PortalClimaPlanesAccionComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(OrganizacionService), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(Renderer2));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortalClimaPlanesAccionComponent, selectors: [["app-portal-clima-planes-accion"]], viewQuery: function PortalClimaPlanesAccionComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(TurnstileComponent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.turnstileComponent = _t.first);
      }
    }, decls: 13, vars: 3, consts: [["refreshIcon", ""], ["emptyTasks", ""], ["evidenceReadonly", ""], ["saveIcon", ""], [1, "action-plan-portal"], [1, "portal-toolbar"], [1, "portal-toolbar__content"], ["src", "assets/images/Justlink-360.png", "alt", "Justlink-360", 1, "brand-logo"], [1, "portal-toolbar__label"], [1, "portal-content"], ["class", "portal-state", "aria-live", "polite", 4, "ngIf"], ["class", "portal-state portal-state--error", 4, "ngIf"], [4, "ngIf"], ["aria-live", "polite", 1, "portal-state"], ["diameter", "38", "strokeWidth", "4"], [1, "portal-state", "portal-state--error"], ["mat-stroked-button", "", "type", "button", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "type", "button", 3, "click"], [1, "responsible-header"], [1, "responsible-identity"], [1, "responsible-avatar"], [1, "eyebrow"], [1, "responsible-actions"], [1, "responsible-contact"], ["mat-icon-button", "", "type", "button", "aria-label", "Actualizar plan", 1, "refresh-button", 3, "click", "disabled", "matTooltip"], ["diameter", "20", "strokeWidth", "3", 4, "ngIf", "ngIfElse"], ["class", "context-message context-message--error", 4, "ngIf"], ["class", "plan-overview", 4, "ngIf"], ["class", "plan-layout", 4, "ngIf"], [1, "tasks-section"], [1, "section-heading"], [1, "task-count"], ["mode", "determinate", 3, "value"], ["class", "task-list", 4, "ngIf", "ngIfElse"], ["class", "progress-editor", 4, "ngIf"], ["class", "history-section", 4, "ngIf"], [1, "privacy-footer"], ["diameter", "20", "strokeWidth", "3"], [1, "context-message", "context-message--error"], [1, "plan-overview"], [1, "overview-copy"], [1, "overview-progress"], [1, "progress-ring"], [1, "priority-chip"], [1, "plan-layout"], [1, "plan-card", "action-card"], [1, "card-heading"], [1, "heading-icon"], [1, "action-description"], ["class", "opportunity-context", 4, "ngIf"], [1, "plan-details"], [1, "plan-card", "resource-card"], [1, "heading-icon", "neutral"], [1, "support-details"], ["class", "assigned-people", 4, "ngIf"], [1, "opportunity-context"], [1, "assigned-people"], [1, "assigned-people__label"], ["class", "person-chip", 4, "ngFor", "ngForOf"], [1, "person-chip"], [1, "task-list"], ["class", "task-row", 3, "completed", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "task-row"], ["color", "primary", 1, "task-status", 3, "change", "checked", "disabled"], [1, "task-content"], [1, "task-main"], [1, "task-copy"], [1, "task-date"], ["appearance", "outline", "class", "evidence-field", 4, "ngIf", "ngIfElse"], ["appearance", "outline", 1, "evidence-field"], ["matInput", "", "rows", "2", "maxlength", "2000", "placeholder", "Describe el avance, resultado o ubicaci\xF3n de la evidencia", 3, "ngModelChange", "ngModel"], ["align", "end"], ["class", "evidence-readonly", 4, "ngIf"], [1, "evidence-readonly"], [1, "empty-tasks"], [1, "progress-editor"], ["appearance", "outline", 1, "comment-field"], ["matInput", "", "rows", "3", "maxlength", "2000", "placeholder", "Resume avances, bloqueos o pr\xF3ximos pasos", 3, "ngModelChange", "ngModel"], [1, "portal-turnstile"], ["action", "clima-action-plan-progress", "theme", "light", 3, "tokenChange"], [1, "save-actions"], ["class", "unsaved-label", 4, "ngIf"], ["class", "security-label", 4, "ngIf"], ["mat-flat-button", "", "color", "primary", "type", "button", 3, "click", "disabled"], ["diameter", "19", "strokeWidth", "3", 4, "ngIf", "ngIfElse"], ["class", "save-feedback save-feedback--success", "role", "status", 4, "ngIf"], ["class", "save-feedback save-feedback--error", "role", "alert", 4, "ngIf"], [1, "unsaved-label"], [1, "security-label"], ["diameter", "19", "strokeWidth", "3"], ["role", "status", 1, "save-feedback", "save-feedback--success"], ["role", "alert", 1, "save-feedback", "save-feedback--error"], [1, "history-section"], [1, "history-count"], [1, "history-list"], ["class", "history-row", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "history-row"], [1, "history-marker"], [1, "history-progress"]], template: function PortalClimaPlanesAccionComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "main", 4)(1, "header", 5)(2, "div", 6);
        \u0275\u0275element(3, "img", 7);
        \u0275\u0275elementStart(4, "div", 8)(5, "mat-icon");
        \u0275\u0275text(6, "assignment_turned_in");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span");
        \u0275\u0275text(8, "Planes de acci\xF3n");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(9, "div", 9);
        \u0275\u0275template(10, PortalClimaPlanesAccionComponent_section_10_Template, 6, 0, "section", 10)(11, PortalClimaPlanesAccionComponent_section_11_Template, 8, 2, "section", 11)(12, PortalClimaPlanesAccionComponent_ng_container_12_Template, 47, 19, "ng-container", 12);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && !ctx.responsible);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.responsible);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, DefaultValueAccessor, NgControlStatus, MaxLengthValidator, NgModel, MatButtonModule, MatButton, MatIconButton, MatCheckboxModule, MatCheckbox, MatFormFieldModule, MatFormField, MatLabel, MatHint, MatIconModule, MatIcon, MatInputModule, MatInput, MatProgressBarModule, MatProgressBar, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip, TurnstileComponent], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.action-plan-portal[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f4f6f8;\n  color: #203040;\n}\n.portal-toolbar[_ngcontent-%COMP%] {\n  height: 70px;\n  border-bottom: 1px solid #dde4e9;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(20, 38, 50, 0.05);\n}\n.portal-toolbar__content[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  height: 100%;\n  justify-content: space-between;\n  margin: 0 auto;\n  width: min(1440px, 100% - 56px);\n}\n.brand-logo[_ngcontent-%COMP%] {\n  display: block;\n  height: 38px;\n  object-fit: contain;\n  width: 158px;\n}\n.portal-toolbar__label[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #405261;\n  display: flex;\n  font-size: 0.95rem;\n  font-weight: 700;\n  gap: 10px;\n}\n.portal-toolbar__label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #176477;\n  font-size: 23px;\n  height: 23px;\n  width: 23px;\n}\n.portal-content[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  padding: 32px 0 48px;\n  width: min(1440px, 100% - 56px);\n}\n.responsible-header[_ngcontent-%COMP%], \n.plan-overview[_ngcontent-%COMP%], \n.plan-card[_ngcontent-%COMP%], \n.tasks-section[_ngcontent-%COMP%], \n.history-section[_ngcontent-%COMP%] {\n  background: #fff;\n  border: 1px solid #dce4e9;\n  border-radius: 10px;\n  box-shadow: 0 5px 22px rgba(24, 43, 55, 0.055);\n}\n.responsible-header[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 30px;\n  justify-content: space-between;\n  padding: 28px 32px;\n}\n.responsible-identity[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 20px;\n  min-width: 0;\n}\n.responsible-avatar[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #176477;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  box-shadow: 0 0 0 1px #d6e0e6, 0 4px 12px rgba(20, 44, 57, 0.13);\n  color: #fff;\n  display: flex;\n  flex: 0 0 74px;\n  font-size: 1.18rem;\n  font-weight: 800;\n  height: 74px;\n  justify-content: center;\n  width: 74px;\n}\n.eyebrow[_ngcontent-%COMP%] {\n  color: #176477;\n  display: block;\n  font-size: 0.8rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\nh1[_ngcontent-%COMP%], \nh2[_ngcontent-%COMP%], \np[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.responsible-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #172733;\n  font-size: 1.68rem;\n  line-height: 1.22;\n  margin: 5px 0;\n}\n.responsible-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #647481;\n  font-size: 1rem;\n}\n.responsible-contact[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #536774;\n  display: flex;\n  font-size: 0.94rem;\n  gap: 9px;\n  min-width: 0;\n}\n.responsible-contact[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #738493;\n  font-size: 20px;\n  height: 20px;\n  width: 20px;\n}\n.responsible-actions[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 14px;\n}\n.refresh-button[_ngcontent-%COMP%] {\n  border: 1px solid #dbe4e9;\n  color: #41616e;\n  flex: 0 0 auto;\n}\n.refresh-button[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  margin: auto;\n}\n.context-message[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  font-size: 0.8rem;\n  gap: 9px;\n  margin-top: 12px;\n  padding: 10px 13px;\n}\n.context-message--error[_ngcontent-%COMP%] {\n  background: #fff2f0;\n  border-left: 3px solid #b9574b;\n  color: #82473f;\n}\n.context-message[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  font-size: 19px;\n  height: 19px;\n  width: 19px;\n}\n.plan-overview[_ngcontent-%COMP%] {\n  align-items: center;\n  display: grid;\n  gap: 34px;\n  grid-template-columns: minmax(320px, 1fr) auto auto;\n  margin-top: 20px;\n  padding: 26px 32px;\n}\n.overview-copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.card-heading[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.section-heading[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: #172733;\n  font-size: 1.36rem;\n  margin: 5px 0;\n}\n.overview-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.section-heading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #70808d;\n  font-size: 0.96rem;\n}\n.overview-progress[_ngcontent-%COMP%] {\n  align-items: center;\n  border-left: 1px solid #e1e7eb;\n  display: flex;\n  gap: 12px;\n  padding-left: 28px;\n}\n.progress-ring[_ngcontent-%COMP%] {\n  --progress:0;\n  align-items: center;\n  background: conic-gradient(#176477 calc(var(--progress) * 1%), #e4eaee 0);\n  border-radius: 50%;\n  display: flex;\n  height: 72px;\n  justify-content: center;\n  position: relative;\n  width: 72px;\n}\n.progress-ring[_ngcontent-%COMP%]::before {\n  background: #fff;\n  border-radius: 50%;\n  content: "";\n  height: 54px;\n  position: absolute;\n  width: 54px;\n}\n.progress-ring[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #174b59;\n  font-size: 0.92rem;\n  font-weight: 800;\n  position: relative;\n}\n.overview-progress[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.overview-progress[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.overview-progress[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #293b48;\n  font-size: 1.05rem;\n}\n.overview-progress[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #73818d;\n  font-size: 0.84rem;\n  margin-top: 3px;\n}\n.priority-chip[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #fff4f1;\n  border: 1px solid #f0c8c2;\n  border-radius: 999px;\n  color: #a24a3f;\n  display: flex;\n  font-size: 0.86rem;\n  font-weight: 750;\n  gap: 6px;\n  padding: 9px 13px;\n  white-space: nowrap;\n}\n.priority-chip[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.priority-chip[data-priority=media][_ngcontent-%COMP%] {\n  background: #fff9e9;\n  border-color: #ead59a;\n  color: #886a19;\n}\n.priority-chip[data-priority=baja][_ngcontent-%COMP%] {\n  background: #eaf7ef;\n  border-color: #b9ddc8;\n  color: #26734c;\n}\n.plan-layout[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 20px;\n  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);\n  margin-top: 20px;\n}\n.plan-card[_ngcontent-%COMP%] {\n  padding: 26px 30px;\n}\n.card-heading[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 14px;\n}\n.heading-icon[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #e7f2f6;\n  border-radius: 9px;\n  color: #176477;\n  display: flex;\n  height: 44px;\n  justify-content: center;\n  width: 44px;\n}\n.heading-icon.neutral[_ngcontent-%COMP%] {\n  background: #edf1f5;\n  color: #5f7280;\n}\n.heading-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 21px;\n  height: 21px;\n  width: 21px;\n}\n.action-description[_ngcontent-%COMP%] {\n  color: #334956;\n  font-size: 1.05rem;\n  line-height: 1.68;\n  margin: 20px 0;\n}\n.opportunity-context[_ngcontent-%COMP%] {\n  background: #f7f9fb;\n  border-left: 3px solid #7794a3;\n  display: grid;\n  gap: 11px;\n  margin: 0 0 20px;\n  padding: 14px 16px;\n}\n.opportunity-context[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.support-details[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n.opportunity-context[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.opportunity-context[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.support-details[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.support-details[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n}\n.opportunity-context[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.support-details[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #73828e;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.opportunity-context[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #40545f;\n  font-size: 0.92rem;\n  font-weight: 600;\n  line-height: 1.5;\n  margin-top: 3px;\n}\n.plan-details[_ngcontent-%COMP%] {\n  border-top: 1px solid #e7ecef;\n  display: grid;\n  gap: 16px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  padding-top: 17px;\n}\n.plan-details[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  display: flex;\n  gap: 8px;\n  min-width: 0;\n}\n.plan-details[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #6b8290;\n  flex: 0 0 auto;\n  font-size: 19px;\n  height: 19px;\n  width: 19px;\n}\n.plan-details[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.plan-details[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n}\n.plan-details[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #74828e;\n  font-size: 0.78rem;\n}\n.plan-details[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #324652;\n  font-size: 0.9rem;\n  line-height: 1.42;\n  margin-top: 3px;\n}\n.resource-card[_ngcontent-%COMP%]    > p[_ngcontent-%COMP%] {\n  color: #526874;\n  font-size: 1rem;\n  line-height: 1.66;\n  margin: 20px 0;\n}\n.support-details[_ngcontent-%COMP%] {\n  background: #f7f9fa;\n  display: grid;\n  gap: 10px;\n  padding: 11px;\n}\n.support-details[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #435863;\n  font-size: 0.9rem;\n  font-weight: 600;\n  line-height: 1.45;\n  margin-top: 3px;\n}\n.assigned-people[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 13px;\n}\n.assigned-people__label[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #657985;\n  display: flex;\n  font-size: 0.71rem;\n  font-weight: 700;\n  gap: 5px;\n  margin-right: 2px;\n}\n.assigned-people__label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.person-chip[_ngcontent-%COMP%] {\n  background: #eaf4f6;\n  border: 1px solid #cfe2e7;\n  border-radius: 999px;\n  color: #285c69;\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 5px 8px;\n}\n.tasks-section[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  padding: 26px 30px 10px;\n}\n.section-heading[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  display: flex;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 15px;\n}\n.task-count[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #edf5f7;\n  border-radius: 999px;\n  color: #176477;\n  display: flex;\n  font-size: 0.95rem;\n  font-weight: 800;\n  height: 36px;\n  justify-content: center;\n  min-width: 64px;\n}\n.tasks-section[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%] {\n  border-radius: 999px;\n  height: 6px;\n}\n.task-list[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.task-row[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  border-bottom: 1px solid #e8edf0;\n  display: grid;\n  gap: 16px;\n  grid-template-columns: 38px minmax(0, 1fr);\n  padding: 18px 4px 12px;\n}\n.task-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.task-status[_ngcontent-%COMP%] {\n  margin-top: 3px;\n}\n.task-content[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.task-main[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  display: grid;\n  gap: 18px;\n  grid-template-columns: minmax(0, 1fr) 260px;\n}\n.task-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.task-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.task-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n}\n.task-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #314450;\n  font-size: 1rem;\n}\n.task-row.completed[_ngcontent-%COMP%]   .task-copy[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #71818a;\n  text-decoration: line-through;\n}\n.task-copy[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #7a8893;\n  display: flex;\n  font-size: 0.86rem;\n  gap: 6px;\n  margin-top: 5px;\n}\n.task-copy[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 15px;\n  height: 15px;\n  width: 15px;\n}\n.task-date[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #627680;\n  display: flex;\n  font-size: 0.88rem;\n  gap: 7px;\n}\n.task-date[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #82929b;\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.evidence-field[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  width: 100%;\n}\n.evidence-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.comment-field[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  line-height: 1.45;\n  resize: vertical;\n}\n.evidence-readonly[_ngcontent-%COMP%] {\n  background: #f7f9fa;\n  color: #5c707c;\n  font-size: 0.76rem;\n  line-height: 1.45;\n  margin-top: 10px;\n  padding: 10px 12px;\n}\n.evidence-readonly[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.evidence-readonly[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n}\n.evidence-readonly[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #74828d;\n  font-size: 0.65rem;\n  font-weight: 700;\n  margin-bottom: 2px;\n  text-transform: uppercase;\n}\n.empty-tasks[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #70818b;\n  display: flex;\n  font-size: 0.82rem;\n  gap: 8px;\n  justify-content: center;\n  min-height: 100px;\n}\n.empty-tasks[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #8298a3;\n}\n.progress-editor[_ngcontent-%COMP%] {\n  background: #f7f9fa;\n  border-top: 1px solid #e4eaed;\n  margin: 14px -30px -10px;\n  padding: 22px 30px;\n}\n.comment-field[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.portal-turnstile[_ngcontent-%COMP%] {\n  margin: 2px 0 18px;\n  max-width: 760px;\n}\n.save-actions[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  justify-content: flex-end;\n}\n.save-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: 7px;\n  min-width: 174px;\n}\n.save-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n}\n.unsaved-label[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #806523;\n  display: flex;\n  font-size: 0.73rem;\n  gap: 5px;\n}\n.unsaved-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  height: 16px;\n  width: 16px;\n}\n.security-label[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #5d6d77;\n  display: flex;\n  font-size: 0.76rem;\n  gap: 5px;\n}\n.security-label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #176477;\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.save-feedback[_ngcontent-%COMP%] {\n  align-items: center;\n  border-left: 3px solid;\n  display: flex;\n  font-size: 0.78rem;\n  gap: 7px;\n  margin-top: 13px;\n  padding: 9px 11px;\n}\n.save-feedback[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n}\n.save-feedback--success[_ngcontent-%COMP%] {\n  background: #eaf7ef;\n  border-color: #2e8a5c;\n  color: #286647;\n}\n.save-feedback--error[_ngcontent-%COMP%] {\n  background: #fff1ef;\n  border-color: #b9564b;\n  color: #82453e;\n}\n.history-section[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  padding: 26px 30px 16px;\n}\n.history-count[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #edf2f5;\n  border-radius: 999px;\n  color: #536a76;\n  display: flex;\n  font-size: 0.78rem;\n  font-weight: 800;\n  height: 30px;\n  justify-content: center;\n  min-width: 38px;\n}\n.history-row[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  border-top: 1px solid #e7ecef;\n  display: grid;\n  gap: 11px;\n  grid-template-columns: 28px minmax(0, 1fr) auto;\n  padding: 13px 3px;\n}\n.history-marker[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #edf5f7;\n  border-radius: 6px;\n  color: #347184;\n  display: flex;\n  height: 28px;\n  justify-content: center;\n  width: 28px;\n}\n.history-marker[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.history-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #3f5360;\n  display: block;\n  font-size: 0.9rem;\n}\n.history-row[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #667985;\n  font-size: 0.9rem;\n  line-height: 1.52;\n  margin-top: 4px;\n}\n.history-progress[_ngcontent-%COMP%] {\n  background: #edf5f7;\n  border-radius: 999px;\n  color: #276878;\n  font-size: 0.82rem;\n  font-weight: 800;\n  padding: 6px 10px;\n}\n.privacy-footer[_ngcontent-%COMP%] {\n  align-items: center;\n  color: #71808a;\n  display: flex;\n  font-size: 0.86rem;\n  gap: 7px;\n  justify-content: center;\n  padding: 25px 8px 0;\n  text-align: center;\n}\n.privacy-footer[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #548092;\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n}\n.portal-state[_ngcontent-%COMP%] {\n  align-items: center;\n  background: #fff;\n  border: 1px solid #dce4e9;\n  border-radius: 10px;\n  color: #687984;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin: 26px auto;\n  min-height: 420px;\n  padding: 58px 30px;\n  text-align: center;\n  width: min(880px, 100% - 32px);\n}\n.portal-state[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  color: #a6543e;\n  font-size: 34px;\n  height: 34px;\n  width: 34px;\n}\n.portal-state[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  margin-bottom: 2px;\n}\n.portal-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #20313e;\n  font-size: 1.38rem;\n  margin: 18px 0 8px;\n}\n.portal-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  max-width: 540px;\n}\n.portal-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-top: 18px;\n}\n@media (max-width: 900px) {\n  .plan-overview[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr auto;\n  }\n  .priority-chip[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    justify-self: start;\n  }\n  .plan-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .plan-details[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 620px) {\n  .portal-toolbar__content[_ngcontent-%COMP%], \n   .portal-content[_ngcontent-%COMP%] {\n    width: calc(100% - 24px);\n  }\n  .portal-toolbar__label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n   .responsible-contact[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .responsible-header[_ngcontent-%COMP%] {\n    padding: 18px;\n  }\n  .responsible-avatar[_ngcontent-%COMP%] {\n    flex-basis: 52px;\n    height: 52px;\n    width: 52px;\n  }\n  .responsible-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .plan-overview[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 16px;\n    padding: 18px;\n  }\n  .overview-progress[_ngcontent-%COMP%] {\n    border-left: 0;\n    border-top: 1px solid #e1e7eb;\n    padding-left: 0;\n    padding-top: 15px;\n  }\n  .priority-chip[_ngcontent-%COMP%] {\n    grid-column: auto;\n  }\n  .plan-card[_ngcontent-%COMP%], \n   .tasks-section[_ngcontent-%COMP%], \n   .history-section[_ngcontent-%COMP%] {\n    padding: 18px;\n  }\n  .task-main[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .task-date[_ngcontent-%COMP%] {\n    margin-top: 2px;\n  }\n  .progress-editor[_ngcontent-%COMP%] {\n    margin: 10px -18px -8px;\n    padding: 16px 18px;\n  }\n  .portal-turnstile[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n  .save-actions[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .save-actions[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    justify-content: center;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=portal-clima-planes-accion.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortalClimaPlanesAccionComponent, [{
    type: Component,
    args: [{ selector: "app-portal-clima-planes-accion", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatTooltipModule,
      TurnstileComponent
    ], template: `<main class="action-plan-portal">
  <header class="portal-toolbar">
    <div class="portal-toolbar__content">
      <img src="assets/images/Justlink-360.png" alt="Justlink-360" class="brand-logo" />
      <div class="portal-toolbar__label"><mat-icon>assignment_turned_in</mat-icon><span>Planes de acci\xF3n</span></div>
    </div>
  </header>

  <div class="portal-content">
    <section class="portal-state" *ngIf="isLoading" aria-live="polite">
      <mat-spinner diameter="38" strokeWidth="4"></mat-spinner>
      <h1>Consultando tu plan de acci\xF3n</h1>
      <p>Estamos recuperando las actividades, responsables y avances registrados.</p>
    </section>

    <section class="portal-state portal-state--error" *ngIf="!isLoading && !responsible">
      <mat-icon>link_off</mat-icon>
      <h1>No pudimos abrir el plan de acci\xF3n</h1>
      <p>{{ loadError }}</p>
      <button mat-stroked-button type="button" *ngIf="accessCode" (click)="retryLoad()">
        <mat-icon>refresh</mat-icon>
        Intentar de nuevo
      </button>
    </section>

    <ng-container *ngIf="!isLoading && responsible as currentResponsible">
    <section class="responsible-header">
      <div class="responsible-identity">
        <span class="responsible-avatar">{{ currentResponsible.initials }}</span>
        <div>
          <span class="eyebrow">Plan asignado</span>
          <h1>{{ currentResponsible.fullName }}</h1>
          <p>{{ currentResponsible.position }} \xB7 {{ currentResponsible.organization }}</p>
        </div>
      </div>
      <div class="responsible-actions">
        <div class="responsible-contact"><mat-icon>mail_outline</mat-icon><span>{{ currentResponsible.email }}</span></div>
        <button
          mat-icon-button
          type="button"
          class="refresh-button"
          [disabled]="isRefreshing || isSaving || hasPendingChanges"
          [matTooltip]="hasPendingChanges ? 'Guarda tus cambios antes de actualizar' : (isRefreshing ? 'Actualizando plan' : 'Actualizar plan')"
          aria-label="Actualizar plan"
          (click)="refreshPlan()">
          <mat-spinner *ngIf="isRefreshing; else refreshIcon" diameter="20" strokeWidth="3"></mat-spinner>
          <ng-template #refreshIcon><mat-icon>refresh</mat-icon></ng-template>
        </button>
      </div>
    </section>

    <section class="context-message context-message--error" *ngIf="loadError">
      <mat-icon>error_outline</mat-icon>
      <span>{{ loadError }} Se conserva la informaci\xF3n de la \xFAltima consulta exitosa.</span>
    </section>

    <section class="plan-overview" *ngIf="plan as currentPlan">
      <div class="overview-copy">
        <span class="eyebrow">Tu responsabilidad</span>
        <h2>{{ currentPlan.factor }}</h2>
        <p>{{ currentPlan.survey }} \xB7 {{ planContextLabel }}</p>
      </div>
      <div class="overview-progress">
        <div class="progress-ring" [style.--progress]="progressFromTasks"><span>{{ progressFromTasks }}%</span></div>
        <div><strong>{{ currentPlan.statusName }}</strong><small>{{ completedTasks }} de {{ tasks.length }} tareas completadas</small></div>
      </div>
      <div class="priority-chip" [attr.data-priority]="currentPlan.priority.toLowerCase()"><mat-icon>priority_high</mat-icon><span>Prioridad {{ currentPlan.priority }}</span></div>
    </section>

    <section class="plan-layout" *ngIf="plan as currentPlan">
      <article class="plan-card action-card">
        <div class="card-heading"><span class="heading-icon"><mat-icon>flag</mat-icon></span><div><span class="eyebrow">Acci\xF3n principal</span><h2>Qu\xE9 se har\xE1</h2></div></div>
        <p class="action-description">{{ currentPlan.action }}</p>
        <div class="opportunity-context" *ngIf="currentPlan.criticalQuestion || currentPlan.reason">
          <span *ngIf="currentPlan.criticalQuestion"><small>Pregunta cr\xEDtica</small><strong>{{ currentPlan.criticalQuestion }}</strong></span>
          <span *ngIf="currentPlan.reason"><small>Motivo</small><strong>{{ currentPlan.reason }}</strong></span>
        </div>
        <div class="plan-details">
          <div><mat-icon>event</mat-icon><span><small>Fecha l\xEDmite</small><strong>{{ currentPlan.dueDate }}</strong></span></div>
          <div><mat-icon>repeat</mat-icon><span><small>Periodicidad</small><strong>{{ currentPlan.frequency }}</strong></span></div>
          <div><mat-icon>analytics</mat-icon><span><small>Indicador de \xE9xito</small><strong>{{ currentPlan.kpi }}</strong></span></div>
        </div>
      </article>

      <article class="plan-card resource-card">
        <div class="card-heading"><span class="heading-icon neutral"><mat-icon>inventory_2</mat-icon></span><div><span class="eyebrow">Recursos</span><h2>Con qu\xE9 se realizar\xE1</h2></div></div>
        <p>{{ currentPlan.resources }}</p>
        <div class="support-details">
          <div><small>Patrocinador</small><strong>{{ currentPlan.sponsor }}</strong></div>
          <div><small>Plazo definido</small><strong>{{ currentPlan.term }}</strong></div>
          <div><small>Validaci\xF3n esperada</small><strong>{{ currentPlan.validation }}</strong></div>
        </div>
        <div class="assigned-people" *ngIf="planResponsibles.length">
          <span class="assigned-people__label"><mat-icon>groups</mat-icon>Responsables del plan</span>
          <span class="person-chip" *ngFor="let item of planResponsibles">{{ item.fullName }}</span>
        </div>
      </article>
    </section>

    <section class="tasks-section">
      <div class="section-heading"><div><span class="eyebrow">Seguimiento</span><h2>Actividades del plan</h2><p>Marca las actividades realizadas y registra la evidencia correspondiente.</p></div><span class="task-count">{{ completedTasks }}/{{ tasks.length }}</span></div>
      <mat-progress-bar mode="determinate" [value]="progressFromTasks"></mat-progress-bar>
      <div class="task-list" *ngIf="tasks.length; else emptyTasks">
        <article class="task-row" *ngFor="let task of tasks; trackBy: trackByTaskId" [class.completed]="task.completed">
          <mat-checkbox
            class="task-status"
            color="primary"
            [checked]="task.completed"
            [disabled]="!canEdit || !task.canEdit"
            [attr.aria-label]="(task.completed ? 'Marcar pendiente: ' : 'Marcar completada: ') + task.title"
            (change)="task.completed = $event.checked; markTaskChanged(task)">
          </mat-checkbox>
          <div class="task-content">
            <div class="task-main">
              <div class="task-copy">
                <strong>{{ task.title }}</strong>
                <span><mat-icon>person_outline</mat-icon>{{ task.owner }}</span>
                <span *ngIf="task.deliverable"><mat-icon>inventory_2</mat-icon>{{ task.deliverable }}</span>
              </div>
              <div class="task-date"><mat-icon>calendar_today</mat-icon><span>{{ task.dueDate }}</span></div>
            </div>
            <mat-form-field appearance="outline" class="evidence-field" *ngIf="canEdit && task.canEdit; else evidenceReadonly">
              <mat-label>Evidencia o nota de la actividad</mat-label>
              <textarea
                matInput
                rows="2"
                maxlength="2000"
                [(ngModel)]="task.evidence"
                (ngModelChange)="markTaskChanged(task)"
                placeholder="Describe el avance, resultado o ubicaci\xF3n de la evidencia"></textarea>
              <mat-hint align="end">{{ task.evidence.length }}/2000</mat-hint>
            </mat-form-field>
            <ng-template #evidenceReadonly>
              <div class="evidence-readonly" *ngIf="task.evidence"><small>Evidencia</small><span>{{ task.evidence }}</span></div>
            </ng-template>
          </div>
        </article>
      </div>

      <ng-template #emptyTasks>
        <div class="empty-tasks"><mat-icon>checklist</mat-icon><span>Este plan todav\xEDa no tiene actividades asignadas.</span></div>
      </ng-template>

      <div class="progress-editor" *ngIf="canEdit">
        <mat-form-field appearance="outline" class="comment-field">
          <mat-label>Comentario de seguimiento (opcional)</mat-label>
          <textarea
            matInput
            rows="3"
            maxlength="2000"
            [(ngModel)]="followUpComment"
            (ngModelChange)="clearSaveFeedback()"
            placeholder="Resume avances, bloqueos o pr\xF3ximos pasos"></textarea>
          <mat-hint align="end">{{ followUpComment.length }}/2000</mat-hint>
        </mat-form-field>
        <div class="portal-turnstile">
          <app-turnstile
            action="clima-action-plan-progress"
            theme="light"
            (tokenChange)="onTurnstileTokenChange($event)">
          </app-turnstile>
        </div>
        <div class="save-actions">
          <span class="unsaved-label" *ngIf="hasPendingChanges"><mat-icon>edit</mat-icon>Cambios pendientes de guardar</span>
          <span class="security-label" *ngIf="hasPendingChanges && !turnstileToken">
            <mat-icon>verified_user</mat-icon>
            Verificaci\xF3n requerida para guardar
          </span>
          <button
            mat-flat-button
            color="primary"
            type="button"
            [disabled]="!hasPendingChanges || isSaving || !turnstileToken"
            (click)="saveProgress()">
            <mat-spinner *ngIf="isSaving; else saveIcon" diameter="19" strokeWidth="3"></mat-spinner>
            <ng-template #saveIcon><mat-icon>save</mat-icon></ng-template>
            <span>{{ isSaving ? 'Guardando...' : 'Guardar progreso' }}</span>
          </button>
        </div>
        <div class="save-feedback save-feedback--success" *ngIf="saveMessage" role="status"><mat-icon>check_circle</mat-icon><span>{{ saveMessage }}</span></div>
        <div class="save-feedback save-feedback--error" *ngIf="saveError" role="alert"><mat-icon>error_outline</mat-icon><span>{{ saveError }}</span></div>
      </div>
    </section>

    <section class="history-section" *ngIf="followUps.length">
      <div class="section-heading">
        <div><span class="eyebrow">Historial</span><h2>Seguimientos registrados</h2><p>Consulta las actualizaciones compartidas por los responsables.</p></div>
        <span class="history-count">{{ followUps.length }}</span>
      </div>
      <div class="history-list">
        <article class="history-row" *ngFor="let followUp of followUps; trackBy: trackByFollowUpId">
          <span class="history-marker"><mat-icon>history</mat-icon></span>
          <div><strong>{{ followUp.date }}</strong><p>{{ followUp.comment }}</p></div>
          <span class="history-progress">{{ followUp.progress }}%</span>
        </article>
      </div>
    </section>

    <footer class="privacy-footer"><mat-icon>shield</mat-icon><span>Este enlace es personal. La informaci\xF3n del plan es confidencial para tu organizaci\xF3n.</span></footer>
    </ng-container>
  </div>
</main>
`, styles: ['/* src/app/portal-clima-planes-accion/portal-clima-planes-accion.component.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n* {\n  box-sizing: border-box;\n}\n.action-plan-portal {\n  min-height: 100vh;\n  background: #f4f6f8;\n  color: #203040;\n}\n.portal-toolbar {\n  height: 70px;\n  border-bottom: 1px solid #dde4e9;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(20, 38, 50, 0.05);\n}\n.portal-toolbar__content {\n  align-items: center;\n  display: flex;\n  height: 100%;\n  justify-content: space-between;\n  margin: 0 auto;\n  width: min(1440px, 100% - 56px);\n}\n.brand-logo {\n  display: block;\n  height: 38px;\n  object-fit: contain;\n  width: 158px;\n}\n.portal-toolbar__label {\n  align-items: center;\n  color: #405261;\n  display: flex;\n  font-size: 0.95rem;\n  font-weight: 700;\n  gap: 10px;\n}\n.portal-toolbar__label mat-icon {\n  color: #176477;\n  font-size: 23px;\n  height: 23px;\n  width: 23px;\n}\n.portal-content {\n  margin: 0 auto;\n  padding: 32px 0 48px;\n  width: min(1440px, 100% - 56px);\n}\n.responsible-header,\n.plan-overview,\n.plan-card,\n.tasks-section,\n.history-section {\n  background: #fff;\n  border: 1px solid #dce4e9;\n  border-radius: 10px;\n  box-shadow: 0 5px 22px rgba(24, 43, 55, 0.055);\n}\n.responsible-header {\n  align-items: center;\n  display: flex;\n  gap: 30px;\n  justify-content: space-between;\n  padding: 28px 32px;\n}\n.responsible-identity {\n  align-items: center;\n  display: flex;\n  gap: 20px;\n  min-width: 0;\n}\n.responsible-avatar {\n  align-items: center;\n  background: #176477;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  box-shadow: 0 0 0 1px #d6e0e6, 0 4px 12px rgba(20, 44, 57, 0.13);\n  color: #fff;\n  display: flex;\n  flex: 0 0 74px;\n  font-size: 1.18rem;\n  font-weight: 800;\n  height: 74px;\n  justify-content: center;\n  width: 74px;\n}\n.eyebrow {\n  color: #176477;\n  display: block;\n  font-size: 0.8rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\nh1,\nh2,\np {\n  margin: 0;\n}\n.responsible-header h1 {\n  color: #172733;\n  font-size: 1.68rem;\n  line-height: 1.22;\n  margin: 5px 0;\n}\n.responsible-header p {\n  color: #647481;\n  font-size: 1rem;\n}\n.responsible-contact {\n  align-items: center;\n  color: #536774;\n  display: flex;\n  font-size: 0.94rem;\n  gap: 9px;\n  min-width: 0;\n}\n.responsible-contact mat-icon {\n  color: #738493;\n  font-size: 20px;\n  height: 20px;\n  width: 20px;\n}\n.responsible-actions {\n  align-items: center;\n  display: flex;\n  gap: 14px;\n}\n.refresh-button {\n  border: 1px solid #dbe4e9;\n  color: #41616e;\n  flex: 0 0 auto;\n}\n.refresh-button mat-spinner {\n  margin: auto;\n}\n.context-message {\n  align-items: center;\n  display: flex;\n  font-size: 0.8rem;\n  gap: 9px;\n  margin-top: 12px;\n  padding: 10px 13px;\n}\n.context-message--error {\n  background: #fff2f0;\n  border-left: 3px solid #b9574b;\n  color: #82473f;\n}\n.context-message mat-icon {\n  flex: 0 0 auto;\n  font-size: 19px;\n  height: 19px;\n  width: 19px;\n}\n.plan-overview {\n  align-items: center;\n  display: grid;\n  gap: 34px;\n  grid-template-columns: minmax(320px, 1fr) auto auto;\n  margin-top: 20px;\n  padding: 26px 32px;\n}\n.overview-copy h2,\n.card-heading h2,\n.section-heading h2 {\n  color: #172733;\n  font-size: 1.36rem;\n  margin: 5px 0;\n}\n.overview-copy p,\n.section-heading p {\n  color: #70808d;\n  font-size: 0.96rem;\n}\n.overview-progress {\n  align-items: center;\n  border-left: 1px solid #e1e7eb;\n  display: flex;\n  gap: 12px;\n  padding-left: 28px;\n}\n.progress-ring {\n  --progress:0;\n  align-items: center;\n  background: conic-gradient(#176477 calc(var(--progress) * 1%), #e4eaee 0);\n  border-radius: 50%;\n  display: flex;\n  height: 72px;\n  justify-content: center;\n  position: relative;\n  width: 72px;\n}\n.progress-ring::before {\n  background: #fff;\n  border-radius: 50%;\n  content: "";\n  height: 54px;\n  position: absolute;\n  width: 54px;\n}\n.progress-ring span {\n  color: #174b59;\n  font-size: 0.92rem;\n  font-weight: 800;\n  position: relative;\n}\n.overview-progress strong,\n.overview-progress small {\n  display: block;\n}\n.overview-progress strong {\n  color: #293b48;\n  font-size: 1.05rem;\n}\n.overview-progress small {\n  color: #73818d;\n  font-size: 0.84rem;\n  margin-top: 3px;\n}\n.priority-chip {\n  align-items: center;\n  background: #fff4f1;\n  border: 1px solid #f0c8c2;\n  border-radius: 999px;\n  color: #a24a3f;\n  display: flex;\n  font-size: 0.86rem;\n  font-weight: 750;\n  gap: 6px;\n  padding: 9px 13px;\n  white-space: nowrap;\n}\n.priority-chip mat-icon {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.priority-chip[data-priority=media] {\n  background: #fff9e9;\n  border-color: #ead59a;\n  color: #886a19;\n}\n.priority-chip[data-priority=baja] {\n  background: #eaf7ef;\n  border-color: #b9ddc8;\n  color: #26734c;\n}\n.plan-layout {\n  display: grid;\n  gap: 20px;\n  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);\n  margin-top: 20px;\n}\n.plan-card {\n  padding: 26px 30px;\n}\n.card-heading {\n  align-items: center;\n  display: flex;\n  gap: 14px;\n}\n.heading-icon {\n  align-items: center;\n  background: #e7f2f6;\n  border-radius: 9px;\n  color: #176477;\n  display: flex;\n  height: 44px;\n  justify-content: center;\n  width: 44px;\n}\n.heading-icon.neutral {\n  background: #edf1f5;\n  color: #5f7280;\n}\n.heading-icon mat-icon {\n  font-size: 21px;\n  height: 21px;\n  width: 21px;\n}\n.action-description {\n  color: #334956;\n  font-size: 1.05rem;\n  line-height: 1.68;\n  margin: 20px 0;\n}\n.opportunity-context {\n  background: #f7f9fb;\n  border-left: 3px solid #7794a3;\n  display: grid;\n  gap: 11px;\n  margin: 0 0 20px;\n  padding: 14px 16px;\n}\n.opportunity-context span,\n.support-details div {\n  display: block;\n  min-width: 0;\n}\n.opportunity-context small,\n.opportunity-context strong,\n.support-details small,\n.support-details strong {\n  display: block;\n}\n.opportunity-context small,\n.support-details small {\n  color: #73828e;\n  font-size: 0.76rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.opportunity-context strong {\n  color: #40545f;\n  font-size: 0.92rem;\n  font-weight: 600;\n  line-height: 1.5;\n  margin-top: 3px;\n}\n.plan-details {\n  border-top: 1px solid #e7ecef;\n  display: grid;\n  gap: 16px;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  padding-top: 17px;\n}\n.plan-details > div {\n  align-items: flex-start;\n  display: flex;\n  gap: 8px;\n  min-width: 0;\n}\n.plan-details mat-icon {\n  color: #6b8290;\n  flex: 0 0 auto;\n  font-size: 19px;\n  height: 19px;\n  width: 19px;\n}\n.plan-details small,\n.plan-details strong {\n  display: block;\n}\n.plan-details small {\n  color: #74828e;\n  font-size: 0.78rem;\n}\n.plan-details strong {\n  color: #324652;\n  font-size: 0.9rem;\n  line-height: 1.42;\n  margin-top: 3px;\n}\n.resource-card > p {\n  color: #526874;\n  font-size: 1rem;\n  line-height: 1.66;\n  margin: 20px 0;\n}\n.support-details {\n  background: #f7f9fa;\n  display: grid;\n  gap: 10px;\n  padding: 11px;\n}\n.support-details strong {\n  color: #435863;\n  font-size: 0.9rem;\n  font-weight: 600;\n  line-height: 1.45;\n  margin-top: 3px;\n}\n.assigned-people {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  margin-top: 13px;\n}\n.assigned-people__label {\n  align-items: center;\n  color: #657985;\n  display: flex;\n  font-size: 0.71rem;\n  font-weight: 700;\n  gap: 5px;\n  margin-right: 2px;\n}\n.assigned-people__label mat-icon {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.person-chip {\n  background: #eaf4f6;\n  border: 1px solid #cfe2e7;\n  border-radius: 999px;\n  color: #285c69;\n  font-size: 0.68rem;\n  font-weight: 700;\n  padding: 5px 8px;\n}\n.tasks-section {\n  margin-top: 20px;\n  padding: 26px 30px 10px;\n}\n.section-heading {\n  align-items: flex-start;\n  display: flex;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 15px;\n}\n.task-count {\n  align-items: center;\n  background: #edf5f7;\n  border-radius: 999px;\n  color: #176477;\n  display: flex;\n  font-size: 0.95rem;\n  font-weight: 800;\n  height: 36px;\n  justify-content: center;\n  min-width: 64px;\n}\n.tasks-section mat-progress-bar {\n  border-radius: 999px;\n  height: 6px;\n}\n.task-list {\n  margin-top: 12px;\n}\n.task-row {\n  align-items: flex-start;\n  border-bottom: 1px solid #e8edf0;\n  display: grid;\n  gap: 16px;\n  grid-template-columns: 38px minmax(0, 1fr);\n  padding: 18px 4px 12px;\n}\n.task-row:last-child {\n  border-bottom: 0;\n}\n.task-status {\n  margin-top: 3px;\n}\n.task-content {\n  min-width: 0;\n}\n.task-main {\n  align-items: flex-start;\n  display: grid;\n  gap: 18px;\n  grid-template-columns: minmax(0, 1fr) 260px;\n}\n.task-copy {\n  min-width: 0;\n}\n.task-copy strong,\n.task-copy span {\n  display: block;\n}\n.task-copy strong {\n  color: #314450;\n  font-size: 1rem;\n}\n.task-row.completed .task-copy strong {\n  color: #71818a;\n  text-decoration: line-through;\n}\n.task-copy span {\n  align-items: center;\n  color: #7a8893;\n  display: flex;\n  font-size: 0.86rem;\n  gap: 6px;\n  margin-top: 5px;\n}\n.task-copy mat-icon {\n  font-size: 15px;\n  height: 15px;\n  width: 15px;\n}\n.task-date {\n  align-items: center;\n  color: #627680;\n  display: flex;\n  font-size: 0.88rem;\n  gap: 7px;\n}\n.task-date mat-icon {\n  color: #82929b;\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.evidence-field {\n  margin-top: 12px;\n  width: 100%;\n}\n.evidence-field textarea,\n.comment-field textarea {\n  line-height: 1.45;\n  resize: vertical;\n}\n.evidence-readonly {\n  background: #f7f9fa;\n  color: #5c707c;\n  font-size: 0.76rem;\n  line-height: 1.45;\n  margin-top: 10px;\n  padding: 10px 12px;\n}\n.evidence-readonly small,\n.evidence-readonly span {\n  display: block;\n}\n.evidence-readonly small {\n  color: #74828d;\n  font-size: 0.65rem;\n  font-weight: 700;\n  margin-bottom: 2px;\n  text-transform: uppercase;\n}\n.empty-tasks {\n  align-items: center;\n  color: #70818b;\n  display: flex;\n  font-size: 0.82rem;\n  gap: 8px;\n  justify-content: center;\n  min-height: 100px;\n}\n.empty-tasks mat-icon {\n  color: #8298a3;\n}\n.progress-editor {\n  background: #f7f9fa;\n  border-top: 1px solid #e4eaed;\n  margin: 14px -30px -10px;\n  padding: 22px 30px;\n}\n.comment-field {\n  width: 100%;\n}\n.portal-turnstile {\n  margin: 2px 0 18px;\n  max-width: 760px;\n}\n.save-actions {\n  align-items: center;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  justify-content: flex-end;\n}\n.save-actions button {\n  align-items: center;\n  display: flex;\n  gap: 7px;\n  min-width: 174px;\n}\n.save-actions button mat-spinner {\n  display: inline-block;\n}\n.unsaved-label {\n  align-items: center;\n  color: #806523;\n  display: flex;\n  font-size: 0.73rem;\n  gap: 5px;\n}\n.unsaved-label mat-icon {\n  font-size: 16px;\n  height: 16px;\n  width: 16px;\n}\n.security-label {\n  align-items: center;\n  color: #5d6d77;\n  display: flex;\n  font-size: 0.76rem;\n  gap: 5px;\n}\n.security-label mat-icon {\n  color: #176477;\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.save-feedback {\n  align-items: center;\n  border-left: 3px solid;\n  display: flex;\n  font-size: 0.78rem;\n  gap: 7px;\n  margin-top: 13px;\n  padding: 9px 11px;\n}\n.save-feedback mat-icon {\n  flex: 0 0 auto;\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n}\n.save-feedback--success {\n  background: #eaf7ef;\n  border-color: #2e8a5c;\n  color: #286647;\n}\n.save-feedback--error {\n  background: #fff1ef;\n  border-color: #b9564b;\n  color: #82453e;\n}\n.history-section {\n  margin-top: 20px;\n  padding: 26px 30px 16px;\n}\n.history-count {\n  align-items: center;\n  background: #edf2f5;\n  border-radius: 999px;\n  color: #536a76;\n  display: flex;\n  font-size: 0.78rem;\n  font-weight: 800;\n  height: 30px;\n  justify-content: center;\n  min-width: 38px;\n}\n.history-row {\n  align-items: flex-start;\n  border-top: 1px solid #e7ecef;\n  display: grid;\n  gap: 11px;\n  grid-template-columns: 28px minmax(0, 1fr) auto;\n  padding: 13px 3px;\n}\n.history-marker {\n  align-items: center;\n  background: #edf5f7;\n  border-radius: 6px;\n  color: #347184;\n  display: flex;\n  height: 28px;\n  justify-content: center;\n  width: 28px;\n}\n.history-marker mat-icon {\n  font-size: 17px;\n  height: 17px;\n  width: 17px;\n}\n.history-row strong {\n  color: #3f5360;\n  display: block;\n  font-size: 0.9rem;\n}\n.history-row p {\n  color: #667985;\n  font-size: 0.9rem;\n  line-height: 1.52;\n  margin-top: 4px;\n}\n.history-progress {\n  background: #edf5f7;\n  border-radius: 999px;\n  color: #276878;\n  font-size: 0.82rem;\n  font-weight: 800;\n  padding: 6px 10px;\n}\n.privacy-footer {\n  align-items: center;\n  color: #71808a;\n  display: flex;\n  font-size: 0.86rem;\n  gap: 7px;\n  justify-content: center;\n  padding: 25px 8px 0;\n  text-align: center;\n}\n.privacy-footer mat-icon {\n  color: #548092;\n  font-size: 18px;\n  height: 18px;\n  width: 18px;\n}\n.portal-state {\n  align-items: center;\n  background: #fff;\n  border: 1px solid #dce4e9;\n  border-radius: 10px;\n  color: #687984;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin: 26px auto;\n  min-height: 420px;\n  padding: 58px 30px;\n  text-align: center;\n  width: min(880px, 100% - 32px);\n}\n.portal-state > mat-icon {\n  color: #a6543e;\n  font-size: 34px;\n  height: 34px;\n  width: 34px;\n}\n.portal-state mat-spinner {\n  margin-bottom: 2px;\n}\n.portal-state h1 {\n  color: #20313e;\n  font-size: 1.38rem;\n  margin: 18px 0 8px;\n}\n.portal-state p {\n  font-size: 1rem;\n  max-width: 540px;\n}\n.portal-state button {\n  margin-top: 18px;\n}\n@media (max-width: 900px) {\n  .plan-overview {\n    grid-template-columns: 1fr auto;\n  }\n  .priority-chip {\n    grid-column: 1/-1;\n    justify-self: start;\n  }\n  .plan-layout {\n    grid-template-columns: 1fr;\n  }\n  .plan-details {\n    grid-template-columns: 1fr;\n  }\n}\n@media (max-width: 620px) {\n  .portal-toolbar__content,\n  .portal-content {\n    width: calc(100% - 24px);\n  }\n  .portal-toolbar__label span,\n  .responsible-contact {\n    display: none;\n  }\n  .responsible-header {\n    padding: 18px;\n  }\n  .responsible-avatar {\n    flex-basis: 52px;\n    height: 52px;\n    width: 52px;\n  }\n  .responsible-header h1 {\n    font-size: 1.2rem;\n  }\n  .plan-overview {\n    grid-template-columns: 1fr;\n    gap: 16px;\n    padding: 18px;\n  }\n  .overview-progress {\n    border-left: 0;\n    border-top: 1px solid #e1e7eb;\n    padding-left: 0;\n    padding-top: 15px;\n  }\n  .priority-chip {\n    grid-column: auto;\n  }\n  .plan-card,\n  .tasks-section,\n  .history-section {\n    padding: 18px;\n  }\n  .task-main {\n    grid-template-columns: 1fr;\n  }\n  .task-date {\n    margin-top: 2px;\n  }\n  .progress-editor {\n    margin: 10px -18px -8px;\n    padding: 16px 18px;\n  }\n  .portal-turnstile {\n    max-width: 100%;\n  }\n  .save-actions {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .save-actions button {\n    justify-content: center;\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=portal-clima-planes-accion.component.css.map */\n'] }]
  }], () => [{ type: ActivatedRoute }, { type: OrganizacionService }, { type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }, { type: Renderer2 }], { turnstileComponent: [{
    type: ViewChild,
    args: [TurnstileComponent]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortalClimaPlanesAccionComponent, { className: "PortalClimaPlanesAccionComponent", filePath: "src/app/portal-clima-planes-accion/portal-clima-planes-accion.component.ts", lineNumber: 107 });
})();

// src/app/portal-clima-planes-accion/portal-clima-planes-accion.routes.ts
var PORTAL_CLIMA_PLANES_ACCION_ROUTE = [
  { path: "", component: PortalClimaPlanesAccionComponent },
  { path: ":contexto", component: PortalClimaPlanesAccionComponent }
];
export {
  PORTAL_CLIMA_PLANES_ACCION_ROUTE
};
//# sourceMappingURL=portal-clima-planes-accion.routes-7TWZFKFQ.js.map
