// Config file to define thresholds and regions
export const getThresholds = () => ({
  brightnessMin: Number(process.env.BRIGHTNESS_MIN_THRESHOLD) || 50,
  brightnessMax: Number(process.env.BRIGHTNESS_MAX_THRESHOLD) || 200,
  contrast: Number(process.env.CONTRAST_THRESHOLD) || 30,
  laplacian: Number(process.env.LAPLACIAN_THRESHOLD) || 0.02,
});

export const getDefaultThresholds = () => ({
  brightnessMin: 50,
  brightnessMax: 200,
  contrast: 30,
  laplacian: 0.02,
});

export const getDefaultRegions = (width: number, height: number) => ({
  center: {
    startX: Math.floor(width * 0.35),
    startY: Math.floor(height * 0.35),
    width: Math.floor(width * 0.3),
    height: Math.floor(height * 0.3),
  },
  topLeft: {
    startX: Math.floor(width * 0.1),
    startY: Math.floor(height * 0.1),
    width: Math.floor(width * 0.2),
    height: Math.floor(height * 0.2),
  },
  topRight: {
    startX: Math.floor(width * 0.7),
    startY: Math.floor(height * 0.1),
    width: Math.floor(width * 0.2),
    height: Math.floor(height * 0.2),
  },
  bottomLeft: {
    startX: Math.floor(width * 0.1),
    startY: Math.floor(height * 0.7),
    width: Math.floor(width * 0.2),
    height: Math.floor(height * 0.2),
  },
  bottomRight: {
    startX: Math.floor(width * 0.7),
    startY: Math.floor(height * 0.7),
    width: Math.floor(width * 0.2),
    height: Math.floor(height * 0.2),
  }
});
