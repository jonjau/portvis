package com.jonjau.portvis.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class UsernameAdderInterceptorConfig implements WebMvcConfigurer {

    @Autowired
    private UsernameAdderInterceptor userIdInterceptor;

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userIdInterceptor);
    }
}
