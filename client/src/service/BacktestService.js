import axios from "axios";

class BacktestService{
  // TODO: make localhost url generic
  getReturns(portfolioId) {
    return axios.get(`http://127.0.0.1:8080/backtest`);
  }
}

export default new BacktestService();
