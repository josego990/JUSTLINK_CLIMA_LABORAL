import { HttpContextToken } from '@angular/common/http';

export const SKIP_SESSION_VALIDATION = new HttpContextToken<boolean>(() => false);
