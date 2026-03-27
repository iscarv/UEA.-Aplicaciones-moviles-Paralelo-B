const getImageUrl = (image) => {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `http://192.168.100.10:3000${image}`;
};

describe("getImageUrl", () => {

  test("retorna undefined si no hay imagen", () => {
    expect(getImageUrl()).toBeUndefined();
  });

  test("retorna la misma URL si ya es completa", () => {
    expect(getImageUrl("http://test.com/img.jpg"))
      .toBe("http://test.com/img.jpg");
  });

  test("convierte ruta relativa a absoluta", () => {
    expect(getImageUrl("/uploads/img.jpg"))
      .toBe("http://192.168.100.10:3000/uploads/img.jpg");
  });

});