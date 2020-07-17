package com.jonjau.portvis.api;

import com.jonjau.portvis.data.PortfolioRepository;
import com.jonjau.portvis.data.models.Portfolio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;

    @Autowired
    public PortfolioController(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    @GetMapping("/portfolio")
    public List<Portfolio> getPortfolio() {
        return portfolioRepository.findAll();
    }

    @GetMapping("/portfolio/{id}")
    public ResponseEntity<Portfolio> getUserById(
            @PathVariable(value = "id") Long portfolioId) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID "+ portfolioId + " not found."));
        return ResponseEntity.ok().body(portfolio);
    }

    @PostMapping("/portfolio")
    public Portfolio createPortfolio(@Valid @RequestBody Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    @PutMapping("/portfolio/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @Valid @RequestBody Portfolio portfolioDetails) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID "+ portfolioId + " not found."));

        portfolio.setAllocations(portfolioDetails.getAllocations());
        final Portfolio updatedPortfolio = portfolioRepository.save(portfolio);

        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/portfolio/{id}")
    public Map<String, Boolean> deletePortfolio(
            @PathVariable(value="id") Long portfolioId) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID "+ portfolioId + " not found."));

        portfolioRepository.delete(portfolio);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
}
