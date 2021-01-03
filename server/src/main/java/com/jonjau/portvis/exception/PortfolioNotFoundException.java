package com.jonjau.portvis.exception;

public class PortfolioNotFoundException extends Exception {

    public PortfolioNotFoundException(String username, long portfolioId) {
        super("Portfolio with ID " + portfolioId + " of user '" + username + "' not found.");
    }
}
