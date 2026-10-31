import {
  MatPaginator,
  MatPaginatorModule
} from "./chunk-3O3RAW4I.js";
import {
  DataTableColumnCellDirective,
  DataTableColumnDirective,
  DatatableComponent,
  NgxDatatableModule,
  SortType
} from "./chunk-SXQCWUKC.js";
import {
  MatSnackBar
} from "./chunk-JAMOUGRC.js";
import "./chunk-UKX4IBLX.js";
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
  MatTableDataSource,
  MatTableModule
} from "./chunk-GYT2RHCJ.js";
import "./chunk-QV4DNMNF.js";
import "./chunk-RTX2H4T5.js";
import "./chunk-AMSP6ESA.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import {
  BreadcrumbComponent
} from "./chunk-2TM4C2ER.js";
import "./chunk-4AQ2Q7XZ.js";
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
  UntypedFormBuilder,
  UntypedFormControl,
  Validators
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButtonModule,
  MatMiniFabButton
} from "./chunk-6OUKOU55.js";
import "./chunk-Y73QBUAC.js";
import "./chunk-WZAKLMWR.js";
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
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/tables/basic-table/basic-table.component.ts
var _c0 = () => ["Home", "Tables"];
var BasicTableComponent = class _BasicTableComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function BasicTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BasicTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BasicTableComponent, selectors: [["app-basic-table"]], decls: 400, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "header"], [1, "body", "table-responsive"], [1, "table"], ["scope", "row"], [1, "table", "table-striped"], [1, "table", "table-bordered"], [1, "table", "table-hover"], [1, "table", "table-condensed"], [1, "bg-purple"], [1, "l-bg-green"], [1, "l-bg-orange"], [1, "l-bg-cyan"], [1, "l-bg-purple"]], template: function BasicTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "Basic");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 8)(13, "table", 9)(14, "thead")(15, "tr")(16, "th");
        \u0275\u0275text(17, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "th");
        \u0275\u0275text(19, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "th");
        \u0275\u0275text(21, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "th");
        \u0275\u0275text(23, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(24, "tbody")(25, "tr")(26, "th", 10);
        \u0275\u0275text(27, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "td");
        \u0275\u0275text(29, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "td");
        \u0275\u0275text(31, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "td");
        \u0275\u0275text(33, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(34, "tr")(35, "th", 10);
        \u0275\u0275text(36, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "td");
        \u0275\u0275text(38, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "td");
        \u0275\u0275text(40, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "td");
        \u0275\u0275text(42, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(43, "tr")(44, "th", 10);
        \u0275\u0275text(45, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "td");
        \u0275\u0275text(47, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "td");
        \u0275\u0275text(49, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "td");
        \u0275\u0275text(51, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(52, "tr")(53, "th", 10);
        \u0275\u0275text(54, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "td");
        \u0275\u0275text(56, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "td");
        \u0275\u0275text(58, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(59, "td");
        \u0275\u0275text(60, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(61, "tr")(62, "th", 10);
        \u0275\u0275text(63, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "td");
        \u0275\u0275text(65, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "td");
        \u0275\u0275text(67, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(68, "td");
        \u0275\u0275text(69, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(70, "div", 4)(71, "div", 5)(72, "div", 6)(73, "div", 7)(74, "h2")(75, "strong");
        \u0275\u0275text(76, "Striped");
        \u0275\u0275elementEnd();
        \u0275\u0275text(77, " Rows");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(78, "div", 8)(79, "table", 11)(80, "thead")(81, "tr")(82, "th");
        \u0275\u0275text(83, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(84, "th");
        \u0275\u0275text(85, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(86, "th");
        \u0275\u0275text(87, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(88, "th");
        \u0275\u0275text(89, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(90, "tbody")(91, "tr")(92, "th", 10);
        \u0275\u0275text(93, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(94, "td");
        \u0275\u0275text(95, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(96, "td");
        \u0275\u0275text(97, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(98, "td");
        \u0275\u0275text(99, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(100, "tr")(101, "th", 10);
        \u0275\u0275text(102, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(103, "td");
        \u0275\u0275text(104, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(105, "td");
        \u0275\u0275text(106, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(107, "td");
        \u0275\u0275text(108, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(109, "tr")(110, "th", 10);
        \u0275\u0275text(111, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(112, "td");
        \u0275\u0275text(113, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(114, "td");
        \u0275\u0275text(115, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(116, "td");
        \u0275\u0275text(117, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(118, "tr")(119, "th", 10);
        \u0275\u0275text(120, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(121, "td");
        \u0275\u0275text(122, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(123, "td");
        \u0275\u0275text(124, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(125, "td");
        \u0275\u0275text(126, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(127, "tr")(128, "th", 10);
        \u0275\u0275text(129, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(130, "td");
        \u0275\u0275text(131, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(132, "td");
        \u0275\u0275text(133, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(134, "td");
        \u0275\u0275text(135, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(136, "div", 4)(137, "div", 5)(138, "div", 6)(139, "div", 7)(140, "h2")(141, "strong");
        \u0275\u0275text(142, "Bordered");
        \u0275\u0275elementEnd();
        \u0275\u0275text(143, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(144, "div", 8)(145, "table", 12)(146, "thead")(147, "tr")(148, "th");
        \u0275\u0275text(149, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(150, "th");
        \u0275\u0275text(151, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(152, "th");
        \u0275\u0275text(153, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(154, "th");
        \u0275\u0275text(155, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(156, "tbody")(157, "tr")(158, "th", 10);
        \u0275\u0275text(159, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(160, "td");
        \u0275\u0275text(161, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(162, "td");
        \u0275\u0275text(163, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(164, "td");
        \u0275\u0275text(165, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(166, "tr")(167, "th", 10);
        \u0275\u0275text(168, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(169, "td");
        \u0275\u0275text(170, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(171, "td");
        \u0275\u0275text(172, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(173, "td");
        \u0275\u0275text(174, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(175, "tr")(176, "th", 10);
        \u0275\u0275text(177, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(178, "td");
        \u0275\u0275text(179, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(180, "td");
        \u0275\u0275text(181, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(182, "td");
        \u0275\u0275text(183, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(184, "tr")(185, "th", 10);
        \u0275\u0275text(186, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(187, "td");
        \u0275\u0275text(188, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(189, "td");
        \u0275\u0275text(190, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(191, "td");
        \u0275\u0275text(192, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(193, "tr")(194, "th", 10);
        \u0275\u0275text(195, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(196, "td");
        \u0275\u0275text(197, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(198, "td");
        \u0275\u0275text(199, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(200, "td");
        \u0275\u0275text(201, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(202, "div", 4)(203, "div", 5)(204, "div", 6)(205, "div", 7)(206, "h2")(207, "strong");
        \u0275\u0275text(208, "Hover");
        \u0275\u0275elementEnd();
        \u0275\u0275text(209, " Rows");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(210, "div", 8)(211, "table", 13)(212, "thead")(213, "tr")(214, "th");
        \u0275\u0275text(215, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(216, "th");
        \u0275\u0275text(217, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(218, "th");
        \u0275\u0275text(219, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(220, "th");
        \u0275\u0275text(221, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(222, "tbody")(223, "tr")(224, "th", 10);
        \u0275\u0275text(225, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(226, "td");
        \u0275\u0275text(227, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(228, "td");
        \u0275\u0275text(229, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(230, "td");
        \u0275\u0275text(231, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(232, "tr")(233, "th", 10);
        \u0275\u0275text(234, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(235, "td");
        \u0275\u0275text(236, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(237, "td");
        \u0275\u0275text(238, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(239, "td");
        \u0275\u0275text(240, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(241, "tr")(242, "th", 10);
        \u0275\u0275text(243, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(244, "td");
        \u0275\u0275text(245, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(246, "td");
        \u0275\u0275text(247, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(248, "td");
        \u0275\u0275text(249, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(250, "tr")(251, "th", 10);
        \u0275\u0275text(252, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(253, "td");
        \u0275\u0275text(254, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(255, "td");
        \u0275\u0275text(256, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(257, "td");
        \u0275\u0275text(258, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(259, "tr")(260, "th", 10);
        \u0275\u0275text(261, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(262, "td");
        \u0275\u0275text(263, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(264, "td");
        \u0275\u0275text(265, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(266, "td");
        \u0275\u0275text(267, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(268, "div", 4)(269, "div", 5)(270, "div", 6)(271, "div", 7)(272, "h2")(273, "strong");
        \u0275\u0275text(274, "Condensed");
        \u0275\u0275elementEnd();
        \u0275\u0275text(275, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(276, "div", 8)(277, "table", 14)(278, "thead")(279, "tr")(280, "th");
        \u0275\u0275text(281, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(282, "th");
        \u0275\u0275text(283, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(284, "th");
        \u0275\u0275text(285, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(286, "th");
        \u0275\u0275text(287, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(288, "tbody")(289, "tr")(290, "th", 10);
        \u0275\u0275text(291, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(292, "td");
        \u0275\u0275text(293, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(294, "td");
        \u0275\u0275text(295, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(296, "td");
        \u0275\u0275text(297, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(298, "tr")(299, "th", 10);
        \u0275\u0275text(300, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(301, "td");
        \u0275\u0275text(302, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(303, "td");
        \u0275\u0275text(304, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(305, "td");
        \u0275\u0275text(306, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(307, "tr")(308, "th", 10);
        \u0275\u0275text(309, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(310, "td");
        \u0275\u0275text(311, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(312, "td");
        \u0275\u0275text(313, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(314, "td");
        \u0275\u0275text(315, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(316, "tr")(317, "th", 10);
        \u0275\u0275text(318, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(319, "td");
        \u0275\u0275text(320, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(321, "td");
        \u0275\u0275text(322, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(323, "td");
        \u0275\u0275text(324, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(325, "tr")(326, "th", 10);
        \u0275\u0275text(327, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(328, "td");
        \u0275\u0275text(329, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(330, "td");
        \u0275\u0275text(331, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(332, "td");
        \u0275\u0275text(333, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(334, "div", 4)(335, "div", 5)(336, "div", 6)(337, "div", 7)(338, "h2")(339, "strong");
        \u0275\u0275text(340, "Colorful");
        \u0275\u0275elementEnd();
        \u0275\u0275text(341, " Rows");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(342, "div", 8)(343, "table", 14)(344, "thead")(345, "tr")(346, "th");
        \u0275\u0275text(347, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(348, "th");
        \u0275\u0275text(349, "FIRST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(350, "th");
        \u0275\u0275text(351, "LAST NAME");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(352, "th");
        \u0275\u0275text(353, "USERNAME");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(354, "tbody")(355, "tr", 15)(356, "th", 10);
        \u0275\u0275text(357, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(358, "td");
        \u0275\u0275text(359, "Mark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(360, "td");
        \u0275\u0275text(361, "Otto");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(362, "td");
        \u0275\u0275text(363, "@mdo");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(364, "tr", 16)(365, "th", 10);
        \u0275\u0275text(366, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(367, "td");
        \u0275\u0275text(368, "Jacob");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(369, "td");
        \u0275\u0275text(370, "Thornton");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(371, "td");
        \u0275\u0275text(372, "@fat");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(373, "tr", 17)(374, "th", 10);
        \u0275\u0275text(375, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(376, "td");
        \u0275\u0275text(377, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(378, "td");
        \u0275\u0275text(379, "the Bird");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(380, "td");
        \u0275\u0275text(381, "@twitter");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(382, "tr", 18)(383, "th", 10);
        \u0275\u0275text(384, "4");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(385, "td");
        \u0275\u0275text(386, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(387, "td");
        \u0275\u0275text(388, "Jellybean");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(389, "td");
        \u0275\u0275text(390, "@lajelly");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(391, "tr", 19)(392, "th", 10);
        \u0275\u0275text(393, "5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(394, "td");
        \u0275\u0275text(395, "Larry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(396, "td");
        \u0275\u0275text(397, "Kikat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(398, "td");
        \u0275\u0275text(399, "@lakitkat");
        \u0275\u0275elementEnd()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Normal Table")("items", \u0275\u0275pureFunction0(3, _c0))("active_item", "Normal Table");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BasicTableComponent, [{
    type: Component,
    args: [{ selector: "app-basic-table", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Normal Table'" [items]="['Home','Tables']" [active_item]="'Normal Table'">\r
      </app-breadcrumb>\r
    </div>\r
    <!-- Basic Table -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Basic</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr>\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Basic Table -->\r
    <!-- Striped Rows -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Striped</strong> Rows</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table table-striped">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr>\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Striped Rows -->\r
    <!-- Bordered Table -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Bordered</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table table-bordered">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr>\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Bordered Table -->\r
    <!-- Hover Rows -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Hover</strong> Rows</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table table-hover">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr>\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Hover Rows -->\r
    <!-- Condensed Table -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Condensed</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table table-condensed">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr>\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr>\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Condensed Table -->\r
    <!-- #START# Colorful rows -->\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Colorful</strong> Rows</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table class="table table-condensed">\r
              <thead>\r
                <tr>\r
                  <th>#</th>\r
                  <th>FIRST NAME</th>\r
                  <th>LAST NAME</th>\r
                  <th>USERNAME</th>\r
                </tr>\r
              </thead>\r
              <tbody>\r
                <tr class="bg-purple">\r
                  <th scope="row">1</th>\r
                  <td>Mark</td>\r
                  <td>Otto</td>\r
                  <td>&#64;mdo</td>\r
                </tr>\r
                <tr class="l-bg-green">\r
                  <th scope="row">2</th>\r
                  <td>Jacob</td>\r
                  <td>Thornton</td>\r
                  <td>&#64;fat</td>\r
                </tr>\r
                <tr class="l-bg-orange">\r
                  <th scope="row">3</th>\r
                  <td>Larry</td>\r
                  <td>the Bird</td>\r
                  <td>&#64;twitter</td>\r
                </tr>\r
                <tr class="l-bg-cyan">\r
                  <th scope="row">4</th>\r
                  <td>Larry</td>\r
                  <td>Jellybean</td>\r
                  <td>&#64;lajelly</td>\r
                </tr>\r
                <tr class="l-bg-purple">\r
                  <th scope="row">5</th>\r
                  <td>Larry</td>\r
                  <td>Kikat</td>\r
                  <td>&#64;lakitkat</td>\r
                </tr>\r
              </tbody>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <!-- #END# Colorful rows -->\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BasicTableComponent, { className: "BasicTableComponent", filePath: "src/app/tables/basic-table/basic-table.component.ts", lineNumber: 9 });
})();

// src/app/tables/ngx-datatable/ngx-datatable.component.ts
var _c02 = () => ["Home", "Tables"];
function NgxDatatableComponent_ng_template_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 35);
    \u0275\u0275element(1, "img", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const value_r2 = ctx.value;
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate("src", value_r2, \u0275\u0275sanitizeUrl);
  }
}
function NgxDatatableComponent_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span")(1, "button", 37)(2, "i", 38);
    \u0275\u0275text(3, "mode_edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 39);
    \u0275\u0275listener("click", function NgxDatatableComponent_ng_template_36_Template_button_click_4_listener() {
      const row_r4 = \u0275\u0275restoreView(_r3).row;
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.deleteRow(row_r4));
    });
    \u0275\u0275elementStart(5, "i", 38);
    \u0275\u0275text(6, "delete");
    \u0275\u0275elementEnd()()();
  }
}
var NgxDatatableComponent = class _NgxDatatableComponent {
  constructor(fb, _snackBar) {
    this.fb = fb;
    this._snackBar = _snackBar;
    this.rows = [];
    this.newUserImg = "assets/images/user/user1.jpg";
    this.data = [];
    this.filteredData = [];
    this.SortType = SortType;
    this.columns = [
      { name: "First Name" },
      { name: "Last Name" },
      { name: "Gender" },
      { name: "Phone" },
      { name: "Email" },
      { name: "Address" }
    ];
    this.genders = [
      { id: "1", value: "Male" },
      { id: "2", value: "Female" }
    ];
    this.foods = [
      { value: "steak-0", viewValue: "Steak" },
      { value: "pizza-1", viewValue: "Pizza" },
      { value: "tacos-2", viewValue: "Tacos" }
    ];
    this.tb2columns = [
      { name: "First Name" },
      { name: "Last Name" },
      { name: "Address" }
    ];
    this.tb2data = [];
    this.tb2filteredData = [];
    this.editForm = this.fb.group({
      id: new UntypedFormControl(),
      img: new UntypedFormControl(),
      firstName: new UntypedFormControl(),
      lastName: new UntypedFormControl(),
      phone: new UntypedFormControl(),
      email: new UntypedFormControl(),
      address: new UntypedFormControl()
    });
  }
  ngOnInit() {
    this.fetch((data) => {
      this.data = data;
      this.filteredData = data;
    });
    this.tb2fetch((data) => {
      this.tb2data = data;
      this.tb2filteredData = data;
    });
    this.register = this.fb.group({
      id: [""],
      img: [""],
      firstName: ["", [Validators.required, Validators.pattern("[a-zA-Z]+")]],
      lastName: [""],
      phone: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      address: [""]
    });
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open("GET", "assets/data/datatable-data.json");
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }
  // Table 2
  tb2fetch(cb) {
    const req = new XMLHttpRequest();
    req.open("GET", "assets/data/ngx-data.json");
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }
  // Table 2
  tb2filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    const colsAmt = this.tb2columns.length;
    this.tb2data = this.tb2filteredData.filter(function(item) {
      for (let i = 0; i < colsAmt; i++) {
        if (item.firstName.toString().toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        }
      }
      return false;
    });
    this.table2.offset = 0;
  }
  deleteRow(row) {
    this.data = this.arrayRemove(this.data, row.id);
    this.showNotification("bg-red", "Delete Record Successfully", "bottom", "right");
  }
  arrayRemove(array, id) {
    return array.filter(function(element) {
      return element.id != id;
    });
  }
  filterDatatable(event) {
    const val = event.target.value.toLowerCase();
    const colsAmt = this.columns.length;
    this.data = this.filteredData.filter(function(item) {
      for (let i = 0; i < colsAmt; i++) {
        if (item.firstName.toString().toLowerCase().indexOf(val) !== -1 || !val) {
          return true;
        }
      }
      return false;
    });
    this.table.offset = 0;
  }
  getId(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  openSnackBar(message) {
    this._snackBar.open(message, "", {
      duration: 2e3,
      verticalPosition: "bottom",
      horizontalPosition: "right",
      panelClass: ["bg-red"]
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, "", {
      duration: 2e3,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  static {
    this.\u0275fac = function NgxDatatableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _NgxDatatableComponent)(\u0275\u0275directiveInject(UntypedFormBuilder), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NgxDatatableComponent, selectors: [["app-ngx-datatable"]], viewQuery: function NgxDatatableComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(DatatableComponent, 5);
        \u0275\u0275viewQuery(DatatableComponent, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.table = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.table2 = _t.first);
      }
    }, decls: 54, vars: 30, consts: [["table", ""], ["table2", ""], [1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "body"], [1, "row"], [1, "col-sm-12"], [1, "ngxTableHeader"], [1, "header-buttons-left", "ms-0", "mb-0"], [1, "dropdown"], [1, "dropdown", "m-l-20"], ["for", "search-input"], [1, "material-icons", "search-icon"], ["id", "search-input", "placeholder", "Search", "type", "text", "aria-label", "Search box", 1, "browser-default", "search-field", 3, "keyup"], [1, "header-buttons"], ["mat-mini-fab", "", "color", "primary"], [1, "col-white"], [1, "material", 3, "rows", "columns", "sortType", "columnMode", "headerHeight", "footerHeight", "rowHeight", "limit"], ["name", "Image", "prop", "img", 3, "sortable", "width"], ["ngx-datatable-cell-template", ""], ["name", "First Name", 3, "width"], ["name", "Last Name", 3, "width"], ["name", "Gender", 3, "width"], ["name", "Phone", 3, "width"], ["name", "Email", 3, "width"], ["name", "Address", 3, "width"], ["name", "Actions", 3, "sortable", "width"], [1, "header"], ["appearance", "fill"], ["matInput", "", 3, "keyup"], [1, "table-img", "padding-0"], ["width", "40", 3, "src"], [1, "btn", "tblActnBtn", "h-auto"], [1, "material-icons"], [1, "btn", "tblActnBtn", "h-auto", 3, "click"]], template: function NgxDatatableComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "section", 2)(1, "div", 3)(2, "div", 4);
        \u0275\u0275element(3, "app-breadcrumb", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 6)(5, "div", 7)(6, "div", 8)(7, "div", 9)(8, "div", 10)(9, "div", 11)(10, "div", 12)(11, "ul", 13)(12, "li", 14)(13, "h2");
        \u0275\u0275text(14, "Advance Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "li", 15)(16, "label", 16)(17, "i", 17);
        \u0275\u0275text(18, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "input", 18);
        \u0275\u0275listener("keyup", function NgxDatatableComponent_Template_input_keyup_19_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.filterDatatable($event));
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(20, "ul", 19)(21, "li")(22, "button", 20)(23, "mat-icon", 21);
        \u0275\u0275text(24, "add");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(25, "ngx-datatable", 22, 0)(27, "ngx-datatable-column", 23);
        \u0275\u0275template(28, NgxDatatableComponent_ng_template_28_Template, 2, 1, "ng-template", 24);
        \u0275\u0275elementEnd();
        \u0275\u0275element(29, "ngx-datatable-column", 25)(30, "ngx-datatable-column", 26)(31, "ngx-datatable-column", 27)(32, "ngx-datatable-column", 28)(33, "ngx-datatable-column", 29)(34, "ngx-datatable-column", 30);
        \u0275\u0275elementStart(35, "ngx-datatable-column", 31);
        \u0275\u0275template(36, NgxDatatableComponent_ng_template_36_Template, 7, 0, "ng-template", 24);
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(37, "div", 6)(38, "div", 7)(39, "div", 8)(40, "div", 32)(41, "h2")(42, "strong");
        \u0275\u0275text(43, "ngx");
        \u0275\u0275elementEnd();
        \u0275\u0275text(44, " Simple Example ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(45, "div", 9)(46, "div", 10)(47, "div", 11)(48, "mat-form-field", 33)(49, "mat-label");
        \u0275\u0275text(50, "Search Here...");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(51, "input", 34);
        \u0275\u0275listener("keyup", function NgxDatatableComponent_Template_input_keyup_51_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.tb2filterDatatable($event));
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275element(52, "ngx-datatable", 22, 1);
        \u0275\u0275elementEnd()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "ngx Datatable")("items", \u0275\u0275pureFunction0(29, _c02))("active_item", "ngx Datatable");
        \u0275\u0275advance(22);
        \u0275\u0275property("rows", ctx.data)("columns", ctx.columns)("sortType", ctx.SortType.multi)("columnMode", "force")("headerHeight", 50)("footerHeight", 50)("rowHeight", 60)("limit", 10);
        \u0275\u0275advance(2);
        \u0275\u0275property("sortable", false)("width", 100);
        \u0275\u0275advance(2);
        \u0275\u0275property("width", 130);
        \u0275\u0275advance();
        \u0275\u0275property("width", 130);
        \u0275\u0275advance();
        \u0275\u0275property("width", 120);
        \u0275\u0275advance();
        \u0275\u0275property("width", 200);
        \u0275\u0275advance();
        \u0275\u0275property("width", 200);
        \u0275\u0275advance();
        \u0275\u0275property("width", 200);
        \u0275\u0275advance();
        \u0275\u0275property("sortable", false)("width", 120);
        \u0275\u0275advance(17);
        \u0275\u0275property("rows", ctx.tb2data)("columns", ctx.tb2columns)("sortType", ctx.SortType.multi)("columnMode", "force")("headerHeight", 50)("footerHeight", 50)("rowHeight", "auto")("limit", 10);
      }
    }, dependencies: [
      BreadcrumbComponent,
      MatButtonModule,
      MatMiniFabButton,
      MatIconModule,
      MatIcon,
      NgxDatatableModule,
      DatatableComponent,
      DataTableColumnDirective,
      DataTableColumnCellDirective,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatInputModule,
      MatInput
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxDatatableComponent, [{
    type: Component,
    args: [{ selector: "app-ngx-datatable", imports: [
      BreadcrumbComponent,
      MatButtonModule,
      MatIconModule,
      NgxDatatableModule,
      MatFormFieldModule,
      MatInputModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'ngx Datatable'" [items]="['Home','Tables']" [active_item]="'ngx Datatable'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-sm-12">\r
                <div class="ngxTableHeader">\r
                  <ul class="header-buttons-left ms-0 mb-0">\r
                    <li class="dropdown">\r
                      <h2>Advance Table</h2>\r
                    </li>\r
                    <li class="dropdown m-l-20">\r
                      <label for="search-input"><i class="material-icons search-icon">search</i></label>\r
                      <input id="search-input" placeholder="Search" type="text" class="browser-default search-field"\r
                        (keyup)='filterDatatable($event)' aria-label="Search box">\r
                    </li>\r
                  </ul>\r
                  <ul class="header-buttons">\r
                    <li>\r
                      <button mat-mini-fab color="primary">\r
                        <mat-icon class="col-white">add</mat-icon>\r
                      </button>\r
                    </li>\r
                  </ul>\r
                </div>\r
                <ngx-datatable #table class="material" [rows]="data" [columns]="columns" [sortType]="SortType.multi"\r
                  [columnMode]="'force'" [headerHeight]="50" [footerHeight]="50" [rowHeight]="60" [limit]="10">\r
                  <!-- user image -->\r
                  <ngx-datatable-column name="Image" [sortable]="false" prop="img" [width]="100">\r
                    <ng-template let-row="data" let-value="value" let-i="index" ngx-datatable-cell-template>\r
                      <td class="table-img padding-0">\r
                        <img width="40" src="{{ value }}" />\r
                      </td>\r
                    </ng-template>\r
                  </ngx-datatable-column>\r
                  <ngx-datatable-column name="First Name" [width]="130"></ngx-datatable-column>\r
                  <ngx-datatable-column name="Last Name" [width]="130"></ngx-datatable-column>\r
                  <ngx-datatable-column name="Gender" [width]="120"></ngx-datatable-column>\r
                  <ngx-datatable-column name="Phone" [width]="200"></ngx-datatable-column>\r
                  <ngx-datatable-column name="Email" [width]="200"></ngx-datatable-column>\r
                  <ngx-datatable-column name="Address" [width]="200"></ngx-datatable-column>\r
                  <!-- <ngx-datatable-column *ngFor="let col of columns" [name]="col.name">\r
                                    </ngx-datatable-column> -->\r
                  <!-- action buttons -->\r
                  <ngx-datatable-column name="Actions" [sortable]="false" [width]="120">\r
                    <ng-template let-value="value" let-row="row" let-rowIndex="rowIndex" ngx-datatable-cell-template>\r
                      <span>\r
                        <button class="btn tblActnBtn h-auto">\r
                          <i class="material-icons">mode_edit</i>\r
                        </button>\r
                        <button class="btn tblActnBtn h-auto" (click)='deleteRow(row)'>\r
                          <i class="material-icons">delete</i>\r
                        </button>\r
                      </span>\r
                    </ng-template>\r
                  </ngx-datatable-column>\r
                </ngx-datatable>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>ngx</strong> Simple Example\r
            </h2>\r
\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-sm-12">\r
                <mat-form-field appearance="fill">\r
                  <mat-label>Search Here...</mat-label>\r
                  <input matInput (keyup)='tb2filterDatatable($event)'>\r
                </mat-form-field>\r
                <ngx-datatable #table2 class="material" [rows]="tb2data" [columns]="tb2columns"\r
                  [sortType]="SortType.multi" [columnMode]="'force'" [headerHeight]="50" [footerHeight]="50"\r
                  [rowHeight]="'auto'" [limit]="10">\r
                </ngx-datatable>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [{ type: UntypedFormBuilder }, { type: MatSnackBar }], { table: [{
    type: ViewChild,
    args: [DatatableComponent, { static: false }]
  }], table2: [{
    type: ViewChild,
    args: [DatatableComponent, { static: false }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NgxDatatableComponent, { className: "NgxDatatableComponent", filePath: "src/app/tables/ngx-datatable/ngx-datatable.component.ts", lineNumber: 37 });
})();

// src/app/tables/material-table/material-table.component.ts
var _c03 = () => ["Home", "Tables"];
var _c1 = () => [5, 10, 20];
function MaterialTableComponent_th_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " No. ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r1.no, " ");
  }
}
function MaterialTableComponent_th_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Name ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r2.name, " ");
  }
}
function MaterialTableComponent_th_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Gender ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r3.gender, " ");
  }
}
function MaterialTableComponent_th_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Email ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r4.email, " ");
  }
}
function MaterialTableComponent_th_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Address ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r5.address, " ");
  }
}
function MaterialTableComponent_th_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Mobile ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r6.mobile, " ");
  }
}
function MaterialTableComponent_th_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Salary ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r7.salary, " ");
  }
}
function MaterialTableComponent_tr_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 26);
  }
}
function MaterialTableComponent_tr_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 27);
  }
}
function MaterialTableComponent_th_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " No. ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r8.no, " ");
  }
}
function MaterialTableComponent_th_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Name ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r9.name, " ");
  }
}
function MaterialTableComponent_th_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Gender ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r10.gender, " ");
  }
}
function MaterialTableComponent_th_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Email ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r11 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r11.email, " ");
  }
}
function MaterialTableComponent_th_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Address ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r12 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r12.address, " ");
  }
}
function MaterialTableComponent_th_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Mobile ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r13 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r13.mobile, " ");
  }
}
function MaterialTableComponent_th_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Salary ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r14.salary, " ");
  }
}
function MaterialTableComponent_tr_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 26);
  }
}
function MaterialTableComponent_tr_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 27);
  }
}
function MaterialTableComponent_th_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " No. ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r15.no, " ");
  }
}
function MaterialTableComponent_th_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Name ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_90_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r16.name, " ");
  }
}
function MaterialTableComponent_th_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Gender ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r17.gender, " ");
  }
}
function MaterialTableComponent_th_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Email ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_96_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r18 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r18.email, " ");
  }
}
function MaterialTableComponent_th_98_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Address ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_99_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r19 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r19.address, " ");
  }
}
function MaterialTableComponent_th_101_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Mobile ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_102_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r20 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r20.mobile, " ");
  }
}
function MaterialTableComponent_th_104_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 24);
    \u0275\u0275text(1, " Salary ");
    \u0275\u0275elementEnd();
  }
}
function MaterialTableComponent_td_105_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r21 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r21.salary, " ");
  }
}
function MaterialTableComponent_tr_106_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 26);
  }
}
function MaterialTableComponent_tr_107_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 27);
  }
}
var ELEMENT_DATA = [
  {
    no: 1,
    name: "John Doe",
    gender: "male",
    email: "test@example.com",
    address: "729 S. Paris Hill St",
    mobile: 1234567890,
    salary: 12e4
  },
  {
    no: 2,
    name: "Sarah Smith",
    gender: "female",
    email: "test@example.com",
    address: "9003 Lake Street Hinesville",
    mobile: 1234567890,
    salary: 17e4
  },
  {
    no: 3,
    name: "Airi Satou",
    gender: "male",
    email: "test@example.com",
    address: "848 Old Durham Street Piedmont",
    mobile: 1234567890,
    salary: 15e4
  },
  {
    no: 4,
    name: "Angelica Ramos",
    gender: "male",
    email: "test@example.com",
    address: "8008 Anderson Drive Titusville",
    mobile: 1234567890,
    salary: 19e4
  },
  {
    no: 5,
    name: "Ashton Cox",
    gender: "female",
    email: "test@example.com",
    address: "620 East Ave. Dundalk",
    mobile: 1234567890,
    salary: 14e4
  },
  {
    no: 6,
    name: "Cara Stevens",
    gender: "male",
    email: "test@example.com",
    address: "9641 Delaware Street Camp Hill",
    mobile: 1234567890,
    salary: 22e4
  },
  {
    no: 7,
    name: "Jens Brincker",
    gender: "male",
    email: "test@example.com",
    address: "83 Pennsylvania Road",
    mobile: 1234567890,
    salary: 17e4
  },
  {
    no: 8,
    name: "Mark Hay",
    gender: "female",
    email: "test@example.com",
    address: "786 Lake Forest Rd. Biloxi",
    mobile: 1234567890,
    salary: 32e4
  },
  {
    no: 9,
    name: "Anthony Davie",
    gender: "male",
    email: "test@example.com",
    address: "226 Heritage Dr. Durham",
    mobile: 1234567890,
    salary: 62e4
  },
  {
    no: 10,
    name: "Sue Woodger",
    gender: "male",
    email: "test@example.com",
    address: "7 SE. Pumpkin Hill Lane",
    mobile: 1234567890,
    salary: 11e4
  }
];
var MaterialTableComponent = class _MaterialTableComponent {
  applyFilter(event) {
    const filterValue = event.target.value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }
  constructor() {
    this.displayedColumns = [
      "no",
      "name",
      "gender",
      "email",
      "address",
      "mobile",
      "salary"
    ];
    this.dataSource = ELEMENT_DATA;
    this.dataSource2 = new MatTableDataSource(ELEMENT_DATA);
    this.dataSource3 = new MatTableDataSource(ELEMENT_DATA);
  }
  ngOnInit() {
    this.dataSource2.paginator = this.paginator;
  }
  static {
    this.\u0275fac = function MaterialTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _MaterialTableComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MaterialTableComponent, selectors: [["app-material-table"]], viewQuery: function MaterialTableComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatPaginator, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.paginator = _t.first);
      }
    }, decls: 108, vars: 15, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "header"], [1, "body", "table-responsive"], ["mat-table", "", 1, "w-100", 3, "dataSource"], ["matColumnDef", "no"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "name"], ["matColumnDef", "gender"], ["matColumnDef", "email"], ["matColumnDef", "address"], ["matColumnDef", "mobile"], ["matColumnDef", "salary"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["showFirstLastButtons", "", 3, "pageSizeOptions"], ["appearance", "outline", 1, "example-full-width"], ["matInput", "", "placeholder", "Ex. ium", 3, "keyup"], ["mat-header-cell", ""], ["mat-cell", ""], ["mat-header-row", ""], ["mat-row", ""]], template: function MaterialTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "Basic");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 8)(13, "table", 9);
        \u0275\u0275elementContainerStart(14, 10);
        \u0275\u0275template(15, MaterialTableComponent_th_15_Template, 2, 0, "th", 11)(16, MaterialTableComponent_td_16_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(17, 13);
        \u0275\u0275template(18, MaterialTableComponent_th_18_Template, 2, 0, "th", 11)(19, MaterialTableComponent_td_19_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(20, 14);
        \u0275\u0275template(21, MaterialTableComponent_th_21_Template, 2, 0, "th", 11)(22, MaterialTableComponent_td_22_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(23, 15);
        \u0275\u0275template(24, MaterialTableComponent_th_24_Template, 2, 0, "th", 11)(25, MaterialTableComponent_td_25_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(26, 16);
        \u0275\u0275template(27, MaterialTableComponent_th_27_Template, 2, 0, "th", 11)(28, MaterialTableComponent_td_28_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(29, 17);
        \u0275\u0275template(30, MaterialTableComponent_th_30_Template, 2, 0, "th", 11)(31, MaterialTableComponent_td_31_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(32, 18);
        \u0275\u0275template(33, MaterialTableComponent_th_33_Template, 2, 0, "th", 11)(34, MaterialTableComponent_td_34_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(35, MaterialTableComponent_tr_35_Template, 1, 0, "tr", 19)(36, MaterialTableComponent_tr_36_Template, 1, 0, "tr", 20);
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(37, "div", 4)(38, "div", 5)(39, "div", 6)(40, "div", 7)(41, "h2")(42, "strong");
        \u0275\u0275text(43, "Pagination");
        \u0275\u0275elementEnd();
        \u0275\u0275text(44, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(45, "div", 8)(46, "table", 9);
        \u0275\u0275elementContainerStart(47, 10);
        \u0275\u0275template(48, MaterialTableComponent_th_48_Template, 2, 0, "th", 11)(49, MaterialTableComponent_td_49_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(50, 13);
        \u0275\u0275template(51, MaterialTableComponent_th_51_Template, 2, 0, "th", 11)(52, MaterialTableComponent_td_52_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(53, 14);
        \u0275\u0275template(54, MaterialTableComponent_th_54_Template, 2, 0, "th", 11)(55, MaterialTableComponent_td_55_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(56, 15);
        \u0275\u0275template(57, MaterialTableComponent_th_57_Template, 2, 0, "th", 11)(58, MaterialTableComponent_td_58_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(59, 16);
        \u0275\u0275template(60, MaterialTableComponent_th_60_Template, 2, 0, "th", 11)(61, MaterialTableComponent_td_61_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(62, 17);
        \u0275\u0275template(63, MaterialTableComponent_th_63_Template, 2, 0, "th", 11)(64, MaterialTableComponent_td_64_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(65, 18);
        \u0275\u0275template(66, MaterialTableComponent_th_66_Template, 2, 0, "th", 11)(67, MaterialTableComponent_td_67_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(68, MaterialTableComponent_tr_68_Template, 1, 0, "tr", 19)(69, MaterialTableComponent_tr_69_Template, 1, 0, "tr", 20);
        \u0275\u0275elementEnd();
        \u0275\u0275element(70, "mat-paginator", 21);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(71, "div", 4)(72, "div", 5)(73, "div", 6)(74, "div", 7)(75, "h2")(76, "strong");
        \u0275\u0275text(77, "Filter");
        \u0275\u0275elementEnd();
        \u0275\u0275text(78, " Table");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(79, "div", 8)(80, "mat-form-field", 22)(81, "mat-label");
        \u0275\u0275text(82, "Filter");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "input", 23);
        \u0275\u0275listener("keyup", function MaterialTableComponent_Template_input_keyup_83_listener($event) {
          return ctx.applyFilter($event);
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(84, "table", 9);
        \u0275\u0275elementContainerStart(85, 10);
        \u0275\u0275template(86, MaterialTableComponent_th_86_Template, 2, 0, "th", 11)(87, MaterialTableComponent_td_87_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(88, 13);
        \u0275\u0275template(89, MaterialTableComponent_th_89_Template, 2, 0, "th", 11)(90, MaterialTableComponent_td_90_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(91, 14);
        \u0275\u0275template(92, MaterialTableComponent_th_92_Template, 2, 0, "th", 11)(93, MaterialTableComponent_td_93_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(94, 15);
        \u0275\u0275template(95, MaterialTableComponent_th_95_Template, 2, 0, "th", 11)(96, MaterialTableComponent_td_96_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(97, 16);
        \u0275\u0275template(98, MaterialTableComponent_th_98_Template, 2, 0, "th", 11)(99, MaterialTableComponent_td_99_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(100, 17);
        \u0275\u0275template(101, MaterialTableComponent_th_101_Template, 2, 0, "th", 11)(102, MaterialTableComponent_td_102_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(103, 18);
        \u0275\u0275template(104, MaterialTableComponent_th_104_Template, 2, 0, "th", 11)(105, MaterialTableComponent_td_105_Template, 2, 1, "td", 12);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(106, MaterialTableComponent_tr_106_Template, 1, 0, "tr", 19)(107, MaterialTableComponent_tr_107_Template, 1, 0, "tr", 20);
        \u0275\u0275elementEnd()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Material Table")("items", \u0275\u0275pureFunction0(13, _c03))("active_item", "Material Table");
        \u0275\u0275advance(10);
        \u0275\u0275property("dataSource", ctx.dataSource);
        \u0275\u0275advance(22);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
        \u0275\u0275advance(10);
        \u0275\u0275property("dataSource", ctx.dataSource2);
        \u0275\u0275advance(22);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("pageSizeOptions", \u0275\u0275pureFunction0(14, _c1));
        \u0275\u0275advance(14);
        \u0275\u0275property("dataSource", ctx.dataSource3);
        \u0275\u0275advance(22);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
      }
    }, dependencies: [
      BreadcrumbComponent,
      MatTableModule,
      MatTable,
      MatHeaderCellDef,
      MatHeaderRowDef,
      MatColumnDef,
      MatCellDef,
      MatRowDef,
      MatHeaderCell,
      MatCell,
      MatHeaderRow,
      MatRow,
      MatPaginatorModule,
      MatPaginator,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatInputModule,
      MatInput
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaterialTableComponent, [{
    type: Component,
    args: [{ selector: "app-material-table", imports: [
      BreadcrumbComponent,
      MatTableModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatInputModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Material Table'" [items]="['Home','Tables']" [active_item]="'Material Table'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Basic</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table mat-table [dataSource]="dataSource" class="w-100">\r
              <!-- No Column -->\r
              <ng-container matColumnDef="no">\r
                <th mat-header-cell *matHeaderCellDef> No. </th>\r
                <td mat-cell *matCellDef="let element"> {{element.no}} </td>\r
              </ng-container>\r
              <!-- Name Column -->\r
              <ng-container matColumnDef="name">\r
                <th mat-header-cell *matHeaderCellDef> Name </th>\r
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>\r
              </ng-container>\r
              <!-- Gender Column -->\r
              <ng-container matColumnDef="gender">\r
                <th mat-header-cell *matHeaderCellDef> Gender </th>\r
                <td mat-cell *matCellDef="let element"> {{element.gender}} </td>\r
              </ng-container>\r
              <!-- Email Column -->\r
              <ng-container matColumnDef="email">\r
                <th mat-header-cell *matHeaderCellDef> Email </th>\r
                <td mat-cell *matCellDef="let element"> {{element.email}} </td>\r
              </ng-container>\r
              <!-- Address Column -->\r
              <ng-container matColumnDef="address">\r
                <th mat-header-cell *matHeaderCellDef> Address </th>\r
                <td mat-cell *matCellDef="let element"> {{element.address}} </td>\r
              </ng-container>\r
              <!-- Mobile Column -->\r
              <ng-container matColumnDef="mobile">\r
                <th mat-header-cell *matHeaderCellDef> Mobile </th>\r
                <td mat-cell *matCellDef="let element"> {{element.mobile}} </td>\r
              </ng-container>\r
              <!-- Salary Column -->\r
              <ng-container matColumnDef="salary">\r
                <th mat-header-cell *matHeaderCellDef> Salary </th>\r
                <td mat-cell *matCellDef="let element"> {{element.salary}} </td>\r
              </ng-container>\r
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Pagination</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <table mat-table [dataSource]="dataSource2" class="w-100">\r
              <!-- No Column -->\r
              <ng-container matColumnDef="no">\r
                <th mat-header-cell *matHeaderCellDef> No. </th>\r
                <td mat-cell *matCellDef="let element"> {{element.no}} </td>\r
              </ng-container>\r
              <!-- Name Column -->\r
              <ng-container matColumnDef="name">\r
                <th mat-header-cell *matHeaderCellDef> Name </th>\r
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>\r
              </ng-container>\r
              <!-- Gender Column -->\r
              <ng-container matColumnDef="gender">\r
                <th mat-header-cell *matHeaderCellDef> Gender </th>\r
                <td mat-cell *matCellDef="let element"> {{element.gender}} </td>\r
              </ng-container>\r
              <!-- Email Column -->\r
              <ng-container matColumnDef="email">\r
                <th mat-header-cell *matHeaderCellDef> Email </th>\r
                <td mat-cell *matCellDef="let element"> {{element.email}} </td>\r
              </ng-container>\r
              <!-- Address Column -->\r
              <ng-container matColumnDef="address">\r
                <th mat-header-cell *matHeaderCellDef> Address </th>\r
                <td mat-cell *matCellDef="let element"> {{element.address}} </td>\r
              </ng-container>\r
              <!-- Mobile Column -->\r
              <ng-container matColumnDef="mobile">\r
                <th mat-header-cell *matHeaderCellDef> Mobile </th>\r
                <td mat-cell *matCellDef="let element"> {{element.mobile}} </td>\r
              </ng-container>\r
              <!-- Salary Column -->\r
              <ng-container matColumnDef="salary">\r
                <th mat-header-cell *matHeaderCellDef> Salary </th>\r
                <td mat-cell *matCellDef="let element"> {{element.salary}} </td>\r
              </ng-container>\r
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>\r
            </table>\r
            <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Filter</strong> Table</h2>\r
          </div>\r
          <div class="body table-responsive">\r
            <mat-form-field class="example-full-width" appearance="outline">\r
              <mat-label>Filter</mat-label>\r
              <input matInput (keyup)="applyFilter($event)" placeholder="Ex. ium">\r
            </mat-form-field>\r
            <table mat-table [dataSource]="dataSource3" class="w-100">\r
              <!-- No Column -->\r
              <ng-container matColumnDef="no">\r
                <th mat-header-cell *matHeaderCellDef> No. </th>\r
                <td mat-cell *matCellDef="let element"> {{element.no}} </td>\r
              </ng-container>\r
              <!-- Name Column -->\r
              <ng-container matColumnDef="name">\r
                <th mat-header-cell *matHeaderCellDef> Name </th>\r
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>\r
              </ng-container>\r
              <!-- Gender Column -->\r
              <ng-container matColumnDef="gender">\r
                <th mat-header-cell *matHeaderCellDef> Gender </th>\r
                <td mat-cell *matCellDef="let element"> {{element.gender}} </td>\r
              </ng-container>\r
              <!-- Email Column -->\r
              <ng-container matColumnDef="email">\r
                <th mat-header-cell *matHeaderCellDef> Email </th>\r
                <td mat-cell *matCellDef="let element"> {{element.email}} </td>\r
              </ng-container>\r
              <!-- Address Column -->\r
              <ng-container matColumnDef="address">\r
                <th mat-header-cell *matHeaderCellDef> Address </th>\r
                <td mat-cell *matCellDef="let element"> {{element.address}} </td>\r
              </ng-container>\r
              <!-- Mobile Column -->\r
              <ng-container matColumnDef="mobile">\r
                <th mat-header-cell *matHeaderCellDef> Mobile </th>\r
                <td mat-cell *matCellDef="let element"> {{element.mobile}} </td>\r
              </ng-container>\r
              <!-- Salary Column -->\r
              <ng-container matColumnDef="salary">\r
                <th mat-header-cell *matHeaderCellDef> Salary </th>\r
                <td mat-cell *matCellDef="let element"> {{element.salary}} </td>\r
              </ng-container>\r
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>\r
            </table>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], { paginator: [{
    type: ViewChild,
    args: [MatPaginator, { static: true }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MaterialTableComponent, { className: "MaterialTableComponent", filePath: "src/app/tables/material-table/material-table.component.ts", lineNumber: 120 });
})();

// src/app/tables/tables.routes.ts
var TEBLES_ROUTE = [
  {
    path: "",
    redirectTo: "basic-tables",
    pathMatch: "full"
  },
  {
    path: "basic-tables",
    component: BasicTableComponent
  },
  {
    path: "material-tables",
    component: MaterialTableComponent
  },
  {
    path: "ngx-datatable",
    component: NgxDatatableComponent
  }
];
export {
  TEBLES_ROUTE
};
//# sourceMappingURL=tables.routes-K2BM4MPQ.js.map
