import axios from "axios";
import { PORTVIS_API_URL } from "../constants";
import PortvisApp from "../components/PortvisApp";

const axiosInstance = axios.create({withCredentials: true});

class BacktestService {
  getReturns(portfolioIds, startDate, endDate) {
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    // FIXME: the apiKey is undefined: cannot get apiKey local variable from
    // function component PortvisApp, JS silently carries on...
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      id: portfolioIds,
      apiKey: PortvisApp.apiKey,
    });
    const url = `${PORTVIS_API_URL}/backtest?${params.toString()}`;
    return axiosInstance.get(url);
  }
}

export default new BacktestService();
