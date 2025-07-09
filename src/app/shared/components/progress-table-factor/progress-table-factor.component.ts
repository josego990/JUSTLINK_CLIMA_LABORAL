import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule }            from '@angular/common';


export interface SubjectProgress {
  subject: string;
  progress: number;
  duration: string;
  factor: string;
  totacuerdo: number;
  acuerdo: number; 
  desacuerdo: number;
  totdesacuerdo: number
}



@Component({
    selector: 'app-progress-table-factor',
    imports: [MatCardModule, MatButtonModule, MatTableModule, MatProgressBarModule, CommonModule],
    templateUrl: './progress-table-factor.component.html',
    styleUrl: './progress-table-factor.component.scss',
    standalone: true,
})


export class ProgressTableFactorComponent {
  @Input() subjects: SubjectProgress[] = [];
  
  getColor(p: number): string {
  return p < 50 ? '#e74c3c'       // rojo
       : p < 70 ? '#f39c12'       // naranja
                 : '#2ecc71';     // verde
}
}
