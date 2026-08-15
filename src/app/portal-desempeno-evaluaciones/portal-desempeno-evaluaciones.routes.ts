import { Route } from '@angular/router';
import { PortalDesempenoEvaluacionesComponent } from './portal-desempeno-evaluaciones.component';

export const PORTAL_DESEMPENO_EVALUACIONES_ROUTE: Route[] = [
  {
    path: '',
    component: PortalDesempenoEvaluacionesComponent,
  },
  {
    path: ':contexto',
    component: PortalDesempenoEvaluacionesComponent,
  },
];
