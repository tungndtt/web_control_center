# Build JAR file from maven project
FROM maven:3.6.0-jdk-11-slim AS build 

WORKDIR /wcc-backend

COPY src ./src
COPY libs ./libs
COPY pom.xml ./

ENTRYPOINT ["mvn", "-f", "pom.xml", "spring-boot:run"]
