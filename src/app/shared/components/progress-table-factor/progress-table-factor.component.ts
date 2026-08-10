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
  neutro: number;
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
  @Input() showNeutral = true;
  readonly colorLightBlue = '#29b6f6';
  readonly colorGreen = '#92d050';
  readonly colorGray = '#7c7d7c';
  readonly colorOrange = '#ffc000';
  readonly colorRed = '#ff0000';

  get displayedColumns(): string[] {
    return this.showNeutral
      ? [
          'subject',
          'totacuerdo', 'acuerdo', 'neutro', 'desacuerdo', 'totdesacuerdo',
          'pctFav', 'pctDesf', 'nsat', 'mean',
          'duration'
        ]
      : [
          'subject',
          'totacuerdo', 'acuerdo', 'desacuerdo', 'totdesacuerdo',
          'pctFav', 'pctDesf', 'nsat', 'mean',
          'duration'
        ];
  }

  private _subjects: SubjectProgress[] = [];

  // Estructura agrupada para el template
  groupedSubjects: { factor: string; items: SubjectProgress[] }[] = [];

  @Input() set subjects(value: SubjectProgress[]) {
    const normalized: SubjectProgress[] = (value ?? []).map((v: any) => ({
      subject: v.subject,
      factor: v.factor,
      EtiquetaGranFactor: v.EtiquetaGranFactor ?? 'SIN AGRUPAR',

      totacuerdo: Number(v.totacuerdo ?? 0),
      acuerdo: Number(v.acuerdo ?? 0),
      neutro: Number(v.neutro ?? 0),
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

    // Agrupar por factor conservando el orden en que llega la data
    const map = new Map<string, SubjectProgress[]>();

    for (const s of this._subjects) {
      const key = String(s.factor ?? '').trim() || 'Sin factor';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(s);
    }

    this.groupedSubjects = Array.from(map.entries()).map(([factor, items]) => ({
      factor,
      items
    }));
  }

  get subjects(): SubjectProgress[] {
    return this._subjects;
  }

  getColor(p: number): string {
    return p >= 91 ? this.colorLightBlue
         : p >= 80 ? this.colorGreen
         : p >= 60 ? this.colorOrange
                   : this.colorRed;
  }

  getInverseColor(p: number): string {
    return this.getColor(100 - p);
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

