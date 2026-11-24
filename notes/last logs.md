1. **Hibernate JTA check (`HHH000489`):** Hibernate skipped distributed transaction setup and used standard local database transactions.
2. **Table creation (`create table chat_token_usage`):** Hibernate automatically created the `chat_token_usage` table in your H2 database.
3. **JPA initialized (`LocalContainerEntityManagerFactoryBean`):** Spring finished loading your JPA entities and database mappings.
4. **Chat memory wired (`ChatMemoryConfig`):** Your configuration class created the `JdbcChatMemoryRepository` bean to store chat history.
5. **Query parser detected (`QueryEnhancerFactories`):** Spring Data JPA found Hibernate on the classpath and enabled HQL query parsing.
6. **Open-in-View notice (`JpaWebConfiguration`):** Spring warned that database connections stay open during web rendering by default.
7. **Qdrant version warning (`QdrantGrpcClient`):** Qdrant connected on gRPC, but warned that client `1.13.0` is older than server `1.20.2`.
8. **H2 console ready (`H2ConsoleAutoConfiguration`):** The H2 database UI started at `http://localhost:8080/h2-console` using `jdbc:h2:mem:testdb`.
9. **Tomcat server started (`TomcatWebServer`):** The web server started and began listening on `http://localhost:8080`.
10. **App running (`ChatBotOpenAiApplication`):** Your Spring Boot application finished starting in 11.391 seconds.