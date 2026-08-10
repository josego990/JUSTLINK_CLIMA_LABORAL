import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,
 } from '@angular/forms';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import {
  MatDialog,
  MatDialogConfig,
  //MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { OrganizacionService } from '../services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { DialogformEditOrganizationComponent } from '../dialogformeditorganization/dialogformeditorganization.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-crear-organizacion',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    BreadcrumbComponent,TranslateModule,MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRippleModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule
    

    ],
  
})
export class CrearOrganizacionComponent implements OnInit {
  public orgForm: FormGroup;
  public dialogRef?: MatDialogRef<CrearOrganizacionComponent> 

  public dataSourceOrganizations:any = [];
  public dataSourceCountries:any = [];
  isLoading = false;
  isSavingOrganization = false;
  langStoreValue?: string;
  displayedColumns: string[] = [
    'Id',
    'IdPais',
    'Nombre',
    'NIT',

    'Telefono',
    'CorreoContacto',
    'RepresentanteLegal',
    'SectorIndustria',
    'NumeroEmpleados',
    'Editar',
    'Borrar',


  ];

  constructor(private languageService: LanguageService,private translate: TranslateService,
    private fb: FormBuilder, private router: Router,
    private organizacionService: OrganizacionService,
    private dialogItemModel: MatDialog,
    
  ) {
    // Inicializamos el formulario y definimos validaciones:
    this.orgForm = this.fb.group({
      IdPais: [1, Validators.required],
      Nombre: ['', Validators.required],
      RazonSocial: [''],
      NIT: ['', Validators.required],
      Direccion: [''],
      Telefono: [''],
      CorreoContacto: ['', [Validators.email]],
      RepresentanteLegal: [''],
      SectorIndustria: [''],
      NumeroEmpleados: [0],
    });
  }

   existsRoute(routes: RouteInfo[], target: string): boolean {
      return routes.some(route =>
        route.path === target ||
        this.existsRoute(route.submenu, target)
      );
    }
  
  ngOnInit() {
  
      const stored = sessionStorage.getItem('routes');
      if (stored) {
        const routes: RouteInfo[] = JSON.parse(stored);
       //console.log('RUTAS DESDE sessionStorage:: ', routes);
  
        //buscar path
        const found = this.existsRoute(routes, '/organization/create');
       //console.log(found);
  
        if(!found){
          this.router.navigate(['/authentication/page404']);
        }
  
      }

     //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });
    this.getCountries();
    this.getOrganizations();
  }

  getOrganizations(): void {
    this.isLoading = true;
    this.organizacionService.getOrganizations()
        .then((response:any) => {
         //console.log('Organizaciones:', JSON.stringify(response.data));
          
          this.dataSourceOrganizations = response.data;
          this.isLoading = false;
        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
          this.isLoading = false;
        });
  }

  getCountries(): void {
    this.organizacionService.getCountries()
        .then((response:any) => {
         //console.log('Countries:', JSON.stringify(response.data));
          
          this.dataSourceCountries = response.data;
        })
        .catch((error:any) => {
          console.error('Error al obtener Countries:', error);
        });
  }

  onCountryChange(selectedId: number) {
    //console.log('Se seleccionó el pais con Id:', selectedId);

    const selectedCountry = this.dataSourceCountries.find((pais:any) => pais.Id  === selectedId);

    if(selectedCountry){
      
      console.log('pais:: ', selectedCountry);

    }
    
  }

  deleteOrganization(idOrganization:number): void {
    this.organizacionService.deleteOrganization(idOrganization)
    .then((response:any) => {
     //console.log(response);
      this.getOrganizations();
      Swal.fire({
        title: this.translate.instant('MENUITEMS.ORGANIZATION.SUCCESS'),
        text: this.translate.instant('MENUITEMS.ORGANIZATION.ORGDELETED'),
        icon: 'success',
      });      
    })
    .catch((error:any) => {
      console.error('Error al eliminar la organización:', error);
      Swal.fire({
        title: this.translate.instant('MENUITEMS.ORGANIZATION.SOMEWRONG'),
        text: this.translate.instant('MENUITEMS.ORGANIZATION.ERRDELETEORG') + 'Error: ' + error,
        icon: 'error',
      });
    });
  }

  // Enviar datos al servicio:
  onSubmit(): void {
    if (this.isSavingOrganization) {
      return;
    }

    if (this.orgForm.valid) {
     //console.log('CHORICITO!!', this.orgForm.value);

      this.isSavingOrganization = true;
      this.organizacionService.saveNewOrganization(this.orgForm.value)
        .then((response:any) => {
         //console.log('Organización creada:', response.data);
          this.getOrganizations();
          Swal.fire({
            title: this.translate.instant('MENUITEMS.ORGANIZATION.SUCCESS'),
            text: this.translate.instant('MENUITEMS.ORGANIZATION.ORGADDSUCCESS'),
            icon: 'success',
          });
          this.orgForm.reset();
        })
        .catch((error:any) => {
          console.error('Error al crear la organización:', error);
          Swal.fire({
            title: this.translate.instant('MENUITEMS.ORGANIZATION.SOMEWRONG'),
            text: this.translate.instant('MENUITEMS.ORGANIZATION.ERRCREATEORG') + 'Error: ' + error,
            icon: 'error',
          });

        })
        .finally(() => {
          this.isSavingOrganization = false;
        });

    } else {
      console.warn('Formulario inválido');
    }
  }

  deleteItem(item:any){
   //console.log('DELETE ITEM:: ', item);
    this.deleteOrganization(item.Id);
  }

   editItem(item:any){
   //console.log('DELETE ITEM:: ', item);
    //this.deleteOrganization(item.Id);

    //open dialoghe
    this.openDialogEditItems(item);


  }

  openDialogEditItems(item:any): void {
      //this.id_quiz_context = this.cardsData.indexOf(card);
    
      const dialogRef = this.dialogItemModel.open(DialogformEditOrganizationComponent, {
        width:  '95vw',
        maxWidth: '95vw',      // ⚠️ anula el 80 vw por defecto
        height: 'auto',         // o '100vh' si quieres pantalla completa
        disableClose: true,
        data: item
      });
    
      // ✅ Escuchar el cierre del diálogo
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
         this.getOrganizations();
        }
      });
    }

  // Cerrar sin guardar
  onCancel(): void {
    this.dialogRef?.close();
  }
}
