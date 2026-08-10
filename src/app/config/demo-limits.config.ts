export interface DemoLimitsConfig {
  maxEmployeesPerOrganization: number;
  maxDemographicsPerOrganization: number;
  maxClimatesPerOrganization: number;
  maxQuestionsPerClimate: number;
  maxComposeEmailsPerSession: number;
  maxPerformanceModelsPerOrganization: number;
  maxPerformanceDimensionsPerModel: number;
  maxPerformanceCriteriaPerDimension: number;
  maxPerformanceItemsPerCriterion: number;
}

export const DEMO_LIMITS_CONFIG: DemoLimitsConfig = {
  maxEmployeesPerOrganization: 10,
  maxDemographicsPerOrganization: 6,
  maxClimatesPerOrganization: 1,
  maxQuestionsPerClimate: 10,
  maxComposeEmailsPerSession: 5,
  maxPerformanceModelsPerOrganization: 1,
  maxPerformanceDimensionsPerModel: 3,
  maxPerformanceCriteriaPerDimension: 2,
  maxPerformanceItemsPerCriterion: 3,
};

export const DEMO_LIMITS_SESSION_KEYS = {
  composeEmailsSent: 'demo.compose.emails.sent',
} as const;
