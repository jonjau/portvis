import axios from "axios";

class CourseDataService {
  getStockHistory(stockName) {
    return axios.get(`http://127.0.0.1:8080/query?symbol=a&apikey=1`);
  }
}

export default new CourseDataService();
