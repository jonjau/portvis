import axios from "axios";

class BacktestService{
  // TODO: make localhost url generic
  // getReturns(portfolioId) {
  //   return axios.get(`http://127.0.0.1:8080/backtest`);
  // }

  getReturns(portfolioIds, startDate, endDate) {
    // FIXME: URL encoding
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>.
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
      id: portfolioIds,
    });
    //console.log(params.toString());
    const url = `http://127.0.0.1:8080/backtest?${params.toString()}`;
    return axios.get(url);
  }
}

export default new BacktestService();
