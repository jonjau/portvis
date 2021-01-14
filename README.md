# Portvis

A web app to visualise and compare historical returns of US stock portfolios,
built with Spring Boot and React.

## Functionalities

* Creating, displaying, updating, deleting portfolios of US stocks
* Visualising and comparing historical returns of portfolios over an arbitrary
  number of days
* Searching US stock symbols and displaying company summaries
* JWT-based user login and registration (using *insecure* cookies)

### Missing features

Backend:

* Enabling TLS (HTTPS)
* Unit and integration tests with mocking

Frontend:

* Better UI, using actual CSS (!!)
* Mobile-friendly layout
* Keyboard shortcuts
* Cleaner state management with React Context and/or Redux

## Key dependencies

Database: MySQL

Backend (`/server/`):

* Java 8
* Maven
* Spring Boot
  * Web Starter
    * Tomcat: embedded server
    * Jackson: JSON parsing
  * Data JPA Starter
    * Hibernate: ORM
* Spring Security: request filters and user authentication middleware
* Ehcache: in-memory caching of results from API calls
* Lombok: boilerplate-reducing annotations
* ModelMapper: conversion between models/DTOs/entities
* JJWT: manipulation of JSON web tokens

Frontend (`/client/`):

* TypeScript
* React
* Bootstrap: CSS framework
* React Router: page navigation
* Formik (with Yup): input validation
* Axios: promise-based HTTP client
* Chart.js (with Moment): data visualisation library
* Lodash: convenience functions
