/** @type {Detox.DetoxConfig} */

// Configuración básica de Detox para ejecutar pruebas E2E con Jest
module.exports = {

  // Indica que el framework de pruebas será Jest
  testRunner: "jest",

  // Archivo de configuración de Jest específico para las pruebas E2E
  runnerConfig: "e2e/config.json",

  // Aplicación que Detox debe ejecutar
  apps: {
    "android.debug": {

      // Tipo de aplicación: APK de Android
      type: "android.apk",

      // Ruta donde se generará el APK después de compilar
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",

      // Comando que compila la aplicación en modo debug
      build: "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
    }
  },

  // Dispositivo donde se ejecutarán las pruebas
  devices: {
    emulator: {

      // Tipo de dispositivo: emulador Android
      type: "android.emulator",

      device: {

        // Nombre del emulador Android instalado en Android Studio
        avdName: "Pixel_3a_API_30"
      }
    }
  },

  // Configuración que conecta app + dispositivo
  configurations: {
    "android.emu.debug": {

      // Usará el emulador definido arriba
      device: "emulator",

      // Usará la app compilada en modo debug
      app: "android.debug"
    }
  }
};
