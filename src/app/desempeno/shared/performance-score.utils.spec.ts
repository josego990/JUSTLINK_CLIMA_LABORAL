import {
  performanceGapToPercent,
  performanceScoreToPercent,
  requiredRatingPercentToScale,
  requiredRatingScaleToPercent,
} from './performance-score.utils';

describe('performance score presentation conversions', () => {
  it('converts scores and gaps from the five-point scale to percentages', () => {
    expect(performanceScoreToPercent(4)).toBe(80);
    expect(performanceScoreToPercent(3.75)).toBe(75);
    expect(performanceGapToPercent(-0.75)).toBe(-15);
    expect(performanceScoreToPercent(null)).toBeNull();
  });

  it('converts integer required-level percentages to the internal scale', () => {
    expect(requiredRatingPercentToScale(80)).toBe(4);
    expect(requiredRatingPercentToScale(60)).toBe(3);
    expect(requiredRatingPercentToScale(1)).toBe(0.1);
    expect(requiredRatingPercentToScale(100)).toBe(5);
  });

  it('converts persisted required levels back to integer percentages', () => {
    expect(requiredRatingScaleToPercent(4)).toBe(80);
    expect(requiredRatingScaleToPercent(3)).toBe(60);
    expect(requiredRatingScaleToPercent(5)).toBe(100);
  });
});
