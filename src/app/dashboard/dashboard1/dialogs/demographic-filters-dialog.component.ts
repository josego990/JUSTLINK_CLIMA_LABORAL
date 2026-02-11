import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

/* ====== NUEVAS INTERFACES (estructura árbol) ====== */
export interface DemographicTreeNode {
  campo: string;
  valor: string;         // valor del nivel actual
  total: number;         // conteo de empleados que caen aquí
  children?: DemographicTreeNode[]; // siguiente nivel
}
export interface DemographicOrderEntry {
  level: number;
  id: number;
  campo: string;
}
export interface DemographicSelection {
  idCampo: number;
  nombreCampo: string;
  valores: string[];
}
export interface DemographicTreeData {
  order: DemographicOrderEntry[];   // describe columnas (niveles)
  rootCampoId: number;
  rootCampo: string;
  values: DemographicTreeNode[];    // nodos de nivel 1
  preselected?: DemographicSelection[];
}

type UiValue = { raw: string; label: string };
/* ====== UI ====== */
type UiField = {
  id: number;
  name: string;
  values: UiValue[];      // <- ahora objetos con raw+label
  selected: Set<string>;  // guarda SIEMPRE el raw
  search?: string;
};

function parseMaybe<T>(x: any): T {
  if (x == null) return x as T;
  if (typeof x === 'string') {
    try { return JSON.parse(x) as T; } catch { return [] as any; }
  }
  return x as T;
}

@Component({
  selector: 'app-demographic-filters-dialog',
  standalone: true,
  template: `
  <h2 mat-dialog-title class="dlg-title">
    <mat-icon>tune</mat-icon>
    Filtros demográficos
  </h2>

  <mat-dialog-content class="dlg-content">
    <div class="chips" *ngIf="totalSelected() > 0">
      <mat-chip-listbox>
        <mat-chip *ngFor="let chip of chips()" (removed)="removeChip(chip.id, chip.value)" removable>
            {{ chip.name }}: {{ chip.label }}
          <button matChipRemove aria-label="Quitar"><mat-icon>close</mat-icon></button>
        </mat-chip>
      </mat-chip-listbox>
    </div>

    <div class="cards">
      <mat-card class="card" *ngFor="let f of fields; let lvl = index">
        <mat-card-header>
          <mat-checkbox
            [checked]="isAllChecked(f)"
            [indeterminate]="isIndeterminate(f)"
            (change)="toggleAll(f, lvl, $event.checked)">
            {{ f.name }}
          </mat-checkbox>
          <span class="count">{{ f.selected.size }}/{{ f.values.length }}</span>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Escribe para filtrar…</mat-label>
            <input matInput [(ngModel)]="f.search" />
            <button *ngIf="f.search" matSuffix mat-icon-button aria-label="Clear" (click)="f.search=''">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>

          <div class="values">
  <mat-checkbox
    *ngFor="let v of filteredValues(f)"
    [checked]="f.selected.has(v.raw)"
    (change)="toggleOne(f, lvl, v.raw, $event.checked)">
    {{ v.label }}
  </mat-checkbox>
</div>
        </mat-card-content>
      </mat-card>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="clearAll()">
      <mat-icon>backspace</mat-icon>
      Borrar todo
    </button>
    <span class="spacer"></span>
    <button mat-button (click)="close()">Cancelar</button>
    <button mat-flat-button color="primary" (click)="apply()">
      <mat-icon>check</mat-icon>
      Aplicar
    </button>
  </mat-dialog-actions>
  `,
  styles: [`
    .cards {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, minmax(260px, 1fr));
    }
    @media (max-width: 1400px) { .cards { grid-template-columns: repeat(2, minmax(260px, 1fr)); } }
    @media (max-width: 900px)  { .cards { grid-template-columns: 1fr; } }
    .dlg-title { display:flex; align-items:center; gap:.5rem; }
    .dlg-content { display:flex; flex-direction:column; gap:12px; }
    .chips { padding: 4px 0 8px; }
    .card { border-radius:12px; }
    .w-100 { width:100%; }
    mat-card-header { display:flex;  align-items:center; }
    .count { color:#64748b; font-size:.85rem; }
    .values { display:flex; flex-direction:column; gap:6px; max-height:220px; overflow:auto; padding-right:4px; }
    .spacer { flex:1 1 auto; }
  `],
  imports: [
    CommonModule, FormsModule,
    MatDialogModule,
    MatFormFieldModule, MatInputModule,
    MatCheckboxModule, MatCardModule,
    MatIconModule, MatButtonModule,
    MatChipsModule
  ]
})

export class DemographicFiltersDialogComponent {
  fields: UiField[] = [];

  /** edges[nivel] = Map<valorNivel, Set<valorNivel+1>>  */
  private edges: Map<string, Set<string>>[] = [];

  

  // EN EL CONSTRUCTOR, sustituye por esto
constructor(
  @Inject(MAT_DIALOG_DATA) public rawData: any,
  private ref: MatDialogRef<DemographicFiltersDialogComponent>,
) {

  console.log('rata:: ', rawData);
  // Acepta tanto el objeto ya parseado como strings JSON
  const data = {
    order: parseMaybe<DemographicOrderEntry[]>(rawData?.order),
    rootCampoId: rawData?.rootCampoId,
    rootCampo: rawData?.rootCampo,
    values: parseMaybe<DemographicTreeNode[]>(rawData?.values),
    preselected: rawData?.preselected as DemographicSelection[] | undefined
  };

  // Preselección
  const pre = new Map<number, Set<string>>();
  (data.preselected ?? []).forEach(s => pre.set(s.idCampo, new Set(s.valores)));

  // Columnas/niveles desde 'order'
  this.fields = (data.order ?? []).map(o => ({
    id: o.id,
    name: o.campo,
    values: [],
    selected: new Set(pre.get(o.id) ?? []),
    search: ''
  }));

  // Estructuras auxiliares
const byLevelRaw: Set<string>[] = this.fields.map(() => new Set<string>());
this.edges = this.fields.map(() => new Map<string, Set<string>>());

// DFS
const dfs = (node: DemographicTreeNode, level: number) => {
  if (level >= this.fields.length) return;
  const val = node?.valor ?? '';
  byLevelRaw[level].add(val);   // incluimos '' para que aparezca en UI

  const children = node?.children ?? [];
  for (const ch of children) {
    const key = val; // puede ser ''
    let set = this.edges[level].get(key);
    if (!set) { set = new Set<string>(); this.edges[level].set(key, set); }
    set.add(ch?.valor ?? '');   // guardamos también '' para poder “saltar”
    dfs(ch, level + 1);
  }
};

(data.values ?? []).forEach(root => dfs(root, 0));

// Volcar a UI: ordena ('' primero) y crea label
this.fields.forEach((f, i) => {
  f.values = Array.from(byLevelRaw[i])
    .sort((a, b) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b, 'es', { sensitivity: 'base' })))
    .map(raw => ({ raw, label: this.display(raw) }));
});
  }

  public display(v: string): string {
    return v && v.trim() !== '' ? v : '(vacío)';
  }

  /* ===================== Helpers de UI ===================== */
  filteredValues(f: UiField): UiValue[] {
  const q = (f.search ?? '').trim().toLowerCase();
  if (!q) return f.values;
  return f.values.filter(v => v.label.toLowerCase().includes(q));
}

  isAllChecked(f: UiField): boolean { return f.values.length > 0 && f.selected.size === f.values.length; }
  isIndeterminate(f: UiField): boolean { return f.selected.size > 0 && f.selected.size < f.values.length; }

  toggleAll(f: UiField, level: number, checked: boolean) {
  if (checked) f.values.forEach(v => f.selected.add(v.raw));
  else f.selected.clear();
  this.propagateFrom(level, f.values.map(v => v.raw), checked);
}

toggleOne(f: UiField, level: number, raw: string, checked: boolean) {
  checked ? f.selected.add(raw) : f.selected.delete(raw);
  this.propagateFrom(level, [raw], checked);
}

  

// Reemplaza propagateFrom por esta versión que “salta” niveles con "".
private propagateFrom(level: number, startingValues: string[], checked: boolean) {
  let current = new Set<string>(startingValues);

  for (let L = level; L < this.fields.length - 1; L++) {
    const next = new Set<string>();
    const m = this.edges[L];

    // Reúne hijos (incluyendo "" para poder saltar)
    current.forEach(v => {
      const children = m.get(v);
      if (!children) return;
      children.forEach(ch => {
        // Solo pintamos en UI si el valor NO es vacío
        //if (ch !== '') {
          if (checked) this.fields[L + 1].selected.add(ch);
          else this.fields[L + 1].selected.delete(ch);
        //}
        next.add(ch); // aunque sea "", lo usamos para seguir propagando
      });
    });

    if (next.size === 0) break;
    current = next;
  }
}


  chips() {
  const out: { id:number; name:string; value:string; label:string }[] = [];
  this.fields.forEach(f => {
    f.values.forEach(v => {
      if (f.selected.has(v.raw)) {
        out.push({ id: f.id, name: f.name, value: v.raw, label: v.label });
      }
    });
  });
  return out;
}
  removeChip(idCampo:number, value:string) { this.fields.find(x => x.id === idCampo)?.selected.delete(value); }
  totalSelected(): number { return this.fields.reduce((acc, f) => acc + f.selected.size, 0); }
  clearAll() { this.fields.forEach(f => f.selected.clear()); }
  close() { this.ref.close(); }

  apply() {
    const payload = this.fields
      .filter(f => f.selected.size > 0)
      .map(f => ({
        idCampo: f.id,
        nombreCampo: f.name,
        valores: Array.from(f.selected)
      }));
    this.ref.close(payload);
  }
}
