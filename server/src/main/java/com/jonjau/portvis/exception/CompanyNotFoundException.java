package com.jonjau.portvis.exception;

public class CompanyNotFoundException extends Exception {

    public CompanyNotFoundException(String companyName) {
        super("Company with name '" + companyName + "' not found.");
    }
}
