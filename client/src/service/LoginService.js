import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const login_endpoint = `${PORTVIS_API_URL}/login/`;

const axiosInstance = axios.create({withCredentials: true});

class LoginService {

  login(user) {
    return axiosInstance.post(`${login_endpoint}`, user);
  }

  isLoggedIn() {
    return axiosInstance.get(`${PORTVIS_API_URL}/authenticate/`);
  }
}

export default new LoginService();