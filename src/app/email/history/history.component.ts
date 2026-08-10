import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { OrganizacionService } from '../../organization/services/organizacion.service';

interface OrganizationOption {
  Id: number;
  Nombre: string;
}

interface SentMailHistoryItem {
  idCorreo: number;
  idOrganizacion: number;
  asunto: string;
  estado: 'Enviado' | 'Error';
  destinatario: string;
  nombreClima: string;
  mensajeError: string | null;
  contenidoHtml: string;
  contenidoSeguro: SafeHtml;
  expanded: boolean;
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
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class HistoryComponent implements OnDestroy, OnInit {
  public dataSourceOrganizations: OrganizationOption[] = [];
  public selectedOrganization: OrganizationOption | null = null;
  public loadingOrganizations = false;
  public sentMailHistory: SentMailHistoryItem[] = [];
  private selectedOrganizationSubscription?: Subscription;

  constructor(
    private organizationService: OrganizacionService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.setupSelectedOrganizationListener();
  }

  ngOnDestroy(): void {
    this.selectedOrganizationSubscription?.unsubscribe();
  }

  private setupSelectedOrganizationListener(): void {
    this.selectedOrganizationSubscription = this.organizationService.selectedOrganization$.subscribe((organization) => {
      if (!organization) {
        this.dataSourceOrganizations = [];
        this.onOrganizationChange(null);
        return;
      }

      this.dataSourceOrganizations = [organization];
      this.onOrganizationChange(organization);
    });
  }

  get filteredHistory(): SentMailHistoryItem[] {
    if (!this.selectedOrganization) {
      return [];
    }

    return this.sentMailHistory.filter((item) => item.idOrganizacion === this.selectedOrganization?.Id);
  }

  getOrganizations(): void {
    this.loadingOrganizations = true;

    this.organizationService.getOrganizations()
      .then((response: any) => {
        this.dataSourceOrganizations = Array.isArray(response?.data) ? response.data : [];

        if (this.dataSourceOrganizations.length > 0) {
          this.onOrganizationChange(this.dataSourceOrganizations[0]);
        } else {
          this.loadingOrganizations = false;
        }
      })
      .catch((error: any) => {
        console.error('Error al obtener organizaciones:', error);
        this.dataSourceOrganizations = [];
        this.loadingOrganizations = false;
      });
  }

  onOrganizationChange(selectedOrganization: OrganizationOption | null): void {
    this.selectedOrganization = selectedOrganization;
    this.seedDummyHistory();
    this.loadingOrganizations = false;
  }

  toggleHistoryRow(item: SentMailHistoryItem): void {
    item.expanded = !item.expanded;
  }

  getStatusClass(status: 'Enviado' | 'Error'): string {
    return status === 'Enviado' ? 'status-sent' : 'status-error';
  }

  private seedDummyHistory(): void {
    const organizations = this.dataSourceOrganizations;

    this.sentMailHistory = [
      this.createHistoryItem(
        1001,
        organizations[0]?.Id ?? 1,
        'Invitación a clima laboral Q2',
        'Enviado',
        'ana.perez@demo.com',
        'Clima Corporativo 2026',
        null,
        `
          <div style="font-family:Arial,sans-serif;color:#334155;">
            <h2 style="margin:0 0 12px;color:#2563eb;">Invitación a Encuesta de Clima</h2>
            <p>Hola Ana,</p>
            <p>Te invitamos a completar la encuesta <strong>Clima Corporativo 2026</strong>.</p>
            <p>Tu participación nos ayudará a identificar oportunidades de mejora dentro de la organización.</p>
            <p style="margin-top:18px;">
              <a href="#" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">Responder encuesta</a>
            </p>
          </div>
        `,
      ),
      this.createHistoryItem(
        1002,
        organizations[0]?.Id ?? 1,
        'Recordatorio de encuesta pendiente',
        'Error',
        'carlos.lopez@demo.com',
        'Pulso Liderazgo Abril',
        '550 5.1.1 El destinatario no existe o rechazó la entrega del correo.',
        `
          <div style="font-family:Arial,sans-serif;color:#334155;">
            <h3 style="margin:0 0 12px;color:#dc2626;">Recordatorio de participación</h3>
            <p>Hola Carlos,</p>
            <p>Detectamos que aún tienes pendiente completar la encuesta <strong>Pulso Liderazgo Abril</strong>.</p>
            <p>Si el correo no llegó correctamente, este registro permite revisar el contenido que se intentó enviar.</p>
          </div>
        `,
      ),
      this.createHistoryItem(
        1003,
        organizations[1]?.Id ?? organizations[0]?.Id ?? 1,
        'Cierre de encuesta y agradecimiento',
        'Enviado',
        'maria.gomez@demo.com',
        'Evaluación 360 Comercial',
        null,
        `
          <div style="font-family:Arial,sans-serif;color:#334155;">
            <h3 style="margin:0 0 12px;color:#16a34a;">Gracias por participar</h3>
            <p>Hola María,</p>
            <p>Hemos recibido tu participación en <strong>Evaluación 360 Comercial</strong>.</p>
            <p>Agradecemos el tiempo dedicado a responder.</p>
          </div>
        `,
      ),
    ];
  }

  private createHistoryItem(
    idCorreo: number,
    idOrganizacion: number,
    asunto: string,
    estado: 'Enviado' | 'Error',
    destinatario: string,
    nombreClima: string,
    mensajeError: string | null,
    contenidoHtml: string,
  ): SentMailHistoryItem {
    return {
      idCorreo,
      idOrganizacion,
      asunto,
      estado,
      destinatario,
      nombreClima,
      mensajeError,
      contenidoHtml,
      contenidoSeguro: this.sanitizer.bypassSecurityTrustHtml(contenidoHtml),
      expanded: false,
    };
  }
}
