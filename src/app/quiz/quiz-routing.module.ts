import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { CompleteComponent } from './complete/complete.component';
import { CreateComponent } from './create/create.component';
import { CompleteClimaComponent } from './completeclima/completeclima.component';
import { EditorPlantillaCorreoComponent } from './maileditor/editor-plantilla-correo.component';

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "create",
    component: CreateComponent,
  },
  {
    path: "complete",
    component: CompleteComponent,
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizRoutingModule {}
