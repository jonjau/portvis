import axios, { AxiosResponse } from "axios";
import { PORTVIS_API_URL } from "../constants";
import { LoginDetails } from "../models/AccountDetails";

const loginEndpoint = `${PORTVIS_API_URL}/login/`;

const axiosInstance = axios.create({withCredentials: true});

interface LoginResponse {
  jwtToken: string;
}

interface IsLoggedInResponse {
  username: string;
}

class LoginService {

  login(user: LoginDetails): Promise<AxiosResponse<LoginResponse>> {
    return axiosInstance.post(`${loginEndpoint}`, user);
  }

  isLoggedIn(): Promise<AxiosResponse<IsLoggedInResponse>> {
    return axiosInstance.get(`${loginEndpoint}`);
  }
}

export default new LoginService();