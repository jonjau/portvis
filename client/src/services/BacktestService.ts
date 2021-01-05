import axios from "axios";
import { Moment } from "moment";
import { PORTVIS_API_URL } from "../constants";

const axiosInstance = axios.create({withCredentials: true});

class BacktestService {
  getReturns(portfolioIds: number[], startDate: Moment, endDate: Moment) {
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    const params = new URLSearchParams({
      start: startDate.toString(),
      end: endDate.toString(),
      id: portfolioIds.toString(),
    });
    const url = `${PORTVIS_API_URL}/backtest?${params.toString()}`;
    return axiosInstance.get(url);
  }
}

export default new BacktestService();
