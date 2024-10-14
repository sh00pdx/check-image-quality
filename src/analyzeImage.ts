import { scaleImage, getPixel } from './canvasUtils';
import { getThresholds, getDefaultRegions, getDefaultThresholds } from './config';

// Function to analyze region pixels for brightness, contrast, and sharpness
export const analyzeRegion = (pixels: Uint8ClampedArray, width: number, startX: number, startY: number, regionWidth: number, regionHeight: number) => {
  let brightness = 0;
  let totalContrast = 0;
  let laplacianValues: number[] = [];
  const blockSize = 6;

  for (let y = startY; y < startY + regionHeight; y += blockSize) {
    for (let x = startX; x < startX + regionWidth; x += blockSize) {
      const { r, g, b } = getPixel(pixels, width, x, y);

      // Brightness calculation
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      brightness += lum;

      // Contrast calculation
      const contrast = Math.max(r, g, b) - Math.min(r, g, b);
      totalContrast += contrast;

      // Laplacian calculation (sharpness)
      const currentPixel = getPixel(pixels, width, x, y).r;
      const neighbors = [
        getPixel(pixels, width, x - 1, y).r,
        getPixel(pixels, width, x + 1, y).r,
        getPixel(pixels, width, x, y - 1).r,
        getPixel(pixels, width, x, y + 1).r,
      ];

      const laplacian = neighbors.reduce((sum, neighbor) => sum + (neighbor - currentPixel), 0);
      laplacianValues.push(Math.abs(laplacian));
    }
  }

  const laplacianMax = Math.max(...laplacianValues);
  const laplacianNormalized = laplacianValues.map(value => value / laplacianMax);

  // Calcular la varianza del Laplaciano para detectar desenfoque
  const laplacianMean = laplacianNormalized.reduce((sum, val) => sum + val, 0) / laplacianNormalized.length;
  const laplacianVariance = laplacianNormalized.reduce((sum, val) => sum + Math.pow(val - laplacianMean, 2), 0) / laplacianNormalized.length;

  // Calcular el brillo y el contraste promedio
  const totalPixels = (regionWidth / blockSize) * (regionHeight / blockSize); // Total de bloques procesados
  brightness /= totalPixels;
  totalContrast /= totalPixels;

  return { brightness, contrast: totalContrast, laplacianVariance };
};

// Main function to validate image quality
export const validateImageQuality = (image: any, customRegions?: any) => {
  const thresholds = getThresholds();

  const { canvas, context } = scaleImage(image, 640, 480);
  const width = canvas.width;
  const height = canvas.height;
	// @ts-ignore
  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const regions = customRegions || getDefaultRegions(width, height);

  const results = Object.keys(regions).map(region => {
    const { startX, startY, width, height } = regions[region];
    return analyzeRegion(pixels, canvas.width, startX, startY, width, height);
  });

  const averages = {
    brightness: results.reduce((sum, res) => sum + res.brightness, 0) / results.length,
    contrast: results.reduce((sum, res) => sum + res.contrast, 0) / results.length,
    laplacianVariance: results.reduce((sum, res) => sum + res.laplacianVariance, 0) / results.length,
  };
  // Validate brightness against min and max thresholds
  const brightnessValid = averages.brightness >= thresholds.brightnessMin && averages.brightness <= thresholds.brightnessMax;

  // Validate contrast and sharpness (laplacian)
  const contrastValid = averages.contrast >= thresholds.contrast;
  const sharpnessValid = averages.laplacianVariance >= thresholds.laplacian;

	const defaultThresholds = getDefaultThresholds();
	// Calculate scores based on thresholds
  const brightnessScore = Math.min(Math.max((averages.brightness - defaultThresholds.brightnessMin) / (defaultThresholds.brightnessMax - defaultThresholds.brightnessMin), 0), 1);
  const contrastScore = Math.min(Math.max(averages.contrast / defaultThresholds.contrast, 0), 1);
  const sharpnessScore = Math.min(Math.max(averages.laplacianVariance / defaultThresholds.laplacian, 0), 1);

  // Calculate overall score as an average of the individual scores
  const overallScore = (brightnessScore + contrastScore + sharpnessScore) / 3;

  // Return the detailed result as an object
  return {
    brightness: brightnessValid,
    contrast: contrastValid,
    sharpness: sharpnessValid,
		scores: {
			brightnessScore,
			contrastScore,
			sharpnessScore,
			overallScore
		}
  };
};
