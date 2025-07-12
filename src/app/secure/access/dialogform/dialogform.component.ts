
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,UntypedFormBuilder,
 } from '@angular/forms';


import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '@core';

@Component({
  selector: 'app-dialogform',
  templateUrl: './dialogform.component.html',
  styleUrls: ['./dialogform.component.scss'],
  imports: [

    MatDialogModule,
    MatTableModule,
    MatIconModule,TranslateModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,

    

    ],
})
// Aquí se crea el nuevo quiz
export class DialogformComponent implements OnInit {

  public idOrganization =  0;
  public organizationName = '';
  public dataSourceOrganizations:any = [];



  public categories = [{}];
  public selectedCategory = '';
  public selectedUnits = '';
  categoriesList: string[] = [];

  unitList: string[] = [];
  totalQuestionsSelected = 0;

  public rname = '';
  public rdesc = '';
  public addCusForm!: UntypedFormGroup;

  langStoreValue?: string;

  constructor(
    private languageService: LanguageService,private translate: TranslateService,
    private fb: UntypedFormBuilder, private authService: AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogformComponent>, 
    private organizacionService: OrganizacionService,

    ) {


    }

  public ngOnInit(): void {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    this.addCusForm = this.fb.group({
      IdOrganization: [this.idOrganization, Validators.required],
      Nombre: [this.rname, [Validators.required]],
      Descripcion: [this.rdesc, [Validators.required]],

    });

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){

      this.getOrganizations();

    }
    else {

      //validar permisos de acciones
      //const permisoexport = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === 'exportdash');
      //const permisofilter = this.authService.currentUserValue?.permissions.find((p: { ActionCode: string; }) => p.ActionCode === '"filterdash"');

      //console.log('permisoexport',permisoexport);

      /*
      if(permisoexport){
        this.accessToExport = true;
        this.btnDisabled = false;
      }else{
        this.accessToExport = false;
        this.btnDisabled = true;
      }

      if(permisofilter){
        this.accessToFilter = true;
        //this.btnDisabled = false;
      }else{
        this.accessToFilter = false;
        //this.btnDisabled = true;
      }
      */

      console.log('this.authService.currentUserValue?.idOrganization: ', this.authService.currentUserValue?.idOrganization);

      this.getOrganizationById(this.authService.currentUserValue?.idOrganization);


    }


  }

  getOrganizations(): void {
    this.organizacionService.getOrganizations()
        .then((response:any) => {
          //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getOrganizationById(idOrganization:any): void {
    this.organizacionService.getOrganizationById(idOrganization)
      .then((response:any) => {
        ////console.log('Organizaciones:', JSON.stringify(response.data));
        
        this.dataSourceOrganizations = response.data;

        this.idOrganization = idOrganization;
      
        this.addCusForm.patchValue({ IdOrganization: idOrganization });

        //this.getEmployeesByOrg();
        

      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }

  onSubmitClick():void{
    if(this.addCusForm.valid){

      const roleData = {
        nameRole: this.addCusForm.get('Nombre')?.value,
        descRole: this.addCusForm.get('Descripcion')?.value,
        idOrganization: this.idOrganization
      }

      this.organizacionService.saveRole(roleData).then((resultex)=>{
        if(resultex.data){
          this.dialogRef.close(true);
        }
      }).catch((err)=>{
        console.error(err);
      })
      
    }
  }

  closeDialog():void{
    this.dialogRef.close();
  }
}
