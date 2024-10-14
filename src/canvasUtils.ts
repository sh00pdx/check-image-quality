let CanvasClass: any;
let ImageClass: any;

if (typeof window !== 'undefined') {
  // We are in the browser
  CanvasClass = HTMLCanvasElement;
  ImageClass = HTMLImageElement;
} else {
  throw new Error("This code must be run in a browser environment.");
}

// Function to create a canvas in the browser
export const createCanvasElement = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

// Function to scale an image while maintaining its aspect ratio
export const scaleImage = (image: any, maxWidth: number, maxHeight: number) => {
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);

  const canvas = createCanvasElement(width, height);
  const context = canvas.getContext('2d');
  //@ts-ignore
  context.drawImage(image, 0, 0, width, height);
  
  return { canvas, context };
};

// Function to get pixel data (shared for both environments)
export const getPixel = (pixels: Uint8ClampedArray, width: number, x: number, y: number) => {
  const index = (y * width + x) * 4;
  return {
    r: pixels[index],
    g: pixels[index + 1],
    b: pixels[index + 2],
  };
};