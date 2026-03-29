import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-info-box-factor',
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  templateUrl: './info-box-factor.component.html',
  styleUrls: ['./info-box-factor.component.scss'],
})
export class InfoBoxFactorComponent {
  @Input() title: string = '';
  @Input() value: string = '';

  @Input() trendDirection: 'up' | 'down' = 'up';
  @Input() trendPercentage: string = '';
  @Input() trendText: string = '';

  @Input() colorClass: string = '';   // 'green' | 'yellow' | 'orange' | 'red' | 'neutral'
  @Input() gaugeColor: string = '';
  @Input() gaugeBg?: string;          // NUEVO: color de pista del gauge

  @Input() gaugeValue: number = 0;
  @Input() gaugeSize: number = 120;
  @Input() gaugeType: 'full' | 'semi' = 'semi';
  @Input() gaugeThick: number = 10;

  // NUEVOS: métricas compactas
  @Input() pct_opt1: number | null = null;
  @Input() pct_opt2: number | null = null;
  @Input() pct_opt0: number | null = null;
  @Input() pct_opt3: number | null = null;
  @Input() pct_opt4: number | null = null;
  @Input() showNeutral = true;




}
