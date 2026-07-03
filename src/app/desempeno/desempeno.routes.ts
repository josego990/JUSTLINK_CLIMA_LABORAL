import { Route } from '@angular/router';
import { DesCamposDemograficosComponent } from './des-campos-demograficos/des-campos-demograficos.component';
import { DesCorreosComponent } from './des-correos/des-correos.component';
import { DesDashboardComponent } from './des-dashboard/des-dashboard.component';
import { DesEvaluacionesComponent } from './des-evaluaciones/des-evaluaciones.component';
import { DesEmpleadosComponent } from './des-empleados/des-empleados.component';
import { DesEscalasComponent } from './des-escalas/des-escalas.component';
import { DesModelosComponent } from './des-modelos/des-modelos.component';
import { DesOrganigramaComponent } from './des-organigrama/des-organigrama.component';
import { DesOrganizacionesComponent } from './des-organizaciones/des-organizaciones.component';
import { DesWhatsappComponent } from './des-whatsapp/des-whatsapp.component';

export const DESEMPENO_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DesDashboardComponent,
  },
  {
    path: 'organizaciones',
    component: DesOrganizacionesComponent,
  },
  {
    path: 'empleados',
    component: DesEmpleadosComponent,
  },
  {
    path: 'organigrama',
    component: DesOrganigramaComponent,
  },
  {
    path: 'evaluaciones',
    component: DesEvaluacionesComponent,
  },
  {
    path: 'campos-demograficos',
    component: DesCamposDemograficosComponent,
  },
  {
    path: 'escalas',
    component: DesEscalasComponent,
  },
  {
    path: 'modelos',
    component: DesModelosComponent,
  },
  {
    path: 'correos',
    component: DesCorreosComponent,
  },
  {
    path: 'whatsapp',
    component: DesWhatsappComponent,
  },
];
