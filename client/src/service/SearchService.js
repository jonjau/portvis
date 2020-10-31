import axios from "axios";
import { PORTVIS_API_URL } from "../constants";
import PortvisApp from "../components/PortvisApp";

class SearchService {
  getSymbols(keywords) {
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    const params = new URLSearchParams({
      keywords: keywords,
      apiKey: PortvisApp.apiKey,
    });
    const url = `${PORTVIS_API_URL}/query?${params.toString()}`;
    return axios.get(url);
  }

  getCompany(symbol) {
    const params = new URLSearchParams({
      company: symbol,
      apiKey: PortvisApp.apiKey,
    });
    const url = `${PORTVIS_API_URL}/query?${params.toString()}`;
    return axios.get(url);
  }
}

export default new SearchService();
