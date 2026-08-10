import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { InConfiguration, AuthService, LanguageService } from '@core';
import { MatMenuModule } from '@angular/material/menu';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  OrganizacionService,
  SelectedOrganization,
} from 'app/organization/services/organizacion.service';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        MatButtonModule,
        FeatherIconsComponent,
        MatMenuModule,
        RouterLink,
        NgClass,
        MatIconModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatTooltipModule,
        FormsModule
    ],
    providers: [LanguageService]
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;

  userContext: any = {};
  organizations: SelectedOrganization[] = [];
  selectedOrganizationId: number | null = null;
  loadingOrganizations = false;

  constructor(
    private organizationService: OrganizacionService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {
    super();
  }
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    
  ];
  notifications: Notifications[] = [
    {
      message: 'Please check your mail',
      time: '14 mins ago',
      icon: 'mail',
      color: 'nfc-green',
      status: 'msg-unread',
    },
    {
      message: 'New Employee Added..',
      time: '22 mins ago',
      icon: 'person_add',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Your leave is approved!! ',
      time: '3 hours ago',
      icon: 'event_available',
      color: 'nfc-orange',
      status: 'msg-read',
    },
    {
      message: 'Lets break for lunch...',
      time: '5 hours ago',
      icon: 'lunch_dining',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Employee report generated',
      time: '14 mins ago',
      icon: 'description',
      color: 'nfc-green',
      status: 'msg-read',
    },
    {
      message: 'Please check your mail',
      time: '22 mins ago',
      icon: 'mail',
      color: 'nfc-red',
      status: 'msg-read',
    },
    {
      message: 'Salary credited...',
      time: '3 hours ago',
      icon: 'paid',
      color: 'nfc-purple',
      status: 'msg-read',
    },
  ];
  ngOnInit() {
    this.config = this.configService.configData;
    this.userImg =
      'assets/images/user/' + this.authService.currentUserValue!.img;
    this.docElement = document.documentElement;

   //console.log('CURRENT USER DESDE HEADER COMPONENT:: ', this.authService.currentUserValue);


    this.getUserInfo();
    this.subs.sink = this.organizationService.selectedOrganization$.subscribe((organization) => {
      this.selectedOrganizationId = organization?.Id ?? null;
    });
    this.loadOrganizationsForHeader();

    this.homePage = 'dashboard/dashboard1';

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }

  onHeaderOrganizationChange(idOrganization: number | null): void {
    const selected = this.organizations.find((organization) => organization.Id === Number(idOrganization));

    if (selected) {
      this.organizationService.setSelectedOrganization(selected);
    }
  }

  trackByOrganizationId(_index: number, organization: SelectedOrganization): number {
    return organization.Id;
  }

  private loadOrganizationsForHeader(): void {
    const currentUser = this.authService.currentUserValue;
    const roleName = currentUser?.roles?.[0]?.roleName;
    const idOrganization = currentUser?.idOrganization;
    const request = roleName === 'admin' || !idOrganization
      ? this.organizationService.getOrganizations()
      : this.organizationService.getOrganizationById(idOrganization);

    this.loadingOrganizations = true;

    request
      .then((response: any) => {
        this.organizations = this.normalizeOrganizations(response?.data);
        this.syncSelectedOrganization(idOrganization);
      })
      .catch((error: any) => {
        console.error('Error al cargar organizaciones para header:', error);
        this.organizations = [];
        this.organizationService.clearSelectedOrganization();
      })
      .finally(() => {
        this.loadingOrganizations = false;
      });
  }

  private normalizeOrganizations(value: any): SelectedOrganization[] {
    const collection = Array.isArray(value)
      ? value
      : Array.isArray(value?.data)
        ? value.data
        : Array.isArray(value?.items)
          ? value.items
          : [];

    return collection
      .map((item: any) => this.organizationService.normalizeOrganizationOption(item))
      .filter((item: SelectedOrganization | null): item is SelectedOrganization => !!item && item.Id > 0);
  }

  private syncSelectedOrganization(userOrganizationId?: number): void {
    const storedSelection = this.organizationService.selectedOrganizationSnapshot;
    const storedSelectionIsAvailable = !!storedSelection &&
      this.organizations.some((organization) => organization.Id === storedSelection.Id);

    if (storedSelectionIsAvailable) {
      this.organizationService.setSelectedOrganization(storedSelection);
      return;
    }

    const userSelection = userOrganizationId
      ? this.organizationService.selectOrganizationById(userOrganizationId, this.organizations)
      : null;

    if (userSelection) {
      return;
    }

    if (this.organizations.length > 0) {
      this.organizationService.setSelectedOrganization(this.organizations[0]);
      return;
    }

    this.organizationService.clearSelectedOrganization();
  }

  getUserInfo():void{
    this.organizationService.getUserById(this.authService.currentUserValue!.userId).then((resulx)=>{
      if(resulx.data){
       console.log('resulx.data o userContext en header.components:: ', resulx.data); 
        this.userContext = resulx.data[0];
      }
    }).catch((err)=>{
      console.error(err);
    })
  }

  callFullscreen() {
    if (!this.isFullScreen) {
      if (this.docElement?.requestFullscreen != null) {
        this.docElement?.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }

    const hasClass2 = this.document.body.classList.contains('side-closed');
    if (hasClass2) {
      // this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    } else {
      // this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }
  logout() {
    this.subs.sink = this.authService.logout().subscribe((res) => {
      if (res.success) {
        sessionStorage.setItem('routes', JSON.stringify([]));
        this.router.navigate(['/authentication/signin']);
      }
    });
  }
}
