package com.jonjau.portvis.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PortfolioAllocationsValidator.class)
@Target(value = {ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PortfolioAllocationsSumConstraint {
    String message() default "Total portfolio allocation must exactly equal 100%.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
