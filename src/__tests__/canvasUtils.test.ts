import { createCanvasElement, scaleImage, getPixel } from '../canvasUtils';
import { setupJestCanvasMock } from 'jest-canvas-mock';

beforeEach(() => {
  setupJestCanvasMock();
	
});

describe('canvasUtils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create a canvas element with specified dimensions', () => {
    const canvas = createCanvasElement(200, 100);
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
  });

  it('should scale an image while maintaining aspect ratio', () => {
    const image = new Image();
    image.src = './assets/valid.png';
		image.onload = () => {
			const { canvas, context } = scaleImage(image, 400, 300);
			expect(canvas.width).toBe(400);
			expect(canvas.height).toBe(300);
			expect(context).not.toBeNull();
		};
  });

  it('should get pixel data correctly', () => {
    const canvas = createCanvasElement(2, 2);
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'red';
      context.fillRect(0, 0, 2, 2);
      const imageData = context.getImageData(0, 0, 2, 2);
      const pixel = getPixel(imageData.data, 2, 0, 0);
      expect(pixel.r).toBe(255);
      expect(pixel.g).toBe(0);
      expect(pixel.b).toBe(0);
    }
  });
});