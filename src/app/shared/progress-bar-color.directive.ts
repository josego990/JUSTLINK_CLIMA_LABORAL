// shared/progress-bar-color.directive.ts
import {
  Directive, ElementRef, Input, OnChanges, SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[appProgressBarColor]',
  standalone: true          // ①  ➜   no necesitas declararla en un NgModule
})
export class ProgressBarColorDirective implements OnChanges {

  private static counter = 0;

  /** color en formato CSS (#hex, rgb, hsl, etc.) */
  @Input() appProgressBarColor = '#1976d2';

  private styleEl: HTMLStyleElement = document.createElement('style');
  private uniqueAttr = `app-progress-bar-${ProgressBarColorDirective.counter++}`;

  constructor(private host: ElementRef<HTMLElement>) {
    const el = this.host.nativeElement;
    el.setAttribute(this.uniqueAttr, '');
    el.appendChild(this.styleEl);
  }

  ngOnChanges(_: SimpleChanges): void {
    this.updateColor();
  }

  private updateColor(): void {
    // Ámbito reducido al host gracias a uniqueAttr
    this.styleEl.textContent = `
      [${this.uniqueAttr}] .mat-progress-bar-fill::after {
        background-color: ${this.appProgressBarColor} !important;
      }
    `;
  }
}
