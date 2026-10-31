
import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { JoyrideModule } from 'ngx-joyride';
import { ApplicationScaleService } from './core/service/application-scale.service';

@Component({
    selector: 'app-root',
    imports: [
      JoyrideModule,
        RouterModule,
        PageLoaderComponent
    ],
    providers: [],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl!: string;
  constructor(
    public _router: Router,
    private readonly applicationScaleService: ApplicationScaleService
  ) {
    void this.applicationScaleService;
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }
}
