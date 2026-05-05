# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source
COPY src ./src

# Build jar
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/ChatApplication-0.0.1-SNAPSHOT.jar

# Expose port (default Spring Boot)
EXPOSE 8080

# Run app
ENTRYPOINT ["java","-jar","/app/target/ChatApplication-0.0.1-SNAPSHOT.jar"]