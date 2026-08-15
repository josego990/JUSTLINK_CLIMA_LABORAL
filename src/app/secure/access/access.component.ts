import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule,
  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,
 } from '@angular/forms';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  MatDialog,
  MatDialogConfig,
  //MatDialogRef,
} from "@angular/material/dialog";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
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
import { DialogformComponent } from './dialogform/dialogform.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouteInfo } from 'app/layout/sidebar/sidebar.metadata';
import { AuthService } from '@core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-organizacion',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    BreadcrumbComponent,TranslateModule,
    MatDialogModule,
    MatTableModule,MatSlideToggleModule,
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
    MatButtonModule,
    MatProgressSpinnerModule
    

    ],
  
})
export class AccessComponent implements OnDestroy, OnInit {
  public dialogRef?: MatDialogRef<AccessComponent> 

  public rolesAccess:any = [];
  public isLoadingRoles = false;

  langStoreValue?: string;
  private selectedOrganizationSubscription?: Subscription;
  private rolesAccessRequestId = 0;


  constructor(private languageService: LanguageService,private translate: TranslateService,
    private fb: FormBuilder, private dialogModel: MatDialog, //dialog para agregar quiz
    private organizacionService: OrganizacionService,private snackBar: MatSnackBar,
    private router: Router, private authService: AuthService,
    
  ) {
   
  }

  existsRoute(routes: RouteInfo[], target: string): boolean {
    return routes.some(route =>
      route.path === target ||
      this.existsRoute(route.submenu, target)
    );
  }

  ngOnInit(): void {

    const stored = sessionStorage.getItem('routes');
    if (stored) {
      const routes: RouteInfo[] = JSON.parse(stored);
      //console.log('RUTAS DESDE sessionStorage:: ', routes);

      //buscar path
      const found = this.existsRoute(routes, '/secure/access');
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

    //this.getRolesAccess();

    if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){
      this.selectedOrganizationSubscription = this.organizacionService.selectedOrganization$
        .subscribe((organization) => {
          const idOrganization = Number(
            organization?.Id ?? this.authService.currentUserValue?.idOrganization
          );

          if (Number.isInteger(idOrganization) && idOrganization > 0) {
            this.getRolesAccess(idOrganization);
            return;
          }

          ++this.rolesAccessRequestId;
          this.rolesAccess = [];
          this.isLoadingRoles = false;
        });

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

      this.getRolesAccessByIdOrg(this.authService.currentUserValue?.idOrganization);


    }
    
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  getRolesAccess(idOrganization?: number): void {
    const requestId = ++this.rolesAccessRequestId;
    this.rolesAccess = [];
    this.isLoadingRoles = true;

    const organizationId = Number(
      idOrganization ??
      this.organizacionService.selectedOrganizationSnapshot?.Id ??
      this.authService.currentUserValue?.idOrganization
    );

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      this.isLoadingRoles = false;
      return;
    }

    this.organizacionService.getRolesAccess(organizationId)
        .then((response:any) => {
          if (requestId !== this.rolesAccessRequestId) {
            return;
          }

          this.rolesAccess = Array.isArray(response?.data) ? response.data : [];
          this.isLoadingRoles = false;
        })
        .catch((error:any) => {
          if (requestId === this.rolesAccessRequestId) {
            this.rolesAccess = [];
            this.isLoadingRoles = false;
          }
          console.error('Error al obtener organizaciones:', error);
        });
  }

  getRolesAccessByIdOrg(idOrganization:any): void {
    const requestId = ++this.rolesAccessRequestId;
    this.rolesAccess = [];
    this.isLoadingRoles = true;

    const organizationId = Number(idOrganization);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      this.isLoadingRoles = false;
      return;
    }

    this.organizacionService.getRolesAccessByIdOrg(organizationId)
        .then((response:any) => {
          if (requestId !== this.rolesAccessRequestId) {
            return;
          }

          this.rolesAccess = Array.isArray(response?.data) ? response.data : [];
          this.isLoadingRoles = false;
        })
        .catch((error:any) => {
          if (requestId === this.rolesAccessRequestId) {
            this.rolesAccess = [];
            this.isLoadingRoles = false;
          }
          console.error('Error al obtener organizaciones:', error);
        });
  }

  openDialogNewRol(): void {
      const selectedOrganization = this.organizacionService.selectedOrganizationSnapshot;

      if (!selectedOrganization?.Id) {
        void Swal.fire(
          this.translate.instant('MENUITEMS.SECURE.ROLE_ORGANIZATION_REQUIRED_TITLE'),
          this.translate.instant('MENUITEMS.SECURE.ROLE_ORGANIZATION_REQUIRED_TEXT'),
          'warning'
        );
        return;
      }

      const dialogRef = this.dialogModel.open(DialogformComponent, {
        width: '720px',
        maxWidth: '95vw',
        height: 'auto',
        disableClose: false,
        data: {
          idOrganization: selectedOrganization.Id,
          organizationName: selectedOrganization.Nombre,
        },
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
           //console.log('SE HA OBTENIDO EL EVENTO DE CIERRE DEL DIALOG AGREGAR ROL');
            
          if(this.authService.currentUserValue?.roles[0].roleName === 'admin'){

            this.getRolesAccess(selectedOrganization.Id);

          }
          else {

            this.getRolesAccessByIdOrg(selectedOrganization.Id)
          }
        }
      });
      
    }

    showNotification(
      colorName: string,
      text: string,
      placementFrom: MatSnackBarVerticalPosition,
      placementAlign: MatSnackBarHorizontalPosition
    ) {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName,
      });
    }


  // Enviar datos al servicio:
  onToggleAccess(roleId: number, actionId: number, granted: boolean) {
    // Llamas al API para actualizar RoleMenuAction…
    //his.myService.updateRoleAccess(roleId, actionId, granted).subscribe();

   //console.log('TOGGLE:: ', roleId + ' ' + actionId + ' ' + granted);

    const updRoleAccessData = {
      roleId: roleId,
      actionId: actionId,
      granted: granted
    }

    this.organizacionService.updateRoleAccess(updRoleAccessData).then((resules)=>{

     //console.log(resules);
      if(resules.data){

        this.showNotification(
          'snackbar-success',
          'Modificado con éxito',
          'bottom',
          'center'
        );

      }
    }).catch((err)=>{
      console.error(err);
       this.showNotification(
          'snackbar-danger',
          err,
          'bottom',
          'center'
        );
    })

  }

  deleteItem(item:any){
   //console.log('DELETE ITEM:: ', item);
    //this.deleteOrganization(item.Id);
  }

  // Cerrar sin guardar
  onCancel(): void {
    this.dialogRef?.close();
  }
}
