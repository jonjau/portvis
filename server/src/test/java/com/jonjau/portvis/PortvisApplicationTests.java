package com.jonjau.portvis;

import com.jonjau.portvis.backtest.BacktestService;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.utils.DateUtil;
import com.jonjau.portvis.utils.DeserializerUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = PortvisApplication.class,
                webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PortvisApplicationTests {

    private final TestRestTemplate restTemplate;
    private final BacktestService backtestService;

    @Autowired
    public PortvisApplicationTests(TestRestTemplate restTemplate, BacktestService backtestService) {
        this.restTemplate = restTemplate;
        this.backtestService = backtestService;
    }

    @LocalServerPort
    private int port;

    private String getRootUrl() {
        return "http://localhost:" + port;
    }

    @Test
    void contextLoads() {
    }

    private Portfolio createAPortfolio() {
        // create and insert a new portfolio
        Portfolio portfolio = new Portfolio();

        // create random allocations, and random values
        Map<String, Double> allocations = new HashMap<>();
        allocations.put("MSFT", 0.5);
        allocations.put("AAPL", 0.5);
        portfolio.setAllocations(allocations);

        portfolio.setInitialValue(100);
        portfolio.setName("test1");

        ResponseEntity<Portfolio> postResponse = restTemplate.postForEntity(
                getRootUrl() + "/portfolios", portfolio, Portfolio.class);

        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());

        return postResponse.getBody();
    }

    @Test
    public void testGetAllPortfolios() {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        ResponseEntity<String> response = restTemplate.exchange(getRootUrl() + "/portfolio",
                HttpMethod.GET, entity, String.class);

        assertNotNull(response.getBody());
    }

    @Test
    public void testGetPortfolioById() {
        Portfolio portfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/1", Portfolio.class);

        System.out.println(portfolio.getName());
        assertNotNull(portfolio);
    }

    @Test
    public void testCreatePortfolio() {
        Portfolio portfolio = new Portfolio();

        // create random allocations, and random values
        Map<String, Double> allocations = new HashMap<>();
        allocations.put("MSFT", 0.50);
        allocations.put("AAPL", 0.50);
        portfolio.setAllocations(allocations);

        portfolio.setInitialValue(1234.567);
        portfolio.setName("pf1");

        ResponseEntity<Portfolio> postResponse = restTemplate.postForEntity(
                getRootUrl() + "/portfolio", portfolio, Portfolio.class);

        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
    }

    @Test
    public void testUpdatePost() {

        Long id = createAPortfolio().getId();

        // get a portfolio
        Portfolio portfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/" + id, Portfolio.class);

        // update name field
        portfolio.setName("pf2");
        portfolio.setInitialValue(123.4);
        restTemplate.put(getRootUrl() + "/portfolio/" + id, portfolio);



        Portfolio updatedPortfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/" + id, Portfolio.class);

        assertEquals(updatedPortfolio.getInitialValue(), 123.4);
        assertNotNull(updatedPortfolio);
    }

    @Test
    public void testDeletePost() {
        int id = 2;
        // get a portfolio
        Portfolio portfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/" + id, Portfolio.class);
        assertNotNull(portfolio);

        // delete the portfolio
        restTemplate.delete(getRootUrl() + "/portfolio/" + id);

        try {
            portfolio = restTemplate.getForObject(
                    getRootUrl() + "/portfolio/" + id, Portfolio.class);
        } catch (final HttpClientErrorException e) {
            assertEquals(e.getStatusCode(), HttpStatus.NOT_FOUND);
        }
    }

    @Test
    public void testBacktestSinglePortfolio() {

        Portfolio portfolio1 = createAPortfolio();
        Long id1 = portfolio1.getId();

        Portfolio portfolio2 = createAPortfolio();
        Long id2 = portfolio2.getId();

        // Sunday 12 June to Tuesday 14 June
        String startDateString = "2020-07-12";
        String endDateString = "2020-07-15";
        String uri = getRootUrl() + "/backtest/";

        LocalDate startDate = DeserializerUtil.parseDate(startDateString);
        LocalDate endDate = DeserializerUtil.parseDate(endDateString);

        System.out.println(startDate);
        System.out.println(endDate);
        //portfolio1 = restTemplate.getForObject(getRootUrl() + "/portfolios/50", Portfolio.class);

//        Map<ZonedDateTime, Double> returns;
//        try {
//            returns = backtestService.returnsCompoundedDaily(
//                    portfolio1, startDate, endDate);
//        } catch (final IOException e) {
//            System.out.println("Date/IO parsing error. Fix your test.");
//            return;
//        }
//
//        System.out.println(returns);
//
//        // This is how you get a class reference to a parameterized type...
//        @SuppressWarnings("unchecked")
//        Class<Map<Date, Double>> classRef = (Class<Map<Date, Double>>) (Class<?>) Map.class;

        //Map<Date, Double> aaa = restTemplate.getForObject(uri, classRef);
        //System.out.println(aaa.toString());
    }

    @Test
    public void testBacktestMultiplePortfolios() {
        Portfolio portfolio1 = createAPortfolio();
        Long id1 = portfolio1.getId();

        Portfolio portfolio2 = createAPortfolio();
        Long id2 = portfolio2.getId();

        List<Portfolio> portfolios = new ArrayList<>();
        portfolios.add(portfolio1);
        portfolios.add(portfolio2);

        // Sunday 12 June to Tuesday 14 June
        String startDateString = "2020-07-10";
        String endDateString = "2020-07-20";
        String uri = getRootUrl() + "/backtest?" + "id=" + id1 + "&id=" + id2
                + "&start=" + startDateString + "&end=" + endDateString;
        uri = getRootUrl() + "/backtest?id=49&id=50&start=2020-07-10&end=2020-07-20";

//        Map<Date, List<Double>> returns;
//        try {
//            returns = backtestService.returnsCompoundedDaily(
//                    portfolios, DateUtil.parseDate(startDateString),
//                    DateUtil.parseDate(endDateString));
//        } catch (final ParseException | IOException e) {
//            System.out.println("Date/IO parsing error. Fix your test.");
//            return;
//        }

        @SuppressWarnings("unchecked")
        Class<Map<LocalDate, List<Double>>> classRef = (Class<Map<LocalDate, List<Double>>>) (Class<?>) Map.class;

        ResponseEntity<Map<LocalDate, List<Double>>> getResponse = restTemplate.getForEntity(
                uri, classRef);

        Map<LocalDate, List<Double>> returns = getResponse.getBody();



        //System.out.println(returns);
    }
}
