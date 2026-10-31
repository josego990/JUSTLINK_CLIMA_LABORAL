import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';

import { FormBuilder, Validators,
  ReactiveFormsModule, UntypedFormGroup
 } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OrganizacionService } from '../services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { Router } from '@angular/router';
import { AuthService } from '@core';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { DemoLimitsService } from 'app/config/demo-limits.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-demograficos-organizacion',
  templateUrl: './demograficos.component.html',
  styleUrls: ['./demograficos.component.scss'],

  imports: [
    BreadcrumbComponent,
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    CommonModule,
    TranslateModule,
],
})
export class CrearDemograficosComponent implements OnDestroy, OnInit {
  @ViewChild('createDemographicDialog') createDemographicDialog?: TemplateRef<unknown>;

  public demograficosForm: UntypedFormGroup;
  public dialogRef?: MatDialogRef<unknown>;

  public dataSourceOrganizations:any = [];
  public dataSourceDemograficos:any = [];
  public idOrganization =  0;
  file: File | null = null;
  public selectedFile = {};
  public isButtonDisabled: boolean = true;
  public isSavingDemografico = false;
  private selectedOrganizationSubscription?: Subscription;

   langStoreValue?: string;

  displayedColumns: string[] = [
    'Id',
    'NombreCampo',
    'TipoDato',
    'FechaCreacion',
    'Estado',
    'Acciones'
  ];

  constructor(
    private fb: FormBuilder,private router: Router,private authService: AuthService,
    private organizacionService: OrganizacionService,private languageService: LanguageService,private translate: TranslateService,
    private demoLimitsService: DemoLimitsService,
    private dialog: MatDialog,

  ) {
    // Inicializamos el formulario y definimos validaciones:
    this.demograficosForm = this.fb.group({
      IdOrganizacion: [{ value: this.idOrganization, disabled: true }],
      NombreCampo: ['', Validators.required],
    });


  }

  existsRoute(routes: RouteInfo[], target: string): boolean {
    return routes.some(route =>
      route.path === target ||
      this.existsRoute(route.submenu, target)
    );
  }

  ngOnInit() {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

   //console.log('CURRENT USER DESDE EMPLOYEE:: ', this.authService.currentUserValue);

    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
     console.log('RUTAS DESDE sessionStorage:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/organization/demograficos');
     //console.log(found);

      if(!found){
        this.router.navigate(['/authentication/page404']);
      }

    }

     if(this.authService.currentUserValue?.roles[0].roleName !== 'admin') {

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
    }

    this.setupSelectedOrganizationListener();
    //this.getOrganizations()
    //this.getEmployeesByOrg();
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.dataSourceOrganizations = [];
        this.idOrganization = 0;
        this.demograficosForm.get('IdOrganizacion')?.setValue(null);
        this.dataSourceDemograficos = [];
        this.isButtonDisabled = true;
        return;
      }

      this.dataSourceOrganizations = [organization];

      if (this.idOrganization === organization.Id) {
        return;
      }

      this.onOrganizationChange(organization.Id);
    });
  }

  onOrganizationChange(selectedId: number) {
   //console.log('Se seleccionó el la organización con Id:', selectedId);
    // Aquí haces lo que necesites con el ID

    if(selectedId > 0){
      this.idOrganization = selectedId;
      this.demograficosForm.get('IdOrganizacion')?.setValue(selectedId);
      this.getDemograficosByOrg();
      this.isButtonDisabled = false;
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

  isActive(v: any): boolean {
  return v === true || v === 1 || v === '1' || v === 'true' || v === 'TRUE' || v === 'Activo' || v === 'ACTIVO';
}

  getOrganizationById(idOrganization:any): void {
    this.organizacionService.getOrganizationById(idOrganization)
        .then((response:any) => {
          ////console.log('Organizaciones:', JSON.stringify(response.data));

          this.dataSourceOrganizations = response.data;

          this.idOrganization = idOrganization;


          //this.getEmployeesByOrg();
          this.getDemograficosByOrg();


        })
        .catch((error:any) => {
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getDemograficosByOrg(): void {
    if (!this.idOrganization) {
      this.dataSourceDemograficos = [];
      return;
    }

    this.organizacionService.getDemograficos(this.idOrganization)
      .then((response:any) => {
        //console.log('Empleados:', JSON.stringify(response.data));

        this.dataSourceDemograficos = response.data;
      })
      .catch((error:any) => {
        console.error('Error al obtener organizaciones:', error);
      });
  }

  openCreateDemographicDialog(): void {
    if (!this.idOrganization || !this.createDemographicDialog) {
      return;
    }

    this.demograficosForm.reset({
      IdOrganizacion: this.idOrganization,
      NombreCampo: '',
    });
    this.demograficosForm.markAsPristine();
    this.demograficosForm.markAsUntouched();

    this.dialogRef = this.dialog.open(this.createDemographicDialog, {
      width: 'min(560px, calc(100vw - 32px))',
      maxWidth: '96vw',
      panelClass: 'demographic-dialog-panel',
      autoFocus: false,
      restoreFocus: true,
      disableClose: this.isSavingDemografico,
    });
  }

  closeCreateDemographicDialog(): void {
    if (this.isSavingDemografico) {
      return;
    }

    this.dialogRef?.close();
    this.dialogRef = undefined;
  }

  deleteDemografico(idDemografico:number): void {
    this.organizacionService.deleteDemografico(idDemografico)
    .then((response:any) => {
     //console.log(response);
      this.getDemograficosByOrg();
      Swal.fire({
                  title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.SUCCESS'),
                  text: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.FIELDDEACTIVATE'),
                  icon: 'success',
                });
    })
    .catch((error:any) => {
      console.error('Error al eliminar campo:', error);
      Swal.fire({
        title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERROR'),
        text:  this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERRORMESSAGE') + 'Error: ' + error,
        icon: 'error',
      });
    });
  }

  activeDemografico(idDemografico:number): void {
    this.organizacionService.activeDemografico(idDemografico)
    .then((response:any) => {
     //console.log(response);
      this.getDemograficosByOrg();
      Swal.fire({
        title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.SUCCESS'),
        text: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.FIELDACTIVATE'),
        icon: 'success',
      });
    })
    .catch((error:any) => {
      console.error('Error al activar campo:', error);
      Swal.fire({
       title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERROR'),
        text:  this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERRORMESSAGE') + 'Error: ' + error,
        icon: 'error',
      });
    });
  }

  // Enviar datos al servicio:
  onSubmit(): void {
    if (this.isSavingDemografico) {
      return;
    }

    if (this.demograficosForm.valid) {
      const currentDemographics = Array.isArray(this.dataSourceDemograficos)
        ? this.dataSourceDemograficos.length
        : 0;
      const demographicLimit = this.demoLimitsService.getLimit('maxDemographicsPerOrganization');

      if (this.demoLimitsService.exceedsLimit(
        'maxDemographicsPerOrganization',
        currentDemographics,
      )) {
        Swal.fire({
          title: 'Limite demo alcanzado',
          text:
            `Solo se puede ingresar ${demographicLimit} campos demograficos en esta demo.` +
            ` Actualmente existen ${currentDemographics} registrados.`,
          icon: 'warning',
        });
        return;
      }

      this.isSavingDemografico = true;
      this.organizacionService.saveNewDemografico(this.demograficosForm.value, this.idOrganization)
        .then((response:any) => {
         //console.log('Campo creado?:', response.data);
          this.getDemograficosByOrg();
          this.demograficosForm.reset({
            IdOrganizacion: this.idOrganization,
            NombreCampo: '',
          });
          this.dialogRef?.close();
          this.dialogRef = undefined;
          Swal.fire({
            title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.SUCCESS'),
            text: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.FIELDADDED'),
            icon: 'success',
          });
        })
        .catch((error:any) => {
          console.error('Error al crear campo:', error.response.data.error);
          Swal.fire({
           title: this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERROR'),
            text:  this.translate.instant('MENUITEMS.DEMOGRAPHICS.MESSAGES.ERRORMESSAGE') + 'Error: ' + error,
            icon: 'error',
          });
        })
        .finally(() => {
          this.isSavingDemografico = false;
        });

    } else {
      console.warn('Formulario inválido');
      this.demograficosForm.markAllAsTouched();
    }
  }

  deleteItem(item:any){
   //console.log('DELETE ITEM:: ', item);


    if (item.Estado === true) {
      // Acción de desactivación
      this.deleteDemografico(item.Id);
    } else {
      // Acción de reactivación
      this.activeDemografico(item.Id);
    }

  }


  parseFechaManual(fechaTexto: string): string | null {
    if (!fechaTexto || typeof fechaTexto !== 'string') {
      console.warn('Fecha vacía o no es string:', fechaTexto);
      return null;
    }

    const partes = fechaTexto.split('/');
    if (partes.length !== 3) {
      console.warn('La fecha no tiene 3 partes:', fechaTexto);
      return null;
    }

    const [diaStr, mesStr, anioStr] = partes;

    const dia = parseInt(diaStr, 10);
    const mes = parseInt(mesStr, 10) - 1;
    const anio = parseInt(anioStr, 10);

    const fecha = new Date(anio, mes, dia);

    if (isNaN(fecha.getTime())) {
      console.warn('La fecha es inválida:', fechaTexto, fecha);
      return null;
    }

    // Retornar formato YYYY-MM-DD
    return fecha.toISOString().split('T')[0];
  }






}
