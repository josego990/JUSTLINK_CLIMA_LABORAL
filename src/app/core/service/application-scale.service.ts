import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export type ApplicationScale = 'small' | 'medium' | 'large' | 'xlarge';

export interface ApplicationScaleOption {
  id: ApplicationScale;
  label: string;
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class ApplicationScaleService {
  readonly storageKey = 'application_ui_scale';

  readonly options: readonly ApplicationScaleOption[] = [
    { id: 'small', label: 'Small', percentage: 100 },
    { id: 'medium', label: 'Medium', percentage: 110 },
    { id: 'large', label: 'Large', percentage: 120 },
    { id: 'xlarge', label: 'X Large', percentage: 130 },
  ];

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.setScale(this.getStoredScale());
  }

  getStoredScale(): ApplicationScale {
    const value = localStorage.getItem(this.storageKey) as ApplicationScale | null;
    return value && this.options.some((option) => option.id === value) ? value : 'small';
  }

  setScale(scale: ApplicationScale): void {
    const option = this.options.find((item) => item.id === scale) ?? this.options[0];
    const scaleFactor = option.percentage / 100;
    const documentElement = this.document.documentElement;

    documentElement.style.removeProperty('zoom');
    documentElement.style.setProperty('--app-scale-factor', String(scaleFactor));
    documentElement.dataset['applicationScale'] = option.id;

    this.document.body?.classList.remove(
      ...this.options.map((item) => `app-scale-${item.id}`)
    );
    this.document.body?.classList.add(`app-scale-${option.id}`);

    localStorage.setItem(this.storageKey, option.id);

    window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
}
