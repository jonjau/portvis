import axios from "axios";
import { PORTVIS_API_URL } from "../constants";

const portfolioEndpoint = `${PORTVIS_API_URL}/portfolios/`;

const instance = axios.create({withCredentials: true});

interface Portfolio {
    username: string;
    name: string;
    initialValue: number;
    allocations: Map<string, number>;
}

class PortfolioService {

  getAllPortfolios() {
    return instance.get(portfolioEndpoint);
  }

  getPortfolioById(portfolioId: number) {
    return instance.get(`${portfolioEndpoint}${portfolioId}`);
  }

  updatePortfolio(portfolioId: number, portfolio: Portfolio) {
    return instance.put(`${portfolioEndpoint}${portfolioId}`, portfolio);
  }

  deletePortfolio(portfolioId: number) {
    return instance.delete(`${portfolioEndpoint}${portfolioId}`);
  }

  addPortfolio(portfolio: Portfolio) {
    return instance.post(`${portfolioEndpoint}`, portfolio);
  }

  deleteAllPortfolios() {
    return instance.delete(`${portfolioEndpoint}`);
  }
}

export default new PortfolioService();
