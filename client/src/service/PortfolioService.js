import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const portfolio_endpoint = `${PORTVIS_API_URL}/portfolios/`;

const instance = axios.create({withCredentials: true});

class PortfolioService {

  getAllPortfolios() {
    return instance.get(portfolio_endpoint);
  }

  getPortfolioById(portfolioId) {
    return instance.get(`${portfolio_endpoint}${portfolioId}`);
  }

  updatePortfolio(portfolioId, portfolio) {
    return instance.put(`${portfolio_endpoint}${portfolioId}`, portfolio);
  }

  deletePortfolio(portfolioId) {
    return instance.delete(`${portfolio_endpoint}${portfolioId}`);
  }

  addPortfolio(portfolio) {
    return instance.post(`${portfolio_endpoint}`, portfolio);
  }

  deleteAllPortfolios() {
    return instance.delete(`${portfolio_endpoint}`);
  }
}

export default new PortfolioService();
