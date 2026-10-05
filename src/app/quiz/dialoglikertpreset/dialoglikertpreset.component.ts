import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

type LikertLevels = 4 | 5;

interface LikertOption {
  value: string;
  label: string;
  name: string;
  is_correct: boolean;
}

interface LikertPreset {
  key: string;
  title: string;
  labels: string[];
}

interface DialogLikertPresetData {
  levels: LikertLevels;
  currentOptions?: LikertOption[];
}

@Component({
  selector: 'app-dialog-likert-preset',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatRadioModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Editar opciones Likert ({{ levels }} niveles)</h2>

    <div mat-dialog-content>
      <p style="margin: 0 0 12px 0;">
        Seleccione una plantilla de respuestas para esta pregunta.
      </p>

      <mat-radio-group [(ngModel)]="selectedKey" style="display: block;">
        <div
          *ngFor="let preset of presets"
          style="padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px;"
        >
          <mat-radio-button [value]="preset.key">
            <strong>{{ preset.title }}</strong>
          </mat-radio-button>

          <div style="margin-top: 8px; font-size: 13px; color: #4b5563;">
            {{ preset.labels.join(' | ') }}
          </div>
        </div>
      </mat-radio-group>
    </div>

    <div mat-dialog-actions >
      <button style="border-radius: 6px" mat-button (click)="close()">Cancelar</button>
      <button style="border-radius: 6px" mat-raised-button color="primary" [disabled]="!selectedKey" (click)="apply()">
        Aplicar
      </button>
    </div>
  `,
})
export class DialogLikertPresetComponent {
  levels: LikertLevels;
  presets: LikertPreset[] = [];
  selectedKey = '';

  constructor(
    private dialogRef: MatDialogRef<DialogLikertPresetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogLikertPresetData,
  ) {
    this.levels = data?.levels === 5 ? 5 : 4;
    this.presets = this.getPresetsByLevels(this.levels);

    const matched = this.matchCurrentPreset(data?.currentOptions ?? []);
    this.selectedKey = matched ?? this.presets[0]?.key ?? '';
  }

  close(): void {
    this.dialogRef.close();
  }

  apply(): void {
    const selected = this.presets.find((p) => p.key === this.selectedKey);
    if (!selected) {
      this.dialogRef.close();
      return;
    }

    const options = selected.labels.map((label, i) => ({
      value: `opt_${i + 1}`,
      name: `opt_${i + 1}`,
      label,
      is_correct: false,
    }));

    this.dialogRef.close({ options });
  }

  private matchCurrentPreset(currentOptions: LikertOption[]): string | null {
    const labels = currentOptions.map((o) => String(o?.label ?? '').trim().toLowerCase());
    if (!labels.length) {
      return null;
    }

    for (const preset of this.presets) {
      const presetLabels = preset.labels.map((l) => l.trim().toLowerCase());
      const isSame =
        presetLabels.length === labels.length &&
        presetLabels.every((value, idx) => value === labels[idx]);

      if (isSame) {
        return preset.key;
      }
    }

    return null;
  }

  private getPresetsByLevels(levels: LikertLevels): LikertPreset[] {
    if (levels === 5) {
      return [
        {
          key: 'agreement_5',
          title: 'Acuerdo (5)',
          labels: [
            'Totalmente de acuerdo',
            'De acuerdo',
            'Ni de acuerdo ni en desacuerdo',
            'En desacuerdo',
            'Totalmente en desacuerdo',
          ],
        },
        {
          key: 'satisfaction_5',
          title: 'Satisfaccion (5)',
          labels: ['Muy satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy insatisfecho'],
        },
        {
          key: 'frequency_5',
          title: 'Frecuencia (5)',
          labels: ['Siempre', 'Casi siempre', 'A veces', 'Casi nunca', 'Nunca'],
        },
        {
          key: 'importance_5',
          title: 'Importancia (5)',
          labels: ['Muy importante', 'Importante', 'Neutral', 'Poco importante', 'Nada importante'],
        },
        {
          key: 'quality_5',
          title: 'Calidad (5)',
          labels: ['Excelente', 'Muy buena', 'Buena', 'Regular', 'Mala'],
        },
      ];
    }

    return [
      {
        key: 'agreement_4',
        title: 'Acuerdo (4)',
        labels: ['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo', 'Totalmente en desacuerdo'],
      },
      {
        key: 'satisfaction_4',
        title: 'Satisfaccion (4)',
        labels: ['Muy satisfecho', 'Satisfecho', 'Insatisfecho', 'Muy insatisfecho'],
      },
      {
        key: 'frequency_4',
        title: 'Frecuencia (4)',
        labels: ['Muy frecuente', 'Frecuente', 'Poco frecuente', 'Nada frecuente'],
      },
      {
        key: 'quality_4',
        title: 'Calidad (4)',
        labels: ['Excelente', 'Bueno', 'Regular', 'Malo'],
      },
      {
        key: 'importance_4',
        title: 'Importancia (4)',
        labels: ['Muy importante', 'Importante', 'Poco importante', 'Nada importante'],
      },
    ];
  }
}
