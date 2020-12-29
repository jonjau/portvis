package com.jonjau.portvis.controller;

import com.jonjau.portvis.service.BacktestService;
import com.jonjau.portvis.repository.PortfolioRepository;
import com.jonjau.portvis.repository.entity.Portfolio;
import com.jonjau.portvis.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BacktestController {

    private final BacktestService backtestService;
    private final PortfolioRepository portfolioRepository;

    @Autowired
    public BacktestController(
            PortfolioRepository portfolioRepository, BacktestService backtestService
    ) {
        this.portfolioRepository = portfolioRepository;
        this.backtestService = backtestService;
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

        List<Portfolio> portfolios = portfolioIds.stream()
                .map(portfolioRepository::findById)
                .filter(Optional::isPresent).map(Optional::get)
                .collect(Collectors.toList());

        Map<LocalDate, List<BigDecimal>> returns = backtestService.returnsCompoundedDaily(
                portfolios, start, end, apiKey);

//        Map<Date, List<Double>> returns = new TreeMap<>();
//        returns.put(DeserializerUtil.parseDate("2020-07-12"), Arrays.asList(101.57485468921821, 101.57485468921821));
//        returns.put(DeserializerUtil.parseDate("2020-07-14"), Arrays.asList(102.75239566424048, 102.75239566424048));
//        returns.put(DeserializerUtil.parseDate("2020-07-10"), Arrays.asList(100.0, 100.0));
//        returns.put(DeserializerUtil.parseDate("2020-07-13"), Arrays.asList(100.28538513902708, 100.28538513902708));
//        returns.put(DeserializerUtil.parseDate("2020-07-11"), Arrays.asList(100.0, 100.0));

        System.out.println(returns);
        return returns;
    }
}
