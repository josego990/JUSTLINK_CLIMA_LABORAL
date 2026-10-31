import {
  MatTab,
  MatTabGroup,
  MatTabLabel,
  MatTabsModule
} from "./chunk-UGE7ZYOS.js";
import {
  BaseChartDirective
} from "./chunk-VC24BQNL.js";
import {
  EarningSourceComponent,
  IncomeInfoBoxComponent,
  ProgressTableComponent,
  RecentCommentsComponent
} from "./chunk-OV5UAUB5.js";
import {
  NgScrollbar
} from "./chunk-PGPD7O76.js";
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from "./chunk-MP4NAT2N.js";
import {
  NgxChartsModule
} from "./chunk-66W4N2RY.js";
import {
  ChartComponent,
  NgApexchartsModule
} from "./chunk-SSA4BJL6.js";
import {
  MatProgressBar,
  MatProgressBarModule
} from "./chunk-7ORAAJ7E.js";
import "./chunk-PO3BZ2ER.js";
import "./chunk-75G4SHEF.js";
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
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "./chunk-DD5M7VBH.js";
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
import {
  BreadcrumbComponent
} from "./chunk-2TM4C2ER.js";
import "./chunk-H3UX3NVF.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-4AQ2Q7XZ.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import "./chunk-T2IHQNFZ.js";
import "./chunk-V7JA7XTT.js";
import {
  MatFormField,
  MatFormFieldModule
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatAnchor,
  MatButton,
  MatButtonModule
} from "./chunk-6OUKOU55.js";
import "./chunk-Y73QBUAC.js";
import {
  CommonModule,
  DecimalPipe,
  NgClass,
  NgForOf,
  SlicePipe
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassMapInterpolate1,
  ɵɵconditional,
  ɵɵdefineComponent,
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
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵpureFunction3,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
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

// src/app/shared/components/attendance-chart/attendance-chart.component.ts
var AttendanceChartComponent = class _AttendanceChartComponent {
  constructor() {
    this.classValue = "class1";
    this.data = {
      class1: [
        { name: "Present", data: [80, 70, 90, 60, 85] },
        { name: "Absent", data: [20, 30, 10, 40, 15] }
      ],
      class2: [
        { name: "Present", data: [75, 80, 70, 65, 85] },
        { name: "Absent", data: [25, 20, 30, 35, 15] }
      ],
      class3: [
        { name: "Present", data: [90, 85, 80, 75, 95] },
        { name: "Absent", data: [10, 15, 20, 25, 5] }
      ]
    };
    this.initializeChart();
  }
  initializeChart() {
    this.attendanceChartOptions = {
      series: this.data[this.classValue],
      chart: {
        type: "bar",
        height: 300,
        stacked: true,
        toolbar: {
          show: false
        },
        foreColor: "#9aa0ac"
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri"]
      },
      yaxis: {
        max: 100,
        labels: {
          formatter: (value) => `${value}%`
        }
      },
      fill: {
        colors: ["#6DA344", "#95B873"]
      },
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "50%"
        }
      }
    };
  }
  updateChart() {
    this.attendanceChartOptions.series = this.data[this.classValue];
  }
  static {
    this.\u0275fac = function AttendanceChartComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AttendanceChartComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AttendanceChartComponent, selectors: [["app-attendance-chart"]], decls: 14, vars: 8, consts: [[1, "header-menu"], ["appearance", "outline", 1, "header-form-field"], [3, "valueChange", "selectionChange", "value"], ["value", "class1"], ["value", "class2"], ["value", "class3"], [3, "series", "chart", "xaxis", "yaxis", "fill", "tooltip", "plotOptions"]], template: function AttendanceChartComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "mat-card")(1, "mat-card-header", 0)(2, "mat-card-title");
        \u0275\u0275text(3, "Attendance");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "mat-form-field", 1)(5, "mat-select", 2);
        \u0275\u0275twoWayListener("valueChange", function AttendanceChartComponent_Template_mat_select_valueChange_5_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.classValue, $event) || (ctx.classValue = $event);
          return $event;
        });
        \u0275\u0275listener("selectionChange", function AttendanceChartComponent_Template_mat_select_selectionChange_5_listener() {
          return ctx.updateChart();
        });
        \u0275\u0275elementStart(6, "mat-option", 3);
        \u0275\u0275text(7, "Class 1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "mat-option", 4);
        \u0275\u0275text(9, "Class 2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(10, "mat-option", 5);
        \u0275\u0275text(11, "Class 3");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(12, "mat-card-content");
        \u0275\u0275element(13, "apx-chart", 6);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("value", ctx.classValue);
        \u0275\u0275advance(8);
        \u0275\u0275property("series", ctx.attendanceChartOptions.series)("chart", ctx.attendanceChartOptions.chart)("xaxis", ctx.attendanceChartOptions.xaxis)("yaxis", ctx.attendanceChartOptions.yaxis)("fill", ctx.attendanceChartOptions.fill)("tooltip", ctx.attendanceChartOptions.tooltip)("plotOptions", ctx.attendanceChartOptions.plotOptions);
      }
    }, dependencies: [
      MatCardModule,
      MatCard,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      NgApexchartsModule,
      ChartComponent,
      MatButtonModule,
      MatSelectModule,
      MatFormField,
      MatSelect,
      MatOption
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttendanceChartComponent, [{
    type: Component,
    args: [{ selector: "app-attendance-chart", imports: [
      MatCardModule,
      NgApexchartsModule,
      MatCardModule,
      MatButtonModule,
      MatSelectModule
    ], template: '<mat-card>\r\n    <mat-card-header class="header-menu">\r\n        <mat-card-title>Attendance</mat-card-title>\r\n        <mat-form-field appearance="outline" class="header-form-field">\r\n            <mat-select [(value)]="classValue" (selectionChange)="updateChart()">\r\n                <mat-option value="class1">Class 1</mat-option>\r\n                <mat-option value="class2">Class 2</mat-option>\r\n                <mat-option value="class3">Class 3</mat-option>\r\n            </mat-select>\r\n        </mat-form-field>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <apx-chart [series]="attendanceChartOptions.series!" [chart]="attendanceChartOptions.chart!"\r\n            [xaxis]="attendanceChartOptions.xaxis!" [yaxis]="attendanceChartOptions.yaxis!"\r\n            [fill]="attendanceChartOptions.fill!" [tooltip]="attendanceChartOptions.tooltip!"\r\n            [plotOptions]="attendanceChartOptions.plotOptions!"></apx-chart>\r\n    </mat-card-content>\r\n</mat-card>' }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttendanceChartComponent, { className: "AttendanceChartComponent", filePath: "src/app/shared/components/attendance-chart/attendance-chart.component.ts", lineNumber: 37 });
})();

// src/app/shared/components/chart-card4/chart-card4.component.ts
var ChartCard4Component = class _ChartCard4Component {
  constructor() {
    this.maleCount = 0;
    this.femaleCount = 0;
    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      cutout: "70%"
    };
    this.doughnutChartType = "doughnut";
    this.doughnutChartData = {
      labels: ["Male Students", "Female Students"],
      datasets: [
        {
          data: [this.maleCount, this.femaleCount],
          backgroundColor: ["#4F58D2", "#EDBE27"],
          borderWidth: 0,
          borderRadius: 5,
          spacing: 5
        }
      ]
    };
  }
  ngOnInit() {
    this.doughnutChartData.datasets[0].data = [
      this.maleCount,
      this.femaleCount
    ];
  }
  static {
    this.\u0275fac = function ChartCard4Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChartCard4Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChartCard4Component, selectors: [["app-chart-card4"]], inputs: { maleCount: "maleCount", femaleCount: "femaleCount" }, decls: 21, vars: 9, consts: [[1, "chart-card4"], [1, "header-menu"], [1, "chart-container"], [2, "display", "block", "width", "240px", "height", "240px"], ["baseChart", "", 3, "data", "type", "options"], [1, "statistics"], [1, "stat-item", "male"], [1, "count"], [1, "label"], [1, "stat-item", "female"]], template: function ChartCard4Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "mat-card", 0)(1, "mat-card-header", 1)(2, "mat-card-title");
        \u0275\u0275text(3, "Students");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(4, "mat-card-content")(5, "div", 2)(6, "div", 3);
        \u0275\u0275element(7, "canvas", 4);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 5)(9, "div", 6)(10, "span", 7);
        \u0275\u0275text(11);
        \u0275\u0275pipe(12, "number");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "span", 8);
        \u0275\u0275text(14, "Male Students");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "div", 9)(16, "span", 7);
        \u0275\u0275text(17);
        \u0275\u0275pipe(18, "number");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "span", 8);
        \u0275\u0275text(20, "Female Students");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(7);
        \u0275\u0275property("data", ctx.doughnutChartData)("type", ctx.doughnutChartType)("options", ctx.doughnutChartOptions);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 5, ctx.maleCount));
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 7, ctx.femaleCount));
      }
    }, dependencies: [NgxChartsModule, DecimalPipe, MatCardModule, MatCard, MatCardContent, MatCardHeader, MatCardTitle, CommonModule, BaseChartDirective], styles: ["\n\n.chart-card4[_ngcontent-%COMP%]   .chart-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chart-card4[_ngcontent-%COMP%]   .statistics[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  text-align: center;\n  margin: 20px;\n}\n.chart-card4[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.chart-card4[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  color: #666;\n}\n.chart-card4[_ngcontent-%COMP%]   .stat-item.male[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  color: #4f58d2;\n}\n.chart-card4[_ngcontent-%COMP%]   .stat-item.female[_ngcontent-%COMP%]   .count[_ngcontent-%COMP%] {\n  color: #edbe27;\n}\n/*# sourceMappingURL=chart-card4.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChartCard4Component, [{
    type: Component,
    args: [{ selector: "app-chart-card4", imports: [NgxChartsModule, MatCardModule, CommonModule, BaseChartDirective], template: '<!-- chart-card4.component.html -->\r\n<mat-card class="chart-card4">\r\n    <mat-card-header class="header-menu">\r\n        <mat-card-title>Students</mat-card-title>\r\n    </mat-card-header>\r\n    <mat-card-content>\r\n        <div class="chart-container">\r\n            <div style="display: block; width: 240px; height: 240px;">\r\n                <canvas baseChart [data]="doughnutChartData" [type]="doughnutChartType"\r\n                    [options]="doughnutChartOptions">\r\n                </canvas>\r\n            </div>\r\n        </div>\r\n        <div class="statistics">\r\n            <div class="stat-item male">\r\n                <span class="count">{{maleCount | number}}</span>\r\n                <span class="label">Male Students</span>\r\n            </div>\r\n            <div class="stat-item female">\r\n                <span class="count">{{femaleCount | number}}</span>\r\n                <span class="label">Female Students</span>\r\n            </div>\r\n        </div>\r\n    </mat-card-content>\r\n</mat-card>', styles: ["/* src/app/shared/components/chart-card4/chart-card4.component.scss */\n.chart-card4 .chart-container {\n  position: relative;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.chart-card4 .statistics {\n  display: flex;\n  gap: 0.5rem;\n  text-align: center;\n  margin: 20px;\n}\n.chart-card4 .stat-item .count {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n}\n.chart-card4 .stat-item .label {\n  font-size: 0.875rem;\n  color: #666;\n}\n.chart-card4 .stat-item.male .count {\n  color: #4f58d2;\n}\n.chart-card4 .stat-item.female .count {\n  color: #edbe27;\n}\n/*# sourceMappingURL=chart-card4.component.css.map */\n"] }]
  }], null, { maleCount: [{
    type: Input
  }], femaleCount: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChartCard4Component, { className: "ChartCard4Component", filePath: "src/app/shared/components/chart-card4/chart-card4.component.ts", lineNumber: 15 });
})();

// src/app/shared/components/info-box1/info-box1.component.ts
var InfoBox1Component = class _InfoBox1Component {
  constructor() {
    this.cardClass = "";
    this.iconClass = "";
    this.title = "";
    this.value = "";
    this.progressValue = 0;
    this.progressClass = "";
    this.percentageChange = 0;
  }
  static {
    this.\u0275fac = function InfoBox1Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _InfoBox1Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InfoBox1Component, selectors: [["app-info-box1"]], inputs: { cardClass: "cardClass", iconClass: "iconClass", title: "title", value: "value", progressValue: "progressValue", progressClass: "progressClass", percentageChange: "percentageChange" }, decls: 16, vars: 9, consts: [[1, "info-box1", 3, "ngClass"], [1, "card-statistic-3"], [1, "card-icon", "card-icon-large"], [1, "card-content"], [1, "card-title"], [1, "data-1", "font-16"], ["mode", "determinate", 1, "progress-round", "progress-shadow", "mt-2", "mb-2", 3, "value", "ngClass"], [1, "mb-0", "text-sm"], [1, "mr-2"], [1, "fa", "fa-arrow-up"], [1, "text-nowrap"]], template: function InfoBox1Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "i");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "h6", 4);
        \u0275\u0275text(6);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "span", 5);
        \u0275\u0275text(8);
        \u0275\u0275elementEnd();
        \u0275\u0275element(9, "mat-progress-bar", 6);
        \u0275\u0275elementStart(10, "p", 7)(11, "span", 8);
        \u0275\u0275element(12, "i", 9);
        \u0275\u0275text(13);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "span", 10);
        \u0275\u0275text(15, " Since last month");
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.cardClass);
        \u0275\u0275advance(3);
        \u0275\u0275classMap(ctx.iconClass);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance();
        \u0275\u0275property("value", ctx.progressValue)("ngClass", ctx.progressClass);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate1(" ", ctx.percentageChange, "%");
      }
    }, dependencies: [MatProgressBarModule, MatProgressBar, NgClass], styles: ["\n\n.info-box1[_ngcontent-%COMP%] {\n  background: #fff;\n  min-height: 50px;\n  position: relative;\n  margin-bottom: 24px;\n  border-radius: 10px;\n  box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);\n  -webkit-box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);\n}\n.info-box1[_ngcontent-%COMP%]   .card-statistic-3[_ngcontent-%COMP%] {\n  position: relative;\n  color: #fff;\n  padding: 15px;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.info-box1[_ngcontent-%COMP%]   .card-statistic-3[_ngcontent-%COMP%]   .card-icon-large[_ngcontent-%COMP%] {\n  font-size: 110px;\n  width: 110px;\n  height: 50px;\n  text-shadow: 3px 7px rgba(0, 0, 0, 0.3);\n}\n.info-box1[_ngcontent-%COMP%]   .card-statistic-3[_ngcontent-%COMP%]   .card-icon[_ngcontent-%COMP%] {\n  text-align: center;\n  line-height: 50px;\n  margin-left: 15px;\n  color: #000;\n  position: absolute;\n  right: -5px;\n  top: 20px;\n  opacity: 0.1;\n}\n.info-box1[_ngcontent-%COMP%]   .card-statistic-3[_ngcontent-%COMP%]   .banner-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n}\n.info-box1[_ngcontent-%COMP%]   .card-statistic-3[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   .data-1[_ngcontent-%COMP%] {\n  font-size: 25px;\n  font-weight: 600;\n}\n/*# sourceMappingURL=info-box1.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InfoBox1Component, [{
    type: Component,
    args: [{ selector: "app-info-box1", imports: [MatProgressBarModule, NgClass], template: '<div class="info-box1" [ngClass]="cardClass">\r\n    <div class="card-statistic-3">\r\n        <div class="card-icon card-icon-large">\r\n            <i class="{{ iconClass }}"></i>\r\n        </div>\r\n        <div class="card-content">\r\n            <h6 class="card-title">{{ title }}</h6>\r\n            <span class="data-1 font-16">{{ value }}</span>\r\n            <mat-progress-bar mode="determinate" [value]="progressValue"\r\n                class="progress-round progress-shadow mt-2 mb-2" [ngClass]="progressClass"></mat-progress-bar>\r\n            <p class="mb-0 text-sm">\r\n                <span class="mr-2"><i class="fa fa-arrow-up"></i> {{ percentageChange }}%</span>\r\n                <span class="text-nowrap"> Since last month</span>\r\n            </p>\r\n        </div>\r\n    </div>\r\n</div>', styles: ["/* src/app/shared/components/info-box1/info-box1.component.scss */\n.info-box1 {\n  background: #fff;\n  min-height: 50px;\n  position: relative;\n  margin-bottom: 24px;\n  border-radius: 10px;\n  box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);\n  -webkit-box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);\n}\n.info-box1 .card-statistic-3 {\n  position: relative;\n  color: #fff;\n  padding: 15px;\n  border-radius: 3px;\n  overflow: hidden;\n}\n.info-box1 .card-statistic-3 .card-icon-large {\n  font-size: 110px;\n  width: 110px;\n  height: 50px;\n  text-shadow: 3px 7px rgba(0, 0, 0, 0.3);\n}\n.info-box1 .card-statistic-3 .card-icon {\n  text-align: center;\n  line-height: 50px;\n  margin-left: 15px;\n  color: #000;\n  position: absolute;\n  right: -5px;\n  top: 20px;\n  opacity: 0.1;\n}\n.info-box1 .card-statistic-3 .banner-img img {\n  max-width: 100%;\n}\n.info-box1 .card-statistic-3 .card-content .data-1 {\n  font-size: 25px;\n  font-weight: 600;\n}\n/*# sourceMappingURL=info-box1.component.css.map */\n"] }]
  }], null, { cardClass: [{
    type: Input
  }], iconClass: [{
    type: Input
  }], title: [{
    type: Input
  }], value: [{
    type: Input
  }], progressValue: [{
    type: Input
  }], progressClass: [{
    type: Input
  }], percentageChange: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InfoBox1Component, { className: "InfoBox1Component", filePath: "src/app/shared/components/info-box1/info-box1.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/order-info-box/order-info-box.component.ts
var OrderInfoBoxComponent = class _OrderInfoBoxComponent {
  constructor() {
    this.title = "";
    this.value = "";
    this.percentageText = "";
    this.iconClass = "";
    this.bgClass = "";
  }
  static {
    this.\u0275fac = function OrderInfoBoxComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _OrderInfoBoxComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OrderInfoBoxComponent, selectors: [["app-order-info-box"]], inputs: { title: "title", value: "value", percentageText: "percentageText", iconClass: "iconClass", bgClass: "bgClass" }, decls: 10, vars: 5, consts: [[1, "info-box7", "order-info-box7", 3, "ngClass"], [1, "info-box7-block"], [1, "m-b-15", "font-b-500", "font-18"], [1, "text-end", "font-b-500"], [3, "ngClass"], [1, "font-25"], [1, "font-12", "m-b-0"]], template: function OrderInfoBoxComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "p", 2);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "p", 3);
        \u0275\u0275element(5, "i", 4);
        \u0275\u0275elementStart(6, "span", 5);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "p", 6);
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275property("ngClass", ctx.bgClass);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.iconClass + " float-start");
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.percentageText);
      }
    }, dependencies: [MatCardModule, CommonModule, NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrderInfoBoxComponent, [{
    type: Component,
    args: [{ selector: "app-order-info-box", imports: [MatCardModule, CommonModule], template: `<div class="info-box7 order-info-box7" [ngClass]="bgClass">\r
    <div class="info-box7-block">\r
        <p class="m-b-15 font-b-500 font-18">{{ title }}</p>\r
        <p class="text-end font-b-500">\r
            <i [ngClass]="iconClass + ' float-start'"></i>\r
            <span class="font-25">{{ value }}</span>\r
        </p>\r
        <p class="font-12 m-b-0">{{ percentageText }}</p>\r
    </div>\r
</div>` }]
  }], null, { title: [{
    type: Input
  }], value: [{
    type: Input
  }], percentageText: [{
    type: Input
  }], iconClass: [{
    type: Input
  }], bgClass: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OrderInfoBoxComponent, { className: "OrderInfoBoxComponent", filePath: "src/app/shared/components/order-info-box/order-info-box.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/statistic-card1/statistic-card1.component.ts
var StatisticCard1Component = class _StatisticCard1Component {
  constructor() {
    this.title = "";
    this.value = "";
    this.percentage = "";
    this.increase = true;
    this.imageUrl = "";
  }
  static {
    this.\u0275fac = function StatisticCard1Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StatisticCard1Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatisticCard1Component, selectors: [["app-statistic-card1"]], inputs: { title: "title", value: "value", percentage: "percentage", increase: "increase", imageUrl: "imageUrl" }, decls: 15, vars: 7, consts: [[1, "statistic-card1"], [1, "row", "align-items-center", "justify-content-between"], [1, "col-lg-6", "col-md-6", "col-sm-6", "col-xs-6"], [1, "font-15", "font-b-500"], [1, "mb-3", "font-18", "font-b-500"], [1, "mb-0", "font-14"], [3, "ngClass"], [1, "banner-img"], [3, "src", "alt"]], template: function StatisticCard1Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "mat-card", 0)(1, "mat-card-content")(2, "div", 1)(3, "div", 2)(4, "p", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 4);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "p", 5)(9, "span", 6);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd();
        \u0275\u0275text(11);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 2)(13, "div", 7);
        \u0275\u0275element(14, "img", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.increase ? "col-green" : "col-orange");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1("", ctx.percentage, "%");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.increase ? "Increase" : "Decrease", " ");
        \u0275\u0275advance(3);
        \u0275\u0275propertyInterpolate("alt", ctx.title);
        \u0275\u0275property("src", ctx.imageUrl, \u0275\u0275sanitizeUrl);
      }
    }, dependencies: [MatCardModule, MatCard, MatCardContent, CommonModule, NgClass], styles: ["\n\n[_nghost-%COMP%]     .banner-img img {\n  max-width: 100%;\n  height: auto;\n}\n/*# sourceMappingURL=statistic-card1.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatisticCard1Component, [{
    type: Component,
    args: [{ selector: "app-statistic-card1", imports: [MatCardModule, CommonModule], template: `<mat-card class="statistic-card1">\r
    <mat-card-content>\r
        <div class="row align-items-center justify-content-between">\r
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\r
                <p class="font-15 font-b-500">{{ title }}</p>\r
                <p class="mb-3 font-18 font-b-500">{{ value }}</p>\r
                <p class="mb-0 font-14">\r
                    <span [ngClass]="increase ? 'col-green' : 'col-orange'">{{ percentage }}%</span>\r
                    {{ increase ? 'Increase' : 'Decrease' }}\r
                </p>\r
            </div>\r
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\r
                <div class="banner-img">\r
                    <img [src]="imageUrl" alt="{{ title }}">\r
                </div>\r
            </div>\r
        </div>\r
    </mat-card-content>\r
</mat-card>`, styles: ["/* src/app/shared/components/statistic-card1/statistic-card1.component.scss */\n:host ::ng-deep .banner-img img {\n  max-width: 100%;\n  height: auto;\n}\n/*# sourceMappingURL=statistic-card1.component.css.map */\n"] }]
  }], null, { title: [{
    type: Input
  }], value: [{
    type: Input
  }], percentage: [{
    type: Input
  }], increase: [{
    type: Input
  }], imageUrl: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatisticCard1Component, { className: "StatisticCard1Component", filePath: "src/app/shared/components/statistic-card1/statistic-card1.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/statistic-card2/statistic-card2.component.ts
function StatisticCard2Component_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "i", 10);
    \u0275\u0275text(1, "trending_up");
    \u0275\u0275elementEnd();
  }
}
function StatisticCard2Component_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "i", 11);
    \u0275\u0275text(1, "trending_down");
    \u0275\u0275elementEnd();
  }
}
var StatisticCard2Component = class _StatisticCard2Component {
  constructor() {
    this.title = "";
    this.value = 0;
    this.description = "";
    this.img = "";
    this.arrowIcon = "";
  }
  static {
    this.\u0275fac = function StatisticCard2Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StatisticCard2Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _StatisticCard2Component, selectors: [["app-statistic-card2"]], inputs: { title: "title", value: "value", description: "description", img: "img", arrowIcon: "arrowIcon" }, decls: 16, vars: 5, consts: [[1, "card", "card-statistic-2"], [1, "clearfix"], [1, "card-icon-only", "shadow-primary", "float-start"], ["alt", "", 3, "src"], [1, "card-right"], [1, "float-end"], [1, "col-green"], [1, "font-weight-bold", "float-end", "mb-0"], [1, "card-content", "msl-4", "mb-3"], [1, "m-b-0", "d-flex", "font-12"], [1, "material-icons", "col-green", "psr-2"], [1, "material-icons", "col-orange", "psr-2"]], template: function StatisticCard2Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "img", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div")(6, "h6", 5);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "div", 6)(9, "h4", 7);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(11, "div", 8)(12, "p", 9);
        \u0275\u0275template(13, StatisticCard2Component_Conditional_13_Template, 2, 0, "i", 10)(14, StatisticCard2Component_Conditional_14_Template, 2, 0, "i", 11);
        \u0275\u0275text(15);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("src", ctx.img, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(4);
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.arrowIcon === "trending_up" ? 13 : 14);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1(" ", ctx.description, " ");
      }
    }, dependencies: [MatCardModule, MatIconModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StatisticCard2Component, [{
    type: Component,
    args: [{ selector: "app-statistic-card2", imports: [MatCardModule, MatIconModule], template: `<div class="card card-statistic-2">\r
  <div class="clearfix">\r
    <div class="card-icon-only shadow-primary float-start">\r
      <img [src]="img" alt="">\r
    </div>\r
    <div class="card-right">\r
      <div>\r
        <h6 class="float-end">{{ title }}</h6>\r
      </div>\r
      <div class="col-green">\r
        <h4 class="font-weight-bold float-end mb-0">{{ value }}</h4>\r
      </div>\r
    </div>\r
  </div>\r
  <div class="card-content msl-4 mb-3">\r
    <p class="m-b-0 d-flex font-12">\r
      @if (arrowIcon === 'trending_up') {\r
        <i class="material-icons col-green psr-2">trending_up</i>\r
      } @else {\r
        <i class="material-icons col-orange psr-2">trending_down</i>\r
      }\r
      {{ description }}\r
    </p>\r
  </div>\r
</div>` }]
  }], null, { title: [{
    type: Input
  }], value: [{
    type: Input
  }], description: [{
    type: Input
  }], img: [{
    type: Input
  }], arrowIcon: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(StatisticCard2Component, { className: "StatisticCard2Component", filePath: "src/app/shared/components/statistic-card2/statistic-card2.component.ts", lineNumber: 12 });
})();

// src/app/shared/components/info-box2/info-box2.component.ts
var _c0 = (a0, a1) => ({ "col-red": a0, "col-green": a1 });
var InfoBox2Component = class _InfoBox2Component {
  constructor() {
    this.icon = "";
    this.title = "";
    this.value = "";
    this.trendDirection = "";
    this.trendPercentage = "";
    this.trendText = "";
    this.colorClass = "";
  }
  static {
    this.\u0275fac = function InfoBox2Component_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _InfoBox2Component)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InfoBox2Component, selectors: [["app-info-box2"]], inputs: { icon: "icon", title: "title", value: "value", trendDirection: "trendDirection", trendPercentage: "trendPercentage", trendText: "trendText", colorClass: "colorClass" }, decls: 15, vars: 13, consts: [[1, "card", "info-card"], [1, "info-box8"], [1, "material-icons", 3, "ngClass"], [3, "ngClass"], [1, "material-icons", "float-start", "me-1", "ms-1", 3, "ngClass"], [1, "float-start", "m-0"]], template: function InfoBox2Component_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "i", 2);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "h5", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "h5");
        \u0275\u0275text(7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div")(9, "i", 4);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "p", 5)(12, "span", 3);
        \u0275\u0275text(13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(14);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", "bg-" + ctx.colorClass + " card1-icon");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.icon);
        \u0275\u0275advance();
        \u0275\u0275property("ngClass", "col-" + ctx.colorClass + " font-b-500");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.title);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate(ctx.value);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(10, _c0, ctx.trendDirection === "down", ctx.trendDirection === "up"));
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" trending_", ctx.trendDirection, " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngClass", ctx.trendDirection === "down" ? "col-orange" : "col-green");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(ctx.trendPercentage);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.trendText, "");
      }
    }, dependencies: [CommonModule, NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InfoBox2Component, [{
    type: Component,
    args: [{ selector: "app-info-box2", imports: [CommonModule], template: `<div class="card info-card">\r
    <div class="info-box8">\r
        <i class="material-icons" [ngClass]="'bg-'+colorClass + ' card1-icon'">{{ icon }}</i>\r
        <h5 [ngClass]="'col-'+colorClass + ' font-b-500'">{{ title }}</h5>\r
        <h5>{{ value }}</h5>\r
        <div>\r
            <i class="material-icons float-start me-1 ms-1"\r
                [ngClass]="{'col-red': trendDirection === 'down', 'col-green': trendDirection === 'up'}">\r
                trending_{{ trendDirection }}\r
            </i>\r
            <p class="float-start m-0"><span [ngClass]="trendDirection === 'down' ? 'col-orange' : 'col-green'">{{\r
                    trendPercentage }}</span> {{ trendText }}</p>\r
        </div>\r
    </div>\r
</div>` }]
  }], null, { icon: [{
    type: Input
  }], title: [{
    type: Input
  }], value: [{
    type: Input
  }], trendDirection: [{
    type: Input
  }], trendPercentage: [{
    type: Input
  }], trendText: [{
    type: Input
  }], colorClass: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InfoBox2Component, { className: "InfoBox2Component", filePath: "src/app/shared/components/info-box2/info-box2.component.ts", lineNumber: 10 });
})();

// src/app/widget/chart-widget/chart-widget.component.ts
var _c02 = ["chart"];
var _c1 = () => ["Home"];
var ChartWidgetComponent = class _ChartWidgetComponent {
  constructor() {
    this.breadscrums = [
      {
        title: "Chart Widget",
        items: ["Widget"],
        active: "Chart Widget"
      }
    ];
    this.radarChartOptions = {
      series: [
        {
          name: "Blue",
          data: [80, 50, 30, 40, 100, 20]
        },
        {
          name: "Green",
          data: [20, 30, 40, 80, 20, 80]
        },
        {
          name: "Orange",
          data: [44, 76, 78, 13, 43, 10]
        }
      ],
      chart: {
        height: 240,
        type: "radar",
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1
        }
      },
      stroke: {
        width: 0
      },
      fill: {
        opacity: 0.4
      },
      markers: {
        size: 0
      },
      xaxis: {
        categories: ["2011", "2012", "2013", "2014", "2015", "2016"]
      }
    };
    this.circleChartOptions = {
      series: [76, 67, 61, 90],
      chart: {
        height: 275,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: void 0
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#FF4560", "#775DD0", "#00E396", "#FEB019"],
      labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
      legend: {
        show: true,
        floating: true,
        fontSize: "12px",
        position: "left",
        offsetX: 10,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
    this.areaChartOptions = {
      chart: {
        height: 240,
        type: "area",
        toolbar: {
          show: false
        },
        foreColor: "#9aa0ac"
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34]
        }
      ],
      grid: {
        show: true,
        borderColor: "#9aa0ac",
        strokeDashArray: 1
      },
      xaxis: {
        type: "datetime",
        categories: ["1990", "1991", "1992", "1993", "1994"]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut",
        width: 250
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      labels: ["India", "USA", "Shrilanka", "Australia", "Japan"],
      responsive: [
        {
          breakpoint: 480,
          options: {}
        }
      ]
    };
    this.avgLecChartOptions = {
      series: [
        {
          name: "Avg. Patient",
          data: [65, 72, 62, 73, 66, 74, 63, 67]
        }
      ],
      chart: {
        height: 340,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        foreColor: "#9aa0ac"
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: ["Jan", "Feb", "March", "Apr", "May", "Jun", "July", "Aug"],
        title: {
          text: "Weekday"
        }
      },
      yaxis: {
        title: {
          text: "Avg. Lecture"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          gradientToColors: ["#35fdd8"],
          shadeIntensity: 1,
          type: "horizontal",
          opacityFrom: 1,
          opacityTo: 1
        }
      },
      grid: {
        show: true,
        borderColor: "#9aa0ac",
        strokeDashArray: 1
      },
      markers: {
        size: 4,
        colors: ["#FFA41B"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  ngOnInit() {
    this.smallChart1();
    this.smallChart2();
    this.smallChart3();
    this.smallChart4();
  }
  smallChart1() {
    this.smallChart1Options = {
      series: [
        {
          name: "Appointments",
          data: [
            50,
            61,
            80,
            50,
            72,
            52,
            60,
            41,
            30,
            45,
            70,
            40,
            93,
            63,
            50,
            62
          ]
        }
      ],
      chart: {
        height: 70,
        type: "area",
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        },
        foreColor: "#9aa0ac"
      },
      colors: ["#6F42C1"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [
          "16-07-2018",
          "17-07-2018",
          "18-07-2018",
          "19-07-2018",
          "20-07-2018",
          "21-07-2018",
          "22-07-2018",
          "23-07-2018",
          "24-07-2018",
          "25-07-2018",
          "26-07-2018",
          "27-07-2018",
          "28-07-2018",
          "29-07-2018",
          "30-07-2018",
          "31-07-2018"
        ]
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  smallChart2() {
    this.smallChart2Options = {
      series: [
        {
          name: "Operations",
          data: [5, 6, 8, 5, 7, 5, 6, 4, 3, 4, 7, 4, 9, 6, 5, 6]
        }
      ],
      chart: {
        height: 70,
        type: "area",
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        },
        foreColor: "#9aa0ac"
      },
      colors: ["#FD7E14"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [
          "16-07-2018",
          "17-07-2018",
          "18-07-2018",
          "19-07-2018",
          "20-07-2018",
          "21-07-2018",
          "22-07-2018",
          "23-07-2018",
          "24-07-2018",
          "25-07-2018",
          "26-07-2018",
          "27-07-2018",
          "28-07-2018",
          "29-07-2018",
          "30-07-2018",
          "31-07-2018"
        ]
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  smallChart3() {
    this.smallChart3Options = {
      series: [
        {
          name: "New Patients",
          data: [
            50,
            61,
            80,
            50,
            72,
            52,
            60,
            41,
            30,
            45,
            70,
            40,
            93,
            63,
            50,
            62
          ]
        }
      ],
      chart: {
        height: 70,
        type: "area",
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        },
        foreColor: "#9aa0ac"
      },
      colors: ["#4CAF50"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [
          "16-07-2018",
          "17-07-2018",
          "18-07-2018",
          "19-07-2018",
          "20-07-2018",
          "21-07-2018",
          "22-07-2018",
          "23-07-2018",
          "24-07-2018",
          "25-07-2018",
          "26-07-2018",
          "27-07-2018",
          "28-07-2018",
          "29-07-2018",
          "30-07-2018",
          "31-07-2018"
        ]
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  smallChart4() {
    this.smallChart4Options = {
      series: [
        {
          name: "Earning",
          data: [
            150,
            161,
            180,
            150,
            172,
            152,
            160,
            141,
            130,
            145,
            170,
            140,
            193,
            163,
            150,
            162
          ]
        }
      ],
      chart: {
        height: 70,
        type: "area",
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        },
        foreColor: "#9aa0ac"
      },
      colors: ["#2196F3"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: [
          "16-07-2018",
          "17-07-2018",
          "18-07-2018",
          "19-07-2018",
          "20-07-2018",
          "21-07-2018",
          "22-07-2018",
          "23-07-2018",
          "24-07-2018",
          "25-07-2018",
          "26-07-2018",
          "27-07-2018",
          "28-07-2018",
          "29-07-2018",
          "30-07-2018",
          "31-07-2018"
        ]
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }
  static {
    this.\u0275fac = function ChartWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChartWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChartWidgetComponent, selectors: [["app-chart-widget"]], viewQuery: function ChartWidgetComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c02, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.chart = _t.first);
      }
    }, decls: 247, vars: 145, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row"], [1, "col-xs-12", "col-sm-12", "col-md-4", "col-lg-4"], ["id", "chart"], [3, "series", "chart", "plotOptions", "labels", "legend", "colors", "responsive"], [1, "col-4"], [1, "text-muted", "font-15", "text-truncate"], [1, "font-b-600"], [1, "fas", "fa-arrow-circle-up", "col-green", "m-r-5"], [1, "fas", "fa-arrow-circle-down", "col-red", "m-r-5"], [1, "text-muted", "text-truncate"], [3, "series", "chart", "xaxis", "stroke", "markers", "fill"], [3, "series", "chart", "xaxis", "stroke", "grid", "tooltip", "dataLabels"], [1, "col-xl-3", "col-lg-6", "col-md-6", "col-sm-6", "col-xs-12"], ["title", "New Employees", "value", "1,025", "percentage", "10", "imageUrl", "assets/images/banner/1.png", 3, "increase"], ["title", "Total Courses", "value", "47", "percentage", "09", "imageUrl", "assets/images/banner/2.png", 3, "increase"], ["title", "Awards", "value", "128", "percentage", "18", "imageUrl", "assets/images/banner/3.png", 3, "increase"], ["title", "Revenue", "value", "$48,697", "percentage", "42", "imageUrl", "assets/images/banner/4.png", 3, "increase"], [1, "col-lg-3", "col-md-3", "col-sm-12"], ["title", "Total Sales", "value", "1500", "description", "Total sales this month", "img", "assets/images/banner/img1.png", "arrowIcon", "trending_up"], ["title", "Total Courses", "value", "125", "description", "Total course this month", "img", "assets/images/banner/img2.png", "arrowIcon", "trending_down"], ["title", "Total Teachers", "value", "89", "description", "12% Higher Then\n        Last Month", "img", "assets/images/banner/img3.png", "arrowIcon", "trending_up"], ["title", "Fees Collection", "value", "$48,697", "description", "22% Less Then\n        Last\n        Month", "img", "assets/images/banner/img4.png", "arrowIcon", "trending_down"], [1, "col-xl-8", "col-lg-8", "col-md-12", "col-sm-12"], [1, "float-start"], [1, "text-muted", "font-12"], [1, "mb-5"], [3, "series", "chart", "xaxis", "stroke", "colors", "dataLabels", "legend", "markers", "grid", "yaxis", "tooltip", "title", "fill"], [1, "col-xl-4", "col-lg-4", "col-md-12", "col-sm-12"], [1, "apex-pie-center", 3, "series", "chart", "labels", "responsive", "dataLabels", "legend"], [1, "table-responsive", "m-t-15"], [1, "table", "align-items-center"], [1, "fa", "fa-circle", "col-cyan", "msr-2"], [1, "col-green"], [1, "fa", "fa-circle", "col-blue", "msr-2"], [1, "fa", "fa-circle", "col-orange", "msr-2"], [1, "col-orange"], [1, "fa", "fa-circle", "col-green", "msr-2"], [1, "col-lg-3", "col-sm-6"], ["title", "Total Students", "value", "2347", "percentageText", "18% Higher Than Last Month", "iconClass", "fas fa-graduation-cap", "bgClass", "bg-c-blue"], ["title", "Total Teachers", "value", "258", "percentageText", "21% Higher Than Last Month", "iconClass", "fas fa-user-tie", "bgClass", "bg-c-green"], ["title", "Awards", "value", "27", "percentageText", "37% Higher Than Last Month", "iconClass", "fas fa-trophy", "bgClass", "bg-c-yellow"], ["title", "Total Earning", "value", "$25,698", "percentageText", "10% Higher Than Last Month", "iconClass", "fas fa-dollar-sign", "bgClass", "bg-c-pink"], [1, "col-12", "col-sm-6", "col-md-3"], ["title", "Today's Income", "subtitle", "Income For Today", "value", "$170", "valueClass", "text-info", "progressClass", "l-bg-purple", "change", "75%", 3, "progress"], ["title", "Total Revenue", "subtitle", "Total Income", "value", "$120", "valueClass", "text-success", "progressClass", "l-bg-orange", "change", "25%", 3, "progress"], ["title", "New Orders", "subtitle", "Fresh New Order", "value", "15", "valueClass", "text-danger", "progressClass", "l-bg-cyan", "change", "50%", 3, "progress"], ["title", "New Users", "subtitle", "Joined New User", "value", "12", "valueClass", "text-secondary", "progressClass", "l-bg-red", "change", "25%", 3, "progress"], [1, "col-xl-3", "col-lg-6"], [3, "cardClass", "iconClass", "title", "value", "progressValue", "progressClass", "percentageChange"], [1, "card", "card-statistic-2"], [1, "clearfix"], [1, "card-right"], [1, "float-end"], [1, "m-r-10", "m-l-10"], [1, "font-weight-bold", "float-end", "mb-0"], [3, "series", "chart", "xaxis", "yaxis", "colors", "stroke", "legend", "tooltip", "dataLabels"], [1, "col-md-6", "col-xl-3"], [3, "icon", "title", "value", "trendDirection", "trendPercentage", "trendText", "colorClass"], [3, "maleCount", "femaleCount"]], template: function ChartWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "mat-card")(7, "mat-card-header")(8, "mat-card-title");
        \u0275\u0275text(9, "Chart Sample");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "mat-card-content")(11, "div", 6);
        \u0275\u0275element(12, "apx-chart", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "div", 4)(14, "div", 8)(15, "p", 9);
        \u0275\u0275text(16, "Target");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "p", 10);
        \u0275\u0275element(18, "i", 11);
        \u0275\u0275text(19, "$15.3k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "div", 8)(21, "p", 9);
        \u0275\u0275text(22, "Last week");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "p", 10);
        \u0275\u0275element(24, "i", 12);
        \u0275\u0275text(25, "$2.8k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(26, "div", 8)(27, "p", 13);
        \u0275\u0275text(28, "Last Month");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "p", 10);
        \u0275\u0275element(30, "i", 11);
        \u0275\u0275text(31, "$12.5k ");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(32, "div", 5)(33, "mat-card")(34, "mat-card-header")(35, "mat-card-title");
        \u0275\u0275text(36, "Chart Sample");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(37, "mat-card-content")(38, "div", 6);
        \u0275\u0275element(39, "apx-chart", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "div", 4)(41, "div", 8)(42, "p", 9);
        \u0275\u0275text(43, "Target");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "p", 10);
        \u0275\u0275element(45, "i", 11);
        \u0275\u0275text(46, "$15.3k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(47, "div", 8)(48, "p", 9);
        \u0275\u0275text(49, "Last week");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "p", 10);
        \u0275\u0275element(51, "i", 12);
        \u0275\u0275text(52, "$2.8k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(53, "div", 8)(54, "p", 13);
        \u0275\u0275text(55, "Last Month");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(56, "p", 10);
        \u0275\u0275element(57, "i", 11);
        \u0275\u0275text(58, "$12.5k ");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(59, "div", 5)(60, "mat-card")(61, "mat-card-header")(62, "mat-card-title");
        \u0275\u0275text(63, "Chart Sample");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(64, "mat-card-content")(65, "div", 6);
        \u0275\u0275element(66, "apx-chart", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(67, "div", 4)(68, "div", 8)(69, "p", 9);
        \u0275\u0275text(70, "Target");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "p", 10);
        \u0275\u0275element(72, "i", 11);
        \u0275\u0275text(73, "$15.3k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(74, "div", 8)(75, "p", 9);
        \u0275\u0275text(76, "Last week");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(77, "p", 10);
        \u0275\u0275element(78, "i", 12);
        \u0275\u0275text(79, "$2.8k ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(80, "div", 8)(81, "p", 13);
        \u0275\u0275text(82, "Last Month");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "p", 10);
        \u0275\u0275element(84, "i", 11);
        \u0275\u0275text(85, "$12.5k ");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(86, "div", 4)(87, "div", 16);
        \u0275\u0275element(88, "app-statistic-card1", 17);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(89, "div", 16);
        \u0275\u0275element(90, "app-statistic-card1", 18);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(91, "div", 16);
        \u0275\u0275element(92, "app-statistic-card1", 19);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "div", 16);
        \u0275\u0275element(94, "app-statistic-card1", 20);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(95, "div", 4)(96, "div", 21);
        \u0275\u0275element(97, "app-statistic-card2", 22);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(98, "div", 21);
        \u0275\u0275element(99, "app-statistic-card2", 23);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(100, "div", 21);
        \u0275\u0275element(101, "app-statistic-card2", 24);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(102, "div", 21);
        \u0275\u0275element(103, "app-statistic-card2", 25);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(104, "div", 4)(105, "div", 26)(106, "mat-card")(107, "mat-card-header")(108, "mat-card-title");
        \u0275\u0275text(109, "Average Lecture Per Month");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(110, "mat-card-content")(111, "div", 27)(112, "h6");
        \u0275\u0275text(113, "65 ");
        \u0275\u0275elementStart(114, "span", 28);
        \u0275\u0275text(115, "(Average)");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(116, "div", 29);
        \u0275\u0275element(117, "apx-chart", 30);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(118, "div", 31)(119, "mat-card")(120, "mat-card-header")(121, "mat-card-title");
        \u0275\u0275text(122, "Country Wise Clients");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(123, "mat-card-content")(124, "div", 6);
        \u0275\u0275element(125, "apx-chart", 32);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(126, "div", 33)(127, "table", 34)(128, "tbody")(129, "tr")(130, "td");
        \u0275\u0275element(131, "i", 35);
        \u0275\u0275text(132, " India");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(133, "td");
        \u0275\u0275text(134, "23");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(135, "td", 36);
        \u0275\u0275text(136, "+32%");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(137, "tr")(138, "td");
        \u0275\u0275element(139, "i", 37);
        \u0275\u0275text(140, "USA");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(141, "td");
        \u0275\u0275text(142, "32");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(143, "td", 36);
        \u0275\u0275text(144, "+12%");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(145, "tr")(146, "td");
        \u0275\u0275element(147, "i", 38);
        \u0275\u0275text(148, "Shrilanka");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(149, "td");
        \u0275\u0275text(150, "12");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(151, "td", 39);
        \u0275\u0275text(152, "-12%");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(153, "tr")(154, "td");
        \u0275\u0275element(155, "i", 40);
        \u0275\u0275text(156, "Australia");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(157, "td");
        \u0275\u0275text(158, "32");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(159, "td", 36);
        \u0275\u0275text(160, "+3%");
        \u0275\u0275elementEnd()()()()()()()()();
        \u0275\u0275elementStart(161, "div", 4)(162, "div", 41);
        \u0275\u0275element(163, "app-order-info-box", 42);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(164, "div", 41);
        \u0275\u0275element(165, "app-order-info-box", 43);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(166, "div", 41);
        \u0275\u0275element(167, "app-order-info-box", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(168, "div", 41);
        \u0275\u0275element(169, "app-order-info-box", 45);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(170, "div", 4)(171, "div", 46);
        \u0275\u0275element(172, "app-income-info-box", 47);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(173, "div", 46);
        \u0275\u0275element(174, "app-income-info-box", 48);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(175, "div", 46);
        \u0275\u0275element(176, "app-income-info-box", 49);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(177, "div", 46);
        \u0275\u0275element(178, "app-income-info-box", 50);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(179, "div", 4)(180, "div", 51);
        \u0275\u0275element(181, "app-info-box1", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(182, "div", 51);
        \u0275\u0275element(183, "app-info-box1", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(184, "div", 51);
        \u0275\u0275element(185, "app-info-box1", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(186, "div", 51);
        \u0275\u0275element(187, "app-info-box1", 52);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(188, "div", 4)(189, "div", 41)(190, "div", 53)(191, "div", 54)(192, "div", 55)(193, "div")(194, "h6", 56);
        \u0275\u0275text(195, "Earning");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(196, "div", 57)(197, "h4", 58);
        \u0275\u0275text(198, " $20,125");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275element(199, "apx-chart", 59);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(200, "div", 41)(201, "div", 53)(202, "div", 54)(203, "div", 55)(204, "div")(205, "h6", 56);
        \u0275\u0275text(206, "New Clients");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(207, "div", 57)(208, "h4", 58);
        \u0275\u0275text(209, " 129");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275element(210, "apx-chart", 59);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(211, "div", 41)(212, "div", 53)(213, "div", 54)(214, "div", 55)(215, "div")(216, "h6", 56);
        \u0275\u0275text(217, "Projects");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(218, "div", 57)(219, "h4", 58);
        \u0275\u0275text(220, "154");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275element(221, "apx-chart", 59);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(222, "div", 41)(223, "div", 53)(224, "div", 54)(225, "div", 55)(226, "div")(227, "h6", 56);
        \u0275\u0275text(228, "Employees");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(229, "div", 57)(230, "h4", 58);
        \u0275\u0275text(231, "650");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275element(232, "apx-chart", 59);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(233, "div", 4)(234, "div", 60);
        \u0275\u0275element(235, "app-info-box2", 61);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(236, "div", 60);
        \u0275\u0275element(237, "app-info-box2", 61);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(238, "div", 60);
        \u0275\u0275element(239, "app-info-box2", 61);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(240, "div", 60);
        \u0275\u0275element(241, "app-info-box2", 61);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(242, "div", 4)(243, "div", 31);
        \u0275\u0275element(244, "app-attendance-chart");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(245, "div", 31);
        \u0275\u0275element(246, "app-chart-card4", 62);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Chart Widget")("items", \u0275\u0275pureFunction0(144, _c1))("active_item", "Chart Widget");
        \u0275\u0275advance(9);
        \u0275\u0275property("series", ctx.circleChartOptions.series)("chart", ctx.circleChartOptions.chart)("plotOptions", ctx.circleChartOptions.plotOptions)("labels", ctx.circleChartOptions.labels)("legend", ctx.circleChartOptions.legend)("colors", ctx.circleChartOptions.colors)("responsive", ctx.circleChartOptions.responsive);
        \u0275\u0275advance(27);
        \u0275\u0275property("series", ctx.radarChartOptions.series)("chart", ctx.radarChartOptions.chart)("xaxis", ctx.radarChartOptions.xaxis)("stroke", ctx.radarChartOptions.stroke)("markers", ctx.radarChartOptions.markers)("fill", ctx.radarChartOptions.fill);
        \u0275\u0275advance(27);
        \u0275\u0275property("series", ctx.areaChartOptions.series)("chart", ctx.areaChartOptions.chart)("xaxis", ctx.areaChartOptions.xaxis)("stroke", ctx.areaChartOptions.stroke)("grid", ctx.areaChartOptions.grid)("tooltip", ctx.areaChartOptions.tooltip)("dataLabels", ctx.areaChartOptions.dataLabels);
        \u0275\u0275advance(22);
        \u0275\u0275property("increase", true);
        \u0275\u0275advance(2);
        \u0275\u0275property("increase", false);
        \u0275\u0275advance(2);
        \u0275\u0275property("increase", true);
        \u0275\u0275advance(2);
        \u0275\u0275property("increase", true);
        \u0275\u0275advance(23);
        \u0275\u0275property("series", ctx.avgLecChartOptions.series)("chart", ctx.avgLecChartOptions.chart)("xaxis", ctx.avgLecChartOptions.xaxis)("stroke", ctx.avgLecChartOptions.stroke)("colors", ctx.avgLecChartOptions.colors)("dataLabels", ctx.avgLecChartOptions.dataLabels)("legend", ctx.avgLecChartOptions.legend)("markers", ctx.avgLecChartOptions.markers)("grid", ctx.avgLecChartOptions.grid)("yaxis", ctx.avgLecChartOptions.yaxis)("tooltip", ctx.avgLecChartOptions.tooltip)("title", ctx.avgLecChartOptions.title)("fill", ctx.avgLecChartOptions.fill);
        \u0275\u0275advance(8);
        \u0275\u0275property("series", ctx.pieChartOptions.series)("chart", ctx.pieChartOptions.chart)("labels", ctx.pieChartOptions.labels)("responsive", ctx.pieChartOptions.responsive)("dataLabels", ctx.pieChartOptions.dataLabels)("legend", ctx.pieChartOptions.legend);
        \u0275\u0275advance(47);
        \u0275\u0275property("progress", 75);
        \u0275\u0275advance(2);
        \u0275\u0275property("progress", 45);
        \u0275\u0275advance(2);
        \u0275\u0275property("progress", 45);
        \u0275\u0275advance(2);
        \u0275\u0275property("progress", 45);
        \u0275\u0275advance(3);
        \u0275\u0275property("cardClass", "l-bg-green-dark")("iconClass", "fa fa-briefcase")("title", "New Projects")("value", 102)("progressValue", 40)("progressClass", "orange-progress")("percentageChange", 10);
        \u0275\u0275advance(2);
        \u0275\u0275property("cardClass", "l-bg-cyan-dark")("iconClass", "fas fa-users")("title", "New Customers")("value", 154)("progressValue", 40)("progressClass", "purple-progress")("percentageChange", 4);
        \u0275\u0275advance(2);
        \u0275\u0275property("cardClass", "l-bg-purple-dark")("iconClass", "fa fa-globe")("title", "Inquiry")("value", 524)("progressValue", 40)("progressClass", "green-progress")("percentageChange", 23);
        \u0275\u0275advance(2);
        \u0275\u0275property("cardClass", "l-bg-orange-dark")("iconClass", "fa fa-money-bill-alt")("title", "Earning")("value", "$2,453")("progressValue", 40)("progressClass", "sky-progress")("percentageChange", -6);
        \u0275\u0275advance(12);
        \u0275\u0275property("series", ctx.smallChart1Options.series)("chart", ctx.smallChart1Options.chart)("xaxis", ctx.smallChart1Options.xaxis)("yaxis", ctx.smallChart1Options.yaxis)("colors", ctx.smallChart1Options.colors)("stroke", ctx.smallChart1Options.stroke)("legend", ctx.smallChart1Options.legend)("tooltip", ctx.smallChart1Options.tooltip)("dataLabels", ctx.smallChart1Options.dataLabels);
        \u0275\u0275advance(11);
        \u0275\u0275property("series", ctx.smallChart2Options.series)("chart", ctx.smallChart2Options.chart)("xaxis", ctx.smallChart2Options.xaxis)("yaxis", ctx.smallChart2Options.yaxis)("colors", ctx.smallChart2Options.colors)("stroke", ctx.smallChart2Options.stroke)("legend", ctx.smallChart2Options.legend)("tooltip", ctx.smallChart2Options.tooltip)("dataLabels", ctx.smallChart2Options.dataLabels);
        \u0275\u0275advance(11);
        \u0275\u0275property("series", ctx.smallChart3Options.series)("chart", ctx.smallChart3Options.chart)("xaxis", ctx.smallChart3Options.xaxis)("yaxis", ctx.smallChart3Options.yaxis)("colors", ctx.smallChart3Options.colors)("stroke", ctx.smallChart3Options.stroke)("legend", ctx.smallChart3Options.legend)("tooltip", ctx.smallChart3Options.tooltip)("dataLabels", ctx.smallChart3Options.dataLabels);
        \u0275\u0275advance(11);
        \u0275\u0275property("series", ctx.smallChart4Options.series)("chart", ctx.smallChart4Options.chart)("xaxis", ctx.smallChart4Options.xaxis)("yaxis", ctx.smallChart4Options.yaxis)("colors", ctx.smallChart4Options.colors)("stroke", ctx.smallChart4Options.stroke)("legend", ctx.smallChart4Options.legend)("tooltip", ctx.smallChart4Options.tooltip)("dataLabels", ctx.smallChart4Options.dataLabels);
        \u0275\u0275advance(3);
        \u0275\u0275property("icon", "shopping_cart")("title", "Total Sales")("value", "258")("trendDirection", "down")("trendPercentage", "10%")("trendText", "Decrease")("colorClass", "purple");
        \u0275\u0275advance(2);
        \u0275\u0275property("icon", "people")("title", "Customers")("value", "1,287")("trendDirection", "up")("trendPercentage", "25%")("trendText", "Increase")("colorClass", "orange");
        \u0275\u0275advance(2);
        \u0275\u0275property("icon", "local_activity")("title", "New Tickets")("value", "128")("trendDirection", "down")("trendPercentage", "12%")("trendText", "Decrease")("colorClass", "green");
        \u0275\u0275advance(2);
        \u0275\u0275property("icon", "attach_money")("title", "Revenue")("value", "$48,697")("trendDirection", "up")("trendPercentage", "08%")("trendText", "Increase")("colorClass", "blue");
        \u0275\u0275advance(5);
        \u0275\u0275property("maleCount", 2078)("femaleCount", 1825);
      }
    }, dependencies: [
      BreadcrumbComponent,
      NgApexchartsModule,
      ChartComponent,
      MatCardModule,
      MatCard,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      StatisticCard1Component,
      OrderInfoBoxComponent,
      IncomeInfoBoxComponent,
      StatisticCard2Component,
      AttendanceChartComponent,
      ChartCard4Component,
      InfoBox1Component,
      InfoBox2Component
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChartWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-chart-widget", imports: [
      BreadcrumbComponent,
      NgApexchartsModule,
      MatCardModule,
      StatisticCard1Component,
      OrderInfoBoxComponent,
      IncomeInfoBoxComponent,
      StatisticCard2Component,
      AttendanceChartComponent,
      ChartCard4Component,
      InfoBox1Component,
      InfoBox2Component
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Chart Widget'" [items]="['Home']" [active_item]="'Chart Widget'"></app-breadcrumb>\r
    </div>\r
    <div class="row">\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Chart Sample</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <div id="chart">\r
              <apx-chart [series]="circleChartOptions.series!" [chart]="circleChartOptions.chart!"\r
                [plotOptions]="circleChartOptions.plotOptions!" [labels]="circleChartOptions.labels!"\r
                [legend]="circleChartOptions.legend!" [colors]="circleChartOptions.colors!"\r
                [responsive]="circleChartOptions.responsive!"></apx-chart>\r
            </div>\r
            <div class="row">\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Target</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$15.3k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Last\r
                  week</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-down col-red m-r-5"></i>$2.8k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted text-truncate">Last\r
                  Month</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$12.5k\r
                </p>\r
              </div>\r
            </div>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Chart Sample</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <div id="chart">\r
              <apx-chart [series]="radarChartOptions.series!" [chart]="radarChartOptions.chart!"\r
                [xaxis]="radarChartOptions.xaxis!" [stroke]="radarChartOptions.stroke!"\r
                [markers]="radarChartOptions.markers!" [fill]="radarChartOptions.fill!"></apx-chart>\r
            </div>\r
            <div class="row">\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Target</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$15.3k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Last\r
                  week</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-down col-red m-r-5"></i>$2.8k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted text-truncate">Last\r
                  Month</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$12.5k\r
                </p>\r
              </div>\r
            </div>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Chart Sample</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <div id="chart">\r
              <apx-chart [series]="areaChartOptions.series!" [chart]="areaChartOptions.chart!"\r
                [xaxis]="areaChartOptions.xaxis!" [stroke]="areaChartOptions.stroke!" [grid]="areaChartOptions.grid!"\r
                [tooltip]="areaChartOptions.tooltip!" [dataLabels]="areaChartOptions.dataLabels!">\r
              </apx-chart>\r
            </div>\r
            <div class="row">\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Target</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$15.3k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted font-15 text-truncate">Last\r
                  week</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-down col-red m-r-5"></i>$2.8k\r
                </p>\r
              </div>\r
              <div class="col-4">\r
                <p class="text-muted text-truncate">Last\r
                  Month</p>\r
                <p class="font-b-600">\r
                  <i class="fas fa-arrow-circle-up col-green m-r-5"></i>$12.5k\r
                </p>\r
              </div>\r
            </div>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <app-statistic-card1 title="New Employees" value="1,025" percentage="10" [increase]="true"\r
          imageUrl="assets/images/banner/1.png">\r
        </app-statistic-card1>\r
      </div>\r
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <app-statistic-card1 title="Total Courses" value="47" percentage="09" [increase]="false"\r
          imageUrl="assets/images/banner/2.png">\r
        </app-statistic-card1>\r
      </div>\r
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <app-statistic-card1 title="Awards" value="128" percentage="18" [increase]="true"\r
          imageUrl="assets/images/banner/3.png">\r
        </app-statistic-card1>\r
      </div>\r
      <div class="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <app-statistic-card1 title="Revenue" value="$48,697" percentage="42" [increase]="true"\r
          imageUrl="assets/images/banner/4.png">\r
        </app-statistic-card1>\r
      </div>\r
    </div>\r
\r
    <div class="row">\r
      <div class="col-lg-3 col-md-3 col-sm-12">\r
        <app-statistic-card2 title="Total Sales" value="1500" description="Total sales this month"\r
          img="assets/images/banner/img1.png" arrowIcon="trending_up">\r
        </app-statistic-card2>\r
      </div>\r
      <div class="col-lg-3 col-md-3 col-sm-12">\r
        <app-statistic-card2 title="Total Courses" value="125" description="Total course this month"\r
          img="assets/images/banner/img2.png" arrowIcon="trending_down">\r
        </app-statistic-card2>\r
      </div>\r
      <div class="col-lg-3 col-md-3 col-sm-12">\r
        <app-statistic-card2 title="Total Teachers" value="89" description="12% Higher Then\r
        Last Month" img="assets/images/banner/img3.png" arrowIcon="trending_up">\r
        </app-statistic-card2>\r
      </div>\r
      <div class="col-lg-3 col-md-3 col-sm-12">\r
        <app-statistic-card2 title="Fees Collection" value="$48,697" description="22% Less Then\r
        Last\r
        Month" img="assets/images/banner/img4.png" arrowIcon="trending_down">\r
        </app-statistic-card2>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-8 col-lg-8 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Average Lecture Per Month</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <div class="float-start">\r
              <h6>65 <span class="text-muted font-12">(Average)</span></h6>\r
            </div>\r
            <div class="mb-5">\r
              <apx-chart [series]="avgLecChartOptions.series!" [chart]="avgLecChartOptions.chart!"\r
                [xaxis]="avgLecChartOptions.xaxis!" [stroke]="avgLecChartOptions.stroke!"\r
                [colors]="avgLecChartOptions.colors!" [dataLabels]="avgLecChartOptions.dataLabels!"\r
                [legend]="avgLecChartOptions.legend!" [markers]="avgLecChartOptions.markers!"\r
                [grid]="avgLecChartOptions.grid!" [yaxis]="avgLecChartOptions.yaxis!"\r
                [tooltip]="avgLecChartOptions.tooltip!" [title]="avgLecChartOptions.title!"\r
                [fill]="avgLecChartOptions.fill!">\r
              </apx-chart>\r
            </div>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Country Wise Clients</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <div id="chart">\r
              <apx-chart [series]="pieChartOptions.series!" [chart]="pieChartOptions.chart!"\r
                [labels]="pieChartOptions.labels!" [responsive]="pieChartOptions.responsive!"\r
                [dataLabels]="pieChartOptions.dataLabels!" [legend]="pieChartOptions.legend!" class="apex-pie-center">\r
              </apx-chart>\r
            </div>\r
            <div class="table-responsive m-t-15">\r
              <table class="table align-items-center">\r
                <tbody>\r
                  <tr>\r
                    <td><i class="fa fa-circle col-cyan msr-2"></i> India</td>\r
                    <td>23</td>\r
                    <td class="col-green">+32%</td>\r
                  </tr>\r
                  <tr>\r
                    <td><i class="fa fa-circle col-blue msr-2"></i>USA</td>\r
                    <td>32</td>\r
                    <td class="col-green">+12%</td>\r
                  </tr>\r
                  <tr>\r
                    <td><i class="fa fa-circle col-orange msr-2"></i>Shrilanka</td>\r
                    <td>12</td>\r
                    <td class="col-orange">-12%</td>\r
                  </tr>\r
                  <tr>\r
                    <td><i class="fa fa-circle col-green msr-2"></i>Australia</td>\r
                    <td>32</td>\r
                    <td class="col-green">+3%</td>\r
                  </tr>\r
                </tbody>\r
              </table>\r
            </div>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-lg-3 col-sm-6">\r
        <app-order-info-box title="Total Students" value="2347" percentageText="18% Higher Than Last Month"\r
          iconClass="fas fa-graduation-cap" bgClass="bg-c-blue">\r
        </app-order-info-box>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <app-order-info-box title="Total Teachers" value="258" percentageText="21% Higher Than Last Month"\r
          iconClass="fas fa-user-tie" bgClass="bg-c-green">\r
        </app-order-info-box>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <app-order-info-box title="Awards" value="27" percentageText="37% Higher Than Last Month"\r
          iconClass="fas fa-trophy" bgClass="bg-c-yellow">\r
        </app-order-info-box>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <app-order-info-box title="Total Earning" value="$25,698" percentageText="10% Higher Than Last Month"\r
          iconClass="fas fa-dollar-sign" bgClass="bg-c-pink">\r
        </app-order-info-box>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-12 col-sm-6 col-md-3">\r
        <app-income-info-box title="Today's Income" subtitle="Income For Today" value="$170" valueClass="text-info"\r
          [progress]="75" progressClass="l-bg-purple" change="75%">\r
        </app-income-info-box>\r
      </div>\r
      <div class="col-12 col-sm-6 col-md-3">\r
        <app-income-info-box title="Total Revenue" subtitle="Total Income" value="$120" valueClass="text-success"\r
          [progress]="45" progressClass="l-bg-orange" change="25%">\r
        </app-income-info-box>\r
      </div>\r
      <div class="col-12 col-sm-6 col-md-3">\r
        <app-income-info-box title="New Orders" subtitle="Fresh New Order" value="15" valueClass="text-danger"\r
          [progress]="45" progressClass="l-bg-cyan" change="50%">\r
        </app-income-info-box>\r
      </div>\r
      <div class="col-12 col-sm-6 col-md-3">\r
        <app-income-info-box title="New Users" subtitle="Joined New User" value="12" valueClass="text-secondary"\r
          [progress]="45" progressClass="l-bg-red" change="25%">\r
        </app-income-info-box>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-3 col-lg-6">\r
        <app-info-box1 [cardClass]="'l-bg-green-dark'" [iconClass]="'fa fa-briefcase'" [title]="'New Projects'"\r
          [value]="102" [progressValue]="40" [progressClass]="'orange-progress'" [percentageChange]="10">\r
        </app-info-box1>\r
      </div>\r
\r
      <div class="col-xl-3 col-lg-6">\r
        <app-info-box1 [cardClass]="'l-bg-cyan-dark'" [iconClass]="'fas fa-users'" [title]="'New Customers'"\r
          [value]="154" [progressValue]="40" [progressClass]="'purple-progress'" [percentageChange]="4">\r
        </app-info-box1>\r
      </div>\r
\r
      <div class="col-xl-3 col-lg-6">\r
        <app-info-box1 [cardClass]="'l-bg-purple-dark'" [iconClass]="'fa fa-globe'" [title]="'Inquiry'" [value]="524"\r
          [progressValue]="40" [progressClass]="'green-progress'" [percentageChange]="23">\r
        </app-info-box1>\r
      </div>\r
\r
      <div class="col-xl-3 col-lg-6">\r
        <app-info-box1 [cardClass]="'l-bg-orange-dark'" [iconClass]="'fa fa-money-bill-alt'" [title]="'Earning'"\r
          [value]="'$2,453'" [progressValue]="40" [progressClass]="'sky-progress'" [percentageChange]="-6">\r
        </app-info-box1>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-lg-3 col-sm-6">\r
        <div class="card card-statistic-2">\r
          <div class="clearfix">\r
            <div class="card-right">\r
              <div>\r
                <h6 class="float-end">Earning</h6>\r
              </div>\r
              <div class="m-r-10 m-l-10">\r
                <h4 class="font-weight-bold float-end mb-0"> $20,125</h4>\r
              </div>\r
            </div>\r
          </div>\r
          <apx-chart [series]="smallChart1Options.series!" [chart]="smallChart1Options.chart!"\r
            [xaxis]="smallChart1Options.xaxis!" [yaxis]="smallChart1Options.yaxis!"\r
            [colors]="smallChart1Options.colors!" [stroke]="smallChart1Options.stroke!"\r
            [legend]="smallChart1Options.legend!" [tooltip]="smallChart1Options.tooltip!"\r
            [dataLabels]="smallChart1Options.dataLabels!"></apx-chart>\r
        </div>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <div class="card card-statistic-2">\r
          <div class="clearfix">\r
            <div class="card-right">\r
              <div>\r
                <h6 class="float-end">New Clients</h6>\r
              </div>\r
              <div class="m-r-10 m-l-10">\r
                <h4 class="font-weight-bold float-end mb-0"> 129</h4>\r
              </div>\r
            </div>\r
          </div>\r
          <apx-chart [series]="smallChart2Options.series!" [chart]="smallChart2Options.chart!"\r
            [xaxis]="smallChart2Options.xaxis!" [yaxis]="smallChart2Options.yaxis!"\r
            [colors]="smallChart2Options.colors!" [stroke]="smallChart2Options.stroke!"\r
            [legend]="smallChart2Options.legend!" [tooltip]="smallChart2Options.tooltip!"\r
            [dataLabels]="smallChart2Options.dataLabels!"></apx-chart>\r
        </div>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <div class="card card-statistic-2">\r
          <div class="clearfix">\r
            <div class="card-right">\r
              <div>\r
                <h6 class="float-end">Projects</h6>\r
              </div>\r
              <div class="m-r-10 m-l-10">\r
                <h4 class="font-weight-bold float-end mb-0">154</h4>\r
              </div>\r
            </div>\r
          </div>\r
          <apx-chart [series]="smallChart3Options.series!" [chart]="smallChart3Options.chart!"\r
            [xaxis]="smallChart3Options.xaxis!" [yaxis]="smallChart3Options.yaxis!"\r
            [colors]="smallChart3Options.colors!" [stroke]="smallChart3Options.stroke!"\r
            [legend]="smallChart3Options.legend!" [tooltip]="smallChart3Options.tooltip!"\r
            [dataLabels]="smallChart3Options.dataLabels!"></apx-chart>\r
        </div>\r
      </div>\r
      <div class="col-lg-3 col-sm-6">\r
        <div class="card card-statistic-2">\r
          <div class="clearfix">\r
            <div class="card-right">\r
              <div>\r
                <h6 class="float-end">Employees</h6>\r
              </div>\r
              <div class="m-r-10 m-l-10">\r
                <h4 class="font-weight-bold float-end mb-0">650</h4>\r
              </div>\r
            </div>\r
          </div>\r
          <apx-chart [series]="smallChart4Options.series!" [chart]="smallChart4Options.chart!"\r
            [xaxis]="smallChart4Options.xaxis!" [yaxis]="smallChart4Options.yaxis!"\r
            [colors]="smallChart4Options.colors!" [stroke]="smallChart4Options.stroke!"\r
            [legend]="smallChart4Options.legend!" [tooltip]="smallChart4Options.tooltip!"\r
            [dataLabels]="smallChart4Options.dataLabels!"></apx-chart>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-md-6 col-xl-3">\r
        <app-info-box2 [icon]="'shopping_cart'" [title]="'Total Sales'" [value]="'258'" [trendDirection]="'down'"\r
          [trendPercentage]="'10%'" [trendText]="'Decrease'" [colorClass]="'purple'">\r
        </app-info-box2>\r
      </div>\r
      <div class="col-md-6 col-xl-3">\r
        <app-info-box2 [icon]="'people'" [title]="'Customers'" [value]="'1,287'" [trendDirection]="'up'"\r
          [trendPercentage]="'25%'" [trendText]="'Increase'" [colorClass]="'orange'">\r
        </app-info-box2>\r
      </div>\r
      <div class="col-md-6 col-xl-3">\r
        <app-info-box2 [icon]="'local_activity'" [title]="'New Tickets'" [value]="'128'" [trendDirection]="'down'"\r
          [trendPercentage]="'12%'" [trendText]="'Decrease'" [colorClass]="'green'">\r
        </app-info-box2>\r
      </div>\r
      <div class="col-md-6 col-xl-3">\r
        <app-info-box2 [icon]="'attach_money'" [title]="'Revenue'" [value]="'$48,697'" [trendDirection]="'up'"\r
          [trendPercentage]="'08%'" [trendText]="'Increase'" [colorClass]="'blue'">\r
        </app-info-box2>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <app-attendance-chart></app-attendance-chart>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <app-chart-card4 [maleCount]="2078" [femaleCount]="1825">\r
        </app-chart-card4>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], { chart: [{
    type: ViewChild,
    args: ["chart", { static: true }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChartWidgetComponent, { className: "ChartWidgetComponent", filePath: "src/app/widget/chart-widget/chart-widget.component.ts", lineNumber: 117 });
})();

// src/app/shared/components/activity-list/activity-list.component.ts
function ActivityListComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2)(1, "div", 3);
    \u0275\u0275element(2, "img", 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 5)(4, "span", 6);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275text(6);
    \u0275\u0275elementStart(7, "small", 7);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "p", 8);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const activity_r1 = ctx.$implicit;
    \u0275\u0275property("ngClass", activity_r1.isActive ? "active-feed" : "diactive-feed");
    \u0275\u0275advance(2);
    \u0275\u0275property("src", activity_r1.userImage, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", activity_r1.labelStyle);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(activity_r1.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", activity_r1.userName, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(activity_r1.time);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", activity_r1.message, " ");
  }
}
var ActivityListComponent = class _ActivityListComponent {
  constructor() {
    this.activities = [];
  }
  static {
    this.\u0275fac = function ActivityListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ActivityListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ActivityListComponent, selectors: [["app-activity-list"]], inputs: { activities: "activities" }, decls: 4, vars: 0, consts: [[1, "assign-style"], [1, "feedBody"], [3, "ngClass"], [1, "feed-user-img"], ["alt", "User-Profile-Image", 1, "img-radius", 3, "src"], [1, "font-14", "m-b-10", "font-b-500"], [1, "feedLblStyle", 3, "ngClass"], [1, "text-muted", "float-end"], [1, "m-b-15", "m-t-15"]], template: function ActivityListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "ul", 1);
        \u0275\u0275repeaterCreate(2, ActivityListComponent_For_3_Template, 11, 7, "li", 2, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.activities);
      }
    }, dependencies: [NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActivityListComponent, [{
    type: Component,
    args: [{ selector: "app-activity-list", imports: [NgClass], template: `<div class="assign-style">\r
  <ul class="feedBody">\r
    @for (activity of activities; track activity) {\r
      <li [ngClass]="activity.isActive ? 'active-feed' : 'diactive-feed'">\r
        <div class="feed-user-img">\r
          <img [src]="activity.userImage" class="img-radius" alt="User-Profile-Image">\r
        </div>\r
        <div class="font-14 m-b-10 font-b-500">\r
          <span class="feedLblStyle" [ngClass]="activity.labelStyle">{{ activity.label }}</span> {{\r
          activity.userName }}\r
          <small class="text-muted float-end">{{ activity.time }}</small>\r
        </div>\r
        <p class="m-b-15 m-t-15">\r
          {{ activity.message }}\r
        </p>\r
      </li>\r
    }\r
  </ul>\r
</div>` }]
  }], null, { activities: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ActivityListComponent, { className: "ActivityListComponent", filePath: "src/app/shared/components/activity-list/activity-list.component.ts", lineNumber: 20 });
})();

// src/app/shared/components/assign-task/assign-task.component.ts
var _c03 = () => ["userImage", "userName", "taskDetails", "status", "progress"];
function AssignTaskComponent_th_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 12);
    \u0275\u0275text(1, " Img ");
    \u0275\u0275elementEnd();
  }
}
function AssignTaskComponent_td_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13);
    \u0275\u0275element(1, "img", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", task_r1.userImage, \u0275\u0275sanitizeUrl);
  }
}
function AssignTaskComponent_th_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 15)(1, "span", 16);
    \u0275\u0275text(2, "User Name");
    \u0275\u0275elementEnd()();
  }
}
function AssignTaskComponent_td_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13)(1, "span", 16);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r2.userName);
  }
}
function AssignTaskComponent_th_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 12);
    \u0275\u0275text(1, " Task ");
    \u0275\u0275elementEnd();
  }
}
function AssignTaskComponent_td_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", task_r3.taskDetails, " ");
  }
}
function AssignTaskComponent_th_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 12);
    \u0275\u0275text(1, " Status ");
    \u0275\u0275elementEnd();
  }
}
function AssignTaskComponent_td_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13)(1, "span", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", task_r4.statusClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(task_r4.status);
  }
}
function AssignTaskComponent_th_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 12);
    \u0275\u0275text(1, " Manager ");
    \u0275\u0275elementEnd();
  }
}
function AssignTaskComponent_td_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const task_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", task_r5.manager, " ");
  }
}
function AssignTaskComponent_th_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 12);
    \u0275\u0275text(1, " Progress ");
    \u0275\u0275elementEnd();
  }
}
function AssignTaskComponent_td_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 13)(1, "div", 18);
    \u0275\u0275element(2, "div", 19);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const task_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", task_r6.progress, "%");
    \u0275\u0275property("ngClass", task_r6.progressClass);
  }
}
function AssignTaskComponent_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 20);
  }
}
function AssignTaskComponent_tr_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 21);
  }
}
var AssignTaskComponent = class _AssignTaskComponent {
  constructor() {
    this.tasks = [];
  }
  static {
    this.\u0275fac = function AssignTaskComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AssignTaskComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AssignTaskComponent, selectors: [["app-assign-task"]], inputs: { tasks: "tasks" }, decls: 21, vars: 5, consts: [["mat-table", "", 1, "mat-elevation-z8", 3, "dataSource"], ["matColumnDef", "userImage"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "userName"], ["mat-header-cell", "", "mat-sort-header", "", 4, "matHeaderCellDef"], ["matColumnDef", "taskDetails"], ["matColumnDef", "status"], ["matColumnDef", "manager"], ["matColumnDef", "progress"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["mat-header-cell", ""], ["mat-cell", ""], ["alt", "", 1, "user-image", 3, "src"], ["mat-header-cell", "", "mat-sort-header", ""], [1, "truncate-text"], [1, "label", 3, "ngClass"], [1, "progress", "progress-xs"], [1, "progress-bar", 3, "ngClass"], ["mat-header-row", ""], ["mat-row", ""]], template: function AssignTaskComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "table", 0);
        \u0275\u0275elementContainerStart(1, 1);
        \u0275\u0275template(2, AssignTaskComponent_th_2_Template, 2, 0, "th", 2)(3, AssignTaskComponent_td_3_Template, 2, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(4, 4);
        \u0275\u0275template(5, AssignTaskComponent_th_5_Template, 3, 0, "th", 5)(6, AssignTaskComponent_td_6_Template, 3, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(7, 6);
        \u0275\u0275template(8, AssignTaskComponent_th_8_Template, 2, 0, "th", 2)(9, AssignTaskComponent_td_9_Template, 2, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(10, 7);
        \u0275\u0275template(11, AssignTaskComponent_th_11_Template, 2, 0, "th", 2)(12, AssignTaskComponent_td_12_Template, 3, 2, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(13, 8);
        \u0275\u0275template(14, AssignTaskComponent_th_14_Template, 2, 0, "th", 2)(15, AssignTaskComponent_td_15_Template, 2, 1, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(16, 9);
        \u0275\u0275template(17, AssignTaskComponent_th_17_Template, 2, 0, "th", 2)(18, AssignTaskComponent_td_18_Template, 3, 3, "td", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(19, AssignTaskComponent_tr_19_Template, 1, 0, "tr", 10)(20, AssignTaskComponent_tr_20_Template, 1, 0, "tr", 11);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("dataSource", ctx.tasks);
        \u0275\u0275advance(19);
        \u0275\u0275property("matHeaderRowDef", \u0275\u0275pureFunction0(3, _c03));
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", \u0275\u0275pureFunction0(4, _c03));
      }
    }, dependencies: [MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, CommonModule, NgClass], styles: ["\n\n[_nghost-%COMP%]     .user-image {\n  border-radius: 50%;\n}\n/*# sourceMappingURL=assign-task.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AssignTaskComponent, [{
    type: Component,
    args: [{ selector: "app-assign-task", imports: [MatTableModule, CommonModule], template: `<table mat-table [dataSource]="tasks" class="mat-elevation-z8">\r
\r
    <!-- User Image Column -->\r
    <ng-container matColumnDef="userImage">\r
        <th mat-header-cell *matHeaderCellDef> Img </th>\r
        <td mat-cell *matCellDef="let task">\r
            <img [src]="task.userImage" alt="" class="user-image">\r
        </td>\r
    </ng-container>\r
\r
    <ng-container matColumnDef="userName">\r
        <th mat-header-cell *matHeaderCellDef mat-sort-header>\r
            <span class="truncate-text">User Name</span>\r
        </th>\r
        <td mat-cell *matCellDef="let task">\r
            <span class="truncate-text">{{task.userName}}</span>\r
        </td>\r
    </ng-container>\r
\r
    <!-- Task Name Column -->\r
    <ng-container matColumnDef="taskDetails">\r
        <th mat-header-cell *matHeaderCellDef> Task </th>\r
        <td mat-cell *matCellDef="let task"> {{task.taskDetails}} </td>\r
    </ng-container>\r
\r
    <!-- Status Column -->\r
    <ng-container matColumnDef="status">\r
        <th mat-header-cell *matHeaderCellDef> Status </th>\r
        <td mat-cell *matCellDef="let task">\r
            <span [ngClass]="task.statusClass" class="label">{{task.status}}</span>\r
        </td>\r
    </ng-container>\r
\r
    <!-- Manager Column -->\r
    <ng-container matColumnDef="manager">\r
        <th mat-header-cell *matHeaderCellDef> Manager </th>\r
        <td mat-cell *matCellDef="let task"> {{task.manager}} </td>\r
    </ng-container>\r
\r
    <!-- Progress Column -->\r
    <ng-container matColumnDef="progress">\r
        <th mat-header-cell *matHeaderCellDef> Progress </th>\r
        <td mat-cell *matCellDef="let task">\r
            <div class="progress progress-xs">\r
                <div [ngClass]="task.progressClass" class="progress-bar" [style.width.%]="task.progress">\r
                </div>\r
            </div>\r
        </td>\r
    </ng-container>\r
\r
    <tr mat-header-row *matHeaderRowDef="['userImage', 'userName', 'taskDetails', 'status', 'progress']">\r
    </tr>\r
    <tr mat-row *matRowDef="let row; columns: ['userImage', 'userName', 'taskDetails', 'status', 'progress'];"></tr>\r
</table>`, styles: ["/* src/app/shared/components/assign-task/assign-task.component.scss */\n:host ::ng-deep .user-image {\n  border-radius: 50%;\n}\n/*# sourceMappingURL=assign-task.component.css.map */\n"] }]
  }], null, { tasks: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AssignTaskComponent, { className: "AssignTaskComponent", filePath: "src/app/shared/components/assign-task/assign-task.component.ts", lineNumber: 22 });
})();

// src/app/shared/components/chat-widget/chat-widget.component.ts
var _c04 = (a0) => ({ "clearfix": a0 });
var _c12 = (a0) => ({ "text-end": a0 });
var _c2 = (a0, a1) => ({ "zmdi-circle": a0, "zmdi-circle online": a1 });
var _c3 = (a0, a1) => ({ "my-message": a0, "other-message": a1 });
function ChatWidgetComponent_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 8)(1, "div", 13)(2, "span", 14);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " \xA0 \xA0 ");
    \u0275\u0275elementStart(5, "span", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "i", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 17)(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const message_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(7, _c04, message_r1.sender !== ctx_r1.userName));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c12, message_r1.sender === ctx_r1.userName));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r1.time);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(message_r1.sender);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(11, _c2, message_r1.sender === ctx_r1.userName, message_r1.sender !== ctx_r1.userName));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(14, _c3, message_r1.sender === ctx_r1.userName, message_r1.sender !== ctx_r1.userName));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r1.text);
  }
}
var ChatWidgetComponent = class _ChatWidgetComponent {
  constructor() {
    this.avatar = "assets/images/user/user2.jpg";
    this.userName = "Aiden Chavez";
    this.newMessagesCount = 0;
    this.messages = [];
    this.messageSent = new EventEmitter();
    this.messageText = "";
  }
  sendMessage() {
    if (this.messageText.trim()) {
      const newMessage = {
        sender: this.userName,
        text: this.messageText,
        time: (/* @__PURE__ */ new Date()).toLocaleTimeString()
      };
      this.messages.push(newMessage);
      this.messageSent.emit(this.messageText);
      this.messageText = "";
    }
  }
  static {
    this.\u0275fac = function ChatWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatWidgetComponent, selectors: [["app-chat-widget"]], inputs: { avatar: "avatar", userName: "userName", newMessagesCount: "newMessagesCount", messages: "messages" }, outputs: { messageSent: "messageSent" }, decls: 17, vars: 4, consts: [[1, "chat"], [1, "chat-header", "clearfix"], ["alt", "avatar", 3, "src"], [1, "chat-about"], [1, "chat-with"], [1, "chat-num-messages"], ["visibility", "hover", 2, "height", "270px"], ["id", "chat-conversation", 1, "chat-history"], [3, "ngClass"], [1, "chat-message", "clearfix"], [1, "form-line"], [1, "example-full-width"], ["matInput", "", "placeholder", "Enter text here...", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "message-data", 3, "ngClass"], [1, "message-data-time"], [1, "message-data-name"], [1, "zmdi", 3, "ngClass"], [1, "message", 3, "ngClass"]], template: function ChatWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "img", 2);
        \u0275\u0275elementStart(3, "div", 3)(4, "div", 4);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 5);
        \u0275\u0275text(7);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(8, "ng-scrollbar", 6)(9, "div", 7)(10, "ul");
        \u0275\u0275repeaterCreate(11, ChatWidgetComponent_For_12_Template, 11, 17, "li", 8, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 9)(14, "div", 10)(15, "mat-form-field", 11)(16, "input", 12);
        \u0275\u0275twoWayListener("ngModelChange", function ChatWidgetComponent_Template_input_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.messageText, $event) || (ctx.messageText = $event);
          return $event;
        });
        \u0275\u0275listener("keydown.enter", function ChatWidgetComponent_Template_input_keydown_enter_16_listener() {
          return ctx.sendMessage();
        });
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("src", ctx.avatar, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.userName);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.newMessagesCount, " new messages");
        \u0275\u0275advance(4);
        \u0275\u0275repeater(ctx.messages);
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.messageText);
      }
    }, dependencies: [
      NgScrollbar,
      MatFormFieldModule,
      MatFormField,
      MatInputModule,
      MatInput,
      FormsModule,
      DefaultValueAccessor,
      NgControlStatus,
      NgModel,
      NgClass
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-chat-widget", imports: [
      NgScrollbar,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      NgClass
    ], template: `<div class="chat">\r
  <div class="chat-header clearfix">\r
    <img [src]="avatar" alt="avatar">\r
    <div class="chat-about">\r
      <div class="chat-with">{{ userName }}</div>\r
      <div class="chat-num-messages">{{ newMessagesCount }} new messages</div>\r
    </div>\r
  </div>\r
\r
  <ng-scrollbar style="height: 270px" visibility="hover">\r
    <div class="chat-history" id="chat-conversation">\r
      <ul>\r
        @for (message of messages; track message) {\r
          <li [ngClass]="{'clearfix': message.sender !== userName}">\r
            <div class="message-data" [ngClass]="{ 'text-end': message.sender === userName }">\r
              <span class="message-data-time">{{ message.time }}</span> &nbsp; &nbsp;\r
              <span class="message-data-name">{{ message.sender }}</span>\r
              <i class="zmdi"\r
              [ngClass]="{'zmdi-circle': message.sender === userName, 'zmdi-circle online': message.sender !== userName}"></i>\r
            </div>\r
            <div class="message"\r
              [ngClass]="{'my-message': message.sender === userName, 'other-message': message.sender !== userName}">\r
              <p>{{ message.text }}</p>\r
            </div>\r
          </li>\r
        }\r
      </ul>\r
    </div>\r
  </ng-scrollbar>\r
\r
  <div class="chat-message clearfix">\r
    <div class="form-line">\r
      <mat-form-field class="example-full-width">\r
        <input matInput [(ngModel)]="messageText" placeholder="Enter text here..."\r
          (keydown.enter)="sendMessage()">\r
        </mat-form-field>\r
      </div>\r
    </div>\r
  </div>` }]
  }], null, { avatar: [{
    type: Input
  }], userName: [{
    type: Input
  }], newMessagesCount: [{
    type: Input
  }], messages: [{
    type: Input
  }], messageSent: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatWidgetComponent, { className: "ChatWidgetComponent", filePath: "src/app/shared/components/chat-widget/chat-widget.component.ts", lineNumber: 26 });
})();

// src/app/shared/components/document-list/document-list.component.ts
var _c05 = (a0, a1) => ["msr-3", "align-self-center", "img-icon", a0, a1];
function DocumentListComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li", 1)(1, "span", 2);
    \u0275\u0275element(2, "i", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3)(4, "div", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 5)(9, "td")(10, "i", 6);
    \u0275\u0275listener("click", function DocumentListComponent_For_2_Template_i_click_10_listener() {
      const document_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onDelete(document_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "i", 7);
    \u0275\u0275listener("click", function DocumentListComponent_For_2_Template_i_click_11_listener() {
      const document_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onDownload(document_r2));
    });
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const document_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction2(5, _c05, document_r2.iconClass, document_r2.textClass));
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", document_r2.icon);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(document_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", document_r2.type, ", ", document_r2.size, " MB");
  }
}
var DocumentListComponent = class _DocumentListComponent {
  constructor() {
    this.documents = [];
  }
  onDelete(document) {
  }
  onDownload(document) {
  }
  static {
    this.\u0275fac = function DocumentListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DocumentListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DocumentListComponent, selectors: [["app-document-list"]], inputs: { documents: "documents" }, decls: 3, vars: 0, consts: [[1, "list-unstyled"], [1, "d-flex", "mb-3"], [3, "ngClass"], [1, "set-flex"], [1, "font-14", "font-b-500", "mb-1"], [1, "ms-auto"], [1, "far", "fa-trash-alt", "psr-3", 3, "click"], [1, "far", "fa-arrow-alt-circle-down", 3, "click"]], template: function DocumentListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275repeaterCreate(1, DocumentListComponent_For_2_Template, 12, 8, "li", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.documents);
      }
    }, dependencies: [NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DocumentListComponent, [{
    type: Component,
    args: [{ selector: "app-document-list", imports: [NgClass], template: `<ul class="list-unstyled">\r
  @for (document of documents; track document) {\r
    <li class="d-flex mb-3">\r
      <span [ngClass]="['msr-3', 'align-self-center', 'img-icon', document.iconClass, document.textClass]">\r
        <i [ngClass]="document.icon"></i>\r
      </span>\r
      <div class="set-flex">\r
        <div class="font-14 font-b-500 mb-1">{{ document.title }}</div>\r
        <p>{{ document.type }}, {{ document.size }} MB</p>\r
      </div>\r
      <div class="ms-auto">\r
        <td>\r
          <i class="far fa-trash-alt psr-3" (click)="onDelete(document)"></i>\r
          <i class="far fa-arrow-alt-circle-down" (click)="onDownload(document)"></i>\r
        </td>\r
      </div>\r
    </li>\r
  }\r
</ul>` }]
  }], null, { documents: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DocumentListComponent, { className: "DocumentListComponent", filePath: "src/app/shared/components/document-list/document-list.component.ts", lineNumber: 19 });
})();

// src/app/shared/components/emp-schedule/emp-schedule.component.ts
function EmpScheduleComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 1);
    \u0275\u0275element(1, "img", 2);
    \u0275\u0275elementStart(2, "div", 3)(3, "div", 4);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 5);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 6)(8, "div", 4);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 5);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const schedule_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", schedule_r1.imageUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(schedule_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(schedule_r1.degree);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(schedule_r1.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(schedule_r1.time);
  }
}
var EmpScheduleComponent = class _EmpScheduleComponent {
  constructor() {
    this.schedules = [];
  }
  static {
    this.\u0275fac = function EmpScheduleComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EmpScheduleComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmpScheduleComponent, selectors: [["app-emp-schedule"]], inputs: { schedules: "schedules" }, decls: 3, vars: 0, consts: [[1, "list-unstyled", "user-progress", "list-unstyled-border", "list-unstyled-noborder"], [1, "lecture-list"], ["alt", "image", "width", "40", 1, "msr-3", "rounded-circle", 3, "src"], [1, ""], [1, "media-title", "font-14", "font-b-500"], [1, "text-job", "text-muted", "mb-0", "font-12"], [1, "ms-auto"]], template: function EmpScheduleComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275repeaterCreate(1, EmpScheduleComponent_For_2_Template, 12, 5, "li", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.schedules);
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmpScheduleComponent, [{
    type: Component,
    args: [{ selector: "app-emp-schedule", imports: [], template: '<ul class="list-unstyled user-progress list-unstyled-border list-unstyled-noborder">\r\n    @for (schedule of schedules; track schedule) {\r\n    <li class="lecture-list">\r\n        <img alt="image" class="msr-3 rounded-circle" width="40" [src]="schedule.imageUrl">\r\n        <div class="">\r\n            <div class="media-title font-14 font-b-500">{{ schedule.name }}</div>\r\n            <div class="text-job text-muted mb-0 font-12">{{ schedule.degree }}</div>\r\n        </div>\r\n        <div class="ms-auto">\r\n            <div class="media-title font-14 font-b-500">{{ schedule.date }}</div>\r\n            <div class="text-job text-muted mb-0 font-12">{{ schedule.time }}</div>\r\n        </div>\r\n    </li>\r\n    }\r\n</ul>' }]
  }], null, { schedules: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmpScheduleComponent, { className: "EmpScheduleComponent", filePath: "src/app/shared/components/emp-schedule/emp-schedule.component.ts", lineNumber: 17 });
})();

// src/app/shared/components/emp-status/emp-status.component.ts
function EmpStatusComponent_mat_header_cell_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 9)(1, "span", 10);
    \u0275\u0275text(2, "Employee Name");
    \u0275\u0275elementEnd()();
  }
}
function EmpStatusComponent_mat_cell_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275element(1, "img", 11);
    \u0275\u0275elementStart(2, "span", 10)(3, "div", 12)(4, "a", 13);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 14);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const emp_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", emp_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275property("href", "mailto:" + emp_r1.email, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(emp_r1.qualification);
  }
}
function EmpStatusComponent_mat_header_cell_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, "Status");
    \u0275\u0275elementEnd();
  }
}
function EmpStatusComponent_mat_cell_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell")(1, "div", 15);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const emp_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", emp_r2.statusClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(emp_r2.status);
  }
}
function EmpStatusComponent_mat_header_row_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function EmpStatusComponent_mat_row_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-row");
  }
}
var EmpStatusComponent = class _EmpStatusComponent {
  constructor() {
    this.empDisplayedColumns = ["name", "status"];
    this.empDataSource = [
      {
        image: "assets/images/user/user5.jpg",
        name: "Mr. Jay Soni",
        email: "jay.soni@gmail.com",
        qualification: "Manager",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user6.jpg",
        name: "Ms. Sarah Smith",
        email: "sarah.smith@gmail.com",
        qualification: "Developer",
        status: "Absent",
        statusClass: "badge badge-solid-orange"
      },
      {
        image: "assets/images/user/user3.jpg",
        name: "Ms. Megha Trivedi",
        email: "megha.trivedi@gmail.com",
        qualification: "Tester",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user2.jpg",
        name: "Mr. John Deo",
        email: "john.deo@gmail.com",
        qualification: "Designer",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user1.jpg",
        name: "Mr. Jacob Ryan",
        email: "jacob.ryan@gmail.com",
        qualification: "Developer",
        status: "Absent",
        statusClass: "badge badge-solid-orange"
      },
      {
        image: "assets/images/user/user8.jpg",
        name: "Mr. Jay Soni",
        email: "jay.soni@gmail.com",
        qualification: "Team Leader",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user9.jpg",
        name: "Ms. Linda Carter",
        email: "linda.carter@gmail.com",
        qualification: "Director",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user10.jpg",
        name: "Mr. Rajesh Kumar",
        email: "rajesh.kumar@gmail.com",
        qualification: "Tester",
        status: "Absent",
        statusClass: "badge badge-solid-orange"
      },
      {
        image: "assets/images/user/user11.jpg",
        name: "Ms. Nina Patel",
        email: "nina.patel@gmail.com",
        qualification: "Developer",
        status: "Available",
        statusClass: "badge badge-solid-green"
      },
      {
        image: "assets/images/user/user1.jpg",
        name: "Mr. Michael Lee",
        email: "michael.lee@gmail.com",
        qualification: "Designer",
        status: "Available",
        statusClass: "badge badge-solid-green"
      }
    ];
  }
  static {
    this.\u0275fac = function EmpStatusComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EmpStatusComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmpStatusComponent, selectors: [["app-emp-status"]], decls: 10, vars: 3, consts: [[1, "responsive_table"], ["mat-table", "", 1, "mat-cell", "advance-table", 3, "dataSource"], ["matColumnDef", "name"], ["mat-sort-header", "", 4, "matHeaderCellDef"], [4, "matCellDef"], ["matColumnDef", "status"], [4, "matHeaderCellDef"], [4, "matHeaderRowDef"], [4, "matRowDef", "matRowDefColumns"], ["mat-sort-header", ""], [1, "truncate-text"], ["alt", "image", 1, "table-img", 3, "src"], [1, "media-title", "font-b-500"], [3, "href"], [1, "text-job", "font-11"], [3, "ngClass"]], template: function EmpStatusComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "table", 1);
        \u0275\u0275elementContainerStart(2, 2);
        \u0275\u0275template(3, EmpStatusComponent_mat_header_cell_3_Template, 3, 0, "mat-header-cell", 3)(4, EmpStatusComponent_mat_cell_4_Template, 8, 4, "mat-cell", 4);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(5, 5);
        \u0275\u0275template(6, EmpStatusComponent_mat_header_cell_6_Template, 2, 0, "mat-header-cell", 6)(7, EmpStatusComponent_mat_cell_7_Template, 3, 2, "mat-cell", 4);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(8, EmpStatusComponent_mat_header_row_8_Template, 1, 0, "mat-header-row", 7)(9, EmpStatusComponent_mat_row_9_Template, 1, 0, "mat-row", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("dataSource", ctx.empDataSource);
        \u0275\u0275advance(7);
        \u0275\u0275property("matHeaderRowDef", ctx.empDisplayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.empDisplayedColumns);
      }
    }, dependencies: [MatCardModule, MatButtonModule, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, CommonModule, NgClass], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmpStatusComponent, [{
    type: Component,
    args: [{ selector: "app-emp-status", imports: [MatCardModule, MatButtonModule, MatTableModule, CommonModule], template: `<div class="responsive_table">\r
    <table mat-table [dataSource]="empDataSource" class="mat-cell advance-table">\r
        <ng-container matColumnDef="name">\r
            <mat-header-cell *matHeaderCellDef mat-sort-header> <span class="truncate-text">Employee\r
                    Name</span></mat-header-cell>\r
            <mat-cell *matCellDef="let emp">\r
                <img [src]="emp.image" class="table-img" alt="image" /><span class="truncate-text">\r
                    <div class="media-title font-b-500">\r
                        <a [href]="'mailto:' + emp.email">{{emp.name}}</a>\r
                    </div>\r
                    <div class="text-job font-11">{{emp.qualification}}</div>\r
                </span></mat-cell>\r
        </ng-container>\r
\r
        <!-- Status Column -->\r
        <ng-container matColumnDef="status">\r
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>\r
            <mat-cell *matCellDef="let emp">\r
                <div [ngClass]="emp.statusClass">{{emp.status}}</div>\r
            </mat-cell>\r
        </ng-container>\r
\r
        <mat-header-row *matHeaderRowDef="empDisplayedColumns"></mat-header-row>\r
        <mat-row *matRowDef="let row; columns: empDisplayedColumns;"></mat-row>\r
    </table>\r
\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmpStatusComponent, { className: "EmpStatusComponent", filePath: "src/app/shared/components/emp-status/emp-status.component.ts", lineNumber: 22 });
})();

// src/app/shared/components/emp-task-tab/emp-task-tab.component.ts
function EmpTaskTabComponent_For_2_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 4);
    \u0275\u0275text(1);
  }
  if (rf & 2) {
    const employee_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", employee_r1.imgUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", employee_r1.name, " ");
  }
}
function EmpTaskTabComponent_For_2_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td")(4, "span", 5);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "div", 6);
    \u0275\u0275element(10, "div", 7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const task_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", task_r2.statusClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(task_r2.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(task_r2.manager);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", task_r2.progress + "%");
    \u0275\u0275property("ngClass", task_r2.progressBarClass);
    \u0275\u0275attribute("aria-valuenow", task_r2.progress);
  }
}
function EmpTaskTabComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-tab", 0);
    \u0275\u0275template(1, EmpTaskTabComponent_For_2_ng_template_1_Template, 2, 2, "ng-template", 1);
    \u0275\u0275elementStart(2, "div", 2)(3, "table", 3)(4, "thead")(5, "tr")(6, "th");
    \u0275\u0275text(7, "Task");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Manager");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Progress");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "tbody");
    \u0275\u0275repeaterCreate(15, EmpTaskTabComponent_For_2_For_16_Template, 11, 8, "tr", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const employee_r1 = ctx.$implicit;
    \u0275\u0275property("label", employee_r1.name);
    \u0275\u0275advance(15);
    \u0275\u0275repeater(employee_r1.tasks);
  }
}
var EmpTaskTabComponent = class _EmpTaskTabComponent {
  constructor() {
    this.employees = [];
  }
  static {
    this.\u0275fac = function EmpTaskTabComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EmpTaskTabComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EmpTaskTabComponent, selectors: [["app-emp-task-tab"]], inputs: { employees: "employees" }, decls: 3, vars: 0, consts: [[3, "label"], ["mat-tab-label", ""], [1, "table-responsive", "mt-3"], [1, "table", "table-hover", "dashboard-task-infos"], ["alt", "user", 1, "tab-user-style", 3, "src"], [3, "ngClass"], [1, "progress", "shadow-style", "progress-xs"], ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", 3, "ngClass"]], template: function EmpTaskTabComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "mat-tab-group");
        \u0275\u0275repeaterCreate(1, EmpTaskTabComponent_For_2_Template, 17, 1, "mat-tab", 0, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.employees);
      }
    }, dependencies: [MatTabsModule, MatTabLabel, MatTab, MatTabGroup, NgClass], styles: ["\n\n[_nghost-%COMP%]     .tab-user-style {\n  border-radius: 50%;\n  margin: 0px 5px;\n}\n/*# sourceMappingURL=emp-task-tab.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmpTaskTabComponent, [{
    type: Component,
    args: [{ selector: "app-emp-task-tab", imports: [MatTabsModule, NgClass], template: `<mat-tab-group>\r
  @for (employee of employees; track employee) {\r
    <mat-tab [label]="employee.name">\r
      <ng-template mat-tab-label>\r
        <img [src]="employee.imgUrl" alt="user" class="tab-user-style">{{ employee.name }}\r
      </ng-template>\r
      <div class="table-responsive mt-3">\r
        <table class="table table-hover dashboard-task-infos">\r
          <thead>\r
            <tr>\r
              <th>Task</th>\r
              <th>Status</th>\r
              <th>Manager</th>\r
              <th>Progress</th>\r
            </tr>\r
          </thead>\r
          <tbody>\r
            @for (task of employee.tasks; track task) {\r
              <tr>\r
                <td>{{ task.name }}</td>\r
                <td>\r
                  <span [ngClass]="task.statusClass">{{ task.status }}</span>\r
                </td>\r
                <td>{{ task.manager }}</td>\r
                <td>\r
                  <div class="progress shadow-style progress-xs">\r
                    <div class="progress-bar" [ngClass]="task.progressBarClass" role="progressbar"\r
                      [style.width]="task.progress + '%'" [attr.aria-valuenow]="task.progress"\r
                    aria-valuemin="0" aria-valuemax="100"></div>\r
                  </div>\r
                </td>\r
              </tr>\r
            }\r
          </tbody>\r
        </table>\r
      </div>\r
    </mat-tab>\r
  }\r
</mat-tab-group>`, styles: ["/* src/app/shared/components/emp-task-tab/emp-task-tab.component.scss */\n:host ::ng-deep .tab-user-style {\n  border-radius: 50%;\n  margin: 0px 5px;\n}\n/*# sourceMappingURL=emp-task-tab.component.css.map */\n"] }]
  }], null, { employees: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EmpTaskTabComponent, { className: "EmpTaskTabComponent", filePath: "src/app/shared/components/emp-task-tab/emp-task-tab.component.ts", lineNumber: 26 });
})();

// src/app/shared/components/event-card/event-card.component.ts
function EventCardComponent_For_2_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const event_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", event_r1.status, " ");
  }
}
function EventCardComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 5)(6, "span", 6);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 7);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 8)(11, "h3", 9);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 10)(14, "mat-icon", 11);
    \u0275\u0275text(15, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(17, EventCardComponent_For_2_Conditional_17_Template, 2, 1, "div", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const event_r1 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(event_r1.day);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(event_r1.date);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(event_r1.month);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(event_r1.title);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2(" ", event_r1.timeStart, " - ", event_r1.timeEnd, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(event_r1.status ? 17 : -1);
  }
}
var EventCardComponent = class _EventCardComponent {
  constructor() {
    this.events = [];
    this.maxEvents = 3;
    this.showViewMore = true;
  }
  static {
    this.\u0275fac = function EventCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EventCardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _EventCardComponent, selectors: [["app-event-card"]], inputs: { events: "events", maxEvents: "maxEvents", showViewMore: "showViewMore" }, decls: 4, vars: 4, consts: [[1, "event-list"], [1, "event-card"], [1, "event-content"], [1, "date-container"], [1, "day"], [1, "date-block"], [1, "date"], [1, "month"], [1, "event-details"], [1, "event-title"], [1, "event-time"], [1, "time-icon"], [1, "event-status"]], template: function EventCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, EventCardComponent_For_2_Template, 18, 7, "mat-card", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275pipe(3, "slice");
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(\u0275\u0275pipeBind3(3, 0, ctx.events, 0, ctx.maxEvents));
      }
    }, dependencies: [CommonModule, SlicePipe, MatCardModule, MatCard, MatIconModule, MatIcon, MatButtonModule], styles: ["\n\n.event-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  max-width: 400px;\n}\n.event-card[_ngcontent-%COMP%] {\n  background: #eaeef8;\n  border-radius: 12px;\n  padding: 1rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  margin-bottom: 0px;\n}\n.event-card[_ngcontent-%COMP%]   .event-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  position: relative;\n}\n.event-card[_ngcontent-%COMP%]   .date-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-width: 60px;\n}\n.event-card[_ngcontent-%COMP%]   .date-container[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  margin-bottom: 15px;\n  font-weight: 500;\n}\n.event-card[_ngcontent-%COMP%]   .date-container[_ngcontent-%COMP%]   .date-block[_ngcontent-%COMP%] {\n  background: #786bed;\n  border-radius: 8px;\n  padding: 0.5rem;\n  text-align: center;\n  width: 100%;\n}\n.event-card[_ngcontent-%COMP%]   .date-container[_ngcontent-%COMP%]   .date-block[_ngcontent-%COMP%]   .date[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 1.25rem;\n  font-weight: 500;\n  line-height: 1;\n  color: #ffffff;\n}\n.event-card[_ngcontent-%COMP%]   .date-container[_ngcontent-%COMP%]   .date-block[_ngcontent-%COMP%]   .month[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.75rem;\n  color: #ffffff;\n  margin-top: 0.25rem;\n}\n.event-card[_ngcontent-%COMP%]   .event-details[_ngcontent-%COMP%] {\n  flex: 1;\n  margin-top: 25px;\n}\n.event-card[_ngcontent-%COMP%]   .event-details[_ngcontent-%COMP%]   .event-title[_ngcontent-%COMP%] {\n  margin: 0 0 0.5rem 0;\n  font-size: 1rem;\n  font-weight: 500;\n}\n.event-card[_ngcontent-%COMP%]   .event-details[_ngcontent-%COMP%]   .event-time[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.875rem;\n}\n.event-card[_ngcontent-%COMP%]   .event-details[_ngcontent-%COMP%]   .event-time[_ngcontent-%COMP%]   .time-icon[_ngcontent-%COMP%] {\n  font-size: 21px;\n  width: 21px;\n  height: 21px;\n}\n.event-card[_ngcontent-%COMP%]   .event-status[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.5rem;\n  right: 0;\n  background: #f7d1d4;\n  color: #ff4081;\n  padding: 0.25rem 0.75rem;\n  border-radius: 1rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.event-card[_ngcontent-%COMP%]   .event-status[_ngcontent-%COMP%]:empty {\n  display: none;\n}\n/*# sourceMappingURL=event-card.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EventCardComponent, [{
    type: Component,
    args: [{ selector: "app-event-card", imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule], template: '<!-- event-card.component.html -->\r\n<div class="event-list">\r\n  @for (event of events | slice:0:maxEvents; track event) {\r\n    <mat-card class="event-card">\r\n      <div class="event-content">\r\n        <div class="date-container">\r\n          <div class="day">{{event.day}}</div>\r\n          <div class="date-block">\r\n            <span class="date">{{event.date}}</span>\r\n            <span class="month">{{event.month}}</span>\r\n          </div>\r\n        </div>\r\n        <div class="event-details">\r\n          <h3 class="event-title">{{event.title}}</h3>\r\n          <div class="event-time">\r\n            <mat-icon class="time-icon">schedule</mat-icon>\r\n            {{event.timeStart}} - {{event.timeEnd}}\r\n          </div>\r\n        </div>\r\n        @if (event.status) {\r\n          <div class="event-status">\r\n            {{event.status}}\r\n          </div>\r\n        }\r\n      </div>\r\n    </mat-card>\r\n  }\r\n</div>', styles: ["/* src/app/shared/components/event-card/event-card.component.scss */\n.event-list {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  max-width: 400px;\n}\n.event-card {\n  background: #eaeef8;\n  border-radius: 12px;\n  padding: 1rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);\n  margin-bottom: 0px;\n}\n.event-card .event-content {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  position: relative;\n}\n.event-card .date-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  min-width: 60px;\n}\n.event-card .date-container .day {\n  font-size: 0.875rem;\n  margin-bottom: 15px;\n  font-weight: 500;\n}\n.event-card .date-container .date-block {\n  background: #786bed;\n  border-radius: 8px;\n  padding: 0.5rem;\n  text-align: center;\n  width: 100%;\n}\n.event-card .date-container .date-block .date {\n  display: block;\n  font-size: 1.25rem;\n  font-weight: 500;\n  line-height: 1;\n  color: #ffffff;\n}\n.event-card .date-container .date-block .month {\n  display: block;\n  font-size: 0.75rem;\n  color: #ffffff;\n  margin-top: 0.25rem;\n}\n.event-card .event-details {\n  flex: 1;\n  margin-top: 25px;\n}\n.event-card .event-details .event-title {\n  margin: 0 0 0.5rem 0;\n  font-size: 1rem;\n  font-weight: 500;\n}\n.event-card .event-details .event-time {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.875rem;\n}\n.event-card .event-details .event-time .time-icon {\n  font-size: 21px;\n  width: 21px;\n  height: 21px;\n}\n.event-card .event-status {\n  position: absolute;\n  top: -0.5rem;\n  right: 0;\n  background: #f7d1d4;\n  color: #ff4081;\n  padding: 0.25rem 0.75rem;\n  border-radius: 1rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.event-card .event-status:empty {\n  display: none;\n}\n/*# sourceMappingURL=event-card.component.css.map */\n"] }]
  }], null, { events: [{
    type: Input
  }], maxEvents: [{
    type: Input
  }], showViewMore: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(EventCardComponent, { className: "EventCardComponent", filePath: "src/app/shared/components/event-card/event-card.component.ts", lineNumber: 23 });
})();

// src/app/shared/components/latest-post/latest-post.component.ts
function LatestPostComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 4);
    \u0275\u0275element(2, "img", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 6)(4, "p", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 9);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const post_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", post_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(post_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Video | ", post_r1.timeAgo, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(post_r1.description);
  }
}
var LatestPostComponent = class _LatestPostComponent {
  constructor() {
    this.posts = [];
  }
  static {
    this.\u0275fac = function LatestPostComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LatestPostComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LatestPostComponent, selectors: [["app-latest-post"]], inputs: { posts: "posts" }, decls: 6, vars: 0, consts: [[1, "card-block"], [1, "row", "m-b-20"], [1, "text-center"], ["href", "#!", 1, "b-b-primary", "text-primary"], [1, "col-auto", "p-r-0"], ["alt", "post image", 1, "latest-posts-img", 3, "src"], [1, "col"], [1, "font-16", "font-b-500"], [1, "text-muted", "m-b-5"], [1, "text-muted"]], template: function LatestPostComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, LatestPostComponent_For_2_Template, 10, 4, "div", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementStart(3, "div", 2)(4, "a", 3);
        \u0275\u0275text(5, "View All Posts");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.posts);
      }
    }, dependencies: [MatIconModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LatestPostComponent, [{
    type: Component,
    args: [{ selector: "app-latest-post", imports: [MatIconModule], template: '<div class="card-block">\r\n  @for (post of posts; track post) {\r\n    <div class="row m-b-20">\r\n      <div class="col-auto p-r-0">\r\n        <img [src]="post.image" alt="post image" class="latest-posts-img">\r\n      </div>\r\n      <div class="col">\r\n        <p class="font-16 font-b-500">{{ post.title }}</p>\r\n        <p class="text-muted m-b-5">\r\n          Video | {{ post.timeAgo }}\r\n        </p>\r\n        <p class="text-muted">{{ post.description }}</p>\r\n      </div>\r\n    </div>\r\n  }\r\n  <div class="text-center">\r\n    <a href="#!" class="b-b-primary text-primary">View All Posts</a>\r\n  </div>\r\n</div>' }]
  }], null, { posts: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LatestPostComponent, { className: "LatestPostComponent", filePath: "src/app/shared/components/latest-post/latest-post.component.ts", lineNumber: 18 });
})();

// src/app/shared/components/medicine-list/medicine-list.component.ts
function MedicineListComponent_mat_header_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, "Medicine");
    \u0275\u0275elementEnd();
  }
}
function MedicineListComponent_mat_cell_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275element(1, "i", 9);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const medicine_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", medicine_r1.icon);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", medicine_r1.name, " ");
  }
}
function MedicineListComponent_mat_header_cell_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 10);
    \u0275\u0275text(1, "Dosage");
    \u0275\u0275elementEnd();
  }
}
function MedicineListComponent_mat_cell_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell", 10)(1, "span", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const medicine_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(medicine_r2.dosage);
  }
}
function MedicineListComponent_mat_header_row_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function MedicineListComponent_mat_row_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-row");
  }
}
var MedicineListComponent = class _MedicineListComponent {
  constructor() {
    this.medicineDataSource = [];
    this.displayedColumns = ["medicine", "dosage"];
  }
  static {
    this.\u0275fac = function MedicineListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MedicineListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MedicineListComponent, selectors: [["app-medicine-list"]], inputs: { medicineDataSource: "medicineDataSource" }, decls: 9, vars: 3, consts: [["mat-table", "", 1, "mat-cell", "medicine-list", 3, "dataSource"], ["matColumnDef", "medicine"], [4, "matHeaderCellDef"], [4, "matCellDef"], ["matColumnDef", "dosage"], ["class", "text-end", 4, "matHeaderCellDef"], ["class", "text-end", 4, "matCellDef"], [4, "matHeaderRowDef"], [4, "matRowDef", "matRowDefColumns"], [1, "pill-style", 3, "ngClass"], [1, "text-end"], [1, "badge-outline"]], template: function MedicineListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "table", 0);
        \u0275\u0275elementContainerStart(1, 1);
        \u0275\u0275template(2, MedicineListComponent_mat_header_cell_2_Template, 2, 0, "mat-header-cell", 2)(3, MedicineListComponent_mat_cell_3_Template, 3, 2, "mat-cell", 3);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(4, 4);
        \u0275\u0275template(5, MedicineListComponent_mat_header_cell_5_Template, 2, 0, "mat-header-cell", 5)(6, MedicineListComponent_mat_cell_6_Template, 3, 1, "mat-cell", 6);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(7, MedicineListComponent_mat_header_row_7_Template, 1, 0, "mat-header-row", 7)(8, MedicineListComponent_mat_row_8_Template, 1, 0, "mat-row", 8);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275property("dataSource", ctx.medicineDataSource);
        \u0275\u0275advance(7);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
      }
    }, dependencies: [MatCardModule, MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, CommonModule, NgClass], styles: ["\n\n[_nghost-%COMP%]     .mat-column-medicine {\n  min-width: 200px;\n}\n/*# sourceMappingURL=medicine-list.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MedicineListComponent, [{
    type: Component,
    args: [{ selector: "app-medicine-list", imports: [MatCardModule, MatTableModule, CommonModule], template: '<table mat-table [dataSource]="medicineDataSource" class="mat-cell medicine-list">\r\n\r\n    <!-- Medicine Name Column -->\r\n    <ng-container matColumnDef="medicine">\r\n        <mat-header-cell *matHeaderCellDef>Medicine</mat-header-cell>\r\n        <mat-cell *matCellDef="let medicine">\r\n            <i [ngClass]="medicine.icon" class="pill-style"></i> {{ medicine.name }}\r\n        </mat-cell>\r\n    </ng-container>\r\n\r\n    <!-- Dosage Column -->\r\n    <ng-container matColumnDef="dosage">\r\n        <mat-header-cell *matHeaderCellDef class="text-end">Dosage</mat-header-cell>\r\n        <mat-cell *matCellDef="let medicine" class="text-end">\r\n            <span class="badge-outline">{{ medicine.dosage }}</span>\r\n        </mat-cell>\r\n    </ng-container>\r\n\r\n    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>\r\n    <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>\r\n</table>', styles: ["/* src/app/shared/components/medicine-list/medicine-list.component.scss */\n:host ::ng-deep .mat-column-medicine {\n  min-width: 200px;\n}\n/*# sourceMappingURL=medicine-list.component.css.map */\n"] }]
  }], null, { medicineDataSource: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MedicineListComponent, { className: "MedicineListComponent", filePath: "src/app/shared/components/medicine-list/medicine-list.component.ts", lineNumber: 18 });
})();

// src/app/shared/components/new-order-list/new-order-list.component.ts
function NewOrderListComponent_mat_header_cell_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, "Product");
    \u0275\u0275elementEnd();
  }
}
function NewOrderListComponent_mat_cell_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const order_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(order_r1.product);
  }
}
function NewOrderListComponent_mat_header_cell_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, "Customers");
    \u0275\u0275elementEnd();
  }
}
function NewOrderListComponent_mat_cell_7_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 10);
    \u0275\u0275element(1, "img", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const customer_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", customer_r2.image, \u0275\u0275sanitizeUrl);
  }
}
function NewOrderListComponent_mat_cell_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 10)(1, "span", 12);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const order_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("+", order_r3.extraCustomers, "");
  }
}
function NewOrderListComponent_mat_cell_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell")(1, "ul", 9);
    \u0275\u0275repeaterCreate(2, NewOrderListComponent_mat_cell_7_For_3_Template, 2, 1, "li", 10, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275template(4, NewOrderListComponent_mat_cell_7_Conditional_4_Template, 3, 1, "li", 10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const order_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275repeater(order_r3.customers);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(order_r3.extraCustomers ? 4 : -1);
  }
}
function NewOrderListComponent_mat_header_cell_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, "Total");
    \u0275\u0275elementEnd();
  }
}
function NewOrderListComponent_mat_cell_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const order_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(order_r4.total);
  }
}
function NewOrderListComponent_mat_header_row_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function NewOrderListComponent_mat_row_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-row");
  }
}
var NewOrderListComponent = class _NewOrderListComponent {
  constructor() {
    this.displayedColumns = ["product", "customers", "total"];
    this.ordersDatasource = [
      {
        product: "iPhone X",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$8999"
      },
      {
        product: "Pixel 2",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$5550"
      },
      {
        product: "OnePlus",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$9000"
      },
      {
        product: "Galaxy",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$7500"
      },
      {
        product: "Moto Z2",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$8500"
      },
      {
        product: "iPhone X",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$8999"
      },
      {
        product: "Pixel 2",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$5550"
      },
      {
        product: "OnePlus",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$9000"
      },
      {
        product: "Galaxy",
        customers: [
          { image: "assets/images/user/user1.jpg" },
          { image: "assets/images/user/user2.jpg" },
          { image: "assets/images/user/user3.jpg" }
        ],
        extraCustomers: 4,
        total: "$7500"
      }
    ];
  }
  static {
    this.\u0275fac = function NewOrderListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NewOrderListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewOrderListComponent, selectors: [["app-new-order-list"]], decls: 13, vars: 3, consts: [[1, "responsive_table"], ["mat-table", "", 1, "mat-cell", "advance-table", 3, "dataSource"], ["matColumnDef", "product"], [4, "matHeaderCellDef"], [4, "matCellDef"], ["matColumnDef", "customers"], ["matColumnDef", "total"], [4, "matHeaderRowDef"], [4, "matRowDef", "matRowDefColumns"], [1, "list-unstyled", "order-list"], [1, "avatar", "avatar-sm"], ["alt", "user", 1, "rounded-circle", 3, "src"], [1, "badge"]], template: function NewOrderListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "table", 1);
        \u0275\u0275elementContainerStart(2, 2);
        \u0275\u0275template(3, NewOrderListComponent_mat_header_cell_3_Template, 2, 0, "mat-header-cell", 3)(4, NewOrderListComponent_mat_cell_4_Template, 2, 1, "mat-cell", 4);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(5, 5);
        \u0275\u0275template(6, NewOrderListComponent_mat_header_cell_6_Template, 2, 0, "mat-header-cell", 3)(7, NewOrderListComponent_mat_cell_7_Template, 5, 1, "mat-cell", 4);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(8, 6);
        \u0275\u0275template(9, NewOrderListComponent_mat_header_cell_9_Template, 2, 0, "mat-header-cell", 3)(10, NewOrderListComponent_mat_cell_10_Template, 2, 1, "mat-cell", 4);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(11, NewOrderListComponent_mat_header_row_11_Template, 1, 0, "mat-header-row", 7)(12, NewOrderListComponent_mat_row_12_Template, 1, 0, "mat-row", 8);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("dataSource", ctx.ordersDatasource);
        \u0275\u0275advance(10);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
      }
    }, dependencies: [MatTableModule, MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatButtonModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NewOrderListComponent, [{
    type: Component,
    args: [{ selector: "app-new-order-list", imports: [MatTableModule, MatButtonModule], template: '<div class="responsive_table">\r\n  <table mat-table [dataSource]="ordersDatasource" class="mat-cell advance-table">\r\n\r\n    <!-- Product Column -->\r\n    <ng-container matColumnDef="product">\r\n      <mat-header-cell *matHeaderCellDef>Product</mat-header-cell>\r\n      <mat-cell *matCellDef="let order">{{ order.product }}</mat-cell>\r\n    </ng-container>\r\n\r\n    <!-- Customers Column -->\r\n    <ng-container matColumnDef="customers">\r\n      <mat-header-cell *matHeaderCellDef>Customers</mat-header-cell>\r\n      <mat-cell *matCellDef="let order">\r\n        <ul class="list-unstyled order-list">\r\n          @for (customer of order.customers; track customer) {\r\n            <li class="avatar avatar-sm">\r\n              <img class="rounded-circle" [src]="customer.image" alt="user" />\r\n            </li>\r\n          }\r\n          @if (order.extraCustomers) {\r\n            <li class="avatar avatar-sm">\r\n              <span class="badge">+{{order.extraCustomers}}</span>\r\n            </li>\r\n          }\r\n        </ul>\r\n      </mat-cell>\r\n    </ng-container>\r\n\r\n    <!-- Total Column -->\r\n    <ng-container matColumnDef="total">\r\n      <mat-header-cell *matHeaderCellDef>Total</mat-header-cell>\r\n      <mat-cell *matCellDef="let order">{{ order.total }}</mat-cell>\r\n    </ng-container>\r\n\r\n    <!-- Header and Rows -->\r\n    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>\r\n    <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>\r\n  </table>\r\n</div>' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewOrderListComponent, { className: "NewOrderListComponent", filePath: "src/app/shared/components/new-order-list/new-order-list.component.ts", lineNumber: 22 });
})();

// src/app/shared/components/noticeboard/noticeboard.component.ts
function NoticeboardComponent_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-card", 2)(1, "div", 3);
    \u0275\u0275element(2, "img", 4);
    \u0275\u0275elementStart(3, "div", 5)(4, "h3");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const notice_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", notice_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(notice_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("By - ", notice_r1.author, "");
  }
}
var NoticeboardComponent = class _NoticeboardComponent {
  constructor() {
    this.notices = [
      {
        title: "Annual Sports Day Announcement",
        author: "Emily Johnson",
        image: "assets/images/user/user1.jpg"
      },
      {
        title: "Midterm Exam Schedule Released",
        author: "Michael Smith",
        image: "assets/images/user/user5.jpg"
      },
      {
        title: "Parent-Teacher Meeting Reminder",
        author: "Sarah Brown",
        image: "assets/images/user/user7.jpg"
      },
      {
        title: "Library Renovation Notice",
        author: "David Wilson",
        image: "assets/images/user/user8.jpg"
      },
      {
        title: "Field Trip to Science Museum",
        author: "Laura Martinez",
        image: "assets/images/user/user9.jpg"
      },
      {
        title: "New Extracurricular Activities Available",
        author: "Chris Taylor",
        image: "assets/images/user/user10.jpg"
      },
      {
        title: "End of Year Award Ceremony Details",
        author: "Sophia Garcia",
        image: "assets/images/user/user11.jpg"
      }
    ];
  }
  static {
    this.\u0275fac = function NoticeboardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NoticeboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NoticeboardComponent, selectors: [["app-noticeboard"]], decls: 4, vars: 0, consts: [[1, "notice-board"], [1, "notice-list"], [1, "notice-card"], [1, "card-content"], ["alt", "Notice Image", 1, "notice-image", "msr-3", 3, "src"], [1, "notice-details"]], template: function NoticeboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275repeaterCreate(2, NoticeboardComponent_For_3_Template, 8, 3, "mat-card", 2, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.notices);
      }
    }, dependencies: [MatCardModule, MatCard], styles: ["\n\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n}\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%]   .notice-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  margin-bottom: 0px;\n  background: #f1f5ff;\n}\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%]   .notice-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%]   .notice-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   .notice-image[_ngcontent-%COMP%] {\n  width: 50px;\n  height: 50px;\n  border-radius: 8px;\n  object-fit: cover;\n}\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%]   .notice-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   .notice-details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 500;\n  margin: 0;\n  line-height: 1.2;\n}\n.notice-board[_ngcontent-%COMP%]   .notice-list[_ngcontent-%COMP%]   .notice-card[_ngcontent-%COMP%]   .card-content[_ngcontent-%COMP%]   .notice-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 11px;\n  margin: 4px 0 0;\n}\n/*# sourceMappingURL=noticeboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoticeboardComponent, [{
    type: Component,
    args: [{ selector: "app-noticeboard", imports: [MatCardModule], template: '<div class="notice-board">\r\n  <div class="notice-list">\r\n    @for (notice of notices; track notice) {\r\n      <mat-card class="notice-card">\r\n        <div class="card-content">\r\n          <img [src]="notice.image" alt="Notice Image" class="notice-image msr-3" />\r\n          <div class="notice-details">\r\n            <h3>{{ notice.title }}</h3>\r\n            <p>By - {{ notice.author }}</p>\r\n          </div>\r\n        </div>\r\n      </mat-card>\r\n    }\r\n  </div>\r\n</div>', styles: ["/* src/app/shared/components/noticeboard/noticeboard.component.scss */\n.notice-board .notice-list {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  width: 100%;\n}\n.notice-board .notice-list .notice-card {\n  display: flex;\n  align-items: center;\n  padding: 16px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  margin-bottom: 0px;\n  background: #f1f5ff;\n}\n.notice-board .notice-list .notice-card .card-content {\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n.notice-board .notice-list .notice-card .card-content .notice-image {\n  width: 50px;\n  height: 50px;\n  border-radius: 8px;\n  object-fit: cover;\n}\n.notice-board .notice-list .notice-card .card-content .notice-details h3 {\n  font-size: 13px;\n  font-weight: 500;\n  margin: 0;\n  line-height: 1.2;\n}\n.notice-board .notice-list .notice-card .card-content .notice-details p {\n  font-size: 11px;\n  margin: 4px 0 0;\n}\n/*# sourceMappingURL=noticeboard.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NoticeboardComponent, { className: "NoticeboardComponent", filePath: "src/app/shared/components/noticeboard/noticeboard.component.ts", lineNumber: 11 });
})();

// src/app/shared/components/project-hours/project-hours.component.ts
function ProjectHoursComponent_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 10);
  }
  if (rf & 2) {
    const bar_r1 = ctx.$implicit;
    \u0275\u0275styleProp("width", bar_r1.percentage, "%");
    \u0275\u0275property("ngClass", bar_r1.color);
  }
}
function ProjectHoursComponent_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "div")(2, "span");
    \u0275\u0275element(3, "i", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const project_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", project_r2.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(project_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", project_r2.completed, "%");
  }
}
var ProjectHoursComponent = class _ProjectHoursComponent {
  constructor() {
    this.completedHours = 3487;
    this.expectedHours = 1e4;
    this.progressBars = [
      { color: "bg-red", percentage: 33 },
      { color: "bg-blue", percentage: 25 },
      { color: "bg-amber", percentage: 12 },
      { color: "bg-purple", percentage: 10 },
      { color: "bg-green", percentage: 7 },
      { color: "bg-cyan", percentage: 13 }
    ];
    this.projects = [
      { name: "Angular website", completed: 33, color: "col-red" },
      { name: "Shopping App", completed: 25, color: "col-blue" },
      { name: "ERP system", completed: 12, color: "col-amber" },
      { name: "React admin panel", completed: 10, color: "col-purple" },
      { name: "Api Integration", completed: 7, color: "col-green" },
      { name: "Email Marketing", completed: 13, color: "col-cyan" }
    ];
  }
  static {
    this.\u0275fac = function ProjectHoursComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProjectHoursComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProjectHoursComponent, selectors: [["app-project-hours"]], decls: 21, vars: 2, consts: [[1, "row"], [1, "col-sm-12"], [1, "d-flex", "justify-content-between", "mt-2", "mb-2"], [1, "fw-bold"], [1, "progress", "project-bar", "mb-2"], [1, "progress-bar", 3, "ngClass", "width"], [1, "search-project"], [1, "columnHeader", "light-bg"], [1, "column"], [1, "project-source"], [1, "progress-bar", 3, "ngClass"], [1, "fa", "fa-circle", 3, "ngClass"]], template: function ProjectHoursComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div")(4, "span", 3);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275text(6, " Hours");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(7, "div");
        \u0275\u0275text(8);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "div", 4);
        \u0275\u0275repeaterCreate(10, ProjectHoursComponent_For_11_Template, 1, 3, "div", 5, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 1)(13, "div", 6)(14, "div", 7)(15, "div", 8);
        \u0275\u0275text(16, "Project Name");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(17, "div", 8);
        \u0275\u0275text(18, "Completed");
        \u0275\u0275elementEnd()();
        \u0275\u0275repeaterCreate(19, ProjectHoursComponent_For_20_Template, 7, 3, "div", 9, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.completedHours);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1("Expected: ", ctx.expectedHours, "");
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.progressBars);
        \u0275\u0275advance(9);
        \u0275\u0275repeater(ctx.projects);
      }
    }, dependencies: [NgClass], styles: ["\n\n.project-bar[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  transition: width 0.4s ease-in-out;\n}\n.project-source[_ngcontent-%COMP%]   .fa-circle[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.msr-2[_ngcontent-%COMP%] {\n  margin-right: 2px;\n}\n.search-project[_ngcontent-%COMP%] {\n  margin-top: 30px;\n}\n.search-project[_ngcontent-%COMP%]   .columnHeader[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-weight: 500;\n  padding: 10px;\n  margin-bottom: 10px;\n}\n.search-project[_ngcontent-%COMP%]   .project-source[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin: 20px 10px;\n}\n/*# sourceMappingURL=project-hours.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProjectHoursComponent, [{
    type: Component,
    args: [{ selector: "app-project-hours", imports: [NgClass], template: '<div class="row">\r\n  <div class="col-sm-12">\r\n    <div class="d-flex justify-content-between mt-2 mb-2">\r\n      <div><span class="fw-bold">{{ completedHours }}</span> Hours</div>\r\n      <div>Expected: {{ expectedHours }}</div>\r\n    </div>\r\n    <div class="progress project-bar mb-2">\r\n      @for (bar of progressBars; track bar) {\r\n        <div class="progress-bar" [ngClass]="bar.color"\r\n          [style.width.%]="bar.percentage">\r\n        </div>\r\n      }\r\n    </div>\r\n  </div>\r\n  <div class="col-sm-12">\r\n    <div class="search-project">\r\n      <div class="columnHeader light-bg">\r\n        <div class="column">Project Name</div>\r\n        <div class="column">Completed</div>\r\n      </div>\r\n      @for (project of projects; track project) {\r\n        <div class="project-source">\r\n          <div><span><i class="fa fa-circle" [ngClass]="project.color"></i></span>{{ project.name }}</div>\r\n          <div>{{ project.completed }}%</div>\r\n        </div>\r\n      }\r\n    </div>\r\n  </div>\r\n</div>', styles: ["/* src/app/shared/components/project-hours/project-hours.component.scss */\n.project-bar .progress-bar {\n  transition: width 0.4s ease-in-out;\n}\n.project-source .fa-circle {\n  margin-right: 8px;\n}\n.msr-2 {\n  margin-right: 2px;\n}\n.search-project {\n  margin-top: 30px;\n}\n.search-project .columnHeader {\n  display: flex;\n  justify-content: space-between;\n  font-weight: 500;\n  padding: 10px;\n  margin-bottom: 10px;\n}\n.search-project .project-source {\n  display: flex;\n  justify-content: space-between;\n  margin: 20px 10px;\n}\n/*# sourceMappingURL=project-hours.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProjectHoursComponent, { className: "ProjectHoursComponent", filePath: "src/app/shared/components/project-hours/project-hours.component.ts", lineNumber: 10 });
})();

// src/app/shared/components/recent-activity/recent-activity.component.ts
function RecentActivityComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 1)(2, "small", 2);
    \u0275\u0275element(3, "i", 3);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const activity_r1 = ctx.$implicit;
    \u0275\u0275classMapInterpolate1("sl-item ", activity_r1.statusClass, "");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", activity_r1.timestamp, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(activity_r1.message);
  }
}
var RecentActivityComponent = class _RecentActivityComponent {
  constructor() {
    this.activities = [];
  }
  static {
    this.\u0275fac = function RecentActivityComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _RecentActivityComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RecentActivityComponent, selectors: [["app-recent-activity"]], inputs: { activities: "activities" }, decls: 2, vars: 0, consts: [[3, "class"], [1, "sl-content"], [1, "text-muted"], [1, "fa", "fa-user", "position-left"]], template: function RecentActivityComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275repeaterCreate(0, RecentActivityComponent_For_1_Template, 7, 5, "div", 0, \u0275\u0275repeaterTrackByIdentity);
      }
      if (rf & 2) {
        \u0275\u0275repeater(ctx.activities);
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecentActivityComponent, [{
    type: Component,
    args: [{ selector: "app-recent-activity", imports: [], template: '@for (activity of activities; track activity) {\r\n  <div class="sl-item {{ activity.statusClass }}">\r\n    <div class="sl-content">\r\n      <small class="text-muted">\r\n        <i class="fa fa-user position-left"></i> {{ activity.timestamp }}</small>\r\n        <p>{{ activity.message }}</p>\r\n      </div>\r\n    </div>\r\n  }' }]
  }], null, { activities: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RecentActivityComponent, { className: "RecentActivityComponent", filePath: "src/app/shared/components/recent-activity/recent-activity.component.ts", lineNumber: 16 });
})();

// src/app/shared/components/report-card-widget/report-card-widget.component.ts
var ReportCardWidgetComponent = class _ReportCardWidgetComponent {
  constructor() {
    this.todayCount = 0;
    this.weekCount = 0;
    this.monthCount = 0;
    this.progressPercentage = 0;
    this.progressColor = "orange";
    this.heading = "Patient Report";
  }
  static {
    this.\u0275fac = function ReportCardWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ReportCardWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReportCardWidgetComponent, selectors: [["app-report-card-widget"]], inputs: { todayCount: "todayCount", weekCount: "weekCount", monthCount: "monthCount", progressPercentage: "progressPercentage", progressColor: "progressColor", heading: "heading" }, decls: 23, vars: 10, consts: [[1, "plain-card"], [1, "card-inner"], [1, "tx-primary", "m-b-20", "font-b-500", "font-20"], [1, "row"], [1, "col-4"], [1, "font-b-500", "font-16"], [1, "progress", "shadow-style"], ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar"]], template: function ReportCardWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "p", 2);
        \u0275\u0275text(3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 3)(5, "div", 4)(6, "label", 5);
        \u0275\u0275text(7, "Today");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "p");
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 4)(11, "label", 5);
        \u0275\u0275text(12, "This Week");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(13, "p");
        \u0275\u0275text(14);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "div", 4)(16, "label", 5);
        \u0275\u0275text(17, "This Month");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "p");
        \u0275\u0275text(19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(20, "div", 6)(21, "div", 7);
        \u0275\u0275text(22);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.heading);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate(ctx.todayCount);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.weekCount);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.monthCount);
        \u0275\u0275advance(2);
        \u0275\u0275styleProp("width", ctx.progressPercentage + "%")("background-color", ctx.progressColor);
        \u0275\u0275attribute("aria-valuenow", ctx.progressPercentage);
        \u0275\u0275advance();
        \u0275\u0275textInterpolate1(" ", ctx.progressPercentage, "% ");
      }
    }, styles: ["\n\n.card-inner[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%] {\n  margin: 2px 0px;\n  height: 15px;\n}\n/*# sourceMappingURL=report-card-widget.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReportCardWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-report-card-widget", imports: [], template: `<div class="plain-card">\r
    <div class="card-inner">\r
        <p class="tx-primary m-b-20 font-b-500 font-20">{{ heading }}</p>\r
        <div class="row">\r
            <div class="col-4">\r
                <label class="font-b-500 font-16">Today</label>\r
                <p>{{ todayCount }}</p>\r
            </div>\r
            <div class="col-4">\r
                <label class="font-b-500 font-16">This Week</label>\r
                <p>{{ weekCount }}</p>\r
            </div>\r
            <div class="col-4">\r
                <label class="font-b-500 font-16">This Month</label>\r
                <p>{{ monthCount }}</p>\r
            </div>\r
        </div>\r
        <div class="progress shadow-style">\r
            <div class="progress-bar" [style.width]="progressPercentage + '%'" [style.backgroundColor]="progressColor"\r
                role="progressbar" [attr.aria-valuenow]="progressPercentage" aria-valuemin="0" aria-valuemax="100">\r
                {{ progressPercentage }}%\r
            </div>\r
        </div>\r
    </div>\r
</div>`, styles: ["/* src/app/shared/components/report-card-widget/report-card-widget.component.scss */\n.card-inner .progress {\n  margin: 2px 0px;\n  height: 15px;\n}\n/*# sourceMappingURL=report-card-widget.component.css.map */\n"] }]
  }], null, { todayCount: [{
    type: Input
  }], weekCount: [{
    type: Input
  }], monthCount: [{
    type: Input
  }], progressPercentage: [{
    type: Input
  }], progressColor: [{
    type: Input
  }], heading: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReportCardWidgetComponent, { className: "ReportCardWidgetComponent", filePath: "src/app/shared/components/report-card-widget/report-card-widget.component.ts", lineNumber: 9 });
})();

// src/app/shared/components/review-widget/review-widget.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function ReviewWidgetComponent_For_2_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "i", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const star_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(star_r1.type);
  }
}
function ReviewWidgetComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 4);
    \u0275\u0275element(2, "img", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 6)(4, "p", 7);
    \u0275\u0275text(5);
    \u0275\u0275elementStart(6, "span", 8);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(8, ReviewWidgetComponent_For_2_For_9_Template, 2, 1, "i", 9, _forTrack0);
    \u0275\u0275elementStart(10, "p", 10);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "a", 11)(13, "i", 12);
    \u0275\u0275text(14, "thumb_up");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "a", 11)(16, "i", 13);
    \u0275\u0275text(17, "thumb_down");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const review_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("src", review_r2.imageUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", review_r2.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(review_r2.timeAgo);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.getStars(review_r2.rating));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(review_r2.comment);
  }
}
var ReviewWidgetComponent = class _ReviewWidgetComponent {
  constructor() {
    this.reviews = [];
  }
  getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return [
      ...Array(fullStars).fill(null).map((_, index) => ({ type: "star", id: index })),
      ...Array(halfStars).fill(null).map((_, index) => ({ type: "star_half", id: fullStars + index })),
      ...Array(emptyStars).fill(null).map((_, index) => ({
        type: "star_border",
        id: fullStars + halfStars + index
      }))
    ];
  }
  static {
    this.\u0275fac = function ReviewWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ReviewWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReviewWidgetComponent, selectors: [["app-review-widget"]], inputs: { reviews: "reviews" }, decls: 6, vars: 0, consts: [[1, "review-block"], [1, "row"], [1, "text-center", "m-b-5"], ["href", "#!", 1, "b-b-primary", "text-primary"], [1, "review-img"], ["alt", "", 3, "src"], [1, "col"], [1, "m-b-15", "font-b-500", "font-16"], [1, "float-end", "m-r-10", "font-12"], [1, "material-icons"], [1, "m-t-15", "m-b-15"], ["href", "#!"], [1, "material-icons", "m-r-10"], [1, "material-icons", "m-r-10", "col-red"]], template: function ReviewWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275repeaterCreate(1, ReviewWidgetComponent_For_2_Template, 18, 4, "div", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementStart(3, "div", 2)(4, "a", 3);
        \u0275\u0275text(5, "View all Customer Reviews");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.reviews);
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReviewWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-review-widget", imports: [], template: '<div class="review-block">\r\n  @for (review of reviews; track review) {\r\n  <div class="row">\r\n    <div class="review-img">\r\n      <img [src]="review.imageUrl" alt="">\r\n    </div>\r\n    <div class="col">\r\n      <p class="m-b-15 font-b-500 font-16">{{ review.name }}\r\n        <span class="float-end m-r-10 font-12">{{ review.timeAgo }}</span>\r\n      </p>\r\n      @for (star of getStars(review.rating); track star.id) {\r\n      <i class="material-icons">{{ star.type }}</i>\r\n      }\r\n      <p class="m-t-15 m-b-15">{{ review.comment }}</p>\r\n      <a href="#!">\r\n        <i class="material-icons m-r-10">thumb_up</i>\r\n      </a>\r\n      <a href="#!">\r\n        <i class="material-icons m-r-10 col-red">thumb_down</i>\r\n      </a>\r\n    </div>\r\n  </div>\r\n  }\r\n  <div class="text-center m-b-5">\r\n    <a href="#!" class="b-b-primary text-primary">View all Customer Reviews</a>\r\n  </div>\r\n</div>' }]
  }], null, { reviews: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReviewWidgetComponent, { className: "ReviewWidgetComponent", filePath: "src/app/shared/components/review-widget/review-widget.component.ts", lineNumber: 17 });
})();

// src/app/shared/components/schedule-card/schedule-card.component.ts
function ScheduleCardComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 1)(1, "div", 2);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3)(4, "div", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const schedule_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", schedule_r1.statusClass);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", schedule_r1.title, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(schedule_r1.dateRange);
  }
}
var ScheduleCardComponent = class _ScheduleCardComponent {
  constructor() {
    this.schedules = [];
  }
  static {
    this.\u0275fac = function ScheduleCardComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ScheduleCardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ScheduleCardComponent, selectors: [["app-schedule-card"]], inputs: { schedules: "schedules" }, decls: 3, vars: 0, consts: [[1, "list-unstyled", "user-progress", "list-unstyled-border", "list-unstyled-noborder"], [1, "schedule-list"], [1, "standard-name", 3, "ngClass"], [1, "ms-auto"], [1, "media-title", "font-15"]], template: function ScheduleCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275repeaterCreate(1, ScheduleCardComponent_For_2_Template, 6, 3, "li", 1, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.schedules);
      }
    }, dependencies: [NgClass], styles: ["\n\n.schedule-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  border-radius: 5px;\n  vertical-align: middle;\n  padding: 10px;\n  margin-bottom: 10px;\n  border: 1px solid #f6f4ff;\n}\n.standard-name[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.75rem;\n  border-radius: 1rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.standard-name.colorStyle1[_ngcontent-%COMP%] {\n  background: #ffe4e6;\n  color: #ff4081;\n}\n.standard-name.colorStyle2[_ngcontent-%COMP%] {\n  background: #d0d2ff;\n  color: #4049ff;\n}\n.standard-name.colorStyle3[_ngcontent-%COMP%] {\n  background: #ffe8be;\n  color: #ffa400;\n}\n.standard-name.colorStyle4[_ngcontent-%COMP%] {\n  background: #dfeee6;\n  color: #198754;\n}\n/*# sourceMappingURL=schedule-card.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScheduleCardComponent, [{
    type: Component,
    args: [{ selector: "app-schedule-card", imports: [NgClass], template: '<ul class="list-unstyled user-progress list-unstyled-border list-unstyled-noborder">\r\n  @for (schedule of schedules; track schedule) {\r\n  <li class="schedule-list">\r\n    <div class="standard-name" [ngClass]="schedule.statusClass">\r\n      {{ schedule.title }}\r\n    </div>\r\n    <div class="ms-auto">\r\n      <div class="media-title font-15">{{ schedule.dateRange }}</div>\r\n    </div>\r\n  </li>\r\n  }\r\n</ul>', styles: ["/* src/app/shared/components/schedule-card/schedule-card.component.scss */\n.schedule-list {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  border-radius: 5px;\n  vertical-align: middle;\n  padding: 10px;\n  margin-bottom: 10px;\n  border: 1px solid #f6f4ff;\n}\n.standard-name {\n  padding: 0.25rem 0.75rem;\n  border-radius: 1rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n}\n.standard-name.colorStyle1 {\n  background: #ffe4e6;\n  color: #ff4081;\n}\n.standard-name.colorStyle2 {\n  background: #d0d2ff;\n  color: #4049ff;\n}\n.standard-name.colorStyle3 {\n  background: #ffe8be;\n  color: #ffa400;\n}\n.standard-name.colorStyle4 {\n  background: #dfeee6;\n  color: #198754;\n}\n/*# sourceMappingURL=schedule-card.component.css.map */\n"] }]
  }], null, { schedules: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ScheduleCardComponent, { className: "ScheduleCardComponent", filePath: "src/app/shared/components/schedule-card/schedule-card.component.ts", lineNumber: 10 });
})();

// src/app/shared/components/timeline-list/timeline-list.component.ts
function TimelineListComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "div", 1);
    \u0275\u0275element(2, "img", 2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3)(4, "div", 4)(5, "p", 5);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 6)(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("src", item_r1.image, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r1.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r1.timeAgo);
  }
}
var TimelineListComponent = class _TimelineListComponent {
  constructor() {
    this.timelineItems = [];
  }
  static {
    this.\u0275fac = function TimelineListComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TimelineListComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TimelineListComponent, selectors: [["app-timeline-list"]], inputs: { timelineItems: "timelineItems" }, decls: 3, vars: 0, consts: [[1, "timeline"], [1, "timeline-badge", "primary"], ["alt", "...", 1, "notice-object", 3, "src"], [1, "timeline-panel"], [1, "timeline-heading"], [1, "timeline-title"], [1, "timeline-body"]], template: function TimelineListComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275repeaterCreate(1, TimelineListComponent_For_2_Template, 10, 3, "li", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.timelineItems);
      }
    }, encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TimelineListComponent, [{
    type: Component,
    args: [{ selector: "app-timeline-list", imports: [], template: '<ul class="timeline">\r\n  @for (item of timelineItems; track item) {\r\n    <li>\r\n      <div class="timeline-badge primary">\r\n        <img [src]="item.image" class="notice-object" alt="...">\r\n      </div>\r\n      <div class="timeline-panel">\r\n        <div class="timeline-heading">\r\n          <p class="timeline-title">{{ item.title }}</p>\r\n        </div>\r\n        <div class="timeline-body">\r\n          <p>{{ item.timeAgo }}</p>\r\n        </div>\r\n      </div>\r\n    </li>\r\n  }\r\n</ul>' }]
  }], null, { timelineItems: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TimelineListComponent, { className: "TimelineListComponent", filePath: "src/app/shared/components/timeline-list/timeline-list.component.ts", lineNumber: 16 });
})();

// src/app/shared/components/todo-widget/todo-widget.component.ts
var _c06 = (a0) => ({ done: a0 });
var _c13 = (a0, a1, a2) => ({ "task-low": a0, "task-high": a1, "task-normal": a2 });
function TodoWidgetComponent_For_2_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 11);
  }
}
function TodoWidgetComponent_For_2_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 8);
    \u0275\u0275text(1, " arrow_downward ");
    \u0275\u0275elementEnd();
  }
}
function TodoWidgetComponent_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 9);
    \u0275\u0275text(1, " arrow_upward ");
    \u0275\u0275elementEnd();
  }
}
function TodoWidgetComponent_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 10);
    \u0275\u0275text(1, " remove ");
    \u0275\u0275elementEnd();
  }
}
function TodoWidgetComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div")(2, "div", 2)(3, "mat-icon", 3);
    \u0275\u0275text(4, "drag_indicator");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "mat-checkbox", 4);
    \u0275\u0275listener("change", function TodoWidgetComponent_For_2_Template_mat_checkbox_change_5_listener() {
      const todo_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toggle(todo_r2));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, TodoWidgetComponent_For_2_div_6_Template, 1, 0, "div", 5);
    \u0275\u0275elementStart(7, "div", 6);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 7);
    \u0275\u0275template(10, TodoWidgetComponent_For_2_Conditional_10_Template, 2, 0, "mat-icon", 8)(11, TodoWidgetComponent_For_2_Conditional_11_Template, 2, 0, "mat-icon", 9)(12, TodoWidgetComponent_For_2_Conditional_12_Template, 2, 0, "mat-icon", 10);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const todo_r2 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275property("checked", todo_r2.done);
    \u0275\u0275advance(2);
    \u0275\u0275propertyInterpolate("matTooltip", todo_r2.title);
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction1(9, _c06, todo_r2.done));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", todo_r2.title, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", \u0275\u0275pureFunction3(11, _c13, todo_r2.priority === "Low", todo_r2.priority === "High", todo_r2.priority === "Normal"));
    \u0275\u0275advance();
    \u0275\u0275conditional(todo_r2.priority === "Low" ? 10 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(todo_r2.priority === "High" ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(todo_r2.priority === "Normal" ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", todo_r2.priority, " ");
  }
}
var TodoWidgetComponent = class _TodoWidgetComponent {
  constructor() {
    this.todos = [];
    this.todoToggled = new EventEmitter();
    this.todosUpdated = new EventEmitter();
  }
  toggle(todo) {
    todo.done = !todo.done;
    this.todoToggled.emit(todo);
  }
  drop(event) {
    moveItemInArray(this.todos, event.previousIndex, event.currentIndex);
    this.todosUpdated.emit(this.todos);
  }
  trackByFn(index, todo) {
    return todo.title;
  }
  static {
    this.\u0275fac = function TodoWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TodoWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TodoWidgetComponent, selectors: [["app-todo-widget"]], inputs: { todos: "todos" }, outputs: { todoToggled: "todoToggled", todosUpdated: "todosUpdated" }, decls: 3, vars: 0, consts: [["cdkDropList", "", 1, "task-list", 3, "cdkDropListDropped"], ["cdkDrag", "", 1, "task-box"], ["cdkDragHandle", "", 1, "task-handle"], ["aria-hidden", "false"], ["color", "primary", 1, "m-r-5", 3, "change", "checked"], ["class", "task-custom-placeholder", 4, "cdkDragPlaceholder"], [1, "todoTitle", 3, "matTooltip", "ngClass"], [3, "ngClass"], ["matTooltip", "Low", "aria-hidden", "false", 1, "lbl-low"], ["matTooltip", "High", "aria-hidden", "false", 1, "lbl-high"], ["matTooltip", "Normal", "aria-hidden", "false", 1, "lbl-normal"], [1, "task-custom-placeholder"]], template: function TodoWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0);
        \u0275\u0275listener("cdkDropListDropped", function TodoWidgetComponent_Template_div_cdkDropListDropped_0_listener($event) {
          return ctx.drop($event);
        });
        \u0275\u0275repeaterCreate(1, TodoWidgetComponent_For_2_Template, 14, 15, "div", 1, ctx.trackByFn, true);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.todos);
      }
    }, dependencies: [
      MatIcon,
      MatCheckbox,
      CdkDropList,
      CdkDrag,
      CdkDragHandle,
      CdkDragPlaceholder,
      NgClass,
      MatTooltipModule,
      MatTooltip
    ], styles: ["\n\n[_nghost-%COMP%]     .todoTitle {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  width: 160px;\n}\n/*# sourceMappingURL=todo-widget.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TodoWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-todo-widget", imports: [
      MatIcon,
      MatCheckbox,
      CdkDropList,
      CdkDrag,
      CdkDragHandle,
      CdkDragPlaceholder,
      NgClass,
      MatTooltipModule
    ], template: `<div cdkDropList class="task-list" (cdkDropListDropped)="drop($event)">\r
  @for (todo of todos; track trackByFn($index, todo)) {\r
    <div class="task-box" cdkDrag>\r
      <div>\r
        <div class="task-handle" cdkDragHandle>\r
          <mat-icon aria-hidden="false">drag_indicator</mat-icon>\r
        </div>\r
      </div>\r
      <mat-checkbox (change)="toggle(todo)" [checked]="todo.done" class="m-r-5" color="primary"></mat-checkbox>\r
      <div class="task-custom-placeholder" *cdkDragPlaceholder></div>\r
      <div matTooltip="{{ todo.title }}" [ngClass]="{done: todo.done}" class="todoTitle">\r
        {{ todo.title }}\r
      </div>\r
        <div [ngClass]="{\r
            'task-low': todo.priority === 'Low',\r
            'task-high': todo.priority === 'High',\r
            'task-normal': todo.priority === 'Normal'\r
          }">\r
        @if (todo.priority === 'Low') {\r
          <mat-icon matTooltip="Low" aria-hidden="false" class="lbl-low">\r
            arrow_downward\r
          </mat-icon>\r
        }\r
        @if (todo.priority === 'High') {\r
          <mat-icon matTooltip="High" aria-hidden="false" class="lbl-high">\r
            arrow_upward\r
          </mat-icon>\r
        }\r
        @if (todo.priority === 'Normal') {\r
          <mat-icon matTooltip="Normal" aria-hidden="false" class="lbl-normal">\r
            remove\r
          </mat-icon>\r
        }\r
        {{ todo.priority }}\r
      </div>\r
    </div>\r
  }\r
</div>`, styles: ["/* src/app/shared/components/todo-widget/todo-widget.component.scss */\n:host ::ng-deep .todoTitle {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  width: 160px;\n}\n/*# sourceMappingURL=todo-widget.component.css.map */\n"] }]
  }], null, { todos: [{
    type: Input
  }], todoToggled: [{
    type: Output
  }], todosUpdated: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TodoWidgetComponent, { className: "TodoWidgetComponent", filePath: "src/app/shared/components/todo-widget/todo-widget.component.ts", lineNumber: 37 });
})();

// src/app/shared/components/transactions-widget/transactions-widget.component.ts
function TransactionsWidgetComponent_li_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2)(1, "div", 3)(2, "i", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 5)(5, "div", 6)(6, "small", 7);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h6", 8);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 9)(11, "h6", 10);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "i", 4);
    \u0275\u0275text(14, "attach_money");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const transaction_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "icon-box icon-box-" + transaction_r1.iconColor);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "col-" + transaction_r1.iconColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(transaction_r1.icon);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(transaction_r1.category);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(transaction_r1.description);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", "col-" + transaction_r1.textColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(transaction_r1.amount);
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", "col-" + transaction_r1.textColor);
  }
}
var TransactionsWidgetComponent = class _TransactionsWidgetComponent {
  constructor() {
    this.transactions = [];
  }
  static {
    this.\u0275fac = function TransactionsWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _TransactionsWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TransactionsWidgetComponent, selectors: [["app-transactions-widget"]], inputs: { transactions: "transactions" }, decls: 2, vars: 1, consts: [[1, "p-0", "m-0"], ["class", "d-flex mb-4 pb-1", 4, "ngFor", "ngForOf"], [1, "d-flex", "mb-4", "pb-1"], [3, "ngClass"], [1, "material-icons", 3, "ngClass"], [1, "d-flex", "w-100", "align-items-center", "justify-content-between"], [1, "me-2", "ms-2"], [1, "text-muted", "mb-1"], [1, "mb-0"], [1, "d-flex", "align-items-center", "amount-section"], [1, "mb-0", 3, "ngClass"]], template: function TransactionsWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "ul", 0);
        \u0275\u0275template(1, TransactionsWidgetComponent_li_1_Template, 15, 8, "li", 1);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275property("ngForOf", ctx.transactions);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TransactionsWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-transactions-widget", imports: [CommonModule], template: `<ul class="p-0 m-0">\r
    <li *ngFor="let transaction of transactions" class="d-flex mb-4 pb-1">\r
        <div [ngClass]="'icon-box icon-box-' + transaction.iconColor">\r
            <i class="material-icons" [ngClass]="'col-'+transaction.iconColor">{{ transaction.icon }}</i>\r
        </div>\r
        <div class="d-flex w-100 align-items-center justify-content-between">\r
            <div class="me-2 ms-2">\r
                <small class="text-muted mb-1">{{ transaction.category }}</small>\r
                <h6 class="mb-0">{{ transaction.description }}</h6>\r
            </div>\r
            <div class="d-flex align-items-center amount-section">\r
                <h6 class="mb-0" [ngClass]="'col-'+transaction.textColor">{{ transaction.amount }}</h6>\r
                <i class="material-icons" [ngClass]="'col-'+transaction.textColor">attach_money</i>\r
            </div>\r
        </div>\r
    </li>\r
</ul>` }]
  }], null, { transactions: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TransactionsWidgetComponent, { className: "TransactionsWidgetComponent", filePath: "src/app/shared/components/transactions-widget/transactions-widget.component.ts", lineNumber: 20 });
})();

// src/app/shared/components/project-status/project-status.component.ts
function ProjectStatusComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 4)(6, "div", 5);
    \u0275\u0275text(7);
    \u0275\u0275element(8, "mat-progress-bar", 6);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const project_r1 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(project_r1.name);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", project_r1.progress, "% ");
    \u0275\u0275advance();
    \u0275\u0275property("value", project_r1.progress)("ngClass", project_r1.progressColor);
  }
}
var ProjectStatusComponent = class _ProjectStatusComponent {
  constructor() {
    this.projects = [];
  }
  static {
    this.\u0275fac = function ProjectStatusComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProjectStatusComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProjectStatusComponent, selectors: [["app-project-status"]], inputs: { projects: "projects" }, decls: 1, vars: 1, consts: [["class", "m-2", 4, "ngFor", "ngForOf"], [1, "m-2"], [1, "row"], [1, "col-lg-5", "m-b-20"], [1, "col-lg-7"], [1, "mt-1"], ["mode", "determinate", 1, "progress-round", 3, "value", "ngClass"]], template: function ProjectStatusComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, ProjectStatusComponent_div_0_Template, 9, 4, "div", 0);
      }
      if (rf & 2) {
        \u0275\u0275property("ngForOf", ctx.projects);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, MatProgressBarModule, MatProgressBar], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProjectStatusComponent, [{
    type: Component,
    args: [{ selector: "app-project-status", imports: [CommonModule, MatProgressBarModule], template: '<div *ngFor="let project of projects" class="m-2">\r\n    <div class="row">\r\n        <div class="col-lg-5 m-b-20">\r\n            <div>{{ project.name }}</div>\r\n        </div>\r\n        <div class="col-lg-7">\r\n            <div class="mt-1">\r\n                {{ project.progress}}%\r\n                <mat-progress-bar mode="determinate" [value]="project.progress" class="progress-round"\r\n                    [ngClass]="project.progressColor">\r\n                </mat-progress-bar>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>' }]
  }], null, { projects: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProjectStatusComponent, { className: "ProjectStatusComponent", filePath: "src/app/shared/components/project-status/project-status.component.ts", lineNumber: 17 });
})();

// src/app/widget/data-widget/data-widget.component.ts
var _c07 = () => ["Home"];
var DataWidgetComponent = class _DataWidgetComponent {
  constructor() {
    this.breadscrums = [
      {
        title: "Data Widget",
        items: ["Widget"],
        active: "Data Widget"
      }
    ];
    this.subjects = [
      { subject: "Project A", progress: 30, duration: "2 Months" },
      { subject: "Project B", progress: 55, duration: "3 Months" },
      { subject: "Project C", progress: 67, duration: "1 Month" },
      { subject: "Project D", progress: 70, duration: "2 Months" },
      { subject: "Project E", progress: 24, duration: "3 Months" },
      { subject: "Project F", progress: 77, duration: "4 Months" },
      { subject: "Project G", progress: 41, duration: "2 Months" }
    ];
    this.documentList = [
      {
        title: "Java Programming",
        type: ".doc",
        size: 4.3,
        icon: "far fa-file-word",
        iconClass: "primary-rgba text-primary",
        textClass: ""
      },
      {
        title: "Angular Theory",
        type: ".xls",
        size: 2.5,
        icon: "far fa-file-excel",
        iconClass: "success-rgba text-success",
        textClass: ""
      },
      {
        title: "Maths Sums Solution",
        type: ".pdf",
        size: 10.5,
        icon: "far fa-file-pdf",
        iconClass: "danger-rgba text-danger",
        textClass: ""
      },
      {
        title: "Submit Science Journal",
        type: ".zip",
        size: 53.2,
        icon: "far fa-file-archive",
        iconClass: "info-rgba text-info",
        textClass: ""
      },
      {
        title: "Marketing Instructions",
        type: ".doc",
        size: 5.3,
        icon: "far fa-file-word",
        iconClass: "primary-rgba text-primary",
        textClass: ""
      }
    ];
    this.scheduleList = [
      {
        name: "Cara Stevens",
        degree: "Mathematics",
        date: "12 June '20",
        time: "09:00-10:00",
        imageUrl: "assets/images/user/usrbig1.jpg"
      },
      {
        name: "Airi Satou",
        degree: "Computer Studies",
        date: "13 June '20",
        time: "11:00-12:00",
        imageUrl: "assets/images/user/usrbig2.jpg"
      },
      {
        name: "Jens Brincker",
        degree: "Geography",
        date: "15 June '20",
        time: "09:30-10:30",
        imageUrl: "assets/images/user/usrbig3.jpg"
      },
      {
        name: "Angelica Ramos",
        degree: "Chemistry",
        date: "16 June '20",
        time: "14:00-15:00",
        imageUrl: "assets/images/user/usrbig4.jpg"
      },
      {
        name: "Cara Stevens",
        degree: "Painting",
        date: "18 June '20",
        time: "11:00-12:30",
        imageUrl: "assets/images/user/usrbig5.jpg"
      },
      {
        name: "Jacob Ryan",
        degree: "Business Studies",
        date: "22 June '20",
        time: "13:00-14:15",
        imageUrl: "assets/images/user/usrbig6.jpg"
      }
    ];
    this.reviewList = [
      {
        name: "Alis Smith",
        timeAgo: "a week ago",
        rating: 3.5,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel rutrum ex, at ornare mi. In quis scelerisque dui, eget rhoncus orci. Fusce et sodales ipsum. Nam id nunc euismod, aliquet arcu quis, mattis nisi.",
        imageUrl: "assets/images/user/user1.jpg"
      },
      {
        name: "John Dio",
        timeAgo: "a week ago",
        rating: 2.5,
        comment: "Nam quis ligula est. Nunc sed risus non turpis tristique tempor. Ut sollicitudin faucibus magna nec gravida. Suspendisse ullamcorper justo vel porta imperdiet. Nunc nec ipsum vel augue placerat faucibus.",
        imageUrl: "assets/images/user/user2.jpg"
      }
    ];
    this.sources = [
      {
        label: "envato.com",
        percentage: 17,
        class: "bg-green",
        labelClass: "bg-green text-white"
      },
      {
        label: "google.com",
        percentage: 27,
        class: "bg-red",
        labelClass: "bg-red text-white"
      },
      {
        label: "yahoo.com",
        percentage: 25,
        class: "bg-indigo",
        labelClass: "bg-indigo text-white"
      },
      {
        label: "store",
        percentage: 18,
        class: "bg-orange",
        labelClass: "bg-orange text-white"
      },
      {
        label: "Others",
        percentage: 13,
        class: "bg-dark",
        labelClass: "bg-dark text-white"
      }
    ];
    this.activities = [
      {
        userImage: "assets/images/user/user1.jpg",
        userName: "Sarah Smith",
        label: "File",
        labelStyle: "lblFileStyle",
        time: "6 hours ago",
        message: "hii John, I have upload doc related to task.",
        isActive: true
      },
      {
        userImage: "assets/images/user/user2.jpg",
        userName: "Jalpa Joshi",
        label: "Task",
        labelStyle: "lblTaskStyle",
        time: "5 hours ago",
        message: "Please do as specify. Let me know if you have any query.",
        isActive: false
      },
      {
        userImage: "assets/images/user/user3.jpg",
        userName: "Lina Smith",
        label: "Comment",
        labelStyle: "lblCommentStyle",
        time: "6 hours ago",
        message: "Hey, How are you??",
        isActive: false
      },
      {
        userImage: "assets/images/user/user4.jpg",
        userName: "Jacob Ryan",
        label: "Reply",
        labelStyle: "lblReplyStyle",
        time: "7 hours ago",
        message: "I am fine. You??",
        isActive: true
      },
      {
        userImage: "assets/images/user/user5.jpg",
        userName: "Sarah Smith",
        label: "File",
        labelStyle: "lblFileStyle",
        time: "6 hours ago",
        message: "hii John, I have upload doc related to task.",
        isActive: true
      },
      {
        userImage: "assets/images/user/user6.jpg",
        userName: "Jalpa Joshi",
        label: "Task",
        labelStyle: "lblTaskStyle",
        time: "5 hours ago",
        message: "Please do as specify. Let me know if you have any query.",
        isActive: false
      }
    ];
    this.assignTasks = [
      {
        userImage: "assets/images/user/user1.jpg",
        userName: "John Deo",
        taskDetails: "Task A",
        status: "Doing",
        statusClass: "bg-green",
        manager: "John Doe",
        progress: 62,
        progressClass: "bg-green"
      },
      {
        userImage: "assets/images/user/user2.jpg",
        userName: "John Deo",
        taskDetails: "Task B",
        status: "To Do",
        statusClass: "bg-purple",
        manager: "John Doe",
        progress: 40,
        progressClass: "bg-purple"
      },
      {
        userImage: "assets/images/user/user3.jpg",
        userName: "John Deo",
        taskDetails: "Task C",
        status: "On Hold",
        statusClass: "bg-orange",
        manager: "John Doe",
        progress: 72,
        progressClass: "bg-orange"
      },
      {
        userImage: "assets/images/user/user4.jpg",
        userName: "John Deo",
        taskDetails: "Task D",
        status: "Waiting",
        statusClass: "bg-cyan",
        manager: "John Doe",
        progress: 95,
        progressClass: "bg-cyan"
      },
      {
        userImage: "assets/images/user/user5.jpg",
        userName: "John Deo",
        taskDetails: "Task E",
        status: "Suspended",
        statusClass: "bg-green",
        manager: "John Doe",
        progress: 87,
        progressClass: "bg-green"
      },
      {
        userImage: "assets/images/user/user6.jpg",
        userName: "Jane Smith",
        taskDetails: "Task F",
        status: "Doing",
        statusClass: "bg-green",
        manager: "John Doe",
        progress: 55,
        progressClass: "bg-green"
      },
      {
        userImage: "assets/images/user/user7.jpg",
        userName: "Emily Johnson",
        taskDetails: "Task G",
        status: "To Do",
        statusClass: "bg-purple",
        manager: "John Doe",
        progress: 20,
        progressClass: "bg-purple"
      },
      {
        userImage: "assets/images/user/user8.jpg",
        userName: "Michael Brown",
        taskDetails: "Task H",
        status: "On Hold",
        statusClass: "bg-orange",
        manager: "John Doe",
        progress: 10,
        progressClass: "bg-orange"
      },
      {
        userImage: "assets/images/user/user9.jpg",
        userName: "Sarah Davis",
        taskDetails: "Task I",
        status: "Completed",
        statusClass: "bg-blue",
        manager: "John Doe",
        progress: 100,
        progressClass: "bg-blue"
      }
    ];
    this.employeeData = [
      {
        name: "Sarah Smith",
        imgUrl: "assets/images/user/user1.jpg",
        tasks: [
          {
            name: "Task C",
            status: "Completed",
            statusClass: "col-green",
            manager: "John Doe",
            progress: 72,
            progressBarClass: "l-bg-green"
          },
          {
            name: "Task A",
            status: "On Process",
            statusClass: "col-red",
            manager: "John Doe",
            progress: 62,
            progressBarClass: "l-bg-red"
          },
          {
            name: "Task B",
            status: "On Hold",
            statusClass: "col-purple",
            manager: "John Doe",
            progress: 40,
            progressBarClass: "l-bg-purple"
          },
          {
            name: "Task D",
            status: "Completed",
            statusClass: "col-green",
            manager: "John Doe",
            progress: 72,
            progressBarClass: "l-bg-green"
          },
          {
            name: "Task E",
            status: "On Hold",
            statusClass: "col-purple",
            manager: "John Doe",
            progress: 40,
            progressBarClass: "l-bg-purple"
          },
          {
            name: "Task P",
            status: "On Hold",
            statusClass: "col-purple",
            manager: "John Doe",
            progress: 40,
            progressBarClass: "l-bg-purple"
          },
          {
            name: "Task O",
            status: "On Process",
            statusClass: "col-red",
            manager: "John Doe",
            progress: 62,
            progressBarClass: "l-bg-red"
          }
        ]
      },
      {
        name: "Jalpa Joshi",
        imgUrl: "assets/images/user/user2.jpg",
        tasks: [
          {
            name: "Task D",
            status: "On Process",
            statusClass: "col-red",
            manager: "John Doe",
            progress: 62,
            progressBarClass: "l-bg-red"
          },
          {
            name: "Task E",
            status: "On Hold",
            statusClass: "col-purple",
            manager: "John Doe",
            progress: 40,
            progressBarClass: "l-bg-purple"
          },
          {
            name: "Task F",
            status: "Completed",
            statusClass: "col-green",
            manager: "John Doe",
            progress: 72,
            progressBarClass: "l-bg-green"
          },
          {
            name: "Task G",
            status: "On Process",
            statusClass: "col-red",
            manager: "John Doe",
            progress: 62,
            progressBarClass: "l-bg-red"
          }
        ]
      },
      {
        name: "Mark Peter",
        imgUrl: "assets/images/user/user3.jpg",
        tasks: [
          {
            name: "Task E",
            status: "On Hold",
            statusClass: "col-purple",
            manager: "John Doe",
            progress: 40,
            progressBarClass: "l-bg-purple"
          },
          {
            name: "Task D",
            status: "On Process",
            statusClass: "col-red",
            manager: "John Doe",
            progress: 62,
            progressBarClass: "l-bg-red"
          },
          {
            name: "Task F",
            status: "Completed",
            statusClass: "col-green",
            manager: "John Doe",
            progress: 72,
            progressBarClass: "l-bg-green"
          }
        ]
      }
    ];
    this.recentActivities = [
      {
        timestamp: "5 mins ago",
        message: "Lorem ipsum dolor sit amet conse ctetur which ascing elit users.",
        statusClass: "sl-primary"
      },
      {
        timestamp: "8 mins ago",
        message: "Lorem ipsum dolor sit ametcon the sectetur that ascing elit users.",
        statusClass: "sl-danger"
      },
      {
        timestamp: "10 mins ago",
        message: "Lorem ipsum dolor sit amet cons the ecte tur and adip ascing elit users.",
        statusClass: "sl-success"
      },
      {
        timestamp: "20 mins ago",
        message: "Lorem ipsum dolor sit amet cons the ecte tur and adip ascing elit users.",
        statusClass: "sl-primary"
      },
      {
        timestamp: "5 mins ago",
        message: "Lorem ipsum dolor sit amet conse ctetur which ascing elit users.",
        statusClass: "sl-success"
      }
    ];
    this.messages = [
      {
        sender: "Michael",
        text: "Hi Aiden, how are you? How is the project coming along?",
        time: "10:10 AM"
      },
      {
        sender: "Aiden",
        text: "Are we meeting today? Project has been already finished and I have results to show you.",
        time: "10:12 AM"
      }
    ];
    this.postList = [
      {
        image: "assets/images/posts/post1.jpg",
        title: "About Something",
        timeAgo: "10 minutes ago",
        description: "Lorem Ipsum is simply dummy text of the."
      },
      {
        image: "assets/images/posts/post2.jpg",
        title: "Relationship",
        timeAgo: "24 minutes ago",
        description: "Lorem Ipsum is simply dummy text of the."
      },
      {
        image: "assets/images/posts/post3.jpg",
        title: "Human body",
        timeAgo: "53 minutes ago",
        description: "Lorem Ipsum is simply dummy text of the."
      }
    ];
    this.comments = [
      {
        name: "Dr. Airi Satou",
        message: "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.",
        timestamp: "7 hours ago",
        imgSrc: "assets/images/user/user6.jpg",
        colorClass: "col-green"
      },
      {
        name: "Dr. Sarah Smith",
        message: "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.",
        timestamp: "1 hour ago",
        imgSrc: "assets/images/user/user4.jpg",
        colorClass: "color-primary col-indigo"
      },
      {
        name: "Dr. Cara Stevens",
        message: "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.",
        timestamp: "Yesterday",
        imgSrc: "assets/images/user/user3.jpg",
        colorClass: "color-danger col-cyan"
      },
      {
        name: "Dr. Ashton Cox",
        message: "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.",
        timestamp: "Yesterday",
        imgSrc: "assets/images/user/user7.jpg",
        colorClass: "color-info col-orange",
        noBorder: true
      },
      {
        name: "Dr. Mark Hay",
        message: "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam.",
        timestamp: "1 hour ago",
        imgSrc: "assets/images/user/user9.jpg",
        colorClass: "color-primary col-red"
      }
    ];
    this.timelineData = [
      {
        image: "assets/images/user/user1.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "5 minutes ago"
      },
      {
        image: "assets/images/user/user2.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "10 minutes ago"
      },
      {
        image: "assets/images/user/user8.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "20 minutes ago"
      },
      {
        image: "assets/images/user/user4.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "35 minutes ago"
      },
      {
        image: "assets/images/user/user5.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "45 minutes ago"
      },
      {
        image: "assets/images/user/user7.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "1 hour ago"
      },
      {
        image: "assets/images/user/user3.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "2 hours ago"
      },
      {
        image: "assets/images/user/user6.jpg",
        title: "Lorem ipsum dolor sit amet, id quo eruditi.",
        timeAgo: "3 hours ago"
      }
    ];
    this.medicineDataSource = [
      {
        name: "Econochlor (chloramphenicol-oral)",
        icon: "fas fa-tablets col-green",
        dosage: "1 - 0 - 1"
      },
      {
        name: "Desmopressin tabs",
        icon: "fas fa-capsules col-red",
        dosage: "1 - 1 - 1"
      },
      {
        name: "Abciximab-injection",
        icon: "fas fa-syringe col-blue",
        dosage: "1 Daily"
      },
      {
        name: "Kevzara sarilumab",
        icon: "fas fa-pills col-orange",
        dosage: "0 - 0 - 1"
      },
      {
        name: "Gentamicin-topical",
        icon: "fas fa-capsules col-purple",
        dosage: "1 - 0 - 1"
      },
      {
        name: "Paliperidone palmitate",
        icon: "fas fa-tablets col-teal",
        dosage: "1 - 1 - 1"
      },
      {
        name: "Sermorelin-injectable",
        icon: "fas fa-syringe col-indigo",
        dosage: "1 Daily"
      }
    ];
    this.tasks = [
      { title: "Buy groceries", done: false, priority: "Normal" },
      { title: "Finish project report", done: false, priority: "High" },
      { title: "Clean the house", done: true, priority: "Low" },
      { title: "Call the bank", done: false, priority: "Normal" },
      { title: "Read a book", done: false, priority: "Low" },
      { title: "Schedule doctor appointment", done: false, priority: "High" },
      { title: "Prepare for presentation", done: false, priority: "Normal" },
      { title: "Exercise for 30 minutes", done: false, priority: "Normal" },
      { title: "Finish laundry", done: true, priority: "Low" },
      { title: "Write blog post", done: false, priority: "High" },
      { title: "Organize workspace", done: false, priority: "Normal" },
      { title: "Plan weekend trip", done: false, priority: "High" },
      { title: "Buy gifts for friends", done: false, priority: "Low" }
    ];
    this.events = [
      {
        day: "Tuesday",
        date: 4,
        month: "Jan",
        title: "Science Fair",
        timeStart: "11:00 AM",
        timeEnd: "12:30 PM",
        status: "Today"
      },
      {
        day: "Friday",
        date: 12,
        month: "Jan",
        title: "Guest Speaker",
        timeStart: "11:00 AM",
        timeEnd: "12:30 PM",
        status: "In 8 days"
      },
      {
        day: "Sunday",
        date: 18,
        month: "Jan",
        title: "Art Exhibition Opening",
        timeStart: "01:00 PM",
        timeEnd: "02:30 PM",
        status: "In 11 days"
      }
    ];
    this.examList = [
      {
        title: "Standard 1",
        dateRange: "23-03-2022 | 28-03-2022",
        statusClass: "colorStyle1"
      },
      {
        title: "Standard 2",
        dateRange: "10-03-2022 | 15-03-2022",
        statusClass: "colorStyle2"
      },
      {
        title: "Standard 3",
        dateRange: "03-04-2022 | 10-04-2022",
        statusClass: "colorStyle3"
      },
      {
        title: "Standard 4",
        dateRange: "11-05-2022 | 15-05-2022",
        statusClass: "colorStyle4"
      },
      {
        title: "Standard 5",
        dateRange: "17-05-2022 | 21-05-2022",
        statusClass: "colorStyle1"
      },
      {
        title: "Standard 6",
        dateRange: "23-05-2022 | 28-05-2022",
        statusClass: "colorStyle2"
      },
      {
        title: "Standard 7",
        dateRange: "11-06-2022 | 15-06-2022",
        statusClass: "colorStyle3"
      }
    ];
    this.transactions = [
      {
        type: "Bank Transfer",
        category: "Bank Transfer",
        description: "Send money",
        amount: 100.65,
        icon: "account_balance",
        iconColor: "green",
        textColor: "orange"
      },
      {
        type: "Wallet",
        category: "Wallet",
        description: "Wallet recharge",
        amount: 2e3,
        icon: "account_balance_wallet",
        iconColor: "orange",
        textColor: "green"
      },
      {
        type: "Credit Card",
        category: "Credit Card",
        description: "Ordered Food",
        amount: 25.69,
        icon: "credit_card",
        iconColor: "purple",
        textColor: "orange"
      },
      {
        type: "Cash Payment",
        category: "Cash Payment",
        description: "Sell Stationery",
        amount: 148.47,
        icon: "attach_money",
        iconColor: "blue",
        textColor: "green"
      },
      {
        type: "Debit Card",
        category: "Debit Card",
        description: "ATM Withdraw",
        amount: 100.65,
        icon: "credit_card",
        iconColor: "red",
        textColor: "orange"
      },
      {
        type: "Bank Transfer",
        category: "Bank Transfer",
        description: "Send money",
        amount: 100.65,
        icon: "account_balance",
        iconColor: "green",
        textColor: "orange"
      }
    ];
    this.projects = [
      {
        name: "Angular App",
        progress: 90,
        progressColor: "green-progress"
      },
      {
        name: "Java Software",
        progress: 54,
        progressColor: "red-progress"
      },
      {
        name: "Html Website",
        progress: 68,
        progressColor: "sky-progress"
      },
      {
        name: "IOS App",
        progress: 40,
        progressColor: "orange-progress"
      },
      {
        name: "Python Project",
        progress: 28,
        progressColor: "green-progress"
      },
      {
        name: "Reactjs App",
        progress: 89,
        progressColor: "sky-progress"
      },
      {
        name: "Node.js API",
        progress: 75,
        progressColor: "green-progress"
      },
      {
        name: "Flutter App",
        progress: 56,
        progressColor: "orange-progress"
      },
      {
        name: "C# Application",
        progress: 63,
        progressColor: "red-progress"
      },
      {
        name: "JavaScript Tutorial",
        progress: 80,
        progressColor: "sky-progress"
      },
      {
        name: "Vue.js Project",
        progress: 45,
        progressColor: "green-progress"
      }
    ];
  }
  onMessageSent(messageText) {
  }
  onTodoToggled(todo) {
  }
  onTodosUpdated(updatedTodos) {
  }
  static {
    this.\u0275fac = function DataWidgetComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DataWidgetComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DataWidgetComponent, selectors: [["app-data-widget"]], decls: 287, vars: 38, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row"], [1, "col-xl-4", "col-lg-4", "col-md-12", "col-sm-12"], ["visibility", "hover", 2, "height", "380px"], [3, "subjects"], [1, "col-xs-12", "col-sm-12", "col-md-4", "col-lg-4"], [1, "header-style"], ["mat-button", "", "color", "primary", "href", "#", 3, "click"], [1, "doc-file-type"], [3, "documents"], [3, "schedules"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-8", "col-lg-8"], ["visibility", "hover", 2, "height", "400px"], [3, "reviews"], [1, "col-md-4", "col-sm-12", "col-12"], [1, "totalEarning"], [3, "earningSources"], [1, "col-lg-4", "col-md-4", "col-sm-4", "col-xs-12"], [1, "box-part", "text-center"], [1, "fab", "fa-twitter", "fa-3x", "col-blue"], [1, "title", "p-t-15"], [1, "text", "p-b-10"], ["href", "#"], [1, "fab", "fa-instagram", "fa-3x", "col-red"], [1, "fab", "fa-facebook-f", "fa-3x", "col-blue"], [1, "col-xs-12", "col-sm-12", "col-md-6", "col-lg-6"], [3, "activities"], [3, "tasks"], ["visibility", "hover", 2, "height", "360px"], [3, "employees"], [1, "col-lg-6", "col-md-6", "col-sm-6", "col-xs-12"], [1, "card", "profile-header"], [1, "body"], [1, "col-lg-4", "col-md-4", "col-12"], [1, "profile-image", "float-md-right"], ["src", "assets/images/user/usrbig6.jpg", "alt", ""], [1, "col-lg-8", "col-md-8", "col-12"], [1, "m-t-0", "m-b-0"], [1, "job_post"], ["type", "button", 1, "btn", "btn-outline-success", "btn-border-radius", "msr-2"], ["type", "button", 1, "btn", "btn-outline-danger", "btn-border-radius"], ["src", "assets/images/user/usrbig1.jpg", "alt", ""], [1, "card"], [3, "messageSent", "avatar", "userName", "newMessagesCount", "messages"], [3, "posts"], [3, "comments"], [3, "timelineItems"], [3, "todoToggled", "todosUpdated", "todos"], [1, "table-responsive"], [3, "medicineDataSource"], [1, "text-center", "p-t-20"], ["mat-stroked-button", "", "color", "primary"], ["progressColor", "orange", 3, "heading", "todayCount", "weekCount", "monthCount", "progressPercentage"], ["progressColor", "Olive", 3, "heading", "todayCount", "weekCount", "monthCount", "progressPercentage"], [3, "events", "maxEvents", "showViewMore"], [1, "header-menu"], ["visibility", "hover", 2, "height", "330px"], [3, "transactions"], [3, "projects"]], template: function DataWidgetComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "mat-card")(7, "mat-card-header")(8, "mat-card-title");
        \u0275\u0275text(9, "Project Status");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "mat-card-content")(11, "ng-scrollbar", 6);
        \u0275\u0275element(12, "app-progress-table", 7);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(13, "div", 8)(14, "mat-card")(15, "mat-card-header", 9)(16, "mat-card-title");
        \u0275\u0275text(17, "Documents");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_18_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(19, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(20, "mat-card-content")(21, "ng-scrollbar", 6)(22, "div", 11);
        \u0275\u0275element(23, "app-document-list", 12);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(24, "div", 5)(25, "mat-card")(26, "mat-card-header", 9)(27, "mat-card-title");
        \u0275\u0275text(28, " Upcomming Class");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_29_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(30, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(31, "mat-card-content")(32, "ng-scrollbar", 6)(33, "div", 11);
        \u0275\u0275element(34, "app-emp-schedule", 13);
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(35, "div", 14)(36, "div", 15)(37, "mat-card")(38, "mat-card-header", 9)(39, "mat-card-title");
        \u0275\u0275text(40, " Customer Review");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_41_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(42, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(43, "mat-card-content")(44, "ng-scrollbar", 16);
        \u0275\u0275element(45, "app-review-widget", 17);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(46, "div", 18)(47, "mat-card")(48, "mat-card-header")(49, "mat-card-title");
        \u0275\u0275text(50, "Earning Source");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(51, "mat-card-content")(52, "ng-scrollbar", 16)(53, "div", 19)(54, "h3");
        \u0275\u0275text(55, "$90,808");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(56, "app-earning-source", 20);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(57, "div", 14)(58, "div", 21)(59, "div", 22);
        \u0275\u0275element(60, "i", 23);
        \u0275\u0275elementStart(61, "div", 24)(62, "h3");
        \u0275\u0275text(63, "Twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(64, "div", 25)(65, "span");
        \u0275\u0275text(66, "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(67, "a", 26);
        \u0275\u0275text(68, "Learn More");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(69, "div", 21)(70, "div", 22);
        \u0275\u0275element(71, "i", 27);
        \u0275\u0275elementStart(72, "div", 24)(73, "h3");
        \u0275\u0275text(74, "Instagram");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(75, "div", 25)(76, "span");
        \u0275\u0275text(77, "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(78, "a", 26);
        \u0275\u0275text(79, "Learn More");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(80, "div", 21)(81, "div", 22);
        \u0275\u0275element(82, "i", 28);
        \u0275\u0275elementStart(83, "div", 24)(84, "h3");
        \u0275\u0275text(85, "Facebook");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(86, "div", 25)(87, "span");
        \u0275\u0275text(88, "Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(89, "a", 26);
        \u0275\u0275text(90, "Learn More");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(91, "div", 14)(92, "div", 29)(93, "mat-card")(94, "mat-card-header")(95, "mat-card-title");
        \u0275\u0275text(96, "Activity");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(97, "mat-card-content")(98, "ng-scrollbar", 16);
        \u0275\u0275element(99, "app-activity-list", 30);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(100, "div", 29)(101, "mat-card")(102, "mat-card-header")(103, "mat-card-title");
        \u0275\u0275text(104, "Assign Task");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(105, "mat-card-content")(106, "ng-scrollbar", 16);
        \u0275\u0275element(107, "app-assign-task", 31);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(108, "div", 4)(109, "div", 29)(110, "mat-card")(111, "mat-card-header")(112, "mat-card-title");
        \u0275\u0275text(113, "New Order List");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(114, "mat-card-content")(115, "ng-scrollbar", 32);
        \u0275\u0275element(116, "app-new-order-list");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(117, "div", 29)(118, "mat-card")(119, "mat-card-header")(120, "mat-card-title");
        \u0275\u0275text(121, "Employee Task List");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(122, "mat-card-content")(123, "ng-scrollbar", 32);
        \u0275\u0275element(124, "app-emp-task-tab", 33);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(125, "div", 14)(126, "div", 34)(127, "div", 35)(128, "div", 36)(129, "div", 4)(130, "div", 37)(131, "div", 38);
        \u0275\u0275element(132, "img", 39);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(133, "div", 40)(134, "h5", 41);
        \u0275\u0275text(135, "John Deo");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(136, "span", 42);
        \u0275\u0275text(137, "Java Develper");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(138, "p");
        \u0275\u0275text(139, "102, Svayam Appartment, new P.L. road, Rajkot-369852");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(140, "div")(141, "button", 43);
        \u0275\u0275text(142, "Follow");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(143, "button", 44);
        \u0275\u0275text(144, "Message");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(145, "div", 34)(146, "div", 35)(147, "div", 36)(148, "div", 4)(149, "div", 37)(150, "div", 38);
        \u0275\u0275element(151, "img", 45);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(152, "div", 40)(153, "h5", 41);
        \u0275\u0275text(154, "Sarah Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(155, "span", 42);
        \u0275\u0275text(156, "Java Develper");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(157, "p");
        \u0275\u0275text(158, "102, Svayam Appartment, new P.L. road, Rajkot-369852");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(159, "div")(160, "button", 43);
        \u0275\u0275text(161, "Follow");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(162, "button", 44);
        \u0275\u0275text(163, "Message");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(164, "div", 4)(165, "div", 8)(166, "mat-card")(167, "mat-card-header", 9)(168, "mat-card-title");
        \u0275\u0275text(169, "Recent Activity");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(170, "mat-card-content")(171, "ng-scrollbar", 16);
        \u0275\u0275element(172, "app-recent-activity", 30);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(173, "div", 8)(174, "div", 46)(175, "app-chat-widget", 47);
        \u0275\u0275listener("messageSent", function DataWidgetComponent_Template_app_chat_widget_messageSent_175_listener($event) {
          return ctx.onMessageSent($event);
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(176, "div", 8)(177, "mat-card")(178, "mat-card-header", 9)(179, "mat-card-title");
        \u0275\u0275text(180, "Latest Posts");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(181, "mat-card-content")(182, "ng-scrollbar", 16);
        \u0275\u0275element(183, "app-latest-post", 48);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(184, "div", 14)(185, "div", 29)(186, "mat-card")(187, "mat-card-header", 9)(188, "mat-card-title");
        \u0275\u0275text(189, "Recent Comments");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(190, "mat-card-content")(191, "ng-scrollbar", 16);
        \u0275\u0275element(192, "app-recent-comments", 49);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(193, "div", 29)(194, "mat-card")(195, "mat-card-header", 9)(196, "mat-card-title");
        \u0275\u0275text(197, "Timeline");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(198, "mat-card-content")(199, "ng-scrollbar", 16);
        \u0275\u0275element(200, "app-timeline-list", 50);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(201, "div", 4)(202, "div", 8)(203, "mat-card")(204, "mat-card-header", 9)(205, "mat-card-title");
        \u0275\u0275text(206, "Todo List");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(207, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_207_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(208, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(209, "mat-card-content")(210, "ng-scrollbar", 16)(211, "app-todo-widget", 51);
        \u0275\u0275listener("todoToggled", function DataWidgetComponent_Template_app_todo_widget_todoToggled_211_listener($event) {
          return ctx.onTodoToggled($event);
        })("todosUpdated", function DataWidgetComponent_Template_app_todo_widget_todosUpdated_211_listener($event) {
          return ctx.onTodosUpdated($event);
        });
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(212, "div", 5)(213, "mat-card")(214, "mat-card-header", 9)(215, "mat-card-title");
        \u0275\u0275text(216, "Medications");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(217, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_217_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(218, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(219, "mat-card-content")(220, "ng-scrollbar", 16)(221, "div", 52);
        \u0275\u0275element(222, "app-medicine-list", 53);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(223, "div", 54)(224, "button", 55);
        \u0275\u0275text(225, "Report Adverse Effect");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(226, "div", 5);
        \u0275\u0275element(227, "app-report-card-widget", 56)(228, "app-report-card-widget", 57);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(229, "div", 4)(230, "div", 5)(231, "mat-card")(232, "mat-card-content")(233, "ng-scrollbar", 6);
        \u0275\u0275element(234, "app-event-card", 58);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(235, "div", 8)(236, "mat-card")(237, "mat-card-header", 59)(238, "mat-card-title");
        \u0275\u0275text(239, "Exam Schedule");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(240, "mat-card-content")(241, "ng-scrollbar", 60);
        \u0275\u0275element(242, "app-schedule-card", 13);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(243, "div", 8)(244, "mat-card")(245, "mat-card-header", 9)(246, "mat-card-title");
        \u0275\u0275text(247, "My Team");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(248, "a", 10);
        \u0275\u0275listener("click", function DataWidgetComponent_Template_a_click_248_listener($event) {
          return $event.preventDefault();
        });
        \u0275\u0275text(249, "View All");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(250, "mat-card-content")(251, "ng-scrollbar", 60);
        \u0275\u0275element(252, "app-emp-status");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(253, "div", 4)(254, "div", 5)(255, "mat-card")(256, "mat-card-header", 9)(257, "mat-card-title");
        \u0275\u0275text(258, "Noticeboard");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(259, "mat-card-content")(260, "ng-scrollbar", 16);
        \u0275\u0275element(261, "app-noticeboard");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(262, "div", 5)(263, "mat-card")(264, "mat-card-header", 9)(265, "mat-card-title");
        \u0275\u0275text(266, "Project Hours");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(267, "mat-card-content")(268, "ng-scrollbar", 16);
        \u0275\u0275element(269, "app-project-hours");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(270, "div", 5)(271, "mat-card")(272, "mat-card-header", 9)(273, "mat-card-title");
        \u0275\u0275text(274, "Transactions");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(275, "mat-card-content")(276, "ng-scrollbar", 16);
        \u0275\u0275element(277, "app-transactions-widget", 61);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(278, "div", 4)(279, "div", 5)(280, "mat-card")(281, "mat-card-header", 9)(282, "mat-card-title");
        \u0275\u0275text(283, "Project Status");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(284, "mat-card-content")(285, "ng-scrollbar", 6);
        \u0275\u0275element(286, "app-project-status", 62);
        \u0275\u0275elementEnd()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Data Widget")("items", \u0275\u0275pureFunction0(37, _c07))("active_item", "Data Widget");
        \u0275\u0275advance(9);
        \u0275\u0275property("subjects", ctx.subjects);
        \u0275\u0275advance(11);
        \u0275\u0275property("documents", ctx.documentList);
        \u0275\u0275advance(11);
        \u0275\u0275property("schedules", ctx.scheduleList);
        \u0275\u0275advance(11);
        \u0275\u0275property("reviews", ctx.reviewList);
        \u0275\u0275advance(11);
        \u0275\u0275property("earningSources", ctx.sources);
        \u0275\u0275advance(43);
        \u0275\u0275property("activities", ctx.activities);
        \u0275\u0275advance(8);
        \u0275\u0275property("tasks", ctx.assignTasks);
        \u0275\u0275advance(17);
        \u0275\u0275property("employees", ctx.employeeData);
        \u0275\u0275advance(48);
        \u0275\u0275property("activities", ctx.recentActivities);
        \u0275\u0275advance(3);
        \u0275\u0275property("avatar", "assets/images/user/user2.jpg")("userName", "Michael")("newMessagesCount", 2)("messages", ctx.messages);
        \u0275\u0275advance(8);
        \u0275\u0275property("posts", ctx.postList);
        \u0275\u0275advance(9);
        \u0275\u0275property("comments", ctx.comments);
        \u0275\u0275advance(8);
        \u0275\u0275property("timelineItems", ctx.timelineData);
        \u0275\u0275advance(11);
        \u0275\u0275property("todos", ctx.tasks);
        \u0275\u0275advance(11);
        \u0275\u0275property("medicineDataSource", ctx.medicineDataSource);
        \u0275\u0275advance(5);
        \u0275\u0275property("heading", "Patient Report")("todayCount", 105)("weekCount", 825)("monthCount", 22067)("progressPercentage", 74);
        \u0275\u0275advance();
        \u0275\u0275property("heading", "Income Report")("todayCount", 1247)("weekCount", 22568)("monthCount", 65147)("progressPercentage", 70);
        \u0275\u0275advance(6);
        \u0275\u0275property("events", ctx.events)("maxEvents", 3)("showViewMore", true);
        \u0275\u0275advance(8);
        \u0275\u0275property("schedules", ctx.examList);
        \u0275\u0275advance(35);
        \u0275\u0275property("transactions", ctx.transactions);
        \u0275\u0275advance(9);
        \u0275\u0275property("projects", ctx.projects);
      }
    }, dependencies: [
      BreadcrumbComponent,
      MatProgressBarModule,
      NgScrollbar,
      MatButtonModule,
      MatAnchor,
      MatButton,
      MatTabsModule,
      MatCardModule,
      MatCard,
      MatCardContent,
      MatCardHeader,
      MatCardTitle,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatCheckboxModule,
      MatTooltipModule,
      ProgressTableComponent,
      DocumentListComponent,
      EmpScheduleComponent,
      ReviewWidgetComponent,
      EarningSourceComponent,
      ActivityListComponent,
      AssignTaskComponent,
      NewOrderListComponent,
      EmpTaskTabComponent,
      RecentActivityComponent,
      ChatWidgetComponent,
      LatestPostComponent,
      RecentCommentsComponent,
      TimelineListComponent,
      TodoWidgetComponent,
      MedicineListComponent,
      ReportCardWidgetComponent,
      EventCardComponent,
      ScheduleCardComponent,
      EmpStatusComponent,
      NoticeboardComponent,
      ProjectHoursComponent,
      TransactionsWidgetComponent,
      ProjectStatusComponent
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataWidgetComponent, [{
    type: Component,
    args: [{ selector: "app-data-widget", imports: [
      BreadcrumbComponent,
      MatProgressBarModule,
      NgScrollbar,
      MatButtonModule,
      MatTabsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatCheckboxModule,
      MatTooltipModule,
      ProgressTableComponent,
      DocumentListComponent,
      EmpScheduleComponent,
      ReviewWidgetComponent,
      EarningSourceComponent,
      ActivityListComponent,
      AssignTaskComponent,
      NewOrderListComponent,
      EmpTaskTabComponent,
      RecentActivityComponent,
      ChatWidgetComponent,
      LatestPostComponent,
      RecentCommentsComponent,
      TimelineListComponent,
      TodoWidgetComponent,
      MedicineListComponent,
      ReportCardWidgetComponent,
      EventCardComponent,
      ScheduleCardComponent,
      EmpStatusComponent,
      NoticeboardComponent,
      ProjectHoursComponent,
      TransactionsWidgetComponent,
      ProjectStatusComponent
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Data Widget'" [items]="['Home']" [active_item]="'Data Widget'"></app-breadcrumb>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Project Status</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 380px" visibility="hover">\r
              <app-progress-table [subjects]="subjects"></app-progress-table>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Documents</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 380px" visibility="hover">\r
              <div class="doc-file-type">\r
                <app-document-list [documents]="documentList"></app-document-list>\r
              </div>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title> Upcomming Class</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 380px" visibility="hover">\r
              <div class="doc-file-type">\r
                <app-emp-schedule [schedules]="scheduleList"></app-emp-schedule>\r
              </div>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <!-- Customer Review -->\r
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title> Customer Review</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-review-widget [reviews]="reviewList"></app-review-widget>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <!-- #END# Customer Review -->\r
      <div class="col-md-4 col-sm-12 col-12">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Earning Source</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <div class="totalEarning">\r
                <h3>$90,808</h3>\r
              </div>\r
              <app-earning-source [earningSources]="sources"></app-earning-source>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">\r
        <div class="box-part text-center">\r
          <i class="fab fa-twitter fa-3x col-blue"></i>\r
          <div class="title p-t-15">\r
            <h3>Twitter</h3>\r
          </div>\r
          <div class="text p-b-10">\r
            <span>Lorem ipsum dolor sit amet, id quo eruditi\r
              eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui\r
              ad.</span>\r
          </div>\r
          <a href="#">Learn More</a>\r
        </div>\r
      </div>\r
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">\r
        <div class="box-part text-center">\r
          <i class="fab fa-instagram fa-3x col-red"></i>\r
          <div class="title p-t-15">\r
            <h3>Instagram</h3>\r
          </div>\r
          <div class="text p-b-10">\r
            <span>Lorem ipsum dolor sit amet, id quo eruditi\r
              eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui\r
              ad.</span>\r
          </div>\r
          <a href="#">Learn More</a>\r
        </div>\r
      </div>\r
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">\r
        <div class="box-part text-center">\r
          <i class="fab fa-facebook-f fa-3x col-blue"></i>\r
          <div class="title p-t-15">\r
            <h3>Facebook</h3>\r
          </div>\r
          <div class="text p-b-10">\r
            <span>Lorem ipsum dolor sit amet, id quo eruditi\r
              eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui\r
              ad.</span>\r
          </div>\r
          <a href="#">Learn More</a>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Activity</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-activity-list [activities]="activities"></app-activity-list>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Assign Task</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-assign-task [tasks]="assignTasks"></app-assign-task>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
\r
    <div class="row">\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>New Order List</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 360px" visibility="hover">\r
              <app-new-order-list></app-new-order-list>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header>\r
            <mat-card-title>Employee Task List</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 360px" visibility="hover">\r
              <app-emp-task-tab [employees]="employeeData"></app-emp-task-tab>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
\r
    <div class="row clearfix">\r
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <div class="card profile-header">\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-lg-4 col-md-4 col-12">\r
                <div class="profile-image float-md-right"> <img src="assets/images/user/usrbig6.jpg" alt="">\r
                </div>\r
              </div>\r
              <div class="col-lg-8 col-md-8 col-12">\r
                <h5 class="m-t-0 m-b-0">John Deo</h5>\r
                <span class="job_post">Java Develper</span>\r
                <p>102, Svayam Appartment, new P.L. road, Rajkot-369852</p>\r
                <div>\r
                  <button type="button" class="btn btn-outline-success btn-border-radius msr-2">Follow</button>\r
                  <button type="button" class="btn btn-outline-danger btn-border-radius">Message</button>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">\r
        <div class="card profile-header">\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-lg-4 col-md-4 col-12">\r
                <div class="profile-image float-md-right"> <img src="assets/images/user/usrbig1.jpg" alt="">\r
                </div>\r
              </div>\r
              <div class="col-lg-8 col-md-8 col-12">\r
                <h5 class="m-t-0 m-b-0">Sarah Smith</h5>\r
                <span class="job_post">Java Develper</span>\r
                <p>102, Svayam Appartment, new P.L. road, Rajkot-369852</p>\r
                <div>\r
                  <button type="button" class="btn btn-outline-success btn-border-radius msr-2">Follow</button>\r
                  <button type="button" class="btn btn-outline-danger btn-border-radius">Message</button>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Recent Activity</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-recent-activity [activities]="recentActivities"></app-recent-activity>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <div class="card">\r
          <app-chat-widget [avatar]="'assets/images/user/user2.jpg'" [userName]="'Michael'" [newMessagesCount]="2"\r
            [messages]="messages" (messageSent)="onMessageSent($event)">\r
          </app-chat-widget>\r
        </div>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Latest Posts</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-latest-post [posts]="postList"></app-latest-post>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Recent Comments</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-recent-comments [comments]="comments"></app-recent-comments>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Timeline</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-timeline-list [timelineItems]="timelineData"></app-timeline-list>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Todo List</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-todo-widget [todos]="tasks" (todoToggled)="onTodoToggled($event)"\r
                (todosUpdated)="onTodosUpdated($event)">\r
              </app-todo-widget>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Medications</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <div class="table-responsive">\r
                <app-medicine-list [medicineDataSource]="medicineDataSource"></app-medicine-list>\r
              </div>\r
              <div class="text-center p-t-20">\r
                <button mat-stroked-button color="primary">Report Adverse Effect</button>\r
              </div>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <app-report-card-widget [heading]="'Patient Report'" [todayCount]="105" [weekCount]="825" [monthCount]="22067"\r
          [progressPercentage]="74" progressColor="orange">\r
        </app-report-card-widget>\r
\r
        <app-report-card-widget [heading]="'Income Report'" [todayCount]="1247" [weekCount]="22568" [monthCount]="65147"\r
          [progressPercentage]="70" progressColor="Olive">\r
        </app-report-card-widget>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 380px" visibility="hover">\r
              <app-event-card [events]="events" [maxEvents]="3" [showViewMore]="true">\r
              </app-event-card>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-menu">\r
            <mat-card-title>Exam Schedule</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 330px" visibility="hover">\r
              <app-schedule-card [schedules]="examList"></app-schedule-card>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>My Team</mat-card-title>\r
            <a mat-button color="primary" href="#" (click)="$event.preventDefault();">View All</a>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 330px" visibility="hover">\r
              <app-emp-status></app-emp-status>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Noticeboard</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-noticeboard></app-noticeboard>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Project Hours</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-project-hours></app-project-hours>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Transactions</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 400px" visibility="hover">\r
              <app-transactions-widget [transactions]="transactions"></app-transactions-widget>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
    <div class="row">\r
      <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12">\r
        <mat-card>\r
          <mat-card-header class="header-style">\r
            <mat-card-title>Project Status</mat-card-title>\r
          </mat-card-header>\r
          <mat-card-content>\r
            <ng-scrollbar style="height: 380px" visibility="hover">\r
              <app-project-status [projects]="projects"></app-project-status>\r
            </ng-scrollbar>\r
          </mat-card-content>\r
        </mat-card>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DataWidgetComponent, { className: "DataWidgetComponent", filePath: "src/app/widget/data-widget/data-widget.component.ts", lineNumber: 119 });
})();

// src/app/widget/widget.routes.ts
var WIDGET_ROUTE = [
  {
    path: "",
    redirectTo: "chart-widget",
    pathMatch: "full"
  },
  {
    path: "chart-widget",
    component: ChartWidgetComponent
  },
  {
    path: "data-widget",
    component: DataWidgetComponent
  }
];
export {
  WIDGET_ROUTE
};
//# sourceMappingURL=widget.routes-CYNQJLQJ.js.map
