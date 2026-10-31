import {
  Page404Component
} from "./chunk-FJ7P6D5J.js";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "./chunk-RV5INBRD.js";
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
import "./chunk-PO3BZ2ER.js";
import "./chunk-75G4SHEF.js";
import "./chunk-JPZDBAQQ.js";
import "./chunk-J7XWAFEK.js";
import "./chunk-ITHPGOKL.js";
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
  MatCardContent,
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
import "./chunk-5ZIRF7RR.js";
import "./chunk-JURKDGMK.js";
import {
  MatOption,
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
  FormControlName,
  FormGroupDirective,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgModel,
  NumberValueAccessor,
  ReactiveFormsModule,
  RequiredValidator,
  UntypedFormBuilder,
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
  DatePipe,
  HttpClient,
  NgClass,
  formatDate
} from "./chunk-WZAKLMWR.js";
import {
  Component,
  Inject,
  Injectable,
  Subject,
  ViewChild,
  catchError,
  map,
  setClassMetadata,
  throwError,
  ɵsetClassDebugInfo,
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-BHZ7HWLX.js";
import "./chunk-IIGRIO22.js";

// src/app/contacts/contacts.model.ts
var Contacts = class {
  constructor(contacts) {
    {
      this.id = contacts.id || this.getRandomID();
      this.img = contacts.img || "assets/images/user/usrbig1.jpg";
      this.name = contacts.name || "";
      this.email = contacts.email || "";
      this.birthDate = formatDate(/* @__PURE__ */ new Date(), "yyyy-MM-dd", "en") || "";
      this.address = contacts.address || "";
      this.mobile = contacts.mobile || "";
      this.note = contacts.note || "";
    }
  }
  getRandomID() {
    const S4 = () => {
      return (1 + Math.random()) * 65536 | 0;
    };
    return S4() + S4();
  }
};

// src/app/contacts/contacts.service.ts
var ContactsService = class _ContactsService {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.API_URL = "assets/data/contacts.json";
  }
  /** GET: Fetch all contacts */
  getAllContacts() {
    return this.httpClient.get(this.API_URL).pipe(catchError(this.handleError));
  }
  /** POST: Add a new contact */
  addContact(contact) {
    return this.httpClient.post(this.API_URL, contact).pipe(map(() => {
      return contact;
    }), catchError(this.handleError));
  }
  /** PUT: Update an existing contact */
  updateContact(contact) {
    return this.httpClient.put(`${this.API_URL}`, contact).pipe(map(() => {
      return contact;
    }), catchError(this.handleError));
  }
  /** DELETE: Remove a contact by ID */
  deleteContact(id) {
    return this.httpClient.delete(`${this.API_URL}`).pipe(map(() => {
      return id;
    }), catchError(this.handleError));
  }
  /** Handle Http operation that failed */
  handleError(error) {
    console.error("An error occurred:", error.message);
    return throwError(() => new Error("Something went wrong; please try again later."));
  }
  static {
    this.\u0275fac = function ContactsService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ContactsService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ContactsService, factory: _ContactsService.\u0275fac, providedIn: "root" });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/contacts/form/form.component.ts
function ContactFormComponent_Conditional_1_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Name is required ");
    \u0275\u0275elementEnd();
  }
}
function ContactFormComponent_Conditional_1_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please enter a valid email address ");
    \u0275\u0275elementEnd();
  }
}
function ContactFormComponent_Conditional_1_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Mobile is required ");
    \u0275\u0275elementEnd();
  }
}
function ContactFormComponent_Conditional_1_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-error");
    \u0275\u0275text(1, " Please select date ");
    \u0275\u0275elementEnd();
  }
}
function ContactFormComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 4)(2, "div", 5)(3, "label", 6);
    \u0275\u0275element(4, "img", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 8);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 9)(8, "mat-icon");
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 10)(11, "form", 11);
    \u0275\u0275listener("ngSubmit", function ContactFormComponent_Conditional_1_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.submit());
    });
    \u0275\u0275elementStart(12, "div", 12)(13, "div", 13)(14, "mat-form-field", 14)(15, "mat-label");
    \u0275\u0275text(16, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "input", 15);
    \u0275\u0275elementStart(18, "i", 16);
    \u0275\u0275text(19, "face");
    \u0275\u0275elementEnd();
    \u0275\u0275template(20, ContactFormComponent_Conditional_1_Conditional_20_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 13)(22, "mat-form-field", 14)(23, "mat-label");
    \u0275\u0275text(24, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "input", 17);
    \u0275\u0275elementStart(26, "i", 16);
    \u0275\u0275text(27, "email");
    \u0275\u0275elementEnd();
    \u0275\u0275template(28, ContactFormComponent_Conditional_1_Conditional_28_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "div", 12)(30, "div", 13)(31, "mat-form-field", 14)(32, "mat-label");
    \u0275\u0275text(33, "Mobile");
    \u0275\u0275elementEnd();
    \u0275\u0275element(34, "input", 18);
    \u0275\u0275elementStart(35, "i", 16);
    \u0275\u0275text(36, "smartphone");
    \u0275\u0275elementEnd();
    \u0275\u0275template(37, ContactFormComponent_Conditional_1_Conditional_37_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 13)(39, "mat-form-field", 14)(40, "mat-label");
    \u0275\u0275text(41, "Birth date");
    \u0275\u0275elementEnd();
    \u0275\u0275element(42, "input", 19)(43, "mat-datepicker-toggle", 20)(44, "mat-datepicker", null, 0);
    \u0275\u0275template(46, ContactFormComponent_Conditional_1_Conditional_46_Template, 2, 0, "mat-error");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 12)(48, "div", 21)(49, "mat-form-field", 14)(50, "mat-label");
    \u0275\u0275text(51, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275element(52, "textarea", 22);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 12)(54, "div", 21)(55, "mat-form-field", 14)(56, "mat-label");
    \u0275\u0275text(57, "Note");
    \u0275\u0275elementEnd();
    \u0275\u0275element(58, "textarea", 23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(59, "div", 12)(60, "div", 21)(61, "div", 24)(62, "button", 25);
    \u0275\u0275text(63, "Save");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "button", 26);
    \u0275\u0275text(65, "Cancel");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_10_0;
    const picker_r3 = \u0275\u0275reference(45);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r1.contacts.img, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.dialogTitle, " ");
    \u0275\u0275advance(5);
    \u0275\u0275property("formGroup", ctx_r1.contactsForm);
    \u0275\u0275advance(9);
    \u0275\u0275conditional((ctx_r1.contactsForm == null ? null : (tmp_5_0 = ctx_r1.contactsForm.get("name")) == null ? null : tmp_5_0.hasError("required")) ? 20 : -1);
    \u0275\u0275advance(8);
    \u0275\u0275conditional((ctx_r1.contactsForm == null ? null : (tmp_6_0 = ctx_r1.contactsForm.get("email")) == null ? null : tmp_6_0.hasError("required")) || (ctx_r1.contactsForm == null ? null : (tmp_6_0 = ctx_r1.contactsForm.get("email")) == null ? null : tmp_6_0.touched) ? 28 : -1);
    \u0275\u0275advance(9);
    \u0275\u0275conditional((ctx_r1.contactsForm == null ? null : (tmp_7_0 = ctx_r1.contactsForm.get("mobile")) == null ? null : tmp_7_0.hasError("required")) ? 37 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275property("matDatepicker", picker_r3);
    \u0275\u0275advance();
    \u0275\u0275property("for", picker_r3);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((ctx_r1.contactsForm == null ? null : (tmp_10_0 = ctx_r1.contactsForm.get("birthDate")) == null ? null : tmp_10_0.hasError("required")) ? 46 : -1);
    \u0275\u0275advance(16);
    \u0275\u0275property("disabled", !(ctx_r1.contactsForm == null ? null : ctx_r1.contactsForm.valid));
  }
}
function ContactFormComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 4)(2, "div", 5)(3, "label", 6);
    \u0275\u0275element(4, "img", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 8);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 9)(8, "mat-icon");
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 10)(11, "mat-card-content")(12, "div", 27)(13, "i", 28);
    \u0275\u0275text(14, "email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 29);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 27)(18, "i", 28);
    \u0275\u0275text(19, "phonelink_ring");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 29);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 27)(23, "i", 28);
    \u0275\u0275text(24, "cake");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 29);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 27)(29, "i", 28);
    \u0275\u0275text(30, "location_on");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 29);
    \u0275\u0275text(32);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 30)(34, "i", 28);
    \u0275\u0275text(35, "note");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 29);
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r1.contacts.img, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.dialogTitle, " ");
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" ", ctx_r1.contacts.email, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.contacts.mobile, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind2(27, 7, ctx_r1.contacts.birthDate, "MMMM d, yyyy"), " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r1.contacts.address, " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r1.contacts.note, " ");
  }
}
var ContactFormComponent = class _ContactFormComponent {
  constructor(dialogRef, data, contactsService, fb) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.contactsService = contactsService;
    this.fb = fb;
    this.isDetails = false;
    this.formControl = new UntypedFormControl("", [Validators.required]);
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = `Edit Contact: ${data.contacts.name}`;
      this.contacts = data.contacts;
      this.contactsForm = this.createContactForm();
      this.isDetails = false;
    } else if (this.action === "details") {
      this.contacts = data.contacts;
      this.dialogTitle = data.contacts.name;
      this.isDetails = true;
    } else {
      this.dialogTitle = "New Contact";
      this.contacts = new Contacts({});
      this.contactsForm = this.createContactForm();
      this.isDetails = false;
    }
  }
  // Error message handling
  getErrorMessage() {
    if (this.formControl.hasError("required")) {
      return "This field is required";
    }
    if (this.formControl.hasError("email")) {
      return "Not a valid email";
    }
    return "";
  }
  // Form structure and validation rules
  createContactForm() {
    return this.fb.group({
      id: [this.contacts.id],
      img: [this.contacts.img],
      name: [this.contacts.name, Validators.required],
      email: [
        this.contacts.email,
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      birthDate: [
        formatDate(this.contacts.birthDate, "yyyy-MM-dd", "en"),
        Validators.required
      ],
      address: [this.contacts.address],
      mobile: [
        this.contacts.mobile,
        [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]
      ],
      note: [this.contacts.note]
    });
  }
  // Submit logic
  submit() {
    if (this.contactsForm?.valid) {
      const contactData = this.contactsForm.getRawValue();
      if (this.action === "edit") {
        this.contactsService.updateContact(contactData).subscribe({
          next: (response) => this.dialogRef.close(response),
          error: (error) => console.error("Update Error:", error)
        });
      } else {
        this.contactsService.addContact(contactData).subscribe({
          next: (response) => this.dialogRef.close(response),
          error: (error) => console.error("Add Error:", error)
        });
      }
    }
  }
  // Close dialog
  onNoClick() {
    this.dialogRef.close();
  }
  // Confirm add or update
  confirmAdd() {
    this.submit();
  }
  static {
    this.\u0275fac = function ContactFormComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ContactFormComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(ContactsService), \u0275\u0275directiveInject(UntypedFormBuilder));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactFormComponent, selectors: [["app-contact-form"]], decls: 3, vars: 2, consts: [["picker", ""], [1, "addContainer"], [1, "contact-form"], [1, "contact-details"], [1, "modalHeader"], [1, "avatarDetails"], [1, "hoverable"], ["alt", "avatar", 3, "src"], [1, "modalTitle"], ["mat-icon-button", "", "mat-dialog-close", "", "aria-label", "Close dialog", "type", "button", 1, "modal-close-button"], ["mat-dialog-content", ""], [1, "register-form", "m-4", 3, "ngSubmit", "formGroup"], [1, "row"], [1, "col-xl-6", "col-lg-6", "col-md-12", "col-sm-12", "mb-2"], ["appearance", "outline", 1, "example-full-width", "mb-3"], ["matInput", "", "formControlName", "name", "required", ""], ["matSuffix", "", 1, "material-icons-outlined", "p-3"], ["matInput", "", "formControlName", "email", "required", ""], ["matInput", "", "formControlName", "mobile", "type", "number"], ["matInput", "", "formControlName", "birthDate", 3, "matDatepicker"], ["matSuffix", "", 3, "for"], [1, "col-xl-12", "col-lg-12", "col-md-12", "col-sm-12", "mb-2"], ["matInput", "", "formControlName", "address"], ["matInput", "", "formControlName", "note"], [1, "example-button-row"], ["mat-flat-button", "", "type", "submit", 1, "formSubmitBtn", 3, "disabled"], ["mat-flat-button", "", "mat-dialog-close", "", "tabindex", "-1", 1, "formCancelBtn"], [1, "contact-details-field", "m-b-30"], [1, "material-icons-outlined"], [1, "contact-detail-info"], [1, "contact-details-field"]], template: function ContactFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1);
        \u0275\u0275template(1, ContactFormComponent_Conditional_1_Template, 66, 10, "div", 2)(2, ContactFormComponent_Conditional_2_Template, 38, 10, "div", 3);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275conditional(!ctx.isDetails ? 1 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.isDetails ? 2 : -1);
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
      MatDatepickerModule,
      MatDatepicker,
      MatDatepickerInput,
      MatDatepickerToggle,
      MatDialogClose,
      MatCardModule,
      MatCardContent,
      DatePipe
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactFormComponent, [{
    type: Component,
    args: [{ selector: "app-contact-form", imports: [
      MatButtonModule,
      MatIconModule,
      MatDialogContent,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatDialogClose,
      MatCardModule,
      DatePipe
    ], template: `<div class="addContainer">\r
  @if (!isDetails) {\r
  <div class="contact-form">\r
    <div class="modalHeader">\r
      <div class="avatarDetails">\r
        <label class="hoverable">\r
          <img [src]='contacts.img' alt="avatar">\r
        </label>\r
        <div class="modalTitle">\r
          {{dialogTitle}}\r
        </div>\r
      </div>\r
      <button mat-icon-button mat-dialog-close class="modal-close-button" aria-label="Close dialog" type="button">\r
        <mat-icon>close</mat-icon>\r
      </button>\r
    </div>\r
    <div mat-dialog-content>\r
      <form class="register-form m-4" [formGroup]="contactsForm!" (ngSubmit)="submit()">\r
        <div class="row">\r
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Name</mat-label>\r
              <input matInput formControlName="name" required>\r
              <i class="material-icons-outlined p-3" matSuffix>face</i>\r
              @if (contactsForm?.get('name')?.hasError('required')) {\r
              <mat-error>\r
                Name is required\r
              </mat-error>\r
              }\r
            </mat-form-field>\r
          </div>\r
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Email</mat-label>\r
              <input matInput formControlName="email" required>\r
              <i class="material-icons-outlined p-3" matSuffix>email</i>\r
              @if (contactsForm?.get('email')?.hasError('required') || contactsForm?.get('email')?.touched) {\r
              <mat-error>\r
                Please enter a valid email address\r
              </mat-error>\r
              }\r
            </mat-form-field>\r
          </div>\r
        </div>\r
        <div class="row">\r
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Mobile</mat-label>\r
              <input matInput formControlName="mobile" type="number">\r
              <i class="material-icons-outlined p-3" matSuffix>smartphone</i>\r
              @if (contactsForm?.get('mobile')?.hasError('required')) {\r
              <mat-error>\r
                Mobile is required\r
              </mat-error>\r
              }\r
            </mat-form-field>\r
          </div>\r
          <div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Birth date</mat-label>\r
              <input matInput [matDatepicker]="picker" formControlName="birthDate">\r
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>\r
              <mat-datepicker #picker></mat-datepicker>\r
              @if (contactsForm?.get('birthDate')?.hasError('required')) {\r
              <mat-error>\r
                Please select date\r
              </mat-error>\r
              }\r
            </mat-form-field>\r
          </div>\r
        </div>\r
        <div class="row">\r
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Address</mat-label>\r
              <textarea matInput formControlName="address"></textarea>\r
            </mat-form-field>\r
          </div>\r
        </div>\r
        <div class="row">\r
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
            <mat-form-field class="example-full-width mb-3" appearance="outline">\r
              <mat-label>Note</mat-label>\r
              <textarea matInput formControlName="note"></textarea>\r
            </mat-form-field>\r
          </div>\r
        </div>\r
        <div class="row">\r
          <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2">\r
            <div class="example-button-row">\r
              <button mat-flat-button class="formSubmitBtn" [disabled]="!contactsForm?.valid"\r
                type="submit">Save</button>\r
              <button mat-flat-button mat-dialog-close class="formCancelBtn" tabindex="-1">Cancel</button>\r
            </div>\r
          </div>\r
        </div>\r
      </form>\r
    </div>\r
  </div>\r
  }\r
  @if (isDetails) {\r
  <div class="contact-details">\r
    <div class="modalHeader">\r
      <div class="avatarDetails">\r
        <label class="hoverable">\r
          <img [src]='contacts.img' alt="avatar">\r
        </label>\r
        <div class="modalTitle">\r
          {{dialogTitle}}\r
        </div>\r
      </div>\r
      <button mat-icon-button mat-dialog-close class="modal-close-button" aria-label="Close dialog" type="button">\r
        <mat-icon>close</mat-icon>\r
      </button>\r
    </div>\r
    <div mat-dialog-content>\r
      <mat-card-content>\r
        <div class="contact-details-field m-b-30">\r
          <i class="material-icons-outlined">email</i>\r
          <div class="contact-detail-info"> {{contacts.email}}\r
          </div>\r
        </div>\r
        <div class="contact-details-field m-b-30">\r
          <i class="material-icons-outlined">phonelink_ring</i>\r
          <div class="contact-detail-info"> {{contacts.mobile}}\r
          </div>\r
        </div>\r
        <div class="contact-details-field m-b-30">\r
          <i class="material-icons-outlined">cake</i>\r
          <div class="contact-detail-info"> {{contacts.birthDate | date: 'MMMM d, yyyy'}}\r
          </div>\r
        </div>\r
        <div class="contact-details-field m-b-30">\r
          <i class="material-icons-outlined">location_on</i>\r
          <div class="contact-detail-info"> {{contacts.address}}\r
          </div>\r
        </div>\r
        <div class="contact-details-field">\r
          <i class="material-icons-outlined">note</i>\r
          <div class="contact-detail-info"> {{contacts.note}}\r
          </div>\r
        </div>\r
      </mat-card-content>\r
    </div>\r
  </div>\r
  }\r
</div>` }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: ContactsService }, { type: UntypedFormBuilder }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactFormComponent, { className: "ContactFormComponent", filePath: "src/app/contacts/form/form.component.ts", lineNumber: 50 });
})();

// src/app/contacts/delete/delete.component.ts
var ContactDeleteComponent = class _ContactDeleteComponent {
  constructor(dialogRef, data, contactsService) {
    this.dialogRef = dialogRef;
    this.data = data;
    this.contactsService = contactsService;
  }
  onNoClick() {
    this.dialogRef.close();
  }
  confirmDelete() {
    this.contactsService.deleteContact(this.data.id);
  }
  static {
    this.\u0275fac = function ContactDeleteComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ContactDeleteComponent)(\u0275\u0275directiveInject(MatDialogRef), \u0275\u0275directiveInject(MAT_DIALOG_DATA), \u0275\u0275directiveInject(ContactsService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactDeleteComponent, selectors: [["app-contact-delete"]], decls: 24, vars: 4, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], [1, "clearfix"], [1, "font-weight-bold"], ["mat-dialog-actions", "", 1, "mb-1"], ["mat-flat-button", "", 1, "formCancelBtn", 3, "click", "mat-dialog-close"], ["mat-flat-button", "", "tabindex", "-1", 3, "click"]], template: function ContactDeleteComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "h3", 0);
        \u0275\u0275text(1, "Are you sure?");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(2, "div", 1)(3, "ul", 2)(4, "li")(5, "p")(6, "span", 3);
        \u0275\u0275text(7, " Name: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(8);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(9, "li")(10, "p")(11, "span", 3);
        \u0275\u0275text(12, " Email: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(13);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(14, "li")(15, "p")(16, "span", 3);
        \u0275\u0275text(17, "Mobile: ");
        \u0275\u0275elementEnd();
        \u0275\u0275text(18);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(19, "div", 4)(20, "button", 5);
        \u0275\u0275listener("click", function ContactDeleteComponent_Template_button_click_20_listener() {
          return ctx.confirmDelete();
        });
        \u0275\u0275text(21, " Delete ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(22, "button", 6);
        \u0275\u0275listener("click", function ContactDeleteComponent_Template_button_click_22_listener() {
          return ctx.onNoClick();
        });
        \u0275\u0275text(23, "Cancel");
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.data.name);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate(ctx.data.email);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1("", ctx.data.mobile, " ");
        \u0275\u0275advance(2);
        \u0275\u0275property("mat-dialog-close", 1);
      }
    }, dependencies: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatButtonModule,
      MatButton,
      MatDialogClose
    ], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactDeleteComponent, [{
    type: Component,
    args: [{ selector: "app-contact-delete", imports: [
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatButtonModule,
      MatDialogClose
    ], template: '<h3 mat-dialog-title>Are you sure?</h3>\r\n<div mat-dialog-content>\r\n  <ul class="clearfix">\r\n    <li>\r\n      <p><span class="font-weight-bold"> Name: </span>{{data.name}}</p>\r\n    </li>\r\n    <li>\r\n      <p><span class="font-weight-bold"> Email: </span>{{ data.email }}</p>\r\n    </li>\r\n    <li>\r\n      <p>\r\n        <span class="font-weight-bold">Mobile: </span>{{data.mobile}}\r\n      </p>\r\n    </li>\r\n  </ul>\r\n</div>\r\n<div mat-dialog-actions class="mb-1">\r\n  <button mat-flat-button class="formCancelBtn" [mat-dialog-close]="1" (click)="confirmDelete()">\r\n    Delete\r\n  </button>\r\n  <button mat-flat-button (click)="onNoClick()" tabindex="-1">Cancel</button>\r\n</div>' }]
  }], () => [{ type: MatDialogRef }, { type: void 0, decorators: [{
    type: Inject,
    args: [MAT_DIALOG_DATA]
  }] }, { type: ContactsService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactDeleteComponent, { className: "ContactDeleteComponent", filePath: "src/app/contacts/delete/delete.component.ts", lineNumber: 32 });
})();

// src/app/contacts/contacts.component.ts
var _c0 = ["filter"];
var _c1 = () => ["Home"];
var _c2 = () => [5, 10, 25, 100];
function ContactsComponent_For_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "mat-option")(2, "mat-checkbox", 51);
    \u0275\u0275listener("click", function ContactsComponent_For_31_Template_mat_checkbox_click_2_listener($event) {
      \u0275\u0275restoreView(_r4);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275twoWayListener("ngModelChange", function ContactsComponent_For_31_Template_mat_checkbox_ngModelChange_2_listener($event) {
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
function ContactsComponent_mat_header_cell_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-header-cell")(1, "mat-checkbox", 52);
    \u0275\u0275listener("change", function ContactsComponent_mat_header_cell_56_Template_mat_checkbox_change_1_listener($event) {
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
function ContactsComponent_mat_cell_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell")(1, "mat-checkbox", 53);
    \u0275\u0275listener("click", function ContactsComponent_mat_cell_57_Template_mat_checkbox_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    })("change", function ContactsComponent_mat_cell_57_Template_mat_checkbox_change_1_listener($event) {
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
function ContactsComponent_For_59_Conditional_0_Template(rf, ctx) {
}
function ContactsComponent_For_59_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 59);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r12));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "img", 61);
    \u0275\u0275elementStart(4, "span", 58);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r12 = ctx.$implicit;
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275property("matTooltip", row_r12.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", column_r10.label, ":");
    \u0275\u0275advance();
    \u0275\u0275property("src", row_r12.img, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", row_r12.name, " ");
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 4, "mat-cell", 56);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 63);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(5);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r14));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 58);
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 5, "mat-cell", 62);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 59);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r16));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 64);
    \u0275\u0275text(4, "call");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 58);
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 56);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 59);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(7);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r18));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 65);
    \u0275\u0275text(4, "mail");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 58);
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 56);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 59);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r20 = \u0275\u0275restoreView(_r19).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(8);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r20));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "mat-icon", 66);
    \u0275\u0275text(4, "place");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 58);
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 7, 3, "mat-cell", 56);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 67);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r22.gender);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "span", 68);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const row_r22 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(row_r22.gender);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 63);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r22 = \u0275\u0275restoreView(_r21).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r22));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div");
    \u0275\u0275template(4, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_4_Template, 3, 1, "div")(5, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Case_5_Template, 3, 1, "div");
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_mat_cell_2_Template, 6, 2, "mat-cell", 62);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 57)(1, "span", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(8).$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(column_r10.label);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 63);
    \u0275\u0275listener("contextmenu", function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template_mat_cell_contextmenu_0_listener($event) {
      const row_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r6 = \u0275\u0275nextContext(9);
      return \u0275\u0275resetView(ctx_r6.onContextMenu($event, row_r24));
    });
    \u0275\u0275elementStart(1, "span", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 58);
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
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 54);
    \u0275\u0275template(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_header_cell_1_Template, 3, 1, "mat-header-cell", 55)(2, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_mat_cell_2_Template, 5, 2, "mat-cell", 62);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(7).$implicit;
    \u0275\u0275property("matColumnDef", column_r10.def);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 3, 1, "ng-container", 54);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(6).$implicit;
    \u0275\u0275conditional(column_r10.def === "gender" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(5).$implicit;
    \u0275\u0275conditional(column_r10.type === "address" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(4).$implicit;
    \u0275\u0275conditional(column_r10.type === "email" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(3).$implicit;
    \u0275\u0275conditional(column_r10.type === "phone" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275conditional(column_r10.type === "date" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_1_Conditional_0_Template, 3, 1, "ng-container", 54)(1, ContactsComponent_For_59_Conditional_1_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(column_r10.def === "name" ? 0 : 1);
  }
}
function ContactsComponent_For_59_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, ContactsComponent_For_59_Conditional_0_Template, 0, 0)(1, ContactsComponent_For_59_Conditional_1_Template, 2, 1);
  }
  if (rf & 2) {
    const column_r10 = ctx.$implicit;
    \u0275\u0275conditional(column_r10.type === "check" || column_r10.type === "actionBtn" ? 0 : 1);
  }
}
function ContactsComponent_mat_header_cell_61_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 69);
    \u0275\u0275text(1, "Actions");
    \u0275\u0275elementEnd();
  }
}
function ContactsComponent_mat_cell_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 69)(1, "button", 70);
    \u0275\u0275listener("click", function ContactsComponent_mat_cell_62_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r25);
      return \u0275\u0275resetView($event.stopPropagation());
    })("click", function ContactsComponent_mat_cell_62_Template_button_click_1_listener() {
      const row_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.editCall(row_r26));
    });
    \u0275\u0275element(2, "app-feather-icons", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 70);
    \u0275\u0275listener("click", function ContactsComponent_mat_cell_62_Template_button_click_3_listener($event) {
      \u0275\u0275restoreView(_r25);
      return \u0275\u0275resetView($event.stopPropagation());
    })("click", function ContactsComponent_mat_cell_62_Template_button_click_3_listener() {
      const row_r26 = \u0275\u0275restoreView(_r25).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.deleteItem(row_r26));
    });
    \u0275\u0275element(4, "app-feather-icons", 71);
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
function ContactsComponent_mat_header_row_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function ContactsComponent_mat_row_64_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-row", 72);
    \u0275\u0275listener("click", function ContactsComponent_mat_row_64_Template_mat_row_click_0_listener() {
      const row_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.detailsCall(row_r28));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275styleProp("cursor", "pointer");
    \u0275\u0275property("@rowsAnimation", void 0);
  }
}
function ContactsComponent_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "mat-progress-spinner", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("diameter", 40);
  }
}
function ContactsComponent_ng_template_69_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 74);
    \u0275\u0275listener("click", function ContactsComponent_ng_template_69_Template_button_click_0_listener() {
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
    \u0275\u0275elementStart(5, "button", 74);
    \u0275\u0275listener("click", function ContactsComponent_ng_template_69_Template_button_click_5_listener() {
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
    \u0275\u0275elementStart(10, "button", 74);
    \u0275\u0275listener("click", function ContactsComponent_ng_template_69_Template_button_click_10_listener() {
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
    \u0275\u0275elementStart(15, "button", 74);
    \u0275\u0275listener("click", function ContactsComponent_ng_template_69_Template_button_click_15_listener() {
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
    \u0275\u0275elementStart(20, "button", 75)(21, "mat-icon");
    \u0275\u0275text(22, "no_encryption");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24, "Disable");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "button", 76)(26, "mat-icon");
    \u0275\u0275text(27, "list_alt");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "span");
    \u0275\u0275text(29, " Nested Menu");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const nestedmenu_r31 = \u0275\u0275reference(71);
    \u0275\u0275advance(25);
    \u0275\u0275property("matMenuTriggerFor", nestedmenu_r31);
  }
}
function ContactsComponent_Conditional_87_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77);
    \u0275\u0275text(1, " No results ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("display", ctx_r6.dataSource.data.length === 0 ? "" : "none");
  }
}
var ContactsComponent = class _ContactsComponent {
  constructor(httpClient, dialog, contactsService, snackBar) {
    this.httpClient = httpClient;
    this.dialog = dialog;
    this.contactsService = contactsService;
    this.snackBar = snackBar;
    this.columnDefinitions = [
      { def: "select", label: "Checkbox", type: "check", visible: true },
      { def: "name", label: "Name", type: "text", visible: true },
      { def: "email", label: "Email", type: "email", visible: true },
      { def: "birthDate", label: "Birth Date", type: "date", visible: true },
      { def: "mobile", label: "Mobile", type: "phone", visible: true },
      { def: "address", label: "Address", type: "address", visible: true },
      { def: "note", label: "Notes", type: "text", visible: false },
      { def: "actions", label: "Actions", type: "actionBtn", visible: true }
    ];
    this.dataSource = new MatTableDataSource([]);
    this.selection = new SelectionModel(true, []);
    this.contextMenuPosition = { x: "0px", y: "0px" };
    this.isLoading = true;
    this.destroy$ = new Subject();
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
  loadData() {
    this.contactsService.getAllContacts().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        this.refreshTable();
        this.dataSource.filterPredicate = (data2, filter) => Object.values(data2).some((value) => value.toString().toLowerCase().includes(filter));
      },
      error: (err) => console.error(err)
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
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: "60vw",
      maxWidth: "100vw",
      data: { contacts: data, action },
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
    const dialogRef = this.dialog.open(ContactDeleteComponent, {
      data: row
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = this.dataSource.data.filter((record) => record.id !== row.id);
        this.refreshTable();
        this.showNotification("snackbar-danger", "Delete Record Successfully...!!!", "bottom", "center");
      }
    });
  }
  detailsCall(row) {
    this.dialog.open(ContactFormComponent, {
      data: {
        contacts: row,
        action: "details"
      },
      height: "85%",
      width: "35%"
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
      Name: x.name,
      Email: x.email,
      "Birth Date": formatDate(new Date(x.birthDate), "yyyy-MM-dd", "en") || "",
      Mobile: x.mobile,
      Address: x.address,
      Notes: x.note
    }));
    TableExportUtil.exportToExcel(exportData, "contacts_export");
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
    this.\u0275fac = function ContactsComponent_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _ContactsComponent)(\u0275\u0275directiveInject(HttpClient), \u0275\u0275directiveInject(MatDialog), \u0275\u0275directiveInject(ContactsService), \u0275\u0275directiveInject(MatSnackBar));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactsComponent, selectors: [["app-contacts"]], viewQuery: function ContactsComponent_Query(rf, ctx) {
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
    }, decls: 90, vars: 22, consts: [["filter", ""], ["select", ""], ["contextMenu", "matMenu"], ["nestedmenu", "matMenu"], ["paginator", ""], [1, "content"], [1, "content-block"], [1, "block-header"], [3, "title", "items", "active_item"], [1, "row"], [1, "col-lg-12", "col-md-12", "col-sm-12", "col-xs-12"], [1, "card"], [1, "materialTableHeader"], [1, "left"], [1, "header-buttons-left", "ms-0"], [1, "tbl-title"], [1, "tbl-search-box"], ["for", "search-input"], [1, "material-icons", "search-icon"], ["id", "search-input", "placeholder", "Search", "type", "text", "aria-label", "Search box", 1, "browser-default", "search-field", 3, "keyup"], [1, "right"], [1, "tbl-export-btn"], [1, "tbl-header-btn"], [1, "m-l-10"], ["mat-icon-button", "", "color", "primary", "matTooltip", "Show/Hide Column", 3, "click"], [1, "column-filter", 2, "width", "200px", "display", "table", 3, "ngModelChange", "ngModel"], [1, "table-column-label"], ["mat-icon-button", "", "matTooltip", "Add", 1, "col-green", 3, "click"], ["mat-icon-button", "", "matTooltip", "Refresh", 3, "click"], [1, "m-l-10", 3, "hidden"], ["mat-icon-button", "", "matTooltip", "Delete", 1, "col-red", 3, "click", "hidden"], [1, "export-button", "m-l-10"], ["mat-icon-button", "", "matTooltip", "Xlsx Download", 1, "col-blue", 3, "click"], [1, "material-icons-outlined"], [1, "overflow-auto"], [1, "responsive_table"], ["mat-table", "", "matSort", "", 1, "mat-cell", "advance-table", 3, "dataSource"], ["matColumnDef", "select"], [4, "matHeaderCellDef"], [4, "matCellDef"], ["matColumnDef", "actions"], ["class", "pr-0", 4, "matHeaderCellDef"], ["class", "pr-0", 4, "matCellDef"], [4, "matHeaderRowDef"], ["matRipple", "", 3, "cursor", "click", 4, "matRowDef", "matRowDefColumns"], [1, "tbl-spinner"], [2, "visibility", "hidden", "position", "fixed", 3, "matMenuTriggerFor"], ["matMenuContent", ""], ["mat-menu-item", ""], [1, "no-results", 3, "display"], [3, "length", "pageIndex", "pageSize", "pageSizeOptions"], ["color", "primary", 3, "click", "ngModelChange", "ngModel"], ["color", "primary", 3, "change", "checked", "indeterminate", "ngClass"], ["color", "primary", 3, "click", "change", "checked", "ngClass"], [3, "matColumnDef"], ["mat-sort-header", "", 4, "matHeaderCellDef"], [3, "matTooltip", "contextmenu", 4, "matCellDef"], ["mat-sort-header", ""], [1, "truncate-text"], [3, "contextmenu", "matTooltip"], [1, "mobile-label"], ["alt", "image", 1, "table-img", 3, "src"], [3, "contextmenu", 4, "matCellDef"], [3, "contextmenu"], [1, "tbl-icon", "material-icons-outlined", "col-green"], [1, "tbl-icon", "material-icons-outlined", "col-red"], [1, "tbl-icon", "material-icons-outlined", "col-blue"], [1, "badge", "badge-solid-green"], [1, "badge", "badge-solid-purple"], [1, "pr-0"], ["mat-icon-button", "", "color", "accent", 1, "tbl-action-btn", 3, "click"], [3, "icon"], ["matRipple", "", 3, "click"], ["color", "primary", "mode", "indeterminate", 3, "diameter"], ["mat-menu-item", "", 3, "click"], ["mat-menu-item", "", "disabled", ""], ["mat-menu-item", "", 3, "matMenuTriggerFor"], [1, "no-results"]], template: function ContactsComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275elementStart(0, "section", 5)(1, "div", 6)(2, "div", 7);
        \u0275\u0275element(3, "app-breadcrumb", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "div", 9)(5, "div", 10)(6, "div", 11)(7, "div", 12)(8, "div", 13)(9, "ul", 14)(10, "li", 15)(11, "h2");
        \u0275\u0275text(12, "Contacts");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(13, "li", 16)(14, "label", 17)(15, "i", 18);
        \u0275\u0275text(16, "search");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(17, "input", 19, 0);
        \u0275\u0275listener("keyup", function ContactsComponent_Template_input_keyup_17_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.applyFilter($event));
        });
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(19, "div", 20)(20, "ul", 21)(21, "li", 22)(22, "div", 23)(23, "button", 24);
        \u0275\u0275listener("click", function ContactsComponent_Template_button_click_23_listener() {
          \u0275\u0275restoreView(_r1);
          const select_r2 = \u0275\u0275reference(27);
          return \u0275\u0275resetView(select_r2.open());
        });
        \u0275\u0275elementStart(24, "mat-icon");
        \u0275\u0275text(25, "filter_list");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(26, "mat-select", 25, 1);
        \u0275\u0275twoWayListener("ngModelChange", function ContactsComponent_Template_mat_select_ngModelChange_26_listener($event) {
          \u0275\u0275restoreView(_r1);
          const filter_r3 = \u0275\u0275reference(18);
          \u0275\u0275twoWayBindingSet(filter_r3.value, $event) || (filter_r3.value = $event);
          return \u0275\u0275resetView($event);
        });
        \u0275\u0275elementStart(28, "span", 26);
        \u0275\u0275text(29, "Show/Hide Column");
        \u0275\u0275elementEnd();
        \u0275\u0275repeaterCreate(30, ContactsComponent_For_31_Template, 4, 2, "div", null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(32, "li", 22)(33, "div", 23)(34, "button", 27);
        \u0275\u0275listener("click", function ContactsComponent_Template_button_click_34_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.addNew());
        });
        \u0275\u0275elementStart(35, "mat-icon");
        \u0275\u0275text(36, "add_circle_outline");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(37, "li", 22)(38, "div", 23)(39, "button", 28);
        \u0275\u0275listener("click", function ContactsComponent_Template_button_click_39_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.refresh());
        });
        \u0275\u0275elementStart(40, "mat-icon");
        \u0275\u0275text(41, "refresh");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(42, "li", 22)(43, "div", 29)(44, "button", 30);
        \u0275\u0275listener("click", function ContactsComponent_Template_button_click_44_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.removeSelectedRows());
        });
        \u0275\u0275elementStart(45, "mat-icon");
        \u0275\u0275text(46, "delete_outline");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(47, "li")(48, "div", 31)(49, "button", 32);
        \u0275\u0275listener("click", function ContactsComponent_Template_button_click_49_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx.exportExcel());
        });
        \u0275\u0275elementStart(50, "mat-icon", 33);
        \u0275\u0275text(51, "file_download");
        \u0275\u0275elementEnd()()()()()()();
        \u0275\u0275elementStart(52, "div", 34)(53, "div", 35)(54, "table", 36);
        \u0275\u0275elementContainerStart(55, 37);
        \u0275\u0275template(56, ContactsComponent_mat_header_cell_56_Template, 2, 3, "mat-header-cell", 38)(57, ContactsComponent_mat_cell_57_Template, 2, 2, "mat-cell", 39);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275repeaterCreate(58, ContactsComponent_For_59_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIdentity);
        \u0275\u0275elementContainerStart(60, 40);
        \u0275\u0275template(61, ContactsComponent_mat_header_cell_61_Template, 2, 0, "mat-header-cell", 41)(62, ContactsComponent_mat_cell_62_Template, 5, 6, "mat-cell", 42);
        \u0275\u0275elementContainerEnd();
        \u0275\u0275template(63, ContactsComponent_mat_header_row_63_Template, 1, 0, "mat-header-row", 43)(64, ContactsComponent_mat_row_64_Template, 1, 3, "mat-row", 44);
        \u0275\u0275elementEnd();
        \u0275\u0275template(65, ContactsComponent_Conditional_65_Template, 2, 1, "div", 45);
        \u0275\u0275element(66, "div", 46);
        \u0275\u0275elementStart(67, "mat-menu", null, 2);
        \u0275\u0275template(69, ContactsComponent_ng_template_69_Template, 30, 1, "ng-template", 47);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(70, "mat-menu", null, 3)(72, "button", 48)(73, "mat-icon");
        \u0275\u0275text(74, "mail_outline");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(75, "span");
        \u0275\u0275text(76, "Item 1");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(77, "button", 48)(78, "mat-icon");
        \u0275\u0275text(79, "call");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(80, "span");
        \u0275\u0275text(81, "Item 2");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(82, "button", 48)(83, "mat-icon");
        \u0275\u0275text(84, "chat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(85, "span");
        \u0275\u0275text(86, "Item 3");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(87, ContactsComponent_Conditional_87_Template, 2, 2, "div", 49);
        \u0275\u0275element(88, "mat-paginator", 50, 4);
        \u0275\u0275elementEnd()()()()()()();
      }
      if (rf & 2) {
        const filter_r3 = \u0275\u0275reference(18);
        const contextMenu_r32 = \u0275\u0275reference(68);
        \u0275\u0275advance(3);
        \u0275\u0275property("title", "Contacts")("items", \u0275\u0275pureFunction0(20, _c1))("active_item", "Contacts");
        \u0275\u0275advance(23);
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
        \u0275\u0275conditional(ctx.isLoading ? 65 : -1);
        \u0275\u0275advance();
        \u0275\u0275styleProp("left", ctx.contextMenuPosition.x)("top", ctx.contextMenuPosition.y);
        \u0275\u0275property("matMenuTriggerFor", contextMenu_r32);
        \u0275\u0275advance(21);
        \u0275\u0275conditional(ctx.isLoading ? 87 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("length", ctx.dataSource.filteredData.length)("pageIndex", 0)("pageSize", 10)("pageSizeOptions", \u0275\u0275pureFunction0(21, _c2));
      }
    }, dependencies: [
      BreadcrumbComponent,
      FormsModule,
      NgControlStatus,
      NgModel,
      MatTooltipModule,
      MatTooltip,
      MatButtonModule,
      MatIconButton,
      MatIconModule,
      MatIcon,
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
      NgClass,
      MatCheckboxModule,
      MatCheckbox,
      FeatherIconsComponent,
      MatRippleModule,
      MatRipple,
      MatSelectModule,
      MatSelect,
      MatOption,
      MatProgressSpinnerModule,
      MatProgressSpinner,
      MatMenuModule,
      MatMenu,
      MatMenuItem,
      MatMenuContent,
      MatMenuTrigger,
      MatPaginatorModule,
      MatPaginator,
      DatePipe
    ], styles: ["\n\n[_nghost-%COMP%]     .column-filter .mat-mdc-select-arrow {\n  display: none;\n}\n[_nghost-%COMP%]     .advance-table .mat-mdc-header-cell {\n  font-weight: 500;\n}\n/*# sourceMappingURL=contacts.component.css.map */"], data: { animation: [rowsAnimation] } });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactsComponent, [{
    type: Component,
    args: [{ selector: "app-contacts", animations: [rowsAnimation], imports: [
      BreadcrumbComponent,
      FormsModule,
      MatTooltipModule,
      MatButtonModule,
      MatIconModule,
      MatTableModule,
      MatSortModule,
      NgClass,
      MatCheckboxModule,
      FeatherIconsComponent,
      MatRippleModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      MatMenuModule,
      MatPaginatorModule,
      DatePipe
    ], template: `<section class="content">\r
  <div class="content-block">\r
    <div class="block-header">\r
      <!-- breadcrumb -->\r
      <app-breadcrumb [title]="'Contacts'" [items]="['Home']" [active_item]="'Contacts'"></app-breadcrumb>\r
    </div>\r
    <div class="row">\r
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">\r
        <div class="card">\r
          <div class="materialTableHeader">\r
            <div class="left">\r
              <ul class="header-buttons-left ms-0">\r
                <li class="tbl-title">\r
                  <h2>Contacts</h2>\r
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
          <div class="overflow-auto">\r
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
                @for (column of columnDefinitions; track column) {\r
                <!-- Skip rendering if column.label is "select" or "action" -->\r
                @if (column.type === 'check' || column.type === 'actionBtn') {\r
                <!-- Skip this column -->\r
                } @else {\r
                @if (column.def === 'name') {\r
                <ng-container [matColumnDef]="column.def">\r
                  <mat-header-cell *matHeaderCellDef mat-sort-header>\r
                    <span class="truncate-text">{{ column.label }}</span>\r
                  </mat-header-cell>\r
                  <mat-cell *matCellDef="let row" (contextmenu)="onContextMenu($event, row)" [matTooltip]="row.name">\r
                    <span class="mobile-label">{{ column.label }}:</span>\r
                    <img [src]="row.img" class="table-img" alt="image" />\r
                    <span class="truncate-text">\r
                      {{ row.name }}\r
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
                }\r
                <!-- For User with image -->\r
                <!-- For Date Columns -->\r
                <!-- For Time Columns -->\r
                <!-- For Mobile Columns -->\r
                <!-- For Email Columns -->\r
                <!-- For Address Columns -->\r
                <!-- For Gender Column -->\r
                <!-- Rest all columns -->\r
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
                  (click)="detailsCall(row)" [style.cursor]="'pointer'" matRipple>\r
                </mat-row>\r
              </table>\r
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
\r
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
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</section>`, styles: ["/* src/app/contacts/contacts.component.scss */\n:host ::ng-deep .column-filter .mat-mdc-select-arrow {\n  display: none;\n}\n:host ::ng-deep .advance-table .mat-mdc-header-cell {\n  font-weight: 500;\n}\n/*# sourceMappingURL=contacts.component.css.map */\n"] }]
  }], () => [{ type: HttpClient }, { type: MatDialog }, { type: ContactsService }, { type: MatSnackBar }], { paginator: [{
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactsComponent, { className: "ContactsComponent", filePath: "src/app/contacts/contacts.component.ts", lineNumber: 64 });
})();

// src/app/contacts/contacts.routes.ts
var CONTACT_ROUTE = [
  {
    path: "",
    component: ContactsComponent
  },
  { path: "**", component: Page404Component }
];
export {
  CONTACT_ROUTE
};
//# sourceMappingURL=contacts.routes-GODTJKLI.js.map
