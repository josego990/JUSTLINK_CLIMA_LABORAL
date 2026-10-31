import {
  NgScrollbar
} from "./chunk-PGPD7O76.js";
import {
  MatPaginator,
  MatPaginatorModule
} from "./chunk-3O3RAW4I.js";
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from "./chunk-MP4NAT2N.js";
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
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-SKPM4PVR.js";
import "./chunk-QV4DNMNF.js";
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
import "./chunk-4AQ2Q7XZ.js";
import "./chunk-T2IHQNFZ.js";
import "./chunk-V7JA7XTT.js";
import {
  MatFormField,
  MatFormFieldModule
} from "./chunk-DKBY3V4W.js";
import {
  FormsModule,
  NgControlStatus,
  NgModel,
  UntypedFormControl
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
  MatMiniFabButton
} from "./chunk-6OUKOU55.js";
import {
  FeatherIconsComponent
} from "./chunk-Y73QBUAC.js";
import "./chunk-WZAKLMWR.js";
import {
  Component,
  ViewChild,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵproperty,
  ɵɵpureFunction0,
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
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/apps/chat/chat.component.ts
var _c0 = () => ["Home"];
var ChatComponent = class _ChatComponent {
  constructor() {
    this.hideRequiredControl = new UntypedFormControl(false);
  }
  static {
    this.\u0275fac = function ChatComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ChatComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatComponent, selectors: [["app-chat"]], decls: 186, vars: 5, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row"], [1, "col-xs-12", "col-sm-12", "col-md-3", "col-lg-3"], [1, "card"], [1, "body"], ["id", "plist", 1, "people-list"], [1, "form-line", "m-b-15"], ["type", "text", "placeholder", "Search...", 1, "form-control"], [1, "tab-content"], ["visibility", "hover", 2, "height", "590px"], ["id", "chat_user"], [1, "chat-list", "list-unstyled", "m-b-0"], [1, "clearfix", "active"], ["src", "assets/images/user/user1.jpg", "alt", "avatar"], [1, "about"], [1, "name"], [1, "status"], [1, "material-icons", "offline"], [1, "clearfix"], ["src", "assets/images/user/user2.jpg", "alt", "avatar"], ["src", "assets/images/user/user3.jpg", "alt", "avatar"], [1, "material-icons", "online"], ["src", "assets/images/user/user4.jpg", "alt", "avatar"], ["src", "assets/images/user/user5.jpg", "alt", "avatar"], ["src", "assets/images/user/user6.jpg", "alt", "avatar"], ["src", "assets/images/user/user7.jpg", "alt", "avatar"], ["src", "assets/images/user/user8.jpg", "alt", "avatar"], ["src", "assets/images/user/user9.jpg", "alt", "avatar"], [1, "col-xs-12", "col-sm-12", "col-md-9", "col-lg-9"], [1, "chat"], [1, "chat-header", "clearfix"], [1, "chat-about"], [1, "chat-with"], [1, "chat-num-messages"], ["visibility", "hover", 2, "height", "449px"], ["id", "chat-conversation", 1, "chat-history"], [1, "message-data", "text-end"], [1, "message-data-time"], [1, "message-data-name"], [1, "message", "other-message", "float-end"], [1, "message-data"], [1, "message", "my-message"], [1, "chat-message", "clearfix"], [1, "form-group"], [1, "form-line"], ["appearance", "outline", 1, "example-full-width", 3, "hideRequiredMarker"], ["matInput", "", "placeholder", "Enter text here..", "required", ""], [1, "chat-upload"], ["mat-mini-fab", "", 1, "bg-deep-orange", "msr-2"], [1, "material-icons"], ["mat-mini-fab", "", 1, "bg-deep-orange"]], template: function ChatComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9);
        \u0275\u0275element(10, "input", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "div", 11)(12, "ng-scrollbar", 12)(13, "div", 13)(14, "ul", 14)(15, "li", 15);
        \u0275\u0275element(16, "img", 16);
        \u0275\u0275elementStart(17, "div", 17)(18, "div", 18);
        \u0275\u0275text(19, "William Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 19)(21, "i", 20);
        \u0275\u0275text(22, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(23, " left 7 mins ago ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(24, "li", 21);
        \u0275\u0275element(25, "img", 22);
        \u0275\u0275elementStart(26, "div", 17)(27, "div", 18);
        \u0275\u0275text(28, "Martha Williams");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "div", 19)(30, "i", 20);
        \u0275\u0275text(31, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(32, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "li", 21);
        \u0275\u0275element(34, "img", 23);
        \u0275\u0275elementStart(35, "div", 17)(36, "div", 18);
        \u0275\u0275text(37, "Joseph Clark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "div", 19)(39, "i", 24);
        \u0275\u0275text(40, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(41, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(42, "li", 21);
        \u0275\u0275element(43, "img", 25);
        \u0275\u0275elementStart(44, "div", 17)(45, "div", 18);
        \u0275\u0275text(46, "Nancy Taylor");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "div", 19)(48, "i", 24);
        \u0275\u0275text(49, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(50, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(51, "li", 21);
        \u0275\u0275element(52, "img", 26);
        \u0275\u0275elementStart(53, "div", 17)(54, "div", 18);
        \u0275\u0275text(55, "Margaret Wilson");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(56, "div", 19)(57, "i", 24);
        \u0275\u0275text(58, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(59, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(60, "li", 21);
        \u0275\u0275element(61, "img", 27);
        \u0275\u0275elementStart(62, "div", 17)(63, "div", 18);
        \u0275\u0275text(64, "Joseph Jones");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(65, "div", 19)(66, "i", 20);
        \u0275\u0275text(67, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(68, " left 30 mins ago ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(69, "li", 21);
        \u0275\u0275element(70, "img", 28);
        \u0275\u0275elementStart(71, "div", 17)(72, "div", 18);
        \u0275\u0275text(73, "Jane Brown");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(74, "div", 19)(75, "i", 20);
        \u0275\u0275text(76, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(77, " left 10 hours ago ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(78, "li", 21);
        \u0275\u0275element(79, "img", 29);
        \u0275\u0275elementStart(80, "div", 17)(81, "div", 18);
        \u0275\u0275text(82, "Eliza Johnson");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "div", 19)(84, "i", 24);
        \u0275\u0275text(85, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(86, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(87, "li", 21);
        \u0275\u0275element(88, "img", 23);
        \u0275\u0275elementStart(89, "div", 17)(90, "div", 18);
        \u0275\u0275text(91, "Mike Clark");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(92, "div", 19)(93, "i", 24);
        \u0275\u0275text(94, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(95, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(96, "li", 21);
        \u0275\u0275element(97, "img", 25);
        \u0275\u0275elementStart(98, "div", 17)(99, "div", 18);
        \u0275\u0275text(100, "Ann Henry");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(101, "div", 19)(102, "i", 24);
        \u0275\u0275text(103, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(104, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(105, "li", 21);
        \u0275\u0275element(106, "img", 26);
        \u0275\u0275elementStart(107, "div", 17)(108, "div", 18);
        \u0275\u0275text(109, "Nancy Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(110, "div", 19)(111, "i", 24);
        \u0275\u0275text(112, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(113, " online ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(114, "li", 21);
        \u0275\u0275element(115, "img", 30);
        \u0275\u0275elementStart(116, "div", 17)(117, "div", 18);
        \u0275\u0275text(118, "David Wilson");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(119, "div", 19)(120, "i", 20);
        \u0275\u0275text(121, "fiber_manual_record");
        \u0275\u0275elementEnd();
        \u0275\u0275text(122, " offline since Oct 28 ");
        \u0275\u0275elementEnd()()()()()()()()()()();
        \u0275\u0275elementStart(123, "div", 31)(124, "div", 6)(125, "div", 32)(126, "div", 33);
        \u0275\u0275element(127, "img", 22);
        \u0275\u0275elementStart(128, "div", 34)(129, "div", 35);
        \u0275\u0275text(130, "Maria Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(131, "div", 36);
        \u0275\u0275text(132, "2 new messages");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(133, "ng-scrollbar", 37)(134, "div", 38)(135, "ul")(136, "li", 21)(137, "div", 39)(138, "span", 40);
        \u0275\u0275text(139, "10:10 AM, Today ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(140, " \xA0 \xA0 ");
        \u0275\u0275elementStart(141, "span", 41);
        \u0275\u0275text(142, "Maria");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(143, "div", 42);
        \u0275\u0275text(144, " Hi Robert , how are you? How is your work going on? ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(145, "li")(146, "div", 43)(147, "span", 41);
        \u0275\u0275text(148, "Robert ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(149, "span", 40);
        \u0275\u0275text(150, "10:12 AM, Today");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(151, "div", 44)(152, "p");
        \u0275\u0275text(153, "Its good. We completed almost all task assign by our manager.");
        \u0275\u0275elementEnd();
        \u0275\u0275element(154, "div", 4);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(155, "li")(156, "div", 43)(157, "span", 41);
        \u0275\u0275text(158, "Robert ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(159, "span", 40);
        \u0275\u0275text(160, "10:12 AM, Today");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(161, "div", 44)(162, "p");
        \u0275\u0275text(163, "How are you feel today? What's about vacation?.");
        \u0275\u0275elementEnd();
        \u0275\u0275element(164, "div", 4);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(165, "li", 21)(166, "div", 39)(167, "span", 40);
        \u0275\u0275text(168, "10:10 AM, Today ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(169, " \xA0 \xA0 ");
        \u0275\u0275elementStart(170, "span", 41);
        \u0275\u0275text(171, "Maria");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(172, "div", 42);
        \u0275\u0275text(173, " I am good, We think for next weekend. ");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(174, "div", 45)(175, "div", 46)(176, "div", 47)(177, "mat-form-field", 48);
        \u0275\u0275element(178, "input", 49);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(179, "div", 50)(180, "button", 51)(181, "i", 52);
        \u0275\u0275text(182, "attach_file");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(183, "button", 53)(184, "i", 52);
        \u0275\u0275text(185, "insert_emoticon");
        \u0275\u0275elementEnd()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Chat")("items", \u0275\u0275pureFunction0(4, _c0))("active_item", "Chat");
        \u0275\u0275advance(174);
        \u0275\u0275property("hideRequiredMarker", ctx.hideRequiredControl.value);
      }
    }, dependencies: [
      BreadcrumbComponent,
      NgScrollbar,
      MatFormFieldModule,
      MatFormField,
      MatInputModule,
      MatInput,
      MatButtonModule,
      MatMiniFabButton
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatComponent, [{
    type: Component,
    args: [{ selector: "app-chat", imports: [
      BreadcrumbComponent,
      NgScrollbar,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Chat'" [items]="['Home']" [active_item]="'Chat'"></app-breadcrumb>\r
    </div>\r
    <div class="row">\r
      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">\r
        <div class="card">\r
          <div class="body">\r
            <div id="plist" class="people-list">\r
              <div class="form-line m-b-15">\r
                <input type="text" class="form-control" placeholder="Search..." />\r
              </div>\r
              <div class="tab-content">\r
                <ng-scrollbar style="height: 590px" visibility="hover">\r
                  <div id="chat_user">\r
                    <ul class="chat-list list-unstyled m-b-0">\r
                      <li class="clearfix active">\r
                        <img src="assets/images/user/user1.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">William Smith</div>\r
                          <div class="status">\r
                            <i class="material-icons offline">fiber_manual_record</i>\r
                            left 7 mins ago </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix ">\r
                        <img src="assets/images/user/user2.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Martha Williams</div>\r
                          <div class="status">\r
                            <i class="material-icons offline">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user3.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Joseph Clark</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user4.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Nancy Taylor</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user5.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Margaret Wilson</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user6.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Joseph Jones</div>\r
                          <div class="status">\r
                            <i class="material-icons offline">fiber_manual_record</i>\r
                            left 30 mins ago </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user7.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Jane Brown</div>\r
                          <div class="status">\r
                            <i class="material-icons offline">fiber_manual_record</i>\r
                            left 10 hours ago </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user8.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Eliza Johnson</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user3.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Mike Clark</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user4.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Ann Henry</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user5.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">Nancy Smith</div>\r
                          <div class="status">\r
                            <i class="material-icons online">fiber_manual_record</i>\r
                            online </div>\r
                        </div>\r
                      </li>\r
                      <li class="clearfix">\r
                        <img src="assets/images/user/user9.jpg" alt="avatar">\r
                        <div class="about">\r
                          <div class="name">David Wilson</div>\r
                          <div class="status">\r
                            <i class="material-icons offline">fiber_manual_record</i>\r
                            offline since Oct 28 </div>\r
                        </div>\r
                      </li>\r
                    </ul>\r
                  </div>\r
                </ng-scrollbar>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
      <div class="col-xs-12 col-sm-12 col-md-9 col-lg-9">\r
        <div class="card">\r
          <div class="chat">\r
            <div class="chat-header clearfix">\r
              <img src="assets/images/user/user2.jpg" alt="avatar">\r
              <div class="chat-about">\r
                <div class="chat-with">Maria Smith</div>\r
                <div class="chat-num-messages">2 new messages</div>\r
              </div>\r
            </div>\r
            <ng-scrollbar style="height: 449px" visibility="hover">\r
              <div class="chat-history" id="chat-conversation">\r
                <ul>\r
                  <li class="clearfix">\r
                    <div class="message-data text-end">\r
                      <span class="message-data-time">10:10 AM, Today\r
                      </span>\r
                      &nbsp; &nbsp;\r
                      <span class="message-data-name">Maria</span>\r
                    </div>\r
                    <div class="message other-message float-end"> Hi Robert , how are you? How is\r
                      your work going on? </div>\r
                  </li>\r
                  <li>\r
                    <div class="message-data">\r
                      <span class="message-data-name">Robert </span>\r
                      <span class="message-data-time">10:12 AM, Today</span>\r
                    </div>\r
                    <div class="message my-message">\r
                      <p>Its good. We completed almost all task assign by our manager.</p>\r
                      <div class="row">\r
                      </div>\r
                    </div>\r
                  </li>\r
                  <li>\r
                    <div class="message-data">\r
                      <span class="message-data-name">Robert </span>\r
                      <span class="message-data-time">10:12 AM, Today</span>\r
                    </div>\r
                    <div class="message my-message">\r
                      <p>How are you feel today? What's about vacation?.</p>\r
                      <div class="row">\r
                      </div>\r
                    </div>\r
                  </li>\r
                  <li class="clearfix">\r
                    <div class="message-data text-end">\r
                      <span class="message-data-time">10:10 AM, Today\r
                      </span>\r
                      &nbsp; &nbsp;\r
                      <span class="message-data-name">Maria</span>\r
                    </div>\r
                    <div class="message other-message float-end"> I am good, We think for next\r
                      weekend.\r
                    </div>\r
                  </li>\r
                </ul>\r
              </div>\r
            </ng-scrollbar>\r
            <div class="chat-message clearfix">\r
              <div class="form-group">\r
                <div class="form-line">\r
                  <mat-form-field class="example-full-width" appearance="outline"\r
                    [hideRequiredMarker]="hideRequiredControl.value">\r
                    <input matInput placeholder="Enter text here.." required>\r
                  </mat-form-field>\r
                </div>\r
              </div>\r
              <div class="chat-upload">\r
                <button mat-mini-fab class="bg-deep-orange msr-2"> <i class="material-icons">attach_file</i></button>\r
                <button mat-mini-fab class="bg-deep-orange"> <i class="material-icons">insert_emoticon</i></button>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>\r
` }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatComponent, { className: "ChatComponent", filePath: "src/app/apps/chat/chat.component.ts", lineNumber: 20 });
})();

// src/app/apps/contact-grid/contact-grid.component.ts
var _c02 = () => ["Home"];
var ContactGridComponent = class _ContactGridComponent {
  constructor() {
  }
  static {
    this.\u0275fac = function ContactGridComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ContactGridComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactGridComponent, selectors: [["app-contact-grid"]], decls: 282, vars: 4, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "col-xs-12", "col-sm-6"], [1, "body"], [1, "row"], [1, "col-md-4"], [1, "card", "border-apply"], [1, "m-b-20"], [1, "contact-grid"], [1, "profile-header", "l-bg-purple-dark"], [1, "user-name"], [1, "name-center"], ["src", "assets/images/user/usrbig1.jpg", "alt", "", 1, "user-img"], [1, "phone"], [1, "material-icons"], [1, "profile-userbuttons"], ["mat-flat-button", "", "color", "primary"], [1, "profile-header", "bg-cyan"], ["src", "assets/images/user/usrbig2.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "bg-dark"], ["src", "assets/images/user/usrbig3.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "l-bg-orange"], ["src", "assets/images/user/usrbig4.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "bg-green"], ["src", "assets/images/user/usrbig5.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "l-bg-red"], ["src", "assets/images/user/usrbig6.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "bg-indigo"], ["src", "assets/images/user/usrbig7.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "bg-brown"], ["src", "assets/images/user/usrbig8.jpg", "alt", "", 1, "user-img"], [1, "profile-header", "bg-yellow"], ["src", "assets/images/user/usrbig9.jpg", "alt", "", 1, "user-img"]], template: function ContactGridComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "h2")(10, "strong");
        \u0275\u0275text(11, "Contact");
        \u0275\u0275elementEnd();
        \u0275\u0275text(12, " Grid");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 9)(14, "div", 10)(15, "div", 11)(16, "div", 12)(17, "div", 13)(18, "div", 14)(19, "div", 15)(20, "div", 16);
        \u0275\u0275text(21, "Pooja Patel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "div", 17);
        \u0275\u0275text(23, "General Manager");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(24, "img", 18);
        \u0275\u0275elementStart(25, "p");
        \u0275\u0275text(26, " A-103, shyam gokul flats, Mahatma Road ");
        \u0275\u0275element(27, "br");
        \u0275\u0275text(28, "Mumbai ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(29, "div")(30, "span", 19)(31, "i", 20);
        \u0275\u0275text(32, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(33, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(34, "div", 21)(35, "button", 22);
        \u0275\u0275text(36, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(37, "div", 11)(38, "div", 12)(39, "div", 13)(40, "div", 14)(41, "div", 23)(42, "div", 16);
        \u0275\u0275text(43, "Smita Patil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "div", 17);
        \u0275\u0275text(45, "Housekeeper");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(46, "img", 24);
        \u0275\u0275elementStart(47, "p");
        \u0275\u0275text(48, " 45, Krishna Tower, Near Bus Stop, Satellite, ");
        \u0275\u0275element(49, "br");
        \u0275\u0275text(50, "Ahmedabad ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(51, "div")(52, "span", 19)(53, "i", 20);
        \u0275\u0275text(54, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(55, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(56, "div", 21)(57, "button", 22);
        \u0275\u0275text(58, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(59, "div", 11)(60, "div", 12)(61, "div", 13)(62, "div", 14)(63, "div", 25)(64, "div", 16);
        \u0275\u0275text(65, "John Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(66, "div", 17);
        \u0275\u0275text(67, "Cook");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(68, "img", 26);
        \u0275\u0275elementStart(69, "p");
        \u0275\u0275text(70, " 456, Estern evenue, Courtage area, ");
        \u0275\u0275element(71, "br");
        \u0275\u0275text(72, "New York ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(73, "div")(74, "span", 19)(75, "i", 20);
        \u0275\u0275text(76, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(77, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(78, "div", 21)(79, "button", 22);
        \u0275\u0275text(80, "Read More");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(81, "div", 10)(82, "div", 11)(83, "div", 12)(84, "div", 13)(85, "div", 14)(86, "div", 27)(87, "div", 16);
        \u0275\u0275text(88, "Pooja Patel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(89, "div", 17);
        \u0275\u0275text(90, "General Manager");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(91, "img", 28);
        \u0275\u0275elementStart(92, "p");
        \u0275\u0275text(93, " A-103, shyam gokul flats, Mahatma Road ");
        \u0275\u0275element(94, "br");
        \u0275\u0275text(95, "Mumbai ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(96, "div")(97, "span", 19)(98, "i", 20);
        \u0275\u0275text(99, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(100, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(101, "div", 21)(102, "button", 22);
        \u0275\u0275text(103, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(104, "div", 11)(105, "div", 12)(106, "div", 13)(107, "div", 14)(108, "div", 29)(109, "div", 16);
        \u0275\u0275text(110, "Smita Patil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(111, "div", 17);
        \u0275\u0275text(112, "Housekeeper");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(113, "img", 30);
        \u0275\u0275elementStart(114, "p");
        \u0275\u0275text(115, " 45, Krishna Tower, Near Bus Stop, Satellite, ");
        \u0275\u0275element(116, "br");
        \u0275\u0275text(117, "Ahmedabad ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(118, "div")(119, "span", 19)(120, "i", 20);
        \u0275\u0275text(121, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(122, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(123, "div", 21)(124, "button", 22);
        \u0275\u0275text(125, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(126, "div", 11)(127, "div", 12)(128, "div", 13)(129, "div", 14)(130, "div", 31)(131, "div", 16);
        \u0275\u0275text(132, "John Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(133, "div", 17);
        \u0275\u0275text(134, "Cook");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(135, "img", 32);
        \u0275\u0275elementStart(136, "p");
        \u0275\u0275text(137, " 456, Estern evenue, Courtage area, ");
        \u0275\u0275element(138, "br");
        \u0275\u0275text(139, "New York ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(140, "div")(141, "span", 19)(142, "i", 20);
        \u0275\u0275text(143, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(144, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(145, "div", 21)(146, "button", 22);
        \u0275\u0275text(147, "Read More");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(148, "div", 10)(149, "div", 11)(150, "div", 12)(151, "div", 13)(152, "div", 14)(153, "div", 33)(154, "div", 16);
        \u0275\u0275text(155, "Pooja Patel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(156, "div", 17);
        \u0275\u0275text(157, "General Manager");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(158, "img", 34);
        \u0275\u0275elementStart(159, "p");
        \u0275\u0275text(160, " A-103, shyam gokul flats, Mahatma Road ");
        \u0275\u0275element(161, "br");
        \u0275\u0275text(162, "Mumbai ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(163, "div")(164, "span", 19)(165, "i", 20);
        \u0275\u0275text(166, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(167, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(168, "div", 21)(169, "button", 22);
        \u0275\u0275text(170, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(171, "div", 11)(172, "div", 12)(173, "div", 13)(174, "div", 14)(175, "div", 35)(176, "div", 16);
        \u0275\u0275text(177, "Smita Patil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(178, "div", 17);
        \u0275\u0275text(179, "Housekeeper");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(180, "img", 36);
        \u0275\u0275elementStart(181, "p");
        \u0275\u0275text(182, " 45, Krishna Tower, Near Bus Stop, Satellite, ");
        \u0275\u0275element(183, "br");
        \u0275\u0275text(184, "Ahmedabad ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(185, "div")(186, "span", 19)(187, "i", 20);
        \u0275\u0275text(188, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(189, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(190, "div", 21)(191, "button", 22);
        \u0275\u0275text(192, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(193, "div", 11)(194, "div", 12)(195, "div", 13)(196, "div", 14)(197, "div", 37)(198, "div", 16);
        \u0275\u0275text(199, "John Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(200, "div", 17);
        \u0275\u0275text(201, "Cook");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(202, "img", 38);
        \u0275\u0275elementStart(203, "p");
        \u0275\u0275text(204, " 456, Estern evenue, Courtage area, ");
        \u0275\u0275element(205, "br");
        \u0275\u0275text(206, "New York ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(207, "div")(208, "span", 19)(209, "i", 20);
        \u0275\u0275text(210, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(211, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(212, "div", 21)(213, "button", 22);
        \u0275\u0275text(214, "Read More");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(215, "div", 10)(216, "div", 11)(217, "div", 12)(218, "div", 13)(219, "div", 14)(220, "div", 15)(221, "div", 16);
        \u0275\u0275text(222, "Pooja Patel");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(223, "div", 17);
        \u0275\u0275text(224, "General Manager");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(225, "img", 18);
        \u0275\u0275elementStart(226, "p");
        \u0275\u0275text(227, " A-103, shyam gokul flats, Mahatma Road ");
        \u0275\u0275element(228, "br");
        \u0275\u0275text(229, "Mumbai ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(230, "div")(231, "span", 19)(232, "i", 20);
        \u0275\u0275text(233, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(234, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(235, "div", 21)(236, "button", 22);
        \u0275\u0275text(237, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(238, "div", 11)(239, "div", 12)(240, "div", 13)(241, "div", 14)(242, "div", 23)(243, "div", 16);
        \u0275\u0275text(244, "Smita Patil");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(245, "div", 17);
        \u0275\u0275text(246, "Housekeeper");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(247, "img", 24);
        \u0275\u0275elementStart(248, "p");
        \u0275\u0275text(249, " 45, Krishna Tower, Near Bus Stop, Satellite, ");
        \u0275\u0275element(250, "br");
        \u0275\u0275text(251, "Ahmedabad ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(252, "div")(253, "span", 19)(254, "i", 20);
        \u0275\u0275text(255, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(256, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(257, "div", 21)(258, "button", 22);
        \u0275\u0275text(259, "Read More");
        \u0275\u0275elementEnd()()()()()();
        \u0275\u0275elementStart(260, "div", 11)(261, "div", 12)(262, "div", 13)(263, "div", 14)(264, "div", 25)(265, "div", 16);
        \u0275\u0275text(266, "John Smith");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(267, "div", 17);
        \u0275\u0275text(268, "Cook");
        \u0275\u0275elementEnd()();
        \u0275\u0275element(269, "img", 26);
        \u0275\u0275elementStart(270, "p");
        \u0275\u0275text(271, " 456, Estern evenue, Courtage area, ");
        \u0275\u0275element(272, "br");
        \u0275\u0275text(273, "New York ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(274, "div")(275, "span", 19)(276, "i", 20);
        \u0275\u0275text(277, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275text(278, "264-625-2583");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(279, "div", 21)(280, "button", 22);
        \u0275\u0275text(281, "Read More");
        \u0275\u0275elementEnd()()()()()()()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Contact Grid")("items", \u0275\u0275pureFunction0(3, _c02))("active_item", "Contact Grid");
      }
    }, dependencies: [BreadcrumbComponent, MatButtonModule, MatButton], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactGridComponent, [{
    type: Component,
    args: [{ selector: "app-contact-grid", imports: [BreadcrumbComponent, MatButtonModule], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Contact Grid'" [items]="['Home']" [active_item]="'Contact Grid'"></app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <div class="col-xs-12 col-sm-6">\r
              <h2>\r
                <strong>Contact</strong> Grid</h2>\r
            </div>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header l-bg-purple-dark">\r
                        <div class="user-name">Pooja Patel</div>\r
                        <div class="name-center">General Manager</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig1.jpg" class="user-img" alt="">\r
                      <p>\r
                        A-103, shyam gokul flats, Mahatma Road\r
                        <br />Mumbai\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-cyan">\r
                        <div class="user-name">Smita Patil</div>\r
                        <div class="name-center">Housekeeper</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig2.jpg" class="user-img" alt="">\r
                      <p>\r
                        45, Krishna Tower, Near Bus Stop, Satellite,\r
                        <br />Ahmedabad\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-dark">\r
                        <div class="user-name">John Smith</div>\r
                        <div class="name-center">Cook</div>\r
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
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header l-bg-orange">\r
                        <div class="user-name">Pooja Patel</div>\r
                        <div class="name-center">General Manager</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig4.jpg" class="user-img" alt="">\r
                      <p>\r
                        A-103, shyam gokul flats, Mahatma Road\r
                        <br />Mumbai\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-green">\r
                        <div class="user-name">Smita Patil</div>\r
                        <div class="name-center">Housekeeper</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig5.jpg" class="user-img" alt="">\r
                      <p>\r
                        45, Krishna Tower, Near Bus Stop, Satellite,\r
                        <br />Ahmedabad\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header l-bg-red">\r
                        <div class="user-name">John Smith</div>\r
                        <div class="name-center">Cook</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig6.jpg" class="user-img" alt="">\r
                      <p>\r
                        456, Estern evenue, Courtage area,\r
                        <br />New York\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-indigo">\r
                        <div class="user-name">Pooja Patel</div>\r
                        <div class="name-center">General Manager</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig7.jpg" class="user-img" alt="">\r
                      <p>\r
                        A-103, shyam gokul flats, Mahatma Road\r
                        <br />Mumbai\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-brown">\r
                        <div class="user-name">Smita Patil</div>\r
                        <div class="name-center">Housekeeper</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig8.jpg" class="user-img" alt="">\r
                      <p>\r
                        45, Krishna Tower, Near Bus Stop, Satellite,\r
                        <br />Ahmedabad\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-yellow">\r
                        <div class="user-name">John Smith</div>\r
                        <div class="name-center">Cook</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig9.jpg" class="user-img" alt="">\r
                      <p>\r
                        456, Estern evenue, Courtage area,\r
                        <br />New York\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="row">\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header l-bg-purple-dark">\r
                        <div class="user-name">Pooja Patel</div>\r
                        <div class="name-center">General Manager</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig1.jpg" class="user-img" alt="">\r
                      <p>\r
                        A-103, shyam gokul flats, Mahatma Road\r
                        <br />Mumbai\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-cyan">\r
                        <div class="user-name">Smita Patil</div>\r
                        <div class="name-center">Housekeeper</div>\r
                      </div>\r
                      <img src="assets/images/user/usrbig2.jpg" class="user-img" alt="">\r
                      <p>\r
                        45, Krishna Tower, Near Bus Stop, Satellite,\r
                        <br />Ahmedabad\r
                      </p>\r
                      <div>\r
                        <span class="phone">\r
                          <i class="material-icons">phone</i>264-625-2583</span>\r
                      </div>\r
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
                      </div>\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-md-4">\r
                <div class="card border-apply">\r
                  <div class="m-b-20">\r
                    <div class="contact-grid">\r
                      <div class="profile-header bg-dark">\r
                        <div class="user-name">John Smith</div>\r
                        <div class="name-center">Cook</div>\r
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
                      <div class="profile-userbuttons">\r
                        <button mat-flat-button color="primary">Read More</button>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactGridComponent, { className: "ContactGridComponent", filePath: "src/app/apps/contact-grid/contact-grid.component.ts", lineNumber: 10 });
})();

// src/app/apps/support/support.component.ts
var _c03 = () => ["Home"];
var _c1 = () => [5, 10, 20];
function SupportComponent_th_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, " # ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "td", 43)(1, "mat-checkbox", 44);
    \u0275\u0275twoWayListener("ngModelChange", function SupportComponent_td_62_Template_mat_checkbox_ngModelChange_1_listener($event) {
      const element_r2 = \u0275\u0275restoreView(_r1).$implicit;
      \u0275\u0275twoWayBindingSet(element_r2.checked, $event) || (element_r2.checked = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const element_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", element_r2.checked);
  }
}
function SupportComponent_th_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 45);
    \u0275\u0275text(1, " User ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 46);
    \u0275\u0275element(1, "img", 47);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", element_r3.imageUrl, \u0275\u0275sanitizeUrl);
  }
}
function SupportComponent_th_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, " Opened By ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r4.name, " ");
  }
}
function SupportComponent_th_70_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 48);
    \u0275\u0275text(1, " Email ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r5.email, " ");
  }
}
function SupportComponent_th_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 48);
    \u0275\u0275text(1, " Subject ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r6.subject, " ");
  }
}
function SupportComponent_th_76_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 48);
    \u0275\u0275text(1, " Status ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_77_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r7.status, " ");
  }
}
function SupportComponent_th_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, " Assign To ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_80_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r8.assignTo, " ");
  }
}
function SupportComponent_th_82_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 42);
    \u0275\u0275text(1, " Date ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_83_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", element_r9.date, " ");
  }
}
function SupportComponent_th_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 49);
    \u0275\u0275text(1, " Actions ");
    \u0275\u0275elementEnd();
  }
}
function SupportComponent_td_86_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 43)(1, "button", 50);
    \u0275\u0275element(2, "app-feather-icons", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 50);
    \u0275\u0275element(4, "app-feather-icons", 51);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275classMap("tbl-fav-edit");
    \u0275\u0275property("icon", "edit");
    \u0275\u0275advance(2);
    \u0275\u0275classMap("tbl-fav-delete");
    \u0275\u0275property("icon", "trash-2");
  }
}
function SupportComponent_tr_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 52);
  }
}
function SupportComponent_tr_88_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "tr", 53);
  }
}
var ELEMENT_DATA = [
  {
    checked: false,
    imageUrl: "assets/images/user/user1.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user2.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user3.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "open",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user4.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user5.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "open",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user6.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user7.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "open",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user8.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "pending",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user9.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user10.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user1.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "open",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user2.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user3.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "pending",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user4.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user5.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user6.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "pending",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user7.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  },
  {
    checked: false,
    imageUrl: "assets/images/user/user8.jpg",
    name: "Tim Hank",
    email: "test@example.com",
    subject: "Image not Proper",
    status: "closed",
    assignTo: "John Deo",
    date: "27/05/2016",
    action: ""
  }
];
var SupportComponent = class _SupportComponent {
  constructor() {
    this.displayedColumns = [
      "checked",
      "imageUrl",
      "name",
      "email",
      "subject",
      "status",
      "assignTo",
      "date",
      "action"
    ];
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  static {
    this.\u0275fac = function SupportComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SupportComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SupportComponent, selectors: [["app-support"]], viewQuery: function SupportComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatPaginator, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.paginator = _t.first);
      }
    }, decls: 90, vars: 10, consts: [[1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row"], [1, "col-lg-12", "col-md-12", "col-sm-12"], [1, "card"], [1, "header"], [1, "body"], [1, "col-lg-3", "col-sm-6"], [1, "info-box7", "bg-c-blue", "order-info-box7"], [1, "info-box7-block"], [1, "m-b-20"], [1, "text-end"], [1, "fas", "fa-ticket-alt", "float-start"], [1, "m-b-0"], [1, "info-box7", "bg-c-green", "order-info-box7"], [1, "fas", "fa-reply", "float-start"], [1, "info-box7", "bg-c-yellow", "order-info-box7"], [1, "fas", "fa-clipboard-check", "float-start"], [1, "info-box7", "bg-c-pink", "order-info-box7"], [1, "fas", "fa-clipboard-list", "float-start"], [1, "table-responsive"], ["mat-table", "", 1, "w-100", 3, "dataSource"], ["matColumnDef", "checked"], ["mat-header-cell", "", "width", "10%", 4, "matHeaderCellDef"], ["mat-cell", "", 4, "matCellDef"], ["matColumnDef", "imageUrl"], ["mat-header-cell", "", "width", "8%", 4, "matHeaderCellDef"], ["mat-cell", "", "class", "table-img", 4, "matCellDef"], ["matColumnDef", "name"], ["matColumnDef", "email"], ["mat-header-cell", "", 4, "matHeaderCellDef"], ["matColumnDef", "subject"], ["matColumnDef", "status"], ["matColumnDef", "assignTo"], ["matColumnDef", "date"], ["matColumnDef", "action"], ["mat-header-cell", "", "width", "15%", 4, "matHeaderCellDef"], ["mat-header-row", "", 4, "matHeaderRowDef"], ["mat-row", "", 4, "matRowDef", "matRowDefColumns"], ["showFirstLastButtons", "", 3, "pageSize", "pageSizeOptions"], ["mat-header-cell", "", "width", "10%"], ["mat-cell", ""], [3, "ngModelChange", "ngModel"], ["mat-header-cell", "", "width", "8%"], ["mat-cell", "", 1, "table-img"], [3, "src"], ["mat-header-cell", ""], ["mat-header-cell", "", "width", "15%"], ["mat-icon-button", "", "color", "accent", 1, "tbl-action-btn"], [3, "icon"], ["mat-header-row", ""], ["mat-row", ""]], template: function SupportComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2);
        \u0275\u0275element(3, "app-breadcrumb", 3);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "h2")(9, "strong");
        \u0275\u0275text(10, "Support");
        \u0275\u0275elementEnd();
        \u0275\u0275text(11, " Tickets ");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 8)(13, "div", 4)(14, "div", 9)(15, "div", 10)(16, "div", 11)(17, "h6", 12);
        \u0275\u0275text(18, "Total Tickets");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "h4", 13);
        \u0275\u0275element(20, "i", 14);
        \u0275\u0275elementStart(21, "span");
        \u0275\u0275text(22, "1,276");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "p", 15);
        \u0275\u0275text(24, "18% Higher Then Last Month");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(25, "div", 9)(26, "div", 16)(27, "div", 11)(28, "h6", 12);
        \u0275\u0275text(29, "Reply");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(30, "h4", 13);
        \u0275\u0275element(31, "i", 17);
        \u0275\u0275elementStart(32, "span");
        \u0275\u0275text(33, "865");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(34, "p", 15);
        \u0275\u0275text(35, "21% Higher Then Last Month");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(36, "div", 9)(37, "div", 18)(38, "div", 11)(39, "h6", 12);
        \u0275\u0275text(40, "Resolve");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(41, "h4", 13);
        \u0275\u0275element(42, "i", 19);
        \u0275\u0275elementStart(43, "span");
        \u0275\u0275text(44, "457");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(45, "p", 15);
        \u0275\u0275text(46, "37% Higher Then Last Month");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(47, "div", 9)(48, "div", 20)(49, "div", 11)(50, "h6", 12);
        \u0275\u0275text(51, "Pending");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "h4", 13);
        \u0275\u0275element(53, "i", 21);
        \u0275\u0275elementStart(54, "span");
        \u0275\u0275text(55, "239");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(56, "p", 15);
        \u0275\u0275text(57, "10% Higher Then Last Month");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(58, "div", 22)(59, "table", 23);
        \u0275\u0275elementContainerStart(60, 24);
        \u0275\u0275template(61, SupportComponent_th_61_Template, 2, 0, "th", 25)(62, SupportComponent_td_62_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(63, 27);
        \u0275\u0275template(64, SupportComponent_th_64_Template, 2, 0, "th", 28)(65, SupportComponent_td_65_Template, 2, 1, "td", 29);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(66, 30);
        \u0275\u0275template(67, SupportComponent_th_67_Template, 2, 0, "th", 25)(68, SupportComponent_td_68_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(69, 31);
        \u0275\u0275template(70, SupportComponent_th_70_Template, 2, 0, "th", 32)(71, SupportComponent_td_71_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(72, 33);
        \u0275\u0275template(73, SupportComponent_th_73_Template, 2, 0, "th", 32)(74, SupportComponent_td_74_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(75, 34);
        \u0275\u0275template(76, SupportComponent_th_76_Template, 2, 0, "th", 32)(77, SupportComponent_td_77_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(78, 35);
        \u0275\u0275template(79, SupportComponent_th_79_Template, 2, 0, "th", 25)(80, SupportComponent_td_80_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(81, 36);
        \u0275\u0275template(82, SupportComponent_th_82_Template, 2, 0, "th", 25)(83, SupportComponent_td_83_Template, 2, 1, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275elementContainerStart(84, 37);
        \u0275\u0275template(85, SupportComponent_th_85_Template, 2, 0, "th", 38)(86, SupportComponent_td_86_Template, 5, 6, "td", 26);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(87, SupportComponent_tr_87_Template, 1, 0, "tr", 39)(88, SupportComponent_tr_88_Template, 1, 0, "tr", 40);
        \u0275\u0275elementEnd();
        \u0275\u0275element(89, "mat-paginator", 41);
        \u0275\u0275elementEnd()()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Support")("items", \u0275\u0275pureFunction0(8, _c03))("active_item", "Support");
        \u0275\u0275advance(56);
        \u0275\u0275property("dataSource", ctx.dataSource);
        \u0275\u0275advance(28);
        \u0275\u0275property("matHeaderRowDef", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.displayedColumns);
        \u0275\u0275advance();
        \u0275\u0275property("pageSize", 10)("pageSizeOptions", \u0275\u0275pureFunction0(9, _c1));
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
      MatCheckboxModule,
      MatCheckbox,
      FormsModule,
      NgControlStatus,
      NgModel,
      MatButtonModule,
      MatIconButton,
      FeatherIconsComponent,
      MatPaginatorModule,
      MatPaginator
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SupportComponent, [{
    type: Component,
    args: [{ selector: "app-support", imports: [
      BreadcrumbComponent,
      MatTableModule,
      MatCheckboxModule,
      FormsModule,
      MatButtonModule,
      FeatherIconsComponent,
      MatPaginatorModule
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Support'" [items]="['Home']" [active_item]="'Support'"></app-breadcrumb>\r
    </div>\r
    <div class="row">\r
      <div class="col-lg-12 col-md-12 col-sm-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>\r
              <strong>Support</strong> Tickets\r
            </h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-lg-3 col-sm-6">\r
                <div class="info-box7 bg-c-blue order-info-box7">\r
                  <div class="info-box7-block">\r
                    <h6 class="m-b-20">Total Tickets</h6>\r
                    <h4 class="text-end"><i class="fas fa-ticket-alt float-start"></i><span>1,276</span></h4>\r
                    <p class="m-b-0">18% Higher Then Last Month</p>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-3 col-sm-6">\r
                <div class="info-box7 bg-c-green order-info-box7">\r
                  <div class="info-box7-block">\r
                    <h6 class="m-b-20">Reply</h6>\r
                    <h4 class="text-end"><i class="fas fa-reply float-start"></i><span>865</span></h4>\r
                    <p class="m-b-0">21% Higher Then Last Month</p>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-3 col-sm-6">\r
                <div class="info-box7 bg-c-yellow order-info-box7">\r
                  <div class="info-box7-block">\r
                    <h6 class="m-b-20">Resolve</h6>\r
                    <h4 class="text-end"><i class="fas fa-clipboard-check float-start"></i><span>457</span></h4>\r
                    <p class="m-b-0">37% Higher Then Last Month</p>\r
                  </div>\r
                </div>\r
              </div>\r
              <div class="col-lg-3 col-sm-6">\r
                <div class="info-box7 bg-c-pink order-info-box7">\r
                  <div class="info-box7-block">\r
                    <h6 class="m-b-20">Pending</h6>\r
                    <h4 class="text-end"><i class="fas fa-clipboard-list float-start"></i><span>239</span></h4>\r
                    <p class="m-b-0">10% Higher Then Last Month</p>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
            <div class="table-responsive">\r
              <table mat-table [dataSource]="dataSource" class="w-100">\r
                <ng-container matColumnDef="checked">\r
                  <th mat-header-cell *matHeaderCellDef width="10%"> # </th>\r
                  <td mat-cell *matCellDef="let element">\r
                    <mat-checkbox [(ngModel)]="element.checked"></mat-checkbox>\r
                  </td>\r
                </ng-container>\r
                <ng-container matColumnDef="imageUrl">\r
                  <th mat-header-cell *matHeaderCellDef width="8%"> User </th>\r
                  <td mat-cell *matCellDef="let element" class="table-img"> <img [src]="element.imageUrl" /> </td>\r
                </ng-container>\r
                <ng-container matColumnDef="name">\r
                  <th mat-header-cell *matHeaderCellDef width="10%"> Opened By </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.name}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="email">\r
                  <th mat-header-cell *matHeaderCellDef> Email </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.email}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="subject">\r
                  <th mat-header-cell *matHeaderCellDef> Subject </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.subject}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="status">\r
                  <th mat-header-cell *matHeaderCellDef> Status </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.status}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="assignTo">\r
                  <th mat-header-cell *matHeaderCellDef width="10%"> Assign To </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.assignTo}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="date">\r
                  <th mat-header-cell *matHeaderCellDef width="10%"> Date </th>\r
                  <td mat-cell *matCellDef="let element"> {{element.date}} </td>\r
                </ng-container>\r
                <ng-container matColumnDef="action">\r
                  <th mat-header-cell *matHeaderCellDef width="15%"> Actions </th>\r
                  <td mat-cell *matCellDef="let element">\r
                    <button mat-icon-button color="accent" class="tbl-action-btn">\r
                      <app-feather-icons [icon]="'edit'" [class]="'tbl-fav-edit'"></app-feather-icons>\r
                    </button>\r
                    <button mat-icon-button color="accent" class="tbl-action-btn">\r
                      <app-feather-icons [icon]="'trash-2'" [class]="'tbl-fav-delete'"></app-feather-icons>\r
                    </button>\r
                  </td>\r
                </ng-container>\r
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>\r
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>\r
              </table>\r
              <mat-paginator [pageSize]="10" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons>\r
              </mat-paginator>\r
            </div>\r
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SupportComponent, { className: "SupportComponent", filePath: "src/app/apps/support/support.component.ts", lineNumber: 234 });
})();

// src/app/apps/drag-drop/drag-drop.component.ts
var _c04 = () => ["Home"];
var _c12 = (a0) => [a0];
function DragDropComponent_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r2);
  }
}
function DragDropComponent_For_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r3);
  }
}
function DragDropComponent_For_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r4);
  }
}
function DragDropComponent_For_73_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r5);
  }
}
function DragDropComponent_For_85_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 34);
  }
}
function DragDropComponent_For_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275template(1, DragDropComponent_For_85_div_1_Template, 1, 0, "div", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const movie_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", movie_r6, " ");
  }
}
function DragDropComponent_For_97_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    \u0275\u0275property("cdkDragDisabled", item_r7.disabled);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", item_r7.value, "");
  }
}
function DragDropComponent_For_127_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const number_r8 = ctx.$implicit;
    \u0275\u0275property("cdkDragData", number_r8);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", number_r8, " ");
  }
}
function DragDropComponent_For_133_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const number_r9 = ctx.$implicit;
    \u0275\u0275property("cdkDragData", number_r9);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", number_r9, " ");
  }
}
var DragDropComponent = class _DragDropComponent {
  constructor() {
    this.todo = ["Get to work", "Pick up groceries", "Go home", "Fall asleep"];
    this.done = ["Get up", "Brush teeth", "Take a shower", "Check e-mail", "Walk dog"];
    this.movies = [
      "Episode I - The Phantom Menace",
      "Episode II - Attack of the Clones",
      "Episode III - Revenge of the Sith",
      "Episode IV - A New Hope",
      "Episode V - The Empire Strikes Back",
      "Episode VI - Return of the Jedi",
      "Episode VII - The Force Awakens",
      "Episode VIII - The Last Jedi",
      "Episode IX - The Rise of Skywalker"
    ];
    this.items = [
      { value: "I can be dragged", disabled: false },
      { value: "I cannot be dragged", disabled: true },
      { value: "I can also be dragged", disabled: false }
    ];
    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    this.all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.even = [10];
  }
  drop(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  droppredicate(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
  drop2(event) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item) {
    return item.data % 2 === 0;
  }
  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }
  static {
    this.\u0275fac = function DragDropComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DragDropComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DragDropComponent, selectors: [["app-drag-drop"]], decls: 134, vars: 18, consts: [["todoList", "cdkDropList"], ["doneList", "cdkDropList"], [1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row", "clearfix"], [1, "col-xs-12", "col-sm-12", "col-md-12", "col-lg-12"], [1, "card"], [1, "header"], [1, "body"], [1, "row"], ["cdkDragLockAxis", "y", "cdkDrag", "", 1, "example-box"], ["cdkDragLockAxis", "x", "cdkDrag", "", 1, "example-box"], [1, "example-boundary"], ["cdkDragBoundary", ".example-boundary", "cdkDrag", "", 1, "example-box"], ["cdkDropListGroup", ""], [1, "example-container2"], ["cdkDropList", "", 1, "example-list", 3, "cdkDropListDropped", "cdkDropListData"], ["cdkDrag", "", 1, "example-box-small"], ["cdkDropList", "", 1, "example-list", 3, "cdkDropListDropped", "cdkDropListData", "cdkDropListConnectedTo"], ["cdkDropList", "", 1, "example-list2", 3, "cdkDropListDropped"], ["cdkDrag", "", 1, "example-box2"], ["cdkDropList", "", 1, "example-list", 3, "cdkDropListDropped"], ["cdkDrag", "", 1, "example-box-small", 3, "cdkDragDisabled"], ["cdkDrag", "", 1, "example-box"], ["cdkDragHandle", "", 1, "example-handle"], ["width", "24px", "fill", "currentColor", "viewBox", "0 0 24 24"], ["d", "M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"], ["d", "M0 0h24v24H0z", "fill", "none"], ["id", "all", "cdkDropList", "", "cdkDropListConnectedTo", "even", 1, "example-list", 3, "cdkDropListDropped", "cdkDropListData", "cdkDropListEnterPredicate"], ["cdkDrag", "", 1, "example-box-small", 3, "cdkDragData"], ["id", "even", "cdkDropList", "", "cdkDropListConnectedTo", "all", 1, "example-list", 3, "cdkDropListDropped", "cdkDropListData", "cdkDropListEnterPredicate"], ["class", "example-custom-placeholder", 4, "cdkDragPlaceholder"], [1, "example-custom-placeholder"]], template: function DragDropComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "section", 2)(1, "div", 3)(2, "div", 4);
        \u0275\u0275element(3, "app-breadcrumb", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 6)(5, "div", 7)(6, "div", 8)(7, "div", 9)(8, "h2");
        \u0275\u0275text(9, "Drag&Drop position locking");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 10)(11, "div", 11)(12, "div", 7)(13, "div", 12);
        \u0275\u0275text(14, " I can only be dragged up/down ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 13);
        \u0275\u0275text(16, " I can only be dragged left/right ");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(17, "div", 6)(18, "div", 7)(19, "div", 8)(20, "div", 9)(21, "h2");
        \u0275\u0275text(22, "Drag&Drop boundary");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(23, "div", 10)(24, "div", 11)(25, "div", 7)(26, "div", 14)(27, "div", 15);
        \u0275\u0275text(28, " I can only be dragged within the dotted container ");
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(29, "div", 6)(30, "div", 7)(31, "div", 8)(32, "div", 9)(33, "h2");
        \u0275\u0275text(34, "Drag&Drop connected sorting group");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(35, "div", 10)(36, "div", 11)(37, "div", 7)(38, "div", 16)(39, "div", 17)(40, "h6");
        \u0275\u0275text(41, "To do");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(42, "div", 18);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_42_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(43, DragDropComponent_For_44_Template, 2, 1, "div", 19, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(45, "div", 17)(46, "h6");
        \u0275\u0275text(47, "Done");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "div", 18);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_48_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(49, DragDropComponent_For_50_Template, 2, 1, "div", 19, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()()()()()()();
        \u0275\u0275elementStart(51, "div", 6)(52, "div", 7)(53, "div", 8)(54, "div", 9)(55, "h2");
        \u0275\u0275text(56, "Drag&Drop connected sorting");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(57, "div", 10)(58, "div", 11)(59, "div", 7)(60, "div", 17)(61, "h6");
        \u0275\u0275text(62, "To do");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(63, "div", 20, 0);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_63_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(65, DragDropComponent_For_66_Template, 2, 1, "div", 19, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(67, "div", 17)(68, "h6");
        \u0275\u0275text(69, "Done");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "div", 20, 1);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_70_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(72, DragDropComponent_For_73_Template, 2, 1, "div", 19, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()()()()()();
        \u0275\u0275elementStart(74, "div", 6)(75, "div", 7)(76, "div", 8)(77, "div", 9)(78, "h2");
        \u0275\u0275text(79, "Drag&Drop custom placeholder");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(80, "div", 10)(81, "div", 11)(82, "div", 7)(83, "div", 21);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_83_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(84, DragDropComponent_For_85_Template, 3, 1, "div", 22, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(86, "div", 6)(87, "div", 7)(88, "div", 8)(89, "div", 9)(90, "h2");
        \u0275\u0275text(91, "Drag&Drop disabled");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(92, "div", 10)(93, "div", 11)(94, "div", 7)(95, "div", 23);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_95_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.drop($event));
        });
        \u0275\u0275repeaterCreate(96, DragDropComponent_For_97_Template, 2, 2, "div", 24, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(98, "div", 6)(99, "div", 7)(100, "div", 8)(101, "div", 9)(102, "h2");
        \u0275\u0275text(103, "Drag&Drop with a handle");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(104, "div", 10)(105, "div", 11)(106, "div", 7)(107, "div", 25);
        \u0275\u0275text(108, " I can only be dragged using the handle ");
        \u0275\u0275elementStart(109, "div", 26);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(110, "svg", 27);
        \u0275\u0275element(111, "path", 28)(112, "path", 29);
        \u0275\u0275elementEnd()()()()()()()()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(113, "div", 6)(114, "div", 7)(115, "div", 8)(116, "div", 9)(117, "h2");
        \u0275\u0275text(118, "Drag&Drop enter predicate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(119, "div", 10)(120, "div", 11)(121, "div", 7)(122, "div", 17)(123, "h6");
        \u0275\u0275text(124, "Available numbers");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(125, "div", 30);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_125_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.droppredicate($event));
        });
        \u0275\u0275repeaterCreate(126, DragDropComponent_For_127_Template, 2, 2, "div", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(128, "div", 17)(129, "h6");
        \u0275\u0275text(130, "Even numbers");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(131, "div", 32);
        \u0275\u0275listener("cdkDropListDropped", function DragDropComponent_Template_div_cdkDropListDropped_131_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.droppredicate($event));
        });
        \u0275\u0275repeaterCreate(132, DragDropComponent_For_133_Template, 2, 2, "div", 31, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()()()()()()()();
      }
      if (rf & 2) {
        const todoList_r10 = \u0275\u0275reference(64);
        const doneList_r11 = \u0275\u0275reference(71);
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Drag & Drop")("items", \u0275\u0275pureFunction0(13, _c04))("active_item", "Drag & Drop");
        \u0275\u0275advance(39);
        \u0275\u0275property("cdkDropListData", ctx.todo);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.todo);
        \u0275\u0275advance(5);
        \u0275\u0275property("cdkDropListData", ctx.done);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.done);
        \u0275\u0275advance(14);
        \u0275\u0275property("cdkDropListData", ctx.todo)("cdkDropListConnectedTo", \u0275\u0275pureFunction1(14, _c12, doneList_r11));
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.todo);
        \u0275\u0275advance(5);
        \u0275\u0275property("cdkDropListData", ctx.done)("cdkDropListConnectedTo", \u0275\u0275pureFunction1(16, _c12, todoList_r10));
        \u0275\u0275advance(2);
        \u0275\u0275repeater(ctx.done);
        \u0275\u0275advance(12);
        \u0275\u0275repeater(ctx.movies);
        \u0275\u0275advance(12);
        \u0275\u0275repeater(ctx.items);
        \u0275\u0275advance(29);
        \u0275\u0275property("cdkDropListData", ctx.all)("cdkDropListEnterPredicate", ctx.noReturnPredicate);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.all);
        \u0275\u0275advance(5);
        \u0275\u0275property("cdkDropListData", ctx.even)("cdkDropListEnterPredicate", ctx.evenPredicate);
        \u0275\u0275advance();
        \u0275\u0275repeater(ctx.even);
      }
    }, dependencies: [
      BreadcrumbComponent,
      CdkDrag,
      CdkDropListGroup,
      CdkDropList,
      CdkDragPlaceholder,
      CdkDragHandle
    ], styles: ["\n\n.container[_ngcontent-%COMP%]   .ex-moved[_ngcontent-%COMP%] {\n  background-color: rgba(255, 21, 45, 0.75);\n  color: #fff;\n}\n.container.ex-over[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.3);\n}\n/*# sourceMappingURL=drag-drop.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DragDropComponent, [{
    type: Component,
    args: [{ selector: "app-drag-drop", imports: [
      BreadcrumbComponent,
      CdkDrag,
      CdkDropListGroup,
      CdkDropList,
      CdkDragPlaceholder,
      CdkDragHandle
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Drag &amp; Drop'" [items]="['Home']" [active_item]="'Drag &amp; Drop'"></app-breadcrumb>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop position locking</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div class="example-box" cdkDragLockAxis="y" cdkDrag>\r
                  I can only be dragged up/down\r
                </div>\r
                <div class="example-box" cdkDragLockAxis="x" cdkDrag>\r
                  I can only be dragged left/right\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop boundary</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div class="example-boundary">\r
                  <div class="example-box" cdkDragBoundary=".example-boundary" cdkDrag>\r
                    I can only be dragged within the dotted container\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop connected sorting group</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div cdkDropListGroup>\r
                  <div class="example-container2">\r
                    <h6>To do</h6>\r
                    <div cdkDropList [cdkDropListData]="todo" class="example-list" (cdkDropListDropped)="drop($event)">\r
                      @for (item of todo; track item) {\r
                      <div class="example-box-small" cdkDrag>{{item}}</div>\r
                      }\r
                    </div>\r
                  </div>\r
                  <div class="example-container2">\r
                    <h6>Done</h6>\r
                    <div cdkDropList [cdkDropListData]="done" class="example-list" (cdkDropListDropped)="drop($event)">\r
                      @for (item of done; track item) {\r
                      <div class="example-box-small" cdkDrag>{{item}}</div>\r
                      }\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop connected sorting</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div class="example-container2">\r
                  <h6>To do</h6>\r
                  <div cdkDropList #todoList="cdkDropList" [cdkDropListData]="todo"\r
                    [cdkDropListConnectedTo]="[doneList]" class="example-list" (cdkDropListDropped)="drop($event)">\r
                    @for (item of todo; track item) {\r
                    <div class="example-box-small" cdkDrag>{{item}}</div>\r
                    }\r
                  </div>\r
                </div>\r
                <div class="example-container2">\r
                  <h6>Done</h6>\r
                  <div cdkDropList #doneList="cdkDropList" [cdkDropListData]="done"\r
                    [cdkDropListConnectedTo]="[todoList]" class="example-list" (cdkDropListDropped)="drop($event)">\r
                    @for (item of done; track item) {\r
                    <div class="example-box-small" cdkDrag>{{item}}</div>\r
                    }\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop custom placeholder</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div cdkDropList class="example-list2" (cdkDropListDropped)="drop($event)">\r
                  @for (movie of movies; track movie) {\r
                  <div class="example-box2" cdkDrag>\r
                    <div class="example-custom-placeholder" *cdkDragPlaceholder></div>\r
                    {{movie}}\r
                  </div>\r
                  }\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop disabled</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">\r
                  @for (item of items; track item) {\r
                  <div class="example-box-small" cdkDrag [cdkDragDisabled]="item.disabled">\r
                    {{item.value}}</div>\r
                  }\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop with a handle</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div class="example-box" cdkDrag>\r
                  I can only be dragged using the handle\r
                  <div class="example-handle" cdkDragHandle>\r
                    <svg width="24px" fill="currentColor" viewBox="0 0 24 24">\r
                      <path\r
                        d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z">\r
                      </path>\r
                      <path d="M0 0h24v24H0z" fill="none"></path>\r
                    </svg>\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
    <div class="row clearfix">\r
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
        <div class="card">\r
          <div class="header">\r
            <h2>Drag&Drop enter predicate</h2>\r
          </div>\r
          <div class="body">\r
            <div class="row">\r
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">\r
                <div class="example-container2">\r
                  <h6>Available numbers</h6>\r
                  <div id="all" cdkDropList [cdkDropListData]="all" cdkDropListConnectedTo="even" class="example-list"\r
                    (cdkDropListDropped)="droppredicate($event)" [cdkDropListEnterPredicate]="noReturnPredicate">\r
                    @for (number of all; track number) {\r
                    <div class="example-box-small" [cdkDragData]="number" cdkDrag>{{number}}\r
                    </div>\r
                    }\r
                  </div>\r
                </div>\r
                <div class="example-container2">\r
                  <h6>Even numbers</h6>\r
                  <div id="even" cdkDropList [cdkDropListData]="even" cdkDropListConnectedTo="all" class="example-list"\r
                    (cdkDropListDropped)="droppredicate($event)" [cdkDropListEnterPredicate]="evenPredicate">\r
                    @for (number of even; track number) {\r
                    <div class="example-box-small" cdkDrag [cdkDragData]="number">{{number}}\r
                    </div>\r
                    }\r
                  </div>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>`, styles: ["/* src/app/apps/drag-drop/drag-drop.component.scss */\n.container .ex-moved {\n  background-color: rgba(255, 21, 45, 0.75);\n  color: #fff;\n}\n.container.ex-over {\n  background-color: rgba(255, 255, 255, 0.3);\n}\n/*# sourceMappingURL=drag-drop.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DragDropComponent, { className: "DragDropComponent", filePath: "src/app/apps/drag-drop/drag-drop.component.ts", lineNumber: 18 });
})();

// src/app/apps/apps.routes.ts
var APPS_ROUTE = [
  {
    path: "chat",
    component: ChatComponent
  },
  {
    path: "contact-grid",
    component: ContactGridComponent
  },
  {
    path: "support",
    component: SupportComponent
  },
  {
    path: "dragdrop",
    component: DragDropComponent
  }
];
export {
  APPS_ROUTE
};
//# sourceMappingURL=apps.routes-VZJDU6Q5.js.map
