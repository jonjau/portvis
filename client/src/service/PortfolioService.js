import axios from 'axios';

class PortfolioService {
    getAllPortfolios() {
        return axios.get(`http://127.0.0.1:8080/portfolio`);
    }

    getPortfolioById(portfolioId) {
        return axios.get(`http://127.0.0.1:8080/portfolio/${portfolioId}`);
    }
}

export default new PortfolioService();