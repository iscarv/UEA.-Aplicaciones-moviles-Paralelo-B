// Importa el contenedor de navegación necesario para componentes que usan React Navigation
import { NavigationContainer } from "@react-navigation/native";

// Importa la función render para montar el componente en el entorno de pruebas
import { render } from "@testing-library/react-native";

// Importa la pantalla que queremos probar
import MyBooksScreen from "../app/(tabs)/my-books";

// Mock del servicio que obtiene los libros
// Esto evita que el test haga llamadas reales al backend
jest.mock("../services/bookService", () => ({
  getBooks: jest.fn(() =>
    Promise.resolve([
      { id: 1, title: "Libro 1", author: "Autor 1" }
    ])
  ),
}));

// Grupo de pruebas para la pantalla MyBooks
describe("MyBooksScreen", () => {

  // Prueba que verifica que el componente se renderiza correctamente
  test("renderiza la pantalla de libros sin errores", () => {

    // Renderiza el componente dentro de NavigationContainer
    // porque la pantalla usa hooks de navegación
    render(
      <NavigationContainer>
        <MyBooksScreen />
      </NavigationContainer>
    );

  });

});