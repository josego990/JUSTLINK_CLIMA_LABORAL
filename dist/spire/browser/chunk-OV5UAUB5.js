import {
  MatProgressBar
} from "./chunk-7ORAAJ7E.js";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableModule
} from "./chunk-GYT2RHCJ.js";
import {
  MatCardModule
} from "./chunk-DD5M7VBH.js";
import {
  MatButtonModule
} from "./chunk-6OUKOU55.js";
import {
  CommonModule,
  NgClass
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMapInterpolate1,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-BHZ7HWLX.js";

// src/app/shared/components/income-info-box/income-info-box.component.ts
var IncomeInfoBoxComponent = class _IncomeInfoBoxComponent {
  constructor() {
    this.title = "";
    this.subtitle = "";
    this.value = "";
    this.valueClass = "";
    this.progress = 0;
    this.progressClass = "";
    this.change = "";
  }
  static {
    this.\u0275fac = function IncomeInfoBoxComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _IncomeInfoBoxComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _IncomeInfoBoxComponent, selectors: [["app-income-info-box"]], inputs: { title: "title", subtitle: "subtitle", value: "value", valueClass: "valueClass", progress: "progress", progressClass: "progressClass", change: "change" }, decls: 18, vars: 9, consts: [[1, "card"], [1, "card-body"], [1, "d-flex", "justify-content-between"], [1, "m-b-15", "font-b-500", "font-18"], [1, "text-muted", "font-12"], [1, "font-18", "font-b-600", 3, "ngClass"], [1, "card-content", "mt-2"], [1, "progress", "skill-progress", "m-b-5", "w-100"], ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", 3, "ngClass"], [1, "d-flex", "justify-content-between", "mt-2"], [1, "text-muted", "mb-0"]], template: function IncomeInfoBoxComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "p", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 4);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "p", 5);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 6)(11, "div", 7);
        \u0275\u0275element(12, "div", 8);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "div", 9)(14, "p", 10);
        \u0275\u0275text(15, "Change");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "p", 10);
        \u0275\u0275text(17);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.subtitle);
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", ctx.valueClass);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance(3);
        \u0275\u0275styleProp("width", ctx.progress + "%");
        \u0275\u0275property("ngClass", ctx.progressClass);
        \u0275\u0275attribute("aria-valuenow", ctx.progress);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.change);
      }
    }, dependencies: [MatCardModule, CommonModule, NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IncomeInfoBoxComponent, [{
    type: Component,
    args: [{ selector: "app-income-info-box", imports: [MatCardModule, CommonModule], template: `<div class="card">\r
    <div class="card-body">\r
        <div class="d-flex justify-content-between">\r
            <div>\r
                <p class="m-b-15 font-b-500 font-18">{{ title }}</p>\r
                <p class="text-muted font-12">{{ subtitle }}</p>\r
            </div>\r
            <p [ngClass]="valueClass" class="font-18 font-b-600">{{ value }}</p>\r
        </div>\r
        <div class="card-content mt-2">\r
            <div class="progress skill-progress m-b-5 w-100">\r
                <div [ngClass]="progressClass" role="progressbar" [style.width]="progress + '%'"\r
                    [attr.aria-valuenow]="progress" aria-valuemin="0" aria-valuemax="100">\r
                </div>\r
            </div>\r
        </div>\r
        <div class="d-flex justify-content-between mt-2">\r
            <p class="text-muted mb-0">Change</p>\r
            <p class="text-muted mb-0">{{ change }}</p>\r
        </div>\r
    </div>\r
</div>` }]
  }], null, { title: [{
    type: Input
  }], subtitle: [{
    type: Input
  }], value: [{
    type: Input
  }], valueClass: [{
    type: Input
  }], progress: [{
    type: Input
  }], progressClass: [{
    type: Input
  }], change: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(IncomeInfoBoxComponent, { className: "IncomeInfoBoxComponent", filePath: "src/app/shared/components/income-info-box/income-info-box.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/recent-comments/recent-comments.component.ts
function RecentCommentsComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
    \u0275\u0275element(2, "img", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 4)(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "small", 5);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const comment_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", comment_r1.imgSrc, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275classMapInterpolate1("notice-heading ", comment_r1.colorClass, " font-16 font-b-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(comment_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(comment_r1.message);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(comment_r1.timestamp);
  }
}
var RecentCommentsComponent = class _RecentCommentsComponent {
  constructor() {
    this.comments = [];
  }
  static {
    this.\u0275fac = function RecentCommentsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RecentCommentsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecentCommentsComponent, selectors: [["app-recent-comments"]], inputs: { comments: "comments" }, decls: 3, vars: 0, consts: [[1, "recent-comment"], [1, "notice-board"], [1, "table-img"], ["alt", "...", 1, "notice-object", 3, "src"], [1, "notice-body"], [1, "text-muted"]], template: function RecentCommentsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, RecentCommentsComponent_For_2_Template, 10, 7, "div", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.comments);
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecentCommentsComponent, [{
    type: Component,
    args: [{ selector: "app-recent-comments", imports: [], template: '<div class="recent-comment">\r\n  @for (comment of comments; track comment) {\r\n    <div class="notice-board">\r\n      <div class="table-img">\r\n        <img class="notice-object" [src]="comment.imgSrc" alt="...">\r\n      </div>\r\n      <div class="notice-body">\r\n        <p class="notice-heading {{comment.colorClass}} font-16 font-b-500">{{ comment.name }}</p>\r\n        <p>{{ comment.message }}</p>\r\n        <small class="text-muted">{{ comment.timestamp }}</small>\r\n      </div>\r\n    </div>\r\n  }\r\n</div>' }]
  }], null, { comments: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecentCommentsComponent, { className: "RecentCommentsComponent", filePath: "src/app/shared/components/recent-comments/recent-comments.component.ts", lineNumber: 18 });
})();

// src/app/shared/components/progress-table/progress-table.component.ts
var _c0 = () => ["subject", "progress", "duration"];
function ProgressTableComponent_th_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 8);
    \u0275\u0275text(1, "Projects");
    \u0275\u0275elementEnd();
  }
}
function ProgressTableComponent_td_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subject_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subject_r1.subject);
  }
}
function ProgressTableComponent_th_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 8);
    \u0275\u0275text(1, "Progress");
    \u0275\u0275elementEnd();
  }
}
function ProgressTableComponent_td_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 10);
  }
  if (rf & 2) {
    const subject_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", subject_r2.progress);
  }
}
function ProgressTableComponent_td_6_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-progress-bar", 11);
  }
  if (rf & 2) {
    const subject_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", subject_r2.progress);
  }
}
function ProgressTableComponent_td_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 9);
    \u0275\u0275text(1);
    \u0275\u0275template(2, ProgressTableComponent_td_6_Conditional_2_Template, 1, 1, "mat-progress-bar", 10)(3, ProgressTableComponent_td_6_Conditional_3_Template, 1, 1, "mat-progress-bar", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subject_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", subject_r2.progress, "% ");
    \u0275\u0275advance();
    \u0275\u0275conditional(subject_r2.progress <= 30 ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(subject_r2.progress > 30 && subject_r2.progress <= 100 ? 3 : -1);
  }
}
function ProgressTableComponent_th_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 8);
    \u0275\u0275text(1, "Duration");
    \u0275\u0275elementEnd();
  }
}
function ProgressTableComponent_td_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const subject_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(subject_r3.duration);
  }
}
function ProgressTableComponent_tr_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 12);
  }
}
function ProgressTableComponent_tr_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 13);
  }
}
var ProgressTableComponent = class _ProgressTableComponent {
  constructor() {
    this.subjects = [];
  }
  static {
    this.\u0275fac = function ProgressTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProgressTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgressTableComponent, selectors: [["app-progress-table"]], inputs: { subjects: "subjects" }, decls: 12, vars: 5, consts: [["mat-table", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "subject"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "progress"], ["matColumnDef", "duration"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["mode", "determinate", "color", "warn", 3, "value"], ["mode", "determinate", 3, "value"], ["mat-header-row", ""], ["mat-row", ""]], template: function ProgressTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "table", 0);
        \u0275\u0275elementContainerStart(1, 1);
        \u0275\u0275template(2, ProgressTableComponent_th_2_Template, 2, 0, "th", 2)(3, ProgressTableComponent_td_3_Template, 2, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(4, 4);
        \u0275\u0275template(5, ProgressTableComponent_th_5_Template, 2, 0, "th", 2)(6, ProgressTableComponent_td_6_Template, 4, 3, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(7, 5);
        \u0275\u0275template(8, ProgressTableComponent_th_8_Template, 2, 0, "th", 2)(9, ProgressTableComponent_td_9_Template, 2, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(10, ProgressTableComponent_tr_10_Template, 1, 0, "tr", 6)(11, ProgressTableComponent_tr_11_Template, 1, 0, "tr", 7);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("dataSource", ctx.subjects);
        \u0275\u0275advance(10);
        \u0275\u0275property("matHeaderRowDef", \u0275\u0275pureFunction0(3, _c0));
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", \u0275\u0275pureFunction0(4, _c0));
      }
    }, dependencies: [MatCardModule, MatButtonModule, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatProgressBar], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressTableComponent, [{
    type: Component,
    args: [{ selector: "app-progress-table", imports: [MatCardModule, MatButtonModule, MatTableModule, MatProgressBar], template: `<table mat-table [dataSource]="subjects" class="mat-elevation-z8">\r
\r
  <!-- Subject Column -->\r
  <ng-container matColumnDef="subject">\r
    <th mat-header-cell *matHeaderCellDef>Projects</th>\r
    <td mat-cell *matCellDef="let subject">{{ subject.subject }}</td>\r
  </ng-container>\r
\r
  <!-- Progress Column -->\r
  <ng-container matColumnDef="progress">\r
    <th mat-header-cell *matHeaderCellDef>Progress</th>\r
    <td mat-cell *matCellDef="let subject">\r
      {{ subject.progress }}%\r
      @if (subject.progress <= 30) { <mat-progress-bar mode="determinate" [value]="subject.progress" color="warn">\r
        </mat-progress-bar>\r
        }\r
        @if (subject.progress > 30 && subject.progress <= 100) { <mat-progress-bar mode="determinate"\r
          [value]="subject.progress"></mat-progress-bar>\r
          }\r
    </td>\r
  </ng-container>\r
\r
  <!-- Duration Column -->\r
  <ng-container matColumnDef="duration">\r
    <th mat-header-cell *matHeaderCellDef>Duration</th>\r
    <td mat-cell *matCellDef="let subject">{{ subject.duration }}</td>\r
  </ng-container>\r
\r
  <tr mat-header-row *matHeaderRowDef="['subject', 'progress', 'duration']"></tr>\r
  <tr mat-row *matRowDef="let row; columns: ['subject', 'progress', 'duration'];"></tr>\r
</table>` }]
  }], null, { subjects: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgressTableComponent, { className: "ProgressTableComponent", filePath: "src/app/shared/components/progress-table/progress-table.component.ts", lineNumber: 21 });
})();

// src/app/shared/components/earning-source/earning-source.component.ts
function EarningSourceComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 1)(2, "span", 2);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 3);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 4);
    \u0275\u0275element(7, "div", 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const source_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(source_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", source_r1.labelClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", source_r1.percentage, "%");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", source_r1.percentage + "%");
    \u0275\u0275property("ngClass", source_r1.class);
    \u0275\u0275attribute("aria-valuenow", source_r1.percentage);
  }
}
var EarningSourceComponent = class _EarningSourceComponent {
  constructor() {
    this.earningSources = [];
  }
  static {
    this.\u0275fac = function EarningSourceComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EarningSourceComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EarningSourceComponent, selectors: [["app-earning-source"]], inputs: { earningSources: "earningSources" }, decls: 3, vars: 0, consts: [[1, "list-unstyled"], [1, "mb-2"], [1, "progress-label"], [1, "float-end", "progress-percent", "label", "m-b-5", 3, "ngClass"], [1, "progress", "skill-progress", "m-b-20", "w-100"], ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", 3, "ngClass"]], template: function EarningSourceComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275repeaterCreate(1, EarningSourceComponent_For_2_Template, 8, 7, "li", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.earningSources);
      }
    }, dependencies: [NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EarningSourceComponent, [{
    type: Component,
    args: [{ selector: "app-earning-source", imports: [NgClass], template: `<ul class="list-unstyled">\r
  @for (source of earningSources; track source) {\r
    <li>\r
      <div class="mb-2">\r
        <span class="progress-label">{{ source.label }}</span>\r
        <span class="float-end progress-percent label m-b-5" [ngClass]="source.labelClass">{{ source.percentage\r
        }}%</span>\r
      </div>\r
      <div class="progress skill-progress m-b-20 w-100">\r
        <div class="progress-bar" [ngClass]="source.class" [style.width]="source.percentage + '%'"\r
        role="progressbar" [attr.aria-valuenow]="source.percentage" aria-valuemin="0" aria-valuemax="100"></div>\r
      </div>\r
    </li>\r
  }\r
</ul>` }]
  }], null, { earningSources: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EarningSourceComponent, { className: "EarningSourceComponent", filePath: "src/app/shared/components/earning-source/earning-source.component.ts", lineNumber: 17 });
})();

export {
  IncomeInfoBoxComponent,
  RecentCommentsComponent,
  ProgressTableComponent,
  EarningSourceComponent
};
//# sourceMappingURL=chunk-OV5UAUB5.js.map
