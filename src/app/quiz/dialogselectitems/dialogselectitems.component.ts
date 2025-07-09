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
  selector: 'app-dialogselectitems',
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
        <mat-label>Nombre del campo</mat-label>
        <input matInput formControlName="ilabel" required>
        <mat-error *ngIf="addItemForm.controls?.['ilabel']?.hasError('required')">
          Por favor ingrese el nombre del Item
        </mat-error>
      </mat-form-field>
      <mat-checkbox class="example-margin" formControlName="is_correct">
        ¿Es respuesta correcta?
      </mat-checkbox>
    </div>
    <div mat-dialog-actions>
      <button class="btn-space" mat-raised-button color="primary" (click)="guardaItem()">Guardar</button>
      <button style="color:#91a1a4;" type="button" mat-button (click)="closeDialog()">Cerrar</button>
    </div>
  </form>
</div>
`,
  styleUrls: ['./dialogselectitems.component.scss'],
})
export class DialogSelectItemsComponent implements OnInit {
  constructor(private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogSelectItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

    console.log(data);
    this.options = data;

  }
  public addItemForm!: UntypedFormGroup;
  public options: { label: string; value: string; name: string; is_correct: boolean }[] = [];

  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      ilabel: ['',
      [Validators.required]
    ],
    is_correct: false
    });
  }

  closeDialog(): void {
    this.options = [];
    this.dialogRef.close();
  }

  guardaItem() {
    if(this.addItemForm.valid) {
      this.options.push({
        value: 'opt_' + (this.options.length + 1).toString(),
        label: this.addItemForm.value.ilabel,
        name: 'opt_' + (this.options.length + 1).toString(),
        is_correct: this.addItemForm.value.is_correct
      });
      this.showNotification(
        'bg-red',
        'Se guardó el valor',
        'bottom',
        'right'
      );
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
