import axios, { AxiosResponse } from "axios";
import { PORTVIS_API_URL } from "../constants";
import { StockSearchResult } from "../models/StockSearchResult";
import { SymbolSearchResult } from "../models/SymbolSearchResult";

const axiosInstance = axios.create({withCredentials: true});

class SearchService {
  getSymbols(keywords: string): Promise<AxiosResponse<SymbolSearchResult>> {
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    const params = new URLSearchParams({
      keywords,
    });
    const url = `${PORTVIS_API_URL}/search?${params.toString()}`;
    return axiosInstance.get<SymbolSearchResult>(url);
  }

  getCompany(symbol: string): Promise<AxiosResponse<StockSearchResult>> {
    const params = new URLSearchParams({
      company: symbol,
    });
    const url = `${PORTVIS_API_URL}/search?${params.toString()}`;
    return axiosInstance.get(url);
  }
}

export default new SearchService();
