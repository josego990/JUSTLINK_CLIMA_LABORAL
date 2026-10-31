import {
  TurnstileComponent
} from "./chunk-HYUO6MWQ.js";
import {
  ConfigService
} from "./chunk-7W2J6P5T.js";
import {
  DynamicFormComponent
} from "./chunk-VWN6FOJ7.js";
import "./chunk-R26NSZYP.js";
import "./chunk-4BZTFYMB.js";
import "./chunk-YXKJBH3A.js";
import "./chunk-LHQOYH62.js";
import "./chunk-6F5SWNYE.js";
import {
  require_sweetalert2_all
} from "./chunk-IOETN73U.js";
import {
  AuthService,
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
import "./chunk-GYT2RHCJ.js";
import "./chunk-FO3S3GOD.js";
import "./chunk-DD5M7VBH.js";
import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger
} from "./chunk-HTLD25D4.js";
import "./chunk-5ZIRF7RR.js";
import "./chunk-JURKDGMK.js";
import "./chunk-QV4DNMNF.js";
import "./chunk-RTX2H4T5.js";
import "./chunk-TWFG2YEX.js";
import "./chunk-AMSP6ESA.js";
import "./chunk-4H7Z4NNN.js";
import "./chunk-H3UX3NVF.js";
import "./chunk-4AQ2Q7XZ.js";
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
import "./chunk-DKBY3V4W.js";
import {
  UntypedFormBuilder
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButtonModule,
  MatIconButton
} from "./chunk-6OUKOU55.js";
import {
  ActivatedRoute,
  CommonModule,
  NgClass,
  NgIf
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import {
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-IIGRIO22.js";

// src/app/completeclimaalone/completeclimaalone.component.ts
var import_sweetalert2 = __toESM(require_sweetalert2_all());
var _c0 = (a0) => ({ "active": a0 });
function CompleteclimaaloneComponent_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 14);
    \u0275\u0275listener("click", function CompleteclimaaloneComponent_For_13_Template_button_click_0_listener() {
      const item_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.setLanguage(item_r2.text, item_r2.lang, item_r2.flag));
    });
    \u0275\u0275element(1, "img", 15);
    \u0275\u0275elementStart(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(4, _c0, ctx_r2.langStoreValue === item_r2.lang));
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("alt", item_r2.text);
    \u0275\u0275property("src", item_r2.flag, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r2.text);
  }
}
function CompleteclimaaloneComponent_section_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 17)(1, "div", 18);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h1", 19);
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 20)(9, "mat-icon", 21);
    \u0275\u0275text(10, "domain");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "ul", 22)(16, "li")(17, "mat-icon", 21);
    \u0275\u0275text(18, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "li")(22, "mat-icon", 21);
    \u0275\u0275text(23, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "li")(27, "mat-icon", 21);
    \u0275\u0275text(28, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "li")(32, "mat-icon", 21);
    \u0275\u0275text(33, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "translate");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 10, "MENUITEMS.ALONE.SURVEY"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", \u0275\u0275pipeBind1(6, 12, "MENUITEMS.ALONE.HELLO"), ", ", \u0275\u0275pipeBind1(7, 14, "MENUITEMS.ALONE.TO"), " ", ctx_r2.nombreClima, ". ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r2.nombreOrganizacion);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(14, 16, "MENUITEMS.ALONE.GREETEENGS"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 18, "MENUITEMS.ALONE.CONDITION1"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 20, "MENUITEMS.ALONE.CONDITION2"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(30, 22, "MENUITEMS.ALONE.CONDITION3"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 24, "MENUITEMS.ALONE.CONDITION4"));
  }
}
function CompleteclimaaloneComponent_section_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 17)(1, "div", 18);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ul", 22)(5, "li")(6, "mat-icon", 21);
    \u0275\u0275text(7, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "li")(12, "mat-icon", 21);
    \u0275\u0275text(13, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "li")(18, "mat-icon", 21);
    \u0275\u0275text(19, "check_circle");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span");
    \u0275\u0275text(21);
    \u0275\u0275pipe(22, "translate");
    \u0275\u0275elementStart(23, "strong", 23);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "translate");
    \u0275\u0275elementStart(28, "strong", 23);
    \u0275\u0275text(29);
    \u0275\u0275pipe(30, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(3, 8, "MENUITEMS.ALONE.GREETEENGS_APDE"), " ");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(10, 10, "MENUITEMS.ALONE.CONDITION1_APDE"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(16, 12, "MENUITEMS.ALONE.CONDITION2_APDE"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(22, 14, "MENUITEMS.ALONE.CONDITION3_APDE_1"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(25, 16, "MENUITEMS.ALONE.CONDITION3_APDE_2"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(27, 18, "MENUITEMS.ALONE.CONDITION3_APDE_3"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(30, 20, "MENUITEMS.ALONE.CONDITION3_APDE_4"), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(32, 22, "MENUITEMS.ALONE.CONDITION3_APDE_5"), " ");
  }
}
function CompleteclimaaloneComponent_ng_container_16_app_dynamic_form_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-dynamic-form", 25);
    \u0275\u0275listener("turnstileResetRequested", function CompleteclimaaloneComponent_ng_container_16_app_dynamic_form_2_Template_app_dynamic_form_turnstileResetRequested_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.resetTurnstile());
    });
    \u0275\u0275elementStart(1, "app-turnstile", 26);
    \u0275\u0275listener("tokenChange", function CompleteclimaaloneComponent_ng_container_16_app_dynamic_form_2_Template_app_turnstile_tokenChange_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.onTurnstileTokenChange($event));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formConfig", ctx_r2.formConfig)("idEmpleado", ctx_r2.idEmpleado)("idEncuestaEmpleado", ctx_r2.idEncuestaEmpleado)("lang", ctx_r2.langStoreValue)("requireTurnstile", true)("turnstileToken", ctx_r2.turnstileToken);
    \u0275\u0275advance();
    \u0275\u0275property("language", ctx_r2.langStoreValue || "es");
  }
}
function CompleteclimaaloneComponent_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div");
    \u0275\u0275template(2, CompleteclimaaloneComponent_ng_container_16_app_dynamic_form_2_Template, 2, 7, "app-dynamic-form", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r2.formConfig == null ? null : ctx_r2.formConfig.fields == null ? null : ctx_r2.formConfig.fields.length);
  }
}
function CompleteclimaaloneComponent_ng_template_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "mat-progress-spinner", 28);
    \u0275\u0275elementEnd();
  }
}
var CompleteclimaaloneComponent = class _CompleteclimaaloneComponent {
  constructor(fb, route, organizacionService, configService, authService, languageService, translate) {
    this.fb = fb;
    this.route = route;
    this.organizacionService = organizacionService;
    this.configService = configService;
    this.authService = authService;
    this.languageService = languageService;
    this.translate = translate;
    this.countryName = [];
    this.idEmpleado = 0;
    this.idFlujo = 0;
    this.idEncuestaEmpleado = 0;
    this.nombreEmpleado = "";
    this.nombreClima = "";
    this.nombreOrganizacion = "";
    this.isLoadingForm = true;
    this.turnstileToken = "";
    this.formConfig = {
      id: 0,
      idOrganization: 0,
      contestadas: 1,
      totalEncuestas: 1,
      pendientes: 1,
      totalEmpleados: 1,
      avatarSrc: "string",
      title: "string",
      subtitle: "string",
      imageSrc1: "string",
      content: "string",
      score: 0,
      completed: false,
      startDate: " ",
      endDate: " ",
      tipoEvaluacion: "string",
      estado: 1,
      estadoEnvio: " ",
      granFactores: [],
      series: [],
      fields: [],
      estadisticasEnvio: {
        total: 0,
        total_creadas: 0,
        total_enviadas: 0,
        total_iniciadas: 0,
        total_contestadas: 0,
        total_error: 0,
        total_empleados_activos: 0,
        porcentaje: 0
      }
    };
    this.title_card = "";
    this.quiz = {};
    this.listLang = [
      { text: "English", flag: "assets/images/flags/us.jpg", lang: "en" },
      { text: "Spanish", flag: "assets/images/flags/spain.jpg", lang: "es" }
    ];
  }
  ngOnInit() {
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);
    this.languageService.getLanguageChangeSubject().subscribe((lang) => {
      this.translate.use(lang);
    });
    this.countryName = "Spanish";
    this.flagvalue = "assets/images/flags/spain.jpg";
    this.langStoreValue = "es";
    this.languageService.setLanguage("es");
    const codigo = this.route.snapshot.queryParamMap.get("key");
    if (codigo) {
      const decode_key = atob(codigo);
      const empleadoFlujo = decode_key.split("|");
      this.idEmpleado = +empleadoFlujo[0];
      this.idFlujo = +empleadoFlujo[1];
      this.organizacionService.getEmpleadoInfo(this.idEmpleado).then((resulte) => {
        this.nombreEmpleado = resulte.data.Nombres;
      }).catch((err) => {
      });
      const climaInfo = {
        "IdFlujo": this.idFlujo,
        "IdEmpleado": this.idEmpleado
      };
      this.organizacionService.getClimaInfo(climaInfo).then((resulsi) => {
        if (resulsi.data.Estado) {
          if (resulsi.data.Estado !== "Contestada") {
            this.idEncuestaEmpleado = resulsi.data.Id;
            this.getClima();
          } else {
            import_sweetalert2.default.fire({
              icon: "warning",
              title: "Aviso",
              text: this.translate.instant("MENUITEMS.ALONE.NOTVALID"),
              timer: 3e3,
              showConfirmButton: false
            });
            this.isLoadingForm = false;
          }
        }
      }).catch((err) => {
      });
    }
    this.title_card = this.quiz.title;
  }
  getClima() {
    this.organizacionService.getPreguntasClimaGF(this.idFlujo, this.idEmpleado).then((ris) => {
      if (ris.data[0]) {
        this.quiz = ris.data[0];
        this.nombreClima = this.quiz.Nombre;
        this.nombreOrganizacion = this.quiz.nombre_organizacion_oficial;
        console.log("this.quiz::: ", this.quiz);
        const allSeries = this.quiz.GranFactores.reduce((acc, gf) => acc.concat(gf.series || []), []);
        const allFields = allSeries.reduce((acc, serie) => acc.concat(serie.fields || []), []);
        this.formConfig = __spreadProps(__spreadValues({}, this.quiz), {
          GranFactores: this.quiz.GranFactores,
          // mantenemos la jerarquía para la vista
          series: allSeries,
          // por compatibilidad si en algún lado sigues usando series planas
          fields: allFields
          // flatten para que el FormBuilderService genere los controles
        });
        this.isLoadingForm = false;
        const datasUpdate = {
          "IdEncuestaEmpleado": this.idEncuestaEmpleado,
          "Estado": "Iniciada",
          "FechaInicio": /* @__PURE__ */ new Date(),
          "FechaFinalizacion": null
        };
        this.updateClimaEncuesta(datasUpdate);
      }
    }).catch((err) => {
      console.error(err);
    });
  }
  updateClimaEncuesta(data) {
    this.organizacionService.updateClimaEncuesta(data);
  }
  setLanguage(text, lang, flag) {
    console.log("text: " + text + " lang: " + lang + " flag: " + flag);
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
    if (lang) {
      this.dynamicFormComponent.translateRadioOptionLabels(this.dynamicFormComponent.formConfig, lang);
    }
  }
  onTurnstileTokenChange(token) {
    this.turnstileToken = token;
  }
  resetTurnstile() {
    this.turnstileToken = "";
    this.turnstileComponent?.reset();
  }
  static {
    this.\u0275fac = function CompleteclimaaloneComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _CompleteclimaaloneComponent)(\u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(ActivatedRoute), \u0275\u0275directiveInject(OrganizacionService), \u0275\u0275directiveInject(ConfigService), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(LanguageService), \u0275\u0275directiveInject(TranslateService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CompleteclimaaloneComponent, selectors: [["app-completeclimaalone"]], viewQuery: function CompleteclimaaloneComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(DynamicFormComponent, 5);
        \u0275\u0275viewQuery(TurnstileComponent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.dynamicFormComponent = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.turnstileComponent = _t.first);
      }
    }, decls: 19, vars: 7, consts: [["languagemenu", "matMenu"], ["loadingFormTpl", ""], [1, "body"], ["role", "toolbar", 1, "topbar"], [1, "topbar__left"], ["aria-hidden", "true"], [1, "topbar__title"], [1, "spacer"], ["mat-icon-button", "", "aria-label", "Cambiar idioma", 1, "lang-button", 3, "matMenuTriggerFor"], ["height", "16", "width", "24", "alt", "Idioma actual", 2, "border-radius", "2px", "box-shadow", "0 0 0 1px rgba(0,0,0,.08)", 3, "src"], [1, "lang-item-menu"], ["mat-menu-item", "", 3, "ngClass"], ["class", "survey-header", 4, "ngIf"], [4, "ngIf", "ngIfElse"], ["mat-menu-item", "", 3, "click", "ngClass"], ["height", "12", "width", "28", 1, "flag-img", 3, "src", "alt"], [1, "align-middle", "m-l-8"], [1, "survey-header"], [1, "survey-header__badge"], [1, "survey-header__title"], [1, "survey-header__subtitle"], ["inline", "", "aria-hidden", "true"], [1, "survey-header__list"], [2, "text-decoration", "underline"], [3, "formConfig", "idEmpleado", "idEncuestaEmpleado", "lang", "requireTurnstile", "turnstileToken", "turnstileResetRequested", 4, "ngIf"], [3, "turnstileResetRequested", "formConfig", "idEmpleado", "idEncuestaEmpleado", "lang", "requireTurnstile", "turnstileToken"], ["security-verification", "", "action", "clima-survey", 3, "tokenChange", "language"], [1, "form-loader"], ["mode", "indeterminate", "diameter", "60"]], template: function CompleteclimaaloneComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "mat-icon", 5);
        \u0275\u0275text(4, "assignment");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "span", 6);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd()();
        \u0275\u0275element(7, "span", 7);
        \u0275\u0275elementStart(8, "button", 8);
        \u0275\u0275element(9, "img", 9);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "mat-menu", 10, 0);
        \u0275\u0275repeaterCreate(12, CompleteclimaaloneComponent_For_13_Template, 4, 6, "button", 11, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(14, CompleteclimaaloneComponent_section_14_Template, 36, 26, "section", 12)(15, CompleteclimaaloneComponent_section_15_Template, 33, 24, "section", 12)(16, CompleteclimaaloneComponent_ng_container_16_Template, 3, 1, "ng-container", 13)(17, CompleteclimaaloneComponent_ng_template_17_Template, 2, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        const languagemenu_r5 = \u0275\u0275reference(11);
        const loadingFormTpl_r6 = \u0275\u0275reference(18);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.nombreClima);
        \u0275\u0275advance(2);
        \u0275\u0275property("matMenuTriggerFor", languagemenu_r5);
        \u0275\u0275advance();
        \u0275\u0275property("src", ctx.flagvalue || ctx.defaultFlag, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(3);
        \u0275\u0275repeater(ctx.listLang);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.quiz.IdOrganizacion != 25 && ctx.quiz.IdOrganizacion != void 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.quiz.IdOrganizacion == 25);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoadingForm)("ngIfElse", loadingFormTpl_r6);
      }
    }, dependencies: [
      CommonModule,
      NgClass,
      NgIf,
      DynamicFormComponent,
      MatButtonModule,
      MatIconButton,
      MatIconModule,
      MatIcon,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuTrigger,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      TranslateModule,
      TranslatePipe,
      TurnstileComponent
    ], styles: ['\n\n[_nghost-%COMP%] {\n  --jl-navy: #112d40;\n  --jl-navy-soft: #173d56;\n  --jl-orange: #f58b2a;\n  --jl-orange-strong: #d97018;\n  --jl-orange-soft: #fff0df;\n  --jl-cream: #fffaf4;\n  --jl-surface: #fffdf9;\n  --jl-border: #eadfce;\n  --jl-border-strong: #dec9ae;\n  --jl-text: #1f3748;\n  --jl-muted: #6e7d87;\n  display: block;\n  min-height: 100vh;\n  color: var(--jl-text);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.body[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  padding-bottom: 18px;\n  background:\n    radial-gradient(\n      circle at top left,\n      rgba(245, 139, 42, 0.12),\n      transparent 34rem),\n    linear-gradient(\n      180deg,\n      #fffaf4 0%,\n      #f6f1ea 58%,\n      #f3ede5 100%);\n}\n.topbar[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 12px clamp(16px, 3vw, 34px);\n  color: var(--jl-navy);\n  border-bottom: 1px solid var(--jl-border);\n  background: rgba(255, 250, 244, 0.96);\n  box-shadow: 0 8px 22px rgba(18, 43, 61, 0.08);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.topbar[_ngcontent-%COMP%]   .topbar__left[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  gap: 0.65rem;\n}\n.topbar[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 28px;\n  height: 28px;\n  padding: 5px;\n  color: var(--jl-orange-strong);\n  border-radius: 6px;\n  background: var(--jl-orange-soft);\n  font-family: "Material Icons" !important;\n  font-size: 18px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 18px;\n  text-transform: none;\n}\n.topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%] {\n  overflow: hidden;\n  max-width: min(58vw, 720px);\n  color: var(--jl-navy);\n  font-size: 15px;\n  font-weight: 760;\n  letter-spacing: 0.01em;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.topbar[_ngcontent-%COMP%]   .spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 42px;\n  height: 36px;\n  margin-left: 0.25rem;\n  border: 1px solid var(--jl-border-strong);\n  border-radius: 6px;\n  background: var(--jl-surface);\n  box-shadow: 0 3px 10px rgba(18, 43, 61, 0.05);\n}\n.topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  border-radius: 3px;\n  box-shadow: 0 0 0 1px rgba(18, 43, 61, 0.12);\n}\n.survey-header[_ngcontent-%COMP%] {\n  position: relative;\n  max-width: 1080px;\n  margin: 22px auto 20px;\n  overflow: hidden;\n  padding: clamp(22px, 4vw, 34px);\n  color: #fffaf4;\n  border: 1px solid rgba(255, 240, 223, 0.18);\n  border-radius: 8px;\n  background:\n    radial-gradient(\n      circle at right top,\n      rgba(245, 139, 42, 0.22),\n      transparent 28rem),\n    linear-gradient(\n      135deg,\n      var(--jl-navy) 0%,\n      var(--jl-navy-soft) 100%);\n  box-shadow: 0 16px 38px rgba(18, 43, 61, 0.17);\n}\n.survey-header[_ngcontent-%COMP%]::before {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 6px;\n  content: "";\n  background: var(--jl-orange);\n}\n.survey-header__badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  margin-bottom: 14px;\n  padding: 6px 12px;\n  color: var(--jl-navy);\n  border-radius: 6px;\n  background: #ffd39f;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.16em;\n  text-transform: uppercase;\n}\n.survey-header__title[_ngcontent-%COMP%] {\n  max-width: 920px;\n  margin: 0 0 12px;\n  color: #ffffff;\n  font-size: clamp(1.35rem, 2.4vw, 2.15rem);\n  font-weight: 820;\n  line-height: 1.14;\n}\n.survey-header__subtitle[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n  margin: 0 0 18px;\n  color: rgba(255, 250, 244, 0.84);\n  font-size: 17px;\n}\n.survey-header__subtitle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--jl-orange);\n  font-family: "Material Icons" !important;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  overflow: visible;\n  text-transform: none;\n}\n.survey-header__subtitle[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #ffffff;\n  font-weight: 760;\n}\n.survey-header__list[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px 18px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.survey-header__list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.55rem;\n  color: rgba(255, 250, 244, 0.88);\n  font-size: 15px;\n  line-height: 1.42;\n}\n.survey-header__list[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  width: 22px;\n  height: 22px;\n  margin-top: 1px;\n  color: var(--jl-orange);\n  font-family: "Material Icons" !important;\n  font-size: 20px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  overflow: visible;\n  text-transform: none;\n}\n.form-loader[_ngcontent-%COMP%] {\n  display: grid;\n  min-height: 280px;\n  place-items: center;\n}\n  .lang-item-menu {\n  border: 1px solid var(--jl-border, #eadfce);\n  border-radius: 7px;\n  background: var(--jl-surface, #fffdf9);\n  box-shadow: 0 12px 28px rgba(18, 43, 61, 0.14);\n}\n  .lang-item-menu .mat-mdc-menu-item {\n  color: var(--jl-text, #1f3748);\n}\n  .lang-item-menu .mat-mdc-menu-item.active, \n  .lang-item-menu .mat-mdc-menu-item:hover {\n  color: var(--jl-navy, #112d40);\n  background: var(--jl-orange-soft, #fff0df);\n}\n.dark[_nghost-%COMP%], .dark   [_nghost-%COMP%], \n.dark-theme[_nghost-%COMP%], .dark-theme   [_nghost-%COMP%] {\n  --jl-navy: #101820;\n  --jl-navy-soft: #152536;\n  --jl-orange-soft: rgba(245, 139, 42, 0.16);\n  --jl-surface: #171d25;\n  --jl-border: #354452;\n  --jl-border-strong: #465564;\n  --jl-text: #e1e8ee;\n  --jl-muted: #9cabb7;\n}\n.dark[_nghost-%COMP%]   .body[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .body[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .body[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .body[_ngcontent-%COMP%] {\n  background: #0f1115;\n}\n.dark[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%] {\n  color: #e1e8ee;\n  border-color: #273544;\n  background: rgba(17, 24, 32, 0.96);\n  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);\n}\n.dark[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%] {\n  color: #e1e8ee;\n}\n.dark[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .topbar[_ngcontent-%COMP%]   .lang-button[_ngcontent-%COMP%] {\n  border-color: #354452;\n  background: #171d25;\n}\n.dark[_nghost-%COMP%]   .survey-header[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .survey-header[_ngcontent-%COMP%], \n.dark-theme[_nghost-%COMP%]   .survey-header[_ngcontent-%COMP%], .dark-theme   [_nghost-%COMP%]   .survey-header[_ngcontent-%COMP%] {\n  border-color: #354452;\n  background:\n    linear-gradient(\n      135deg,\n      #111a23 0%,\n      #162839 100%);\n}\n@media (max-width: 780px) {\n  .topbar[_ngcontent-%COMP%] {\n    padding-inline: 14px;\n  }\n  .survey-header[_ngcontent-%COMP%] {\n    margin: 16px 12px 14px;\n  }\n  .survey-header__list[_ngcontent-%COMP%] {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n@media (max-width: 520px) {\n  .topbar[_ngcontent-%COMP%]   .topbar__title[_ngcontent-%COMP%] {\n    max-width: 54vw;\n    font-size: 13px;\n  }\n  .survey-header[_ngcontent-%COMP%] {\n    padding: 20px 18px;\n  }\n}\n/*# sourceMappingURL=completeclimaalone.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CompleteclimaaloneComponent, [{
    type: Component,
    args: [{ selector: "app-completeclimaalone", imports: [
      CommonModule,
      DynamicFormComponent,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      TranslateModule,
      TurnstileComponent
    ], template: `<div class="body">

  <!-- Top bar fija -->
  <div class="topbar" role="toolbar">
    <div class="topbar__left">
      <mat-icon aria-hidden="true">assignment</mat-icon>
      <span class="topbar__title">{{ nombreClima }}</span>
    </div>

    <span class="spacer"></span>

    <!-- Selector de idioma -->
    <button mat-icon-button [matMenuTriggerFor]="languagemenu" aria-label="Cambiar idioma" class="lang-button">
      <img [src]="flagvalue || defaultFlag" height="16" width="24" alt="Idioma actual" style="border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.08)">
    </button>
    <mat-menu #languagemenu="matMenu" class="lang-item-menu">
      @for (item of listLang; track item) {
        <button mat-menu-item (click)="setLanguage(item.text, item.lang, item.flag)"
                [ngClass]="{'active': langStoreValue === item.lang}">
          <img [src]="item.flag" height="12" width="28" class="flag-img" alt="{{item.text}}">
          <span class="align-middle m-l-8">{{ item.text }}</span>
        </button>
      }
    </mat-menu>
  </div>

  <!-- Encabezado de la encuesta -->
  <section *ngIf="quiz.IdOrganizacion != 25 && quiz.IdOrganizacion != undefined" class="survey-header">
    <div class="survey-header__badge">{{ 'MENUITEMS.ALONE.SURVEY' | translate }}</div>

    <h1 class="survey-header__title">
      {{ 'MENUITEMS.ALONE.HELLO' | translate }}, 
      {{ 'MENUITEMS.ALONE.TO' | translate }} {{ nombreClima }}.
    </h1>

    <p class="survey-header__subtitle">
      <mat-icon inline aria-hidden="true">domain</mat-icon>
      <strong>{{ nombreOrganizacion }}</strong> {{ 'MENUITEMS.ALONE.GREETEENGS' | translate }}
    </p>

    <ul class="survey-header__list">
      <li><mat-icon inline aria-hidden="true">check_circle</mat-icon>{{ 'MENUITEMS.ALONE.CONDITION1' | translate }}</li>
      <li><mat-icon inline aria-hidden="true">check_circle</mat-icon>{{ 'MENUITEMS.ALONE.CONDITION2' | translate }}</li>
      <li><mat-icon inline aria-hidden="true">check_circle</mat-icon>{{ 'MENUITEMS.ALONE.CONDITION3' | translate }}</li>
      <li><mat-icon inline aria-hidden="true">check_circle</mat-icon>{{ 'MENUITEMS.ALONE.CONDITION4' | translate }}</li>
    </ul>
  </section>

  <section *ngIf="quiz.IdOrganizacion == 25" class="survey-header">
    <div class="survey-header__badge">
      {{ 'MENUITEMS.ALONE.GREETEENGS_APDE' | translate }}
    </div>

    <ul class="survey-header__list">
      <li>
        <mat-icon inline aria-hidden="true">check_circle</mat-icon>
        <span>
          {{ 'MENUITEMS.ALONE.CONDITION1_APDE' | translate }}
        </span>
      </li>

      <li>
        <mat-icon inline aria-hidden="true">check_circle</mat-icon>
        <span>
          {{ 'MENUITEMS.ALONE.CONDITION2_APDE' | translate }}
        </span>
      </li>

      <li>
        <mat-icon inline aria-hidden="true">check_circle</mat-icon>
        <span>
          {{ 'MENUITEMS.ALONE.CONDITION3_APDE_1' | translate }}
          <strong style="text-decoration: underline;">
            {{ 'MENUITEMS.ALONE.CONDITION3_APDE_2' | translate }}
          </strong>
          {{ 'MENUITEMS.ALONE.CONDITION3_APDE_3' | translate }}
          <strong style="text-decoration: underline;">
            {{ 'MENUITEMS.ALONE.CONDITION3_APDE_4' | translate }}
          </strong>
          {{ 'MENUITEMS.ALONE.CONDITION3_APDE_5' | translate }}
        </span>
      </li>
    </ul>
  </section>


  <!-- Form din\xE1mico -->
  <ng-container *ngIf="!isLoadingForm; else loadingFormTpl">
    <div>
      <app-dynamic-form *ngIf="formConfig?.fields?.length"
        [formConfig]="formConfig"
        [idEmpleado]="idEmpleado"
        [idEncuestaEmpleado]="idEncuestaEmpleado"
        [lang]="langStoreValue"
        [requireTurnstile]="true"
        [turnstileToken]="turnstileToken"
        (turnstileResetRequested)="resetTurnstile()">
        <app-turnstile
          security-verification
          action="clima-survey"
          [language]="langStoreValue || 'es'"
          (tokenChange)="onTurnstileTokenChange($event)">
        </app-turnstile>
      </app-dynamic-form>
    </div>
  </ng-container>

  <ng-template #loadingFormTpl>
    <div class="form-loader">
      <mat-progress-spinner
        mode="indeterminate"
        diameter="60">
      </mat-progress-spinner>
    </div>
  </ng-template>

</div>
`, styles: ['/* src/app/completeclimaalone/completeclimaalone.component.scss */\n:host {\n  --jl-navy: #112d40;\n  --jl-navy-soft: #173d56;\n  --jl-orange: #f58b2a;\n  --jl-orange-strong: #d97018;\n  --jl-orange-soft: #fff0df;\n  --jl-cream: #fffaf4;\n  --jl-surface: #fffdf9;\n  --jl-border: #eadfce;\n  --jl-border-strong: #dec9ae;\n  --jl-text: #1f3748;\n  --jl-muted: #6e7d87;\n  display: block;\n  min-height: 100vh;\n  color: var(--jl-text);\n  font-family: var(--app-font-family, "TT Interphases", "Inter", "Segoe UI", Arial, sans-serif);\n}\n.body {\n  min-height: 100vh;\n  padding-bottom: 18px;\n  background:\n    radial-gradient(\n      circle at top left,\n      rgba(245, 139, 42, 0.12),\n      transparent 34rem),\n    linear-gradient(\n      180deg,\n      #fffaf4 0%,\n      #f6f1ea 58%,\n      #f3ede5 100%);\n}\n.topbar {\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 12px clamp(16px, 3vw, 34px);\n  color: var(--jl-navy);\n  border-bottom: 1px solid var(--jl-border);\n  background: rgba(255, 250, 244, 0.96);\n  box-shadow: 0 8px 22px rgba(18, 43, 61, 0.08);\n  -webkit-backdrop-filter: blur(12px);\n  backdrop-filter: blur(12px);\n}\n.topbar .topbar__left {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  gap: 0.65rem;\n}\n.topbar mat-icon {\n  flex: 0 0 auto;\n  width: 28px;\n  height: 28px;\n  padding: 5px;\n  color: var(--jl-orange-strong);\n  border-radius: 6px;\n  background: var(--jl-orange-soft);\n  font-family: "Material Icons" !important;\n  font-size: 18px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 18px;\n  text-transform: none;\n}\n.topbar .topbar__title {\n  overflow: hidden;\n  max-width: min(58vw, 720px);\n  color: var(--jl-navy);\n  font-size: 15px;\n  font-weight: 760;\n  letter-spacing: 0.01em;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.topbar .spacer {\n  flex: 1 1 auto;\n}\n.topbar .lang-button {\n  flex: 0 0 auto;\n  width: 42px;\n  height: 36px;\n  margin-left: 0.25rem;\n  border: 1px solid var(--jl-border-strong);\n  border-radius: 6px;\n  background: var(--jl-surface);\n  box-shadow: 0 3px 10px rgba(18, 43, 61, 0.05);\n}\n.topbar .lang-button img {\n  border-radius: 3px;\n  box-shadow: 0 0 0 1px rgba(18, 43, 61, 0.12);\n}\n.survey-header {\n  position: relative;\n  max-width: 1080px;\n  margin: 22px auto 20px;\n  overflow: hidden;\n  padding: clamp(22px, 4vw, 34px);\n  color: #fffaf4;\n  border: 1px solid rgba(255, 240, 223, 0.18);\n  border-radius: 8px;\n  background:\n    radial-gradient(\n      circle at right top,\n      rgba(245, 139, 42, 0.22),\n      transparent 28rem),\n    linear-gradient(\n      135deg,\n      var(--jl-navy) 0%,\n      var(--jl-navy-soft) 100%);\n  box-shadow: 0 16px 38px rgba(18, 43, 61, 0.17);\n}\n.survey-header::before {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 6px;\n  content: "";\n  background: var(--jl-orange);\n}\n.survey-header__badge {\n  display: inline-flex;\n  align-items: center;\n  width: fit-content;\n  margin-bottom: 14px;\n  padding: 6px 12px;\n  color: var(--jl-navy);\n  border-radius: 6px;\n  background: #ffd39f;\n  font-size: 0.72rem;\n  font-weight: 800;\n  letter-spacing: 0.16em;\n  text-transform: uppercase;\n}\n.survey-header__title {\n  max-width: 920px;\n  margin: 0 0 12px;\n  color: #ffffff;\n  font-size: clamp(1.35rem, 2.4vw, 2.15rem);\n  font-weight: 820;\n  line-height: 1.14;\n}\n.survey-header__subtitle {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 0.45rem;\n  margin: 0 0 18px;\n  color: rgba(255, 250, 244, 0.84);\n  font-size: 17px;\n}\n.survey-header__subtitle mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--jl-orange);\n  font-family: "Material Icons" !important;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  overflow: visible;\n  text-transform: none;\n}\n.survey-header__subtitle strong {\n  color: #ffffff;\n  font-weight: 760;\n}\n.survey-header__list {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 10px 18px;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.survey-header__list li {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.55rem;\n  color: rgba(255, 250, 244, 0.88);\n  font-size: 15px;\n  line-height: 1.42;\n}\n.survey-header__list mat-icon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 auto;\n  width: 22px;\n  height: 22px;\n  margin-top: 1px;\n  color: var(--jl-orange);\n  font-family: "Material Icons" !important;\n  font-size: 20px;\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  overflow: visible;\n  text-transform: none;\n}\n.form-loader {\n  display: grid;\n  min-height: 280px;\n  place-items: center;\n}\n::ng-deep .lang-item-menu {\n  border: 1px solid var(--jl-border, #eadfce);\n  border-radius: 7px;\n  background: var(--jl-surface, #fffdf9);\n  box-shadow: 0 12px 28px rgba(18, 43, 61, 0.14);\n}\n::ng-deep .lang-item-menu .mat-mdc-menu-item {\n  color: var(--jl-text, #1f3748);\n}\n::ng-deep .lang-item-menu .mat-mdc-menu-item.active,\n::ng-deep .lang-item-menu .mat-mdc-menu-item:hover {\n  color: var(--jl-navy, #112d40);\n  background: var(--jl-orange-soft, #fff0df);\n}\n:host-context(.dark),\n:host-context(.dark-theme) {\n  --jl-navy: #101820;\n  --jl-navy-soft: #152536;\n  --jl-orange-soft: rgba(245, 139, 42, 0.16);\n  --jl-surface: #171d25;\n  --jl-border: #354452;\n  --jl-border-strong: #465564;\n  --jl-text: #e1e8ee;\n  --jl-muted: #9cabb7;\n}\n:host-context(.dark) .body,\n:host-context(.dark-theme) .body {\n  background: #0f1115;\n}\n:host-context(.dark) .topbar,\n:host-context(.dark-theme) .topbar {\n  color: #e1e8ee;\n  border-color: #273544;\n  background: rgba(17, 24, 32, 0.96);\n  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.24);\n}\n:host-context(.dark) .topbar .topbar__title,\n:host-context(.dark-theme) .topbar .topbar__title {\n  color: #e1e8ee;\n}\n:host-context(.dark) .topbar .lang-button,\n:host-context(.dark-theme) .topbar .lang-button {\n  border-color: #354452;\n  background: #171d25;\n}\n:host-context(.dark) .survey-header,\n:host-context(.dark-theme) .survey-header {\n  border-color: #354452;\n  background:\n    linear-gradient(\n      135deg,\n      #111a23 0%,\n      #162839 100%);\n}\n@media (max-width: 780px) {\n  .topbar {\n    padding-inline: 14px;\n  }\n  .survey-header {\n    margin: 16px 12px 14px;\n  }\n  .survey-header__list {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n@media (max-width: 520px) {\n  .topbar .topbar__title {\n    max-width: 54vw;\n    font-size: 13px;\n  }\n  .survey-header {\n    padding: 20px 18px;\n  }\n}\n/*# sourceMappingURL=completeclimaalone.component.css.map */\n'] }]
  }], () => [{ type: UntypedFormBuilder }, { type: ActivatedRoute }, { type: OrganizacionService }, { type: ConfigService }, { type: AuthService }, { type: LanguageService }, { type: TranslateService }], { dynamicFormComponent: [{
    type: ViewChild,
    args: [DynamicFormComponent]
  }], turnstileComponent: [{
    type: ViewChild,
    args: [TurnstileComponent]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CompleteclimaaloneComponent, { className: "CompleteclimaaloneComponent", filePath: "src/app/completeclimaalone/completeclimaalone.component.ts", lineNumber: 38 });
})();

// src/app/completeclimaalone/completeclimaalone.routes.ts
var COMPLETE_CLIMA_ROUTE = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "",
    component: CompleteclimaaloneComponent
  }
];
export {
  COMPLETE_CLIMA_ROUTE
};
//# sourceMappingURL=completeclimaalone.routes-M5GQR3BG.js.map
