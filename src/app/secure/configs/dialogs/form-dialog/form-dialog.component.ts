import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose,
} from '@angular/material/dialog';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Component, Inject, OnInit } from '@angular/core';
//import { AdvanceTableService } from '../../users-table.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
//import { UserModel } from '../../users-table.model';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { CommonModule, DatePipe, formatDate, NgClass } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import axios from 'axios';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '@core';

export interface DialogData {
  id: number;
  action: string;
  //advanceTable: UserModel;
}

@Component({
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, provideNgxMask()],
    imports: [
        MatButtonModule,TranslateModule,
        MatIconModule,
        MatDialogContent,CommonModule,
        FormsModule,MatSlideToggleModule,
        ReactiveFormsModule,
        MatFormFieldModule,NgxMaskDirective,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        MatSelectModule,
        MatOptionModule,
        MatDialogClose,
        MatNativeDateModule,
        MatMomentDateModule,
    ]
})
export class FormDialogComponent implements OnInit{
  action: string;
  userForm: UntypedFormGroup;
  //user: UserModel;
  url: string | null = null;

  public idOrganization =  0;
   public dataSourceOrganizations:any = []; 
  roles:any = [];
  changePass = false;

  langStoreValue?: string;

  formFileData = new FormData();
  fileName = '';

  fileChange = false;

  constructor(
    private languageService: LanguageService,private translate: TranslateService,
    private organizationService: OrganizacionService,private authService: AuthService,
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: string;  },
    private fb: FormBuilder,
    //private userService: AdvanceTableService  // asumiendo que maneja UserModel
  ) {

    this.action = data.action;

    if (this.action === 'edit') { //editar

   

    } else { 

    
      
    }

    this.userForm = this.createUserForm();

    if(this.action === 'add'){
      this.userForm.get('passwordPlain')?.enable();
      this.userForm.get('passwordPlainConfirm')?.enable();

      this.userForm.setValidators(
        this.matchPasswords('passwordPlain', 'passwordPlainConfirm')
      );

    }



   

  }
  ngOnInit(): void {

     //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){

      this.getOrganizations();

      this.organizationService.getRoles().then((resulex)=>{
        if(resulex.data){
        //console.log(resulex.data);
          this.roles = resulex.data;
        }
        
      });
    }
    else {

      console.log('this.authService.currentUserValue?.idOrganization: ', this.authService.currentUserValue?.idOrganization);

      this.getOrganizationById(this.authService.currentUserValue?.idOrganization);

      this.organizationService.getRolesByIdOrg(this.authService.currentUserValue?.idOrganization).then((resulex)=>{
        if(resulex.data){
        //console.log(resulex.data);
          this.roles = resulex.data;
          
        }
        
      });

    }

  }

  getOrganizations(): void {
    this.organizationService.getOrganizations()
        .then((response:any) => {
          //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getOrganizationById(idOrganization:any): void {
    this.organizationService.getOrganizationById(idOrganization)
      .then((response:any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        this.idOrganization = idOrganization;
      
        this.userForm.patchValue({ organizacionId: idOrganization });

        //this.getEmployeesByOrg();
        

      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }

  onOrganizationChange(selectedId: number) {
   //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID
    
    if(selectedId > 0){
      this.idOrganization = selectedId;
     
      

    }
    
  }

  formControl = new UntypedFormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.formControl.hasError('required')) {
      return 'Required field';
    }
    return this.formControl.hasError('email') ? 'Not a valid email' : '';
  }

  createUserForm(): UntypedFormGroup {
    return this.fb.group({
    
      changePass:   [this.changePass]
    }, {
      validators: this.matchPasswords('passwordPlain','passwordPlainConfirm')
    });

    
    
  }

  // Validador a nivel de grupo
  private matchPasswords(
  passwordKey: string,
  confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passCtrl    = group.get(passwordKey);
      const confirmCtrl = group.get(confirmKey);

      if (!passCtrl || !confirmCtrl) return null;
      // Si alguno está deshabilitado, no aplicamos la validación de igualdad
      if (passCtrl.disabled || confirmCtrl.disabled) return null;

      return passCtrl.value === confirmCtrl.value
        ? null
        : { passwordMismatch: true };
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  switchChangePass(event:any):void{

    //console.log('event: ', event)
    
    if(event.checked){
      this.changePass = true;
      this.userForm.get('passwordPlain')?.enable();
      this.userForm.get('passwordPlainConfirm')?.enable();
      
      this.userForm.setValidators(
      this.matchPasswords('passwordPlain', 'passwordPlainConfirm')
      );
      

    }
    else{
      this.changePass = false;
      this.userForm.get('passwordPlain')?.disable();
      this.userForm.get('passwordPlainConfirm')?.disable();
    }

    
    
  }

  submit() {
    if (this.userForm.invalid) {
      // chequea el error de mismatch
      if (this.userForm.hasError('passwordMismatch')) {
        // muestra un mensaje global o marca el campo confirm
      }
      return;
    }

    const formData = this.userForm.getRawValue();

    formData.imagenUrl = this.fileName;

    if (this.action === 'edit') {
    
     //console.log(formData);

    

    } else {

    
      
    }
  }

  onSelectFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) { return; }

    const file = input.files[0];

    /* 1) Vista previa (lo que ya haces) */
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.url = reader.result as string;
      this.userForm.patchValue({ imagenUrl: this.url });
    };

    /* 2) Envío al backend */
    const formData = new FormData();
    // El nombre **file** debe coincidir con .array('file', 1) en tu ruta Express
    formData.append('file', file, file.name);

    this.fileName = file.name;

    this.formFileData = formData;
    
    this.fileChange = true;

  }
    

}

