import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const portfolio_endpoint = `${PORTVIS_API_URL}/portfolios/`;

class PortfolioService {

  getAllPortfolios() {
    return axios.get(portfolio_endpoint);
  }

  getPortfolioById(portfolioId) {
    return axios.get(`${portfolio_endpoint}${portfolioId}`);
  }

  updatePortfolio(portfolioId, portfolio) {
    return axios.put(`${portfolio_endpoint}${portfolioId}`, portfolio);
  }

  deletePortfolio(portfolioId) {
    return axios.delete(`${portfolio_endpoint}${portfolioId}`);
  }

  addPortfolio(portfolio) {
    return axios.post(`${portfolio_endpoint}`, portfolio);
  }

  deleteAllPortfolios() {
    return axios.delete(`${portfolio_endpoint}`);
  }
}

export default new PortfolioService();
