import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { OrganizacionService } from '../organization/services/organizacion.service';
import {
  DesempenoAnswerPayload,
  DesempenoEvaluationForm,
  DesempenoResponseResult,
} from './completedesempenoalone.models';
import { DynamicDesempenoFormComponent } from './dynamic-desempeno-form/dynamic-desempeno-form.component';

@Component({
  selector: 'app-completedesempenoalone',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DynamicDesempenoFormComponent,
  ],
  templateUrl: './completedesempenoalone.component.html',
  styleUrls: ['./completedesempenoalone.component.scss'],
})
export class CompletedesempenoaloneComponent implements OnInit, OnDestroy {
  readonly accessKey: string | null;
  readonly urlToken: string | null;
  readonly evaluatorEmployeeId: number | null;
  readonly evaluatedEmployeeId: number | null;
  evaluation: DesempenoEvaluationForm | null = null;
  isLoading = true;
  isSavingDraft = false;
  isFinalizing = false;
  errorMessage = '';
  blockedMessage = '';
  responseResult: DesempenoResponseResult | null = null;
  private originalBodyClassName = '';
  private readonly managedThemeClasses = [
    'dark',
    'dark-theme',
    'light',
    'theme-white',
    'theme-black',
    'theme-purple',
    'theme-blue',
    'theme-cyan',
    'theme-green',
    'theme-orange',
    'theme-red',
    'menu_dark',
    'menu_light',
    'logo-black',
    'logo-white',
  ];

  constructor(
    private organizationService: OrganizacionService,
    route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    this.accessKey = route.snapshot.queryParamMap.get('key');
    this.urlToken =
      route.snapshot.queryParamMap.get('token') ??
      route.snapshot.queryParamMap.get('tokenAcceso') ??
      route.snapshot.queryParamMap.get('access_token');
    const employeeId = Number(route.snapshot.queryParamMap.get('id_emp'));
    this.evaluatorEmployeeId = Number.isInteger(employeeId) && employeeId > 0
      ? employeeId
      : null;
    this.evaluatedEmployeeId = this.decodeEvaluatedEmployeeId(this.accessKey);
  }

  ngOnInit(): void {
    this.forceLightTheme();
    this.loadEvaluation();
  }

  ngOnDestroy(): void {
    this.document.body.className = this.originalBodyClassName;
  }

  get totalItems(): number {
    return (this.evaluation?.dimensiones ?? []).reduce(
      (dimensionTotal, dimension) =>
        dimensionTotal +
        dimension.criterios.reduce(
          (criterionTotal, criterion) => criterionTotal + criterion.items.length,
          0
        ),
      0
    );
  }

  get formattedClosingDate(): string {
    if (!this.evaluation?.fechaCierre) {
      return '';
    }

    const date = new Date(`${this.evaluation.fechaCierre}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return this.evaluation.fechaCierre;
    }

    return new Intl.DateTimeFormat('es-GT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  loadEvaluation(): void {
    if (!this.evaluatorEmployeeId || !this.evaluatedEmployeeId) {
      this.isLoading = false;
      this.errorMessage =
        'El enlace de la evaluación no contiene identificadores válidos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.organizationService
      .getDesempenoEvaluationForm(
        this.evaluatorEmployeeId,
        this.evaluatedEmployeeId
      )
      .subscribe({
        next: (response: any) => {
          const evaluation = response?.data ?? response;

          if (response?.ok === false || !this.isValidEvaluation(evaluation)) {
            this.handleLoadError(
              response?.message ||
                'La respuesta del servidor no contiene una evaluación válida.'
            );
            return;
          }

          this.evaluation = {
            ...evaluation,
            dimensiones: Array.isArray(evaluation.dimensiones)
              ? evaluation.dimensiones
              : [],
          };
          this.blockedMessage = this.getEvaluationBlockedMessage(this.evaluation);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.handleLoadError(
            error?.error?.message ||
              error?.message ||
              'No fue posible cargar la evaluación de desempeño.'
          );
        },
      });
  }

  saveDraft(payload: DesempenoAnswerPayload): void {
    const token = this.getResponseToken();
    if (!token) {
      void Swal.fire(
        'Token no disponible',
        'No se encontró el token de acceso para guardar las respuestas.',
        'warning'
      );
      return;
    }

    if (this.isSavingDraft || this.isFinalizing || this.blockedMessage) {
      return;
    }

    this.isSavingDraft = true;
    this.organizationService
      .saveDesempenoResponseDraft(token, payload)
      .subscribe({
        next: async (response: any) => {
          this.responseResult = this.normalizeResponseResult(response);
          await Swal.fire(
            'Borrador guardado',
            'Tus respuestas se guardaron correctamente.',
            'success'
          );
        },
        error: (error: any) => this.handleResponseError(error),
      })
      .add(() => {
        this.isSavingDraft = false;
      });
  }

  finalize(payload: DesempenoAnswerPayload): void {
    const token = this.getResponseToken();
    if (!token) {
      void Swal.fire(
        'Token no disponible',
        'No se encontró el token de acceso para finalizar la encuesta.',
        'warning'
      );
      return;
    }

    if (this.isSavingDraft || this.isFinalizing || this.blockedMessage) {
      return;
    }

    this.isFinalizing = true;
    this.organizationService
      .finalizeDesempenoResponse(token, payload)
      .subscribe({
        next: async (response: any) => {
          this.responseResult = this.normalizeResponseResult(response);
          this.blockedMessage = 'La encuesta ya fue finalizada.';
          await Swal.fire(
            'Encuesta finalizada',
            'Gracias. Tus respuestas fueron registradas correctamente.',
            'success'
          );
        },
        error: (error: any) => this.handleResponseError(error),
      })
      .add(() => {
        this.isFinalizing = false;
      });
  }

  private decodeEvaluatedEmployeeId(encodedKey: string | null): number | null {
    if (!encodedKey) {
      return null;
    }

    try {
      const normalizedKey = encodedKey.replace(/-/g, '+').replace(/_/g, '/');
      const paddedKey = normalizedKey.padEnd(
        normalizedKey.length + ((4 - (normalizedKey.length % 4)) % 4),
        '='
      );
      const [evaluatedEmployeeId, referenceId] = atob(paddedKey).split('|');
      const parsedEmployeeId = Number(evaluatedEmployeeId);
      const parsedReferenceId = Number(referenceId);

      return Number.isInteger(parsedEmployeeId) &&
        parsedEmployeeId > 0 &&
        Number.isInteger(parsedReferenceId) &&
        parsedReferenceId > 0
        ? parsedEmployeeId
        : null;
    } catch {
      return null;
    }
  }

  private isValidEvaluation(value: any): value is DesempenoEvaluationForm {
    return (
      value &&
      (
        Array.isArray(value.dimensiones) ||
        value.respondida === true ||
        value.puedeResponder === false
      )
    );
  }

  private handleLoadError(message: string): void {
    this.evaluation = null;
    this.isLoading = false;
    this.errorMessage = message;
  }

  private getResponseToken(): string | null {
    return this.urlToken || this.evaluation?.tokenAcceso || null;
  }

  private getEvaluationBlockedMessage(evaluation: DesempenoEvaluationForm): string {
    if (evaluation.respondida === true || evaluation.puedeResponder === false) {
      return evaluation.mensaje || 'La encuesta ya fue llenada.';
    }

    return '';
  }

  private forceLightTheme(): void {
    this.originalBodyClassName = this.document.body.className;

    this.managedThemeClasses.forEach((className) => {
      this.renderer.removeClass(this.document.body, className);
    });

    this.renderer.addClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'theme-white');
    this.renderer.addClass(this.document.body, 'completedesempenoalone-light');
  }

  private normalizeResponseResult(response: any): DesempenoResponseResult {
    const payload = response?.data?.data ?? response?.data ?? response ?? {};
    return {
      idRespuesta: Number(payload.idRespuesta ?? payload.IdRespuesta ?? 0),
      finalizada: Boolean(payload.finalizada ?? payload.Finalizada),
    };
  }

  private async handleResponseError(error: any): Promise<void> {
    const status = Number(error?.status);
    const code = error?.error?.code ?? error?.error?.codigo ?? error?.code;
    const message =
      error?.error?.message ??
      error?.error?.mensaje ??
      error?.message ??
      'No fue posible guardar las respuestas.';

    if (status === 409 && code === 'RESPUESTA_FINALIZADA') {
      this.blockedMessage = 'La encuesta ya fue finalizada.';
      await Swal.fire('Encuesta finalizada', this.blockedMessage, 'info');
      return;
    }

    await Swal.fire('Aviso', String(message), status === 422 ? 'warning' : 'error');
  }
}
