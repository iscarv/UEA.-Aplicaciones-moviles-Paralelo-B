import { fireEvent, render } from "@testing-library/react-native";
import Login from "../app/login";

describe("LoginScreen", () => {

  test("flujo completo de login", () => {

    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(
      getByPlaceholderText("Correo"),
      "test@gmail.com"
    );

    fireEvent.changeText(
      getByPlaceholderText("Contraseña"),
      "123456"
    );

    fireEvent.press(getByText("Ingresar"));

  });

});