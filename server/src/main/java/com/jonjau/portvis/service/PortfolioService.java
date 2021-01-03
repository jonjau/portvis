package com.jonjau.portvis.service;

import com.jonjau.portvis.dto.PortfolioDto;
import com.jonjau.portvis.exception.PortfolioNotFoundException;
import com.jonjau.portvis.repository.PortfolioRepository;
import com.jonjau.portvis.repository.UserRepository;
import com.jonjau.portvis.repository.entity.Portfolio;
import com.jonjau.portvis.repository.entity.User;
import com.jonjau.portvis.util.ModelMapperComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PortfolioService {
    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final ModelMapperComponent modelMapper;

    @Autowired
    public PortfolioService(
            PortfolioRepository portfolioRepo,
            UserRepository userRepo,
            ModelMapperComponent modelMapper
    ) {
        this.portfolioRepository = portfolioRepo;
        this.userRepository = userRepo;
        this.modelMapper = modelMapper;
    }

    public List<PortfolioDto> getPortfolios(List<Long> portfolioIds) {
        return portfolioIds.stream()
                .map(portfolioRepository::findById)
                .filter(Optional::isPresent).map(Optional::get)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PortfolioDto> getAllPortfoliosOfUser(String username) {
        User user = userRepository.findByUsername(username);
        return portfolioRepository.findAllByUser(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public PortfolioDto getPortfolioOfUser(
            String username,
            long portfolioId
    ) throws PortfolioNotFoundException {
        return getAllPortfoliosOfUser(username)
                .stream()
                .filter(p -> p.getId() == portfolioId)
                .findFirst()
                .orElseThrow(() -> new PortfolioNotFoundException(username, portfolioId));
    }

    public PortfolioDto createPortfolio(PortfolioDto portfolioDto, String username) {
        Portfolio portfolio = toEntity(username, portfolioDto);
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return toDto(savedPortfolio);
    }

    public PortfolioDto updatePortfolio(
            long portfolioId,
            PortfolioDto portfolioDetails,
            String username
    ) throws PortfolioNotFoundException {
        PortfolioDto portfolioDto = getPortfolioOfUser(username, portfolioId);
        Portfolio portfolio = toEntity(username, portfolioDto);

        portfolio.setName(portfolioDetails.getName());
        portfolio.setInitialValue(portfolioDetails.getInitialValue());
        portfolio.setAllocations(portfolioDetails.getAllocations());

        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return toDto(updatedPortfolio);
    }

    public void deletePortfolio(
            String username,
            long portfolioId
    ) throws PortfolioNotFoundException {
        PortfolioDto portfolioDto = getPortfolioOfUser(username, portfolioId);
        portfolioRepository.delete(toEntity(username, portfolioDto));
    }

    public void deleteAllPortfolios(String username) {
        List<PortfolioDto> portfolioDtos = getAllPortfoliosOfUser(username);
        List<Portfolio> portfolios = portfolioDtos
                .stream()
                .map(p -> toEntity(username, p))
                .collect(Collectors.toList());
        portfolioRepository.deleteAll(portfolios);
    }

    private Portfolio toEntity(String username, PortfolioDto portfolioDto) {
        User user = userRepository.findByUsername(username);
        Portfolio portfolio = modelMapper.map(portfolioDto, Portfolio.class);
        portfolio.setUser(user);
        return portfolio;
    }

    private PortfolioDto toDto(Portfolio portfolio) {
        return modelMapper.map(portfolio, PortfolioDto.class);
    }
}
