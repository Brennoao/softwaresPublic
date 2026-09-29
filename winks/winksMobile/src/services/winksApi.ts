import axios from "axios";
import Constants from "expo-constants";

const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
const apiHost = devHost ?? "localhost";

const winksApi = axios.create({
  baseURL: `http://${apiHost}:3001/api`,
});

export default winksApi;
