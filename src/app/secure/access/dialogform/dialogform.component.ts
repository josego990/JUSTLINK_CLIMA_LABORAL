
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';


import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface CreateRoleDialogData {
  idOrganization: number;
  organizationName: string;
}

@Component({
  selector: 'app-dialogform',
  templateUrl: './dialogform.component.html',
  styleUrls: ['./dialogform.component.scss'],
  imports: [
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
// Aquí se crea el nuevo quiz
export class DialogformComponent implements OnInit {

  public idOrganization =  0;
  public organizationName = '';

  public rname = '';
  public rdesc = '';
  public addCusForm!: UntypedFormGroup;
  public isSaving = false;
  langStoreValue?: string;

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DialogformComponent>,
    private organizacionService: OrganizacionService,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoleDialogData,
  ) {}

  public ngOnInit(): void {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    console.log('lan en dialogform.component.ts:: ', this.langStoreValue);
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    const selectedOrganization = this.organizacionService.selectedOrganizationSnapshot;
    this.idOrganization = Number(this.data?.idOrganization ?? selectedOrganization?.Id ?? 0);
    this.organizationName = String(
      this.data?.organizationName ?? selectedOrganization?.Nombre ?? ''
    ).trim();

    this.addCusForm = this.fb.group({
      Nombre: [this.rname, [Validators.required]],
      Descripcion: [this.rdesc, [Validators.required]],

    });
  }

  async onSubmitClick(): Promise<void> {
    this.addCusForm.markAllAsTouched();

    if (this.addCusForm.invalid || this.idOrganization <= 0 || this.isSaving) {
      return;
    }

    this.isSaving = true;

    const roleData = {
      nameRole: String(this.addCusForm.get('Nombre')?.value || '').trim(),
      descRole: String(this.addCusForm.get('Descripcion')?.value || '').trim(),
      idOrganization: this.idOrganization
    };

    try {
      const result = await this.organizacionService.saveRole(roleData);
      if (result.data) {
        this.dialogRef.close(true);
      }
    } catch (error) {
      console.error('Error al crear el rol:', error);
    } finally {
      this.isSaving = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
