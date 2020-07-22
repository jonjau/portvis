import axios from "axios";

class PortfolioService {
  // TODO: make localhost url generic
  getAllPortfolios() {
    return axios.get(`http://127.0.0.1:8080/portfolio`);
  }

  getPortfolioById(portfolioId) {
    return axios.get(`http://127.0.0.1:8080/portfolio/${portfolioId}`);
  }

  updatePortfolio(portfolioId, portfolio) {
    return axios.put(`http://127.0.0.1:8080/portfolio/${portfolioId}`, portfolio);
  }

  deletePortfolio(portfolioId) {
    return axios.delete(`http://127.0.0.1:8080/portfolio/${portfolioId}`);
  }

  addPortfolio(portfolio) {
    return axios.post(`http://127.0.0.1:8080/portfolio`, portfolio);
  }
}

export default new PortfolioService();
