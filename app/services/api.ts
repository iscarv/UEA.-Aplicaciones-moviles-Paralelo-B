import axios from "axios";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "web"
    ? "http://localhost:3000/api/auth"
    : "http://192.168.100.12:3000/api/auth"; // tu IP local

export default axios.create({ baseURL });
