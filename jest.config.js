module.exports = {
  // Usa la configuración especial de Jest para proyectos Expo
  preset: "jest-expo",

  // Hace que Jest muestre cada prueba individual con ✓ o ✕
  // Esto ayuda a visualizar mejor qué pruebas pasaron
  verbose: true,

  // Archivos que se ejecutan antes de correr los tests
  // Aquí se agregan configuraciones globales o extensiones
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js",
    "@testing-library/jest-native/extend-expect"
  ],

  // Permite transformar algunos módulos modernos de node_modules
  // necesarios para React Native, Expo y React Navigation
  transformIgnorePatterns: [
    "node_modules/(?!react-native|@react-native|expo|@expo|@react-navigation)"
  ],

  // Evita que Jest intente ejecutar código dentro del backend
  // porque allí no están configuradas las pruebas con Jest
  testPathIgnorePatterns: [
    "/node_modules/",
    "/backend/"
  ]
};