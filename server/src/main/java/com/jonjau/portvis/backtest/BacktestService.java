package com.jonjau.portvis.backtest;

import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.timeseries.TimeSeriesData;
import com.jonjau.portvis.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.DateTimeException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    public Map<Date, Double> returnsCompoundedDaily(Portfolio portfolio, Date start, Date end)
            throws IOException {

        // Convert Date to LocalDateTime, newer Java 8 API.
        // Maybe do away with Date entirely? That would require modifying DeserializerUtil.
        LocalDateTime startDate = DateUtil.asLocalDateTime(start);
        LocalDateTime endDate = DateUtil.asLocalDateTime(end);

        double portfolioValue = portfolio.getInitialValue();
        Map<String, Double> allocations = portfolio.getAllocations();

        Map<String, Map<Date, TimeSeriesData>> assetPrices = new HashMap<>();
        for (String symbol : allocations.keySet()) {
            Map<Date, TimeSeriesData> data = client.getTimeSeriesResult(symbol).getTimeSeries();
            assetPrices.put(symbol, data);
        }

        // dates with price data i.e. trading days
        // assumes all assets have been floated by the start date
        Set<Date> validDates = assetPrices.entrySet().iterator().next().getValue().keySet();

        Map<Date, Double> portfolioValueOverTime = new TreeMap<>();

        // TODO: assumes startDate is valid, if not then seek next!
        if (!validDates.contains(DateUtil.asDate(startDate))) {
            startDate = seekNextValidDate(startDate, validDates);
        }
        portfolioValueOverTime.put(DateUtil.asDate(startDate), portfolioValue);
        // also assuming endDate is valid, if not then seek previous...
        if (!validDates.contains(DateUtil.asDate(endDate))) {
            endDate = seekPreviousValidDate(endDate, validDates);
        }

        LocalDateTime date = seekNextValidDate(startDate, validDates);
        for (; date.isBefore(endDate) || date.isEqual(endDate);
             date = seekNextValidDate(date, validDates)) {
            // TODO: weekends?
            //Date prevDate = DateUtil.asDate(date.minusDays(1));
            Date prevDate = DateUtil.asDate(seekPreviousValidDate(date, validDates));
            Date currDate = DateUtil.asDate(date);
            double prevValue = portfolioValueOverTime.get(prevDate);
            double currValue = 0;
            for (Map.Entry<String, Double> allocation : allocations.entrySet()) {

                double allocationValue = prevValue * allocation.getValue();
                if (allocationValue == 0) {
                    continue;
                }
                String symbol = allocation.getKey();
                double pricePrev = getOHLCAverage(assetPrices.get(symbol).get(prevDate));
                double priceCurr = getOHLCAverage(assetPrices.get(symbol).get(currDate));

                double rateOfReturn = (priceCurr / pricePrev) - 1;

                currValue += allocationValue * (1 + rateOfReturn);
            }
            // again, LocalDateTime or date?
            portfolioValueOverTime.put(currDate, currValue);
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

    public Map<Date, List<Double>> returnsCompoundedDaily(List<Portfolio> portfolios, Date start, Date end) throws IOException {

        List<Map<Date, Double>> list = new ArrayList<>();
        for (Portfolio portfolio : portfolios) {
            Map<Date, Double> dateDoubleMap = returnsCompoundedDaily(portfolio, start, end);
            list.add(dateDoubleMap);
        }
        System.out.println(list);
        //class DateDoubleMap extends HashMap<Date, Double> {}
        //Map<Date, Double>[] returns = (DateDoubleMap[]) list.toArray();
        // reflection! Apparently this is the modern way to convert a List into an array
        //Portfolio[] args = portfolios.toArray(new Portfolio[0]);
        Map<Date, List<Double>> resultMap = list.stream()
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
        return resultMap;
    }

    public LocalDateTime seekNextValidDate(
            LocalDateTime dateTime, Set<Date> validDates
    ) {
        int daysToSkip = 7;

        if (dateTime.isBefore(LocalDateTime.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(DateUtil.asDate(dateTime.plusDays(i)))) {
                    return dateTime.plusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " found after " + dateTime.toString());
    }

    public boolean isWeekend(LocalDateTime datetime) {
        DayOfWeek dow = datetime.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    public LocalDateTime seekPreviousValidDate(
            LocalDateTime dateTime, Set<Date> validDates
    ) {
        int daysToSkip = 7;

        if (dateTime.isBefore(LocalDateTime.now())) {
            for (int i = 1; i <= daysToSkip; i++) {
                if (validDates.contains(DateUtil.asDate(dateTime.minusDays(i)))) {
                    return dateTime.minusDays(i);
                }
            }
        }
        throw new DateTimeException("No valid date within " + daysToSkip +
                " found  before " + dateTime.toString());
    }
}
