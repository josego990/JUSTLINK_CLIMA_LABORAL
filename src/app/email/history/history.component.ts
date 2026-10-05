import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { OrganizacionService, SelectedOrganization } from '../../organization/services/organizacion.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

type MailContext = 'todos' | 'clima' | 'desempeno';
type MailItemContext = Exclude<MailContext, 'todos'>;
type DeliveryStatus = 'enviado' | 'error';

interface SentMailHistoryItem {
  idCorreo: number;
  idOrganizacion: number;
  contexto: MailItemContext;
  asunto: string;
  destinatario: string;
  nombreDestinatario: string;
  nombreSistema: string;
  fechaEnvio: Date;
  estado: DeliveryStatus;
  mensajeError: string | null;
  resumen: string;
  contenidoHtml: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    TranslateModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class HistoryComponent implements OnDestroy, OnInit {
  selectedOrganization: SelectedOrganization | null = null;
  sentMailHistory: SentMailHistoryItem[] = [];
  selectedMail: SentMailHistoryItem | null = null;
  loading = false;

  contextFilter: MailContext = 'todos';
  recipientFilter = '';
  subjectFilter = '';
  dateFrom = '';
  dateTo = '';

  private selectedOrganizationSubscription?: Subscription;

  constructor(private organizationService: OrganizacionService) {}

  ngOnInit(): void {
    this.selectedOrganizationSubscription = this.organizationService.selectedOrganization$.subscribe((organization) => {
      this.selectedOrganization = organization;
      this.resetFilters();
      this.loadSentMailHistory();
    });
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  get filteredHistory(): SentMailHistoryItem[] {
    const recipient = this.normalizeSearchText(this.recipientFilter);
    const subject = this.normalizeSearchText(this.subjectFilter);
    const from = this.dateFrom ? this.startOfDay(this.dateFrom) : null;
    const to = this.dateTo ? this.endOfDay(this.dateTo) : null;

    return this.sentMailHistory.filter((item) => {
      if (this.contextFilter !== 'todos' && item.contexto !== this.contextFilter) {
        return false;
      }

      if (recipient) {
        const recipientValue = this.normalizeSearchText(`${item.nombreDestinatario} ${item.destinatario}`);
        if (!recipientValue.includes(recipient)) {
          return false;
        }
      }

      if (subject && !this.normalizeSearchText(item.asunto).includes(subject)) {
        return false;
      }

      if (from && item.fechaEnvio < from) {
        return false;
      }

      return !(to && item.fechaEnvio > to);
    });
  }

  get hasActiveFilters(): boolean {
    return this.contextFilter !== 'todos'
      || !!this.recipientFilter.trim()
      || !!this.subjectFilter.trim()
      || !!this.dateFrom
      || !!this.dateTo;
  }

  get sentCount(): number {
    return this.sentMailHistory.filter((item) => item.estado === 'enviado').length;
  }

  get errorCount(): number {
    return this.sentMailHistory.filter((item) => item.estado === 'error').length;
  }

  onFiltersChanged(): void {
    const results = this.filteredHistory;
    if (!this.selectedMail || !results.some((item) => item.idCorreo === this.selectedMail?.idCorreo)) {
      this.selectedMail = results[0] ?? null;
    }
  }

  selectMail(item: SentMailHistoryItem): void {
    this.selectedMail = item;
  }

  resetFilters(): void {
    this.contextFilter = 'todos';
    this.recipientFilter = '';
    this.subjectFilter = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.onFiltersChanged();
  }

  refreshHistory(): void {
    this.loadSentMailHistory();
  }

  getInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?';
  }

  trackByMailId(_index: number, item: SentMailHistoryItem): number {
    return item.idCorreo;
  }

  private loadSentMailHistory(): void {
    if (!this.selectedOrganization) {
      this.sentMailHistory = [];
      this.selectedMail = null;
      return;
    }

    this.loading = true;

    // Replace this source with the sent-mail API response when the endpoint is available.
    this.sentMailHistory = this.buildPreviewHistory(this.selectedOrganization)
      .sort((left, right) => right.fechaEnvio.getTime() - left.fechaEnvio.getTime());
    this.loading = false;
    this.onFiltersChanged();
  }

  private buildPreviewHistory(organization: SelectedOrganization): SentMailHistoryItem[] {
    const organizationName = organization.Nombre;
    const organizationId = organization.Id;

    return [
      this.createMail(
        1087,
        organizationId,
        'desempeno',
        'Seguimiento de evaluaciones de desempeño asignadas',
        'ernesto.mijangos@empresa.com',
        'Ernesto Mijangos',
        'Evaluación de liderazgo 360',
        '2026-08-23T10:42:00',
        'enviado',
        'Acceso al portal para consultar y responder las evaluaciones asignadas.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Evaluaciones de desempeño asignadas</h2>
            <p>Hola Ernesto,</p>
            <p>Ya puedes consultar las evaluaciones de desempeño que tienes asignadas en <strong>${organizationName}</strong>.</p>
            <p>Ingresa al portal para revisar tu avance y responder las evaluaciones pendientes.</p>
            <p class="mail-template__action"><a href="#">Ir a mis evaluaciones</a></p>
            <p class="mail-template__notice">Este enlace es personal. No lo compartas con otras personas. Tus respuestas serán tratadas de forma confidencial dentro de la organización.</p>
            <p>Equipo Just-Link360</p>
          </div>
        `,
      ),
      this.createMail(
        1086,
        organizationId,
        'clima',
        'Recordatorio: encuesta de clima pendiente',
        'paola.arocha@empresa.com',
        'Paola Arocha',
        'Clima Organizacional 2026',
        '2026-08-23T09:18:00',
        'enviado',
        'Recordatorio para completar la encuesta de clima antes de la fecha límite.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Tu opinión todavía puede hacer la diferencia</h2>
            <p>Hola Paola,</p>
            <p>La encuesta <strong>Clima Organizacional 2026</strong> continúa disponible.</p>
            <p>Completarla toma pocos minutos y nos permite conocer mejor la experiencia de las personas en ${organizationName}.</p>
            <p class="mail-template__action"><a href="#">Responder encuesta</a></p>
            <p class="mail-template__notice">Las respuestas son confidenciales y serán utilizadas únicamente para el análisis organizacional.</p>
          </div>
        `,
      ),
      this.createMail(
        1085,
        organizationId,
        'clima',
        'Invitación a encuesta de clima laboral',
        'carlos.mendez@empresa.com',
        'Carlos Méndez',
        'Clima Organizacional 2026',
        '2026-08-22T16:35:00',
        'enviado',
        'Invitación inicial para participar en la medición de clima laboral.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Queremos conocer tu experiencia</h2>
            <p>Hola Carlos,</p>
            <p>${organizationName} te invita a participar en la encuesta <strong>Clima Organizacional 2026</strong>.</p>
            <p>Tu opinión ayudará a identificar fortalezas y oportunidades para construir un mejor entorno de trabajo.</p>
            <p class="mail-template__action"><a href="#">Comenzar encuesta</a></p>
          </div>
        `,
      ),
      this.createMail(
        1084,
        organizationId,
        'desempeno',
        'Recordatorio de evaluación 360',
        'andrea.lopez@empresa.com',
        'Andrea López',
        'Modelo de competencias y liderazgo',
        '2026-08-22T14:10:00',
        'error',
        'Recordatorio de evaluaciones pendientes en el portal de desempeño.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Tienes evaluaciones pendientes</h2>
            <p>Hola Andrea,</p>
            <p>Te recordamos que aún tienes evaluaciones por completar en el modelo <strong>Competencias y liderazgo</strong>.</p>
            <p class="mail-template__action"><a href="#">Revisar evaluaciones</a></p>
          </div>
        `,
        'El servidor del destinatario rechazó temporalmente la entrega.',
      ),
      this.createMail(
        1083,
        organizationId,
        'desempeno',
        'Evaluaciones completadas correctamente',
        'jose.ramirez@empresa.com',
        'José Ramírez',
        'Evaluación anual de desempeño',
        '2026-08-21T17:26:00',
        'enviado',
        'Confirmación de recepción de las evaluaciones completadas.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Gracias por completar tus evaluaciones</h2>
            <p>Hola José,</p>
            <p>Registramos correctamente tus respuestas para la <strong>Evaluación anual de desempeño</strong>.</p>
            <p>Agradecemos el tiempo y la objetividad dedicados al proceso.</p>
          </div>
        `,
      ),
      this.createMail(
        1082,
        organizationId,
        'clima',
        'Encuesta recibida, gracias por participar',
        'maria.gomez@empresa.com',
        'María Gómez',
        'Pulso de liderazgo agosto',
        '2026-08-21T11:05:00',
        'enviado',
        'Agradecimiento por completar la encuesta de clima laboral.',
        `
          <div class="mail-template">
            <div class="mail-template__brand">Just-Link360</div>
            <h2>Gracias por compartir tu opinión</h2>
            <p>Hola María,</p>
            <p>Tu participación en <strong>Pulso de liderazgo agosto</strong> fue registrada correctamente.</p>
            <p>Gracias por ayudarnos a seguir mejorando la experiencia de trabajo en ${organizationName}.</p>
          </div>
        `,
      ),
    ];
  }

  private createMail(
    idCorreo: number,
    idOrganizacion: number,
    contexto: MailItemContext,
    asunto: string,
    destinatario: string,
    nombreDestinatario: string,
    nombreSistema: string,
    fechaEnvio: string,
    estado: DeliveryStatus,
    resumen: string,
    contenidoHtml: string,
    mensajeError: string | null = null,
  ): SentMailHistoryItem {
    return {
      idCorreo,
      idOrganizacion,
      contexto,
      asunto,
      destinatario,
      nombreDestinatario,
      nombreSistema,
      fechaEnvio: new Date(fechaEnvio),
      estado,
      mensajeError,
      resumen,
      contenidoHtml,
    };
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }

  private startOfDay(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private endOfDay(value: string): Date {
    return new Date(`${value}T23:59:59.999`);
  }
}
