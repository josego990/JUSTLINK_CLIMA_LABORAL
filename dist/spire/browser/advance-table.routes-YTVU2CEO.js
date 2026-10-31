import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "./chunk-RV5INBRD.js";
import {
  MatMomentDateModule
} from "./chunk-PF3HRIW7.js";
import {
  TableExportUtil
} from "./chunk-CAQCEW54.js";
import "./chunk-OG3MZBZK.js";
import {
  MatSort,
  MatSortHeader,
  MatSortModule
} from "./chunk-KEZ67SIB.js";
import {
  rowsAnimation
} from "./chunk-PTBHIFLI.js";
import {
  MatPaginator,
  MatPaginatorModule
} from "./chunk-3O3RAW4I.js";
import {
  MatRadioButton,
  MatRadioGroup,
  MatRadioModule
} from "./chunk-LHQOYH62.js";
import "./chunk-PO3BZ2ER.js";
import "./chunk-75G4SHEF.js";
import {
  MatSnackBar
} from "./chunk-JAMOUGRC.js";
import "./chunk-UKX4IBLX.js";
import "./chunk-Y2ZBDXTZ.js";
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
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "./chunk-FO3S3GOD.js";
import {
  MatCardModule
} from "./chunk-DD5M7VBH.js";
import {
  MatCheckbox,
  MatCheckboxModule
} from "./chunk-SKPM4PVR.js";
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger
} from "./chunk-HTLD25D4.js";
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from "./chunk-5ZIRF7RR.js";
import "./chunk-JURKDGMK.js";
import {
  MatOption,
  MatOptionModule,
  MatSelect,
  MatSelectModule
} from "./chunk-QV4DNMNF.js";
import "./chunk-RTX2H4T5.js";
import "./chunk-TWFG2YEX.js";
import {
  SelectionModel
} from "./chunk-AMSP6ESA.js";
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
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix
} from "./chunk-DKBY3V4W.js";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NumberValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  UntypedFormControl,
  Validators,
  ɵNgNoValidate
} from "./chunk-76BSNCUT.js";
import "./chunk-ILJ4Z3ML.js";
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
  MatRipple,
  MatRippleModule
} from "./chunk-6OUKOU55.js";
import {
  FeatherIconsComponent
} from "./chunk-Y73QBUAC.js";
import {
  CommonModule,
  DatePipe,
  HttpClient,
  NgClass,
  formatDate
} from "./chunk-WZAKLMWR.js";
import {
  BehaviorSubject,
  Component,
  Inject,
  Injectable,
  Subject,
  ViewChild,
  catchError,
  map,
  of,
  setClassMetadata,
  throwError,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵreference,
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

// src/app/advance-table/advance-table.model.ts
var AdvanceTable = class {
  constructor(advanceTable = {}) {
    {
      this.id = advanceTable.id || this.getRandomID();
      this.img = advanceTable.img || "assets/images/user/user1.jpg";
      this.firstName = advanceTable.firstName || "";
      this.lastName = advanceTable.lastName || "";
      this.email = advanceTable.email || "";
      this.gender = advanceTable.gender || "male";
      this.birthDate = formatDate(/* @__PURE__ */ new Date(), "yyyy-MM-dd", "en") || "";
      this.mobile = advanceTable.mobile || "";
      this.address = advanceTable.address || "";
      this.country = advanceTable.country || "";
    }
  }
  getRandomID() {
    const S4 = () => {
      return (1 + Math.random()) * 65536 | 0;
    };
    return S4() + S4();
  }
};

// src/app/advance-table/advance-table.service.ts
var AdvanceTableService = class _AdvanceTableService {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.API_URL = "assets/data/advanceTable.json";
    this.dataChange = new BehaviorSubject([]);
  }
  /** GET: Fetch all advance tables */
  getAllAdvanceTables() {
    return this.httpClient.get(this.API_URL).pipe(catchError(this.handleError));
  }
  /** POST: Add a new advance table */
  addAdvanceTable(advanceTable) {
    return of(advanceTable).pipe(map((response) => {
      return response;
    }), catchError(this.handleError));
  }
  /** PUT: Update an existing advance table */
  updateAdvanceTable(advanceTable) {
    return of(advanceTable).pipe(map((response) => {
      return response;
    }), catchError(this.handleError));
  }
  /** DELETE: Remove an advance table by ID */
  deleteAdvanceTable(id) {
    return of(id).pipe(map((response) => {
      return id;
    }), catchError(this.handleError));
  }
  /** Handle Http operation that failed */
  handleError(error) {
    console.error("An error occurred:", error.message);
    return throwError(() => new Error("Something went wrong; please try again later."));
  }
  static {
    this.\u0275fac = function AdvanceTableService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AdvanceTableService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdvanceTableService, factory: _AdvanceTableService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdvanceTableService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/advance-table/dialogs/form-dialog/form-dialog.component.ts
function FormDialogComponent_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " First Name is required ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Last Name is required ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Select gender ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please enter a valid email address ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please select date ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_69_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Mobile is required ");
    \u0275\u0275elementEnd();
  }
}
function FormDialogComponent_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Country Name is required ");
    \u0275\u0275elementEnd();
  }
}
var FormDialogComponent = class _FormDialogComponent {
  constructor(dialogRef, data, advanceTableService, fb) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.advanceTableService = advanceTableService;
    this.fb = fb;
    this.url = null;
    this.formControl = new UntypedFormControl("", [
      Validators.required
      // Validators.email,
    ]);
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.advanceTable.firstName + " " + data.advanceTable.lastName;
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = "New Record";
      this.advanceTable = new AdvanceTable();
    }
    this.advanceTableForm = this.createContactForm();
  }
  getErrorMessage() {
    return this.formControl.hasError("required") ? "Required field" : this.formControl.hasError("email") ? "Not a valid email" : "";
  }
  createContactForm() {
    return this.fb.group({
      id: [this.advanceTable.id],
      img: [this.advanceTable.img],
      firstName: [this.advanceTable.firstName, [Validators.required]],
      lastName: [this.advanceTable.lastName, [Validators.required]],
      email: [
        this.advanceTable.email,
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      gender: [this.advanceTable.gender],
      birthDate: [
        formatDate(this.advanceTable.birthDate, "yyyy-MM-dd", "en"),
        [Validators.required]
      ],
      address: [this.advanceTable.address],
      mobile: [this.advanceTable.mobile, [Validators.required]],
      country: [this.advanceTable.country]
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  submit() {
    if (this.advanceTableForm.valid) {
      const formData = this.advanceTableForm.getRawValue();
      if (this.action === "edit") {
        this.advanceTableService.updateAdvanceTable(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error("Update Error:", error);
          }
        });
      } else {
        this.advanceTableService.addAdvanceTable(formData).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error("Add Error:", error);
          }
        });
      }
    }
  }
  onSelectFile(event) {
    const target = event.target;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]);
      reader.onload = (e) => {
        if (e.target) {
          this.url = e.target.result;
        }
      };
    }
  }
  static {
    this.\u0275fac = function FormDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _FormDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(AdvanceTableService), \u0275\u0275directiveInject(FormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormDialogComponent, selectors: [["app-form-dialog"]], features: [\u0275\u0275ProvidersFeature([{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }])], decls: 103, vars: 20, consts: [["picker", ""], [1, "dialogContainer"], [1, "modalHeader"], [1, "avatarDetails"], [1, "hoverable"], ["alt", "image", 3, "src"], [1, "hover-text"], [1, "background"], ["id", "tableFileInput", "type", "file", 3, "change"], [1, "modalTitle"], ["mat-icon-button", "", "mat-dialog-close", "", "aria-label", "Close dialog", "type", "button", 1, "modal-close-button"], ["mat-dialog-content", ""], [1, "form-field-full", 3, "ngSubmit", "formGroup"], [1, "row", "m-b-25"], [1, "col-sm-6"], ["appearance", "outline", "subscriptSizing", "dynamic", 1, "example-full-width"], ["matInput", "", "formControlName", "firstName"], ["matSuffix", "", 1, "material-icons-outlined", "color-icon", "p-3"], ["matInput", "", "formControlName", "lastName"], [1, "col-sm-12"], [1, "msr-3"], ["aria-label", "Select gender", "formControlName", "gender", "required", ""], ["value", "Male", "color", "primary"], ["value", "Female", "color", "primary"], ["matInput", "", "formControlName", "email", "required", ""], ["matInput", "", "formControlName", "birthDate", 3, "matDatepicker"], ["matSuffix", "", 3, "for"], ["matInput", "", "formControlName", "mobile", "type", "number"], ["formControlName", "country", "required", ""], [3, "value"], ["matInput", "", "formControlName", "address"], [1, "example-button-row"], ["mat-flat-button", "", "type", "submit", 1, "formSubmitBtn", 3, "disabled"], ["mat-flat-button", "", "mat-dialog-close", "", "tabindex", "-1", 1, "formCancelBtn"]], template: function FormDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "label", 4);
        \u0275\u0275element(4, "img", 5);
        \u0275\u0275elementStart(5, "div", 6);
        \u0275\u0275text(6, "Upload");
        \u0275\u0275elementEnd();
        \u0275\u0275element(7, "div", 7);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "input", 8);
        \u0275\u0275listener("change", function FormDialogComponent_Template_input_change_8_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.onSelectFile($event));
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 9);
        \u0275\u0275text(10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "button", 10)(12, "mat-icon");
        \u0275\u0275text(13, "close");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(14, "div", 11)(15, "form", 12);
        \u0275\u0275listener("ngSubmit", function FormDialogComponent_Template_form_ngSubmit_15_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.submit());
        });
        \u0275\u0275elementStart(16, "div", 13)(17, "div", 14)(18, "mat-form-field", 15)(19, "mat-label");
        \u0275\u0275text(20, "First Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(21, "input", 16);
        \u0275\u0275elementStart(22, "mat-icon", 17);
        \u0275\u0275text(23, "face");
        \u0275\u0275elementEnd();
        \u0275\u0275template(24, FormDialogComponent_Conditional_24_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(25, "div", 14)(26, "mat-form-field", 15)(27, "mat-label");
        \u0275\u0275text(28, "Last Name");
        \u0275\u0275elementEnd();
        \u0275\u0275element(29, "input", 18);
        \u0275\u0275elementStart(30, "mat-icon", 17);
        \u0275\u0275text(31, "face");
        \u0275\u0275elementEnd();
        \u0275\u0275template(32, FormDialogComponent_Conditional_32_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "div", 13)(34, "div", 19)(35, "mat-label", 20);
        \u0275\u0275text(36, "Gender:");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "mat-radio-group", 21)(38, "mat-radio-button", 22);
        \u0275\u0275text(39, "Male");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "mat-radio-button", 23);
        \u0275\u0275text(41, "Female");
        \u0275\u0275elementEnd();
        \u0275\u0275template(42, FormDialogComponent_Conditional_42_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(43, "div", 13)(44, "div", 14)(45, "mat-form-field", 15)(46, "mat-label");
        \u0275\u0275text(47, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(48, "input", 24);
        \u0275\u0275elementStart(49, "mat-icon", 17);
        \u0275\u0275text(50, "email");
        \u0275\u0275elementEnd();
        \u0275\u0275template(51, FormDialogComponent_Conditional_51_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(52, "div", 14)(53, "mat-form-field", 15)(54, "mat-label");
        \u0275\u0275text(55, "Birth date");
        \u0275\u0275elementEnd();
        \u0275\u0275element(56, "input", 25)(57, "mat-datepicker-toggle", 26)(58, "mat-datepicker", null, 0);
        \u0275\u0275template(60, FormDialogComponent_Conditional_60_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(61, "div", 13)(62, "div", 14)(63, "mat-form-field", 15)(64, "mat-label");
        \u0275\u0275text(65, "Mobile");
        \u0275\u0275elementEnd();
        \u0275\u0275element(66, "input", 27);
        \u0275\u0275elementStart(67, "mat-icon", 17);
        \u0275\u0275text(68, "phone");
        \u0275\u0275elementEnd();
        \u0275\u0275template(69, FormDialogComponent_Conditional_69_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(70, "div", 14)(71, "mat-form-field", 15)(72, "mat-label");
        \u0275\u0275text(73, "Country");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(74, "mat-select", 28)(75, "mat-option", 29);
        \u0275\u0275text(76, " India ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(77, "mat-option", 29);
        \u0275\u0275text(78, " USA ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(79, "mat-option", 29);
        \u0275\u0275text(80, " France ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(81, "mat-option", 29);
        \u0275\u0275text(82, " Germany ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(83, "mat-option", 29);
        \u0275\u0275text(84, " Spain ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(85, "mat-option", 29);
        \u0275\u0275text(86, " Turkey ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(87, "mat-option", 29);
        \u0275\u0275text(88, " Other ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(89, FormDialogComponent_Conditional_89_Template, 2, 0, "mat-error");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(90, "div", 13)(91, "div", 19)(92, "mat-form-field", 15)(93, "mat-label");
        \u0275\u0275text(94, "Address");
        \u0275\u0275elementEnd();
        \u0275\u0275element(95, "textarea", 30);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(96, "div", 13)(97, "div", 19)(98, "div", 31)(99, "button", 32);
        \u0275\u0275text(100, "Save");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(101, "button", 33);
        \u0275\u0275text(102, "Cancel");
        \u0275\u0275elementEnd()()()()()()();
      }
      if (rf & 2) {
        let tmp_4_0;
        let tmp_5_0;
        let tmp_6_0;
        let tmp_7_0;
        let tmp_10_0;
        let tmp_11_0;
        let tmp_19_0;
        const picker_r2 = \u0275\u0275reference(59);
        \u0275\u0275advance(4);
        \u0275\u0275property("src", ctx.url ? ctx.url : ctx.advanceTable.img, \u0275\u0275sanitizeUrl);
        \u0275\u0275advance(6);
        \u0275\u0275textInterpolate1(" ", ctx.dialogTitle, " ");
        \u0275\u0275advance(5);
        \u0275\u0275property("formGroup", ctx.advanceTableForm);
        \u0275\u0275advance(9);
        \u0275\u0275conditional(((tmp_4_0 = ctx.advanceTableForm.get("firstName")) == null ? null : tmp_4_0.hasError("required")) ? 24 : -1);
        \u0275\u0275advance(8);
        \u0275\u0275conditional(((tmp_5_0 = ctx.advanceTableForm.get("lastName")) == null ? null : tmp_5_0.hasError("required")) ? 32 : -1);
        \u0275\u0275advance(10);
        \u0275\u0275conditional(((tmp_6_0 = ctx.advanceTableForm.get("gender")) == null ? null : tmp_6_0.hasError("required")) ? 42 : -1);
        \u0275\u0275advance(9);
        \u0275\u0275conditional(((tmp_7_0 = ctx.advanceTableForm.get("email")) == null ? null : tmp_7_0.hasError("required")) || ((tmp_7_0 = ctx.advanceTableForm.get("email")) == null ? null : tmp_7_0.touched) ? 51 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275property("matDatepicker", picker_r2);
        \u0275\u0275advance();
        \u0275\u0275property("for", picker_r2);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(((tmp_10_0 = ctx.advanceTableForm.get("birthDate")) == null ? null : tmp_10_0.hasError("required")) ? 60 : -1);
        \u0275\u0275advance(9);
        \u0275\u0275conditional(((tmp_11_0 = ctx.advanceTableForm.get("mobile")) == null ? null : tmp_11_0.hasError("required")) ? 69 : -1);
        \u0275\u0275advance(6);
        \u0275\u0275property("value", "india");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "usa");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "france");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "germany");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "spain");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "turkey");
        \u0275\u0275advance(2);
        \u0275\u0275property("value", "other");
        \u0275\u0275advance(2);
        \u0275\u0275conditional(((tmp_19_0 = ctx.advanceTableForm.get("country")) == null ? null : tmp_19_0.hasError("required")) ? 89 : -1);
        \u0275\u0275advance(10);
        \u0275\u0275property("disabled", !ctx.advanceTableForm.valid);
      }
    }, dependencies: [
      MatButtonModule,
      MatButton,
      MatIconButton,
      MatIconModule,
      MatIcon,
      MatDialogContent,
      FormsModule,
      \u0275NgNoValidate,
      DefaultValueAccessor,
      NumberValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      ReactiveFormsModule,
      FormGroupDirective,
      FormControlName,
      MatFormFieldModule,
      MatFormField,
      MatLabel,
      MatError,
      MatSuffix,
      MatInputModule,
      MatInput,
      MatRadioModule,
      MatRadioGroup,
      MatRadioButton,
      MatDatepickerModule,
      MatDatepicker,
      MatDatepickerInput,
      MatDatepickerToggle,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatOptionModule,
      MatDialogClose,
      MatNativeDateModule,
      MatMomentDateModule
    ], styles: ["\n\n.hoverable[_ngcontent-%COMP%] {\n  position: relative;\n  display: block;\n  cursor: pointer;\n  height: 36px;\n  width: 36px;\n  border-radius: 50%;\n}\n.hoverable[_ngcontent-%COMP%]   .hover-text[_ngcontent-%COMP%] {\n  position: absolute;\n  display: none;\n  top: 50%;\n  left: 50%;\n  font-size: 10px;\n  transform: translate(-50%, -50%);\n  z-index: 2;\n}\n.hoverable[_ngcontent-%COMP%]   .background[_ngcontent-%COMP%] {\n  position: absolute;\n  display: none;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(255, 255, 255, 0.5);\n  pointer-events: none;\n  border-radius: 50%;\n  z-index: 1;\n}\n.hoverable[_ngcontent-%COMP%]:hover   .hover-text[_ngcontent-%COMP%] {\n  display: block;\n}\n.hoverable[_ngcontent-%COMP%]:hover   .background[_ngcontent-%COMP%] {\n  display: block;\n}\n#tableFileInput[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=form-dialog.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormDialogComponent, [{
    type: Component,
    args: [{ selector: "app-form-dialog", providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }], imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogContent,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      MatDatepickerModule,
      MatSelectModule,
      MatOptionModule,
      MatDialogClose,
      MatNativeDateModule,
      MatMomentDateModule
    ], template: `<div class="dialogContainer">\r
  <div class="modalHeader">\r
    <div class="avatarDetails">\r
      <label class="hoverable">\r
        <img [src]="url ? url : advanceTable.img" alt="image">\r
        <div class="hover-text">Upload</div>\r
        <div class="background"></div>\r
      </label>\r
      <input id="tableFileInput" type='file' (change)="onSelectFile($event)">\r
      <div class="modalTitle">\r
        {{dialogTitle}}\r
      </div>\r
    </div>\r
    <button mat-icon-button mat-dialog-close class="modal-close-button" aria-label="Close dialog" type="button">\r
      <mat-icon>close</mat-icon>\r
    </button>\r
  </div>\r
  <div mat-dialog-content>\r
    <form class="form-field-full" [formGroup]="advanceTableForm" (ngSubmit)="submit()">\r
      <div class="row m-b-25">\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>First Name</mat-label>\r
            <input matInput formControlName="firstName">\r
            <mat-icon class="material-icons-outlined color-icon p-3" matSuffix>face</mat-icon>\r
            @if (advanceTableForm.get('firstName')?.hasError('required')) {\r
            <mat-error>\r
              First Name is required\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Last Name</mat-label>\r
            <input matInput formControlName="lastName">\r
            <mat-icon class="material-icons-outlined color-icon p-3" matSuffix>face</mat-icon>\r
            @if (advanceTableForm.get('lastName')?.hasError('required')) {\r
            <mat-error>\r
              Last Name is required\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
      </div>\r
      <div class="row m-b-25">\r
        <div class="col-sm-12">\r
          <mat-label class="msr-3">Gender:</mat-label>\r
          <mat-radio-group aria-label="Select gender" formControlName="gender" required>\r
            <mat-radio-button value="Male" color="primary">Male</mat-radio-button>\r
            <mat-radio-button value="Female" color="primary">Female</mat-radio-button>\r
            @if (advanceTableForm.get('gender')?.hasError('required')) {\r
            <mat-error>\r
              Select gender\r
            </mat-error>\r
            }\r
          </mat-radio-group>\r
        </div>\r
      </div>\r
      <div class="row m-b-25">\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Email</mat-label>\r
            <input matInput formControlName="email" required>\r
            <mat-icon class="material-icons-outlined color-icon p-3" matSuffix>email</mat-icon>\r
            @if (advanceTableForm.get('email')?.hasError('required') || advanceTableForm.get('email')?.touched) {\r
            <mat-error>\r
              Please enter a valid email address\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Birth date</mat-label>\r
            <input matInput [matDatepicker]="picker" formControlName="birthDate">\r
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>\r
            <mat-datepicker #picker></mat-datepicker>\r
            @if (advanceTableForm.get('birthDate')?.hasError('required')) {\r
            <mat-error>\r
              Please select date\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
      </div>\r
      <div class="row m-b-25">\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Mobile</mat-label>\r
            <input matInput formControlName="mobile" type="number">\r
            <mat-icon class="material-icons-outlined color-icon p-3" matSuffix>phone</mat-icon>\r
            @if (advanceTableForm.get('mobile')?.hasError('required')) {\r
            <mat-error>\r
              Mobile is required\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
        <div class="col-sm-6">\r
          <mat-form-field class="example-full-width " appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Country</mat-label>\r
            <mat-select formControlName="country" required>\r
              <mat-option [value]="'india'">\r
                India\r
              </mat-option>\r
              <mat-option [value]="'usa'">\r
                USA\r
              </mat-option>\r
              <mat-option [value]="'france'">\r
                France\r
              </mat-option>\r
              <mat-option [value]="'germany'">\r
                Germany\r
              </mat-option>\r
              <mat-option [value]="'spain'">\r
                Spain\r
              </mat-option>\r
              <mat-option [value]="'turkey'">\r
                Turkey\r
              </mat-option>\r
              <mat-option [value]="'other'">\r
                Other\r
              </mat-option>\r
            </mat-select>\r
            @if (advanceTableForm.get('country')?.hasError('required')) {\r
            <mat-error>\r
              Country Name is required\r
            </mat-error>\r
            }\r
          </mat-form-field>\r
        </div>\r
      </div>\r
      <div class="row m-b-25">\r
        <div class="col-sm-12">\r
          <mat-form-field class="example-full-width" appearance="outline" subscriptSizing="dynamic">\r
            <mat-label>Address</mat-label>\r
            <textarea matInput formControlName="address"></textarea>\r
          </mat-form-field>\r
        </div>\r
      </div>\r
      <div class="row m-b-25">\r
        <div class="col-sm-12">\r
          <div class="example-button-row">\r
            <button mat-flat-button class="formSubmitBtn" [disabled]="!advanceTableForm.valid"\r
              type="submit">Save</button>\r
            <button mat-flat-button mat-dialog-close class="formCancelBtn" tabindex="-1">Cancel</button>\r
          </div>\r
        </div>\r
      </div>\r
    </form>\r
  </div>\r
</div>`, styles: ["/* src/app/advance-table/dialogs/form-dialog/form-dialog.component.scss */\n.hoverable {\n  position: relative;\n  display: block;\n  cursor: pointer;\n  height: 36px;\n  width: 36px;\n  border-radius: 50%;\n}\n.hoverable .hover-text {\n  position: absolute;\n  display: none;\n  top: 50%;\n  left: 50%;\n  font-size: 10px;\n  transform: translate(-50%, -50%);\n  z-index: 2;\n}\n.hoverable .background {\n  position: absolute;\n  display: none;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background-color: rgba(255, 255, 255, 0.5);\n  pointer-events: none;\n  border-radius: 50%;\n  z-index: 1;\n}\n.hoverable:hover .hover-text {\n  display: block;\n}\n.hoverable:hover .background {\n  display: block;\n}\n#tableFileInput {\n  display: none;\n}\n/*# sourceMappingURL=form-dialog.component.css.map */\n"] }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: AdvanceTableService }, { type: FormBuilder }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormDialogComponent, { className: "FormDialogComponent", filePath: "src/app/advance-table/dialogs/form-dialog/form-dialog.component.ts", lineNumber: 62 });
})();

// src/app/advance-table/dialogs/delete/delete.component.ts
var DeleteDialogComponent = class _DeleteDialogComponent {
  constructor(dialogRef, data, advanceTableService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.advanceTableService = advanceTableService;
  }
  confirmDelete() {
    this.advanceTableService.deleteAdvanceTable(this.data.id).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error("Delete Error:", error);
      }
    });
  }
  static {
    this.\u0275fac = function DeleteDialogComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DeleteDialogComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(AdvanceTableService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DeleteDialogComponent, selectors: [["app-delete"]], decls: 25, vars: 4, consts: [[1, "container"], ["mat-dialog-title", ""], ["mat-dialog-content", ""], [1, "delete-list"], [1, "font-weight-bold"], ["mat-dialog-actions", "", 1, "mb-1"], ["mat-flat-button", "", 1, "formCancelBtn", 3, "click"], ["mat-flat-button", "", "mat-dialog-close", "", "color", "accent", "tabindex", "-1"]], template: function DeleteDialogComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h3", 1);
        \u0275\u0275text(2, "Are you sure?");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "div", 2)(4, "ul", 3)(5, "li")(6, "p")(7, "span", 4);
        \u0275\u0275text(8, " Name: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "li")(11, "p")(12, "span", 4);
        \u0275\u0275text(13, " Email: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(14);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(15, "li")(16, "p")(17, "span", 4);
        \u0275\u0275text(18, "Mobile: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(19);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(20, "div", 5)(21, "button", 6);
        \u0275\u0275listener("click", function DeleteDialogComponent_Template_button_click_21_listener() {
          return ctx.confirmDelete();
        });
        \u0275\u0275text(22, " Delete ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "button", 7);
        \u0275\u0275text(24, "Cancel");
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(9);
        \u0275\u0275textInterpolate2("", ctx.data.firstName, " ", ctx.data.lastName, "");
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.data.email);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.data.mobile, " ");
      }
    }, dependencies: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatButtonModule,
      MatButton
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeleteDialogComponent, [{
    type: Component,
    args: [{ selector: "app-delete", imports: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatButtonModule
    ], template: '<div class="container">\r\n  <h3 mat-dialog-title>Are you sure?</h3>\r\n  <div mat-dialog-content>\r\n    <ul class="delete-list">\r\n      <li>\r\n        <p><span class="font-weight-bold"> Name: </span>{{data.firstName}} {{data.lastName}}</p>\r\n      </li>\r\n      <li>\r\n        <p><span class="font-weight-bold"> Email: </span>{{ data.email }}</p>\r\n      </li>\r\n      <li>\r\n        <p>\r\n          <span class="font-weight-bold">Mobile: </span>{{data.mobile}}\r\n        </p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n  <div mat-dialog-actions class="mb-1">\r\n    <button mat-flat-button class="formCancelBtn" (click)="confirmDelete()">\r\n      Delete\r\n    </button>\r\n    <button mat-flat-button mat-dialog-close color="accent" tabindex="-1">Cancel</button>\r\n  </div>\r\n</div>' }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: AdvanceTableService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DeleteDialogComponent, { className: "DeleteDialogComponent", filePath: "src/app/advance-table/dialogs/delete/delete.component.ts", lineNumber: 31 });
})();

// src/app/advance-table/advance-table.component.ts
var _c0 = ["filter"];
var _c1 = () => ["Home"];
var _c2 = () => [5, 10, 25, 100];
function AdvanceTableComponent_For_91_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "mat-option")(2, "mat-checkbox", 56);
    \u0275\u0275listener("click", function AdvanceTableComponent_For_91_Template_mat_checkbox_click_2_listener($event) {
      \u0275\u0275restoreView(_r4);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275twoWayListener("ngModelChange", function AdvanceTableComponent_For_91_Template_mat_checkbox_ngModelChange_2_listener($event) {
      const cd_r5 = \u0275\u0275restoreView(_r4).$implicit;
      \u0275\u0275twoWayBindingSet(cd_r5.visible, $event) || (cd_r5.visible = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const cd_r5 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", cd_r5.visible);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", cd_r5.label, " ");
  }
}
function AdvanceTableComponent_mat_header_cell_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-header-cell")(1, "mat-checkbox", 57);
    \u0275\u0275listener("change", function AdvanceTableComponent_mat_header_cell_116_Template_mat_checkbox_change_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView($event ? ctx_r6.masterToggle() : null);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r6.selection.hasValue() && ctx_r6.isAllSelected())("indeterminate", ctx_r6.selection.hasValue() && !ctx_r6.isAllSelected())("ngClass", "tbl-checkbox");
  }
}
function AdvanceTableComponent_mat_cell_117_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell")(1, "mat-checkbox", 58);
    \u0275\u0275listener("click", function AdvanceTableComponent_mat_cell_117_Template_mat_checkbox_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    })("change", function AdvanceTableComponent_mat_cell_117_Template_mat_checkbox_change_1_listener($event) {
      const row_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView($event ? ctx_r6.selection.toggle(row_r9) : null);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r9 = ctx.$implicit;
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r6.selection.isSelected(row_r9))("ngClass", "tbl-checkbox");
  }
}
function AdvanceTableComponent_For_119_Conditional_0_Template(rf, ctx) {
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 64);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r12));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "img", 66);
    \u0275\u0275elementStart(4, "span", 63);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r12 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275property("matTooltip", row_r12.firstName + " " + row_r12.lastName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance();
    \u0275\u0275property("src", row_r12.img, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", row_r12.firstName, " ", row_r12.lastName, " ");
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 5, "mat-cell", 61);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 68);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r14));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 63);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r14 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(5, 2, row_r14[column_r10.def], "MM/dd/yyyy"), " ");
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 5, "mat-cell", 67);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 64);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r16));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 69);
    \u0275\u0275text(4, "call");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 63);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r16 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275property("matTooltip", row_r16[column_r10.def]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", row_r16[column_r10.def], "");
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 61);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 64);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r18));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 70);
    \u0275\u0275text(4, "mail");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 63);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r18 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275property("matTooltip", row_r18[column_r10.def]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", row_r18[column_r10.def], "");
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 61);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 64);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r20));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 71);
    \u0275\u0275text(4, "place");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 63);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r20 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275property("matTooltip", row_r20[column_r10.def]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", row_r20[column_r10.def], "");
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 61);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 72);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r22.gender);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 73);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r22.gender);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 68);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r22));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div");
    \u0275\u0275template(4, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_4_Template, 3, 1, "div")(5, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_5_Template, 3, 1, "div");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_25_0;
    const row_r22 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_25_0 = row_r22.gender) === "Male" ? 4 : tmp_25_0 === "Female" ? 5 : -1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 2, "mat-cell", 67);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 62)(1, "span", 63);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 68);
    \u0275\u0275listener("contextmenu", function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r24));
    });
    \u0275\u0275elementStart(1, "span", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 63);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r24 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r24[column_r10.def]);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 59);
    \u0275\u0275template(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 60)(2, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template, 5, 2, "mat-cell", 67);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 3, 1, "ng-container", 59);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275conditional(column_r10.def === "gender" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275conditional(column_r10.type === "address" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275conditional(column_r10.type === "email" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275conditional(column_r10.type === "phone" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275conditional(column_r10.type === "date" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 59)(1, AdvanceTableComponent_For_119_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(column_r10.def === "firstName" ? 0 : 1);
  }
}
function AdvanceTableComponent_For_119_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, AdvanceTableComponent_For_119_Conditional_0_Template, 0, 0)(1, AdvanceTableComponent_For_119_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = ctx.$implicit;
    \u0275\u0275conditional(column_r10.type === "check" || column_r10.type === "actionBtn" ? 0 : 1);
  }
}
function AdvanceTableComponent_mat_header_cell_121_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 74);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function AdvanceTableComponent_mat_cell_122_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 74)(1, "button", 75);
    \u0275\u0275listener("click", function AdvanceTableComponent_mat_cell_122_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r25);
      return \u0275\u0275resetView($event.stopPropagation());
    })("click", function AdvanceTableComponent_mat_cell_122_Template_button_click_1_listener() {
      const row_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.editCall(row_r26));
    });
    \u0275\u0275element(2, "app-feather-icons", 76);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 75);
    \u0275\u0275listener("click", function AdvanceTableComponent_mat_cell_122_Template_button_click_3_listener($event) {
      \u0275\u0275restoreView(_r25);
      return \u0275\u0275resetView($event.stopPropagation());
    })("click", function AdvanceTableComponent_mat_cell_122_Template_button_click_3_listener() {
      const row_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.deleteItem(row_r26));
    });
    \u0275\u0275element(4, "app-feather-icons", 76);
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
function AdvanceTableComponent_mat_header_row_123_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function AdvanceTableComponent_mat_row_124_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-row", 77);
    \u0275\u0275listener("click", function AdvanceTableComponent_mat_row_124_Template_mat_row_click_0_listener() {
      const row_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.editCall(row_r28));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275styleProp("cursor", "pointer");
    \u0275\u0275property("@rowsAnimation", void 0);
  }
}
function AdvanceTableComponent_Conditional_125_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275element(1, "mat-progress-spinner", 78);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("diameter", 40);
  }
}
function AdvanceTableComponent_ng_template_129_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 79);
    \u0275\u0275listener("click", function AdvanceTableComponent_ng_template_129_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.addNew());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "add_box");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Add Record");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 79);
    \u0275\u0275listener("click", function AdvanceTableComponent_ng_template_129_Template_button_click_5_listener() {
      const item_r30 = \u0275\u0275restoreView(_r29).item;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.editCall(item_r30));
    });
    \u0275\u0275elementStart(6, "mat-icon");
    \u0275\u0275text(7, "create");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9, "Edit Record");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "button", 79);
    \u0275\u0275listener("click", function AdvanceTableComponent_ng_template_129_Template_button_click_10_listener() {
      const item_r30 = \u0275\u0275restoreView(_r29).item;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.deleteItem(item_r30));
    });
    \u0275\u0275elementStart(11, "mat-icon");
    \u0275\u0275text(12, "delete");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275text(14, "Delete Record");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 79);
    \u0275\u0275listener("click", function AdvanceTableComponent_ng_template_129_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r29);
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.refresh());
    });
    \u0275\u0275elementStart(16, "mat-icon");
    \u0275\u0275text(17, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19, "Refresh Record");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 80)(21, "mat-icon");
    \u0275\u0275text(22, "no_encryption");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Disable");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "button", 81)(26, "mat-icon");
    \u0275\u0275text(27, "list_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29, " Nested Menu");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const nestedmenu_r31 = \u0275\u0275reference(131);
    \u0275\u0275advance(25);
    \u0275\u0275property("matMenuTriggerFor", nestedmenu_r31);
  }
}
function AdvanceTableComponent_Conditional_147_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 82);
    \u0275\u0275text(1, " No results ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("display", ctx_r6.dataSource.data.length === 0 ? "" : "none");
  }
}
var AdvanceTableComponent = class _AdvanceTableComponent {
  constructor(httpClient, dialog, advanceTableService, snackBar) {
    this.httpClient = httpClient;
    this.dialog = dialog;
    this.advanceTableService = advanceTableService;
    this.snackBar = snackBar;
    this.columnDefinitions = [
      { def: "select", label: "Checkbox", type: "check", visible: true },
      { def: "firstName", label: "First Name", type: "text", visible: true },
      { def: "email", label: "Email", type: "email", visible: true },
      { def: "gender", label: "Gender", type: "text", visible: true },
      { def: "birthDate", label: "Birth Date", type: "date", visible: true },
      { def: "mobile", label: "Mobile", type: "phone", visible: true },
      { def: "address", label: "Address", type: "address", visible: true },
      { def: "country", label: "Country", type: "text", visible: true },
      { def: "actions", label: "Actions", type: "actionBtn", visible: true }
    ];
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel(true, []);
    this.contextMenuPosition = { x: "0px", y: "0px" };
    this.isLoading = true;
    this.destroy$ = new Subject();
    this.breadscrums = [
      {
        title: "Table",
        items: ["Home"],
        active: "Table"
      }
    ];
  }
  ngOnInit() {
    this.loadData();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  refresh() {
    this.loadData();
  }
  getDisplayedColumns() {
    return this.columnDefinitions.filter((cd) => cd.visible).map((cd) => cd.def);
  }
  addNew() {
    this.openDialog("add");
  }
  editCall(row) {
    this.openDialog("edit", row);
  }
  openDialog(action, data) {
    let varDirection;
    if (localStorage.getItem("isRtl") === "true") {
      varDirection = "rtl";
    } else {
      varDirection = "ltr";
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: "60vw",
      maxWidth: "100vw",
      data: { advanceTable: data, action },
      direction: varDirection,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (action === "add") {
          this.dataSource.data = [result, ...this.dataSource.data];
        } else {
          this.updateRecord(result);
        }
        this.refreshTable();
        this.showNotification(action === "add" ? "snackbar-success" : "black", `${action === "add" ? "Add" : "Edit"} Record Successfully...!!!`, "bottom", "center");
      }
    });
  }
  updateRecord(updatedRecord) {
    const index = this.dataSource.data.findIndex((record) => record.id === updatedRecord.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedRecord;
      this.dataSource._updateChangeSubscription();
    }
  }
  deleteItem(row) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter((record) => record.id !== row.id);
        this.refreshTable();
        this.showNotification("snackbar-danger", "Delete Record Successfully...!!!", "bottom", "center");
      }
    });
  }
  refreshTable() {
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.dataSource.data = this.dataSource.data.filter((item) => !this.selection.selected.includes(item));
    this.selection.clear();
    this.showNotification("snackbar-danger", `${totalSelect} Record(s) Deleted Successfully...!!!`, "bottom", "center");
  }
  loadData() {
    this.isLoading = true;
    this.advanceTableService.getAllAdvanceTables().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.refreshTable();
        this.dataSource.filterPredicate = (data2, filter) => Object.values(data2).some((value) => value.toString().toLowerCase().includes(filter));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2e3,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => ({
      "First Name": x.firstName,
      Email: x.email,
      Gender: x.gender,
      "Birth Date": formatDate(new Date(x.birthDate), "yyyy-MM-dd", "en") || "",
      Mobile: x.mobile,
      Address: x.address,
      Country: x.country
    }));
    TableExportUtil.exportToExcel(exportData, "excel");
  }
  onContextMenu(event, item) {
    event.preventDefault();
    this.contextMenuPosition = {
      x: `${event.clientX}px`,
      y: `${event.clientY}px`
    };
    if (this.contextMenu) {
      this.contextMenu.menuData = { item };
      this.contextMenu.menu?.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    }
  }
  static {
    this.\u0275fac = function AdvanceTableComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _AdvanceTableComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(AdvanceTableService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdvanceTableComponent, selectors: [["app-advance-table"]], viewQuery: function AdvanceTableComponent_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatPaginator, 5);
        \u0275\u0275viewQuery(MatSort, 5);
        \u0275\u0275viewQuery(_c0, 5);
        \u0275\u0275viewQuery(MatMenuTrigger, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.paginator = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.sort = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.filter = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contextMenu = _t.first);
      }
    }, features: [\u0275\u0275ProvidersFeature([{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }])], decls: 150, vars: 22, consts: [["filter", ""], ["select", ""], ["contextMenu", "matMenu"], ["nestedmenu", "matMenu"], ["paginator", ""], [1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "alert", "alert-info"], [1, "fa-ul"], [1, "font-15"], [1, "fa-li"], [1, "fas", "fa-angle-double-right"], [1, "row"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "materialTableHeader"], [1, "left"], [1, "header-buttons-left", "ms-0"], [1, "tbl-title"], [1, "tbl-search-box"], ["for", "search-input"], [1, "material-icons", "search-icon"], ["id", "search-input", "placeholder", "Search", "type", "text", "aria-label", "Search box", 1, "browser-default", "search-field", 3, "keyup"], [1, "right"], [1, "tbl-export-btn"], [1, "tbl-header-btn"], [1, "m-l-10"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Show/Hide Column", 3, "click"], [1, "column-filter", 2, "width", "200px", "display", "table", 3, "ngModelChange", "ngModel"], [1, "table-column-label"], ["mat-icon-button", "", "matTooltip", "Add", 1, "col-green", 3, "click"], ["mat-icon-button", "", "matTooltip", "Refresh", 3, "click"], [1, "m-l-10", 3, "hidden"], ["mat-icon-button", "", "matTooltip", "Delete", 1, "col-red", 3, "click", "hidden"], [1, "export-button", "m-l-10"], ["mat-icon-button", "", "matTooltip", "Xlsx Download", 1, "col-blue", 3, "click"], [1, "material-icons-outlined"], [1, "body", "overflow-auto"], [1, "responsive_table"], ["mat-table", "", "matSort", "", 1, "mat-cell", "advance-table", 3, "dataSource"], ["matColumnDef", "select"], [4, "matHeaderCellDef"], [4, "matCellDef"], ["matColumnDef", "actions"], ["class", "pr-0", 4, "matHeaderCellDef"], ["class", "pr-0", 4, "matCellDef"], [4, "matHeaderRowDef"], ["matRipple", "", 3, "cursor", "click", 4, "matRowDef", "matRowDefColumns"], [1, "tbl-spinner"], [2, "visibility", "hidden", "position", "fixed", 3, "matMenuTriggerFor"], ["matMenuContent", ""], ["mat-menu-item", ""], [1, "no-results", 3, "display"], [3, "length", "pageIndex", "pageSize", "pageSizeOptions"], ["color", "primary", 3, "click", "ngModelChange", "ngModel"], ["color", "primary", 3, "change", "checked", "indeterminate", "ngClass"], ["color", "primary", 3, "click", "change", "checked", "ngClass"], [3, "matColumnDef"], ["mat-sort-header", "", 4, "matHeaderCellDef"], [3, "matTooltip", "contextmenu", 4, "matCellDef"], ["mat-sort-header", ""], [1, "truncate-text"], [3, "contextmenu", "matTooltip"], [1, "mobile-label"], ["alt", "image", 1, "table-img", 3, "src"], [3, "contextmenu", 4, "matCellDef"], [3, "contextmenu"], [1, "tbl-icon", "material-icons-outlined", "col-green"], [1, "tbl-icon", "material-icons-outlined", "col-red"], [1, "tbl-icon", "material-icons-outlined", "col-blue"], [1, "badge", "badge-solid-green"], [1, "badge", "badge-solid-purple"], [1, "pr-0"], ["mat-icon-button", "", "color", "accent", 1, "tbl-action-btn", 3, "click"], [3, "icon"], ["matRipple", "", 3, "click"], ["color", "primary", "mode", "indeterminate", 3, "diameter"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", "disabled", ""], ["mat-menu-item", "", 3, "matMenuTriggerFor"], [1, "no-results"]], template: function AdvanceTableComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "section", 5)(1, "div", 6)(2, "div", 7);
        \u0275\u0275element(3, "app-breadcrumb", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 9);
        \u0275\u0275text(5, " Advance table component is develop using ");
        \u0275\u0275elementStart(6, "strong");
        \u0275\u0275text(7, "Angular Material Table");
        \u0275\u0275elementEnd();
        \u0275\u0275text(8, ". Main features are:");
        \u0275\u0275element(9, "br")(10, "br");
        \u0275\u0275elementStart(11, "ul", 10)(12, "li", 11)(13, "span", 12);
        \u0275\u0275element(14, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(15, "Searching Records In Table ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "li", 11)(17, "span", 12);
        \u0275\u0275element(18, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(19, "Sorting Records In Table ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "li", 11)(21, "span", 12);
        \u0275\u0275element(22, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(23, "Add, Update, Delete In Table Record ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "li", 11)(25, "span", 12);
        \u0275\u0275element(26, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(27, "Row Click Edit Table Record ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "li", 11)(29, "span", 12);
        \u0275\u0275element(30, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(31, "Context Menu, And Nested Context Menu ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "li", 11)(33, "span", 12);
        \u0275\u0275element(34, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(35, "Crud Operations Using Context Menu ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "li", 11)(37, "span", 12);
        \u0275\u0275element(38, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(39, "Show/Hide table column ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(40, "li", 11)(41, "span", 12);
        \u0275\u0275element(42, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(43, "Export table data in xlsx format.");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "li", 11)(45, "span", 12);
        \u0275\u0275element(46, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(47, "Multi select row using checkbox ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(48, "li", 11)(49, "span", 12);
        \u0275\u0275element(50, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(51, "Multiple delete rows using checkbox ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(52, "li", 11)(53, "span", 12);
        \u0275\u0275element(54, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(55, "Refresh Table Data");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(56, "li", 11)(57, "span", 12);
        \u0275\u0275element(58, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(59, "Pagination Supported");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(60, "li", 11)(61, "span", 12);
        \u0275\u0275element(62, "i", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275text(63, "Row Per Page Options");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(64, "div", 14)(65, "div", 15)(66, "div", 16)(67, "div", 17)(68, "div", 18)(69, "ul", 19)(70, "li", 20)(71, "h2");
        \u0275\u0275text(72, "Table Name");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(73, "li", 21)(74, "label", 22)(75, "i", 23);
        \u0275\u0275text(76, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(77, "input", 24, 0);
        \u0275\u0275listener("keyup", function AdvanceTableComponent_Template_input_keyup_77_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.applyFilter($event));
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(79, "div", 25)(80, "ul", 26)(81, "li", 27)(82, "div", 28)(83, "button", 29);
        \u0275\u0275listener("click", function AdvanceTableComponent_Template_button_click_83_listener() {
          \u0275\u0275restoreView(_r1);
          const select_r2 = \u0275\u0275reference(87);
          return \u0275\u0275resetView(select_r2.open());
        });
        \u0275\u0275elementStart(84, "mat-icon");
        \u0275\u0275text(85, "filter_list");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(86, "mat-select", 30, 1);
        \u0275\u0275twoWayListener("ngModelChange", function AdvanceTableComponent_Template_mat_select_ngModelChange_86_listener($event) {
          \u0275\u0275restoreView(_r1);
          const filter_r3 = \u0275\u0275reference(78);
          \u0275\u0275twoWayBindingSet(filter_r3.value, $event) || (filter_r3.value = $event);
          return \u0275\u0275resetView($event);
        });
        \u0275\u0275elementStart(88, "span", 31);
        \u0275\u0275text(89, "Show/Hide Column");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(90, AdvanceTableComponent_For_91_Template, 4, 2, "div", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(92, "li", 27)(93, "div", 28)(94, "button", 32);
        \u0275\u0275listener("click", function AdvanceTableComponent_Template_button_click_94_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.addNew());
        });
        \u0275\u0275elementStart(95, "mat-icon");
        \u0275\u0275text(96, "add_circle_outline");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(97, "li", 27)(98, "div", 28)(99, "button", 33);
        \u0275\u0275listener("click", function AdvanceTableComponent_Template_button_click_99_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.refresh());
        });
        \u0275\u0275elementStart(100, "mat-icon");
        \u0275\u0275text(101, "refresh");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(102, "li", 27)(103, "div", 34)(104, "button", 35);
        \u0275\u0275listener("click", function AdvanceTableComponent_Template_button_click_104_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.removeSelectedRows());
        });
        \u0275\u0275elementStart(105, "mat-icon");
        \u0275\u0275text(106, "delete_outline");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(107, "li")(108, "div", 36)(109, "button", 37);
        \u0275\u0275listener("click", function AdvanceTableComponent_Template_button_click_109_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.exportExcel());
        });
        \u0275\u0275elementStart(110, "mat-icon", 38);
        \u0275\u0275text(111, "file_download");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(112, "div", 39)(113, "div", 40)(114, "table", 41);
        \u0275\u0275elementContainerStart(115, 42);
        \u0275\u0275template(116, AdvanceTableComponent_mat_header_cell_116_Template, 2, 3, "mat-header-cell", 43)(117, AdvanceTableComponent_mat_cell_117_Template, 2, 2, "mat-cell", 44);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275repeaterCreate(118, AdvanceTableComponent_For_119_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementContainerStart(120, 45);
        \u0275\u0275template(121, AdvanceTableComponent_mat_header_cell_121_Template, 2, 0, "mat-header-cell", 46)(122, AdvanceTableComponent_mat_cell_122_Template, 5, 6, "mat-cell", 47);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(123, AdvanceTableComponent_mat_header_row_123_Template, 1, 0, "mat-header-row", 48)(124, AdvanceTableComponent_mat_row_124_Template, 1, 3, "mat-row", 49);
        \u0275\u0275elementEnd()();
        \u0275\u0275template(125, AdvanceTableComponent_Conditional_125_Template, 2, 1, "div", 50);
        \u0275\u0275element(126, "div", 51);
        \u0275\u0275elementStart(127, "mat-menu", null, 2);
        \u0275\u0275template(129, AdvanceTableComponent_ng_template_129_Template, 30, 1, "ng-template", 52);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(130, "mat-menu", null, 3)(132, "button", 53)(133, "mat-icon");
        \u0275\u0275text(134, "mail_outline");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(135, "span");
        \u0275\u0275text(136, "Item 1");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(137, "button", 53)(138, "mat-icon");
        \u0275\u0275text(139, "call");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(140, "span");
        \u0275\u0275text(141, "Item 2");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(142, "button", 53)(143, "mat-icon");
        \u0275\u0275text(144, "chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(145, "span");
        \u0275\u0275text(146, "Item 3");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(147, AdvanceTableComponent_Conditional_147_Template, 2, 2, "div", 54);
        \u0275\u0275element(148, "mat-paginator", 55, 4);
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        const filter_r3 = \u0275\u0275reference(78);
        const contextMenu_r32 = \u0275\u0275reference(128);
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Table")("items", \u0275\u0275pureFunction0(20, _c1))("active_item", "Table");
        \u0275\u0275advance(83);
        \u0275\u0275twoWayProperty("ngModel", filter_r3.value);
        \u0275\u0275advance(4);
        \u0275\u0275repeater(ctx.columnDefinitions);
        \u0275\u0275advance(13);
        \u0275\u0275property("hidden", !ctx.selection.hasValue());
        \u0275\u0275advance();
        \u0275\u0275property("hidden", !ctx.selection.hasValue());
        \u0275\u0275advance(10);
        \u0275\u0275property("dataSource", ctx.dataSource);
        \u0275\u0275advance(4);
        \u0275\u0275repeater(ctx.columnDefinitions);
        \u0275\u0275advance(5);
        \u0275\u0275property("matHeaderRowDef", ctx.getDisplayedColumns());
        \u0275\u0275advance();
        \u0275\u0275property("matRowDefColumns", ctx.getDisplayedColumns());
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.isLoading ? 125 : -1);
        \u0275\u0275advance();
        \u0275\u0275styleProp("left", ctx.contextMenuPosition.x)("top", ctx.contextMenuPosition.y);
        \u0275\u0275property("matMenuTriggerFor", contextMenu_r32);
        \u0275\u0275advance(21);
        \u0275\u0275conditional(ctx.isLoading ? 147 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("length", ctx.dataSource.filteredData.length)("pageIndex", 0)("pageSize", 10)("pageSizeOptions", \u0275\u0275pureFunction0(21, _c2));
      }
    }, dependencies: [
      BreadcrumbComponent,
      FeatherIconsComponent,
      CommonModule,
      NgClass,
      DatePipe,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatIcon,
      MatButtonModule,
      MatIconButton,
      MatTooltipModule,
      MatTooltip,
      MatSelectModule,
      MatSelect,
      MatOption,
      ReactiveFormsModule,
      NgControlStatus,
      FormsModule,
      NgModel,
      MatOptionModule,
      MatCheckboxModule,
      MatCheckbox,
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
      MatSortModule,
      MatSort,
      MatSortHeader,
      MatRippleModule,
      MatRipple,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuContent,
      MatMenuTrigger,
      MatPaginatorModule,
      MatPaginator
    ], styles: ["\n\n[_nghost-%COMP%]     .column-filter .mat-mdc-select-arrow {\n  display: none;\n}\n[_nghost-%COMP%]     .advance-table .mat-mdc-header-cell {\n  font-weight: 500;\n}\n/*# sourceMappingURL=advance-table.component.css.map */"], data: { animation: [rowsAnimation] } });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdvanceTableComponent, [{
    type: Component,
    args: [{ selector: "app-advance-table", providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }], animations: [rowsAnimation], imports: [
      BreadcrumbComponent,
      FeatherIconsComponent,
      CommonModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatButtonModule,
      MatTooltipModule,
      MatSelectModule,
      ReactiveFormsModule,
      FormsModule,
      MatOptionModule,
      MatCheckboxModule,
      MatTableModule,
      MatSortModule,
      NgClass,
      MatRippleModule,
      MatProgressSpinnerModule,
      MatMenuModule,
      MatPaginatorModule,
      DatePipe
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Table'" [items]="['Home']" [active_item]="'Table'"></app-breadcrumb>\r
    </div>\r
    <div class="alert alert-info">\r
      Advance table component is develop using <strong>Angular Material Table</strong>. Main\r
      features are:<br><br>\r
      <ul class="fa-ul">\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Searching\r
          Records In Table\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Sorting Records\r
          In Table\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Add, Update,\r
          Delete In Table Record\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Row Click Edit\r
          Table Record\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Context Menu,\r
          And Nested Context Menu\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Crud Operations\r
          Using Context Menu </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Show/Hide table column\r
        </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Export table data in\r
          xlsx format.</li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Multi select row\r
          using checkbox </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Multiple delete\r
          rows using checkbox </li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Refresh Table\r
          Data</li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Pagination\r
          Supported</li>\r
        <li class="font-15"><span class="fa-li"><i class="fas fa-angle-double-right"></i></span>Row Per Page\r
          Options</li>\r
      </ul>\r
    </div>\r
    <div class="row">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="materialTableHeader">\r
            <div class="left">\r
              <ul class="header-buttons-left ms-0">\r
                <li class="tbl-title">\r
                  <h2>Table Name</h2>\r
                </li>\r
                <li class="tbl-search-box">\r
                  <label for="search-input"><i class="material-icons search-icon">search</i></label>\r
                  <input id="search-input" placeholder="Search" type="text" #filter (keyup)="applyFilter($event)"\r
                    class="browser-default search-field" aria-label="Search box">\r
                </li>\r
              </ul>\r
            </div>\r
            <div class="right">\r
              <ul class="tbl-export-btn">\r
                <li class="tbl-header-btn">\r
                  <div class="m-l-10">\r
                    <button mat-icon-button color="primary" (click)="select.open()" matTooltip="Show/Hide Column">\r
                      <mat-icon>filter_list</mat-icon>\r
                      <mat-select #select [(ngModel)]="filter.value" style="width: 200px; display: table;"\r
                        class="column-filter">\r
                        <span class="table-column-label">Show/Hide Column</span>\r
                        @for (cd of columnDefinitions; track cd; let i = $index) {\r
                        <div>\r
                          <mat-option>\r
                            <mat-checkbox (click)="$event.stopPropagation()" [(ngModel)]="cd.visible" color="primary">\r
                              {{cd.label}}\r
                            </mat-checkbox>\r
                          </mat-option>\r
                        </div>\r
                        }\r
                      </mat-select>\r
                    </button>\r
                  </div>\r
                </li>\r
                <li class="tbl-header-btn">\r
                  <div class="m-l-10">\r
                    <button mat-icon-button (click)="addNew()" class="col-green" matTooltip="Add">\r
                      <mat-icon>add_circle_outline</mat-icon>\r
                    </button>\r
                  </div>\r
                </li>\r
                <li class="tbl-header-btn">\r
                  <div class="m-l-10">\r
                    <button mat-icon-button (click)="refresh()" matTooltip="Refresh">\r
                      <mat-icon>refresh</mat-icon>\r
                    </button>\r
                  </div>\r
                </li>\r
                <li class="tbl-header-btn">\r
                  <div class="m-l-10" [hidden]=!selection.hasValue()>\r
                    <button mat-icon-button [hidden]=!selection.hasValue() (click)="removeSelectedRows()"\r
                      class="col-red" matTooltip="Delete">\r
                      <mat-icon>delete_outline</mat-icon>\r
                    </button>\r
                  </div>\r
                </li>\r
                <li>\r
                  <div class="export-button m-l-10">\r
                    <button mat-icon-button (click)="exportExcel()" class="col-blue" matTooltip="Xlsx Download">\r
                      <mat-icon class="material-icons-outlined">file_download</mat-icon>\r
                    </button>\r
                  </div>\r
                </li>\r
              </ul>\r
            </div>\r
          </div>\r
          <div class="body overflow-auto">\r
            <div class="responsive_table">\r
              <table mat-table [dataSource]="dataSource" matSort class="mat-cell advance-table">\r
                <!-- Checkbox Column -->\r
                <ng-container matColumnDef="select">\r
                  <mat-header-cell *matHeaderCellDef>\r
                    <mat-checkbox (change)="$event ? masterToggle() : null"\r
                      [checked]="selection.hasValue() && isAllSelected()" color="primary"\r
                      [indeterminate]="selection.hasValue() && !isAllSelected()" [ngClass]="'tbl-checkbox'">\r
                    </mat-checkbox>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row">\r
                    <mat-checkbox (click)="$event.stopPropagation()" (change)="$event ? selection.toggle(row) : null"\r
                      [checked]="selection.isSelected(row)" [ngClass]="'tbl-checkbox'" color="primary">\r
                    </mat-checkbox>\r
                  </mat-cell>\r
                </ng-container>\r
\r
\r
                @for (column of columnDefinitions; track column) {\r
                <!-- Skip rendering if column.label is "select" or "action" -->\r
                @if (column.type === 'check' || column.type === 'actionBtn') {\r
                <!-- Skip this column -->\r
                } @else {\r
                @if (column.def === 'firstName') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)"\r
                    [matTooltip]="row.firstName + ' ' + row.lastName">\r
                    <span class="mobile-label">{{ column.label }}:</span>\r
                    <img [src]="row.img" class="table-img" alt="image" />\r
                    <span class="truncate-text">\r
                      {{ row.firstName }} {{ row.lastName }}\r
                    </span>\r
                  </mat-cell>\r
                </ng-container>\r
                } @else {\r
                @if (column.type === 'date') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)">\r
                    <span class="mobile-label">{{ column.label }}:</span>\r
                    <span class="truncate-text">\r
                      {{ row[column.def] | date: 'MM/dd/yyyy' }}\r
                    </span>\r
                  </mat-cell>\r
                </ng-container>\r
                } @else {\r
                @if (column.type === 'phone') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)"\r
                    [matTooltip]="row[column.def]">\r
                    <span class="mobile-label">{{ column.label }}:</span> <mat-icon\r
                      class="tbl-icon material-icons-outlined col-green">call</mat-icon><span class="truncate-text">\r
                      {{ row[column.def] }}</span></mat-cell>\r
                </ng-container>\r
                } @else {\r
                @if (column.type === 'email') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)"\r
                    [matTooltip]="row[column.def]">\r
                    <span class="mobile-label">{{ column.label }}:</span> <mat-icon\r
                      class="tbl-icon material-icons-outlined col-red">mail</mat-icon><span class="truncate-text">\r
                      {{ row[column.def] }}</span></mat-cell>\r
                </ng-container>\r
                } @else {\r
                @if (column.type === 'address') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)"\r
                    [matTooltip]="row[column.def]">\r
                    <span class="mobile-label">{{ column.label }}:</span> <mat-icon\r
                      class="tbl-icon material-icons-outlined col-blue">place</mat-icon><span class="truncate-text">\r
                      {{ row[column.def] }}</span></mat-cell>\r
                </ng-container>\r
                } @else {\r
                @if (column.def === 'gender') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header> <span class="truncate-text">{{ column.label\r
                      }}</span></mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)">\r
                    <span class="mobile-label">{{ column.label }}:</span>\r
                    <div>\r
                      @switch (row.gender) {\r
                      @case ('Male') {\r
                      <div>\r
                        <span class="badge badge-solid-green">{{ row.gender }}</span>\r
                      </div>\r
                      }\r
                      @case ('Female') {\r
                      <div>\r
                        <span class="badge badge-solid-purple">{{ row.gender }}</span>\r
                      </div>\r
                      }\r
                      }\r
                    </div>\r
                  </mat-cell>\r
                </ng-container>\r
                } @else {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)">\r
                    <span class="mobile-label">{{ column.label }}:</span>\r
                    <span class="truncate-text">{{ row[column.def] }}</span>\r
                  </mat-cell>\r
                </ng-container>\r
                }\r
                }\r
                }\r
                }\r
                }\r
                }\r
                }\r
                <!-- For User with image -->\r
                <!-- For Date Columns -->\r
                <!-- For Mobile Columns -->\r
                <!-- For Email Columns -->\r
                <!-- For Address Columns -->\r
                <!-- For Gender Column -->\r
                <!-- Rest all columns -->\r
                }\r
\r
                <!-- actions -->\r
                <ng-container matColumnDef="actions">\r
                  <mat-header-cell class="pr-0" *matHeaderCellDef>Actions</mat-header-cell>\r
                  <mat-cell *matCellDef="let row; let i=index;" class="pr-0">\r
                    <button mat-icon-button color="accent" (click)="$event.stopPropagation()" (click)="editCall(row)"\r
                      class="tbl-action-btn">\r
                      <app-feather-icons [icon]="'edit'" [class]="'tbl-fav-edit'"></app-feather-icons>\r
                    </button>\r
                    <button mat-icon-button color="accent" (click)="$event.stopPropagation()" (click)="deleteItem(row)"\r
                      class="tbl-action-btn">\r
                      <app-feather-icons [icon]="'trash-2'" [class]="'tbl-fav-delete'"></app-feather-icons>\r
                    </button>\r
                  </mat-cell>\r
                </ng-container>\r
                <mat-header-row *matHeaderRowDef="getDisplayedColumns()"></mat-header-row>\r
                <mat-row [@rowsAnimation]="" *matRowDef="let row; columns: getDisplayedColumns();"\r
                  (click)="editCall(row)" [style.cursor]="'pointer'" matRipple>\r
                </mat-row>\r
              </table>\r
            </div>\r
            <!-- Loading spinner -->\r
            @if (isLoading) {\r
            <div class="tbl-spinner">\r
              <mat-progress-spinner color="primary" [diameter]="40" mode="indeterminate">\r
              </mat-progress-spinner>\r
            </div>\r
            }\r
            <!-- context menu start -->\r
            <div style="visibility: hidden; position: fixed" [style.left]="contextMenuPosition.x"\r
              [style.top]="contextMenuPosition.y" [matMenuTriggerFor]="contextMenu">\r
            </div>\r
            <mat-menu #contextMenu="matMenu">\r
              <ng-template matMenuContent let-item="item">\r
                <button mat-menu-item (click)="addNew()">\r
                  <mat-icon>add_box</mat-icon>\r
                  <span>Add Record</span>\r
                </button>\r
                <button mat-menu-item (click)="editCall(item)">\r
                  <mat-icon>create</mat-icon>\r
                  <span>Edit Record</span>\r
                </button>\r
                <button mat-menu-item (click)="deleteItem(item)">\r
                  <mat-icon>delete</mat-icon>\r
                  <span>Delete Record</span>\r
                </button>\r
                <button mat-menu-item (click)="refresh()">\r
                  <mat-icon>refresh</mat-icon>\r
                  <span>Refresh Record</span>\r
                </button>\r
                <button mat-menu-item disabled>\r
                  <mat-icon>no_encryption</mat-icon>\r
                  <span>Disable</span>\r
                </button>\r
                <button mat-menu-item [matMenuTriggerFor]="nestedmenu">\r
                  <mat-icon>list_alt</mat-icon>\r
                  <span> Nested Menu</span>\r
                </button>\r
              </ng-template>\r
            </mat-menu>\r
            <mat-menu #nestedmenu="matMenu">\r
              <button mat-menu-item>\r
                <mat-icon>mail_outline</mat-icon>\r
                <span>Item 1</span>\r
              </button>\r
              <button mat-menu-item>\r
                <mat-icon>call</mat-icon>\r
                <span>Item 2</span>\r
              </button>\r
              <button mat-menu-item>\r
                <mat-icon>chat</mat-icon>\r
                <span>Item 3</span>\r
              </button>\r
            </mat-menu>\r
            <!-- context menu end -->\r
            @if (isLoading) {\r
            <div class="no-results" [style.display]="dataSource.data.length === 0 ? '' : 'none'">\r
              No results\r
            </div>\r
            }\r
            <mat-paginator #paginator [length]="dataSource.filteredData.length" [pageIndex]="0" [pageSize]="10"\r
              [pageSizeOptions]="[5, 10, 25, 100]">\r
            </mat-paginator>\r
          </div>\r
        </div>\r
\r
      </div>\r
    </div>\r
  </div>\r
</section>`, styles: ["/* src/app/advance-table/advance-table.component.scss */\n:host ::ng-deep .column-filter .mat-mdc-select-arrow {\n  display: none;\n}\n:host ::ng-deep .advance-table .mat-mdc-header-cell {\n  font-weight: 500;\n}\n/*# sourceMappingURL=advance-table.component.css.map */\n"] }]
  }], () => [{ type: HttpClient }, { type: MatDialog }, { type: AdvanceTableService }, { type: MatSnackBar }], { paginator: [{
    type: ViewChild,
    args: [MatPaginator]
  }], sort: [{
    type: ViewChild,
    args: [MatSort]
  }], filter: [{
    type: ViewChild,
    args: ["filter"]
  }], contextMenu: [{
    type: ViewChild,
    args: [MatMenuTrigger]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdvanceTableComponent, { className: "AdvanceTableComponent", filePath: "src/app/advance-table/advance-table.component.ts", lineNumber: 77 });
})();

// src/app/advance-table/advance-table.routes.ts
var ADVANCE_TABLE_ROUTE = [
  {
    path: "",
    component: AdvanceTableComponent
  }
];
export {
  ADVANCE_TABLE_ROUTE
};
//# sourceMappingURL=advance-table.routes-YTVU2CEO.js.map
