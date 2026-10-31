import {
  MatButtonToggle,
  MatButtonToggleGroup,
  MatButtonToggleModule
} from "./chunk-V3JCO6CX.js";
import {
  MatProgressBar,
  MatProgressBarModule
} from "./chunk-7ORAAJ7E.js";
import {
  OrganizacionService
} from "./chunk-ITHPGOKL.js";
import "./chunk-RTX2H4T5.js";
import "./chunk-AMSP6ESA.js";
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
  FormsModule,
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
  ɵɵnextContext,
  ɵɵproperty,
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
  ɵɵtwoWayProperty
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/portal-desempeno-evaluaciones/portal-desempeno-evaluaciones.component.ts
function PortalDesempenoEvaluacionesComponent_section_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12);
    \u0275\u0275element(1, "mat-spinner", 13);
    \u0275\u0275elementStart(2, "h1");
    \u0275\u0275text(3, "Consultando tus evaluaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5, "Estamos recuperando tus asignaciones y su avance.");
    \u0275\u0275elementEnd()();
  }
}
function PortalDesempenoEvaluacionesComponent_section_11_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function PortalDesempenoEvaluacionesComponent_section_11_button_8_Template_button_click_0_listener() {
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
function PortalDesempenoEvaluacionesComponent_section_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 14)(1, "div", 15)(2, "mat-icon");
    \u0275\u0275text(3, "link_off");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "h1");
    \u0275\u0275text(5, "No pudimos abrir el centro de evaluaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, PortalDesempenoEvaluacionesComponent_section_11_button_8_Template, 4, 0, "button", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r1.loadError);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.accessCode);
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", ctx_r1.model == null ? null : ctx_r1.model.name, "");
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "mat-icon");
    \u0275\u0275text(2, "error_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r1.loadError, " Los datos mostrados corresponden a la \xFAltima consulta exitosa.");
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_mat_spinner_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-spinner", 47);
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_ng_template_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "refresh");
    \u0275\u0275elementEnd();
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_span_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "mat-icon");
    \u0275\u0275text(2, "timer");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const evaluation_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", evaluation_r4.estimatedMinutes, " min aprox. ");
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_button_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 64);
    \u0275\u0275listener("click", function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_button_48_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const evaluation_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openEvaluation(evaluation_r4));
    });
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon");
    \u0275\u0275text(4, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const evaluation_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getActionLabel(evaluation_r4.status));
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_ng_template_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 65)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const evaluation_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classProp("readonly-action--completed", evaluation_r4.status === "COMPLETADA");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evaluation_r4.status === "COMPLETADA" ? "verified" : "lock_outline");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", evaluation_r4.status === "COMPLETADA" ? "Respuestas registradas" : "No disponible para responder", " ");
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 50);
    \u0275\u0275element(1, "div", 51);
    \u0275\u0275elementStart(2, "div", 52)(3, "div", 53)(4, "div", 54)(5, "mat-icon");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div")(8, "span", 55);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "h3");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "span", 56)(13, "mat-icon");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 57)(17, "div", 58);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "small");
    \u0275\u0275text(21, "Persona a evaluar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "strong");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "div", 59)(27, "span")(28, "mat-icon");
    \u0275\u0275text(29, "calendar_today");
    \u0275\u0275elementEnd();
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span")(32, "mat-icon");
    \u0275\u0275text(33, "account_tree");
    \u0275\u0275elementEnd();
    \u0275\u0275text(34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span")(36, "mat-icon");
    \u0275\u0275text(37, "checklist");
    \u0275\u0275elementEnd();
    \u0275\u0275text(38);
    \u0275\u0275elementEnd();
    \u0275\u0275template(39, PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_span_39_Template, 4, 1, "span", 11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 60)(41, "div", 61)(42, "div")(43, "span");
    \u0275\u0275text(44, "Avance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "strong");
    \u0275\u0275text(46);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(47, "mat-progress-bar", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275template(48, PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_button_48_Template, 5, 1, "button", 63)(49, PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_ng_template_49_Template, 4, 4, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const evaluation_r4 = ctx.$implicit;
    const readonlyAction_r6 = \u0275\u0275reference(50);
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-completed", evaluation_r4.status === "COMPLETADA");
    \u0275\u0275advance();
    \u0275\u0275attribute("data-status", evaluation_r4.status);
    \u0275\u0275advance(3);
    \u0275\u0275attribute("data-status", evaluation_r4.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getStatusIcon(evaluation_r4.status));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(evaluation_r4.scenario);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evaluation_r4.name);
    \u0275\u0275advance();
    \u0275\u0275attribute("data-status", evaluation_r4.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getStatusIcon(evaluation_r4.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.getStatusLabel(evaluation_r4), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(evaluation_r4.evaluatedEmployee.charAt(0));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(evaluation_r4.evaluatedEmployee);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(evaluation_r4.evaluatedPosition);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.getEvaluationDateLabel(evaluation_r4), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", evaluation_r4.dimensions, " dimensiones ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", evaluation_r4.items, " \xEDtems ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", evaluation_r4.estimatedMinutes > 0);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("", evaluation_r4.progress, "%");
    \u0275\u0275advance();
    \u0275\u0275property("value", evaluation_r4.progress);
    \u0275\u0275attribute("data-status", evaluation_r4.status);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", evaluation_r4.status !== "COMPLETADA" && evaluation_r4.canRespond)("ngIfElse", readonlyAction_r6);
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275template(1, PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_article_1_Template, 51, 22, "article", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.filteredEvaluations)("ngForTrackBy", ctx_r1.trackByEvaluationId);
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_ng_template_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66)(1, "mat-icon");
    \u0275\u0275text(2, "assignment_turned_in");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.evaluations.length ? "No hay evaluaciones en esta vista" : "No tienes evaluaciones asignadas");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.evaluations.length ? "Cambia el filtro para consultar las dem\xE1s asignaciones." : "No se encontraron asignaciones para el empleado y modelo indicados.", " ");
  }
}
function PortalDesempenoEvaluacionesComponent_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 18)(2, "div", 19)(3, "div", 20);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 21)(6, "span", 22);
    \u0275\u0275text(7, "Evaluaciones asignadas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275template(12, PortalDesempenoEvaluacionesComponent_ng_container_12_ng_container_12_Template, 2, 1, "ng-container", 11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(13, "div", 23)(14, "div")(15, "mat-icon");
    \u0275\u0275text(16, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span")(18, "small");
    \u0275\u0275text(19, "Organizaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "strong");
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div")(23, "mat-icon");
    \u0275\u0275text(24, "mail_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "span")(26, "small");
    \u0275\u0275text(27, "Correo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "strong");
    \u0275\u0275text(29);
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275template(30, PortalDesempenoEvaluacionesComponent_ng_container_12_div_30_Template, 5, 1, "div", 24);
    \u0275\u0275elementStart(31, "section", 25)(32, "div", 26)(33, "span", 27);
    \u0275\u0275text(34, "Tu avance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "h2");
    \u0275\u0275text(36, "Estado de evaluaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "p");
    \u0275\u0275text(38, "Consulta tus asignaciones y contin\xFAa las evaluaciones que todav\xEDa requieren respuesta.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 28)(40, "div", 29)(41, "span");
    \u0275\u0275text(42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(43, "div")(44, "strong");
    \u0275\u0275text(45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "small");
    \u0275\u0275text(47, "evaluaciones completadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(48, "div", 30)(49, "div", 31)(50, "mat-icon");
    \u0275\u0275text(51, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "span")(53, "strong");
    \u0275\u0275text(54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "small");
    \u0275\u0275text(56, "Pendientes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(57, "div", 32)(58, "mat-icon");
    \u0275\u0275text(59, "edit_note");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "span")(61, "strong");
    \u0275\u0275text(62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "small");
    \u0275\u0275text(64, "En progreso");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(65, "div", 33)(66, "mat-icon");
    \u0275\u0275text(67, "task_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "span")(69, "strong");
    \u0275\u0275text(70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "small");
    \u0275\u0275text(72, "Completadas");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(73, "section", 34)(74, "div", 35)(75, "div")(76, "h2");
    \u0275\u0275text(77, "Mis evaluaciones");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "p");
    \u0275\u0275text(79);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(80, "div", 36)(81, "mat-button-toggle-group", 37);
    \u0275\u0275twoWayListener("ngModelChange", function PortalDesempenoEvaluacionesComponent_ng_container_12_Template_mat_button_toggle_group_ngModelChange_81_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.selectedFilter, $event) || (ctx_r1.selectedFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(82, "mat-button-toggle", 38);
    \u0275\u0275text(83, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "mat-button-toggle", 39);
    \u0275\u0275text(85, "Pendientes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "mat-button-toggle", 40);
    \u0275\u0275text(87, "Completadas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(88, "button", 41);
    \u0275\u0275listener("click", function PortalDesempenoEvaluacionesComponent_ng_container_12_Template_button_click_88_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.refreshEvaluations());
    });
    \u0275\u0275template(89, PortalDesempenoEvaluacionesComponent_ng_container_12_mat_spinner_89_Template, 1, 0, "mat-spinner", 42)(90, PortalDesempenoEvaluacionesComponent_ng_container_12_ng_template_90_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "span", 43);
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(94, PortalDesempenoEvaluacionesComponent_ng_container_12_div_94_Template, 2, 2, "div", 44)(95, PortalDesempenoEvaluacionesComponent_ng_container_12_ng_template_95_Template, 7, 2, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "div", 45)(98, "mat-icon");
    \u0275\u0275text(99, "shield");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "span");
    \u0275\u0275text(101, "Tu acceso es personal. Las respuestas se almacenan de forma segura y confidencial.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const currentEmployee_r7 = ctx.ngIf;
    const refreshIcon_r8 = \u0275\u0275reference(91);
    const emptyEvaluations_r9 = \u0275\u0275reference(96);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", currentEmployee_r7.initials, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(currentEmployee_r7.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", currentEmployee_r7.position, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.model == null ? null : ctx_r1.model.name);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(currentEmployee_r7.organization);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(currentEmployee_r7.email);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.loadError);
    \u0275\u0275advance(9);
    \u0275\u0275attribute("aria-label", ctx_r1.completionPercentage + "% completado");
    \u0275\u0275advance();
    \u0275\u0275styleProp("--progress", ctx_r1.completionPercentage);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r1.completionPercentage, "%");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r1.completedCount, " de ", ctx_r1.totalEvaluations, "");
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r1.pendingCount);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.inProgressCount);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.completedCount);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate1("", ctx_r1.getFilterCount(ctx_r1.selectedFilter), " asignaciones en esta vista");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.selectedFilter);
    \u0275\u0275advance(7);
    \u0275\u0275property("disabled", ctx_r1.isRefreshing)("matTooltip", ctx_r1.isRefreshing ? "Actualizando evaluaciones" : "Actualizar evaluaciones");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isRefreshing)("ngIfElse", refreshIcon_r8);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.isRefreshing ? "Actualizando evaluaciones" : "", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredEvaluations.length)("ngIfElse", emptyEvaluations_r9);
  }
}
var PortalDesempenoEvaluacionesComponent = class _PortalDesempenoEvaluacionesComponent {
  constructor(route, organizationService, document, renderer) {
    this.organizationService = organizationService;
    this.document = document;
    this.renderer = renderer;
    this.employee = null;
    this.model = null;
    this.summary = this.emptySummary();
    this.evaluations = [];
    this.selectedFilter = "TODAS";
    this.isLoading = true;
    this.isRefreshing = false;
    this.loadError = "";
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
    const encodedContext = route.snapshot.paramMap.get("contexto") ?? route.snapshot.queryParamMap.get("codigoEncuestaEmpleado") ?? route.snapshot.queryParamMap.get("contexto") ?? route.snapshot.queryParamMap.get("ref");
    this.context = this.decodeContext(encodedContext);
    this.accessCode = this.context ? this.encodeContext(this.context) : null;
    if (!encodedContext) {
      this.loadError = "El enlace no contiene el c\xF3digo del empleado y del modelo.";
    } else if (!this.context) {
      this.loadError = "El c\xF3digo incluido en el enlace no tiene un formato v\xE1lido.";
    }
  }
  ngOnInit() {
    this.forceLightTheme();
    this.loadEvaluationCenter();
  }
  ngOnDestroy() {
    this.dataRequest?.unsubscribe();
    this.document.body.className = this.originalBodyClassName;
  }
  get filteredEvaluations() {
    if (this.selectedFilter === "PENDIENTES") {
      return this.evaluations.filter((item) => item.status !== "COMPLETADA");
    }
    if (this.selectedFilter === "COMPLETADAS") {
      return this.evaluations.filter((item) => item.status === "COMPLETADA");
    }
    return this.evaluations;
  }
  get pendingCount() {
    return this.summary.pending;
  }
  get inProgressCount() {
    return this.summary.inProgress;
  }
  get completedCount() {
    return this.summary.completed;
  }
  get totalEvaluations() {
    return this.summary.total;
  }
  get completionPercentage() {
    return this.summary.completionPercentage;
  }
  getFilterCount(filter) {
    if (filter === "PENDIENTES") {
      return this.pendingCount + this.inProgressCount;
    }
    if (filter === "COMPLETADAS") {
      return this.completedCount;
    }
    return this.totalEvaluations;
  }
  getStatusLabel(evaluation) {
    if (evaluation.statusLabel) {
      return evaluation.statusLabel;
    }
    const labels = {
      PENDIENTE: "Pendiente",
      EN_PROGRESO: "En progreso",
      COMPLETADA: "Completada"
    };
    return labels[evaluation.status];
  }
  getStatusIcon(status) {
    const icons = {
      PENDIENTE: "schedule",
      EN_PROGRESO: "edit_note",
      COMPLETADA: "task_alt"
    };
    return icons[status];
  }
  getActionLabel(status) {
    return status === "EN_PROGRESO" ? "Continuar evaluaci\xF3n" : "Responder evaluaci\xF3n";
  }
  getEvaluationDateLabel(evaluation) {
    return evaluation.status === "COMPLETADA" ? "Evaluaci\xF3n completada" : evaluation.dueDate;
  }
  refreshEvaluations() {
    this.loadEvaluationCenter(true);
  }
  retryLoad() {
    this.loadEvaluationCenter();
  }
  openEvaluation(evaluation) {
    if (evaluation.status === "COMPLETADA" || !evaluation.canRespond || !this.context) {
      return;
    }
    const queryParams = new URLSearchParams({
      key: evaluation.accessKey,
      id_emp: String(this.context.empleadoId)
    });
    if (evaluation.accessToken) {
      queryParams.set("token", evaluation.accessToken);
    }
    const surveyUrl = `https://justlink360.net/#/completeclima/completedesempenoalone?${queryParams.toString()}`;
    window.open(surveyUrl, "_blank", "noopener,noreferrer");
  }
  trackByEvaluationId(_, evaluation) {
    return evaluation.id;
  }
  loadEvaluationCenter(refresh = false) {
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
    this.dataRequest?.unsubscribe();
    const request = this.organizationService.getDesempenoEvaluationCenter(this.accessCode).subscribe({
      next: (response) => {
        const data = response?.data ?? response;
        if (response?.ok === false || !data?.empleado || !data?.modelo) {
          this.handleLoadError(response?.message || "La respuesta del servidor no contiene datos v\xE1lidos.", refresh);
          return;
        }
        this.applyResponse(data);
      },
      error: (error) => {
        this.handleLoadError(error?.error?.message || error?.message || "No fue posible consultar las evaluaciones asignadas.", refresh);
      }
    });
    request.add(() => {
      this.isLoading = false;
      this.isRefreshing = false;
    });
    this.dataRequest = request;
  }
  applyResponse(data) {
    const employee = data.empleado ?? {};
    const model = data.modelo ?? {};
    const fullName = String(employee.nombreCompleto || [employee.nombres, employee.apellidos].filter(Boolean).join(" ") || "Empleado").trim();
    this.employee = {
      id: this.toPositiveInteger(employee.id),
      fullName,
      initials: this.getInitials(fullName),
      position: String(employee.cargo || "Cargo no especificado"),
      organizationId: this.toPositiveInteger(employee.organizacionId),
      organization: String(employee.organizacion || "Organizaci\xF3n no especificada"),
      email: String(employee.email || "Correo no especificado")
    };
    this.model = {
      id: this.toPositiveInteger(model.id),
      code: String(model.codigo || ""),
      name: String(model.nombre || "Modelo de evaluaci\xF3n"),
      version: this.toNonNegativeInteger(model.version)
    };
    this.evaluations = (Array.isArray(data.evaluaciones) ? data.evaluaciones : []).map((item) => this.mapEvaluation(item)).filter((item) => item !== null);
    const calculatedPending = this.evaluations.filter((item) => item.status === "PENDIENTE").length;
    const calculatedInProgress = this.evaluations.filter((item) => item.status === "EN_PROGRESO").length;
    const calculatedCompleted = this.evaluations.filter((item) => item.status === "COMPLETADA").length;
    const summary = data.resumen ?? {};
    const total = this.toNonNegativeInteger(summary.total, this.evaluations.length);
    this.summary = {
      total,
      pending: this.toNonNegativeInteger(summary.pendientes, calculatedPending),
      inProgress: this.toNonNegativeInteger(summary.enProgreso, calculatedInProgress),
      completed: this.toNonNegativeInteger(summary.completadas, calculatedCompleted),
      completionPercentage: this.clampPercentage(summary.porcentajeCompletado, total ? Math.round(calculatedCompleted / total * 100) : 0)
    };
    this.loadError = "";
  }
  mapEvaluation(value) {
    const assignmentId = this.toPositiveInteger(value?.asignacionId);
    const evaluatedEmployeeId = this.toPositiveInteger(value?.evaluado?.id);
    if (!assignmentId || !evaluatedEmployeeId) {
      return null;
    }
    const status = this.normalizeStatus(value?.estadoCodigo);
    return {
      id: assignmentId,
      evaluationId: this.toPositiveInteger(value?.evaluacionId),
      modelId: this.toPositiveInteger(value?.modeloId, this.model?.id ?? 0),
      name: String(value?.evaluacion || this.model?.name || "Evaluaci\xF3n de desempe\xF1o"),
      scenarioCode: String(value?.escenarioCodigo || ""),
      scenario: String(value?.escenario || "Escenario de evaluaci\xF3n"),
      evaluatedEmployeeId,
      evaluatedEmployee: String(value?.evaluado?.nombreCompleto || "Empleado"),
      evaluatedPosition: String(value?.evaluado?.cargo || "Cargo no especificado"),
      dueDate: this.formatDate(value?.fechaLimite),
      status,
      statusLabel: String(value?.estadoNombre || ""),
      progress: this.clampPercentage(value?.porcentajeAvance),
      dimensions: this.toNonNegativeInteger(value?.totalDimensiones),
      items: this.toNonNegativeInteger(value?.totalItems),
      answeredItems: this.toNonNegativeInteger(value?.totalItemsRespondidos),
      estimatedMinutes: this.toNonNegativeInteger(value?.duracionEstimadaMinutos),
      accessToken: String(value?.tokenAcceso || ""),
      accessKey: this.createSurveyAccessKey(evaluatedEmployeeId, assignmentId),
      canRespond: Boolean(value?.puedeResponder) && status !== "COMPLETADA"
    };
  }
  handleLoadError(message, retainCurrentData) {
    this.loadError = message;
    if (!retainCurrentData) {
      this.employee = null;
      this.model = null;
      this.evaluations = [];
      this.summary = this.emptySummary();
    }
  }
  decodeContext(encodedContext) {
    if (!encodedContext) {
      return null;
    }
    try {
      const decodedValue = decodeURIComponent(encodedContext);
      const normalizedValue = decodedValue.replace(/-/g, "+").replace(/_/g, "/");
      const paddedValue = normalizedValue.padEnd(normalizedValue.length + (4 - normalizedValue.length % 4) % 4, "=");
      const decodedText = atob(paddedValue);
      const [employeeValue, modelValue, ...extraValues] = decodedText.split("|");
      const employeeId = Number(employeeValue);
      const modelId = Number(modelValue);
      return extraValues.length === 0 && Number.isInteger(employeeId) && employeeId > 0 && Number.isInteger(modelId) && modelId > 0 ? { empleadoId: employeeId, modeloId: modelId } : null;
    } catch {
      return null;
    }
  }
  encodeContext(context) {
    return btoa(`${context.empleadoId}|${context.modeloId}`);
  }
  createSurveyAccessKey(evaluatedEmployeeId, referenceId) {
    return btoa(`${evaluatedEmployeeId}|${referenceId}`).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  normalizeStatus(value) {
    const status = String(value || "").trim().toUpperCase();
    if (status.includes("PROGRESO") || status.includes("PROGRESS")) {
      return "EN_PROGRESO";
    }
    if (status.includes("COMPLET") || status.includes("FINALIZ") || status.includes("RESPOND")) {
      return "COMPLETADA";
    }
    return "PENDIENTE";
  }
  formatDate(value) {
    if (!value) {
      return "Sin fecha l\xEDmite";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value);
    }
    return `Cierra el ${new Intl.DateTimeFormat("es-GT", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date)}`;
  }
  getInitials(fullName) {
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    return nameParts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "EM";
  }
  toPositiveInteger(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
  }
  toNonNegativeInteger(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : fallback;
  }
  clampPercentage(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? Math.min(100, Math.max(0, Math.round(parsedValue))) : fallback;
  }
  emptySummary() {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      completionPercentage: 0
    };
  }
  forceLightTheme() {
    this.originalBodyClassName = this.document.body.className;
    this.managedThemeClasses.forEach((className) => {
      this.renderer.removeClass(this.document.body, className);
    });
    this.renderer.addClass(this.document.body, "light");
    this.renderer.addClass(this.document.body, "theme-white");
    this.renderer.addClass(this.document.body, "portal-desempeno-light");
  }
  static {
    this.\u0275fac = function PortalDesempenoEvaluacionesComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PortalDesempenoEvaluacionesComponent)(\u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(OrganizacionService), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(Renderer2));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortalDesempenoEvaluacionesComponent, selectors: [["app-portal-desempeno-evaluaciones"]], decls: 13, vars: 3, consts: [["refreshIcon", ""], ["emptyEvaluations", ""], ["readonlyAction", ""], [1, "evaluation-portal"], ["role", "banner", 1, "portal-toolbar"], [1, "portal-toolbar__content"], ["src", "assets/images/Justlink-360.png", "alt", "Justlink-360", 1, "brand-logo"], [1, "portal-toolbar__label"], [1, "portal-content"], ["class", "portal-state", "aria-live", "polite", 4, "ngIf"], ["class", "portal-state portal-state--error", 4, "ngIf"], [4, "ngIf"], ["aria-live", "polite", 1, "portal-state"], ["diameter", "38", "strokeWidth", "4"], [1, "portal-state", "portal-state--error"], [1, "portal-state__icon"], ["mat-stroked-button", "", "type", "button", 3, "click", 4, "ngIf"], ["mat-stroked-button", "", "type", "button", 3, "click"], [1, "employee-header"], [1, "employee-identity"], ["aria-hidden", "true", 1, "employee-avatar"], [1, "employee-copy"], [1, "employee-eyebrow"], [1, "employee-meta"], ["class", "context-warning context-warning--error", 4, "ngIf"], [1, "portal-overview"], [1, "overview-copy"], [1, "section-eyebrow"], [1, "overview-progress"], [1, "progress-ring"], [1, "overview-stats"], [1, "overview-stat", "pending"], [1, "overview-stat", "in-progress"], [1, "overview-stat", "completed"], [1, "assignments-section"], [1, "assignments-header"], [1, "assignments-controls"], ["aria-label", "Filtrar evaluaciones", "hideSingleSelectionIndicator", "", 3, "ngModelChange", "ngModel"], ["value", "TODAS"], ["value", "PENDIENTES"], ["value", "COMPLETADAS"], ["mat-icon-button", "", "type", "button", "aria-label", "Actualizar evaluaciones", 1, "refresh-button", 3, "click", "disabled", "matTooltip"], ["diameter", "20", "strokeWidth", "3", 4, "ngIf", "ngIfElse"], ["aria-live", "polite", 1, "refresh-status"], ["class", "evaluation-list", 4, "ngIf", "ngIfElse"], [1, "privacy-footer"], [1, "context-warning", "context-warning--error"], ["diameter", "20", "strokeWidth", "3"], [1, "evaluation-list"], ["class", "evaluation-card", 3, "is-completed", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "evaluation-card"], [1, "evaluation-card__accent"], [1, "evaluation-card__main"], [1, "evaluation-card__heading"], [1, "scenario-icon"], [1, "scenario-label"], [1, "status-chip"], [1, "evaluatee-row"], [1, "evaluatee-avatar"], [1, "evaluation-meta"], [1, "evaluation-card__action"], [1, "card-progress"], ["mode", "determinate", 3, "value"], ["mat-raised-button", "", "color", "primary", "type", "button", 3, "click", 4, "ngIf", "ngIfElse"], ["mat-raised-button", "", "color", "primary", "type", "button", 3, "click"], [1, "readonly-action"], [1, "empty-state"]], template: function PortalDesempenoEvaluacionesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "main", 3)(1, "div", 4)(2, "div", 5);
        \u0275\u0275element(3, "img", 6);
        \u0275\u0275elementStart(4, "div", 7)(5, "mat-icon");
        \u0275\u0275text(6, "fact_check");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span");
        \u0275\u0275text(8, "Centro de evaluaciones");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(9, "div", 8);
        \u0275\u0275template(10, PortalDesempenoEvaluacionesComponent_section_10_Template, 6, 0, "section", 9)(11, PortalDesempenoEvaluacionesComponent_section_11_Template, 9, 2, "section", 10)(12, PortalDesempenoEvaluacionesComponent_ng_container_12_Template, 102, 25, "ng-container", 11);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(10);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && !ctx.employee);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.employee);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, NgControlStatus, NgModel, MatButtonModule, MatButton, MatIconButton, MatButtonToggleModule, MatButtonToggleGroup, MatButtonToggle, MatIconModule, MatIcon, MatProgressBarModule, MatProgressBar, MatProgressSpinnerModule, MatProgressSpinner, MatTooltipModule, MatTooltip], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.evaluation-portal[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  color: #203040;\n  background: #f4f6f8;\n}\n.portal-toolbar[_ngcontent-%COMP%] {\n  position: sticky;\n  z-index: 30;\n  top: 0;\n  height: 58px;\n  min-height: 58px;\n  max-height: 58px;\n  border-bottom: 1px solid #dde4e9;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(20, 38, 50, 0.05);\n}\n.portal-toolbar__content[_ngcontent-%COMP%] {\n  display: flex;\n  width: min(1160px, 100% - 32px);\n  height: 100%;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n.brand-logo[_ngcontent-%COMP%] {\n  display: block;\n  width: 132px;\n  height: 32px;\n  object-fit: contain;\n}\n.portal-toolbar__label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #405261;\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.portal-toolbar__label[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  color: #176477;\n  font-size: 20px;\n}\n.portal-content[_ngcontent-%COMP%] {\n  width: min(1160px, 100% - 32px);\n  margin: 0 auto;\n  padding: 22px 0 36px;\n}\n.portal-state[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 360px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  padding: 48px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  color: #6b7b87;\n  background: #fff;\n  text-align: center;\n}\n.portal-state[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 18px 0 5px;\n  color: #20313e;\n  font-size: 1.18rem;\n}\n.portal-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  max-width: 520px;\n  margin: 0;\n  font-size: 0.84rem;\n}\n.portal-state[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  margin-top: 20px;\n}\n.portal-state__icon[_ngcontent-%COMP%] {\n  display: grid;\n  width: 54px;\n  height: 54px;\n  place-items: center;\n  border-radius: 50%;\n  color: #a6543e;\n  background: #fbeeea;\n}\n.portal-state__icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n}\n.employee-header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 28px;\n  padding: 22px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 4px 18px rgba(24, 43, 55, 0.05);\n}\n.employee-identity[_ngcontent-%COMP%], \n.employee-meta[_ngcontent-%COMP%], \n.employee-meta[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.overview-progress[_ngcontent-%COMP%], \n.overview-stat[_ngcontent-%COMP%], \n.evaluation-card__heading[_ngcontent-%COMP%], \n.evaluatee-row[_ngcontent-%COMP%], \n.evaluation-meta[_ngcontent-%COMP%], \n.privacy-footer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.employee-identity[_ngcontent-%COMP%] {\n  min-width: 0;\n  gap: 16px;\n}\n.employee-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  flex: 0 0 68px;\n  width: 68px;\n  height: 68px;\n  place-items: center;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  color: #fff;\n  background: #176477;\n  font-size: 1.08rem;\n  font-weight: 800;\n  box-shadow: 0 0 0 1px #d6e0e6, 0 4px 12px rgba(20, 44, 57, 0.13);\n}\n.employee-copy[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.employee-eyebrow[_ngcontent-%COMP%], \n.section-eyebrow[_ngcontent-%COMP%], \n.scenario-label[_ngcontent-%COMP%] {\n  color: #176477;\n  font-size: 0.72rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.employee-copy[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 3px 0 2px;\n  overflow: hidden;\n  color: #172733;\n  font-size: 1.42rem;\n  font-weight: 750;\n  line-height: 1.3;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.employee-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #647481;\n  font-size: 0.9rem;\n}\n.employee-meta[_ngcontent-%COMP%] {\n  gap: 24px;\n}\n.employee-meta[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  min-width: 175px;\n  gap: 10px;\n}\n.employee-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  color: #738493;\n  font-size: 22px;\n}\n.employee-meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.employee-meta[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.employee-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n}\n.employee-meta[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-bottom: 2px;\n  color: #7b8995;\n  font-size: 0.7rem;\n}\n.employee-meta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  overflow: hidden;\n  max-width: 220px;\n  color: #344654;\n  font-size: 0.82rem;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.context-warning[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 12px;\n  padding: 10px 13px;\n  border-left: 3px solid #df8b28;\n  color: #704b1c;\n  background: #fff8ed;\n  font-size: 0.82rem;\n}\n.context-warning[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n}\n.context-warning--error[_ngcontent-%COMP%] {\n  border-left-color: #bd634a;\n  color: #743c2d;\n  background: #fff4f1;\n}\n.portal-overview[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(260px, 1fr) auto auto;\n  align-items: center;\n  gap: 30px;\n  margin-top: 16px;\n  padding: 20px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n}\n.overview-copy[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.assignments-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 3px 0 4px;\n  color: #172733;\n  font-size: 1.08rem;\n}\n.overview-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.assignments-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #70808d;\n  font-size: 0.82rem;\n}\n.overview-progress[_ngcontent-%COMP%] {\n  gap: 12px;\n  padding-right: 28px;\n  border-right: 1px solid #e1e7eb;\n}\n.progress-ring[_ngcontent-%COMP%] {\n  --progress: 0;\n  display: grid;\n  flex: 0 0 58px;\n  width: 58px;\n  height: 58px;\n  place-items: center;\n  border-radius: 50%;\n  background: conic-gradient(#176477 calc(var(--progress) * 1%), #e4eaee 0);\n}\n.progress-ring[_ngcontent-%COMP%]::before {\n  grid-area: 1/1;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: #fff;\n  content: "";\n}\n.progress-ring[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  z-index: 1;\n  grid-area: 1/1;\n  color: #174b59;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.overview-progress[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child   strong[_ngcontent-%COMP%], \n.overview-progress[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.overview-progress[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child   strong[_ngcontent-%COMP%] {\n  color: #293b48;\n  font-size: 0.95rem;\n}\n.overview-progress[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child   small[_ngcontent-%COMP%] {\n  margin-top: 2px;\n  color: #73818d;\n  font-size: 0.72rem;\n}\n.overview-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n}\n.overview-stat[_ngcontent-%COMP%] {\n  min-width: 104px;\n  gap: 8px;\n  padding: 10px 11px;\n  border: 1px solid #e0e6ea;\n  border-radius: 6px;\n  background: #fafbfc;\n}\n.overview-stat[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.overview-stat[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.overview-stat[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.overview-stat[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: block;\n}\n.overview-stat[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #263846;\n  font-size: 1rem;\n  line-height: 1;\n}\n.overview-stat[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 3px;\n  color: #74828e;\n  font-size: 0.68rem;\n}\n.overview-stat.pending[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #d47a1c;\n}\n.overview-stat.in-progress[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #3274b8;\n}\n.overview-stat.completed[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #27845b;\n}\n.assignments-section[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.assignments-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 18px;\n  margin-bottom: 12px;\n}\n.assignments-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-top: 0;\n  font-size: 1.18rem;\n}\n.assignments-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.assignments-header[_ngcontent-%COMP%]   .mat-button-toggle-group[_ngcontent-%COMP%] {\n  border-color: #d4dee5;\n  border-radius: 6px;\n  background: #fff;\n}\n.refresh-button[_ngcontent-%COMP%] {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border: 1px solid #d4dee5;\n  border-radius: 6px;\n  color: #176477;\n  background: #fff;\n}\n.refresh-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #9fb4c0;\n  background: #f3f8fa;\n}\n.refresh-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.refresh-button[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%] {\n  margin: auto;\n}\n.refresh-status[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n}\n.evaluation-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n.evaluation-card[_ngcontent-%COMP%] {\n  position: relative;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 230px;\n  min-width: 0;\n  overflow: hidden;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 12px rgba(23, 41, 53, 0.04);\n  transition: border-color 160ms ease, box-shadow 160ms ease;\n}\n.evaluation-card[_ngcontent-%COMP%]:hover {\n  border-color: #bdccd5;\n  box-shadow: 0 7px 20px rgba(23, 41, 53, 0.08);\n}\n.evaluation-card.is-completed[_ngcontent-%COMP%] {\n  background: #fbfcfc;\n}\n.evaluation-card__accent[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 4px;\n  background: #d47a1c;\n}\n.evaluation-card__accent[data-status=EN_PROGRESO][_ngcontent-%COMP%] {\n  background: #3274b8;\n}\n.evaluation-card__accent[data-status=COMPLETADA][_ngcontent-%COMP%] {\n  background: #27845b;\n}\n.evaluation-card__main[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 18px 20px 17px 24px;\n}\n.evaluation-card__heading[_ngcontent-%COMP%] {\n  position: relative;\n  min-width: 0;\n  align-items: flex-start;\n  gap: 12px;\n  padding-right: 118px;\n}\n.scenario-icon[_ngcontent-%COMP%] {\n  display: grid;\n  flex: 0 0 38px;\n  width: 38px;\n  height: 38px;\n  place-items: center;\n  border-radius: 7px;\n  color: #b96615;\n  background: #fff0df;\n}\n.scenario-icon[data-status=EN_PROGRESO][_ngcontent-%COMP%] {\n  color: #2868a7;\n  background: #e8f2fb;\n}\n.scenario-icon[data-status=COMPLETADA][_ngcontent-%COMP%] {\n  color: #237650;\n  background: #e4f4ec;\n}\n.scenario-icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.evaluation-card__heading[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:nth-child(2) {\n  min-width: 0;\n}\n.evaluation-card__heading[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 3px 0 0;\n  overflow: hidden;\n  color: #1d2d39;\n  font-size: 1rem;\n  font-weight: 750;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.status-chip[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 4px 8px;\n  border: 1px solid #f0c997;\n  border-radius: 999px;\n  color: #9a5916;\n  background: #fff8ed;\n  font-size: 0.7rem;\n  font-weight: 750;\n}\n.status-chip[data-status=EN_PROGRESO][_ngcontent-%COMP%] {\n  border-color: #bdd7ed;\n  color: #275f96;\n  background: #edf6fd;\n}\n.status-chip[data-status=COMPLETADA][_ngcontent-%COMP%] {\n  border-color: #b9dfce;\n  color: #216b49;\n  background: #edf8f3;\n}\n.status-chip[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.evaluatee-row[_ngcontent-%COMP%] {\n  gap: 10px;\n  margin-top: 16px;\n}\n.evaluatee-avatar[_ngcontent-%COMP%] {\n  display: grid;\n  flex: 0 0 34px;\n  width: 34px;\n  height: 34px;\n  place-items: center;\n  border-radius: 50%;\n  color: #fff;\n  background: #586f7f;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.evaluatee-row[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  min-width: 0;\n}\n.evaluatee-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.evaluatee-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.evaluatee-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n}\n.evaluatee-row[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  color: #7b8994;\n  font-size: 0.68rem;\n}\n.evaluatee-row[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  margin-top: 1px;\n  color: #30424f;\n  font-size: 0.82rem;\n}\n.evaluatee-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-top: 1px;\n  color: #74828d;\n  font-size: 0.72rem;\n}\n.evaluation-meta[_ngcontent-%COMP%] {\n  flex-wrap: wrap;\n  gap: 8px 18px;\n  margin-top: 14px;\n  color: #687984;\n  font-size: 0.72rem;\n}\n.evaluation-meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.evaluation-meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  color: #8996a0;\n  font-size: 16px;\n}\n.evaluation-card__action[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 16px;\n  padding: 18px;\n  border-left: 1px solid #e3e8ec;\n  background: #fafbfc;\n}\n.card-progress[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 7px;\n  color: #71808b;\n  font-size: 0.72rem;\n}\n.card-progress[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #30414e;\n}\n.card-progress[_ngcontent-%COMP%]   mat-progress-bar[_ngcontent-%COMP%] {\n  height: 6px;\n  border-radius: 999px;\n}\n.evaluation-card__action[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 42px;\n  justify-content: center;\n  letter-spacing: 0;\n}\n.evaluation-card__action[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  margin-left: 5px;\n  margin-right: 0;\n}\n.readonly-action[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 42px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 8px 10px;\n  border: 1px solid #d8e0e5;\n  border-radius: 5px;\n  color: #6b7a85;\n  background: #f7f9fa;\n  font-size: 0.75rem;\n  font-weight: 700;\n  text-align: center;\n}\n.readonly-action--completed[_ngcontent-%COMP%] {\n  border: 1px solid #c9ddd4;\n  color: #287251;\n  background: #f1f8f5;\n}\n.readonly-action[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  padding: 48px 24px;\n  border: 1px dashed #cbd7de;\n  border-radius: 8px;\n  color: #667784;\n  background: #fff;\n  text-align: center;\n}\n.empty-state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  color: #2f7f68;\n  font-size: 42px;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 10px 0 4px;\n  color: #2d3d49;\n  font-size: 1rem;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.82rem;\n}\n.privacy-footer[_ngcontent-%COMP%] {\n  justify-content: center;\n  gap: 7px;\n  margin-top: 22px;\n  color: #74828d;\n  font-size: 0.75rem;\n  text-align: center;\n}\n.privacy-footer[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n@media (max-width: 980px) {\n  .employee-header[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .employee-meta[_ngcontent-%COMP%] {\n    padding-top: 16px;\n    border-top: 1px solid #e5eaed;\n  }\n  .portal-overview[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .overview-stats[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .overview-stat[_ngcontent-%COMP%] {\n    flex: 1;\n  }\n}\n@media (max-width: 760px) {\n  .portal-content[_ngcontent-%COMP%], \n   .portal-toolbar__content[_ngcontent-%COMP%] {\n    width: min(100% - 24px, 1160px);\n  }\n  .employee-meta[_ngcontent-%COMP%] {\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 12px;\n  }\n  .employee-meta[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    min-width: 0;\n  }\n  .portal-overview[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 18px;\n  }\n  .overview-progress[_ngcontent-%COMP%] {\n    padding: 0;\n    border: 0;\n  }\n  .overview-stats[_ngcontent-%COMP%] {\n    grid-column: auto;\n  }\n  .assignments-header[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .assignments-header[_ngcontent-%COMP%]   .mat-button-toggle-group[_ngcontent-%COMP%] {\n    display: grid;\n    flex: 1;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .assignments-controls[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .evaluation-card[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .evaluation-card__action[_ngcontent-%COMP%] {\n    border-top: 1px solid #e3e8ec;\n    border-left: 0;\n  }\n}\n@media (max-width: 520px) {\n  .portal-toolbar__label[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .brand-logo[_ngcontent-%COMP%] {\n    width: 118px;\n  }\n  .portal-content[_ngcontent-%COMP%] {\n    padding-top: 12px;\n  }\n  .employee-header[_ngcontent-%COMP%], \n   .portal-overview[_ngcontent-%COMP%] {\n    padding: 18px;\n  }\n  .employee-avatar[_ngcontent-%COMP%] {\n    flex-basis: 56px;\n    width: 56px;\n    height: 56px;\n  }\n  .employee-copy[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 1.15rem;\n  }\n  .employee-copy[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 0.78rem;\n  }\n  .overview-stats[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .overview-stat[_ngcontent-%COMP%] {\n    min-width: 0;\n    align-items: flex-start;\n    flex-direction: column;\n  }\n  .assignments-header[_ngcontent-%COMP%]   .mat-button-toggle-group[_ngcontent-%COMP%] {\n    overflow-x: auto;\n  }\n  .evaluation-card__main[_ngcontent-%COMP%] {\n    padding: 17px 16px 16px 20px;\n  }\n  .evaluation-card__heading[_ngcontent-%COMP%] {\n    padding-right: 0;\n  }\n  .status-chip[_ngcontent-%COMP%] {\n    position: static;\n    flex: 0 0 auto;\n    margin-left: auto;\n  }\n  .scenario-icon[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .evaluation-card__heading[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    white-space: normal;\n  }\n  .privacy-footer[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=portal-desempeno-evaluaciones.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortalDesempenoEvaluacionesComponent, [{
    type: Component,
    args: [{ selector: "app-portal-desempeno-evaluaciones", standalone: true, imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatIconModule,
      MatProgressBarModule,
      MatProgressSpinnerModule,
      MatTooltipModule
    ], template: `<main class="evaluation-portal">
  <div class="portal-toolbar" role="banner">
    <div class="portal-toolbar__content">
      <img src="assets/images/Justlink-360.png" alt="Justlink-360" class="brand-logo" />
      <div class="portal-toolbar__label">
        <mat-icon>fact_check</mat-icon>
        <span>Centro de evaluaciones</span>
      </div>
    </div>
  </div>

  <div class="portal-content">
    <section class="portal-state" *ngIf="isLoading" aria-live="polite">
      <mat-spinner diameter="38" strokeWidth="4"></mat-spinner>
      <h1>Consultando tus evaluaciones</h1>
      <p>Estamos recuperando tus asignaciones y su avance.</p>
    </section>

    <section class="portal-state portal-state--error" *ngIf="!isLoading && !employee">
      <div class="portal-state__icon">
        <mat-icon>link_off</mat-icon>
      </div>
      <h1>No pudimos abrir el centro de evaluaciones</h1>
      <p>{{ loadError }}</p>
      <button mat-stroked-button type="button" *ngIf="accessCode" (click)="retryLoad()">
        <mat-icon>refresh</mat-icon>
        Intentar de nuevo
      </button>
    </section>

    <ng-container *ngIf="!isLoading && employee as currentEmployee">
      <section class="employee-header">
        <div class="employee-identity">
          <div class="employee-avatar" aria-hidden="true">
            {{ currentEmployee.initials }}
          </div>
          <div class="employee-copy">
            <span class="employee-eyebrow">Evaluaciones asignadas</span>
            <h1>{{ currentEmployee.fullName }}</h1>
            <p>
              {{ currentEmployee.position }}
              <ng-container *ngIf="model?.name"> \xB7 {{ model?.name }}</ng-container>
            </p>
          </div>
        </div>

        <div class="employee-meta">
          <div>
            <mat-icon>domain</mat-icon>
            <span>
              <small>Organizaci\xF3n</small>
              <strong>{{ currentEmployee.organization }}</strong>
            </span>
          </div>
          <div>
            <mat-icon>mail_outline</mat-icon>
            <span>
              <small>Correo</small>
              <strong>{{ currentEmployee.email }}</strong>
            </span>
          </div>
        </div>
      </section>

      <div class="context-warning context-warning--error" *ngIf="loadError">
        <mat-icon>error_outline</mat-icon>
        <span>{{ loadError }} Los datos mostrados corresponden a la \xFAltima consulta exitosa.</span>
      </div>

      <section class="portal-overview">
        <div class="overview-copy">
          <span class="section-eyebrow">Tu avance</span>
          <h2>Estado de evaluaciones</h2>
          <p>Consulta tus asignaciones y contin\xFAa las evaluaciones que todav\xEDa requieren respuesta.</p>
        </div>

        <div class="overview-progress" [attr.aria-label]="completionPercentage + '% completado'">
          <div class="progress-ring" [style.--progress]="completionPercentage">
            <span>{{ completionPercentage }}%</span>
          </div>
          <div>
            <strong>{{ completedCount }} de {{ totalEvaluations }}</strong>
            <small>evaluaciones completadas</small>
          </div>
        </div>

        <div class="overview-stats">
          <div class="overview-stat pending">
            <mat-icon>schedule</mat-icon>
            <span><strong>{{ pendingCount }}</strong><small>Pendientes</small></span>
          </div>
          <div class="overview-stat in-progress">
            <mat-icon>edit_note</mat-icon>
            <span><strong>{{ inProgressCount }}</strong><small>En progreso</small></span>
          </div>
          <div class="overview-stat completed">
            <mat-icon>task_alt</mat-icon>
            <span><strong>{{ completedCount }}</strong><small>Completadas</small></span>
          </div>
        </div>
      </section>

      <section class="assignments-section">
        <div class="assignments-header">
          <div>
            <h2>Mis evaluaciones</h2>
            <p>{{ getFilterCount(selectedFilter) }} asignaciones en esta vista</p>
          </div>

          <div class="assignments-controls">
            <mat-button-toggle-group
              [(ngModel)]="selectedFilter"
              aria-label="Filtrar evaluaciones"
              hideSingleSelectionIndicator>
              <mat-button-toggle value="TODAS">Todas</mat-button-toggle>
              <mat-button-toggle value="PENDIENTES">Pendientes</mat-button-toggle>
              <mat-button-toggle value="COMPLETADAS">Completadas</mat-button-toggle>
            </mat-button-toggle-group>

            <button
              mat-icon-button
              type="button"
              class="refresh-button"
              [disabled]="isRefreshing"
              [matTooltip]="isRefreshing ? 'Actualizando evaluaciones' : 'Actualizar evaluaciones'"
              aria-label="Actualizar evaluaciones"
              (click)="refreshEvaluations()">
              <mat-spinner *ngIf="isRefreshing; else refreshIcon" diameter="20" strokeWidth="3"></mat-spinner>
              <ng-template #refreshIcon>
                <mat-icon>refresh</mat-icon>
              </ng-template>
            </button>
            <span class="refresh-status" aria-live="polite">
              {{ isRefreshing ? 'Actualizando evaluaciones' : '' }}
            </span>
          </div>
        </div>

        <div class="evaluation-list" *ngIf="filteredEvaluations.length; else emptyEvaluations">
          <article
            class="evaluation-card"
            *ngFor="let evaluation of filteredEvaluations; trackBy: trackByEvaluationId"
            [class.is-completed]="evaluation.status === 'COMPLETADA'">
            <div class="evaluation-card__accent" [attr.data-status]="evaluation.status"></div>

            <div class="evaluation-card__main">
              <div class="evaluation-card__heading">
                <div class="scenario-icon" [attr.data-status]="evaluation.status">
                  <mat-icon>{{ getStatusIcon(evaluation.status) }}</mat-icon>
                </div>
                <div>
                  <span class="scenario-label">{{ evaluation.scenario }}</span>
                  <h3>{{ evaluation.name }}</h3>
                </div>
                <span class="status-chip" [attr.data-status]="evaluation.status">
                  <mat-icon>{{ getStatusIcon(evaluation.status) }}</mat-icon>
                  {{ getStatusLabel(evaluation) }}
                </span>
              </div>

              <div class="evaluatee-row">
                <div class="evaluatee-avatar">{{ evaluation.evaluatedEmployee.charAt(0) }}</div>
                <div>
                  <small>Persona a evaluar</small>
                  <strong>{{ evaluation.evaluatedEmployee }}</strong>
                  <span>{{ evaluation.evaluatedPosition }}</span>
                </div>
              </div>

              <div class="evaluation-meta">
                <span>
                  <mat-icon>calendar_today</mat-icon>
                  {{ getEvaluationDateLabel(evaluation) }}
                </span>
                <span>
                  <mat-icon>account_tree</mat-icon>
                  {{ evaluation.dimensions }} dimensiones
                </span>
                <span>
                  <mat-icon>checklist</mat-icon>
                  {{ evaluation.items }} \xEDtems
                </span>
                <span *ngIf="evaluation.estimatedMinutes > 0">
                  <mat-icon>timer</mat-icon>
                  {{ evaluation.estimatedMinutes }} min aprox.
                </span>
              </div>
            </div>

            <div class="evaluation-card__action">
              <div class="card-progress">
                <div>
                  <span>Avance</span>
                  <strong>{{ evaluation.progress }}%</strong>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="evaluation.progress"
                  [attr.data-status]="evaluation.status">
                </mat-progress-bar>
              </div>

              <button
                mat-raised-button
                color="primary"
                type="button"
                *ngIf="evaluation.status !== 'COMPLETADA' && evaluation.canRespond; else readonlyAction"
                (click)="openEvaluation(evaluation)">
                <span>{{ getActionLabel(evaluation.status) }}</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>

              <ng-template #readonlyAction>
                <div
                  class="readonly-action"
                  [class.readonly-action--completed]="evaluation.status === 'COMPLETADA'">
                  <mat-icon>{{ evaluation.status === 'COMPLETADA' ? 'verified' : 'lock_outline' }}</mat-icon>
                  {{ evaluation.status === 'COMPLETADA' ? 'Respuestas registradas' : 'No disponible para responder' }}
                </div>
              </ng-template>
            </div>
          </article>
        </div>

        <ng-template #emptyEvaluations>
          <div class="empty-state">
            <mat-icon>assignment_turned_in</mat-icon>
            <h3>{{ evaluations.length ? 'No hay evaluaciones en esta vista' : 'No tienes evaluaciones asignadas' }}</h3>
            <p>
              {{ evaluations.length
                ? 'Cambia el filtro para consultar las dem\xE1s asignaciones.'
                : 'No se encontraron asignaciones para el empleado y modelo indicados.' }}
            </p>
          </div>
        </ng-template>
      </section>

      <div class="privacy-footer">
        <mat-icon>shield</mat-icon>
        <span>Tu acceso es personal. Las respuestas se almacenan de forma segura y confidencial.</span>
      </div>
    </ng-container>
  </div>
</main>
`, styles: ['/* src/app/portal-desempeno-evaluaciones/portal-desempeno-evaluaciones.component.scss */\n:host {\n  display: block;\n  min-height: 100vh;\n  color-scheme: light;\n}\n* {\n  box-sizing: border-box;\n}\n.evaluation-portal {\n  min-height: 100vh;\n  color: #203040;\n  background: #f4f6f8;\n}\n.portal-toolbar {\n  position: sticky;\n  z-index: 30;\n  top: 0;\n  height: 58px;\n  min-height: 58px;\n  max-height: 58px;\n  border-bottom: 1px solid #dde4e9;\n  background: #fff;\n  box-shadow: 0 2px 10px rgba(20, 38, 50, 0.05);\n}\n.portal-toolbar__content {\n  display: flex;\n  width: min(1160px, 100% - 32px);\n  height: 100%;\n  align-items: center;\n  justify-content: space-between;\n  margin: 0 auto;\n}\n.brand-logo {\n  display: block;\n  width: 132px;\n  height: 32px;\n  object-fit: contain;\n}\n.portal-toolbar__label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  color: #405261;\n  font-size: 0.82rem;\n  font-weight: 700;\n}\n.portal-toolbar__label mat-icon {\n  width: 20px;\n  height: 20px;\n  color: #176477;\n  font-size: 20px;\n}\n.portal-content {\n  width: min(1160px, 100% - 32px);\n  margin: 0 auto;\n  padding: 22px 0 36px;\n}\n.portal-state {\n  display: flex;\n  min-height: 360px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  padding: 48px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  color: #6b7b87;\n  background: #fff;\n  text-align: center;\n}\n.portal-state h1 {\n  margin: 18px 0 5px;\n  color: #20313e;\n  font-size: 1.18rem;\n}\n.portal-state p {\n  max-width: 520px;\n  margin: 0;\n  font-size: 0.84rem;\n}\n.portal-state button {\n  margin-top: 20px;\n}\n.portal-state__icon {\n  display: grid;\n  width: 54px;\n  height: 54px;\n  place-items: center;\n  border-radius: 50%;\n  color: #a6543e;\n  background: #fbeeea;\n}\n.portal-state__icon mat-icon {\n  width: 28px;\n  height: 28px;\n  font-size: 28px;\n}\n.employee-header {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  align-items: center;\n  gap: 28px;\n  padding: 22px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 4px 18px rgba(24, 43, 55, 0.05);\n}\n.employee-identity,\n.employee-meta,\n.employee-meta > div,\n.overview-progress,\n.overview-stat,\n.evaluation-card__heading,\n.evaluatee-row,\n.evaluation-meta,\n.privacy-footer {\n  display: flex;\n  align-items: center;\n}\n.employee-identity {\n  min-width: 0;\n  gap: 16px;\n}\n.employee-avatar {\n  position: relative;\n  display: grid;\n  flex: 0 0 68px;\n  width: 68px;\n  height: 68px;\n  place-items: center;\n  border: 3px solid #fff;\n  border-radius: 50%;\n  color: #fff;\n  background: #176477;\n  font-size: 1.08rem;\n  font-weight: 800;\n  box-shadow: 0 0 0 1px #d6e0e6, 0 4px 12px rgba(20, 44, 57, 0.13);\n}\n.employee-copy {\n  min-width: 0;\n}\n.employee-eyebrow,\n.section-eyebrow,\n.scenario-label {\n  color: #176477;\n  font-size: 0.72rem;\n  font-weight: 800;\n  text-transform: uppercase;\n}\n.employee-copy h1 {\n  margin: 3px 0 2px;\n  overflow: hidden;\n  color: #172733;\n  font-size: 1.42rem;\n  font-weight: 750;\n  line-height: 1.3;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.employee-copy p {\n  margin: 0;\n  color: #647481;\n  font-size: 0.9rem;\n}\n.employee-meta {\n  gap: 24px;\n}\n.employee-meta > div {\n  min-width: 175px;\n  gap: 10px;\n}\n.employee-meta mat-icon {\n  width: 22px;\n  height: 22px;\n  color: #738493;\n  font-size: 22px;\n}\n.employee-meta span,\n.employee-meta small,\n.employee-meta strong {\n  display: block;\n}\n.employee-meta small {\n  margin-bottom: 2px;\n  color: #7b8995;\n  font-size: 0.7rem;\n}\n.employee-meta strong {\n  overflow: hidden;\n  max-width: 220px;\n  color: #344654;\n  font-size: 0.82rem;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.context-warning {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin-top: 12px;\n  padding: 10px 13px;\n  border-left: 3px solid #df8b28;\n  color: #704b1c;\n  background: #fff8ed;\n  font-size: 0.82rem;\n}\n.context-warning mat-icon {\n  flex: 0 0 auto;\n}\n.context-warning--error {\n  border-left-color: #bd634a;\n  color: #743c2d;\n  background: #fff4f1;\n}\n.portal-overview {\n  display: grid;\n  grid-template-columns: minmax(260px, 1fr) auto auto;\n  align-items: center;\n  gap: 30px;\n  margin-top: 16px;\n  padding: 20px 24px;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n}\n.overview-copy h2,\n.assignments-header h2 {\n  margin: 3px 0 4px;\n  color: #172733;\n  font-size: 1.08rem;\n}\n.overview-copy p,\n.assignments-header p {\n  margin: 0;\n  color: #70808d;\n  font-size: 0.82rem;\n}\n.overview-progress {\n  gap: 12px;\n  padding-right: 28px;\n  border-right: 1px solid #e1e7eb;\n}\n.progress-ring {\n  --progress: 0;\n  display: grid;\n  flex: 0 0 58px;\n  width: 58px;\n  height: 58px;\n  place-items: center;\n  border-radius: 50%;\n  background: conic-gradient(#176477 calc(var(--progress) * 1%), #e4eaee 0);\n}\n.progress-ring::before {\n  grid-area: 1/1;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: #fff;\n  content: "";\n}\n.progress-ring span {\n  z-index: 1;\n  grid-area: 1/1;\n  color: #174b59;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.overview-progress > div:last-child strong,\n.overview-progress > div:last-child small {\n  display: block;\n}\n.overview-progress > div:last-child strong {\n  color: #293b48;\n  font-size: 0.95rem;\n}\n.overview-progress > div:last-child small {\n  margin-top: 2px;\n  color: #73818d;\n  font-size: 0.72rem;\n}\n.overview-stats {\n  display: flex;\n  gap: 10px;\n}\n.overview-stat {\n  min-width: 104px;\n  gap: 8px;\n  padding: 10px 11px;\n  border: 1px solid #e0e6ea;\n  border-radius: 6px;\n  background: #fafbfc;\n}\n.overview-stat mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.overview-stat span,\n.overview-stat strong,\n.overview-stat small {\n  display: block;\n}\n.overview-stat strong {\n  color: #263846;\n  font-size: 1rem;\n  line-height: 1;\n}\n.overview-stat small {\n  margin-top: 3px;\n  color: #74828e;\n  font-size: 0.68rem;\n}\n.overview-stat.pending mat-icon {\n  color: #d47a1c;\n}\n.overview-stat.in-progress mat-icon {\n  color: #3274b8;\n}\n.overview-stat.completed mat-icon {\n  color: #27845b;\n}\n.assignments-section {\n  margin-top: 24px;\n}\n.assignments-header {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 18px;\n  margin-bottom: 12px;\n}\n.assignments-header h2 {\n  margin-top: 0;\n  font-size: 1.18rem;\n}\n.assignments-controls {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.assignments-header .mat-button-toggle-group {\n  border-color: #d4dee5;\n  border-radius: 6px;\n  background: #fff;\n}\n.refresh-button {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border: 1px solid #d4dee5;\n  border-radius: 6px;\n  color: #176477;\n  background: #fff;\n}\n.refresh-button:hover:not(:disabled) {\n  border-color: #9fb4c0;\n  background: #f3f8fa;\n}\n.refresh-button mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.refresh-button mat-spinner {\n  margin: auto;\n}\n.refresh-status {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n}\n.evaluation-list {\n  display: grid;\n  gap: 10px;\n}\n.evaluation-card {\n  position: relative;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 230px;\n  min-width: 0;\n  overflow: hidden;\n  border: 1px solid #dce4e9;\n  border-radius: 8px;\n  background: #fff;\n  box-shadow: 0 3px 12px rgba(23, 41, 53, 0.04);\n  transition: border-color 160ms ease, box-shadow 160ms ease;\n}\n.evaluation-card:hover {\n  border-color: #bdccd5;\n  box-shadow: 0 7px 20px rgba(23, 41, 53, 0.08);\n}\n.evaluation-card.is-completed {\n  background: #fbfcfc;\n}\n.evaluation-card__accent {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 4px;\n  background: #d47a1c;\n}\n.evaluation-card__accent[data-status=EN_PROGRESO] {\n  background: #3274b8;\n}\n.evaluation-card__accent[data-status=COMPLETADA] {\n  background: #27845b;\n}\n.evaluation-card__main {\n  min-width: 0;\n  padding: 18px 20px 17px 24px;\n}\n.evaluation-card__heading {\n  position: relative;\n  min-width: 0;\n  align-items: flex-start;\n  gap: 12px;\n  padding-right: 118px;\n}\n.scenario-icon {\n  display: grid;\n  flex: 0 0 38px;\n  width: 38px;\n  height: 38px;\n  place-items: center;\n  border-radius: 7px;\n  color: #b96615;\n  background: #fff0df;\n}\n.scenario-icon[data-status=EN_PROGRESO] {\n  color: #2868a7;\n  background: #e8f2fb;\n}\n.scenario-icon[data-status=COMPLETADA] {\n  color: #237650;\n  background: #e4f4ec;\n}\n.scenario-icon mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.evaluation-card__heading > div:nth-child(2) {\n  min-width: 0;\n}\n.evaluation-card__heading h3 {\n  margin: 3px 0 0;\n  overflow: hidden;\n  color: #1d2d39;\n  font-size: 1rem;\n  font-weight: 750;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.status-chip {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  padding: 4px 8px;\n  border: 1px solid #f0c997;\n  border-radius: 999px;\n  color: #9a5916;\n  background: #fff8ed;\n  font-size: 0.7rem;\n  font-weight: 750;\n}\n.status-chip[data-status=EN_PROGRESO] {\n  border-color: #bdd7ed;\n  color: #275f96;\n  background: #edf6fd;\n}\n.status-chip[data-status=COMPLETADA] {\n  border-color: #b9dfce;\n  color: #216b49;\n  background: #edf8f3;\n}\n.status-chip mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.evaluatee-row {\n  gap: 10px;\n  margin-top: 16px;\n}\n.evaluatee-avatar {\n  display: grid;\n  flex: 0 0 34px;\n  width: 34px;\n  height: 34px;\n  place-items: center;\n  border-radius: 50%;\n  color: #fff;\n  background: #586f7f;\n  font-size: 0.78rem;\n  font-weight: 800;\n}\n.evaluatee-row > div:last-child {\n  min-width: 0;\n}\n.evaluatee-row small,\n.evaluatee-row strong,\n.evaluatee-row span {\n  display: block;\n}\n.evaluatee-row small {\n  color: #7b8994;\n  font-size: 0.68rem;\n}\n.evaluatee-row strong {\n  margin-top: 1px;\n  color: #30424f;\n  font-size: 0.82rem;\n}\n.evaluatee-row span {\n  margin-top: 1px;\n  color: #74828d;\n  font-size: 0.72rem;\n}\n.evaluation-meta {\n  flex-wrap: wrap;\n  gap: 8px 18px;\n  margin-top: 14px;\n  color: #687984;\n  font-size: 0.72rem;\n}\n.evaluation-meta span {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.evaluation-meta mat-icon {\n  width: 16px;\n  height: 16px;\n  color: #8996a0;\n  font-size: 16px;\n}\n.evaluation-card__action {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  gap: 16px;\n  padding: 18px;\n  border-left: 1px solid #e3e8ec;\n  background: #fafbfc;\n}\n.card-progress > div {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 7px;\n  color: #71808b;\n  font-size: 0.72rem;\n}\n.card-progress strong {\n  color: #30414e;\n}\n.card-progress mat-progress-bar {\n  height: 6px;\n  border-radius: 999px;\n}\n.evaluation-card__action button {\n  width: 100%;\n  min-height: 42px;\n  justify-content: center;\n  letter-spacing: 0;\n}\n.evaluation-card__action button mat-icon {\n  margin-left: 5px;\n  margin-right: 0;\n}\n.readonly-action {\n  display: flex;\n  min-height: 42px;\n  align-items: center;\n  justify-content: center;\n  gap: 7px;\n  padding: 8px 10px;\n  border: 1px solid #d8e0e5;\n  border-radius: 5px;\n  color: #6b7a85;\n  background: #f7f9fa;\n  font-size: 0.75rem;\n  font-weight: 700;\n  text-align: center;\n}\n.readonly-action--completed {\n  border: 1px solid #c9ddd4;\n  color: #287251;\n  background: #f1f8f5;\n}\n.readonly-action mat-icon {\n  flex: 0 0 18px;\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.empty-state {\n  padding: 48px 24px;\n  border: 1px dashed #cbd7de;\n  border-radius: 8px;\n  color: #667784;\n  background: #fff;\n  text-align: center;\n}\n.empty-state mat-icon {\n  width: 42px;\n  height: 42px;\n  color: #2f7f68;\n  font-size: 42px;\n}\n.empty-state h3 {\n  margin: 10px 0 4px;\n  color: #2d3d49;\n  font-size: 1rem;\n}\n.empty-state p {\n  margin: 0;\n  font-size: 0.82rem;\n}\n.privacy-footer {\n  justify-content: center;\n  gap: 7px;\n  margin-top: 22px;\n  color: #74828d;\n  font-size: 0.75rem;\n  text-align: center;\n}\n.privacy-footer mat-icon {\n  width: 17px;\n  height: 17px;\n  font-size: 17px;\n}\n@media (max-width: 980px) {\n  .employee-header {\n    grid-template-columns: 1fr;\n  }\n  .employee-meta {\n    padding-top: 16px;\n    border-top: 1px solid #e5eaed;\n  }\n  .portal-overview {\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n  .overview-stats {\n    grid-column: 1/-1;\n  }\n  .overview-stat {\n    flex: 1;\n  }\n}\n@media (max-width: 760px) {\n  .portal-content,\n  .portal-toolbar__content {\n    width: min(100% - 24px, 1160px);\n  }\n  .employee-meta {\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 12px;\n  }\n  .employee-meta > div {\n    min-width: 0;\n  }\n  .portal-overview {\n    grid-template-columns: 1fr;\n    gap: 18px;\n  }\n  .overview-progress {\n    padding: 0;\n    border: 0;\n  }\n  .overview-stats {\n    grid-column: auto;\n  }\n  .assignments-header {\n    align-items: stretch;\n    flex-direction: column;\n  }\n  .assignments-header .mat-button-toggle-group {\n    display: grid;\n    flex: 1;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .assignments-controls {\n    width: 100%;\n  }\n  .evaluation-card {\n    grid-template-columns: 1fr;\n  }\n  .evaluation-card__action {\n    border-top: 1px solid #e3e8ec;\n    border-left: 0;\n  }\n}\n@media (max-width: 520px) {\n  .portal-toolbar__label span {\n    display: none;\n  }\n  .brand-logo {\n    width: 118px;\n  }\n  .portal-content {\n    padding-top: 12px;\n  }\n  .employee-header,\n  .portal-overview {\n    padding: 18px;\n  }\n  .employee-avatar {\n    flex-basis: 56px;\n    width: 56px;\n    height: 56px;\n  }\n  .employee-copy h1 {\n    font-size: 1.15rem;\n  }\n  .employee-copy p {\n    font-size: 0.78rem;\n  }\n  .overview-stats {\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n  .overview-stat {\n    min-width: 0;\n    align-items: flex-start;\n    flex-direction: column;\n  }\n  .assignments-header .mat-button-toggle-group {\n    overflow-x: auto;\n  }\n  .evaluation-card__main {\n    padding: 17px 16px 16px 20px;\n  }\n  .evaluation-card__heading {\n    padding-right: 0;\n  }\n  .status-chip {\n    position: static;\n    flex: 0 0 auto;\n    margin-left: auto;\n  }\n  .scenario-icon {\n    display: none;\n  }\n  .evaluation-card__heading h3 {\n    white-space: normal;\n  }\n  .privacy-footer {\n    align-items: flex-start;\n  }\n}\n/*# sourceMappingURL=portal-desempeno-evaluaciones.component.css.map */\n'] }]
  }], () => [{ type: ActivatedRoute }, { type: OrganizacionService }, { type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }, { type: Renderer2 }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortalDesempenoEvaluacionesComponent, { className: "PortalDesempenoEvaluacionesComponent", filePath: "src/app/portal-desempeno-evaluaciones/portal-desempeno-evaluaciones.component.ts", lineNumber: 86 });
})();

// src/app/portal-desempeno-evaluaciones/portal-desempeno-evaluaciones.routes.ts
var PORTAL_DESEMPENO_EVALUACIONES_ROUTE = [
  {
    path: "",
    component: PortalDesempenoEvaluacionesComponent
  },
  {
    path: ":contexto",
    component: PortalDesempenoEvaluacionesComponent
  }
];
export {
  PORTAL_DESEMPENO_EVALUACIONES_ROUTE
};
//# sourceMappingURL=portal-desempeno-evaluaciones.routes-GZU7K7HY.js.map
