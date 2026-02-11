import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

type DistItem = { Valor: number; Conteo: number; Porcentaje: number };


export interface SliderQuestionRow {
  idGranFactor: number;
  etiquetaGranFactor: string;
  idFactor: number;
  factor: string;
  idPregunta: number;
  pregunta: string;
  rangoMin: number;
  rangoMax: number;
  total_respuestas: number;
  promedio: number;
  // del SP: cadena JSON con [{Valor, Conteo, Porcentaje}]
  distribucionJSON: string;
}

@Component({
  selector: 'app-slider-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatProgressBarModule],
  templateUrl: './slider-table.component.html',
  styleUrls: ['./slider-table.component.scss'],
})



export class SliderTableComponent {
  /** Renglones desde el backend */
  private _rows: SliderQuestionRow[] = [];
  @Input() set rows(v: SliderQuestionRow[]) {
    this._rows = v ?? [];
    this.recompute();
  }
  get rows() { return this._rows; }

  /** Rango fijo (útil si decides 1..10 siempre). Si no se pasa, se usa el min/max real. */
  @Input() fixedRange?: [number, number];

  /** Columnas de la tabla */
  displayedColumns: string[] = [];
  /** Valores del rango visibles como columnas dinámicas: [1,2,3,...,10] */
  valueColumns: number[] = [];

  /** Índice rápido: por IdPregunta -> Valor -> {Conteo, Porcentaje} */
  private distIndex = new Map<number, Map<number, DistItem>>();

  /** Helpers UI */
  getColor(pct: number): string {
    return pct < 50 ? '#e74c3c' : pct < 70 ? '#f39c12' : '#2ecc71';
  }
  pct(n: number) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  /** Obtiene la celda (conteo/% ) para una fila y valor concreto */
  cell(row: SliderQuestionRow, valor: number): DistItem {
    return this.distIndex.get(row.idPregunta)?.get(valor) ?? { Valor: valor, Conteo: 0, Porcentaje: 0 };
  }

  /** Reconstruye columnas + índice al cambiar datos */
  private recompute() {
    // 1) Rango global de columnas
    const min = this.fixedRange?.[0] ?? Math.min(...this.rows.map(r => r.rangoMin), 1);
    const max = this.fixedRange?.[1] ?? Math.max(...this.rows.map(r => r.rangoMax), 10);
    this.valueColumns = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    // 2) Columnas visibles
    this.displayedColumns = [
      'pregunta', 'factor',
      ...this.valueColumns.map(v => `v_${v}`),
      'promedio', 'total'
    ];

    // 3) Indexar distribución
    this.distIndex.clear();
    for (const r of this.rows) {
      const list: DistItem[] = safeParseJSON<DistItem[]>(r.distribucionJSON) ?? [];
      const map = new Map<number, DistItem>();
      list.forEach(it => map.set(it.Valor, it));
      this.distIndex.set(r.idPregunta, map);
    }
  }
}

/** Parseo seguro (si viene null/"" del SQL) */
function safeParseJSON<T>(s: any): T | null {
  if (typeof s !== 'string' || !s.trim()) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}
