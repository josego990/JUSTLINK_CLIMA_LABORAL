import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-des-correos',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, TranslateModule],
  templateUrl: './des-correos.component.html',
})
export class DesCorreosComponent {
  readonly breadcrumbTitleKey = 'DESEMPENO_MENUITEMS.MAIN.TEXT';
  readonly pageTitleKey = 'DESEMPENO_MENUITEMS.ENVIOS.LIST.CORREOS';
}
