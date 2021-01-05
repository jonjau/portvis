package com.jonjau.portvis;

import com.jonjau.portvis.repository.entity.Portfolio;
import com.jonjau.portvis.service.TimeSeriesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = PortvisApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PortvisApplicationTests {

//    // template for use in forming REST API requests
//    // TODO: convert to WebClient? future proof...
//    private final TestRestTemplate restTemplate;
//
//    @Autowired
//    public PortvisApplicationTests(TestRestTemplate restTemplate) {
//        this.restTemplate = restTemplate;
//    }
//
//    @LocalServerPort
//    private int port;
//
//    private String getPort() { return Integer.toString(port); }
//
//    private String getRootUrl() {
//        return "http://localhost:" + port;
//    }
//
//    @Test
//    void contextLoads() {
//        // "does the application context load without errors?"
//    }
//
//    private Portfolio createPortfolio() {
//        // create and populate a new portfolio
//        Portfolio portfolio = new Portfolio();
//
//        portfolio.setName("test1");
//
//        BigDecimal initialValue = new BigDecimal(100);
//        portfolio.setInitialValue(initialValue);
//
//        Map<String, BigDecimal> allocations = new HashMap<>();
//        allocations.put("MSFT", new BigDecimal("0.5"));
//        allocations.put("AAPL", new BigDecimal("0.5"));
//        portfolio.setAllocations(allocations);
//
//        // TODO: can this be refactored? It's repeated in every test
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/portfolios/").build().toUri();
//
//        // POST the portfolio
//        ResponseEntity<Portfolio> postResponse = restTemplate.postForEntity(
//                uri, portfolio, Portfolio.class);
//
//        // check that portfolio has been created successfully
//        assertNotNull(postResponse);
//        assertNotNull(postResponse.getBody());
//        assertEquals(postResponse.getBody().getInitialValue(), initialValue);
//
//        return postResponse.getBody();
//    }
//
//    private void deletePortfolioById(Long id) {
//        // DELETE the portfolio
//        restTemplate.delete(getRootUrl() + "/portfolios/" + id);
//    }
//
//    @Test
//    public void testlorem() {
//
//    }
//
//    @Test
//    public void testGetAllPortfolios() {
//        // slightly more low level approach: using .exchange(), instead of directly getting objects
//        HttpHeaders headers = new HttpHeaders();
//        HttpEntity<String> entity = new HttpEntity<>(null, headers);
//
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/portfolios/").build().toUri();
//
//        ResponseEntity<String> response = restTemplate.exchange(uri,
//                HttpMethod.GET, entity, String.class);
//        assertNotNull(response.getBody());
//    }
//
//    @Test
//    public void testCreateDeletePortfolio() {
//        // POST then DELETE, does not test GET
//        Long id = createPortfolio().getId();
//        deletePortfolioById(id);
//    }
//
//    @Test
//    public void testCreateGetDeletePortfolio() {
//        // POST, GET, then DELETE
//        Long id = createPortfolio().getId();
//
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/portfolios/" + id).build().toUri();
//
//        Portfolio portfolio = restTemplate.getForObject(uri, Portfolio.class);
//        assertNotNull(portfolio);
//
//        deletePortfolioById(id);
//    }
//
//    @Test
//    public void testUpdatePortfolio() {
//        // Create (POST) a portfolio
//        Long id = createPortfolio().getId();
//
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/portfolios/" + id).build().toUri();
//
//        // GET the newly created portfolio
//        Portfolio portfolio = restTemplate.getForObject(uri, Portfolio.class);
//
//        // update some of that portfolio's fields
//        String name = "pf2";
//        BigDecimal initialValue = new BigDecimal("123.4");
//        portfolio.setName(name);
//        portfolio.setInitialValue(initialValue);
//
//        // PUT the updated portfolio
//        restTemplate.put(uri, portfolio);
//
//        // GET the updated portfolio, then check if it has been updated correctly
//        Portfolio updatedPortfolio = restTemplate.getForObject(uri, Portfolio.class);
//
//        assertNotNull(updatedPortfolio);
//        assertEquals(updatedPortfolio.getName(), name);
//        assertEquals(updatedPortfolio.getInitialValue(), initialValue);
//
//        // DELETE the portfolio to clean up
//        deletePortfolioById(id);
//    }
//
//    @Test
//    public void testBacktestSinglePortfolio() {
//        // create a portfolio
//        Long id = createPortfolio().getId();
//
//        // Sunday 12 June to Wednesday 15 June, 3 trading days
//        LocalDate startDate = LocalDate.of(2020, 7, 12);
//        LocalDate endDate = LocalDate.of(2020, 7, 15);
//        int daysBetween = Period.between(startDate, endDate).getDays();
//
//        // build a URI (or URL?) from the params, this takes care of any escaping,
//        // also, the LocalDate's default toString() returns ISO-compliant yyyy-MM-dd strings.
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/backtest/")
//                .queryParam("start",startDate)
//                .queryParam("end", endDate)
//                .queryParam("id", id)
//                .queryParam("apiKey", "testtestest").build().toUri();
//
//        // this is one way to get a class reference to a parameterized type...
//        @SuppressWarnings("unchecked")
//        Class<Map<LocalDate, List<BigDecimal>>> classRef =
//                (Class<Map<LocalDate, List<BigDecimal>>>) (Class<?>) Map.class;
//
//        // query (GET) the backtest service for the portfolio performance
//        ResponseEntity<Map<LocalDate, List<BigDecimal>>> getResponse =
//                restTemplate.getForEntity(uri, classRef);
//        Map<LocalDate, List<BigDecimal>> returns = getResponse.getBody();
//
//        // check that the returned returns are present and correct, then delete to clean up
//        assertNotNull(returns);
//        assertEquals(returns.size(), daysBetween);
//
//        deletePortfolioById(id);
//    }
//
//    @Test
//    public void testBacktestMultiplePortfolios() {
//        // create two portfolios
//        Portfolio portfolio1 = createPortfolio();
//        Long id1 = portfolio1.getId();
//
//        Portfolio portfolio2 = createPortfolio();
//        Long id2 = portfolio2.getId();
//
//        // Sunday 12 June to Wednesday 15 June, 3 trading days
//        LocalDate startDate = LocalDate.of(2020, 7, 12);
//        LocalDate endDate = LocalDate.of(2020, 7, 15);
//        int daysBetween = Period.between(startDate, endDate).getDays();
//
//        // build the URI, then query with GET
//        URI uri = UriComponentsBuilder.newInstance().scheme("http")
//                .host("localhost").port(getPort()).path("/backtest/")
//                .queryParam("start",startDate)
//                .queryParam("end", endDate)
//                .queryParam("id", id1)
//                .queryParam("id", id2)
//                .queryParam("apiKey", "testtesttest").build().toUri();
//
//        @SuppressWarnings("unchecked")
//        Class<Map<LocalDate, List<BigDecimal>>> classRef =
//                (Class<Map<LocalDate, List<BigDecimal>>>) (Class<?>) Map.class;
//
//        ResponseEntity<Map<LocalDate, List<BigDecimal>>> getResponse =
//                restTemplate.getForEntity(uri, classRef);
//        Map<LocalDate, List<BigDecimal>> returns = getResponse.getBody();
//
//        // add checking for accurate prices maybe?
//        assertNotNull(returns);
//        assertEquals(returns.size(), daysBetween);
//
//        deletePortfolioById(id1);
//        deletePortfolioById(id2);
//    }
}
