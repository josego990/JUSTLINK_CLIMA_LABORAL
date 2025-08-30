import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

export interface SubjectProgress {
  // Identificación
  subject: string;   // Pregunta
  factor: string;    // Factor

  // Conteos por opción
  totacuerdo: number;     // opt_1 (Muy de acuerdo)
  acuerdo: number;        // opt_2 (De acuerdo)
  desacuerdo: number;     // opt_3 (En desacuerdo)
  totdesacuerdo: number;  // opt_4 (Muy en desacuerdo)

  // Total respuestas
  duration: number;

  // Nuevas métricas
  pctFav: number;   // % Favorable (Top-2)
  pctDesf: number;  // % Desfavorable
  nsat: number;     // NSAT = %Fav - %Desf
  mean: number;     // Índice 0–100 (normalizado)

  // Opcional
  mean14?: number;  // Promedio 1–4 si lo usas

  // Compatibilidad (si tu API aún manda 'progress')
  progress?: number;
}

@Component({
  selector: 'app-progress-table-factor',
  imports: [MatCardModule, MatButtonModule, MatTableModule, MatProgressBarModule, CommonModule],
  templateUrl: './progress-table-factor.component.html',
  styleUrl: './progress-table-factor.component.scss',
  standalone: true,
})
export class ProgressTableFactorComponent {

  // Columnas para el <tr mat-header-row> y <tr mat-row>
  displayedColumns: string[] = [
    'subject', 'factor',
    'totacuerdo', 'acuerdo', 'desacuerdo', 'totdesacuerdo',
    'pctFav', 'pctDesf', 'nsat', 'mean',
    'duration'
  ];

  private _subjects: SubjectProgress[] = [];

  @Input() set subjects(value: SubjectProgress[]) {
    // Normalización ligera y compatibilidad con 'progress'
    this._subjects = (value ?? []).map((v: any) => ({
      subject: v.subject,
      factor: v.factor,
      totacuerdo: Number(v.totacuerdo ?? 0),
      acuerdo: Number(v.acuerdo ?? 0),
      desacuerdo: Number(v.desacuerdo ?? 0),
      totdesacuerdo: Number(v.totdesacuerdo ?? 0),
      duration: Number(v.duration ?? 0),

      pctFav: Number(v.pctFav ?? 0),
      pctDesf: Number(v.pctDesf ?? 0),
      nsat: Number(v.nsat ?? 0),

      // Si todavía te llega 'progress', lo usamos como 'mean'
      mean: Number(v.mean ?? v.progress ?? 0),

      mean14: v.mean14 != null ? Number(v.mean14) : undefined
    }));
  }
  get subjects(): SubjectProgress[] {
    return this._subjects;
  }

  getColor(p: number): string {
    return p < 50 ? '#e74c3c'       // rojo
         : p < 70 ? '#f39c12'       // naranja
                   : '#2ecc71';     // verde
  }

  // % seguro (0..100) a partir de conteos
getPct(count: number, total: number): number {
  if (!total || total <= 0) return 0;
  const pct = (count / total) * 100;
  return Math.round((pct + Number.EPSILON) * 100) / 100;
}

// NSAT (-100..+100) → barra 0..100
getNsatBar(nsat: number): number {
  // -100 -> 0,   0 -> 50,   +100 -> 100
  const v = (nsat + 100) / 2;
  // clamp
  return Math.max(0, Math.min(100, v));
}
}
