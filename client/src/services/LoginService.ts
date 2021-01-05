import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const loginEndpoint = `${PORTVIS_API_URL}/login/`;

const axiosInstance = axios.create({withCredentials: true});

interface LoginDetails {
  username: string;
  password: string;
}

class LoginService {

  login(user: LoginDetails) {
    return axiosInstance.post(`${loginEndpoint}`, user);
  }

  isLoggedIn() {
    return axiosInstance.get(`${loginEndpoint}`);
  }
}

export default new LoginService();