import { Route } from "@angular/router";
import { InboxComponent } from "./inbox/inbox.component";
import { ComposeComponent } from "./compose/compose.component";
import { HistoryComponent } from "./history/history.component";
import { ReadMailComponent } from "./read-mail/read-mail.component";
export const EMAIL_ROUTE: Route[] = [
  {
    path: "inbox",
    component: InboxComponent,
  },
  {
    path: "history",
    component: HistoryComponent,
  },
  {
    path: "compose",
    component: ComposeComponent,
  },
  {
    path: "read-mail",
    component: ReadMailComponent,
  },
];
