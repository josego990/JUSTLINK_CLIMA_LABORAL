import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { DemoSuperAdminGuard } from './core/guard/demo-super-admin.guard';
//import { CompleteclimaaloneComponent } from './completeclimaalone/completeclimaalone.component'


export const APP_ROUTE: Route[] = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
            },
            {
                path: 'advance-table',
                loadChildren: () =>
                    import('./advance-table/advance-table.routes').then(
                        (m) => m.ADVANCE_TABLE_ROUTE
                    ),
            },
            {
                path: 'organization',
                loadChildren: () =>
                    import('./organization/organization.routes').then(
                        (m) => m.ORGANIZATION_ROUTE
                    ),
            },
            {
                path: 'secure',
                canActivate: [DemoSuperAdminGuard],
                loadChildren: () =>
                    import('./secure/secure.routes').then(
                        (m) => m.SECURE_ROUTE
                    ),
            },
            {
                path: 'quiz',
                loadChildren: () =>
                    import('./quiz/quiz.routes').then(
                        (m) => m.QUIZ_ROUTE
                    ),
            },
            {
                path: 'desempeno',
                loadChildren: () =>
                    import('./desempeno/desempeno.routes').then(
                        (m) => m.DESEMPENO_ROUTE
                    ),
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('./calendar/calendar.routes').then((m) => m.CALENDAR_ROUTE),
            },
            {
                path: 'task',
                loadChildren: () =>
                    import('./task/task.routes').then((m) => m.TASK_ROUTE),
            },
            {
                path: 'contacts',
                loadChildren: () =>
                    import('./contacts/contacts.routes').then((m) => m.CONTACT_ROUTE),
            },
            {
                path: 'email',
                loadChildren: () =>
                    import('./email/email.routes').then((m) => m.EMAIL_ROUTE),
            },
            {
                path: 'apps',
                loadChildren: () =>
                    import('./apps/apps.routes').then((m) => m.APPS_ROUTE),
            },
            {
                path: 'widget',
                loadChildren: () =>
                    import('./widget/widget.routes').then((m) => m.WIDGET_ROUTE),
            },
            {
                path: 'ui',
                loadChildren: () => import('./ui/ui.routes').then((m) => m.UI_ROUTE),
            },
            {
                path: 'forms',
                loadChildren: () =>
                    import('./forms/forms.routes').then((m) => m.FORMS_ROUTE),
            },
            {
                path: 'tables',
                loadChildren: () =>
                    import('./tables/tables.routes').then((m) => m.TEBLES_ROUTE),
            },
            {
                path: 'charts',
                loadChildren: () =>
                    import('./charts/charts.routes').then((m) => m.CHART_ROUTE),
            },
            {
                path: 'timeline',
                loadChildren: () =>
                    import('./timeline/timeline.routes').then((m) => m.TIMELINE_ROUTE),
            },
            {
                path: 'icons',
                loadChildren: () =>
                    import('./icons/icons.routes').then((m) => m.ICONS_ROUTE),
            },
            {
                path: 'extra-pages',
                loadChildren: () =>
                    import('./extra-pages/extra-pages.routes').then(
                        (m) => m.EXTRA_PAGES_ROUTE
                    ),
            },
            {
                path: 'maps',
                loadChildren: () =>
                    import('./maps/maps.routes').then((m) => m.MAPS_ROUTE),
            },
            {
                path: 'multilevel',
                loadChildren: () =>
                    import('./multilevel/multilevel.routes').then(
                        (m) => m.MULTILEVEL_ROUTE
                    ),
            },
        ],
    },
    {
        path: 'completeclima/completeclimaalone',
        //component: CompleteclimaaloneComponent,
        loadChildren: () =>
            import('./completeclimaalone/completeclimaalone.routes').then((m) => m.COMPLETE_CLIMA_ROUTE),
    },
    {
        path: 'completeclima/completedesempenoalone',
        loadChildren: () =>
            import('./completedesempenoalone/completedesempenoalone.routes').then(
                (m) => m.COMPLETE_DESEMPENO_ROUTE
            ),
    },
    
    {
        path: 'authentication',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
    },
    { path: '**', component: Page404Component },
];
