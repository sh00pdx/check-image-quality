# check-image-quality

## Descripción

`check-image-quality` es una biblioteca diseñada para verificar la calidad de las imágenes.

## Instalación

````
npm install check-image-quality
````


## Dependencias

Este proyecto utiliza las siguientes dependencias:

- `canvas`: ^2.11.2

### Dependencias de desarrollo

- `@types/jest`: ^27.5.2
- `jest`: ^27.5.1
- `ts-jest`: ^27.1.5
- `typescript`: ^4.5.0

## Uso

## Configuración

La biblioteca permite configurar varios umbrales y regiones predeterminadas a través de variables de entorno. Aquí están las configuraciones disponibles:

### Umbrales

Puedes definir los siguientes umbrales utilizando variables de entorno:

- `BRIGHTNESS_MIN_THRESHOLD`: Umbral mínimo de brillo (por defecto: 50)
- `BRIGHTNESS_MAX_THRESHOLD`: Umbral máximo de brillo (por defecto: 200)
- `CONTRAST_THRESHOLD`: Umbral de contraste (por defecto: 30)
- `LAPLACIAN_THRESHOLD`: Umbral de laplaciano (por defecto: 0.02)

### Regiones Predeterminadas

La biblioteca también define regiones predeterminadas en una imagen basadas en su ancho y alto:

- `center`: Región central de la imagen.
- `topLeft`: Región superior izquierda de la imagen.
- `topRight`: Región superior derecha de la imagen.
- `bottomLeft`: Región inferior izquierda de la imagen.
- `bottomRight`: Región inferior derecha de la imagen.

### Regiones customizadas

La libreria permite analizar regiones customizadas, las cuales se le pasan como segundo argumento. 

````javascript
const customRegions = {
  customRegion1: {
    startX: 50, // Coordenada X inicial
    startY: 50, // Coordenada Y inicial
    width: 100, // Ancho de la región
    height: 100, // Alto de la región
  },
  customRegion2: {
    startX: 200,
    startY: 200,
    width: 150,
    height: 150,
  }
};

// Ejemplo de uso con la función de validación
const result = validateImageQuality(image, customRegions);
````

## Ejemplos

Código de ejemplo para Node.js:

````javascript
import { validateImageQuality } from 'check-image-quality';
import { Image } from 'canvas';
import fs from 'fs';

// Cargar la imagen desde el sistema de archivos
const loadImage = (filePath: string): Image => {
  const image = new Image();
  image.src = fs.readFileSync(filePath); // Cargar la imagen de forma síncrona
  return image;
};

// Validar la calidad de la imagen
const analyzeImage = (filePath: string) => {
  const image = loadImage(filePath);
  
  // Validar la calidad de la imagen
  const result = validateImageQuality(image);

  if (result.brightness && result.contrast && result.sharpness) {
    console.log('La imagen tiene buena calidad.');
  } else {
    console.log('La imagen no tiene buena calidad.');
    console.log(result); // Mostramos qué parámetro no pasó
  }
};

// Ejecutar el análisis de la imagen
analyzeImage('./path/to/your/image.jpg');

````

Uso en el navegador con una imagen de webcam:

Este ejemplo usa React y react-webcam para capturar una imagen desde la cámara del usuario, validarla con tu librería y mostrar el resultado en pantalla.
Requisitos:

  * Usa la biblioteca react-webcam para capturar la imagen.
  * Usa las funciones validateImageQuality en el navegador.


Código de ejemplo en React:

````javascript
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { validateImageQuality } from 'check-image-quality';

const WebcamCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [qualityResult, setQualityResult] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot(); // Captura la imagen de la webcam
    if (imageSrc) {
      setImageSrc(imageSrc);
      analyzeImage(imageSrc);
    }
  };

  const analyzeImage = (imageSrc: string) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      // Validar la calidad de la imagen
      const result = validateImageQuality(image);

      if (result.brightness && result.contrast && result.sharpness) {
        setQualityResult('La imagen tiene buena calidad.');
      } else {
        setQualityResult('La imagen no tiene buena calidad.');
        console.log(result); // Mostramos qué parámetro falló
      }
    };
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
      />
      <button onClick={capture}>Capturar y Analizar Imagen</button>
      {imageSrc && <img src={imageSrc} alt="captured" />}
      {qualityResult && <p>{qualityResult}</p>}
    </div>
  );
};

export default WebcamCapture;

````

## Author

Marcos Pulgar (marcos.pulgar.a@gmail.com)