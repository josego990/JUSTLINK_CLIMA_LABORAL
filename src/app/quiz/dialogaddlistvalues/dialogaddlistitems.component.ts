import { Component, OnInit } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonModule, DatePipe } from '@angular/common'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, FormsModule,

  ReactiveFormsModule, UntypedFormGroup, UntypedFormControl,UntypedFormBuilder,
 } from '@angular/forms';
 import { OrganizacionService } from '../../organization/services/organizacion.service';
 import {
  MAT_DATE_LOCALE,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar'; 



@Component({
  selector: 'app-dialogaddlistitems',
  imports: [
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatExpansionModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRippleModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    MatProgressSpinnerModule,
    
    MatInputModule
  ],

  template: `
  <div >
  <h1 mat-dialog-title>Agregar valores a la lista</h1>
  <form id="form_textarea" [formGroup]="addItemForm!" (ngSubmit)="guardaItem()">
    <div mat-dialog-content>
      <mat-form-field class="example-full-width" appearance="outline">
        <mat-label>Nombre del campo</mat-label>
        <input matInput formControlName="ilabel" required>
        <mat-error *ngIf="addItemForm.controls?.['ilabel']?.hasError('required')">
          Por favor ingrese el nombre del Item
        </mat-error>
      </mat-form-field>
      
    </div>
    <div mat-dialog-actions>
      <button
        class="btn-space"
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="isSaving"
        style="border-radius: 5px; min-width: 112px;">
        <mat-progress-spinner *ngIf="isSaving; else saveLabel" diameter="18" mode="indeterminate"></mat-progress-spinner>
        <ng-template #saveLabel>Guardar</ng-template>
      </button>
      <button
        style="color: #91a1a4; border-radius: 5px"
        type="button"
        mat-button
        [disabled]="isSaving"
        (click)="closeDialog()">Cerrar</button>
    </div>
  </form>
</div>
`,
  
})
export class DialogAddListItemsComponent implements OnInit {

      public addItemForm!: UntypedFormGroup;
  public options: { label: string; value: string; name: string; is_correct: boolean }[] = [];
  public idPregunta = 0;
  public isSaving = false;

  constructor(private fb: UntypedFormBuilder, private organizacionService: OrganizacionService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAddListItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

   console.log('data al abrir el dialog: ', data);
    this.options = data.options;
    this.idPregunta = data.idPregunta;

  }


  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      ilabel: ['',
      [Validators.required]],
      is_correct: false
    });
  }

  closeDialog(): void {
    console.log('ESTO NO DEBERIA IMPRIMIRSE NUNCA!');

    this.options = [];
    this.dialogRef.close();
  }

  guardaItem(): void {
    if (this.isSaving) {
      return;
    }

    if (!this.addItemForm.valid) {
      this.addItemForm.markAllAsTouched();
      return;
    }

    const optionNumber = this.options.length + 1;
    const data_send:any = {
      IdPregunta: this.idPregunta,
      Valor: 'opt_' + optionNumber.toString(),
      Etiqueta: this.addItemForm.value.ilabel
    };

    this.isSaving = true;
    this.dialogRef.disableClose = true;

    this.organizacionService.insertPreguntaOpcion(data_send).then((respenx:any)=> {
      if (respenx?.data?.message === 'success') {
        const createdOption = {
          value: data_send.Valor,
          label: data_send.Etiqueta,
          name: data_send.Valor,
          is_correct: this.addItemForm.value.is_correct,
        };

        this.options.push(createdOption);
        this.showNotification(
          'bg-green',
          'Se agregó el valor a la lista',
          'bottom',
          'right'
        );
        this.dialogRef.close({ created: true, option: createdOption });
        return;
      }

      this.showNotification(
        'bg-red',
        'No fue posible agregar el valor a la lista.',
        'bottom',
        'right'
      );
    }).catch((err)=>{
      this.showNotification(
        'bg-red',
        'Error al agregar el valor. ' + err,
        'bottom',
        'right'
      );
    }).finally(() => {
      this.isSaving = false;
      this.dialogRef.disableClose = false;
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }


}
