
# Build stage
FROM maven:3.6.3-openjdk-8-slim AS build
RUN mkdir -p /server
WORKDIR /server
COPY pom.xml /server
COPY src /server/src
RUN mvn -f pom.xml clean package

# Production stage
FROM openjdk:8-alpine
COPY --from=build /server/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
