package com.jonjau.portvis.service;

import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import com.jonjau.portvis.dto.PortfolioDto;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResultItem;
import com.jonjau.portvis.exception.MissingPriceInformationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsible for returning the calculated returns of portfolios over time, based on
 * the stock price data retrieved from AlphaVantage.
 */
@Service
public class BacktestService {

    /**
     * Duration to skip when seeking the closest trading day. Beyond this, exceptions will be
     * thrown.
     */
    private static final Duration CLOSEST_TRADING_DAY_MARGIN = Duration.ofDays(40);

    /**
     * This class performs the analysis on the time series data. Therefore it requires the
     * AlphaVantage client to receive data.
     */
    private final AlphaVantageClient client;

    @Autowired
    public BacktestService(AlphaVantageClient client) {
        this.client = client;
    }

    /**
     * Same as returnsCompoundedDaily for multiple portfolio, but this is for a single portfolio
     *
     * @param portfolio the Portfolio to calculate returns for
     * @param startDate Date from which to start calculating returns
     * @param endDate Date up to which (inclusive) returns will be calculated
     * @param apiKey AlphaVantage ApiKey
     * @return The value of the given portfolio over time from the start date to the end date
     * @throws IOException if something goes wrong as stock prices are fetched
     * @throws MissingPriceInformationException if there is a exceptional gap between dates where
     *              there is price data available for at least on the stocks in the portfolio
     */
    private Map<LocalDate, BigDecimal> returnsCompoundedDaily(
            PortfolioDto portfolio, LocalDate startDate, LocalDate endDate, String apiKey
    ) throws IOException, MissingPriceInformationException {

        BigDecimal portfolioValue = portfolio.getInitialValue();
        Map<String, BigDecimal> allocations = portfolio.getAllocations();

        // populate map, mapping each symbol to their prices over time.
        Map<String, Map<LocalDate, TimeSeriesResultItem>> assetPrices = new HashMap<>();
        for (String symbol : allocations.keySet()) {
            Map<LocalDate, TimeSeriesResultItem> data = client
                    .getTimeSeriesResult(symbol, apiKey).getTimeSeries();
            assetPrices.put(symbol, data);
        }

        // get dates with price data i.e. trading days
        // if at least one asset hasn't been floated by the start date,
        // then a DateTime exception will be thrown by the date seeking functions
        Set<LocalDate> validDates = assetPrices.entrySet().iterator().next().getValue().keySet();

        Map<LocalDate, BigDecimal> portfolioValueOverTime = new TreeMap<>();

        // assume startDate is valid, if not then seek next date that is!
        if (!validDates.contains(startDate)) {
            startDate = seekNextValidDate(startDate, validDates);
        }
        portfolioValueOverTime.put(startDate, portfolioValue);
        // also assuming endDate is valid, if not then seek previous...
        if (!validDates.contains(endDate)) {
            endDate = seekPreviousValidDate(endDate, validDates);
        }

        // Would be great if we had operator overloading :')
        LocalDate date = seekNextValidDate(startDate, validDates);
        for (; date.isBefore(endDate) || date.isEqual(endDate);
             date = seekNextValidDate(date, validDates)) {

            LocalDate prevDate = seekPreviousValidDate(date, validDates);
            BigDecimal prevValue = portfolioValueOverTime.get(prevDate);
            BigDecimal currPortfolioValue = new BigDecimal(0);

            for (Map.Entry<String, BigDecimal> allocation : allocations.entrySet()) {

                // Calculate how much money is allocated in the currently considered stock
                // If this is zero, then skip calculation: it will not appreciate.
                BigDecimal allocationValue = prevValue.multiply(allocation.getValue());
                if (allocationValue.compareTo(BigDecimal.ZERO) == 0) {
                    continue;
                }
                String symbol = allocation.getKey();
                BigDecimal pricePrev = getOHLCAverage(assetPrices.get(symbol).get(prevDate));
                BigDecimal priceCurr = getOHLCAverage(assetPrices.get(symbol).get(date));

                // This is currPortfolioValue +=
                //  allocationvalue * current stock price / previous stock price
                currPortfolioValue = currPortfolioValue.add(
                        allocationValue.multiply(priceCurr)
                                .divide(pricePrev, RoundingMode.HALF_UP));
            }
            portfolioValueOverTime.put(date, currPortfolioValue);
        }
        return portfolioValueOverTime;
    }

    /**
     * Calculates the average of open, high, low, and close prices for a given period, rounding
     * half up.
     *
     * @param prices TimeSeriesData representing prices in a period.
     * @return the OHLC average.
     */
    public BigDecimal getOHLCAverage(TimeSeriesResultItem prices) {
        // Calculating mean of BigDecimals in Java...
        BigDecimal sum = new BigDecimal(0);
        sum = sum.add(prices.getOpen());
        sum = sum.add(prices.getHigh());
        sum = sum.add(prices.getLow());
        sum = sum.add(prices.getClose());
        return sum.divide(new BigDecimal(4), RoundingMode.HALF_UP);
    }

    /**
     * Returns the values of portfolios over time, where returns are compounded daily and
     * portfolios are rebalanced daily. If the start date does not have price information then the
     * calculations will start at the next closest trading day. Likewise, if the end date does not
     * have price information, then the calculations will end at the previous closest trading day.
     *
     * @param portfolios the Portfolios to calculate returns for
     * @param startDate Date from which to start calculating returns
     * @param endDate Date up to which (exclusive) returns will be calculated
     * @param apiKey AlphaVantage ApiKey
     * @return The value of the given portfolios over time from the start date to the end date
     * @throws IOException if something goes wrong as stock prices are fetched
     * @throws MissingPriceInformationException if there is a exceptional gap between dates where
*              there is price data available for at least on the stocks in one of the portfolios.
     */
    public Map<LocalDate, List<BigDecimal>> returnsCompoundedDaily(
            List<PortfolioDto> portfolios, LocalDate startDate, LocalDate endDate, String apiKey
    ) throws IOException, MissingPriceInformationException {

        // Initialise list of backtest results, each item corresponds to a portfolio's returns
        // over time (i.e. Map of Date and BigDecimal)
        List<Map<LocalDate, BigDecimal>> backtestResults = new ArrayList<>();
        for (PortfolioDto portfolio : portfolios) {
            Map<LocalDate, BigDecimal> dateDoubleMap = returnsCompoundedDaily(
                    portfolio, startDate, endDate, apiKey);
            backtestResults.add(dateDoubleMap);
        }

        // Combine it such that it becomes dates mapped to the current values of each portfolio.
        Map<LocalDate, List<BigDecimal>> resultMap = backtestResults.stream()
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        (entry) -> {
                            List<BigDecimal> bdList= new ArrayList<>();
                            bdList.add(entry.getValue());
                            return bdList;
                        },
                        (val1, val2) -> {
                            List<BigDecimal> newList = new ArrayList<>(val1);
                            newList.addAll(val2);
                            return newList;
                        })
                );
        // We need it to be chronological, and this is one way to sort a map by keys...
        return new TreeMap<>(resultMap);
    }

    private LocalDate seekNextValidDate(
            LocalDate dateTime,
            Set<LocalDate> validDates
    ) throws MissingPriceInformationException {
        long daysToSkip = CLOSEST_TRADING_DAY_MARGIN.toDays();

        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.plusDays(i))) {
                    return dateTime.plusDays(i);
                }
            }
        }
        throw new MissingPriceInformationException(dateTime, CLOSEST_TRADING_DAY_MARGIN);
    }

    private LocalDate seekPreviousValidDate(
            LocalDate dateTime,
            Set<LocalDate> validDates
    ) throws MissingPriceInformationException {
        long daysToSkip = CLOSEST_TRADING_DAY_MARGIN.toDays();

        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.minusDays(i))) {
                    return dateTime.minusDays(i);
                }
            }
        }
        throw new MissingPriceInformationException(dateTime, CLOSEST_TRADING_DAY_MARGIN);
    }
}
