
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
    private fb: UntypedFormBuilder, 
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

      Nombre: [this.rname, [Validators.required]],
      Descripcion: [this.rdesc, [Validators.required]],

    });


  }

  onSubmitClick():void{
    if(this.addCusForm.valid){
      const roleData = {
        nameRole: this.addCusForm.get('Nombre')?.value,
        descRole: this.addCusForm.get('Descripcion')?.value,
        
      }
      this.organizacionService.saveRole(roleData).then((resultex)=>{
        if(resultex.data){
          this.dialogRef.close(true);
        }
      }).catch((err)=>{

      })
    }
  }

  closeDialog():void{}
}
