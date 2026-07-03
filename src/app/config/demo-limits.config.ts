export interface DemoLimitsConfig {
  maxOrganizations: number;
  maxEmployeesPerOrganization: number;
  maxDemographicsPerOrganization: number;
  maxClimatesPerOrganization: number;
  maxQuestionsPerClimate: number;
  maxComposeEmailsPerSession: number;
}

export const DEMO_LIMITS_CONFIG: DemoLimitsConfig = {
  maxOrganizations: 1,
  maxEmployeesPerOrganization: 10,
  maxDemographicsPerOrganization: 6,
  maxClimatesPerOrganization: 1,
  maxQuestionsPerClimate: 10,
  maxComposeEmailsPerSession: 5,
};

export const DEMO_LIMITS_SESSION_KEYS = {
  composeEmailsSent: 'demo.compose.emails.sent',
} as const;
