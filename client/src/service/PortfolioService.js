import axios from "axios";

class PortfolioService {
  // TODO: make localhost url generic
  // TODO: trailing forward slash in the URL?
  getAllPortfolios() {
    return axios.get(`http://127.0.0.1:8080/portfolios/`);
  }

  getPortfolioById(portfolioId) {
    return axios.get(`http://127.0.0.1:8080/portfolios/${portfolioId}`);
  }

  updatePortfolio(portfolioId, portfolio) {
    return axios.put(`http://127.0.0.1:8080/portfolios/${portfolioId}`, portfolio);
  }

  deletePortfolio(portfolioId) {
    return axios.delete(`http://127.0.0.1:8080/portfolios/${portfolioId}`);
  }

  addPortfolio(portfolio) {
    return axios.post(`http://127.0.0.1:8080/portfolios/`, portfolio);
  }

  deleteAllPortfolios() {
    return axios.delete(`http://127.0.0.1:8080/portfolios/`);
  }
}

export default new PortfolioService();
