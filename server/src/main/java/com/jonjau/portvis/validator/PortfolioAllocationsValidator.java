package com.jonjau.portvis.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.math.BigDecimal;
import java.util.Map;

public class PortfolioAllocationsValidator implements
        ConstraintValidator<PortfolioAllocationsSumConstraint, Map<String, BigDecimal>> {

    @Override
    public void initialize(PortfolioAllocationsSumConstraint constraintAnnotation) {
    }

    @Override
    public boolean isValid(Map<String, BigDecimal> value, ConstraintValidatorContext context) {
        BigDecimal sum = new BigDecimal(0);
        for (BigDecimal d : value.values()) {
            sum = sum.add(d);
        }
        return sum.compareTo(BigDecimal.ONE) == 0;
    }
}
