import { Route } from '@angular/router';
import { PortalClimaPlanesAccionComponent } from './portal-clima-planes-accion.component';

export const PORTAL_CLIMA_PLANES_ACCION_ROUTE: Route[] = [
  { path: '', component: PortalClimaPlanesAccionComponent },
  { path: ':contexto', component: PortalClimaPlanesAccionComponent },
];
