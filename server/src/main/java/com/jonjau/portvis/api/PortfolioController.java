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

// RestController includes many other annotations, such as @ResponseBody for each of its methods
// TODO: don't forget to deal with this:
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;

    @Autowired
    public PortfolioController(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }

    @GetMapping("/portfolios")
    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    @GetMapping("/portfolios/{id}")
    public ResponseEntity<Portfolio> getPortfolioById(
            @PathVariable(value = "id") Long portfolioId) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID " + portfolioId + " not found."));
        return ResponseEntity.ok().body(portfolio);
    }

    @PostMapping("/portfolios")
    public Portfolio createPortfolio(@Valid @RequestBody Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    @PutMapping("/portfolios/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @Valid @RequestBody Portfolio portfolioDetails
    ) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID " + portfolioId + " not found."));

        portfolio.setName(portfolioDetails.getName());
        portfolio.setInitialValue(portfolioDetails.getInitialValue());
        portfolio.setAllocations(portfolioDetails.getAllocations());

        final Portfolio updatedPortfolio = portfolioRepository.save(portfolio);

        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/portfolios/{id}")
    public Map<String, Boolean> deletePortfolio(
            @PathVariable(value = "id") Long portfolioId
    ) throws Exception {
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID " + portfolioId + " not found."));

        portfolioRepository.delete(portfolio);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }

    @DeleteMapping("/portfolios/")
    public Map<String, Boolean> deleteAllPortfolios() {
        portfolioRepository.deleteAll();

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }
}
