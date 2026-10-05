import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DemoLimitsService } from '../../config/demo-limits.service';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DemoSuperAdminGuard {
  constructor(
    private authService: AuthService,
    private demoLimitsService: DemoLimitsService,
    private router: Router,
  ) {}

  canActivate() {
    if (
      !this.demoLimitsService.isDemoModeActive() ||
      this.demoLimitsService.isSuperAdminRole(this.authService.currentUserValue?.roles)
    ) {
      return true;
    }

    return this.router.createUrlTree(['/profile']);
  }
}
