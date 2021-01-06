import axios, { AxiosResponse } from "axios";
import { PORTVIS_API_URL } from "../constants";
import { AccountDetails } from "../models/AccountDetails";

// ensure that axios send cookies (needed for JWT authentication) with the
// requests
const axiosInstance = axios.create({ withCredentials: true });

const accountEndpoint = `${PORTVIS_API_URL}/account/`;

class AccountService {
  getAccountDetails(): Promise<AxiosResponse<AccountDetails>> {
    return axiosInstance.get(`${accountEndpoint}`);
  }

  updateAccountDetails(
    user: AccountDetails
  ): Promise<AxiosResponse<AccountDetails>> {
    return axiosInstance.put(`${accountEndpoint}`, user);
  }
}

export default new AccountService();
