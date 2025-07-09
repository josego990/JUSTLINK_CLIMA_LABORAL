/*
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quiz, Field, FieldOption } from './models/quiz-models';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  // JJG Método para construir un formulario dinámico a partir de un JSON
  buildForm(formConfig: Quiz): FormGroup {
    const formGroup = this.fb.group({});

    formConfig.fields.forEach((field: Field) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'checkboxes') {

        field.options.forEach((option: FieldOption) => {
          formGroup.addControl(field.name +"_"+ option.name, this.fb.control('', null));
        });


      }
      else {
        formGroup.addControl(field.name, this.fb.control('', validators));
      }


    });

    return formGroup;
  }
}
  */

// form-builder.service.ts

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quiz, Field } from './models/quiz-models';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  buildForm(formConfig: Quiz): FormGroup {
    const formGroup = this.fb.group({});

    formConfig.series.forEach((serie) => {
      serie.fields.forEach((field: Field) => {
        const validators = [];
        if (field.required) {
          validators.push(Validators.required);
        }
        formGroup.addControl(field.name, this.fb.control('', validators));
      });
    });

    return formGroup;
  }
}

