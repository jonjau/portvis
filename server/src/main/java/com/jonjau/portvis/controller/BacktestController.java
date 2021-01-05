package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.PortfolioDto;
import com.jonjau.portvis.service.BacktestService;
import com.jonjau.portvis.service.PortfolioService;
import com.jonjau.portvis.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class BacktestController {

    private final BacktestService backtestService;
    private final PortfolioService portfolioService;

    @Autowired
    public BacktestController(BacktestService backtestService, PortfolioService portfolioService) {
        this.backtestService = backtestService;
        this.portfolioService = portfolioService;
    }

    // no trailing backslash, 'backtest' IS the resource
    @GetMapping(value = "/backtest", params = {"id", "start", "end", "apiKey"})
    public Map<LocalDate, List<BigDecimal>> getReturns(
            @RequestParam("id") List<Long> portfolioIds,
            @RequestParam("start") String startDateString,
            @RequestParam("end") String endDateString,
            @RequestParam("apiKey") String apiKey
    ) throws Exception {

        LocalDate start = DateUtil.parseDate(startDateString);
        LocalDate end = DateUtil.parseDate(endDateString);

        List<PortfolioDto> portfolios = portfolioService.getPortfolios(portfolioIds);

        return backtestService.returnsCompoundedDaily(
                portfolios, start, end, apiKey);
    }
}
