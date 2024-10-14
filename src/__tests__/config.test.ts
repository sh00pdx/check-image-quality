import { getThresholds, getDefaultRegions } from '../config';

describe('config', () => {
  it('should return default thresholds', () => {
    const thresholds = getThresholds();
    expect(thresholds.brightnessMin).toBe(50);
    expect(thresholds.brightnessMax).toBe(200);
    expect(thresholds.contrast).toBe(30);
    expect(thresholds.laplacian).toBe(0.02);
  });

  it('should return default regions based on image dimensions', () => {
    const regions = getDefaultRegions(1000, 500);
    expect(regions.center).toEqual({
      startX: 350,
      startY: 175,
      width: 300,
      height: 150,
    });
    expect(regions.topLeft).toEqual({
      startX: 100,
      startY: 50,
      width: 200,
      height: 100,
    });
    // Agregar más expectativas para otras regiones si es necesario
  });
});