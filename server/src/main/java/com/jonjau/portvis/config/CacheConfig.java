package com.jonjau.portvis.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig{
    // When you annotate your configuration class with @EnableCaching annotation, this triggers a
    // post processor that would scan every Spring bean for the presence of caching annotations on
    // public methods. If such an annotation is found, a proxy is automatically created to intercept
    // the method call and handle the caching behavior accordingly.
}
