package com.jonjau.portvis.util;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.Module;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.modelmapper.config.Configuration;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.util.Collection;

/**
 * Component that wraps a ModelMapper, this is generated code.
 */
@Component
public class ModelMapperComponent {
    private final ModelMapper modelMapper = new ModelMapper();

    public <S, D> void addConverter(Converter<S, D> converter) {
        modelMapper.addConverter(converter);
    }

    public <S, D> void addConverter(Converter<S, D> converter, Class<S> sourceType,
                                    Class<D> destinationType) {
        modelMapper.addConverter(converter, sourceType, destinationType);
    }

    public <S, D> TypeMap<S, D> addMappings(PropertyMap<S, D> propertyMap) {
        return modelMapper.addMappings(propertyMap);
    }

    public <S, D> TypeMap<S, D> createTypeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.createTypeMap(sourceType, destinationType);
    }

    public <S, D> TypeMap<S, D> createTypeMap(Class<S> sourceType, Class<D> destinationType,
                                              Configuration configuration) {
        return modelMapper.createTypeMap(sourceType, destinationType, configuration);
    }

    public <S, D> TypeMap<S, D> createTypeMap(Class<S> sourceType, Class<D> destinationType,
                                              String typeMapName) {
        return modelMapper.createTypeMap(sourceType, destinationType, typeMapName);
    }

    public <S, D> TypeMap<S, D> createTypeMap(Class<S> sourceType, Class<D> destinationType,
                                              String typeMapName, Configuration configuration) {
        return modelMapper.createTypeMap(sourceType, destinationType, typeMapName, configuration);
    }

    public <S, D> TypeMap<S, D> createTypeMap(S source, Class<D> destinationType) {
        return modelMapper.createTypeMap(source, destinationType);
    }

    public <S, D> TypeMap<S, D> createTypeMap(S source, Class<D> destinationType,
                                              Configuration configuration) {
        return modelMapper.createTypeMap(source, destinationType, configuration);
    }

    public <S, D> TypeMap<S, D> createTypeMap(S source, Class<D> destinationType,
                                              String typeMapName) {
        return modelMapper.createTypeMap(source, destinationType, typeMapName);
    }

    public <S, D> TypeMap<S, D> createTypeMap(S source, Class<D> destinationType,
                                              String typeMapName, Configuration configuration) {
        return modelMapper.createTypeMap(source, destinationType, typeMapName, configuration);
    }

    public Configuration getConfiguration() {
        return modelMapper.getConfiguration();
    }

    public <S, D> TypeMap<S, D> getTypeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.getTypeMap(sourceType, destinationType);
    }

    public <S, D> TypeMap<S, D> getTypeMap(Class<S> sourceType, Class<D> destinationType,
                                           String typeMapName) {
        return modelMapper.getTypeMap(sourceType, destinationType, typeMapName);
    }

    public <S, D> TypeMap<S, D> typeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.typeMap(sourceType, destinationType);
    }

    public <S, D> TypeMap<S, D> typeMap(Class<S> sourceType, Class<D> destinationType,
                                        String typeMapName) {
        return modelMapper.typeMap(sourceType, destinationType, typeMapName);
    }

    public <S, D> TypeMap<S, D> emptyTypeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.emptyTypeMap(sourceType, destinationType);
    }

    public Collection<TypeMap<?, ?>> getTypeMaps() {
        return modelMapper.getTypeMaps();
    }

    public <D> D map(Object source, Class<D> destinationType) {
        return modelMapper.map(source, destinationType);
    }

    public <D> D map(Object source, Class<D> destinationType, String typeMapName) {
        return modelMapper.map(source, destinationType, typeMapName);
    }

    public void map(Object source, Object destination) {
        modelMapper.map(source, destination);
    }

    public void map(Object source, Object destination, String typeMapName) {
        modelMapper.map(source, destination, typeMapName);
    }

    public <D> D map(Object source, Type destinationType) {
        return modelMapper.map(source, destinationType);
    }

    public <D> D map(Object source, Type destinationType, String typeMapName) {
        return modelMapper.map(source, destinationType, typeMapName);
    }

    public void validate() {
        modelMapper.validate();
    }

    public ModelMapper registerModule(Module module) {
        return modelMapper.registerModule(module);
    }
}
