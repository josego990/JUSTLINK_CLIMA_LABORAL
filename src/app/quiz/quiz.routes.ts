import { Route } from "@angular/router";

import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

import { CreateComponent } from './create/create.component';
import { CompleteClimaComponent } from './completeclima/completeclima.component';
import { EditorPlantillaCorreoComponent } from './maileditor/editor-plantilla-correo.component';

export const QUIZ_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "create",
    pathMatch: "full",
  },
  {
    path: "create",
    component: CreateComponent,
  },

  {
    path: "config",
    component: DynamicFormComponent,
  },
  {
    path: "completeclima",
    component: CompleteClimaComponent,
  },
  {
    path: "editor",
    component: EditorPlantillaCorreoComponent,
  },
 
];