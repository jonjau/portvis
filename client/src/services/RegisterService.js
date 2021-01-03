import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const login_endpoint = `${PORTVIS_API_URL}/register/`;

const axiosInstance = axios.create({withCredentials: true});

class RegisterService {

  register(user) {
    return axiosInstance.post(`${login_endpoint}`, user);
  }
}

export default new RegisterService();