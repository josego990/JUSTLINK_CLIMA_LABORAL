import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Quiz, Field } from './models/quiz-models';

@Injectable({ providedIn: 'root' })
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  buildForm(formConfig: Quiz): FormGroup {
    const formGroup = this.fb.group({});

    const addField = (field: any) => {
      const validators = [];
      if (field.required) validators.push(Validators.required);

      // Inicialización por tipo
      let initial: any = null;

      switch (field.type) {
        case 'radio':
        case 'text':
        case 'iatext':
          initial = field.value ?? '';
          break;

        case 'slider':
          // valor numérico seguro: value -> min -> 0
          initial = Number(
            field.value ??
            field.min ??
            0
          );
          // opcional: límites como validadores si vienen
          if (field.min !== undefined) validators.push(Validators.min(Number(field.min)));
          if (field.max !== undefined) validators.push(Validators.max(Number(field.max)));
          break;

        default:
          initial = field.value ?? '';
          break;
      }

      formGroup.addControl(field.name, new FormControl(initial, validators));
    };

    // Soporta ambas estructuras: series a nivel raíz o dentro de GranFactores
    if (Array.isArray((formConfig as any).GranFactores)) {
      for (const gf of (formConfig as any).GranFactores) {
        for (const serie of gf.series ?? []) {
          for (const field of serie.fields ?? []) addField(field);
        }
      }
    } else if (Array.isArray((formConfig as any).series)) {
      for (const serie of (formConfig as any).series) {
        for (const field of serie.fields ?? []) addField(field);
      }
    }

    return formGroup;
  }
}


