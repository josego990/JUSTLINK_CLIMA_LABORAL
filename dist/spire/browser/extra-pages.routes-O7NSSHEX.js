import {
  MatTab,
  MatTabGroup,
  MatTabLabel,
  MatTabsModule
} from "./chunk-UGE7ZYOS.js";
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "./chunk-6F5SWNYE.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-SKPM4PVR.js";
import "./chunk-TWFG2YEX.js";
import "./chunk-AMSP6ESA.js";
import {
  MatInput,
  MatInputModule
} from "./chunk-4H7Z4NNN.js";
import {
  BreadcrumbComponent
} from "./chunk-2TM4C2ER.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-J7QVNPTM.js";
import "./chunk-V7JA7XTT.js";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel
} from "./chunk-DKBY3V4W.js";
import "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton
} from "./chunk-6OUKOU55.js";
import "./chunk-Y73QBUAC.js";
import "./chunk-WZAKLMWR.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/extra-pages/profile/profile.component.ts
var _c0 = () => ["Home", "Extra"];
function ProfileComponent_ng_template_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 47);
    \u0275\u0275text(1, "face");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " About Me ");
  }
}
function ProfileComponent_ng_template_179_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 47);
    \u0275\u0275text(1, "settings");
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Settings ");
  }
}
var ProfileComponent = class _ProfileComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function ProfileComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ProfileComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProfileComponent, selectors: [["app-profile"]], decls: 257, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-lg-4", "col-md-12"], [1, "card"], [1, "m-b-20"], [1, "contact-grid"], [1, "profile-header", "bg-dark"], [1, "user-name"], [1, "name-center"], ["src", "assets/images/user/usrbig3.jpg", "alt", "", 1, "user-img"], [1, "phone"], [1, "material-icons"], [1, "row"], [1, "col-4"], ["mat-align-tabs", "start"], ["label", "About"], [1, "p-4"], [1, "text-default"], [1, "text-muted"], ["label", "Skills"], [1, "list-unstyled", "p-4"], [1, "progress", "skill-progress", "m-b-20"], ["role", "progressbar", "aria-valuenow", "45", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", "l-bg-green", "width-per-45"], ["role", "progressbar", "aria-valuenow", "38", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", "l-bg-orange", "width-per-38"], ["role", "progressbar", "aria-valuenow", "39", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", "l-bg-cyan", "width-per-39"], ["role", "progressbar", "aria-valuenow", "70", "aria-valuemin", "0", "aria-valuemax", "100", 1, "progress-bar", "l-bg-purple", "width-per-70"], [1, "col-lg-8", "col-md-12"], ["mat-tab-label", ""], [1, "col-lg-12", "col-md-12", "col-sm-12"], [1, "project_widget"], [1, "header"], [1, "body"], [1, "col-md-3", "col-6", "b-r"], [1, "col-md-3", "col-6"], [1, "m-t-30"], [1, "example-container"], ["appearance", "fill", 1, "example-full-width"], ["matInput", ""], ["matInput", "", "type", "password"], ["mat-raised-button", "", "color", "primary"], [1, "col-lg-6", "col-md-12"], [1, "form-group"], [1, "col-md-12"], [1, "example-margin"], [1, "example-tab-icon", "msr-2"]], template: function ProfileComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "div", 10);
        \u0275\u0275text(11, "John Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 11);
        \u0275\u0275text(13, "Software Engineer");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(14, "img", 12);
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16, " 456, Estern evenue, Courtage area, ");
        \u0275\u0275element(17, "br");
        \u0275\u0275text(18, "New York ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "div")(20, "span", 13)(21, "i", 14);
        \u0275\u0275text(22, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(23, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(24, "div", 15)(25, "div", 16)(26, "h5");
        \u0275\u0275text(27, "564");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "small");
        \u0275\u0275text(29, "Following");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(30, "div", 16)(31, "h5");
        \u0275\u0275text(32, "18k");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "small");
        \u0275\u0275text(34, "Followers");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(35, "div", 16)(36, "h5");
        \u0275\u0275text(37, "565");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "small");
        \u0275\u0275text(39, "Post");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(40, "div", 6)(41, "mat-tab-group", 17)(42, "mat-tab", 18)(43, "div", 19)(44, "p", 20);
        \u0275\u0275text(45, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(46, "small", 21);
        \u0275\u0275text(47, "Email address: ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "p");
        \u0275\u0275text(49, "john@gmail.com");
        \u0275\u0275elementEnd();
        \u0275\u0275element(50, "hr");
        \u0275\u0275elementStart(51, "small", 21);
        \u0275\u0275text(52, "Phone: ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(53, "p");
        \u0275\u0275text(54, "+91 1234567890");
        \u0275\u0275elementEnd();
        \u0275\u0275element(55, "hr");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(56, "mat-tab", 22)(57, "ul", 23)(58, "li")(59, "div");
        \u0275\u0275text(60, "Photoshop");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(61, "div", 24);
        \u0275\u0275element(62, "div", 25);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(63, "li")(64, "div");
        \u0275\u0275text(65, "Wordpress");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "div", 24);
        \u0275\u0275element(67, "div", 26);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(68, "li")(69, "div");
        \u0275\u0275text(70, "HTML 5");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(71, "div", 24);
        \u0275\u0275element(72, "div", 27);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(73, "li")(74, "div");
        \u0275\u0275text(75, "Angular");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(76, "div", 24);
        \u0275\u0275element(77, "div", 28);
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(78, "div", 29)(79, "div", 6)(80, "mat-tab-group")(81, "mat-tab");
        \u0275\u0275template(82, ProfileComponent_ng_template_82_Template, 3, 0, "ng-template", 30);
        \u0275\u0275elementStart(83, "div", 31)(84, "div", 32)(85, "div", 33)(86, "h2")(87, "strong");
        \u0275\u0275text(88, "About");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(89, "div", 34)(90, "div", 15)(91, "div", 35)(92, "strong");
        \u0275\u0275text(93, "Full Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(94, "br");
        \u0275\u0275elementStart(95, "p", 21);
        \u0275\u0275text(96, "Emily Smith");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(97, "div", 35)(98, "strong");
        \u0275\u0275text(99, "Mobile");
        \u0275\u0275elementEnd();
        \u0275\u0275element(100, "br");
        \u0275\u0275elementStart(101, "p", 21);
        \u0275\u0275text(102, "(123) 456 7890");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(103, "div", 35)(104, "strong");
        \u0275\u0275text(105, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(106, "br");
        \u0275\u0275elementStart(107, "p", 21);
        \u0275\u0275text(108, "johndeo@example.com");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(109, "div", 36)(110, "strong");
        \u0275\u0275text(111, "Location");
        \u0275\u0275elementEnd();
        \u0275\u0275element(112, "br");
        \u0275\u0275elementStart(113, "p", 21);
        \u0275\u0275text(114, "India");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(115, "p", 37);
        \u0275\u0275text(116, "Completed my graduation in Arts from the well known and renowned institution of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA in 2000-01, which was affiliated to M.S. University. I ranker in University exams from the same university from 1996-01.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(117, "p");
        \u0275\u0275text(118, "Worked as Professor and Head of the department at Sarda Collage, Rajkot, Gujarat from 2003-2015 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(119, "p");
        \u0275\u0275text(120, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.");
        \u0275\u0275elementEnd();
        \u0275\u0275element(121, "br");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(122, "div", 31)(123, "div", 32)(124, "div", 33)(125, "h2")(126, "strong");
        \u0275\u0275text(127, "Education");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(128, "div", 34)(129, "ul")(130, "li");
        \u0275\u0275text(131, "B.A.,Gujarat University, Ahmedabad,India.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(132, "li");
        \u0275\u0275text(133, "M.A.,Gujarat University, Ahmedabad, India.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(134, "li");
        \u0275\u0275text(135, "P.H.D., Shaurashtra University, Rajkot");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(136, "div", 31)(137, "div", 32)(138, "div", 33)(139, "h2")(140, "strong");
        \u0275\u0275text(141, "Experience");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(142, "div", 34)(143, "ul")(144, "li");
        \u0275\u0275text(145, "One year experience as Jr. Professor from April-2009 to march-2010 at B. J. Arts College, Ahmedabad.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(146, "li");
        \u0275\u0275text(147, "Three year experience as Jr. Professor at V.S. Arts & Commerse Collage from April - 2008 to April - 2011.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(148, "li");
        \u0275\u0275text(149, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(150, "li");
        \u0275\u0275text(151, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(152, "li");
        \u0275\u0275text(153, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(154, "li");
        \u0275\u0275text(155, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(156, "div", 31)(157, "div", 32)(158, "div", 33)(159, "h2")(160, "strong");
        \u0275\u0275text(161, "Conferences, Cources & Workshop Attended");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(162, "div", 34)(163, "ul")(164, "li");
        \u0275\u0275text(165, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(166, "li");
        \u0275\u0275text(167, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(168, "li");
        \u0275\u0275text(169, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(170, "li");
        \u0275\u0275text(171, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(172, "li");
        \u0275\u0275text(173, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(174, "li");
        \u0275\u0275text(175, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(176, "li");
        \u0275\u0275text(177, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(178, "mat-tab");
        \u0275\u0275template(179, ProfileComponent_ng_template_179_Template, 3, 0, "ng-template", 30);
        \u0275\u0275elementStart(180, "div", 33)(181, "h2")(182, "strong");
        \u0275\u0275text(183, "Security");
        \u0275\u0275elementEnd();
        \u0275\u0275text(184, " Settings");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(185, "div", 34)(186, "div", 38)(187, "mat-form-field", 39)(188, "mat-label");
        \u0275\u0275text(189, "Username");
        \u0275\u0275elementEnd();
        \u0275\u0275element(190, "input", 40);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(191, "mat-form-field", 39)(192, "mat-label");
        \u0275\u0275text(193, "Current Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(194, "input", 41);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(195, "mat-form-field", 39)(196, "mat-label");
        \u0275\u0275text(197, "New Password");
        \u0275\u0275elementEnd();
        \u0275\u0275element(198, "input", 41);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(199, "button", 42);
        \u0275\u0275text(200, "Save");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(201, "div", 33)(202, "h2")(203, "strong");
        \u0275\u0275text(204, "Account");
        \u0275\u0275elementEnd();
        \u0275\u0275text(205, " Settings");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(206, "div", 34)(207, "div", 4)(208, "div", 43)(209, "div", 44)(210, "mat-form-field", 39)(211, "mat-label");
        \u0275\u0275text(212, "First Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(213, "input", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(214, "div", 43)(215, "div", 44)(216, "mat-form-field", 39)(217, "mat-label");
        \u0275\u0275text(218, "Last Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(219, "input", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(220, "div", 5)(221, "div", 44)(222, "mat-form-field", 39)(223, "mat-label");
        \u0275\u0275text(224, "City");
        \u0275\u0275elementEnd();
        \u0275\u0275element(225, "input", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(226, "div", 5)(227, "div", 44)(228, "mat-form-field", 39)(229, "mat-label");
        \u0275\u0275text(230, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(231, "input", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(232, "div", 5)(233, "div", 44)(234, "mat-form-field", 39)(235, "mat-label");
        \u0275\u0275text(236, "Country");
        \u0275\u0275elementEnd();
        \u0275\u0275element(237, "input", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(238, "div", 45)(239, "div", 44)(240, "mat-form-field", 39)(241, "mat-label");
        \u0275\u0275text(242, "Address");
        \u0275\u0275elementEnd();
        \u0275\u0275element(243, "textarea", 40);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(244, "div", 45)(245, "div", 44)(246, "mat-checkbox", 46);
        \u0275\u0275text(247, "Profile Visibility For Everyone ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(248, "div", 44)(249, "mat-checkbox", 46);
        \u0275\u0275text(250, "New task notifications ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(251, "div", 44)(252, "mat-checkbox", 46);
        \u0275\u0275text(253, "New friend request notifications ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(254, "div", 45)(255, "button", 42);
        \u0275\u0275text(256, "Save Changes");
        \u0275\u0275elementEnd()()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Profile")("items", \u0275\u0275pureFunction0(3, _c0))("active_item", "Profile");
      }
    }, dependencies: [
      BreadcrumbComponent,
      MatTabsModule,
      MatTabLabel,
      MatTab,
      MatTabGroup,
      MatIconModule,
      MatIcon,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatInputModule,
      MatInput,
      MatButtonModule,
      MatButton,
      MatCheckboxModule,
      MatCheckbox
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProfileComponent, [{
    type: Component,
    args: [{ selector: "app-profile", imports: [
      BreadcrumbComponent,
      MatTabsModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Profile'" [items]="['Home','Extra']" [active_item]="'Profile'">\r
      </app-breadcrumb>\r
    </div>\r
    <!-- Your content goes here  -->\r
    <div class="row clearfix">\r
      <div class="col-lg-4 col-md-12">\r
        <div class="card">\r
          <div class="m-b-20">\r
            <div class="contact-grid">\r
              <div class="profile-header bg-dark">\r
                <div class="user-name">John Smith</div>\r
                <div class="name-center">Software Engineer</div>\r
              </div>\r
              <img src="assets/images/user/usrbig3.jpg" class="user-img" alt="">\r
              <p>\r
                456, Estern evenue, Courtage area,\r
                <br />New York\r
              </p>\r
              <div>\r
                <span class="phone">\r
                  <i class="material-icons">phone</i>264-625-2583</span>\r
              </div>\r
              <div class="row">\r
                <div class="col-4">\r
                  <h5>564</h5>\r
                  <small>Following</small>\r
                </div>\r
                <div class="col-4">\r
                  <h5>18k</h5>\r
                  <small>Followers</small>\r
                </div>\r
                <div class="col-4">\r
                  <h5>565</h5>\r
                  <small>Post</small>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
        <div class="card">\r
          <mat-tab-group mat-align-tabs="start">\r
            <mat-tab label="About">\r
              <div class="p-4">\r
                <p class="text-default">Lorem Ipsum is simply dummy text of the printing and\r
                  typesetting industry. Lorem Ipsum has\r
                  been the industry's standard dummy text ever since the 1500s, when an unknown\r
                  printer\r
                  took a galley of type and scrambled it to make a type specimen book. It has\r
                  survived\r
                  not only five centuries, but also the leap into electronic typesetting, remaining\r
                  essentially\r
                  unchanged.</p>\r
                <small class="text-muted">Email address: </small>\r
                <p>john&#64;gmail.com</p>\r
                <hr>\r
                <small class="text-muted">Phone: </small>\r
                <p>+91 1234567890</p>\r
                <hr>\r
              </div>\r
            </mat-tab>\r
            <mat-tab label="Skills">\r
              <ul class="list-unstyled p-4">\r
                <li>\r
                  <div>Photoshop</div>\r
                  <div class="progress skill-progress m-b-20">\r
                    <div class="progress-bar l-bg-green width-per-45" role="progressbar" aria-valuenow="45"\r
                      aria-valuemin="0" aria-valuemax="100"></div>\r
                  </div>\r
                </li>\r
                <li>\r
                  <div>Wordpress</div>\r
                  <div class="progress skill-progress m-b-20">\r
                    <div class="progress-bar l-bg-orange width-per-38" role="progressbar" aria-valuenow="38"\r
                      aria-valuemin="0" aria-valuemax="100"></div>\r
                  </div>\r
                </li>\r
                <li>\r
                  <div>HTML 5</div>\r
                  <div class="progress skill-progress m-b-20">\r
                    <div class="progress-bar l-bg-cyan width-per-39" role="progressbar" aria-valuenow="39"\r
                      aria-valuemin="0" aria-valuemax="100"></div>\r
                  </div>\r
                </li>\r
                <li>\r
                  <div>Angular</div>\r
                  <div class="progress skill-progress m-b-20">\r
                    <div class="progress-bar l-bg-purple width-per-70" role="progressbar" aria-valuenow="70"\r
                      aria-valuemin="0" aria-valuemax="100"></div>\r
                  </div>\r
                </li>\r
              </ul>\r
            </mat-tab>\r
          </mat-tab-group>\r
        </div>\r
      </div>\r
      <div class="col-lg-8 col-md-12">\r
        <div class="card">\r
          <mat-tab-group>\r
            <mat-tab>\r
              <ng-template mat-tab-label>\r
                <mat-icon class="example-tab-icon msr-2">face</mat-icon>\r
                About Me\r
              </ng-template>\r
              <div class="col-lg-12 col-md-12 col-sm-12">\r
                <div class="project_widget">\r
                  <div class="header">\r
                    <h2><strong>About</strong></h2>\r
                  </div>\r
                  <div class="body">\r
                    <div class="row">\r
                      <div class="col-md-3 col-6 b-r">\r
                        <strong>Full Name</strong>\r
                        <br>\r
                        <p class="text-muted">Emily Smith</p>\r
                      </div>\r
                      <div class="col-md-3 col-6 b-r">\r
                        <strong>Mobile</strong>\r
                        <br>\r
                        <p class="text-muted">(123) 456 7890</p>\r
                      </div>\r
                      <div class="col-md-3 col-6 b-r">\r
                        <strong>Email</strong>\r
                        <br>\r
                        <p class="text-muted">johndeo&#64;example.com</p>\r
                      </div>\r
                      <div class="col-md-3 col-6">\r
                        <strong>Location</strong>\r
                        <br>\r
                        <p class="text-muted">India</p>\r
                      </div>\r
                    </div>\r
                    <p class="m-t-30">Completed my graduation in Arts from the well known and\r
                      renowned institution\r
                      of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA in 2000-01, which was\r
                      affiliated\r
                      to M.S. University. I ranker in University exams from the same\r
                      university\r
                      from 1996-01.</p>\r
                    <p>Worked as Professor and Head of the department at Sarda Collage, Rajkot,\r
                      Gujarat\r
                      from 2003-2015 </p>\r
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                      industry. Lorem\r
                      Ipsum has been the industry's standard dummy text ever since the 1500s,\r
                      when\r
                      an unknown printer took a galley of type and scrambled it to make a\r
                      type\r
                      specimen book. It has survived not only five centuries, but also the\r
                      leap\r
                      into electronic typesetting, remaining essentially unchanged.</p>\r
                    <br>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-12 col-md-12 col-sm-12">\r
                <div class="project_widget">\r
                  <div class="header">\r
                    <h2><strong>Education</strong></h2>\r
                  </div>\r
                  <div class="body">\r
                    <ul>\r
                      <li>B.A.,Gujarat University, Ahmedabad,India.</li>\r
                      <li>M.A.,Gujarat University, Ahmedabad, India.</li>\r
                      <li>P.H.D., Shaurashtra University, Rajkot</li>\r
                    </ul>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-12 col-md-12 col-sm-12">\r
                <div class="project_widget">\r
                  <div class="header">\r
                    <h2><strong>Experience</strong></h2>\r
                  </div>\r
                  <div class="body">\r
                    <ul>\r
                      <li>One year experience as Jr. Professor from April-2009 to march-2010\r
                        at B.\r
                        J. Arts College, Ahmedabad.</li>\r
                      <li>Three year experience as Jr. Professor at V.S. Arts &amp; Commerse\r
                        Collage\r
                        from April - 2008 to April - 2011.</li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                    </ul>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-12 col-md-12 col-sm-12">\r
                <div class="project_widget">\r
                  <div class="header">\r
                    <h2><strong>Conferences, Cources &amp; Workshop Attended</strong></h2>\r
                  </div>\r
                  <div class="body">\r
                    <ul>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                      <li>Lorem Ipsum is simply dummy text of the printing and typesetting\r
                        industry.\r
                      </li>\r
                    </ul>\r
                  </div>\r
                </div>\r
              </div>\r
            </mat-tab>\r
            <mat-tab>\r
              <ng-template mat-tab-label>\r
                <mat-icon class="example-tab-icon msr-2">settings</mat-icon>\r
                Settings\r
              </ng-template>\r
              <div class="header">\r
                <h2>\r
                  <strong>Security</strong> Settings</h2>\r
              </div>\r
              <div class="body">\r
                <div class="example-container">\r
                  <mat-form-field class="example-full-width" appearance="fill">\r
                    <mat-label>Username</mat-label>\r
                    <input matInput>\r
                  </mat-form-field>\r
                  <mat-form-field class="example-full-width" appearance="fill">\r
                    <mat-label>Current Password</mat-label>\r
                    <input matInput type="password">\r
                  </mat-form-field>\r
                  <mat-form-field class="example-full-width" appearance="fill">\r
                    <mat-label>New Password</mat-label>\r
                    <input matInput type="password">\r
                  </mat-form-field>\r
                </div>\r
                <button mat-raised-button color="primary">Save</button>\r
              </div>\r
              <div class="header">\r
                <h2>\r
                  <strong>Account</strong> Settings</h2>\r
              </div>\r
              <div class="body">\r
                <div class="row clearfix">\r
                  <div class="col-lg-6 col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>First Name</mat-label>\r
                        <input matInput>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-lg-6 col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>Last Name</mat-label>\r
                        <input matInput>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-lg-4 col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>City</mat-label>\r
                        <input matInput>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-lg-4 col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>Email</mat-label>\r
                        <input matInput>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-lg-4 col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>Country</mat-label>\r
                        <input matInput>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-12">\r
                    <div class="form-group">\r
                      <mat-form-field class="example-full-width" appearance="fill">\r
                        <mat-label>Address</mat-label>\r
                        <textarea matInput></textarea>\r
                      </mat-form-field>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-12">\r
                    <div class="form-group">\r
                      <mat-checkbox class="example-margin">Profile Visibility For Everyone\r
                      </mat-checkbox>\r
                    </div>\r
                    <div class="form-group">\r
                      <mat-checkbox class="example-margin">New task notifications\r
                      </mat-checkbox>\r
                    </div>\r
                    <div class="form-group">\r
                      <mat-checkbox class="example-margin">New friend request notifications\r
                      </mat-checkbox>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-12">\r
                    <button mat-raised-button color="primary">Save Changes</button>\r
                  </div>\r
                </div>\r
              </div>\r
            </mat-tab>\r
          </mat-tab-group>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProfileComponent, { className: "ProfileComponent", filePath: "src/app/extra-pages/profile/profile.component.ts", lineNumber: 23 });
})();

// src/app/extra-pages/pricing/pricing.component.ts
var _c02 = () => ["Home", "Extra"];
var PricingComponent = class _PricingComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function PricingComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _PricingComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PricingComponent, selectors: [["app-pricing"]], decls: 160, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"], [1, "demo"], [1, "container"], [1, "row"], [1, "col-md-3", "col-sm-6"], [1, "pricingTable"], [1, "pricingTable-header"], [1, "material-icons"], [1, "price-value"], [1, "month"], [1, "heading"], [1, "pricing-content"], [1, "pricingTable-signup"], ["href", "#"], [1, "pricingTable", "greenColor"], [1, "pricingTable", "blueColor"], [1, "pricingTable", "redColor"]], template: function PricingComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "Pricing");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Page");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 8)(13, "div", 9)(14, "div", 10)(15, "div", 11)(16, "div", 12)(17, "div", 13)(18, "div", 14)(19, "i", 15);
        \u0275\u0275text(20, "brightness_medium");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "div", 16);
        \u0275\u0275text(22, " $10.00 ");
        \u0275\u0275elementStart(23, "span", 17);
        \u0275\u0275text(24, "per month");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "h3", 18);
        \u0275\u0275text(26, "Standard");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "div", 19)(28, "ul")(29, "li")(30, "b");
        \u0275\u0275text(31, "50GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(32, " Disk Space");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(33, "li")(34, "b");
        \u0275\u0275text(35, "50");
        \u0275\u0275elementEnd();
        \u0275\u0275text(36, " Email Accounts");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "li")(38, "b");
        \u0275\u0275text(39, "50GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(40, " Monthly Bandwidth");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "li")(42, "b");
        \u0275\u0275text(43, "10");
        \u0275\u0275elementEnd();
        \u0275\u0275text(44, " subdomains");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "li")(46, "b");
        \u0275\u0275text(47, "15");
        \u0275\u0275elementEnd();
        \u0275\u0275text(48, " Domains");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(49, "div", 20)(50, "a", 21);
        \u0275\u0275text(51, "sign up");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(52, "div", 12)(53, "div", 22)(54, "div", 14)(55, "i", 15);
        \u0275\u0275text(56, "local_mall");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "div", 16);
        \u0275\u0275text(58, " $20.00 ");
        \u0275\u0275elementStart(59, "span", 17);
        \u0275\u0275text(60, "per month");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(61, "h3", 18);
        \u0275\u0275text(62, "Business");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(63, "div", 19)(64, "ul")(65, "li")(66, "b");
        \u0275\u0275text(67, "60GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(68, " Disk Space");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(69, "li")(70, "b");
        \u0275\u0275text(71, "60");
        \u0275\u0275elementEnd();
        \u0275\u0275text(72, " Email Accounts");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(73, "li")(74, "b");
        \u0275\u0275text(75, "60GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(76, " Monthly Bandwidth");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(77, "li")(78, "b");
        \u0275\u0275text(79, "15");
        \u0275\u0275elementEnd();
        \u0275\u0275text(80, " subdomains");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(81, "li")(82, "b");
        \u0275\u0275text(83, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275text(84, " Domains");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(85, "div", 20)(86, "a", 21);
        \u0275\u0275text(87, "sign up");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(88, "div", 12)(89, "div", 23)(90, "div", 14)(91, "i", 15);
        \u0275\u0275text(92, "spa");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "div", 16);
        \u0275\u0275text(94, " $30.00 ");
        \u0275\u0275elementStart(95, "span", 17);
        \u0275\u0275text(96, "per month");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(97, "h3", 18);
        \u0275\u0275text(98, "PREMIUM");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(99, "div", 19)(100, "ul")(101, "li")(102, "b");
        \u0275\u0275text(103, "70GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(104, " Disk Space");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(105, "li")(106, "b");
        \u0275\u0275text(107, "70");
        \u0275\u0275elementEnd();
        \u0275\u0275text(108, " Email Accounts");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(109, "li")(110, "b");
        \u0275\u0275text(111, "70GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(112, " Monthly Bandwidth");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(113, "li")(114, "b");
        \u0275\u0275text(115, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275text(116, " subdomains");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(117, "li")(118, "b");
        \u0275\u0275text(119, "25");
        \u0275\u0275elementEnd();
        \u0275\u0275text(120, " Domains");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(121, "div", 20)(122, "a", 21);
        \u0275\u0275text(123, "sign up");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(124, "div", 12)(125, "div", 24)(126, "div", 14)(127, "i", 15);
        \u0275\u0275text(128, "filter_vintage");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(129, "div", 16);
        \u0275\u0275text(130, " $40.00 ");
        \u0275\u0275elementStart(131, "span", 17);
        \u0275\u0275text(132, "per month");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(133, "h3", 18);
        \u0275\u0275text(134, "EXTRA");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(135, "div", 19)(136, "ul")(137, "li")(138, "b");
        \u0275\u0275text(139, "80GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(140, " Disk Space");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(141, "li")(142, "b");
        \u0275\u0275text(143, "80");
        \u0275\u0275elementEnd();
        \u0275\u0275text(144, " Email Accounts");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(145, "li")(146, "b");
        \u0275\u0275text(147, "80GB");
        \u0275\u0275elementEnd();
        \u0275\u0275text(148, " Monthly Bandwidth");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(149, "li")(150, "b");
        \u0275\u0275text(151, "20");
        \u0275\u0275elementEnd();
        \u0275\u0275text(152, " subdomains");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(153, "li")(154, "b");
        \u0275\u0275text(155, "35");
        \u0275\u0275elementEnd();
        \u0275\u0275text(156, " Domains");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(157, "div", 20)(158, "a", 21);
        \u0275\u0275text(159, "sign up");
        \u0275\u0275elementEnd()()()()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Pricing")("items", \u0275\u0275pureFunction0(3, _c02))("active_item", "Pricing");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PricingComponent, [{
    type: Component,
    args: [{ selector: "app-pricing", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Pricing'" [items]="['Home','Extra']" [active_item]="'Pricing'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Pricing</strong> Page</h2>\r
          </div>\r
          <div class="body">\r
            <div class="demo">\r
              <div class="container">\r
                <div class="row">\r
                  <div class="col-md-3 col-sm-6">\r
                    <div class="pricingTable">\r
                      <div class="pricingTable-header">\r
                        <i class="material-icons">brightness_medium</i>\r
                        <div class="price-value"> $10.00\r
                          <span class="month">per month</span>\r
                        </div>\r
                      </div>\r
                      <h3 class="heading">Standard</h3>\r
                      <div class="pricing-content">\r
                        <ul>\r
                          <li>\r
                            <b>50GB</b> Disk Space</li>\r
                          <li>\r
                            <b>50</b> Email Accounts</li>\r
                          <li>\r
                            <b>50GB</b> Monthly Bandwidth</li>\r
                          <li>\r
                            <b>10</b> subdomains</li>\r
                          <li>\r
                            <b>15</b> Domains</li>\r
                        </ul>\r
                      </div>\r
                      <div class="pricingTable-signup">\r
                        <a href="#">sign up</a>\r
                      </div>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-3 col-sm-6">\r
                    <div class="pricingTable greenColor">\r
                      <div class="pricingTable-header">\r
                        <i class="material-icons">local_mall</i>\r
                        <div class="price-value"> $20.00\r
                          <span class="month">per month</span>\r
                        </div>\r
                      </div>\r
                      <h3 class="heading">Business</h3>\r
                      <div class="pricing-content">\r
                        <ul>\r
                          <li>\r
                            <b>60GB</b> Disk Space</li>\r
                          <li>\r
                            <b>60</b> Email Accounts</li>\r
                          <li>\r
                            <b>60GB</b> Monthly Bandwidth</li>\r
                          <li>\r
                            <b>15</b> subdomains</li>\r
                          <li>\r
                            <b>20</b> Domains</li>\r
                        </ul>\r
                      </div>\r
                      <div class="pricingTable-signup">\r
                        <a href="#">sign up</a>\r
                      </div>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-3 col-sm-6">\r
                    <div class="pricingTable blueColor">\r
                      <div class="pricingTable-header">\r
                        <i class="material-icons">spa</i>\r
                        <div class="price-value"> $30.00\r
                          <span class="month">per month</span>\r
                        </div>\r
                      </div>\r
                      <h3 class="heading">PREMIUM</h3>\r
                      <div class="pricing-content">\r
                        <ul>\r
                          <li>\r
                            <b>70GB</b> Disk Space</li>\r
                          <li>\r
                            <b>70</b> Email Accounts</li>\r
                          <li>\r
                            <b>70GB</b> Monthly Bandwidth</li>\r
                          <li>\r
                            <b>20</b> subdomains</li>\r
                          <li>\r
                            <b>25</b> Domains</li>\r
                        </ul>\r
                      </div>\r
                      <div class="pricingTable-signup">\r
                        <a href="#">sign up</a>\r
                      </div>\r
                    </div>\r
                  </div>\r
                  <div class="col-md-3 col-sm-6">\r
                    <div class="pricingTable redColor">\r
                      <div class="pricingTable-header">\r
                        <i class="material-icons">filter_vintage</i>\r
                        <div class="price-value"> $40.00\r
                          <span class="month">per month</span>\r
                        </div>\r
                      </div>\r
                      <h3 class="heading">EXTRA</h3>\r
                      <div class="pricing-content">\r
                        <ul>\r
                          <li>\r
                            <b>80GB</b> Disk Space</li>\r
                          <li>\r
                            <b>80</b> Email Accounts</li>\r
                          <li>\r
                            <b>80GB</b> Monthly Bandwidth</li>\r
                          <li>\r
                            <b>20</b> subdomains</li>\r
                          <li>\r
                            <b>35</b> Domains</li>\r
                        </ul>\r
                      </div>\r
                      <div class="pricingTable-signup">\r
                        <a href="#">sign up</a>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PricingComponent, { className: "PricingComponent", filePath: "src/app/extra-pages/pricing/pricing.component.ts", lineNumber: 9 });
})();

// src/app/extra-pages/invoice/invoice.component.ts
var _c03 = () => ["Home", "Extra"];
var InvoiceComponent = class _InvoiceComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function InvoiceComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _InvoiceComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InvoiceComponent, selectors: [["app-invoice"]], decls: 131, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "body"], [1, "row"], [1, "col-md-12"], [1, "white-box"], [1, "float-end"], [1, "float-start"], [1, "font-bold"], [1, "text-muted"], [1, "float-end", "text-end"], [1, "addr-font-h3", "font-bold"], [1, "font-bold", "addr-font-h4"], [1, "text-muted", "m-l-30"], [1, "m-t-30"], [1, "fa", "fa-calendar"], [1, "label", "label-success"], [1, "table-responsive", "m-t-40"], [1, "table", "table-hover"], [1, "text-center"], [1, "text-end"], [1, "table-img", "text-center"], ["src", "assets/images/products/p-13.jpg", "alt", ""], ["src", "assets/images/products/p-14.jpg", "alt", ""], ["src", "assets/images/products/p-15.jpg", "alt", ""], [1, "float-end", "m-t-30", "text-end"], [1, "clearfix"], ["mat-flat-button", "", "color", "primary"], [1, "fas", "fa-print", "msr-2"]], template: function InvoiceComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "div", 10)(11, "h6")(12, "b");
        \u0275\u0275text(13, "INVOICE");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "span", 11);
        \u0275\u0275text(15, "#345766");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(16, "hr");
        \u0275\u0275elementStart(17, "div", 8)(18, "div", 9)(19, "div", 12)(20, "address")(21, "p", 13);
        \u0275\u0275text(22, "BILL FROM :");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "p", 14);
        \u0275\u0275text(24, " Aditya University, ");
        \u0275\u0275element(25, "br");
        \u0275\u0275text(26, " Opp. Town Hall, ");
        \u0275\u0275element(27, "br");
        \u0275\u0275text(28, " Sardar Patel Road, ");
        \u0275\u0275element(29, "br");
        \u0275\u0275text(30, " Ahmedabad - 380015 ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(31, "div", 15)(32, "address")(33, "p", 16);
        \u0275\u0275text(34, "BILL TO :");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "p", 17);
        \u0275\u0275text(36, "Jayesh Patel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "p", 18);
        \u0275\u0275text(38, " 207, Prem Sagar Appt., ");
        \u0275\u0275element(39, "br");
        \u0275\u0275text(40, " Near Income Tax Office, ");
        \u0275\u0275element(41, "br");
        \u0275\u0275text(42, " Ashram Road, ");
        \u0275\u0275element(43, "br");
        \u0275\u0275text(44, " Ahmedabad - 380057 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "p", 19)(46, "b");
        \u0275\u0275text(47, "Invoice Date :");
        \u0275\u0275elementEnd();
        \u0275\u0275element(48, "i", 20);
        \u0275\u0275text(49, " 14th July 2017 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "p")(51, "b");
        \u0275\u0275text(52, "Status :");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(53, "span", 21);
        \u0275\u0275text(54, "Success");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(55, "div", 9)(56, "div", 22)(57, "table", 23)(58, "thead")(59, "tr")(60, "th", 24);
        \u0275\u0275text(61, "#");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(62, "th", 24);
        \u0275\u0275text(63, "image");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(64, "th", 24);
        \u0275\u0275text(65, "Description");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "th", 24);
        \u0275\u0275text(67, "Quantity");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(68, "th", 24);
        \u0275\u0275text(69, "Unit Cost");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "th", 25);
        \u0275\u0275text(71, "Total");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(72, "tbody")(73, "tr")(74, "td", 24);
        \u0275\u0275text(75, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(76, "td", 26);
        \u0275\u0275element(77, "img", 27);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(78, "td", 24);
        \u0275\u0275text(79, "Lorem ipsum dolor sit amet");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "td", 24);
        \u0275\u0275text(81, "1");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(82, "td", 24);
        \u0275\u0275text(83, "$100");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(84, "td", 25);
        \u0275\u0275text(85, "$100");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(86, "tr")(87, "td", 24);
        \u0275\u0275text(88, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(89, "td", 26);
        \u0275\u0275element(90, "img", 28);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(91, "td", 24);
        \u0275\u0275text(92, "Consectetur adipisicing elit");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(93, "td", 24);
        \u0275\u0275text(94, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(95, "td", 24);
        \u0275\u0275text(96, "$50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(97, "td", 25);
        \u0275\u0275text(98, "$150");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(99, "tr")(100, "td", 24);
        \u0275\u0275text(101, "3");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(102, "td", 26);
        \u0275\u0275element(103, "img", 29);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(104, "td", 24);
        \u0275\u0275text(105, "Dolorum provident rerum ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(106, "td", 24);
        \u0275\u0275text(107, "2");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(108, "td", 24);
        \u0275\u0275text(109, "$25");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(110, "td", 25);
        \u0275\u0275text(111, "$50");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(112, "div", 9)(113, "div", 30)(114, "p");
        \u0275\u0275text(115, "Sub - Total amount: $300");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(116, "p");
        \u0275\u0275text(117, "Discount : $10 ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(118, "p");
        \u0275\u0275text(119, "Tax (10%) : $14 ");
        \u0275\u0275elementEnd();
        \u0275\u0275element(120, "hr");
        \u0275\u0275elementStart(121, "h6")(122, "b");
        \u0275\u0275text(123, "Total :");
        \u0275\u0275elementEnd();
        \u0275\u0275text(124, " $304 ");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(125, "div", 31)(126, "hr");
        \u0275\u0275elementStart(127, "div", 25)(128, "button", 32);
        \u0275\u0275element(129, "i", 33);
        \u0275\u0275text(130, "Print");
        \u0275\u0275elementEnd()()()()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Invoice")("items", \u0275\u0275pureFunction0(3, _c03))("active_item", "Invoice");
      }
    }, dependencies: [BreadcrumbComponent, MatButtonModule, MatButton], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InvoiceComponent, [{
    type: Component,
    args: [{ selector: "app-invoice", imports: [BreadcrumbComponent, MatButtonModule], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Invoice'" [items]="['Home','Extra']" [active_item]="'Invoice'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-md-12">\r
                <div class="white-box">\r
                  <h6>\r
                    <b>INVOICE</b>\r
                    <span class="float-end">#345766</span>\r
                  </h6>\r
                  <hr>\r
                  <div class="row">\r
                    <div class="col-md-12">\r
                      <div class="float-start">\r
                        <address>\r
                          <p class="font-bold">BILL FROM :</p>\r
                          <p class="text-muted">\r
                            Aditya University,\r
                            <br> Opp. Town Hall,\r
                            <br> Sardar Patel Road,\r
                            <br> Ahmedabad - 380015\r
                          </p>\r
                        </address>\r
                      </div>\r
                      <div class="float-end text-end">\r
                        <address>\r
                          <p class="addr-font-h3 font-bold">BILL TO :</p>\r
                          <p class="font-bold addr-font-h4">Jayesh Patel</p>\r
                          <p class="text-muted m-l-30">\r
                            207, Prem Sagar Appt.,\r
                            <br> Near Income Tax Office,\r
                            <br> Ashram Road,\r
                            <br> Ahmedabad - 380057\r
                          </p>\r
                          <p class="m-t-30">\r
                            <b>Invoice Date :</b>\r
                            <i class="fa fa-calendar"></i> 14th July 2017\r
                          </p>\r
                          <p>\r
                            <b>Status :</b>\r
                            <span class="label label-success">Success</span>\r
                          </p>\r
                        </address>\r
                      </div>\r
                    </div>\r
                    <div class="col-md-12">\r
                      <div class="table-responsive m-t-40">\r
                        <table class="table table-hover">\r
                          <thead>\r
                            <tr>\r
                              <th class="text-center">#</th>\r
                              <th class="text-center">image</th>\r
                              <th class="text-center">Description</th>\r
                              <th class="text-center">Quantity</th>\r
                              <th class="text-center">Unit Cost</th>\r
                              <th class="text-end">Total</th>\r
                            </tr>\r
                          </thead>\r
                          <tbody>\r
                            <tr>\r
                              <td class="text-center">1</td>\r
                              <td class="table-img text-center">\r
                                <img src="assets/images/products/p-13.jpg" alt="">\r
                              </td>\r
                              <td class="text-center">Lorem ipsum dolor sit amet</td>\r
                              <td class="text-center">1</td>\r
                              <td class="text-center">$100</td>\r
                              <td class="text-end">$100</td>\r
                            </tr>\r
                            <tr>\r
                              <td class="text-center">2</td>\r
                              <td class="table-img text-center">\r
                                <img src="assets/images/products/p-14.jpg" alt="">\r
                              </td>\r
                              <td class="text-center">Consectetur adipisicing elit</td>\r
                              <td class="text-center">3</td>\r
                              <td class="text-center">$50</td>\r
                              <td class="text-end">$150</td>\r
                            </tr>\r
                            <tr>\r
                              <td class="text-center">3</td>\r
                              <td class="table-img text-center">\r
                                <img src="assets/images/products/p-15.jpg" alt="">\r
                              </td>\r
                              <td class="text-center">Dolorum provident rerum </td>\r
                              <td class="text-center">2</td>\r
                              <td class="text-center">$25</td>\r
                              <td class="text-end">$50</td>\r
                            </tr>\r
                          </tbody>\r
                        </table>\r
                      </div>\r
                    </div>\r
                    <div class="col-md-12">\r
                      <div class="float-end m-t-30 text-end">\r
                        <p>Sub - Total amount: $300</p>\r
                        <p>Discount : $10 </p>\r
                        <p>Tax (10%) : $14 </p>\r
                        <hr>\r
                        <h6>\r
                          <b>Total :</b> $304\r
                        </h6>\r
                      </div>\r
                      <div class="clearfix"></div>\r
                      <hr>\r
                      <div class="text-end">\r
                        <button mat-flat-button color="primary"><i class="fas fa-print msr-2"></i>Print</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InvoiceComponent, { className: "InvoiceComponent", filePath: "src/app/extra-pages/invoice/invoice.component.ts", lineNumber: 10 });
})();

// src/app/extra-pages/faqs/faqs.component.ts
var _c04 = () => ["Home", "Extra"];
var FaqsComponent = class _FaqsComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function FaqsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FaqsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FaqsComponent, selectors: [["app-faqs"]], decls: 122, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "header"], [1, "body"], [1, "col-xs-12", "ol-sm-12", "col-md-12", "col-lg-12"], [1, "row"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], [1, "panel-body"], [1, "mt-2"], ["mat-icon-button", "", "aria-label", "Example icon-button with a heart icon", 1, "btn", "btn-circle", "bg-green", "msr-2"], ["mat-icon-button", "", "aria-label", "Example icon-button with a heart icon", 1, "btn", "btn-circle", "bg-red"]], template: function FaqsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "FAQs");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "small");
        \u0275\u0275text(12, "Find your solutions from here.");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 8)(14, "div", 4)(15, "div", 9)(16, "mat-accordion")(17, "mat-expansion-panel")(18, "mat-expansion-panel-header")(19, "mat-panel-title");
        \u0275\u0275text(20, " Q1. Anim pariatur cliche reprehenderit? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(21, "div", 10)(22, "div", 11)(23, "div", 12);
        \u0275\u0275text(24, " Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single origin coffee nulla assumenda shoreditchet. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "div", 13)(26, "button", 14)(27, "mat-icon");
        \u0275\u0275text(28, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "button", 15)(30, "mat-icon");
        \u0275\u0275text(31, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(32, "mat-expansion-panel")(33, "mat-expansion-panel-header")(34, "mat-panel-title");
        \u0275\u0275text(35, " Q2. It has survived not only five centuries, but also the leap into? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(36, "div", 10)(37, "div", 11)(38, "div", 12);
        \u0275\u0275text(39, " Completed my graduation in Arts from the well known and renowned institution of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA in 2000-01, which was affiliated to M.S. University. I ranker in University exams from the same university from 1996-01. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "div", 13)(41, "button", 14)(42, "mat-icon");
        \u0275\u0275text(43, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(44, "button", 15)(45, "mat-icon");
        \u0275\u0275text(46, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(47, "mat-expansion-panel")(48, "mat-expansion-panel-header")(49, "mat-panel-title");
        \u0275\u0275text(50, " Q3. Worked as Professor and Head of the department at Sarda Collage? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(51, "div", 10)(52, "div", 11)(53, "div", 12);
        \u0275\u0275text(54, " Completed my graduation in Arts from the well known and renowned institution of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA in 2000-01, which was affiliated to M.S. University. I ranker in University exams from the same university from 1996-01. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "div", 13)(56, "button", 14)(57, "mat-icon");
        \u0275\u0275text(58, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(59, "button", 15)(60, "mat-icon");
        \u0275\u0275text(61, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(62, "mat-expansion-panel")(63, "mat-expansion-panel-header")(64, "mat-panel-title");
        \u0275\u0275text(65, " Q4. It has survived not only five centuries, but also the leap into? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(66, "div", 10)(67, "div", 11)(68, "div", 12);
        \u0275\u0275text(69, " Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single origin coffee nulla assumenda shoreditchet. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "div", 13)(71, "button", 14)(72, "mat-icon");
        \u0275\u0275text(73, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(74, "button", 15)(75, "mat-icon");
        \u0275\u0275text(76, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(77, "mat-expansion-panel")(78, "mat-expansion-panel-header")(79, "mat-panel-title");
        \u0275\u0275text(80, " Q5. Worked as Professor and Head of the department? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(81, "div", 10)(82, "div", 11)(83, "div", 12);
        \u0275\u0275text(84, " Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single origin coffee nulla assumenda shoreditchet. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(85, "div", 13)(86, "button", 14)(87, "mat-icon");
        \u0275\u0275text(88, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(89, "button", 15)(90, "mat-icon");
        \u0275\u0275text(91, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(92, "mat-expansion-panel")(93, "mat-expansion-panel-header")(94, "mat-panel-title");
        \u0275\u0275text(95, " Q6. It has survived not only five centuries, but also the leap into? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(96, "div", 10)(97, "div", 11)(98, "div", 12);
        \u0275\u0275text(99, " Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single origin coffee nulla assumenda shoreditchet. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(100, "div", 13)(101, "button", 14)(102, "mat-icon");
        \u0275\u0275text(103, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(104, "button", 15)(105, "mat-icon");
        \u0275\u0275text(106, "thumb_down");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(107, "mat-expansion-panel")(108, "mat-expansion-panel-header")(109, "mat-panel-title");
        \u0275\u0275text(110, " Q7. Completed my graduation in Arts from the well known? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(111, "div", 10)(112, "div", 11)(113, "div", 12);
        \u0275\u0275text(114, " Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single origin coffee nulla assumenda shoreditchet. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(115, "div", 13)(116, "button", 14)(117, "mat-icon");
        \u0275\u0275text(118, "thumb_up");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(119, "button", 15)(120, "mat-icon");
        \u0275\u0275text(121, "thumb_down");
        \u0275\u0275elementEnd()()()()()()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Faqs")("items", \u0275\u0275pureFunction0(3, _c04))("active_item", "Faqs");
      }
    }, dependencies: [
      BreadcrumbComponent,
      MatExpansionModule,
      MatAccordion,
      MatExpansionPanel,
      MatExpansionPanelHeader,
      MatExpansionPanelTitle,
      MatButtonModule,
      MatIconButton,
      MatIconModule,
      MatIcon
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FaqsComponent, [{
    type: Component,
    args: [{ selector: "app-faqs", imports: [
      BreadcrumbComponent,
      MatExpansionModule,
      MatButtonModule,
      MatIconModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Faqs'" [items]="['Home','Extra']" [active_item]="'Faqs'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <!-- Basic Examples -->\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>FAQs</strong>\r
              <small>Find your solutions from here.</small>\r
            </h2>\r
          </div>\r
          <div class="body">\r
            <div class="row clearfix">\r
              <div class="col-xs-12 ol-sm-12 col-md-12 col-lg-12">\r
                <mat-accordion>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q1. Anim pariatur cliche reprehenderit?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Anim pariatur cliche reprehenderit, enim eiusmod high life\r
                          accusamus terry richardson ad squid. 3 wolf moon officia aute,\r
                          non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt\r
                          laborum\r
                          eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it\r
                          squid\r
                          single origin coffee nulla assumenda shoreditchet. Nihil anim\r
                          keffiyeh\r
                          helvetica, craft beer labore wes anderson cred nesciunt sapiente ea\r
                          proident.\r
                          Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh\r
                          helvetica,\r
                          craft beer labore wes anderson cred nesciunt sapiente.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q2. It has survived not only five centuries, but also the leap\r
                        into?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Completed my graduation in Arts from the well known and renowned\r
                          institution of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA\r
                          in 2000-01, which was affiliated to M.S. University. I ranker in\r
                          University\r
                          exams from the same university from 1996-01.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q3. Worked as Professor and Head of the department at Sarda\r
                        Collage?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Completed my graduation in Arts from the well known and renowned\r
                          institution of India \u2013 SARDAR PATEL ARTS COLLEGE, BARODA\r
                          in 2000-01, which was affiliated to M.S. University. I ranker in\r
                          University\r
                          exams from the same university from 1996-01.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q4. It has survived not only five centuries, but also the leap\r
                        into?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Anim pariatur cliche reprehenderit, enim eiusmod high life\r
                          accusamus terry richardson ad squid. 3 wolf moon officia aute,\r
                          non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt\r
                          laborum\r
                          eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it\r
                          squid\r
                          single origin coffee nulla assumenda shoreditchet. Nihil anim\r
                          keffiyeh\r
                          helvetica, craft beer labore wes anderson cred nesciunt sapiente ea\r
                          proident.\r
                          Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh\r
                          helvetica,\r
                          craft beer labore wes anderson cred nesciunt sapiente.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q5. Worked as Professor and Head of the department?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Anim pariatur cliche reprehenderit, enim eiusmod high life\r
                          accusamus terry richardson ad squid. 3 wolf moon officia aute,\r
                          non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt\r
                          laborum\r
                          eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it\r
                          squid\r
                          single origin coffee nulla assumenda shoreditchet. Nihil anim\r
                          keffiyeh\r
                          helvetica, craft beer labore wes anderson cred nesciunt sapiente ea\r
                          proident.\r
                          Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh\r
                          helvetica,\r
                          craft beer labore wes anderson cred nesciunt sapiente.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q6. It has survived not only five centuries, but also the leap\r
                        into?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Anim pariatur cliche reprehenderit, enim eiusmod high life\r
                          accusamus terry richardson ad squid. 3 wolf moon officia aute,\r
                          non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt\r
                          laborum\r
                          eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it\r
                          squid\r
                          single origin coffee nulla assumenda shoreditchet. Nihil anim\r
                          keffiyeh\r
                          helvetica, craft beer labore wes anderson cred nesciunt sapiente ea\r
                          proident.\r
                          Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh\r
                          helvetica,\r
                          craft beer labore wes anderson cred nesciunt sapiente.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                  <mat-expansion-panel>\r
                    <mat-expansion-panel-header>\r
                      <mat-panel-title>\r
                        Q7. Completed my graduation in Arts from the well known?\r
                      </mat-panel-title>\r
                    </mat-expansion-panel-header>\r
                    <div class="row">\r
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
                        <div class="panel-body">\r
                          Anim pariatur cliche reprehenderit, enim eiusmod high life\r
                          accusamus terry richardson ad squid. 3 wolf moon officia aute,\r
                          non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt\r
                          laborum\r
                          eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it\r
                          squid\r
                          single origin coffee nulla assumenda shoreditchet. Nihil anim\r
                          keffiyeh\r
                          helvetica, craft beer labore wes anderson cred nesciunt sapiente ea\r
                          proident.\r
                          Ad vegan excepteur butcher vice lomo. Nihil anim keffiyeh\r
                          helvetica,\r
                          craft beer labore wes anderson cred nesciunt sapiente.\r
                        </div>\r
                        <div class="mt-2">\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-green msr-2">\r
                            <mat-icon>thumb_up</mat-icon>\r
                          </button>\r
                          <button mat-icon-button aria-label="Example icon-button with a heart icon"\r
                            class="btn btn-circle bg-red">\r
                            <mat-icon>thumb_down</mat-icon>\r
                          </button>\r
                        </div>\r
                      </div>\r
                    </div>\r
                  </mat-expansion-panel>\r
                </mat-accordion>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
      <!-- #END# Basic Examples -->\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FaqsComponent, { className: "FaqsComponent", filePath: "src/app/extra-pages/faqs/faqs.component.ts", lineNumber: 17 });
})();

// src/app/extra-pages/blank/blank.component.ts
var _c05 = () => ["Home", "Extra"];
var BlankComponent = class _BlankComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function BlankComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _BlankComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BlankComponent, selectors: [["app-blank"]], decls: 13, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"]], template: function BlankComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "Blank");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Page");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(12, "div", 8);
        \u0275\u0275elementEnd()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Blank")("items", \u0275\u0275pureFunction0(3, _c05))("active_item", "Blank");
      }
    }, dependencies: [BreadcrumbComponent], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BlankComponent, [{
    type: Component,
    args: [{ selector: "app-blank", imports: [BreadcrumbComponent], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Blank'" [items]="['Home','Extra']" [active_item]="'Blank'">\r
      </app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2><strong>Blank</strong> Page</h2>\r
          </div>\r
          <div class="body">\r
            <!-- add content here -->\r
          </div>\r
        </div> \r
      </div>\r
    </div>\r
  </div>\r
</section>` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BlankComponent, { className: "BlankComponent", filePath: "src/app/extra-pages/blank/blank.component.ts", lineNumber: 9 });
})();

// src/app/extra-pages/extra-pages.routes.ts
var EXTRA_PAGES_ROUTE = [
  {
    path: "profile",
    component: ProfileComponent
  },
  {
    path: "pricing",
    component: PricingComponent
  },
  {
    path: "invoice",
    component: InvoiceComponent
  },
  {
    path: "faqs",
    component: FaqsComponent
  },
  {
    path: "blank",
    component: BlankComponent
  }
];
export {
  EXTRA_PAGES_ROUTE
};
//# sourceMappingURL=extra-pages.routes-O7NSSHEX.js.map
