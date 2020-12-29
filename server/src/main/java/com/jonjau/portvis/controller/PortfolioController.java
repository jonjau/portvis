package com.jonjau.portvis.controller;

import com.jonjau.portvis.repository.PortfolioRepository;
import com.jonjau.portvis.repository.UserRepository;
import com.jonjau.portvis.repository.entity.Portfolio;
import com.jonjau.portvis.repository.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// RestController includes many other annotations, such as @ResponseBody for each of its methods
//@CrossOrigin
// FIXME: don't forget to deal with this:
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
public class PortfolioController {

    @Value("${portvis.auth.accessTokenCookieName}")
    private String accessTokenCookieName;

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @Autowired
    public PortfolioController(PortfolioRepository portfolioRepo, UserRepository userRepo) {
        this.portfolioRepository = portfolioRepo;
        this.userRepository = userRepo;
    }

    private List<Portfolio> getPortfoliosOfUser(String username) {
        User user = userRepository.findByUsername(username);
        return portfolioRepository.findAllByUser(user);
    }

    private Portfolio getPortfolioOfUser(String username, long portfolioId) throws Exception {
        return getPortfoliosOfUser(username)
                .stream()
                .filter(p -> p.getId() == portfolioId)
                .findFirst()
                .orElseThrow(() -> new Exception(
                        "Portfolio with ID " + portfolioId +" of user " + username +
                        " not found."));
    }

    // trailing slash "/", stay consistent
    @GetMapping("/portfolios/")
    public List<Portfolio> getAllPortfolios(
            @RequestAttribute(name = "username") String username
    ) {
        return getPortfoliosOfUser(username);
    }

    @GetMapping("/portfolios/{id}")
    public ResponseEntity<Portfolio> getPortfolioById(
            @PathVariable(value = "id") Long portfolioId,
            @RequestAttribute(name = "username") String username
    ) throws Exception {

        Portfolio portfolio = getPortfolioOfUser(username, portfolioId);
        return ResponseEntity.ok().body(portfolio);
    }

    @PostMapping("/portfolios/")
    public Portfolio createPortfolio(
            @Valid @RequestBody Portfolio portfolio,
            @RequestAttribute(name = "username") String username
    ) throws Exception {
        User user = userRepository.findByUsername(username);
        portfolio.setUser(user);

        // FIXME: ugly check, should be in Portfolio's constructor / factory method...
        BigDecimal sum = new BigDecimal(0);
        for (BigDecimal d : portfolio.getAllocations().values()) {
            sum = sum.add(d);
        }
        boolean isFullyAllocated = sum.compareTo(BigDecimal.ONE) == 0;
        if (!isFullyAllocated) {
            throw new Exception("Total portfolio allocation must exactly equal 100%");
        }
        return portfolioRepository.save(portfolio);
    }

    @PutMapping("/portfolios/{id}")
    public ResponseEntity<Portfolio> updatePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @Valid @RequestBody Portfolio portfolioDetails,
            @RequestAttribute(name = "username") String username
    ) throws Exception {

        Portfolio portfolio = getPortfolioOfUser(username, portfolioId);

        BigDecimal sum = new BigDecimal(0);
        for (BigDecimal d : portfolio.getAllocations().values()) {
            sum = sum.add(d);
        }
        boolean isFullyAllocated = sum.compareTo(BigDecimal.ONE) == 0;
        if (!isFullyAllocated) {
            throw new Exception("Total portfolio allocation must exactly equal 100%");
        }

        portfolio.setName(portfolioDetails.getName());
        portfolio.setInitialValue(portfolioDetails.getInitialValue());
        portfolio.setAllocations(portfolioDetails.getAllocations());

        final Portfolio updatedPortfolio = portfolioRepository.save(portfolio);

        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/portfolios/{id}")
    public Map<String, Boolean> deletePortfolio(
            @PathVariable(value = "id") Long portfolioId,
            @RequestAttribute(name = "username") String username
    ) throws Exception {
        Portfolio portfolio = getPortfolioOfUser(username, portfolioId);
        portfolioRepository.delete(portfolio);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }

    @DeleteMapping("/portfolios/")
    public Map<String, Boolean> deleteAllPortfolios(
            @RequestAttribute(name = "username") String username
    ) {
        List<Portfolio> portfolios = getPortfoliosOfUser(username);
        portfolioRepository.deleteAll(portfolios);

        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);

        return response;
    }
}
