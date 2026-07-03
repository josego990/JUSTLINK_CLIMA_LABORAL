import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

export type EmployeeManagerOption = Record<string, any>;

export interface EmployeeManagerSelectData {
  employees: EmployeeManagerOption[];
  selectedManagerId?: number | null;
  excludedEmployeeId?: number | null;
}

export interface EmployeeManagerSelection {
  id: number | null;
  employee: EmployeeManagerOption | null;
}

export function normalizeEmployeeManagerId(value: any): number | null {
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
}

export function getEmployeeOptionId(employee: EmployeeManagerOption | null | undefined): number | null {
  const directId = normalizeEmployeeManagerId(
    employee?.['Id'] ??
    employee?.['ID'] ??
    employee?.['id'] ??
    employee?.['IdEmpleado'] ??
    employee?.['idEmpleado'] ??
    employee?.['IdEmployee'] ??
    employee?.['idEmployee'] ??
    employee?.['EmpleadoId'] ??
    employee?.['empleadoId']
  );

  if (directId) {
    return directId;
  }

  const idKey = Object.keys(employee ?? {}).find((key) => {
    const normalizedKey = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    return (
      normalizedKey === 'idempleado' ||
      normalizedKey === 'empleadoid' ||
      normalizedKey === 'employeeid'
    );
  });

  return idKey ? normalizeEmployeeManagerId(employee?.[idKey]) : null;
}

export function getEmployeeOptionManagerId(employee: EmployeeManagerOption | null | undefined): number | null {
  return normalizeEmployeeManagerId(
    employee?.['IdEmpleadoJefe'] ??
    employee?.['idEmpleadoJefe'] ??
    employee?.['IdJefe'] ??
    employee?.['idJefe'] ??
    employee?.['IdJefeEmpleado'] ??
    employee?.['idJefeEmpleado']
  );
}

export function getEmployeeOptionFullName(employee: EmployeeManagerOption | null | undefined): string {
  const fullName = String(
    employee?.['NombreCompleto'] ??
    employee?.['nombreCompleto'] ??
    employee?.['Nombre'] ??
    employee?.['nombre'] ??
    ''
  ).trim();

  if (fullName) {
    return fullName;
  }

  const firstName = String(employee?.['Nombres'] ?? employee?.['nombres'] ?? '').trim();
  const lastName = String(employee?.['Apellidos'] ?? employee?.['apellidos'] ?? '').trim();
  const name = `${firstName} ${lastName}`.trim();

  if (name) {
    return name;
  }

  const id = getEmployeeOptionId(employee);
  return id ? `Empleado ${id}` : '';
}

@Component({
  selector: 'app-employee-manager-select-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
  ],
  template: `
    <h2 mat-dialog-title>Seleccionar jefe</h2>

    <mat-dialog-content class="manager-dialog-content">
      <mat-form-field appearance="fill" class="manager-search-field">
        <mat-label>Buscar empleado</mat-label>
        <input
          matInput
          [(ngModel)]="searchTerm"
        autocomplete="off"
          placeholder="Nombre, apellido o cargo"
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <div class="manager-table-wrap" *ngIf="filteredEmployees.length; else emptyState">
        <table mat-table [dataSource]="filteredEmployees" class="manager-table">
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let employee">{{ getEmployeeFirstName(employee) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef>Apellido</th>
            <td mat-cell *matCellDef="let employee">{{ getEmployeeLastName(employee) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef>Cargo</th>
            <td mat-cell *matCellDef="let employee">{{ getEmployeePosition(employee) || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let employee">
              <button
                mat-button
                color="primary"
                type="button"
                (click)="$event.stopPropagation(); selectManager(employee)"
              >
                Seleccionar
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns;"
            [class.manager-row-selected]="getEmployeeId(row) === selectedManagerId"
            (click)="selectManager(row)"
            (dblclick)="selectManager(row)"
          ></tr>
        </table>
      </div>

      <ng-template #emptyState>
        <div class="manager-empty-state">No hay empleados para mostrar.</div>
      </ng-template>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="clearManager()">Sin jefe</button>
      <button mat-button type="button" mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .manager-dialog-content {
      min-width: min(760px, 88vw);
      padding-top: 8px;
    }

    .manager-search-field {
      width: 100%;
      margin-bottom: 12px;
    }

    .manager-table-wrap {
      max-height: min(56vh, 520px);
      overflow: auto;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 6px;
    }

    .manager-table {
      width: 100%;
    }

    .manager-row-selected {
      background: rgba(63, 81, 181, 0.08);
    }

    .manager-empty-state {
      padding: 28px 8px;
      text-align: center;
      color: #68707a;
    }

    @media (max-width: 640px) {
      .manager-dialog-content {
        min-width: 0;
      }
    }
  `],
})
export class EmployeeManagerSelectDialogComponent {
  readonly displayedColumns = ['firstName', 'lastName', 'position', 'actions'];
  searchTerm = '';

  constructor(
    private dialogRef: MatDialogRef<EmployeeManagerSelectDialogComponent, EmployeeManagerSelection>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeManagerSelectData,
  ) {}

  get selectedManagerId(): number | null {
    return normalizeEmployeeManagerId(this.data?.selectedManagerId);
  }

  get availableEmployees(): EmployeeManagerOption[] {
    const excludedEmployeeId = normalizeEmployeeManagerId(this.data?.excludedEmployeeId);
    const employees = Array.isArray(this.data?.employees) ? this.data.employees : [];

    return employees.filter((employee) => {
      const employeeId = getEmployeeOptionId(employee);
      return !excludedEmployeeId || !employeeId || employeeId !== excludedEmployeeId;
    });
  }

  get filteredEmployees(): EmployeeManagerOption[] {
    const search = this.normalizeText(this.searchTerm);

    if (!search) {
      return this.availableEmployees;
    }

    return this.availableEmployees.filter((employee) =>
      this.normalizeText([
        this.getEmployeeFirstName(employee),
        this.getEmployeeLastName(employee),
        this.getEmployeePosition(employee),
        this.getEmployeeName(employee),
      ].join(' ')).includes(search)
    );
  }

  getEmployeeId(employee: EmployeeManagerOption): number | null {
    return getEmployeeOptionId(employee);
  }

  getEmployeeName(employee: EmployeeManagerOption): string {
    return getEmployeeOptionFullName(employee) || '-';
  }

  getEmployeeFirstName(employee: EmployeeManagerOption): string {
    return String(
      employee?.['Nombres'] ??
      employee?.['nombres'] ??
      employee?.['Nombre'] ??
      employee?.['nombre'] ??
      ''
    ).trim();
  }

  getEmployeeLastName(employee: EmployeeManagerOption): string {
    return String(employee?.['Apellidos'] ?? employee?.['apellidos'] ?? '').trim();
  }

  getEmployeePosition(employee: EmployeeManagerOption): string {
    return String(
      employee?.['Cargo'] ??
      employee?.['cargo'] ??
      employee?.['Position'] ??
      employee?.['position'] ??
      ''
    ).trim();
  }

  getEmployeeEmail(employee: EmployeeManagerOption): string {
    return String(employee?.['Email'] ?? employee?.['email'] ?? '').trim();
  }

  selectManager(employee: EmployeeManagerOption): void {
    const id = getEmployeeOptionId(employee);

    if (!id) {
      return;
    }

    this.dialogRef.close({ id, employee });
  }

  clearManager(): void {
    this.dialogRef.close({ id: null, employee: null });
  }

  private normalizeText(value: any): string {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
