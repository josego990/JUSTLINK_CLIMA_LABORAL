import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';

export interface ActionPlanResponsible {
  id: number;
  name: string;
  cargo: string;
  email: string;
  demographics: Record<string, string>;
}

interface ActionPlanResponsibleDialogData {
  employees: ActionPlanResponsible[];
  selectedIds?: number[];
}

@Component({
  selector: 'app-action-plan-responsible-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, TranslateModule],
  template: `
    <h2 mat-dialog-title><mat-icon>person_search</mat-icon> {{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.SELECT_RESPONSIBLE' | translate }}</h2>
    <mat-dialog-content>
      <div class="filters">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>{{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.SEARCH_EMPLOYEE' | translate }}</mat-label>
          <input matInput [(ngModel)]="searchTerm" [placeholder]="'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.SEARCH_EMPLOYEE_PLACEHOLDER' | translate" autocomplete="off" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline" *ngFor="let field of demographicFields">
          <mat-label>{{ field }}</mat-label>
          <mat-select [(ngModel)]="filters[field]">
            <mat-option value="">{{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.ALL' | translate }}</mat-option>
            <mat-option *ngFor="let value of demographicValues(field)" [value]="value">{{ value || ('MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.EMPTY_VALUE' | translate) }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="results" *ngIf="filteredEmployees.length; else emptyState">
        <div class="employee-row" *ngFor="let employee of filteredEmployees" [class.selected]="isSelected(employee)" (click)="toggle(employee)">
          <mat-checkbox [checked]="isSelected(employee)" (click)="$event.stopPropagation()" (change)="toggle(employee)"></mat-checkbox>
          <span class="avatar">{{ employee.name.charAt(0) || '?' }}</span>
          <span class="employee-data"><strong>{{ employee.name }}</strong><small>{{ employee.cargo || ('MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.NO_POSITION' | translate) }}</small></span>
          <span class="demographics" *ngIf="employee.demographics | keyvalue as values">
            <small *ngFor="let item of values">{{ item.key }}: {{ item.value || ('MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.EMPTY_VALUE' | translate) }}</small>
          </span>
          <mat-icon>check_circle</mat-icon>
        </div>
      </div>
      <ng-template #emptyState><div class="empty-state">{{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.NO_EMPLOYEES_MATCH' | translate }}</div></ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <span class="selected-count">{{ selectedIds.size }} {{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.SELECTED' | translate }}</span>
      <button mat-button mat-dialog-close>{{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.CANCEL' | translate }}</button>
      <button mat-flat-button color="primary" type="button" (click)="apply()">{{ 'MENUITEMS.MAINPLNESCLIMA.ACTION_PLANS.APPLY' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { align-items:center; display:flex; gap:8px; margin:0; }
    mat-dialog-content { min-width:min(1400px, 94vw); padding-top:14px; }
    .filters { display:grid; gap:10px; grid-template-columns:repeat(5, minmax(180px, 1fr)); }
    .search-field { grid-column:span 2; }
    .results { border:1px solid #dbe3ee; border-radius:8px; max-height:54vh; overflow:auto; }
    .employee-row { align-items:center; background:transparent; border:0; border-bottom:1px solid #edf1f5; cursor:pointer; display:flex; gap:12px; padding:12px 14px; text-align:left; width:100%; }
    .employee-row:hover { background:#f7fafc; }
    .employee-row.selected { background:#eef6ff; }
    .avatar { align-items:center; background:#e8f2ff; border-radius:50%; color:#1769aa; display:inline-flex; font-weight:800; height:34px; justify-content:center; width:34px; }
    .employee-data { display:flex; flex:0 0 280px; flex-direction:column; min-width:280px; }
    .employee-data strong { -webkit-box-orient:vertical; display:-webkit-box; -webkit-line-clamp:2; line-height:1.3; max-height:2.6em; overflow:hidden; }
    .employee-data small, .demographics small { color:#64748b; }
    .demographics { display:grid; flex:1; gap:5px 12px; grid-template-columns:repeat(4, minmax(145px, 1fr)); }
    .demographics small { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .empty-state { color:#64748b; padding:32px; text-align:center; }
    .selected-count { color:#64748b; flex:1; font-size:.86rem; }
    @media (max-width:1100px) { mat-dialog-content { min-width:0; } .filters { grid-template-columns:repeat(3, minmax(180px, 1fr)); } .demographics { grid-template-columns:repeat(2, minmax(130px, 1fr)); } }
    @media (max-width:700px) { .filters { grid-template-columns:1fr; } .search-field { grid-column:auto; } .demographics { display:none; } }
  `],
})
export class ActionPlanResponsibleDialogComponent {
  searchTerm = '';
  filters: Record<string, string> = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: ActionPlanResponsibleDialogData,
    private dialogRef: MatDialogRef<ActionPlanResponsibleDialogComponent, ActionPlanResponsible[]>,
  ) {
    (data.selectedIds ?? []).forEach((id) => this.selectedIds.add(id));
  }

  readonly selectedIds = new Set<number>();

  get employees(): ActionPlanResponsible[] { return this.data?.employees ?? []; }

  get demographicFields(): string[] {
    return Array.from(new Set(this.employees.flatMap((employee) => Object.keys(employee.demographics)))).sort((a, b) => a.localeCompare(b, 'es'));
  }

  demographicValues(field: string): string[] {
    return Array.from(new Set(this.employees.map((employee) => employee.demographics[field] ?? ''))).sort((a, b) => a.localeCompare(b, 'es'));
  }

  get filteredEmployees(): ActionPlanResponsible[] {
    const search = this.normalize(`${this.searchTerm}`);
    return this.employees.filter((employee) => {
      const matchesSearch = !search || this.normalize(`${employee.name} ${employee.cargo}`).includes(search);
      const matchesFilters = Object.entries(this.filters).every(([field, value]) => !value || employee.demographics[field] === value);
      return matchesSearch && matchesFilters;
    });
  }

  isSelected(employee: ActionPlanResponsible): boolean { return this.selectedIds.has(employee.id); }

  toggle(employee: ActionPlanResponsible): void {
    this.selectedIds.has(employee.id) ? this.selectedIds.delete(employee.id) : this.selectedIds.add(employee.id);
  }

  apply(): void {
    this.dialogRef.close(this.employees.filter((employee) => this.selectedIds.has(employee.id)));
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
  }
}
