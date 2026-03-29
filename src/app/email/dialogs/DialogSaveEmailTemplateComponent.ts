import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import Swal from 'sweetalert2';
import { AuthService } from '@core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';




@Component({
  selector: 'app-dialog-save-email-template',
  standalone: true,
  imports: [
    CommonModule,MatSelectModule,MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
  <div>
  <h1 mat-dialog-title>{{ data?.TemplateId ? 'Editar plantilla' : 'Guardar plantilla' }}</h1>

  <form [formGroup]="form!">
    <div mat-dialog-content style="position: relative;">

      <!-- Overlay Loading -->
      <div
        *ngIf="saving"
        style="
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 8px;
        "
      >
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <mat-progress-spinner diameter="44" mode="indeterminate"></mat-progress-spinner>
          <span style="color:#6b7c80; font-size: 12px;">
            {{ saving ? 'Guardando...' : 'Cargando...' }}
          </span>
        </div>
      </div>

      

      <mat-form-field class="example-full-width" appearance="outline">
        <mat-label>Nombre de la plantilla</mat-label>
        <input
          matInput
          formControlName="Nombre"
          maxlength="64"
          autocomplete="off"
          [disabled]="saving"
        />
        <mat-hint>{{ form.value?.Nombre?.length || 0 }}/64</mat-hint>
        <mat-error *ngIf="form.controls?.['Nombre']?.hasError('required')">
          Por favor ingrese el nombre de la plantilla
        </mat-error>
      </mat-form-field>

   

      <div *ngIf="data?.showHtmlPreview" style="margin-top:16px;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-weight:600; color:#344;">
            Vista previa (solo lectura)
          </span>
          <span style="font-size:12px; color:#6b7c80;">
            {{ (data?.HtmlBody?.length || 0) | number }} caracteres
          </span>
        </div>

        <div style="border: 1px solid #e6ecee; border-radius: 8px; padding: 10px; margin-top: 8px; max-height: 180px; overflow:auto;">
          <pre style="margin:0; font-size:12px; white-space: pre-wrap; word-break: break-word;">{{ data?.HtmlBody }}</pre>
        </div>
      </div>

    </div>

    <div mat-dialog-actions>
      <button
        class="btn-space"
        mat-raised-button
        color="primary"
        (click)="guardar()"
        style="border-radius: 5px;"
        [disabled]="form.invalid || saving || loadingOrganizations"
      >
        {{ saving ? 'Guardando...' : 'Guardar' }}
      </button>

      <button
        style="color: #91a1a4; border-radius: 5px"
        type="button"
        mat-button
        (click)="closeDialog()"
        [disabled]="saving"
      >
        Cerrar
      </button>
    </div>
  </form>
</div>

  `
})
export class DialogSaveEmailTemplateComponent implements OnInit {
  public form!: UntypedFormGroup;
  public saving = false;
  public loadingOrganizations = false;
  public loadingSaving = false;
  public dataSourceOrganizations:any = [];
  public idOrganization =  0;
  public nombreOrganizacion = '';

  constructor(
    private organizationService: OrganizacionService,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DialogSaveEmailTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {

    console.log('datos recibidos:: ', this.data);

    // data esperado:
    // {
    //   TemplateId?: number,
    //   IdOrganizacion: number,
    //   Nombre?: string,
    //   Asunto?: string,
    //   IsActive?: boolean,
    //   HtmlBody?: string,           // opcional (ya lo tienes desde grapes)
    //   showHtmlPreview?: boolean    // opcional
    // }

    this.form = this.fb.group({
      //IdOrganizacion: [this.data?.IdOrganizacion] || v ,
      Nombre: [this.data?.Nombre || '', [Validators.required]],
      //Asunto: [this.data?.Asunto || '', [Validators.required]],
      IsActive: [typeof this.data?.IsActive === 'boolean' ? this.data.IsActive : true],
    });

  }


  closeDialog(): void {
    this.dialogRef.close(null);
  }

  private generateGuid(): string {
    if (globalThis?.crypto?.randomUUID) {
      return globalThis.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const random = Math.random() * 16 | 0;
      const value = char === 'x' ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.saving = true;
    const currentCode = String(this.data?.Code ?? '').trim();

    const payload = {
      TemplateId: this.data?.TemplateId || 0,
      IdOrganizacion: this.data?.IdOrganizacion,
      Nombre: this.form.value.Nombre,
      Asunto: 'asunto',
      IsActive: true,
      HtmlBody: this.data?.HtmlBody,

      IdFlujo: this.data?.IdFlujo,
      IdEval: 0, //this.data?.IdEval,
      Code: currentCode || this.generateGuid(),
      IsDefault: this.form.value.IsActive,
      User: 'user'

    };

    console.log(payload);

    /* */
    this.organizationService.insertEmailTemplate(payload).then((restilxelxx:any)=>{
      console.log('restilsxelxx:: ', restilxelxx);

      if(restilxelxx.data.message === 'success') {
        Swal.fire({
              icon: 'success',
              title: 'Guardado',
              text: 'Se ha guardado con éxito la plantilla.'
            });

         this.dialogRef.close(payload);
      } 
      else { 
         Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al guardar la plantilla'
            });
      }

    }).catch((err)=>{
      console.error(err);

      //showNotification here..1


    });
   

    // No llamo al service aquí porque depende de tu estructura;
    // lo normal es cerrar devolviendo el payload y que el componente padre llame al API.
   
  }
}
