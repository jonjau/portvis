package com.jonjau.portvis;

import com.jonjau.portvis.data.models.Portfolio;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = PortvisApplication.class,
                webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PortvisApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @LocalServerPort
    private int port;

    private String getRootUrl() {
        return "http://localhost:" + port;
    }

    @Test
    void contextLoads() {
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
        Map<String, Double> allocations = Stream.of(new Object[][] {
                { "MSFT", 0.25 },
                { "NVDA", 0.25},
                { "AAPL", 0.5 },
        }).collect(Collectors.toMap(data -> (String) data[0], data -> (Double) data[1]));

        portfolio.setInitialValue(1234.567);
        portfolio.setName("pf1");
        portfolio.setAllocations(allocations);

        ResponseEntity<Portfolio> postResponse = restTemplate.postForEntity(
                getRootUrl() + "/portfolio", portfolio, Portfolio.class);

        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
    }

    @Test
    public void testUpdatePost() {
        int id = 1;
        // get a portfolio
        Portfolio portfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/" + id, Portfolio.class);

        // update name field
        portfolio.setName("pf2");
        restTemplate.put(getRootUrl() + "/portfolio/" + id, portfolio);

        Portfolio updatedPortfolio = restTemplate.getForObject(
                getRootUrl() + "/portfolio/" + id, Portfolio.class);

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
}
