import { Route } from "@angular/router";

import { AccessComponent } from "./access/access.component";


export const SECURE_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "access",
    pathMatch: "full",
  },
  {
    path: "access",
    component: AccessComponent,
  },

 
];