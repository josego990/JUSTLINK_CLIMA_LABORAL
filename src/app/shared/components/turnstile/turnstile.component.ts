import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

interface TurnstileApi {
  render(
    container: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark' | 'auto';
      language?: string;
      action?: string;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

type WindowWithTurnstile = Window & typeof globalThis & {
  turnstile?: TurnstileApi;
};

@Component({
  selector: 'app-turnstile',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './turnstile.component.html',
  styleUrls: ['./turnstile.component.scss'],
})
export class TurnstileComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('turnstileContainer')
  turnstileContainer?: ElementRef<HTMLDivElement>;

  @Input() action = 'survey-submit';
  @Input() language = 'auto';
  @Input() theme: 'light' | 'dark' | 'auto' = 'light';
  @Output() tokenChange = new EventEmitter<string>();

  readonly siteKey = environment.turnstileSiteKey?.trim() ?? '';
  token = '';
  isLoading = false;
  loadFailed = false;
  expired = false;

  private widgetId: string | null = null;
  private viewInitialized = false;
  private readonly scriptId = 'cloudflare-turnstile-script';

  constructor(private zone: NgZone) {}

  get isConfigured(): boolean {
    return this.siteKey.length > 0;
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initialize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.viewInitialized &&
      (changes['language'] || changes['theme'] || changes['action'])
    ) {
      this.removeWidget();
      this.initialize();
    }
  }

  ngOnDestroy(): void {
    this.removeWidget();
  }

  reset(): void {
    this.setToken('');
    this.expired = false;

    const turnstile = this.getTurnstileApi();
    if (turnstile && this.widgetId) {
      turnstile.reset(this.widgetId);
    }
  }

  private initialize(): void {
    if (!this.isConfigured) {
      return;
    }

    this.isLoading = true;
    this.loadFailed = false;
    this.loadScript()
      .then(() => this.renderWidget())
      .catch((error) => {
        console.error('No se pudo cargar Cloudflare Turnstile:', error);
        this.zone.run(() => {
          this.isLoading = false;
          this.loadFailed = true;
          this.setToken('');
        });
      });
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      if (this.getTurnstileApi()) {
        resolve();
        return;
      }

      const existingScript = document.getElementById(this.scriptId) as HTMLScriptElement | null;
      if (existingScript) {
        this.waitForApi(resolve, reject);
        return;
      }

      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => this.waitForApi(resolve, reject);
      script.onerror = () => reject(new Error('Turnstile script load failed'));
      document.head.appendChild(script);
    });
  }

  private waitForApi(resolve: () => void, reject: (reason?: unknown) => void): void {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      if (this.getTurnstileApi()) {
        window.clearInterval(intervalId);
        resolve();
        return;
      }

      attempts += 1;
      if (attempts >= 100) {
        window.clearInterval(intervalId);
        reject(new Error('Turnstile API not available'));
      }
    }, 100);
  }

  private renderWidget(): void {
    const container = this.turnstileContainer?.nativeElement;
    const turnstile = this.getTurnstileApi();
    if (!container || !turnstile || this.widgetId) {
      return;
    }

    container.innerHTML = '';
    this.widgetId = turnstile.render(container, {
      sitekey: this.siteKey,
      theme: this.theme,
      language: this.language || 'auto',
      action: this.action,
      callback: (token: string) => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadFailed = false;
          this.expired = false;
          this.setToken(token);
        });
      },
      'expired-callback': () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.expired = true;
          this.setToken('');
        });
      },
      'error-callback': () => {
        this.zone.run(() => {
          this.isLoading = false;
          this.loadFailed = true;
          this.setToken('');
        });
      },
    });
  }

  private removeWidget(): void {
    const turnstile = this.getTurnstileApi();
    if (turnstile && this.widgetId) {
      turnstile.remove(this.widgetId);
    }
    this.widgetId = null;
    this.setToken('');
  }

  private setToken(token: string): void {
    if (this.token === token) {
      return;
    }
    this.token = token;
    this.tokenChange.emit(token);
  }

  private getTurnstileApi(): TurnstileApi | undefined {
    return typeof window === 'undefined'
      ? undefined
      : (window as WindowWithTurnstile).turnstile;
  }
}
