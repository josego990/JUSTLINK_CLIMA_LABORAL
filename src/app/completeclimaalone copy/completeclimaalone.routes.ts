import { Route } from "@angular/router";

import { CompleteclimaaloneComponent } from './completeclimaalone.component';


export const COMPLETE_CLIMA_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "",
    component: CompleteclimaaloneComponent,
  },
  
 
];
