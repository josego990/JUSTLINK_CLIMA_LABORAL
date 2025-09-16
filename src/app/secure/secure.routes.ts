import { Route } from "@angular/router";

import { AccessComponent } from "./access/access.component";
import { UsersComponent } from "./users/users.component";
import { LogsComponent } from "./logs/logs.component";
import { ConfigsComponent } from "./configs/configs.component";

export const SECURE_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "users",
    pathMatch: "full",
  },
  {
    path: "users",
    component: UsersComponent,
  },
  {
    path: "access",
    component: AccessComponent,
  },
  {
    path: "configs",
    component: ConfigsComponent,
  },
  {
    path: "logs",
    component: LogsComponent,
  },
 
];