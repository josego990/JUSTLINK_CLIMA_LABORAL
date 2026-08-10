import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrganizacionService } from 'app/organization/services/organizacion.service';
import Swal from 'sweetalert2';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/service/language.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { environment } from '../../../environments/environment';

interface TurnstileApi {
  render(
    container: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: 'light' | 'dark' | 'auto';
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
    }
  ): string;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        FormsModule, TranslateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit {
  @ViewChild('turnstileContainer') turnstileContainer?: ElementRef<HTMLDivElement>;

  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  langStoreValue?: string;
  turnstileToken = '';
  turnstileTouched = false;
  turnstileLoadFailed = false;
  readonly isDemoMode = environment.demo?.enabled ?? false;
  readonly turnstileSiteKey = environment.turnstileSiteKey?.trim() ?? '';
  private turnstileWidgetId: string | null = null;
  private readonly turnstileScriptId = 'cloudflare-turnstile-script';

  constructor(
    private languageService: LanguageService,private translate: TranslateService,
    private organizationService: OrganizacionService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {

    //jjg aquí se cambia el idioma al cargar
    this.langStoreValue = localStorage.getItem('lang') as string;
    this.languageService.setLanguage(this.langStoreValue);
    this.translate.use(this.langStoreValue);

    //jjg aquí se maneja el cambio desde el componente header
    this.languageService.getLanguageChangeSubject().subscribe(lang => {
      this.translate.use(lang);
    });

    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],//borrar en producción --josego
      password: ['', Validators.required], //borrar en producción --30749
    });
  }

  ngAfterViewInit(): void {
    this.initializeTurnstile();
  }

  get f() {
    return this.authForm.controls;
  }

  get isTurnstileConfigured(): boolean {
    return this.turnstileSiteKey.length > 0;
  }

  get canSubmit(): boolean {
    return this.authForm.valid && !this.loading && !!this.turnstileToken && this.isTurnstileConfigured;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    }

    if (!this.isTurnstileConfigured) {
      this.error = this.translate.instant('MENUITEMS.LOGIN.TURNSTILE_CONFIG_REQUIRED');
      return;
    }

    if (!this.turnstileToken) {
      this.turnstileTouched = true;
      this.error = this.translate.instant('MENUITEMS.LOGIN.TURNSTILE_REQUIRED');
      return;
    }

    this.loading = true;

    this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe({
          next: user => {
            this.loading = false;
            if (user.isValid) {
              // login exitoso: redirecciona
             console.log('user válido:: ', user);
              this.organizationService.getMenuAccess(user.roles[0].roleId).then((resultexx)=>{
                console.log('VAMOS A VOLAR LA LUNA:: ', resultexx.data)
                sessionStorage.setItem('routes', JSON.stringify(resultexx.data));
                //sessionStorage.setItem('token',user.token);
                this.router.navigate(['/dashboard/dashboard1']);
              }); 
              
            } else {
              this.resetTurnstile();
              // credenciales incorrectas
              this.error = 'Invalid Login';
              Swal.fire({
                title: this.translate.instant('MENUITEMS.LOGIN.INVALIDACCESS'),
                text: this.translate.instant('MENUITEMS.LOGIN.INVALIDACCESSMSG'),
                icon: 'warning',
              }); 
            }
          },
          error: err => {
            // error de red o servidor
            this.loading = false;
            this.resetTurnstile();
            //this.error   = err;
          }
        });
  };

  override ngOnDestroy(): void {
    this.removeTurnstile();
    super.ngOnDestroy();
  }

  private initializeTurnstile(): void {
    if (!this.isTurnstileConfigured) {
      return;
    }

    this.loadTurnstileScript()
      .then(() => this.renderTurnstile())
      .catch((error) => {
        console.error('No se pudo cargar Cloudflare Turnstile:', error);
        this.turnstileLoadFailed = true;
      });
  }

  private loadTurnstileScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      if (window.turnstile) {
        resolve();
        return;
      }

      const existingScript = document.getElementById(this.turnstileScriptId) as HTMLScriptElement | null;

      if (existingScript) {
        this.waitForTurnstile(resolve, reject);
        return;
      }

      const script = document.createElement('script');
      script.id = this.turnstileScriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => this.waitForTurnstile(resolve, reject);
      script.onerror = () => reject(new Error('Turnstile script load failed'));
      document.head.appendChild(script);
    });
  }

  private waitForTurnstile(resolve: () => void, reject: (reason?: unknown) => void): void {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      if (window.turnstile) {
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

  private renderTurnstile(): void {
    if (!this.turnstileContainer?.nativeElement || !window.turnstile || this.turnstileWidgetId) {
      return;
    }

    this.turnstileLoadFailed = false;
    this.turnstileContainer.nativeElement.innerHTML = '';
    this.turnstileWidgetId = window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: this.turnstileSiteKey,
      theme: 'light',
      callback: (token: string) => {
        this.turnstileToken = token;
        this.turnstileTouched = false;
        this.turnstileLoadFailed = false;
      },
      'expired-callback': () => {
        this.turnstileToken = '';
        this.turnstileTouched = true;
      },
      'error-callback': () => {
        this.turnstileToken = '';
        this.turnstileLoadFailed = true;
      },
    });
  }

  private resetTurnstile(): void {
    this.turnstileToken = '';
    this.turnstileTouched = false;

    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
  }

  private removeTurnstile(): void {
    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.remove(this.turnstileWidgetId);
      this.turnstileWidgetId = null;
    }
  }

}
