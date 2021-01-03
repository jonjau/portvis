package com.jonjau.portvis.dto;

import com.jonjau.portvis.validator.PortfolioAllocationsSumConstraint;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;

@Data
public class PortfolioDto {
    private long id;

    @Size(max=255, message = "Portfolio name must be between 0 and 255 characters.")
    private String name;

    @Min(value=0, message="Portfolio initial value must be between 0 and 1 billion.")
    @Max(value=1_000_000_000, message="Portfolio initial value must be between 0 and 1 billion.")
    private BigDecimal initialValue;

    // Custom constraint: allocations must sum to 1.0
    @PortfolioAllocationsSumConstraint
    private Map<String, BigDecimal> allocations = new TreeMap<>();
}
