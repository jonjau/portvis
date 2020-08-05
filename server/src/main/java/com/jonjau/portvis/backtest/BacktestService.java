package com.jonjau.portvis.backtest;

import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.timeseries.TimeSeriesData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
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

    public Map<LocalDate, Double> returnsCompoundedDaily(Portfolio portfolio, LocalDate start, LocalDate end)
            throws IOException {

        // validate date, validate allocation proportions: must add up to one

        LocalDate startDate = start;
        LocalDate endDate = end;

        double portfolioValue = portfolio.getInitialValue();
        Map<String, Double> allocations = portfolio.getAllocations();

        Map<String, Map<LocalDate, TimeSeriesData>> assetPrices = new HashMap<>();
        for (String symbol : allocations.keySet()) {
            Map<LocalDate, TimeSeriesData> data = client.getTimeSeriesResult(symbol).getTimeSeries();
            assetPrices.put(symbol, data);
        }

        // dates with price data i.e. trading days
        // assumes all assets have been floated by the start date
        Set<LocalDate> validDates = assetPrices.entrySet().iterator().next().getValue().keySet();

        Map<LocalDate, Double> portfolioValueOverTime = new TreeMap<>();

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
            double prevValue = portfolioValueOverTime.get(prevDate);
            double currValue = 0;
            for (Map.Entry<String, Double> allocation : allocations.entrySet()) {

                double allocationValue = prevValue * allocation.getValue();
                if (allocationValue == 0) {
                    continue;
                }
                String symbol = allocation.getKey();
                double pricePrev = getOHLCAverage(assetPrices.get(symbol).get(prevDate));
                double priceCurr = getOHLCAverage(assetPrices.get(symbol).get(date));

                double rateOfReturn = (priceCurr / pricePrev) - 1;

                currValue += allocationValue * (1 + rateOfReturn);
            }
            // again, LocalDateTime or date?
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
    public double getOHLCAverage(TimeSeriesData prices) {
        // Calculating mean in Java :)
        DoubleSummaryStatistics stats = new DoubleSummaryStatistics();
        stats.accept(prices.getOpen());
        stats.accept(prices.getHigh());
        stats.accept(prices.getLow());
        stats.accept(prices.getClose());

        return stats.getAverage();
    }

    public Map<LocalDate, List<Double>> returnsCompoundedDaily(
            List<Portfolio> portfolios, LocalDate start, LocalDate end
    ) throws IOException {

        List<Map<LocalDate, Double>> list = new ArrayList<>();
        for (Portfolio portfolio : portfolios) {
            Map<LocalDate, Double> dateDoubleMap = returnsCompoundedDaily(portfolio, start, end);
            list.add(dateDoubleMap);
        }
        //System.out.println(list);
        //class DateDoubleMap extends HashMap<Date, Double> {}
        //Map<Date, Double>[] returns = (DateDoubleMap[]) list.toArray();
        // reflection! Apparently this is the modern way to convert a List into an array
        //Portfolio[] args = portfolios.toArray(new Portfolio[0]);
        Map<LocalDate, List<Double>> resultMap = list.stream()
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        (entry) -> {
                            List<Double> doubleList = new ArrayList<>();
                            doubleList.add(entry.getValue());
                            return doubleList;
                        },
                        (val1, val2) -> {
                            List<Double> newList = new ArrayList<>(val1);
                            newList.addAll(val2);
                            return newList;
                        })
                );
        Map<LocalDate, List<Double>> sortedMap = new TreeMap<>(resultMap);
        return sortedMap;
    }

    public LocalDate seekNextValidDate(
            LocalDate dateTime, Set<LocalDate> validDates
    ) {
        int daysToSkip = 7;

        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.plusDays(i))) {
                    return dateTime.plusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " found after " + dateTime.toString());
    }

    public boolean isWeekend(LocalDate datetime) {
        DayOfWeek dow = datetime.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    public LocalDate seekPreviousValidDate(
            LocalDate dateTime, Set<LocalDate> validDates
    ) {
        int daysToSkip = 7;

        if (dateTime.isBefore(LocalDate.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(dateTime.minusDays(i))) {
                    return dateTime.minusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " found  before " + dateTime.toString());
    }
}
