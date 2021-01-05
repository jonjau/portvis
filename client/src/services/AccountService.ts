import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

// ensure that axios send cookies (needed for JWT authentication) with the
// requests
const axiosInstance = axios.create({withCredentials: true});

const accountEndpoint = `${PORTVIS_API_URL}/account/`;

interface AccountDetails {
  username: string;
  apiKey: string;
}

class AccountService {
  getAccountDetails() {
    return axiosInstance.get(`${accountEndpoint}`);
  }

  updateAccountDetails(user: AccountDetails) {
    return axiosInstance.put(`${accountEndpoint}`, user)
  }
}

export default new AccountService();
