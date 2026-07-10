import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

type DialogAction = 'add' | 'edit';

export interface ConfigFormValue {
  IdConfig: number;
  Nombre: string;
  Valor: string;
  Descripcion: string;
  Estado: boolean;
}

export interface ConfigDialogData {
  action?: DialogAction | string;
  config?: Record<string, unknown> | null;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
  ],
})
export class FormDialogComponent {
  action: DialogAction;
  dialogTitle: string;
  configForm: UntypedFormGroup;

  private config: ConfigFormValue;

  constructor(
    @Optional() public dialogRef: MatDialogRef<FormDialogComponent, ConfigFormValue | null> | null,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ConfigDialogData | null,
    private fb: FormBuilder
  ) {
    this.action = data?.action === 'edit' ? 'edit' : 'add';
    this.config = this.normalizeConfig(data?.config);
    this.dialogTitle = this.action === 'edit'
      ? `Editar ${this.config.Nombre || 'configuracion'}`
      : 'Nueva configuracion';
    this.configForm = this.createConfigForm();
  }

  submit(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    this.dialogRef?.close(this.getConfigFromForm());
  }

  onNoClick(): void {
    this.dialogRef?.close(null);
  }

  private createConfigForm(): UntypedFormGroup {
    return this.fb.group({
      IdConfig: [{ value: this.config.IdConfig, disabled: true }],
      Nombre: [this.config.Nombre, [Validators.required, Validators.maxLength(100)]],
      Valor: [this.config.Valor, [Validators.required]],
      Descripcion: [this.config.Descripcion],
      Estado: [this.config.Estado],
    });
  }

  private getConfigFromForm(): ConfigFormValue {
    const value = this.configForm.getRawValue();

    return {
      IdConfig: this.toNumber(value.IdConfig),
      Nombre: String(value.Nombre ?? '').trim(),
      Valor: String(value.Valor ?? ''),
      Descripcion: String(value.Descripcion ?? '').trim(),
      Estado: this.toBoolean(value.Estado),
    };
  }

  private normalizeConfig(row?: Record<string, unknown> | null): ConfigFormValue {
    const source = row ?? {};

    return {
      IdConfig: this.toNumber(source['IdConfig'] ?? source['idConfig'] ?? source['id']),
      Nombre: String(source['Nombre'] ?? source['nombre'] ?? ''),
      Valor: String(source['Valor'] ?? source['valor'] ?? ''),
      Descripcion: String(source['Descripcion'] ?? source['descripcion'] ?? ''),
      Estado: this.toBoolean(source['Estado'] ?? source['estado']),
    };
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return ['true', '1', 'si', 'sí'].includes(normalized);
    }

    return !!value;
  }
}
