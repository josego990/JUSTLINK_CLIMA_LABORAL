import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

export interface SubjectProgress {
  subject: string;   // Pregunta
  factor: string;    // Factor
  EtiquetaGranFactor: string; // NUEVO: Gran factor

  totacuerdo: number;
  acuerdo: number;
  desacuerdo: number;
  totdesacuerdo: number;
  duration: number;

  pctFav: number;
  pctDesf: number;
  nsat: number;
  mean: number;
  mean14?: number;
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

  displayedColumns: string[] = [
    'subject', 'factor',
    'totacuerdo', 'acuerdo', 'desacuerdo', 'totdesacuerdo',
    'pctFav', 'pctDesf', 'nsat', 'mean',
    'duration'
  ];

  private _subjects: SubjectProgress[] = [];

  // Estructura agrupada para el template
  groupedSubjects: { granFactor: string; items: SubjectProgress[] }[] = [];

  @Input() set subjects(value: SubjectProgress[]) {
    const normalized: SubjectProgress[] = (value ?? []).map((v: any) => ({
      subject: v.subject,
      factor: v.factor,
      EtiquetaGranFactor: v.EtiquetaGranFactor ?? 'SIN AGRUPAR',

      totacuerdo: Number(v.totacuerdo ?? 0),
      acuerdo: Number(v.acuerdo ?? 0),
      desacuerdo: Number(v.desacuerdo ?? 0),
      totdesacuerdo: Number(v.totdesacuerdo ?? 0),
      duration: Number(v.duration ?? 0),

      pctFav: Number(v.pctFav ?? 0),
      pctDesf: Number(v.pctDesf ?? 0),
      nsat: Number(v.nsat ?? 0),

      mean: Number(v.mean ?? v.progress ?? 0),
      mean14: v.mean14 != null ? Number(v.mean14) : undefined
    }));

    this._subjects = normalized;

    // Agrupar por EtiquetaGranFactor
    const map = new Map<string, SubjectProgress[]>();

    for (const s of this._subjects) {
      const key = s.EtiquetaGranFactor || 'SIN AGRUPAR';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(s);
    }

    this.groupedSubjects = Array.from(map.entries()).map(([granFactor, items]) => ({
      granFactor,
      items
    }));
  }

  get subjects(): SubjectProgress[] {
    return this._subjects;
  }

  getColor(p: number): string {
    return p < 50 ? '#e74c3c'
         : p < 70 ? '#f39c12'
                  : '#2ecc71';
  }

  getPct(count: number, total: number): number {
    if (!total || total <= 0) return 0;
    const pct = (count / total) * 100;
    return Math.round((pct + Number.EPSILON) * 100) / 100;
  }

  getNsatBar(nsat: number): number {
    const v = (nsat + 100) / 2;
    return Math.max(0, Math.min(100, v));
  }
}

