import axios from "axios";

class SearchService{
  // TODO: make localhost url generic
  // getReturns(portfolioId) {
  //   return axios.get(`http://127.0.0.1:8080/backtest`);
  // }

  getSymbols(keywords) {
    // FIXME: URL encoding
    // URL encoding of multiple IDs: id:[4,5] -> id=4%2C5 ("," becomes %2C)
    // Jackson (the deserializer in the Spring backend) is able to
    // interpret this as a Java List<Long>. id=4&id=5 is also understood.
    const params = new URLSearchParams({
      keywords: keywords,
      apikey: 123
    });
    const url = `http://127.0.0.1:8080/query?${params.toString()}`;
    return axios.get(url);
  }
}

export default new SearchService();
