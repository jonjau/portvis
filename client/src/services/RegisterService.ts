import axios from "axios";
import { PORTVIS_API_URL } from "../constants";
import { LoginDetails } from "../models/AccountDetails";

const registerEndpoint = `${PORTVIS_API_URL}/register/`;

const axiosInstance = axios.create({withCredentials: true});

class RegisterService {

  register(user: LoginDetails) {
    return axiosInstance.post(`${registerEndpoint}`, user);
  }
}

export default new RegisterService();