module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  coverageDirectory: './coverage',
  testEnvironment: 'jsdom',  // Aseguramos que jsdom es el entorno de test
  setupFiles: ['jest-canvas-mock'],  // Mock de canvas para jsdom
};