import {
  AuthService
} from "./chunk-JPZDBAQQ.js";
import {
  TranslateModule,
  TranslatePipe
} from "./chunk-J7XWAFEK.js";
import {
  OrganizacionService
} from "./chunk-ITHPGOKL.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import {
  BreadcrumbComponent
} from "./chunk-2TM4C2ER.js";
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
  MatPrefix,
  MatSuffix
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButtonModule,
  MatIconButton
} from "./chunk-6OUKOU55.js";
import "./chunk-Y73QBUAC.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  RouterLink
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  Subject,
  setClassMetadata,
  takeUntil,
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
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-BHZ7HWLX.js";
import {
  __async
} from "./chunk-IIGRIO22.js";

// src/app/profile/profile.component.ts
var _c0 = () => ["Home"];
function ProfileComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275element(1, "mat-progress-spinner", 10);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 1, "MENUITEMS.PROFILE.LOADING"));
  }
}
function ProfileComponent_ng_container_12_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 46)(1, "mat-icon");
    \u0275\u0275text(2, "verified_user");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const role_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", role_r3, " ");
  }
}
function ProfileComponent_ng_container_12_span_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 47);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(2, 1, "MENUITEMS.PROFILE.NO_ROLE"), " ");
  }
}
function ProfileComponent_ng_container_12_div_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "mat-icon");
    \u0275\u0275text(2, "info_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "MENUITEMS.PROFILE.PARTIAL_DATA"));
  }
}
function ProfileComponent_ng_container_12_button_130_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 49);
    \u0275\u0275pipe(1, "translate");
    \u0275\u0275listener("click", function ProfileComponent_ng_container_12_button_130_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.accessSearch = "");
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "close");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(1, 1, "MENUITEMS.PROFILE.CLEAR_SEARCH"));
  }
}
function ProfileComponent_ng_container_12_div_162_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50)(1, "mat-icon");
    \u0275\u0275text(2, "verified");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 2, "MENUITEMS.PROFILE.ADMIN_ACCESS_TITLE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 4, "MENUITEMS.PROFILE.ADMIN_ACCESS_TEXT"));
  }
}
function ProfileComponent_ng_container_12_div_173_a_1_small_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const module_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, module_r5.category));
  }
}
function ProfileComponent_ng_container_12_div_173_a_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 53)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, ProfileComponent_ng_container_12_div_173_a_1_small_8_Template, 3, 3, "small", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "mat-icon");
    \u0275\u0275text(10, "chevron_right");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const module_r5 = ctx.$implicit;
    \u0275\u0275property("routerLink", module_r5.path);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(module_r5.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 4, module_r5.title));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", module_r5.category);
  }
}
function ProfileComponent_ng_container_12_div_173_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275template(1, ProfileComponent_ng_container_12_div_173_a_1_Template, 11, 6, "a", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.filteredModules)("ngForTrackBy", ctx_r1.trackModule);
  }
}
function ProfileComponent_ng_container_12_ng_template_174_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "mat-icon");
    \u0275\u0275text(2, "apps_outage");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 1, "MENUITEMS.PROFILE.NO_MODULES"));
  }
}
function ProfileComponent_ng_container_12_div_186_div_1_small_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "small");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const action_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, action_r6.description));
  }
}
function ProfileComponent_ng_container_12_div_186_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57)(1, "span")(2, "mat-icon");
    \u0275\u0275text(3, "check");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, ProfileComponent_ng_container_12_div_186_div_1_small_8_Template, 3, 3, "small", 8);
    \u0275\u0275elementStart(9, "code");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const action_r6 = ctx.$implicit;
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 3, action_r6.name));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", action_r6.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(action_r6.code);
  }
}
function ProfileComponent_ng_container_12_div_186_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275template(1, ProfileComponent_ng_container_12_div_186_div_1_Template, 11, 5, "div", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.filteredActions)("ngForTrackBy", ctx_r1.trackAction);
  }
}
function ProfileComponent_ng_container_12_ng_template_187_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.isAdministrator ? "verified_user" : "rule_folder");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(5, 2, ctx_r1.isAdministrator ? "MENUITEMS.PROFILE.ADMIN_ACTIONS" : "MENUITEMS.PROFILE.NO_ACTIONS"), " ");
  }
}
function ProfileComponent_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "section", 11)(2, "div", 12)(3, "span", 13);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "img", 14);
    \u0275\u0275listener("error", function ProfileComponent_ng_container_12_Template_img_error_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onProfileImageError($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(6, "span", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 16)(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "h1");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 17)(14, "span")(15, "mat-icon");
    \u0275\u0275text(16, "alternate_email");
    \u0275\u0275elementEnd();
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span")(19, "mat-icon");
    \u0275\u0275text(20, "business");
    \u0275\u0275elementEnd();
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 18)(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div");
    \u0275\u0275template(27, ProfileComponent_ng_container_12_span_27_Template, 4, 1, "span", 19)(28, ProfileComponent_ng_container_12_span_28_Template, 3, 3, "span", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 21)(30, "mat-icon");
    \u0275\u0275text(31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "div")(33, "span");
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "strong");
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(39, ProfileComponent_ng_container_12_div_39_Template, 6, 3, "div", 22);
    \u0275\u0275elementStart(40, "div", 23)(41, "aside", 24)(42, "div", 25)(43, "span", 26)(44, "mat-icon");
    \u0275\u0275text(45, "person");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div")(47, "strong");
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "span");
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "dl", 27)(54, "div")(55, "dt")(56, "mat-icon");
    \u0275\u0275text(57, "badge");
    \u0275\u0275elementEnd();
    \u0275\u0275text(58);
    \u0275\u0275pipe(59, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(60, "dd");
    \u0275\u0275text(61);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(62, "div")(63, "dt")(64, "mat-icon");
    \u0275\u0275text(65, "mail_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "dd");
    \u0275\u0275text(69);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div")(71, "dt")(72, "mat-icon");
    \u0275\u0275text(73, "phone");
    \u0275\u0275elementEnd();
    \u0275\u0275text(74);
    \u0275\u0275pipe(75, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "dd");
    \u0275\u0275text(77);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(78, "div")(79, "dt")(80, "mat-icon");
    \u0275\u0275text(81, "work_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(82);
    \u0275\u0275pipe(83, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(84, "dd");
    \u0275\u0275text(85);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div")(87, "dt")(88, "mat-icon");
    \u0275\u0275text(89, "location_city");
    \u0275\u0275elementEnd();
    \u0275\u0275text(90);
    \u0275\u0275pipe(91, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "dd");
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div")(95, "dt")(96, "mat-icon");
    \u0275\u0275text(97, "apartment");
    \u0275\u0275elementEnd();
    \u0275\u0275text(98);
    \u0275\u0275pipe(99, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(100, "dd");
    \u0275\u0275text(101);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(102, "div", 28)(103, "mat-icon");
    \u0275\u0275text(104, "lock_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "div")(106, "strong");
    \u0275\u0275text(107);
    \u0275\u0275pipe(108, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(109, "span");
    \u0275\u0275text(110);
    \u0275\u0275pipe(111, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(112, "main", 29)(113, "div", 30)(114, "div", 25)(115, "span", 31)(116, "mat-icon");
    \u0275\u0275text(117, "shield");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(118, "div")(119, "strong");
    \u0275\u0275text(120);
    \u0275\u0275pipe(121, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(122, "span");
    \u0275\u0275text(123);
    \u0275\u0275pipe(124, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(125, "mat-form-field", 32)(126, "mat-icon", 33);
    \u0275\u0275text(127, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(128, "input", 34);
    \u0275\u0275pipe(129, "translate");
    \u0275\u0275twoWayListener("ngModelChange", function ProfileComponent_ng_container_12_Template_input_ngModelChange_128_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accessSearch, $event) || (ctx_r1.accessSearch = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(130, ProfileComponent_ng_container_12_button_130_Template, 4, 3, "button", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(131, "div", 36)(132, "div")(133, "span", 37)(134, "mat-icon");
    \u0275\u0275text(135, "apps");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(136, "p")(137, "strong");
    \u0275\u0275text(138);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(139, "span");
    \u0275\u0275text(140);
    \u0275\u0275pipe(141, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(142, "div")(143, "span", 38)(144, "mat-icon");
    \u0275\u0275text(145, "rule");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(146, "p")(147, "strong");
    \u0275\u0275text(148);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(149, "span");
    \u0275\u0275text(150);
    \u0275\u0275pipe(151, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(152, "div")(153, "span", 39)(154, "mat-icon");
    \u0275\u0275text(155, "admin_panel_settings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(156, "p")(157, "strong");
    \u0275\u0275text(158);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(159, "span");
    \u0275\u0275text(160);
    \u0275\u0275pipe(161, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(162, ProfileComponent_ng_container_12_div_162_Template, 10, 6, "div", 40);
    \u0275\u0275elementStart(163, "section", 41)(164, "div", 42)(165, "div")(166, "mat-icon");
    \u0275\u0275text(167, "grid_view");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(168, "strong");
    \u0275\u0275text(169);
    \u0275\u0275pipe(170, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(171, "span");
    \u0275\u0275text(172);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(173, ProfileComponent_ng_container_12_div_173_Template, 2, 2, "div", 43)(174, ProfileComponent_ng_container_12_ng_template_174_Template, 6, 3, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(176, "section", 44)(177, "div", 42)(178, "div")(179, "mat-icon");
    \u0275\u0275text(180, "task_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(181, "strong");
    \u0275\u0275text(182);
    \u0275\u0275pipe(183, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(184, "span");
    \u0275\u0275text(185);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(186, ProfileComponent_ng_container_12_div_186_Template, 2, 2, "div", 45)(187, ProfileComponent_ng_container_12_ng_template_187_Template, 6, 4, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const noModules_r7 = \u0275\u0275reference(175);
    const noActions_r8 = \u0275\u0275reference(188);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.profileInitials);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r1.profileImageUrl, \u0275\u0275sanitizeUrl)("alt", ctx_r1.displayName);
    \u0275\u0275advance();
    \u0275\u0275classProp("inactive", !ctx_r1.isActive);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 54, "MENUITEMS.PROFILE.ACCOUNT"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.displayName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.username);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.organizationName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 56, "MENUITEMS.PROFILE.ASSIGNED_ROLES"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.roleNames);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.roleNames.length === 0);
    \u0275\u0275advance();
    \u0275\u0275classProp("inactive", !ctx_r1.isActive);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.isActive ? "check_circle" : "block");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 58, "MENUITEMS.PROFILE.ACCOUNT_STATUS"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 60, ctx_r1.isActive ? "MENUITEMS.PROFILE.ACTIVE" : "MENUITEMS.PROFILE.INACTIVE"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.loadError);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(49, 62, "MENUITEMS.PROFILE.BASIC_INFO"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(52, 64, "MENUITEMS.PROFILE.BASIC_INFO_SUBTITLE"));
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(59, 66, "MENUITEMS.PROFILE.USERNAME"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.username);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 68, "MENUITEMS.PROFILE.EMAIL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.email);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(75, 70, "MENUITEMS.PROFILE.PHONE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.phone);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(83, 72, "MENUITEMS.PROFILE.POSITION"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.position);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(91, 74, "MENUITEMS.PROFILE.CITY"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.city);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(99, 76, "MENUITEMS.PROFILE.ORGANIZATION"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.organizationName);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(108, 78, "MENUITEMS.PROFILE.SECURITY_TITLE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(111, 80, "MENUITEMS.PROFILE.SECURITY_TEXT"));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(121, 82, "MENUITEMS.PROFILE.ACCESS_TITLE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(124, 84, "MENUITEMS.PROFILE.ACCESS_SUBTITLE"));
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accessSearch);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(129, 86, "MENUITEMS.PROFILE.SEARCH_ACCESS_PLACEHOLDER"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.accessSearch);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.moduleAccesses.length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(141, 88, "MENUITEMS.PROFILE.MODULES"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.actionAccesses.length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(151, 90, "MENUITEMS.PROFILE.ACTIONS"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.roleNames.length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(161, 92, "MENUITEMS.PROFILE.ROLES"));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.isAdministrator);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(170, 94, "MENUITEMS.PROFILE.AVAILABLE_MODULES"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.filteredModules.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredModules.length)("ngIfElse", noModules_r7);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(183, 96, "MENUITEMS.PROFILE.ACTION_PERMISSIONS"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.filteredActions.length);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.filteredActions.length)("ngIfElse", noActions_r8);
  }
}
var ProfileComponent = class _ProfileComponent {
  constructor(authService, organizationService) {
    this.authService = authService;
    this.organizationService = organizationService;
    this.profileImageBucketUrl = "https://justlink-clima360-objects.s3.us-east-1.amazonaws.com/";
    this.fallbackProfileImageUrl = "assets/images/user/usrbig3.jpg";
    this.destroy$ = new Subject();
    this.userDetails = {};
    this.selectedOrganization = null;
    this.moduleAccesses = [];
    this.actionAccesses = [];
    this.accessSearch = "";
    this.loading = true;
    this.loadError = false;
  }
  ngOnInit() {
    this.organizationService.selectedOrganization$.pipe(takeUntil(this.destroy$)).subscribe((organization) => {
      this.selectedOrganization = organization;
    });
    void this.loadProfile();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get sessionUser() {
    return this.authService.currentUserValue ?? {};
  }
  get displayName() {
    const names = this.readValue(this.userDetails, ["nombres", "Nombres", "firstName"]) || this.readValue(this.sessionUser, ["nombres", "Nombres", "firstName"]);
    const lastNames = this.readValue(this.userDetails, ["apellidos", "Apellidos", "lastName"]) || this.readValue(this.sessionUser, ["apellidos", "Apellidos", "lastName"]);
    const fullName = `${names} ${lastNames}`.trim();
    return fullName || this.username || "Usuario";
  }
  get username() {
    return this.readValue(this.userDetails, ["username", "Username", "usuario"]) || this.readValue(this.sessionUser, ["username", "Username", "usuario"]) || "-";
  }
  get email() {
    return this.readValue(this.userDetails, ["email", "Email", "correo", "correoElectronico"]) || this.readValue(this.sessionUser, ["email", "Email", "correo"]) || "-";
  }
  get phone() {
    return this.readValue(this.userDetails, ["telefono", "Telefono", "phone", "phoneNumber"]) || "-";
  }
  get position() {
    return this.readValue(this.userDetails, ["cargo", "Cargo", "puesto", "position"]) || "-";
  }
  get city() {
    return this.readValue(this.userDetails, ["ciudad", "Ciudad", "city"]) || "-";
  }
  get organizationName() {
    return this.readValue(this.userDetails, [
      "organizacion",
      "Organizacion",
      "nombreOrganizacion",
      "NombreOrganizacion",
      "nombre_organizacion"
    ]) || this.selectedOrganization?.Nombre || "-";
  }
  get roleNames() {
    const detailRole = this.readValue(this.userDetails, ["roleName", "RoleName", "rol"]);
    const sessionRoles = Array.isArray(this.sessionUser?.roles) ? this.sessionUser.roles.map((role) => this.readValue(role, ["roleName", "RoleName", "nombre", "name"])).filter(Boolean) : [];
    return [...new Set([detailRole, ...sessionRoles].filter(Boolean))];
  }
  get isActive() {
    const value = this.userDetails?.isActive ?? this.userDetails?.activo ?? this.userDetails?.Activo ?? this.sessionUser?.isValid;
    return value !== false && value !== 0 && String(value).toLowerCase() !== "false";
  }
  get isAdministrator() {
    return this.roleNames.some((role) => {
      const normalized = this.normalizeSearchText(role).replace(/\s+/g, "");
      return normalized === "admin" || normalized === "superadmin" || normalized === "superadministrador";
    });
  }
  get profileInitials() {
    return this.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "U";
  }
  get profileImageUrl() {
    const source = this.readValue(this.userDetails, ["imagenUrl", "ImagenUrl", "img", "image"]) || this.readValue(this.sessionUser, ["imagenUrl", "ImagenUrl", "img", "image"]);
    if (!source) {
      return this.fallbackProfileImageUrl;
    }
    if (/^(https?:|data:|blob:)/i.test(source)) {
      return source;
    }
    const encodedKey = source.split("/").map((segment) => encodeURIComponent(segment)).join("/");
    return `${this.profileImageBucketUrl}${encodedKey}`;
  }
  get filteredModules() {
    const search = this.normalizeSearchText(this.accessSearch);
    if (!search) {
      return this.moduleAccesses;
    }
    return this.moduleAccesses.filter((item) => this.normalizeSearchText(`${item.title} ${item.category} ${item.path}`).includes(search));
  }
  get filteredActions() {
    const search = this.normalizeSearchText(this.accessSearch);
    if (!search) {
      return this.actionAccesses;
    }
    return this.actionAccesses.filter((item) => this.normalizeSearchText(`${item.code} ${item.name} ${item.description}`).includes(search));
  }
  loadProfile() {
    return __async(this, null, function* () {
      const userId = Number(this.sessionUser?.userId ?? this.sessionUser?.id);
      const roleId = Number(this.sessionUser?.roles?.[0]?.roleId);
      this.loading = true;
      this.loadError = false;
      this.actionAccesses = this.normalizePermissions(this.sessionUser?.permissions);
      const userRequest = Number.isInteger(userId) && userId > 0 ? this.organizationService.getUserById(userId) : Promise.resolve(null);
      const routeRequest = this.getStoredRoutes() ?? (Number.isInteger(roleId) && roleId > 0 ? this.organizationService.getMenuAccess(roleId).then((response) => response?.data ?? []) : Promise.resolve([]));
      const [userResult, routeResult] = yield Promise.allSettled([userRequest, routeRequest]);
      if (userResult.status === "fulfilled" && userResult.value) {
        this.userDetails = this.extractUserDetails(userResult.value);
      } else {
        this.userDetails = {};
        this.loadError = userResult.status === "rejected";
      }
      if (routeResult.status === "fulfilled") {
        const routes = Array.isArray(routeResult.value) ? routeResult.value : [];
        this.moduleAccesses = this.flattenRouteAccesses(routes);
      } else {
        this.moduleAccesses = [];
        this.loadError = true;
      }
      this.loading = false;
    });
  }
  onProfileImageError(event) {
    const image = event.target;
    if (!image.src.includes(this.fallbackProfileImageUrl)) {
      image.src = this.fallbackProfileImageUrl;
    }
  }
  trackModule(_index, item) {
    return item.path || `${item.category}:${item.title}`;
  }
  trackAction(_index, item) {
    return item.code;
  }
  extractUserDetails(response) {
    const data = response?.data?.data ?? response?.data ?? response;
    if (Array.isArray(data)) {
      return data[0] ?? {};
    }
    return data?.user ?? data?.usuario ?? data ?? {};
  }
  getStoredRoutes() {
    try {
      const raw = sessionStorage.getItem("routes");
      const routes = raw ? JSON.parse(raw) : null;
      return Array.isArray(routes) ? Promise.resolve(routes) : null;
    } catch {
      return null;
    }
  }
  flattenRouteAccesses(routes, parentTitle = "") {
    const modules = [];
    for (const route of routes ?? []) {
      const title = String(route?.title ?? "").trim();
      const category = route.groupTitle ? title : parentTitle;
      const path = this.normalizeRoutePath(route?.path);
      if (!route.groupTitle && path) {
        modules.push({
          title: title || path,
          path,
          category: parentTitle,
          icon: this.getModuleIcon(path)
        });
      }
      modules.push(...this.flattenRouteAccesses(route?.submenu ?? [], category || title || parentTitle));
    }
    const unique = /* @__PURE__ */ new Map();
    for (const module of modules) {
      unique.set(module.path, module);
    }
    return [...unique.values()];
  }
  normalizePermissions(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    const permissions = value.map((permission) => {
      const code = this.readValue(permission, ["ActionCode", "actionCode", "Codigo", "codigo", "code"]);
      const name = this.readValue(permission, [
        "ActionName",
        "actionName",
        "NombreAction",
        "nombreAction",
        "Nombre",
        "nombre",
        "name"
      ]);
      const description = this.readValue(permission, [
        "Description",
        "description",
        "ActionDescription",
        "actionDescription",
        "DescripcionAction",
        "descripcionAction",
        "Descripcion",
        "descripcion"
      ]);
      const displayName = name || description || code;
      const detail = name && description && name !== description ? description : "";
      return code ? { code, name: displayName, description: detail } : null;
    }).filter((permission) => !!permission);
    return [...new Map(permissions.map((permission) => [permission.code, permission])).values()];
  }
  normalizeRoutePath(value) {
    const path = String(value ?? "").trim();
    if (!path || path === "/" || path.toLowerCase().startsWith("javascript:")) {
      return "";
    }
    return path.startsWith("/") ? path : `/${path}`;
  }
  getModuleIcon(path) {
    const normalized = path.toLowerCase();
    if (normalized.includes("dashboard"))
      return "dashboard";
    if (normalized.includes("organization") || normalized.includes("organizacion"))
      return "business";
    if (normalized.includes("employee") || normalized.includes("empleado"))
      return "badge";
    if (normalized.includes("quiz") || normalized.includes("clima"))
      return "groups";
    if (normalized.includes("desempeno"))
      return "workspace_premium";
    if (normalized.includes("email"))
      return "mail_outline";
    if (normalized.includes("secure"))
      return "admin_panel_settings";
    if (normalized.includes("config"))
      return "settings";
    return "apps";
  }
  readValue(source, keys) {
    for (const key of keys) {
      const value = source?.[key];
      if (value !== null && value !== void 0 && String(value).trim()) {
        return String(value).trim();
      }
    }
    return "";
  }
  normalizeSearchText(value) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim();
  }
  static {
    this.\u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(OrganizacionService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], decls: 13, vars: 17, consts: [["noModules", ""], ["noActions", ""], [1, "content"], [1, "content-block", "user-profile-page"], [1, "block-header", "user-profile-page__header"], [3, "title", "items", "active_item"], ["mat-icon-button", "", "type", "button", 1, "profile-refresh", 3, "click", "disabled", "matTooltip"], ["class", "profile-loading", 4, "ngIf"], [4, "ngIf"], [1, "profile-loading"], ["diameter", "42", "mode", "indeterminate"], [1, "profile-identity-band"], [1, "profile-avatar-wrap"], [1, "profile-avatar-fallback"], [1, "profile-avatar", 3, "error", "src", "alt"], [1, "profile-status-dot"], [1, "profile-identity"], [1, "profile-identity__meta"], [1, "profile-role-list"], ["class", "profile-role", 4, "ngFor", "ngForOf"], ["class", "profile-role profile-role--empty", 4, "ngIf"], [1, "profile-account-status"], ["class", "profile-load-warning", 4, "ngIf"], [1, "profile-workspace"], [1, "profile-details-panel"], [1, "profile-section-heading"], [1, "profile-section-heading__icon"], [1, "profile-detail-list"], [1, "profile-security-note"], [1, "profile-access-panel"], [1, "profile-access-toolbar"], [1, "profile-section-heading__icon", "profile-section-heading__icon--access"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "profile-access-search"], ["matPrefix", ""], ["matInput", "", "type", "search", 3, "ngModelChange", "ngModel", "placeholder"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click", 4, "ngIf"], [1, "profile-access-summary"], [1, "profile-access-summary__icon"], [1, "profile-access-summary__icon", "profile-access-summary__icon--actions"], [1, "profile-access-summary__icon", "profile-access-summary__icon--roles"], ["class", "profile-admin-access", 4, "ngIf"], [1, "profile-access-section"], [1, "profile-access-section__heading"], ["class", "profile-module-grid", 4, "ngIf", "ngIfElse"], [1, "profile-access-section", "profile-access-section--actions"], ["class", "profile-action-grid", 4, "ngIf", "ngIfElse"], [1, "profile-role"], [1, "profile-role", "profile-role--empty"], [1, "profile-load-warning"], ["mat-icon-button", "", "matSuffix", "", "type", "button", 3, "click"], [1, "profile-admin-access"], [1, "profile-module-grid"], ["class", "profile-module-item", 3, "routerLink", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "profile-module-item", 3, "routerLink"], [1, "profile-access-empty"], [1, "profile-action-grid"], ["class", "profile-action-item", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "profile-action-item"]], template: function ProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 2)(1, "div", 3)(2, "div", 4);
        \u0275\u0275element(3, "app-breadcrumb", 5);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275pipe(5, "translate");
        \u0275\u0275elementStart(6, "button", 6);
        \u0275\u0275pipe(7, "translate");
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275listener("click", function ProfileComponent_Template_button_click_6_listener() {
          return ctx.loadProfile();
        });
        \u0275\u0275elementStart(9, "mat-icon");
        \u0275\u0275text(10, "refresh");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(11, ProfileComponent_div_11_Template, 5, 3, "div", 7)(12, ProfileComponent_ng_container_12_Template, 189, 98, "ng-container", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", \u0275\u0275pipeBind1(4, 8, "MENUITEMS.PROFILE.PAGE_TITLE"))("items", \u0275\u0275pureFunction0(16, _c0))("active_item", \u0275\u0275pipeBind1(5, 10, "MENUITEMS.PROFILE.BREADCRUMB"));
        \u0275\u0275advance(3);
        \u0275\u0275property("disabled", ctx.loading)("matTooltip", \u0275\u0275pipeBind1(7, 12, "MENUITEMS.PROFILE.REFRESH"));
        \u0275\u0275attribute("aria-label", \u0275\u0275pipeBind1(8, 14, "MENUITEMS.PROFILE.REFRESH"));
        \u0275\u0275advance(5);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
      }
    }, dependencies: [
      CommonModule,
      NgForOf,
      NgIf,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      RouterLink,
      BreadcrumbComponent,
      TranslateModule,
      TranslatePipe,
      MatButtonModule,
      MatIconButton,
      MatFormFieldModule,
      MatFormField,
      MatPrefix,
      MatSuffix,
      MatIconModule,
      MatIcon,
      MatInputModule,
      MatInput,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatTooltipModule,
      MatTooltip
    ], styles: ['\n\n[_nghost-%COMP%] {\n  display: block;\n}\n.user-profile-page[_ngcontent-%COMP%] {\n  padding-bottom: 28px;\n}\n.user-profile-page__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.user-profile-page__header[_ngcontent-%COMP%]   app-breadcrumb[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.profile-refresh[_ngcontent-%COMP%] {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  color: #236b89;\n  border: 1px solid #cbdde6;\n  background: #f2f8fa;\n}\n.profile-loading[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 520px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 12px;\n  color: #71828e;\n  border: 1px solid #dce5ea;\n  border-radius: 7px;\n  background: #fff;\n  font-size: 14px;\n}\n.profile-identity-band[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 76px minmax(240px, 1fr) minmax(250px, 0.8fr) auto;\n  align-items: center;\n  gap: 18px;\n  min-height: 108px;\n  margin-bottom: 12px;\n  padding: 14px 18px;\n  border: 1px solid #dce5ea;\n  border-left: 4px solid #267392;\n  border-radius: 7px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(31, 51, 73, 0.04);\n}\n.profile-avatar-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  width: 68px;\n  height: 68px;\n}\n.profile-avatar[_ngcontent-%COMP%], \n.profile-avatar-fallback[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n}\n.profile-avatar[_ngcontent-%COMP%] {\n  z-index: 2;\n  object-fit: cover;\n  border: 3px solid #fff;\n  box-shadow: 0 0 0 1px #d5e0e6, 0 4px 10px rgba(28, 50, 66, 0.12);\n}\n.profile-avatar-fallback[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  color: #176383;\n  background: #dff0f6;\n  font-size: 18px;\n  font-weight: 800;\n}\n.profile-status-dot[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 1px;\n  bottom: 3px;\n  z-index: 3;\n  width: 13px;\n  height: 13px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: #2d9662;\n}\n.profile-status-dot.inactive[_ngcontent-%COMP%] {\n  background: #c84e5b;\n}\n.profile-identity[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.profile-identity[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.profile-role-list[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.profile-account-status[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #758694;\n  font-size: 12px;\n  line-height: 1.35;\n}\n.profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  overflow: hidden;\n  margin: 2px 0 7px;\n  color: #243744;\n  font-size: 27px;\n  font-weight: 750;\n  letter-spacing: 0;\n  line-height: 1.25;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-identity__meta[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  gap: 6px 14px;\n}\n.profile-identity__meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  min-width: 0;\n  align-items: center;\n  gap: 5px;\n  overflow: hidden;\n  color: #5f7380;\n  font-size: 13px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-identity__meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  color: #4f788a;\n  font-size: 15px;\n}\n.profile-role-list[_ngcontent-%COMP%] {\n  min-width: 0;\n  padding: 0 18px;\n  border-right: 1px solid #e2e9ed;\n  border-left: 1px solid #e2e9ed;\n}\n.profile-role-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  margin-top: 5px;\n  flex-wrap: wrap;\n  gap: 5px;\n}\n.profile-role[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 7px;\n  color: #5f4980;\n  border: 1px solid #dfd3e9;\n  border-radius: 5px;\n  background: #f5f1f8;\n  font-size: 12px;\n  font-weight: 700;\n}\n.profile-role[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.profile-role--empty[_ngcontent-%COMP%] {\n  color: #75838d;\n  border-color: #d9e1e5;\n  background: #f6f8f9;\n}\n.profile-account-status[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 138px;\n  align-items: center;\n  gap: 8px;\n  padding: 9px 11px;\n  color: #26744d;\n  border: 1px solid #cbe5d5;\n  border-radius: 6px;\n  background: #edf8f1;\n}\n.profile-account-status.inactive[_ngcontent-%COMP%] {\n  color: #a43b48;\n  border-color: #edc9ce;\n  background: #fff1f3;\n}\n.profile-account-status[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.profile-account-status[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profile-account-status[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.profile-load-warning[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 12px;\n  padding: 9px 12px;\n  color: #765719;\n  border: 1px solid #ead6a2;\n  border-radius: 6px;\n  background: #fff9e9;\n  font-size: 13px;\n}\n.profile-load-warning[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-workspace[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(290px, 340px) minmax(0, 1fr);\n  align-items: start;\n  gap: 12px;\n}\n.profile-details-panel[_ngcontent-%COMP%], \n.profile-access-panel[_ngcontent-%COMP%] {\n  overflow: hidden;\n  border: 1px solid #dce5ea;\n  border-radius: 7px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(31, 51, 73, 0.04);\n}\n.profile-details-panel[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 76px;\n}\n.profile-section-heading[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 9px;\n}\n.profile-section-heading__icon[_ngcontent-%COMP%] {\n  display: inline-grid;\n  flex: 0 0 34px;\n  width: 34px;\n  height: 34px;\n  place-items: center;\n  color: #246d8b;\n  border-radius: 6px;\n  background: #e8f3f7;\n}\n.profile-section-heading__icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.profile-section-heading__icon--access[_ngcontent-%COMP%] {\n  color: #69508a;\n  background: #f0eaf5;\n}\n.profile-section-heading[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-section-heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #2b3c49;\n  font-size: 15px;\n}\n.profile-section-heading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #778693;\n  font-size: 12px;\n  line-height: 1.4;\n}\n.profile-details-panel[_ngcontent-%COMP%]    > .profile-section-heading[_ngcontent-%COMP%] {\n  min-height: 64px;\n  padding: 11px 14px;\n  border-bottom: 1px solid #e2e9ed;\n  background: #f7f9fa;\n}\n.profile-detail-list[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 4px 14px;\n}\n.profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  padding: 11px 0;\n  border-bottom: 1px solid #e7ecef;\n}\n.profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 3px;\n  color: #768691;\n  font-size: 12px;\n  font-weight: 500;\n}\n.profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  color: #628092;\n  font-size: 15px;\n}\n.profile-detail-list[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n  margin: 0 0 0 21px;\n  color: #334754;\n  font-size: 14px;\n  font-weight: 650;\n  line-height: 1.4;\n}\n.profile-security-note[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  margin: 7px 14px 14px;\n  padding: 10px;\n  color: #526b79;\n  border-left: 3px solid #efa04a;\n  background: #fff8ef;\n}\n.profile-security-note[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  color: #b8732c;\n  font-size: 18px;\n}\n.profile-security-note[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profile-security-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #465c69;\n  font-size: 13px;\n}\n.profile-security-note[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  margin-top: 2px;\n  font-size: 12px;\n  line-height: 1.45;\n}\n.profile-access-panel[_ngcontent-%COMP%] {\n  padding-bottom: 15px;\n}\n.profile-access-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 72px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  padding: 11px 15px;\n  border-bottom: 1px solid #e2e9ed;\n  background: #f7f9fa;\n}\n.profile-access-search[_ngcontent-%COMP%] {\n  flex: 0 1 340px;\n  width: 100%;\n}\n.profile-access-search[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper, \n.profile-access-search[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  min-height: 44px;\n}\n.profile-access-search[_ngcontent-%COMP%]     .mat-mdc-form-field-flex {\n  align-items: center;\n}\n.profile-access-search[_ngcontent-%COMP%]     .mat-mdc-form-field-icon-prefix {\n  display: inline-flex;\n  padding: 0 7px 0 0;\n  color: #687d8a;\n}\n.profile-access-search[_ngcontent-%COMP%]     .mat-mdc-form-field-icon-prefix mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-access-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n.profile-access-summary[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  margin: 0 15px;\n  padding: 13px 0;\n  border-bottom: 1px solid #e4eaee;\n}\n.profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  border-right: 1px solid #e2e8ec;\n}\n.profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:last-child {\n  border-right: 0;\n}\n.profile-access-summary__icon[_ngcontent-%COMP%] {\n  display: inline-grid;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: #216d8c;\n  border-radius: 6px;\n  background: #e6f3f8;\n}\n.profile-access-summary__icon--actions[_ngcontent-%COMP%] {\n  color: #23734c;\n  background: #e8f6ee;\n}\n.profile-access-summary__icon--roles[_ngcontent-%COMP%] {\n  color: #705192;\n  background: #f1eaf6;\n}\n.profile-access-summary__icon[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 19px;\n}\n.profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  display: flex;\n  margin: 0;\n  flex-direction: column;\n}\n.profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #293b48;\n  font-size: 18px;\n  line-height: 1.1;\n}\n.profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #778691;\n  font-size: 12px;\n}\n.profile-admin-access[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin: 13px 15px 0;\n  padding: 9px 11px;\n  color: #5c477a;\n  border: 1px solid #dfd3e9;\n  border-radius: 6px;\n  background: #f7f3fa;\n}\n.profile-admin-access[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.profile-admin-access[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profile-admin-access[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.profile-admin-access[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  line-height: 1.4;\n}\n.profile-access-section[_ngcontent-%COMP%] {\n  padding: 15px 15px 0;\n}\n.profile-access-section--actions[_ngcontent-%COMP%] {\n  margin-top: 15px;\n  padding-top: 15px;\n  border-top: 1px solid #e4eaee;\n}\n.profile-access-section__heading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.profile-access-section__heading[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n}\n.profile-access-section__heading[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  color: #587989;\n  font-size: 18px;\n}\n.profile-access-section__heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #30434f;\n  font-size: 14px;\n}\n.profile-access-section__heading[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  min-width: 25px;\n  height: 22px;\n  place-items: center;\n  padding: 0 6px;\n  color: #526e7e;\n  border-radius: 5px;\n  background: #edf2f5;\n  font-size: 12px;\n  font-weight: 700;\n}\n.profile-module-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n}\n.profile-module-item[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  min-height: 76px;\n  grid-template-columns: 32px minmax(0, 1fr) 18px;\n  align-items: center;\n  gap: 8px;\n  padding: 9px 10px;\n  color: inherit;\n  border: 1px solid #dce5ea;\n  border-radius: 6px;\n  background: #fff;\n  text-decoration: none;\n  transition:\n    border-color 150ms ease,\n    background-color 150ms ease,\n    transform 150ms ease;\n}\n.profile-module-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: #a9c9d6;\n  background: #f5fafc;\n}\n.profile-module-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: #26718f;\n  border-radius: 6px;\n  background: #e8f3f7;\n}\n.profile-module-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-module-item[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #334753;\n  font-size: 13px;\n}\n.profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-top: 2px;\n  color: #7b8993;\n  font-size: 11px;\n}\n.profile-module-item[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  color: #85939d;\n  font-size: 18px;\n}\n.profile-action-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 7px;\n}\n.profile-action-item[_ngcontent-%COMP%] {\n  display: grid;\n  min-width: 0;\n  min-height: 84px;\n  grid-template-columns: 25px minmax(0, 1fr);\n  align-items: center;\n  gap: 8px;\n  padding: 8px 9px;\n  border: 1px solid #e0e7eb;\n  border-radius: 6px;\n  background: #fbfcfd;\n}\n.profile-action-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: inline-grid;\n  width: 24px;\n  height: 24px;\n  place-items: center;\n  color: #24744d;\n  border-radius: 50%;\n  background: #e7f5ed;\n}\n.profile-action-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.profile-action-item[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-action-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  overflow: hidden;\n  color: #3b4e59;\n  font-size: 13px;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-action-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  display: -webkit-box;\n  overflow: hidden;\n  margin-top: 2px;\n  color: #667984;\n  font-size: 11px;\n  line-height: 1.4;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.profile-action-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  overflow: hidden;\n  margin-top: 2px;\n  color: #798893;\n  font-size: 11px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-access-empty[_ngcontent-%COMP%] {\n  display: flex;\n  min-height: 90px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 6px;\n  padding: 15px;\n  color: #7a8994;\n  border: 1px dashed #d3dee4;\n  border-radius: 6px;\n  background: #fafcfd;\n  text-align: center;\n  font-size: 13px;\n}\n.profile-access-empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #668494;\n}\n.light[_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%] {\n  color: #c66718;\n  border-color: #f1c99e;\n  border-radius: 6px;\n  background: #fff4e7;\n}\n.light[_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%]:hover:not(:disabled), .light   [_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%]:hover:not(:disabled) {\n  color: #9f5010;\n  border-color: #edaf73;\n  background: #ffead3;\n}\n.light[_nghost-%COMP%]   .profile-loading[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-loading[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-panel[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-panel[_ngcontent-%COMP%] {\n  border-color: #eadfce;\n  border-radius: 8px;\n  background: #fffdf9;\n  box-shadow: 0 8px 22px rgba(18, 43, 61, 0.05);\n}\n.light[_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  border: 1px solid #112d40;\n  border-left: 4px solid #f58b2a;\n  border-radius: 8px;\n  background: #112d40;\n  box-shadow: 0 10px 24px rgba(18, 43, 61, 0.12);\n}\n.light[_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%]::after, .light   [_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%]::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 112px;\n  height: 3px;\n  content: "";\n  background: #f58b2a;\n}\n.light[_nghost-%COMP%]   .profile-avatar[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-avatar[_ngcontent-%COMP%] {\n  border-color: #fffaf4;\n  box-shadow: 0 0 0 2px #f58b2a, 0 6px 15px rgba(0, 0, 0, 0.2);\n}\n.light[_nghost-%COMP%]   .profile-avatar-fallback[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-avatar-fallback[_ngcontent-%COMP%] {\n  color: #112d40;\n  background: #ffe1bc;\n}\n.light[_nghost-%COMP%]   .profile-status-dot[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-status-dot[_ngcontent-%COMP%] {\n  border-color: #112d40;\n}\n.light[_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #c9d4db;\n}\n.light[_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #fffdf9;\n}\n.light[_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #d7e0e5;\n}\n.light[_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%] {\n  border-color: rgba(238, 225, 207, 0.24);\n}\n.light[_nghost-%COMP%]   .profile-role[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-role[_ngcontent-%COMP%] {\n  color: #ffe0ba;\n  border-color: rgba(251, 183, 107, 0.48);\n  border-radius: 5px;\n  background: rgba(245, 139, 42, 0.15);\n}\n.light[_nghost-%COMP%]   .profile-role--empty[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-role--empty[_ngcontent-%COMP%] {\n  color: #d7e0e5;\n  border-color: rgba(225, 233, 237, 0.25);\n  background: rgba(255, 255, 255, 0.08);\n}\n.light[_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%] {\n  color: #d5f4df;\n  border-color: rgba(134, 216, 165, 0.42);\n  border-radius: 6px;\n  background: rgba(46, 142, 96, 0.22);\n}\n.light[_nghost-%COMP%]   .profile-account-status.inactive[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-account-status.inactive[_ngcontent-%COMP%] {\n  color: #ffd3d6;\n  border-color: rgba(239, 145, 154, 0.45);\n  background: rgba(159, 53, 63, 0.24);\n}\n.light[_nghost-%COMP%]   .profile-load-warning[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-load-warning[_ngcontent-%COMP%] {\n  color: #855016;\n  border-color: #f2d2a8;\n  border-radius: 6px;\n  background: #fff7e9;\n}\n.light[_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%]    > .profile-section-heading[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%]    > .profile-section-heading[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-toolbar[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-toolbar[_ngcontent-%COMP%] {\n  border-color: #efe2d1;\n  background: #fff7ee;\n}\n.light[_nghost-%COMP%]   .profile-section-heading__icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-section-heading__icon[_ngcontent-%COMP%] {\n  color: #bf6118;\n  border-radius: 6px;\n  background: #ffe6c9;\n}\n.light[_nghost-%COMP%]   .profile-section-heading__icon--access[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-section-heading__icon--access[_ngcontent-%COMP%] {\n  color: #1c617e;\n  background: #e5f1f5;\n}\n.light[_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #17354a;\n}\n.light[_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%] {\n  color: #6d7c86;\n}\n.light[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-section--actions[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-section--actions[_ngcontent-%COMP%] {\n  border-color: #eee2d3;\n}\n.light[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #c9691c;\n}\n.light[_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%] {\n  color: #6e572f;\n  border-left-color: #f58b2a;\n  background: #fff5e6;\n}\n.light[_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  color: #d7731a;\n}\n.light[_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #574326;\n}\n.light[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper, .light   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mat-mdc-text-field-wrapper {\n  background: #fffdf9;\n}\n.light[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__leading, .light   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__leading, \n.light[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__notch, .light   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__notch, \n.light[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__trailing, .light   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-notched-outline__trailing {\n  border-color: #dfcfbb;\n}\n.light[_nghost-%COMP%]   .profile-access-summary__icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary__icon[_ngcontent-%COMP%] {\n  color: #c9691c;\n  border-radius: 6px;\n  background: #ffe7ca;\n}\n.light[_nghost-%COMP%]   .profile-access-summary__icon--actions[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary__icon--actions[_ngcontent-%COMP%] {\n  color: #25714e;\n  background: #e5f5ea;\n}\n.light[_nghost-%COMP%]   .profile-access-summary__icon--roles[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-summary__icon--roles[_ngcontent-%COMP%] {\n  color: #1d617d;\n  background: #e5f1f5;\n}\n.light[_nghost-%COMP%]   .profile-admin-access[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-admin-access[_ngcontent-%COMP%] {\n  color: #1d617d;\n  border-color: #c9dfe8;\n  border-radius: 6px;\n  background: #eef7fa;\n}\n.light[_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #9d5315;\n  border-radius: 5px;\n  background: #fff0df;\n}\n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%], \n.light[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%] {\n  border-color: #eadfce;\n  border-radius: 7px;\n  background: #fffdf9;\n}\n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]:hover, .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]:hover {\n  border-color: #efba83;\n  background: #fff6eb;\n}\n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #c9691c;\n  border-radius: 6px;\n  background: #ffe7ca;\n}\n.light[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]    > mat-icon[_ngcontent-%COMP%] {\n  color: #c47737;\n}\n.light[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #28714f;\n  background: #e6f5eb;\n}\n.light[_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%] {\n  border-color: #ead8c2;\n  border-radius: 7px;\n  background: #fffaf3;\n}\n.light[_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: #cc762b;\n}\n.dark[_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-loading[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-loading[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-identity-band[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-panel[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-panel[_ngcontent-%COMP%] {\n  border-color: #3b4858;\n  background: #202733;\n}\n.dark[_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-refresh[_ngcontent-%COMP%] {\n  color: #8ec5da;\n  background: #263441;\n}\n.dark[_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #e2e8f0;\n}\n.dark[_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-identity[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-account-status[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-identity__meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-section-heading[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]   dt[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   small[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%]   code[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%] {\n  color: #9aabbb;\n}\n.dark[_nghost-%COMP%]   .profile-avatar[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-avatar[_ngcontent-%COMP%] {\n  border-color: #202733;\n  box-shadow: 0 0 0 1px #4a5968;\n}\n.dark[_nghost-%COMP%]   .profile-status-dot[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-status-dot[_ngcontent-%COMP%] {\n  border-color: #202733;\n}\n.dark[_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-summary[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-detail-list[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-section--actions[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-section--actions[_ngcontent-%COMP%] {\n  border-color: #3b4857;\n}\n.dark[_nghost-%COMP%]   .profile-role[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-role[_ngcontent-%COMP%] {\n  color: #cfbce1;\n  border-color: #564765;\n  background: #332b3d;\n}\n.dark[_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%]    > .profile-section-heading[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-details-panel[_ngcontent-%COMP%]    > .profile-section-heading[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-toolbar[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-toolbar[_ngcontent-%COMP%] {\n  border-color: #3b4857;\n  background: #252e39;\n}\n.dark[_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%] {\n  color: #c1b59d;\n  background: #342f25;\n}\n.dark[_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-security-note[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #e0d4bb;\n}\n.dark[_nghost-%COMP%]   .profile-admin-access[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-admin-access[_ngcontent-%COMP%] {\n  color: #cdb9df;\n  border-color: #574865;\n  background: #332b3d;\n}\n.dark[_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-section__heading[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #a9bbc7;\n  background: #2b3743;\n}\n.dark[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-action-item[_ngcontent-%COMP%], \n.dark[_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%], .dark   [_nghost-%COMP%]   .profile-access-empty[_ngcontent-%COMP%] {\n  border-color: #3b4857;\n  background: #252e39;\n}\n.dark[_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]:hover, .dark   [_nghost-%COMP%]   .profile-module-item[_ngcontent-%COMP%]:hover {\n  border-color: #55788a;\n  background: #293946;\n}\n.dark[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-text-field__input, .dark   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-text-field__input, \n.dark[_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-floating-label, .dark   [_nghost-%COMP%]   .profile-access-search[_ngcontent-%COMP%]     .mdc-floating-label {\n  color: #d9e2ea;\n}\n@media (max-width: 1200px) {\n  .profile-identity-band[_ngcontent-%COMP%] {\n    grid-template-columns: 76px minmax(230px, 1fr) minmax(220px, 0.8fr);\n  }\n  .profile-account-status[_ngcontent-%COMP%] {\n    grid-column: 2/-1;\n    width: fit-content;\n  }\n  .profile-module-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 900px) {\n  .light[_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%], .light   [_nghost-%COMP%]   .profile-role-list[_ngcontent-%COMP%] {\n    border-color: rgba(238, 225, 207, 0.24);\n  }\n  .profile-identity-band[_ngcontent-%COMP%] {\n    grid-template-columns: 76px minmax(0, 1fr);\n  }\n  .profile-role-list[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n    padding: 11px 0 0;\n    border-top: 1px solid #e2e9ed;\n    border-right: 0;\n    border-left: 0;\n  }\n  .profile-account-status[_ngcontent-%COMP%] {\n    grid-column: 1/-1;\n  }\n  .profile-workspace[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .profile-details-panel[_ngcontent-%COMP%] {\n    position: static;\n  }\n  .profile-detail-list[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    column-gap: 22px;\n  }\n}\n@media (max-width: 650px) {\n  .user-profile-page__header[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n  .profile-identity-band[_ngcontent-%COMP%] {\n    grid-template-columns: 60px minmax(0, 1fr);\n    gap: 12px;\n    padding: 13px;\n  }\n  .profile-avatar-wrap[_ngcontent-%COMP%], \n   .profile-avatar[_ngcontent-%COMP%], \n   .profile-avatar-fallback[_ngcontent-%COMP%] {\n    width: 56px;\n    height: 56px;\n  }\n  .profile-identity[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 23px;\n  }\n  .profile-identity__meta[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 4px;\n  }\n  .profile-access-toolbar[_ngcontent-%COMP%] {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 10px;\n  }\n  .profile-access-search[_ngcontent-%COMP%] {\n    flex-basis: auto;\n  }\n  .profile-detail-list[_ngcontent-%COMP%], \n   .profile-module-grid[_ngcontent-%COMP%], \n   .profile-action-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .profile-access-summary[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    gap: 5px;\n  }\n  .profile-access-summary__icon[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n    flex-basis: 28px;\n  }\n  .profile-access-summary[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n    font-size: 17px;\n  }\n}\n/*# sourceMappingURL=profile.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ selector: "app-profile", standalone: true, imports: [
      CommonModule,
      FormsModule,
      RouterLink,
      BreadcrumbComponent,
      TranslateModule,
      MatButtonModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatTooltipModule
    ], template: `<section class="content">
  <div class="content-block user-profile-page">
    <div class="block-header user-profile-page__header">
      <app-breadcrumb
        [title]="'MENUITEMS.PROFILE.PAGE_TITLE' | translate"
        [items]="['Home']"
        [active_item]="'MENUITEMS.PROFILE.BREADCRUMB' | translate">
      </app-breadcrumb>

      <button
        mat-icon-button
        type="button"
        class="profile-refresh"
        [disabled]="loading"
        (click)="loadProfile()"
        [matTooltip]="'MENUITEMS.PROFILE.REFRESH' | translate"
        [attr.aria-label]="'MENUITEMS.PROFILE.REFRESH' | translate">
        <mat-icon>refresh</mat-icon>
      </button>
    </div>

    <div class="profile-loading" *ngIf="loading">
      <mat-progress-spinner diameter="42" mode="indeterminate"></mat-progress-spinner>
      <span>{{ 'MENUITEMS.PROFILE.LOADING' | translate }}</span>
    </div>

    <ng-container *ngIf="!loading">
      <section class="profile-identity-band">
        <div class="profile-avatar-wrap">
          <span class="profile-avatar-fallback">{{ profileInitials }}</span>
          <img
            class="profile-avatar"
            [src]="profileImageUrl"
            [alt]="displayName"
            (error)="onProfileImageError($event)">
          <span class="profile-status-dot" [class.inactive]="!isActive"></span>
        </div>

        <div class="profile-identity">
          <span>{{ 'MENUITEMS.PROFILE.ACCOUNT' | translate }}</span>
          <h1>{{ displayName }}</h1>
          <div class="profile-identity__meta">
            <span><mat-icon>alternate_email</mat-icon>{{ username }}</span>
            <span><mat-icon>business</mat-icon>{{ organizationName }}</span>
          </div>
        </div>

        <div class="profile-role-list">
          <span>{{ 'MENUITEMS.PROFILE.ASSIGNED_ROLES' | translate }}</span>
          <div>
            <span class="profile-role" *ngFor="let role of roleNames">
              <mat-icon>verified_user</mat-icon>{{ role }}
            </span>
            <span class="profile-role profile-role--empty" *ngIf="roleNames.length === 0">
              {{ 'MENUITEMS.PROFILE.NO_ROLE' | translate }}
            </span>
          </div>
        </div>

        <div class="profile-account-status" [class.inactive]="!isActive">
          <mat-icon>{{ isActive ? 'check_circle' : 'block' }}</mat-icon>
          <div>
            <span>{{ 'MENUITEMS.PROFILE.ACCOUNT_STATUS' | translate }}</span>
            <strong>{{ (isActive ? 'MENUITEMS.PROFILE.ACTIVE' : 'MENUITEMS.PROFILE.INACTIVE') | translate }}</strong>
          </div>
        </div>
      </section>

      <div class="profile-load-warning" *ngIf="loadError">
        <mat-icon>info_outline</mat-icon>
        <span>{{ 'MENUITEMS.PROFILE.PARTIAL_DATA' | translate }}</span>
      </div>

      <div class="profile-workspace">
        <aside class="profile-details-panel">
          <div class="profile-section-heading">
            <span class="profile-section-heading__icon"><mat-icon>person</mat-icon></span>
            <div>
              <strong>{{ 'MENUITEMS.PROFILE.BASIC_INFO' | translate }}</strong>
              <span>{{ 'MENUITEMS.PROFILE.BASIC_INFO_SUBTITLE' | translate }}</span>
            </div>
          </div>

          <dl class="profile-detail-list">
            <div>
              <dt><mat-icon>badge</mat-icon>{{ 'MENUITEMS.PROFILE.USERNAME' | translate }}</dt>
              <dd>{{ username }}</dd>
            </div>
            <div>
              <dt><mat-icon>mail_outline</mat-icon>{{ 'MENUITEMS.PROFILE.EMAIL' | translate }}</dt>
              <dd>{{ email }}</dd>
            </div>
            <div>
              <dt><mat-icon>phone</mat-icon>{{ 'MENUITEMS.PROFILE.PHONE' | translate }}</dt>
              <dd>{{ phone }}</dd>
            </div>
            <div>
              <dt><mat-icon>work_outline</mat-icon>{{ 'MENUITEMS.PROFILE.POSITION' | translate }}</dt>
              <dd>{{ position }}</dd>
            </div>
            <div>
              <dt><mat-icon>location_city</mat-icon>{{ 'MENUITEMS.PROFILE.CITY' | translate }}</dt>
              <dd>{{ city }}</dd>
            </div>
            <div>
              <dt><mat-icon>apartment</mat-icon>{{ 'MENUITEMS.PROFILE.ORGANIZATION' | translate }}</dt>
              <dd>{{ organizationName }}</dd>
            </div>
          </dl>

          <div class="profile-security-note">
            <mat-icon>lock_outline</mat-icon>
            <div>
              <strong>{{ 'MENUITEMS.PROFILE.SECURITY_TITLE' | translate }}</strong>
              <span>{{ 'MENUITEMS.PROFILE.SECURITY_TEXT' | translate }}</span>
            </div>
          </div>
        </aside>

        <main class="profile-access-panel">
          <div class="profile-access-toolbar">
            <div class="profile-section-heading">
              <span class="profile-section-heading__icon profile-section-heading__icon--access">
                <mat-icon>shield</mat-icon>
              </span>
              <div>
                <strong>{{ 'MENUITEMS.PROFILE.ACCESS_TITLE' | translate }}</strong>
                <span>{{ 'MENUITEMS.PROFILE.ACCESS_SUBTITLE' | translate }}</span>
              </div>
            </div>

            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="profile-access-search">
              <mat-icon matPrefix>search</mat-icon>
              <input
                matInput
                type="search"
                [(ngModel)]="accessSearch"
                [placeholder]="'MENUITEMS.PROFILE.SEARCH_ACCESS_PLACEHOLDER' | translate">
              <button
                *ngIf="accessSearch"
                mat-icon-button
                matSuffix
                type="button"
                (click)="accessSearch = ''"
                [attr.aria-label]="'MENUITEMS.PROFILE.CLEAR_SEARCH' | translate">
                <mat-icon>close</mat-icon>
              </button>
            </mat-form-field>
          </div>

          <div class="profile-access-summary">
            <div>
              <span class="profile-access-summary__icon"><mat-icon>apps</mat-icon></span>
              <p><strong>{{ moduleAccesses.length }}</strong><span>{{ 'MENUITEMS.PROFILE.MODULES' | translate }}</span></p>
            </div>
            <div>
              <span class="profile-access-summary__icon profile-access-summary__icon--actions"><mat-icon>rule</mat-icon></span>
              <p><strong>{{ actionAccesses.length }}</strong><span>{{ 'MENUITEMS.PROFILE.ACTIONS' | translate }}</span></p>
            </div>
            <div>
              <span class="profile-access-summary__icon profile-access-summary__icon--roles"><mat-icon>admin_panel_settings</mat-icon></span>
              <p><strong>{{ roleNames.length }}</strong><span>{{ 'MENUITEMS.PROFILE.ROLES' | translate }}</span></p>
            </div>
          </div>

          <div class="profile-admin-access" *ngIf="isAdministrator">
            <mat-icon>verified</mat-icon>
            <div>
              <strong>{{ 'MENUITEMS.PROFILE.ADMIN_ACCESS_TITLE' | translate }}</strong>
              <span>{{ 'MENUITEMS.PROFILE.ADMIN_ACCESS_TEXT' | translate }}</span>
            </div>
          </div>

          <section class="profile-access-section">
            <div class="profile-access-section__heading">
              <div>
                <mat-icon>grid_view</mat-icon>
                <strong>{{ 'MENUITEMS.PROFILE.AVAILABLE_MODULES' | translate }}</strong>
              </div>
              <span>{{ filteredModules.length }}</span>
            </div>

            <div class="profile-module-grid" *ngIf="filteredModules.length; else noModules">
              <a
                *ngFor="let module of filteredModules; trackBy: trackModule"
                class="profile-module-item"
                [routerLink]="module.path">
                <span><mat-icon>{{ module.icon }}</mat-icon></span>
                <div>
                  <strong>{{ module.title | translate }}</strong>
                  <small *ngIf="module.category">{{ module.category | translate }}</small>
                </div>
                <mat-icon>chevron_right</mat-icon>
              </a>
            </div>

            <ng-template #noModules>
              <div class="profile-access-empty">
                <mat-icon>apps_outage</mat-icon>
                <span>{{ 'MENUITEMS.PROFILE.NO_MODULES' | translate }}</span>
              </div>
            </ng-template>
          </section>

          <section class="profile-access-section profile-access-section--actions">
            <div class="profile-access-section__heading">
              <div>
                <mat-icon>task_alt</mat-icon>
                <strong>{{ 'MENUITEMS.PROFILE.ACTION_PERMISSIONS' | translate }}</strong>
              </div>
              <span>{{ filteredActions.length }}</span>
            </div>

            <div class="profile-action-grid" *ngIf="filteredActions.length; else noActions">
              <div
                *ngFor="let action of filteredActions; trackBy: trackAction"
                class="profile-action-item">
                <span><mat-icon>check</mat-icon></span>
                <div>
                  <strong>{{ action.name | translate }}</strong>
                  <small *ngIf="action.description">{{ action.description | translate }}</small>
                  <code>{{ action.code }}</code>
                </div>
              </div>
            </div>

            <ng-template #noActions>
              <div class="profile-access-empty">
                <mat-icon>{{ isAdministrator ? 'verified_user' : 'rule_folder' }}</mat-icon>
                <span>
                  {{ (isAdministrator ? 'MENUITEMS.PROFILE.ADMIN_ACTIONS' : 'MENUITEMS.PROFILE.NO_ACTIONS') | translate }}
                </span>
              </div>
            </ng-template>
          </section>
        </main>
      </div>
    </ng-container>
  </div>
</section>
`, styles: ['/* src/app/profile/profile.component.scss */\n:host {\n  display: block;\n}\n.user-profile-page {\n  padding-bottom: 28px;\n}\n.user-profile-page__header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.user-profile-page__header app-breadcrumb {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.profile-refresh {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  color: #236b89;\n  border: 1px solid #cbdde6;\n  background: #f2f8fa;\n}\n.profile-loading {\n  display: flex;\n  min-height: 520px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 12px;\n  color: #71828e;\n  border: 1px solid #dce5ea;\n  border-radius: 7px;\n  background: #fff;\n  font-size: 14px;\n}\n.profile-identity-band {\n  display: grid;\n  grid-template-columns: 76px minmax(240px, 1fr) minmax(250px, 0.8fr) auto;\n  align-items: center;\n  gap: 18px;\n  min-height: 108px;\n  margin-bottom: 12px;\n  padding: 14px 18px;\n  border: 1px solid #dce5ea;\n  border-left: 4px solid #267392;\n  border-radius: 7px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(31, 51, 73, 0.04);\n}\n.profile-avatar-wrap {\n  position: relative;\n  width: 68px;\n  height: 68px;\n}\n.profile-avatar,\n.profile-avatar-fallback {\n  position: absolute;\n  inset: 0;\n  width: 68px;\n  height: 68px;\n  border-radius: 50%;\n}\n.profile-avatar {\n  z-index: 2;\n  object-fit: cover;\n  border: 3px solid #fff;\n  box-shadow: 0 0 0 1px #d5e0e6, 0 4px 10px rgba(28, 50, 66, 0.12);\n}\n.profile-avatar-fallback {\n  display: grid;\n  place-items: center;\n  color: #176383;\n  background: #dff0f6;\n  font-size: 18px;\n  font-weight: 800;\n}\n.profile-status-dot {\n  position: absolute;\n  right: 1px;\n  bottom: 3px;\n  z-index: 3;\n  width: 13px;\n  height: 13px;\n  border: 2px solid #fff;\n  border-radius: 50%;\n  background: #2d9662;\n}\n.profile-status-dot.inactive {\n  background: #c84e5b;\n}\n.profile-identity {\n  min-width: 0;\n}\n.profile-identity > span,\n.profile-role-list > span,\n.profile-account-status span {\n  color: #758694;\n  font-size: 12px;\n  line-height: 1.35;\n}\n.profile-identity h1 {\n  overflow: hidden;\n  margin: 2px 0 7px;\n  color: #243744;\n  font-size: 27px;\n  font-weight: 750;\n  letter-spacing: 0;\n  line-height: 1.25;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-identity__meta {\n  display: flex;\n  min-width: 0;\n  flex-wrap: wrap;\n  gap: 6px 14px;\n}\n.profile-identity__meta span {\n  display: inline-flex;\n  min-width: 0;\n  align-items: center;\n  gap: 5px;\n  overflow: hidden;\n  color: #5f7380;\n  font-size: 13px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-identity__meta mat-icon {\n  width: 15px;\n  height: 15px;\n  color: #4f788a;\n  font-size: 15px;\n}\n.profile-role-list {\n  min-width: 0;\n  padding: 0 18px;\n  border-right: 1px solid #e2e9ed;\n  border-left: 1px solid #e2e9ed;\n}\n.profile-role-list > div {\n  display: flex;\n  margin-top: 5px;\n  flex-wrap: wrap;\n  gap: 5px;\n}\n.profile-role {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  padding: 4px 7px;\n  color: #5f4980;\n  border: 1px solid #dfd3e9;\n  border-radius: 5px;\n  background: #f5f1f8;\n  font-size: 12px;\n  font-weight: 700;\n}\n.profile-role mat-icon {\n  width: 14px;\n  height: 14px;\n  font-size: 14px;\n}\n.profile-role--empty {\n  color: #75838d;\n  border-color: #d9e1e5;\n  background: #f6f8f9;\n}\n.profile-account-status {\n  display: flex;\n  min-width: 138px;\n  align-items: center;\n  gap: 8px;\n  padding: 9px 11px;\n  color: #26744d;\n  border: 1px solid #cbe5d5;\n  border-radius: 6px;\n  background: #edf8f1;\n}\n.profile-account-status.inactive {\n  color: #a43b48;\n  border-color: #edc9ce;\n  background: #fff1f3;\n}\n.profile-account-status > mat-icon {\n  width: 21px;\n  height: 21px;\n  font-size: 21px;\n}\n.profile-account-status > div {\n  display: flex;\n  flex-direction: column;\n}\n.profile-account-status strong {\n  font-size: 13px;\n}\n.profile-load-warning {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 12px;\n  padding: 9px 12px;\n  color: #765719;\n  border: 1px solid #ead6a2;\n  border-radius: 6px;\n  background: #fff9e9;\n  font-size: 13px;\n}\n.profile-load-warning mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-workspace {\n  display: grid;\n  grid-template-columns: minmax(290px, 340px) minmax(0, 1fr);\n  align-items: start;\n  gap: 12px;\n}\n.profile-details-panel,\n.profile-access-panel {\n  overflow: hidden;\n  border: 1px solid #dce5ea;\n  border-radius: 7px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(31, 51, 73, 0.04);\n}\n.profile-details-panel {\n  position: sticky;\n  top: 76px;\n}\n.profile-section-heading {\n  display: flex;\n  min-width: 0;\n  align-items: center;\n  gap: 9px;\n}\n.profile-section-heading__icon {\n  display: inline-grid;\n  flex: 0 0 34px;\n  width: 34px;\n  height: 34px;\n  place-items: center;\n  color: #246d8b;\n  border-radius: 6px;\n  background: #e8f3f7;\n}\n.profile-section-heading__icon mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.profile-section-heading__icon--access {\n  color: #69508a;\n  background: #f0eaf5;\n}\n.profile-section-heading > div {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-section-heading strong {\n  color: #2b3c49;\n  font-size: 15px;\n}\n.profile-section-heading span {\n  color: #778693;\n  font-size: 12px;\n  line-height: 1.4;\n}\n.profile-details-panel > .profile-section-heading {\n  min-height: 64px;\n  padding: 11px 14px;\n  border-bottom: 1px solid #e2e9ed;\n  background: #f7f9fa;\n}\n.profile-detail-list {\n  margin: 0;\n  padding: 4px 14px;\n}\n.profile-detail-list > div {\n  padding: 11px 0;\n  border-bottom: 1px solid #e7ecef;\n}\n.profile-detail-list > div:last-child {\n  border-bottom: 0;\n}\n.profile-detail-list dt {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-bottom: 3px;\n  color: #768691;\n  font-size: 12px;\n  font-weight: 500;\n}\n.profile-detail-list dt mat-icon {\n  width: 15px;\n  height: 15px;\n  color: #628092;\n  font-size: 15px;\n}\n.profile-detail-list dd {\n  overflow-wrap: anywhere;\n  margin: 0 0 0 21px;\n  color: #334754;\n  font-size: 14px;\n  font-weight: 650;\n  line-height: 1.4;\n}\n.profile-security-note {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  margin: 7px 14px 14px;\n  padding: 10px;\n  color: #526b79;\n  border-left: 3px solid #efa04a;\n  background: #fff8ef;\n}\n.profile-security-note > mat-icon {\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  color: #b8732c;\n  font-size: 18px;\n}\n.profile-security-note > div {\n  display: flex;\n  flex-direction: column;\n}\n.profile-security-note strong {\n  color: #465c69;\n  font-size: 13px;\n}\n.profile-security-note span {\n  margin-top: 2px;\n  font-size: 12px;\n  line-height: 1.45;\n}\n.profile-access-panel {\n  padding-bottom: 15px;\n}\n.profile-access-toolbar {\n  display: flex;\n  min-height: 72px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n  padding: 11px 15px;\n  border-bottom: 1px solid #e2e9ed;\n  background: #f7f9fa;\n}\n.profile-access-search {\n  flex: 0 1 340px;\n  width: 100%;\n}\n.profile-access-search ::ng-deep .mat-mdc-text-field-wrapper,\n.profile-access-search ::ng-deep .mat-mdc-form-field-flex {\n  min-height: 44px;\n}\n.profile-access-search ::ng-deep .mat-mdc-form-field-flex {\n  align-items: center;\n}\n.profile-access-search ::ng-deep .mat-mdc-form-field-icon-prefix {\n  display: inline-flex;\n  padding: 0 7px 0 0;\n  color: #687d8a;\n}\n.profile-access-search ::ng-deep .mat-mdc-form-field-icon-prefix mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-access-search input {\n  font-size: 14px;\n}\n.profile-access-summary {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  margin: 0 15px;\n  padding: 13px 0;\n  border-bottom: 1px solid #e4eaee;\n}\n.profile-access-summary > div {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  border-right: 1px solid #e2e8ec;\n}\n.profile-access-summary > div:last-child {\n  border-right: 0;\n}\n.profile-access-summary__icon {\n  display: inline-grid;\n  flex: 0 0 32px;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: #216d8c;\n  border-radius: 6px;\n  background: #e6f3f8;\n}\n.profile-access-summary__icon--actions {\n  color: #23734c;\n  background: #e8f6ee;\n}\n.profile-access-summary__icon--roles {\n  color: #705192;\n  background: #f1eaf6;\n}\n.profile-access-summary__icon mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 19px;\n}\n.profile-access-summary p {\n  display: flex;\n  margin: 0;\n  flex-direction: column;\n}\n.profile-access-summary strong {\n  color: #293b48;\n  font-size: 18px;\n  line-height: 1.1;\n}\n.profile-access-summary p span {\n  color: #778691;\n  font-size: 12px;\n}\n.profile-admin-access {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  margin: 13px 15px 0;\n  padding: 9px 11px;\n  color: #5c477a;\n  border: 1px solid #dfd3e9;\n  border-radius: 6px;\n  background: #f7f3fa;\n}\n.profile-admin-access > mat-icon {\n  width: 19px;\n  height: 19px;\n  font-size: 19px;\n}\n.profile-admin-access > div {\n  display: flex;\n  flex-direction: column;\n}\n.profile-admin-access strong {\n  font-size: 13px;\n}\n.profile-admin-access span {\n  font-size: 12px;\n  line-height: 1.4;\n}\n.profile-access-section {\n  padding: 15px 15px 0;\n}\n.profile-access-section--actions {\n  margin-top: 15px;\n  padding-top: 15px;\n  border-top: 1px solid #e4eaee;\n}\n.profile-access-section__heading {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n.profile-access-section__heading > div {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n}\n.profile-access-section__heading mat-icon {\n  width: 18px;\n  height: 18px;\n  color: #587989;\n  font-size: 18px;\n}\n.profile-access-section__heading strong {\n  color: #30434f;\n  font-size: 14px;\n}\n.profile-access-section__heading > span {\n  display: inline-grid;\n  min-width: 25px;\n  height: 22px;\n  place-items: center;\n  padding: 0 6px;\n  color: #526e7e;\n  border-radius: 5px;\n  background: #edf2f5;\n  font-size: 12px;\n  font-weight: 700;\n}\n.profile-module-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n}\n.profile-module-item {\n  display: grid;\n  min-width: 0;\n  min-height: 76px;\n  grid-template-columns: 32px minmax(0, 1fr) 18px;\n  align-items: center;\n  gap: 8px;\n  padding: 9px 10px;\n  color: inherit;\n  border: 1px solid #dce5ea;\n  border-radius: 6px;\n  background: #fff;\n  text-decoration: none;\n  transition:\n    border-color 150ms ease,\n    background-color 150ms ease,\n    transform 150ms ease;\n}\n.profile-module-item:hover {\n  transform: translateY(-1px);\n  border-color: #a9c9d6;\n  background: #f5fafc;\n}\n.profile-module-item > span {\n  display: inline-grid;\n  width: 32px;\n  height: 32px;\n  place-items: center;\n  color: #26718f;\n  border-radius: 6px;\n  background: #e8f3f7;\n}\n.profile-module-item > span mat-icon {\n  width: 18px;\n  height: 18px;\n  font-size: 18px;\n}\n.profile-module-item > div {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-module-item strong,\n.profile-module-item small {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-module-item strong {\n  color: #334753;\n  font-size: 13px;\n}\n.profile-module-item small {\n  margin-top: 2px;\n  color: #7b8993;\n  font-size: 11px;\n}\n.profile-module-item > mat-icon {\n  width: 18px;\n  height: 18px;\n  color: #85939d;\n  font-size: 18px;\n}\n.profile-action-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 7px;\n}\n.profile-action-item {\n  display: grid;\n  min-width: 0;\n  min-height: 84px;\n  grid-template-columns: 25px minmax(0, 1fr);\n  align-items: center;\n  gap: 8px;\n  padding: 8px 9px;\n  border: 1px solid #e0e7eb;\n  border-radius: 6px;\n  background: #fbfcfd;\n}\n.profile-action-item > span {\n  display: inline-grid;\n  width: 24px;\n  height: 24px;\n  place-items: center;\n  color: #24744d;\n  border-radius: 50%;\n  background: #e7f5ed;\n}\n.profile-action-item > span mat-icon {\n  width: 15px;\n  height: 15px;\n  font-size: 15px;\n}\n.profile-action-item > div {\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n}\n.profile-action-item strong {\n  overflow: hidden;\n  color: #3b4e59;\n  font-size: 13px;\n  line-height: 1.35;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-action-item small {\n  display: -webkit-box;\n  overflow: hidden;\n  margin-top: 2px;\n  color: #667984;\n  font-size: 11px;\n  line-height: 1.4;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n.profile-action-item code {\n  overflow: hidden;\n  margin-top: 2px;\n  color: #798893;\n  font-size: 11px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.profile-access-empty {\n  display: flex;\n  min-height: 90px;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 6px;\n  padding: 15px;\n  color: #7a8994;\n  border: 1px dashed #d3dee4;\n  border-radius: 6px;\n  background: #fafcfd;\n  text-align: center;\n  font-size: 13px;\n}\n.profile-access-empty mat-icon {\n  color: #668494;\n}\n:host-context(.light) .profile-refresh {\n  color: #c66718;\n  border-color: #f1c99e;\n  border-radius: 6px;\n  background: #fff4e7;\n}\n:host-context(.light) .profile-refresh:hover:not(:disabled) {\n  color: #9f5010;\n  border-color: #edaf73;\n  background: #ffead3;\n}\n:host-context(.light) .profile-loading,\n:host-context(.light) .profile-details-panel,\n:host-context(.light) .profile-access-panel {\n  border-color: #eadfce;\n  border-radius: 8px;\n  background: #fffdf9;\n  box-shadow: 0 8px 22px rgba(18, 43, 61, 0.05);\n}\n:host-context(.light) .profile-identity-band {\n  position: relative;\n  overflow: hidden;\n  border: 1px solid #112d40;\n  border-left: 4px solid #f58b2a;\n  border-radius: 8px;\n  background: #112d40;\n  box-shadow: 0 10px 24px rgba(18, 43, 61, 0.12);\n}\n:host-context(.light) .profile-identity-band::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 112px;\n  height: 3px;\n  content: "";\n  background: #f58b2a;\n}\n:host-context(.light) .profile-avatar {\n  border-color: #fffaf4;\n  box-shadow: 0 0 0 2px #f58b2a, 0 6px 15px rgba(0, 0, 0, 0.2);\n}\n:host-context(.light) .profile-avatar-fallback {\n  color: #112d40;\n  background: #ffe1bc;\n}\n:host-context(.light) .profile-status-dot {\n  border-color: #112d40;\n}\n:host-context(.light) .profile-identity > span,\n:host-context(.light) .profile-role-list > span,\n:host-context(.light) .profile-account-status span {\n  color: #c9d4db;\n}\n:host-context(.light) .profile-identity h1 {\n  color: #fffdf9;\n}\n:host-context(.light) .profile-identity__meta span,\n:host-context(.light) .profile-identity__meta mat-icon {\n  color: #d7e0e5;\n}\n:host-context(.light) .profile-role-list {\n  border-color: rgba(238, 225, 207, 0.24);\n}\n:host-context(.light) .profile-role {\n  color: #ffe0ba;\n  border-color: rgba(251, 183, 107, 0.48);\n  border-radius: 5px;\n  background: rgba(245, 139, 42, 0.15);\n}\n:host-context(.light) .profile-role--empty {\n  color: #d7e0e5;\n  border-color: rgba(225, 233, 237, 0.25);\n  background: rgba(255, 255, 255, 0.08);\n}\n:host-context(.light) .profile-account-status {\n  color: #d5f4df;\n  border-color: rgba(134, 216, 165, 0.42);\n  border-radius: 6px;\n  background: rgba(46, 142, 96, 0.22);\n}\n:host-context(.light) .profile-account-status.inactive {\n  color: #ffd3d6;\n  border-color: rgba(239, 145, 154, 0.45);\n  background: rgba(159, 53, 63, 0.24);\n}\n:host-context(.light) .profile-load-warning {\n  color: #855016;\n  border-color: #f2d2a8;\n  border-radius: 6px;\n  background: #fff7e9;\n}\n:host-context(.light) .profile-details-panel > .profile-section-heading,\n:host-context(.light) .profile-access-toolbar {\n  border-color: #efe2d1;\n  background: #fff7ee;\n}\n:host-context(.light) .profile-section-heading__icon {\n  color: #bf6118;\n  border-radius: 6px;\n  background: #ffe6c9;\n}\n:host-context(.light) .profile-section-heading__icon--access {\n  color: #1c617e;\n  background: #e5f1f5;\n}\n:host-context(.light) .profile-section-heading strong,\n:host-context(.light) .profile-detail-list dd,\n:host-context(.light) .profile-access-summary strong,\n:host-context(.light) .profile-access-section__heading strong,\n:host-context(.light) .profile-module-item strong,\n:host-context(.light) .profile-action-item strong {\n  color: #17354a;\n}\n:host-context(.light) .profile-section-heading span,\n:host-context(.light) .profile-detail-list dt,\n:host-context(.light) .profile-access-summary p span,\n:host-context(.light) .profile-module-item small,\n:host-context(.light) .profile-action-item small,\n:host-context(.light) .profile-action-item code,\n:host-context(.light) .profile-access-empty {\n  color: #6d7c86;\n}\n:host-context(.light) .profile-detail-list > div,\n:host-context(.light) .profile-access-summary,\n:host-context(.light) .profile-access-summary > div,\n:host-context(.light) .profile-access-section--actions {\n  border-color: #eee2d3;\n}\n:host-context(.light) .profile-detail-list dt mat-icon,\n:host-context(.light) .profile-access-section__heading mat-icon {\n  color: #c9691c;\n}\n:host-context(.light) .profile-security-note {\n  color: #6e572f;\n  border-left-color: #f58b2a;\n  background: #fff5e6;\n}\n:host-context(.light) .profile-security-note > mat-icon {\n  color: #d7731a;\n}\n:host-context(.light) .profile-security-note strong {\n  color: #574326;\n}\n:host-context(.light) .profile-access-search ::ng-deep .mat-mdc-text-field-wrapper {\n  background: #fffdf9;\n}\n:host-context(.light) .profile-access-search ::ng-deep .mdc-notched-outline__leading,\n:host-context(.light) .profile-access-search ::ng-deep .mdc-notched-outline__notch,\n:host-context(.light) .profile-access-search ::ng-deep .mdc-notched-outline__trailing {\n  border-color: #dfcfbb;\n}\n:host-context(.light) .profile-access-summary__icon {\n  color: #c9691c;\n  border-radius: 6px;\n  background: #ffe7ca;\n}\n:host-context(.light) .profile-access-summary__icon--actions {\n  color: #25714e;\n  background: #e5f5ea;\n}\n:host-context(.light) .profile-access-summary__icon--roles {\n  color: #1d617d;\n  background: #e5f1f5;\n}\n:host-context(.light) .profile-admin-access {\n  color: #1d617d;\n  border-color: #c9dfe8;\n  border-radius: 6px;\n  background: #eef7fa;\n}\n:host-context(.light) .profile-access-section__heading > span {\n  color: #9d5315;\n  border-radius: 5px;\n  background: #fff0df;\n}\n:host-context(.light) .profile-module-item,\n:host-context(.light) .profile-action-item {\n  border-color: #eadfce;\n  border-radius: 7px;\n  background: #fffdf9;\n}\n:host-context(.light) .profile-module-item:hover {\n  border-color: #efba83;\n  background: #fff6eb;\n}\n:host-context(.light) .profile-module-item > span {\n  color: #c9691c;\n  border-radius: 6px;\n  background: #ffe7ca;\n}\n:host-context(.light) .profile-module-item > mat-icon {\n  color: #c47737;\n}\n:host-context(.light) .profile-action-item > span {\n  color: #28714f;\n  background: #e6f5eb;\n}\n:host-context(.light) .profile-access-empty {\n  border-color: #ead8c2;\n  border-radius: 7px;\n  background: #fffaf3;\n}\n:host-context(.light) .profile-access-empty mat-icon {\n  color: #cc762b;\n}\n:host-context(.dark) .profile-refresh,\n:host-context(.dark) .profile-loading,\n:host-context(.dark) .profile-identity-band,\n:host-context(.dark) .profile-details-panel,\n:host-context(.dark) .profile-access-panel {\n  border-color: #3b4858;\n  background: #202733;\n}\n:host-context(.dark) .profile-refresh {\n  color: #8ec5da;\n  background: #263441;\n}\n:host-context(.dark) .profile-identity h1,\n:host-context(.dark) .profile-section-heading strong,\n:host-context(.dark) .profile-detail-list dd,\n:host-context(.dark) .profile-access-summary strong,\n:host-context(.dark) .profile-access-section__heading strong,\n:host-context(.dark) .profile-module-item strong,\n:host-context(.dark) .profile-action-item strong {\n  color: #e2e8f0;\n}\n:host-context(.dark) .profile-identity > span,\n:host-context(.dark) .profile-role-list > span,\n:host-context(.dark) .profile-account-status span,\n:host-context(.dark) .profile-identity__meta span,\n:host-context(.dark) .profile-section-heading span,\n:host-context(.dark) .profile-detail-list dt,\n:host-context(.dark) .profile-access-summary p span,\n:host-context(.dark) .profile-module-item small,\n:host-context(.dark) .profile-action-item small,\n:host-context(.dark) .profile-action-item code,\n:host-context(.dark) .profile-access-empty {\n  color: #9aabbb;\n}\n:host-context(.dark) .profile-avatar {\n  border-color: #202733;\n  box-shadow: 0 0 0 1px #4a5968;\n}\n:host-context(.dark) .profile-status-dot {\n  border-color: #202733;\n}\n:host-context(.dark) .profile-role-list,\n:host-context(.dark) .profile-access-summary > div,\n:host-context(.dark) .profile-access-summary,\n:host-context(.dark) .profile-detail-list > div,\n:host-context(.dark) .profile-access-section--actions {\n  border-color: #3b4857;\n}\n:host-context(.dark) .profile-role {\n  color: #cfbce1;\n  border-color: #564765;\n  background: #332b3d;\n}\n:host-context(.dark) .profile-details-panel > .profile-section-heading,\n:host-context(.dark) .profile-access-toolbar {\n  border-color: #3b4857;\n  background: #252e39;\n}\n:host-context(.dark) .profile-security-note {\n  color: #c1b59d;\n  background: #342f25;\n}\n:host-context(.dark) .profile-security-note strong {\n  color: #e0d4bb;\n}\n:host-context(.dark) .profile-admin-access {\n  color: #cdb9df;\n  border-color: #574865;\n  background: #332b3d;\n}\n:host-context(.dark) .profile-access-section__heading > span {\n  color: #a9bbc7;\n  background: #2b3743;\n}\n:host-context(.dark) .profile-module-item,\n:host-context(.dark) .profile-action-item,\n:host-context(.dark) .profile-access-empty {\n  border-color: #3b4857;\n  background: #252e39;\n}\n:host-context(.dark) .profile-module-item:hover {\n  border-color: #55788a;\n  background: #293946;\n}\n:host-context(.dark) .profile-access-search ::ng-deep .mdc-text-field__input,\n:host-context(.dark) .profile-access-search ::ng-deep .mdc-floating-label {\n  color: #d9e2ea;\n}\n@media (max-width: 1200px) {\n  .profile-identity-band {\n    grid-template-columns: 76px minmax(230px, 1fr) minmax(220px, 0.8fr);\n  }\n  .profile-account-status {\n    grid-column: 2/-1;\n    width: fit-content;\n  }\n  .profile-module-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 900px) {\n  :host-context(.light) .profile-role-list {\n    border-color: rgba(238, 225, 207, 0.24);\n  }\n  .profile-identity-band {\n    grid-template-columns: 76px minmax(0, 1fr);\n  }\n  .profile-role-list {\n    grid-column: 1/-1;\n    padding: 11px 0 0;\n    border-top: 1px solid #e2e9ed;\n    border-right: 0;\n    border-left: 0;\n  }\n  .profile-account-status {\n    grid-column: 1/-1;\n  }\n  .profile-workspace {\n    grid-template-columns: 1fr;\n  }\n  .profile-details-panel {\n    position: static;\n  }\n  .profile-detail-list {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    column-gap: 22px;\n  }\n}\n@media (max-width: 650px) {\n  .user-profile-page__header {\n    align-items: flex-start;\n  }\n  .profile-identity-band {\n    grid-template-columns: 60px minmax(0, 1fr);\n    gap: 12px;\n    padding: 13px;\n  }\n  .profile-avatar-wrap,\n  .profile-avatar,\n  .profile-avatar-fallback {\n    width: 56px;\n    height: 56px;\n  }\n  .profile-identity h1 {\n    font-size: 23px;\n  }\n  .profile-identity__meta {\n    flex-direction: column;\n    gap: 4px;\n  }\n  .profile-access-toolbar {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 10px;\n  }\n  .profile-access-search {\n    flex-basis: auto;\n  }\n  .profile-detail-list,\n  .profile-module-grid,\n  .profile-action-grid {\n    grid-template-columns: 1fr;\n  }\n  .profile-access-summary > div {\n    gap: 5px;\n  }\n  .profile-access-summary__icon {\n    width: 28px;\n    height: 28px;\n    flex-basis: 28px;\n  }\n  .profile-access-summary strong {\n    font-size: 17px;\n  }\n}\n/*# sourceMappingURL=profile.component.css.map */\n'] }]
  }], () => [{ type: AuthService }, { type: OrganizacionService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/profile/profile.component.ts", lineNumber: 50 });
})();

// src/app/profile/profile.routes.ts
var PROFILE_ROUTE = [
  {
    path: "",
    component: ProfileComponent
  }
];
export {
  PROFILE_ROUTE
};
//# sourceMappingURL=profile.routes-NQGQNCUG.js.map
