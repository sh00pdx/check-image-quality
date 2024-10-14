import { validateImageQuality, analyzeRegion } from '../analyzeImage';
import fs from 'fs';
import path from 'path';
import { setupJestCanvasMock } from 'jest-canvas-mock';
import { getPixel } from '../canvasUtils';

jest.mock('../canvasUtils', () => ({
  getPixel: jest.fn(),
}));
// Función para cargar imágenes desde el sistema de archivos
const loadTestImage = (imageName: string): HTMLImageElement => {
  const imagePath = path.join(__dirname, './assets', imageName);
  const image = new Image();
  image.src = `data:image/png;base64,${fs.readFileSync(imagePath).toString('base64')}`;
  return image;
};

// Simular el contexto de canvas en jsdom
beforeEach(() => {
  jest.resetAllMocks();
  setupJestCanvasMock();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('validateImageQuality with static images', () => {
  it('should return valid when image meets all thresholds', () => {
    const image = loadTestImage('valid.png');
    image.onload = () => {
      const result = validateImageQuality(image);
      expect(result.brightness).toBe(true);
      expect(result.contrast).toBe(true);
      expect(result.sharpness).toBe(true);
    };
  });

  it('should return invalid when contrast is not valid', () => {
    const image = loadTestImage('invalid-contrast.png');
    image.onload = () => {
      const result = validateImageQuality(image);
      expect(result.brightness).toBe(true);
      expect(result.contrast).toBe(false);
      expect(result.sharpness).toBe(true);
    };
  });

  it('should return invalid when sharpness is not valid', () => {
    const image = loadTestImage('invalid-sharpness.png');
    image.onload = () => {
      const result = validateImageQuality(image);
      expect(result.brightness).toBe(true);
      expect(result.contrast).toBe(true);
      expect(result.sharpness).toBe(false);
    };
  });

  it('should return invalid when contrast and sharpness are not valid', () => {
    const image = loadTestImage('invalid-contrast-sharpness.png');
    image.onload = () => {
      const result = validateImageQuality(image);
      expect(result.brightness).toBe(true);
      expect(result.contrast).toBe(false);
      expect(result.sharpness).toBe(false);
    };
  });
});

describe('analyzeRegion', () => {
  const mockPixels = new Uint8ClampedArray([
    // R, G, B, A values for a 2x2 image
    255, 0, 0, 255,  // Red
    0, 255, 0, 255,  // Green
    0, 0, 255, 255,  // Blue
    255, 255, 0, 255 // Yellow
  ]);

  beforeEach(() => {
    (getPixel as jest.Mock).mockImplementation((pixels, width, x, y) => {
      const index = (y * width + x) * 4;
      return {
        r: pixels[index],
        g: pixels[index + 1],
        b: pixels[index + 2],
        a: pixels[index + 3],
      };
    });
  });

  it('should analyze region pixels for brightness, contrast, and sharpness', () => {
    const result = analyzeRegion(mockPixels, 2, 0, 0, 2, 2);

    expect(result).toHaveProperty('brightness');
    expect(result).toHaveProperty('contrast');
    expect(result).toHaveProperty('laplacianVariance');
  });
});