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
  selector: 'app-dialogchangerange',
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
  <form id="form_textarea" [formGroup]="addItemForm!">
    <div mat-dialog-content>
      <mat-form-field class="example-full-width" appearance="outline">
        <mat-label>Valor mínimo</mat-label>
        <input matInput formControlName="min" required>
        <mat-error *ngIf="addItemForm.controls?.['min']?.hasError('required')">
          Por favor ingrese el valor mínimo
        </mat-error>
      </mat-form-field>

      <mat-form-field class="example-full-width" appearance="outline">
        <mat-label>Valor máximo</mat-label>
        <input matInput formControlName="max" required>
        <mat-error *ngIf="addItemForm.controls?.['max']?.hasError('required')">
          Por favor ingrese el valor máximo
        </mat-error>
      </mat-form-field>
      
    </div>
    <div mat-dialog-actions>
      <button class="btn-space" mat-raised-button color="primary" (click)="guardaItem()" style="border-radius: 5px;">Guardar</button>
      <button style="color:#91a1a4; border-radius: 5px;" type="button" mat-button (click)="closeDialog()">Cerrar</button>
    </div>
  </form>
</div>
`,
  
})
export class DialogChangeRangeComponent implements OnInit {

      public addItemForm!: UntypedFormGroup;
  public options: { idPregunta: number; min: number; max: number };
  public idPregunta = 0;

  constructor(private fb: UntypedFormBuilder, private organizacionService: OrganizacionService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogChangeRangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

   console.log('data al abrir el dialog change ranges:: ', data);
    this.options = data;
    this.idPregunta = data.idPregunta;

  }


  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      min: [this.options.min, [Validators.required]],
      max: [this.options.max, [Validators.required]],
    });
  }

  closeDialog(): void {
    //this.options = null;
    this.dialogRef.close();
  }

  guardaItem() {
    if(this.addItemForm.valid) {

       const data_send:any = {
            IdPregunta: this.data.Id, 
            Min: this.addItemForm.value.min,
            Max: this.addItemForm.value.max
        }

        console.log('datatosend;:: ', data_send);

        /**/
        this.organizacionService.updatePreguntaRango(data_send).then((respenx:any)=> {

            if(respenx && respenx.data.message == 'success'){
                this.showNotification(
                    'bg-green',
                    'Se Modificó el rango',
                    'bottom',
                    'right'
                );

                this.data.min = this.addItemForm.value.min;
                this.data.max = this.addItemForm.value.max;
            }

        }).catch((err)=>{
            this.showNotification(
                    'bg-green',
                    'Error al agregar el valor. ' + err,
                    'bottom',
                    'right'
                );
        });
        
     
      
      
    }
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
