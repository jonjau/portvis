package com.jonjau.portvis.backtest;

import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.timeseries.TimeSeriesData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BacktestService {

    private final AlphaVantageClient client;

    /**
     * This class performs the analysis on the time series data. Therefore it requires the
     * alphavantage client to receive data. An improvement would be to store the query results
     * from alphavantage to not have to request every time.
     * FIXME: never trust the client????
     *
     * @param client will be injected by Spring
     */
    @Autowired
    public BacktestService(AlphaVantageClient client) {
        this.client = client;
    }

    public Map<LocalDate, BigDecimal> returnsCompoundedDaily(
            Portfolio portfolio, LocalDate startDate, LocalDate endDate, String apiKey
    ) throws IOException {

        BigDecimal portfolioValue = portfolio.getInitialValue();
        Map<String, BigDecimal> allocations = portfolio.getAllocations();

        Map<String, Map<LocalDate, TimeSeriesData>> assetPrices = new HashMap<>();
        for (String symbol : allocations.keySet()) {
            Map<LocalDate, TimeSeriesData> data = client.getTimeSeriesResult(symbol, apiKey).getTimeSeries();
            assetPrices.put(symbol, data);
        }

        // get dates with price data i.e. trading days
        // if at least one asset hasn't been floated by the start date,
        // then a DateTime exception will be thrown by the date seeking functions
        Set<LocalDate> validDates = assetPrices.entrySet().iterator().next().getValue().keySet();

        Map<LocalDate, BigDecimal> portfolioValueOverTime = new TreeMap<>();

        // TODO: assumes startDate is valid, if not then seek next!
        if (!validDates.contains(startDate)) {
            startDate = seekNextValidDate(startDate, validDates);
        }
        portfolioValueOverTime.put(startDate, portfolioValue);
        // also assuming endDate is valid, if not then seek previous...
        if (!validDates.contains(endDate)) {
            endDate = seekPreviousValidDate(endDate, validDates);
        }

        LocalDate date = seekNextValidDate(startDate, validDates);
        for (; date.isBefore(endDate) || date.isEqual(endDate);
             date = seekNextValidDate(date, validDates)) {
            // TODO: weekends?
            //Date prevDate = DateUtil.asDate(date.minusDays(1));
            LocalDate prevDate = seekPreviousValidDate(date, validDates);
            BigDecimal prevValue = portfolioValueOverTime.get(prevDate);
            BigDecimal currValue = new BigDecimal(0);
            for (Map.Entry<String, BigDecimal> allocation : allocations.entrySet()) {

                BigDecimal allocationValue = prevValue.multiply(allocation.getValue());
                if (allocationValue.compareTo(BigDecimal.ZERO) == 0) {
                    continue;
                }
                String symbol = allocation.getKey();
                BigDecimal pricePrev = getOHLCAverage(assetPrices.get(symbol).get(prevDate));
                BigDecimal priceCurr = getOHLCAverage(assetPrices.get(symbol).get(date));

                currValue = currValue.add(
                        allocationValue.multiply(priceCurr)
                                .divide(pricePrev, RoundingMode.HALF_UP));
            }
            portfolioValueOverTime.put(date, currValue);
        }
        return portfolioValueOverTime;
    }

    /**
     * Calculates the average of open, high, low, and close prices for a given period
     *
     * @param prices TimeSeriesData representing prices in a period.
     * @return the OHLC average.
     */
    public BigDecimal getOHLCAverage(TimeSeriesData prices) {
        // Calculating mean of BigDecimals in Java :)
        BigDecimal sum = new BigDecimal(0);
        sum = sum.add(prices.getOpen());
        sum = sum.add(prices.getHigh());
        sum = sum.add(prices.getLow());
        sum = sum.add(prices.getClose());
        return sum.divide(new BigDecimal(4), RoundingMode.HALF_UP);
    }

    public Map<LocalDate, List<BigDecimal>> returnsCompoundedDaily(
            List<Portfolio> portfolios, LocalDate start, LocalDate end, String apiKey
    ) throws IOException {

        List<Map<LocalDate, BigDecimal>> list = new ArrayList<>();
        for (Portfolio portfolio : portfolios) {
            Map<LocalDate, BigDecimal> dateDoubleMap = returnsCompoundedDaily(portfolio, start, end, apiKey);
            list.add(dateDoubleMap);
        }
        //System.out.println(list);
        //class DateDoubleMap extends HashMap<Date, Double> {}
        //Map<Date, Double>[] returns = (DateDoubleMap[]) list.toArray();
        // reflection! Apparently this is the modern way to convert a List into an array
        //Portfolio[] args = portfolios.toArray(new Portfolio[0]);
        Map<LocalDate, List<BigDecimal>> resultMap = list.stream()
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
        // this is one way to sort a map by keys...
        Map<LocalDate, List<BigDecimal>> sortedMap = new TreeMap<>(resultMap);
        return sortedMap;
    }

    public LocalDate seekNextValidDate(LocalDate dateTime, Set<LocalDate> validDates) {
        int daysToSkip = 7;
        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.plusDays(i))) {
                    return dateTime.plusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " days found after " + dateTime.toString());
    }

    public boolean isWeekend(LocalDate datetime) {
        DayOfWeek dow = datetime.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    public LocalDate seekPreviousValidDate(LocalDate dateTime, Set<LocalDate> validDates) {
        int daysToSkip = 7;

        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.minusDays(i))) {
                    return dateTime.minusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " days found  before " + dateTime.toString());
    }
}
