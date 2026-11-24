## QdrantVectorStoreAutoConfiguration required a single Model bean

Parameter 0 of method vectorStore in org.springframework.ai.vectorstore.qdrant.autoconfigure.QdrantVectorStoreAutoConfiguration required a single bean, but 2 were found:
	- ollamaEmbeddingModel: defined by method 'ollamaEmbeddingModel' in class path resource [org/springframework/ai/model/ollama/autoconfigure/OllamaEmbeddingAutoConfiguration.class]
	- openAiEmbeddingModel: defined by method 'openAiEmbeddingModel' in class path resource [org/springframework/ai/model/openai/autoconfigure/OpenAiEmbeddingAutoConfiguration.class]

This error occurs because both the OpenAI and Ollama Spring AI starters are on your classpath, so Spring Boot auto-configures two EmbeddingModel beans (openAiEmbeddingModel and ollamaEmbeddingModel). QdrantVectorStoreAutoConfiguration needs a single EmbeddingModel to generate vectors and doesn't know which one to inject.  
Resolve this using one of the following approaches depending on your goal:

### **Option 1: Disable one of the embedding auto-configurations (Recommended)**

If you only need one provider for embeddings (for example, using OpenAI for chat and Ollama for local embeddings, or vice versa), disable the unused embedding model in application.properties or application.yml.  
**To keep Ollama for embeddings (and disable OpenAI embeddings):**

Properties  
spring.ai.openai.embedding.enabled\=false

**To keep OpenAI for embeddings (and disable Ollama embeddings):**

Properties  
spring.ai.ollama.embedding.enabled\=false

*(Note: If you are using an older Spring AI 1.0 milestone where .enabled=false isn't supported on the embedding property, exclude the auto-configuration class instead:)*

Properties  
spring.autoconfigure.exclude\=org.springframework.ai.model.openai.autoconfigure.OpenAiEmbeddingAutoConfiguration

### **Option 2: Designate a @Primary bean**

If you actively use **both** EmbeddingModel beans elsewhere in your application, tell Spring which one Qdrant should use by default:

Java  
@Configuration  
public class EmbeddingConfig {

    @Bean  
    @Primary  
    public EmbeddingModel primaryEmbeddingModel(  
            @Qualifier("ollamaEmbeddingModel") EmbeddingModel ollamaEmbeddingModel) {  
        return ollamaEmbeddingModel;  
    }  
}

### **Option 3: Manually define the QdrantVectorStore bean**

If you want explicit control over the Qdrant setup, define your own QdrantVectorStore bean with @Qualifier (Spring Boot's auto-configuration will back off automatically):

Java  
@Configuration  
public class VectorStoreConfig {

    @Bean  
    public QdrantVectorStore vectorStore(  
            QdrantClient qdrantClient,  
            @Qualifier("openAiEmbeddingModel") EmbeddingModel embeddingModel) {  
        return QdrantVectorStore.builder(qdrantClient, embeddingModel)  
                .initializeSchema(true)  
                .build();  
    }  
}  
