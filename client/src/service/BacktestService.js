import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

class BacktestService {
  getReturns(portfolioIds, startDate, endDate) {
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      id: portfolioIds,
    });
    const url = `${PORTVIS_API_URL}/backtest?${params.toString()}`;
    return axios.get(url);
  }
}

export default new BacktestService();
