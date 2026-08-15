export const PERFORMANCE_SCALE_MAX = 5;
export const PERFORMANCE_REQUIRED_LEVEL_MIN = 0.1;
export const PERFORMANCE_PERCENT_MAX = 100;

const PERFORMANCE_PERCENT_FACTOR = PERFORMANCE_PERCENT_MAX / PERFORMANCE_SCALE_MAX;

export function performanceScoreToPercent(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return roundPerformanceValue(numericValue * PERFORMANCE_PERCENT_FACTOR);
}

export function performanceGapToPercent(value: unknown): number | null {
  return performanceScoreToPercent(value);
}

export function requiredRatingPercentToScale(value: unknown): number {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 3;
  }

  const boundedPercent = Math.min(
    PERFORMANCE_PERCENT_MAX,
    Math.max(1, Math.round(numericValue))
  );
  const scaleValue = boundedPercent / PERFORMANCE_PERCENT_FACTOR;

  return roundPerformanceValue(
    Math.max(PERFORMANCE_REQUIRED_LEVEL_MIN, scaleValue)
  );
}

export function requiredRatingScaleToPercent(value: unknown): number {
  if (value === null || value === undefined || value === '') return 60;
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 60;
  }

  const boundedScale = Math.min(
    PERFORMANCE_SCALE_MAX,
    Math.max(PERFORMANCE_REQUIRED_LEVEL_MIN, numericValue)
  );

  return Math.min(
    PERFORMANCE_PERCENT_MAX,
    Math.max(1, Math.round(boundedScale * PERFORMANCE_PERCENT_FACTOR))
  );
}

function roundPerformanceValue(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
