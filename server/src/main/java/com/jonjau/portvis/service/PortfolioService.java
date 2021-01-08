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

/**
 * Service responsible for creating, reading, updating, deleting portfolios from the portfolio
 * repository.
 */
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

    /**
     * Get a list of the portfolios having the given IDs. This method returns an empty list if
     * none of the given IDs correspond to portfolios.
     */
    public List<PortfolioDto> getPortfolios(List<Long> portfolioIds) {
        return portfolioIds.stream()
                .map(portfolioRepository::findById)
                .filter(Optional::isPresent).map(Optional::get)
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a list of the portfolios associated with the user having the given username.
     */
    public List<PortfolioDto> getAllPortfoliosOfUser(String username) {
        User user = userRepository.findByUsername(username);
        return portfolioRepository.findAllByUser(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a portfolio with the given ID associated with the user having the given username.
     * If there does not exist a portfolio with that ID, or if the portfolio with that ID is
     * no associated with the given user (username), then a PortfolioNotFound Exception is thrown.
     */
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

    /**
     * Create a portfolio, saving it to the repository.
     *
     * @param portfolioDto portfolio details
     * @param username the user associated with this portfolio
     * @return the created portfolio
     */
    public PortfolioDto createPortfolio(PortfolioDto portfolioDto, String username) {
        Portfolio portfolio = toEntity(username, portfolioDto);
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return toDto(savedPortfolio);
    }

    /**
     * Updates a portfolio, overriding it in the repository.
     *
     * @param portfolioId the portfolio to be updated
     * @param portfolioDetails the updated portfolio details
     * @param username the user associated with the portfolio
     * @return the updated portfolio
     * @throws PortfolioNotFoundException if the portfolio does not exist, or the portfolio is not
     *                                    associated with the given user (username).
     */
    public PortfolioDto updatePortfolio(
            long portfolioId,
            PortfolioDto portfolioDetails,
            String username
    ) throws PortfolioNotFoundException {
        PortfolioDto portfolioDto = getPortfolioOfUser(username, portfolioId);
        Portfolio portfolio = toEntity(username, portfolioDto);

        // copy values
        portfolio.setName(portfolioDetails.getName());
        portfolio.setInitialValue(portfolioDetails.getInitialValue());
        portfolio.setAllocations(portfolioDetails.getAllocations());

        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return toDto(updatedPortfolio);
    }

    /**
     * Deletes a single portfolio of a user.
     *
     * @param username the user associated with the portfolio to be deleted
     * @param portfolioId the ID of the portfolio to be deleted
     * @throws PortfolioNotFoundException if the given ID does not correspond to a portfolio
     *                                    associated with the given user (username)>
     */
    public void deletePortfolio(
            String username,
            long portfolioId
    ) throws PortfolioNotFoundException {
        PortfolioDto portfolioDto = getPortfolioOfUser(username, portfolioId);
        portfolioRepository.delete(toEntity(username, portfolioDto));
    }

    /**
     * Deletes all the portfolios of a user.
     * @param username the user (username) for which all the portfolios are to be deleted.
     */
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
