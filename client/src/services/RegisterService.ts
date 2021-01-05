import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const registerEndpoint = `${PORTVIS_API_URL}/register/`;

const axiosInstance = axios.create({withCredentials: true});

interface LoginDetails {
  username: string;
  password: string;
}

class RegisterService {

  register(user: LoginDetails) {
    return axiosInstance.post(`${registerEndpoint}`, user);
  }
}

export default new RegisterService();