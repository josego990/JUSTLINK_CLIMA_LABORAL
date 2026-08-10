import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  DEMO_LIMITS_CONFIG,
  DEMO_LIMITS_SESSION_KEYS,
  DemoLimitsConfig,
} from './demo-limits.config';

type DemoLimitKey = keyof DemoLimitsConfig;

@Injectable({
  providedIn: 'root',
})
export class DemoLimitsService {
  readonly limits = DEMO_LIMITS_CONFIG;

  isDemoBuildEnabled(): boolean {
    return !!environment.demo?.enabled;
  }

  isDemoModeActive(): boolean {
    return this.isDemoBuildEnabled();
  }

  isSuperAdminRole(
    roles: Array<{ roleName?: string | null }> | null | undefined
  ): boolean {
    return (roles ?? []).some(({ roleName }) => {
      const normalizedRole = String(roleName ?? '')
        .trim()
        .toUpperCase()
        .replace(/[\s_-]+/g, '');

      return normalizedRole === 'ADMIN' || normalizedRole === 'SUPERADMIN';
    });
  }

  getLimit(key: DemoLimitKey): number {
    return this.limits[key];
  }

  exceedsLimit(key: DemoLimitKey, currentCount: number, incomingCount = 1): boolean {
    if (!this.isDemoModeActive()) {
      return false;
    }

    return currentCount + incomingCount > this.getLimit(key);
  }

  getRemaining(key: DemoLimitKey, currentCount: number): number {
    if (!this.isDemoModeActive()) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Math.max(this.getLimit(key) - currentCount, 0);
  }

  getComposeEmailsSentCount(): number {
    if (!this.isDemoModeActive()) {
      return 0;
    }

    const rawValue = sessionStorage.getItem(DEMO_LIMITS_SESSION_KEYS.composeEmailsSent);
    const parsed = Number(rawValue);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  getComposeEmailsRemainingCount(): number {
    if (!this.isDemoModeActive()) {
      return Number.MAX_SAFE_INTEGER;
    }

    return Math.max(
      this.getLimit('maxComposeEmailsPerSession') - this.getComposeEmailsSentCount(),
      0,
    );
  }

  canConsumeComposeEmails(requestedCount: number): {
    allowed: boolean;
    limit: number;
    used: number;
    remaining: number;
    requested: number;
  } {
    const normalizedRequested = Math.max(0, Math.floor(requestedCount));

    if (!this.isDemoModeActive()) {
      return {
        allowed: true,
        limit: this.getLimit('maxComposeEmailsPerSession'),
        used: 0,
        remaining: Number.MAX_SAFE_INTEGER,
        requested: normalizedRequested,
      };
    }

    const limit = this.getLimit('maxComposeEmailsPerSession');
    const used = this.getComposeEmailsSentCount();
    const remaining = Math.max(limit - used, 0);

    return {
      allowed: normalizedRequested <= remaining,
      limit,
      used,
      remaining,
      requested: normalizedRequested,
    };
  }

  registerComposeEmailsSent(sentCount: number): void {
    if (!this.isDemoModeActive()) {
      return;
    }

    const normalizedCount = Math.max(0, Math.floor(sentCount));

    if (!normalizedCount) {
      return;
    }

    const nextCount = this.getComposeEmailsSentCount() + normalizedCount;
    sessionStorage.setItem(DEMO_LIMITS_SESSION_KEYS.composeEmailsSent, String(nextCount));
  }
}
