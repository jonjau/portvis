package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.PortfolioDto;
import com.jonjau.portvis.exception.PortfolioNotFoundException;
import com.jonjau.portvis.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// RestController includes many other annotations, such as @ResponseBody for each of its methods
//@CrossOrigin
// FIXME: don't forget to deal with this:
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
public class PortfolioController {


    private PortfolioService portfolioService;

    @Autowired
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // trailing slash "/", stay consistent
    @GetMapping("/portfolios/")
    public List<PortfolioDto> getAllPortfolios(
            @RequestAttribute(name = "username") String username
    ) {
        return portfolioService.getAllPortfoliosOfUser(username);
    }

    @GetMapping("/portfolios/{id}")
    public PortfolioDto getPortfolioById(
            @PathVariable(value = "id") Long portfolioId,
            @RequestAttribute(name = "username") String username
    ) throws PortfolioNotFoundException {
        return portfolioService.getPortfolioOfUser(username, portfolioId);
    }

    @PostMapping("/portfolios/")
    public PortfolioDto createPortfolio(
            @Valid @RequestBody PortfolioDto portfolio,
            @RequestAttribute(name = "username") String username
    ) {
        return portfolioService.createPortfolio(portfolio, username);
    }

    @PutMapping("/portfolios/{id}")
    public PortfolioDto updatePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @Valid @RequestBody PortfolioDto portfolioDetails,
            @RequestAttribute(name = "username") String username
    ) throws Exception {
        return portfolioService.updatePortfolio(portfolioId, portfolioDetails, username);
    }

    @DeleteMapping("/portfolios/{id}")
    public Map<String, Boolean> deletePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @RequestAttribute(name = "username") String username
    ) throws Exception {
        portfolioService.deletePortfolio(username, portfolioId);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }

    @DeleteMapping("/portfolios/")
    public Map<String, Boolean> deleteAllPortfolios(
            @RequestAttribute(name = "username") String username
    ) {
        portfolioService.deleteAllPortfolios(username);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }
}
