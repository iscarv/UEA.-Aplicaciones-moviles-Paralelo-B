describe("Login flow", () => {

  beforeAll(async () => {
    await device.launchApp();
  });

  it("flujo completo de inicio de sesión", async () => {

    // Escribir correo
    await element(by.placeholder("Correo")).typeText("test@gmail.com");

    // Escribir contraseña
    await element(by.placeholder("Contraseña")).typeText("123456");

    // Presionar botón de login
    await element(by.text("Ingresar")).tap();

    // Verificar que algo cambió después del login
    await expect(element(by.text("Bienvenido"))).toBeVisible();

  });

});