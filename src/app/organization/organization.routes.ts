import { Route } from "@angular/router";

import { CrearOrganizacionComponent } from './create/create.component';
import { CrearEmpleadosComponent } from './employees/employee.component';
import { CrearDemograficosComponent } from './demograficos/demograficos.component';
import { DemoSuperAdminGuard } from '../core/guard/demo-super-admin.guard';

export const ORGANIZATION_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "create",
    pathMatch: "full",
  },
  {
    path: "create",
    component: CrearOrganizacionComponent,
    canActivate: [DemoSuperAdminGuard],
  },
  {
    path: "employee",
    component: CrearEmpleadosComponent,
  },
  {
    path: "demograficos",
    component: CrearDemograficosComponent,
  },
 
];
