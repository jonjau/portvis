package com.jonjau.portvis.api;

import com.jonjau.portvis.backtest.BacktestRequest;
import com.jonjau.portvis.backtest.BacktestService;
import com.jonjau.portvis.data.PortfolioRepository;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.utils.DateUtil;
import com.jonjau.portvis.utils.DeserializerUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "/backtest", params = {"id", "start", "end"})
    public Map<Date, List<Double>> getReturns(
            @RequestParam("id") List<Long> portfolioIds,
            @RequestParam("start") String startDateString,
            @RequestParam("end") String endDateString
    ) throws Exception {

        System.out.println(portfolioIds);

        List<Portfolio> portfolios = portfolioIds.stream()
                .map(portfolioRepository::findById)
                .filter(Optional::isPresent).map(Optional::get)
                .collect(Collectors.toList());

        Date startDate = DeserializerUtil.parseDate(startDateString);
        Date endDate = DeserializerUtil.parseDate(endDateString);

        System.out.println(startDate);
        System.out.println(endDate);

        Map<Date, List<Double>> returns = backtestService.returnsCompoundedDaily(
                portfolios, startDate, endDate);

//        Map<Date, List<Double>> returns = new TreeMap<>();
//        returns.put(DeserializerUtil.parseDate("2020-07-12"), Arrays.asList(101.57485468921821, 101.57485468921821));
//        returns.put(DeserializerUtil.parseDate("2020-07-14"), Arrays.asList(102.75239566424048, 102.75239566424048));
//        returns.put(DeserializerUtil.parseDate("2020-07-10"), Arrays.asList(100.0, 100.0));
//        returns.put(DeserializerUtil.parseDate("2020-07-13"), Arrays.asList(100.28538513902708, 100.28538513902708));
//        returns.put(DeserializerUtil.parseDate("2020-07-11"), Arrays.asList(100.0, 100.0));

        System.out.println("mario");
        System.out.println(returns);

        return returns;
    }


//    @GetMapping(value = "/backtest")
//    public Map<Date, List<Double>> getReturns(@RequestBody BacktestRequest backtestRequest
//    ) throws Exception {
//
//        List<Long> portfolioIds = backtestRequest.getPortfolioIds();
//        List<Portfolio> portfolios = portfolioIds.stream()
//                .map(portfolioRepository::findById)
//                .filter(Optional::isPresent).map(Optional::get)
//                .collect(Collectors.toList());
//
//        Date startDate = DateUtil.asDate(backtestRequest.getStart());
//        Date endDate = DateUtil.asDate(backtestRequest.getEnd());
//        Map<Date, List<Double>> returns = backtestService.returnsCompoundedDaily(portfolios, startDate, endDate);
////        Portfolio portfolio = portfolioRepository.findById(portfolioId)
////                .orElseThrow(() -> new Exception(
////                        "Portfolio with ID " + portfolioId + " not found."));
////
////        Date startDate = DeserializerUtil.parseDate(startDateString);
////        Date endDate = DeserializerUtil.parseDate(endDateString);
////
////        Map<Date, Double> returns = backtestService.returnsCompoundedDaily(
////                portfolio, startDate, endDate);
//        return returns;
//    }
}
