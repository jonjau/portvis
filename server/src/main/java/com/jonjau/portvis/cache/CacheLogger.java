package com.jonjau.portvis.cache;


import org.ehcache.event.CacheEvent;
import org.ehcache.event.CacheEventListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CacheLogger implements CacheEventListener<Object, Object> {

    private final Logger log = LoggerFactory.getLogger(CacheLogger.class);

    @Override
    public void onEvent(CacheEvent<?, ?> cacheEvent) {
        log.info("Key {} | EventType: {}",
                cacheEvent.getKey(), cacheEvent.getType());
        // can log cacheEvent.getOldValue(), cacheEvent.getNewValue(), but maybe too cluttering
    }
}
