package com.jonjau.portvis.backtest;

import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.data.models.Portfolio;
import com.jonjau.portvis.timeseries.TimeSeriesData;
import com.jonjau.portvis.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

public class Backtest {

    private final AlphaVantageClient client;

    /**
     * This class performs the analysis on the time series data. Therefore it requires the
     * alphavantage client to receive data. An improvement would be to store the query results
     * from alphavantage to not have to request every time.
     *
     * @param client will be injected by Spring
     */
    @Autowired
    public Backtest(AlphaVantageClient client) {
        this.client = client;
    }

    public Map<Date, Double> simpleReturn(Portfolio portfolio, Date start, Date end)
            throws IOException {

//        LocalDateTime startDate = LocalDateTime.from(Instant.ofEpochMilli(start.getTime()));
//        LocalDateTime endDate = LocalDateTime.from(Instant.ofEpochMilli(end.getTime()));

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

        Map<Date, Double> portfolioValueOverTime = new HashMap<>();

        LocalDateTime date = startDate.plusDays(1);
        for (; date.isBefore(endDate); date = date.plusDays(1)) {
            for (Map.Entry<String, Double> allocation : allocations.entrySet()) {

                String symbol = allocation.getKey();
                double proportion = allocation.getValue();

                double pricePrev = getOHLCAverage(
                        assetPrices.get(symbol).get(DateUtil.asDate(date.minusDays(1))));
                double priceCurr = getOHLCAverage(
                        assetPrices.get(symbol).get(DateUtil.asDate(date)));

                double rateOfReturn = (priceCurr / pricePrev) - 1;

                portfolioValue += portfolioValue * proportion * (1 + rateOfReturn);

                // again, LocalDateTime or date?
                portfolioValueOverTime.put(DateUtil.asDate(date), portfolioValue);
            }
        }
        return portfolioValueOverTime;
    }

    /**
     * Calculates the average of open, high, low, and close prices for a given period
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
}
