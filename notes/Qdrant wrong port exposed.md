[32m21:31.513[0;39m [36mConfigServletWebServerApplicationContext[0;39m [2m:[0;39m Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'vectorStore' defined in class path resource [org/springframework/ai/vectorstore/qdrant/autoconfigure/QdrantVectorStoreAutoConfiguration.class]: java.util.concurrent.ExecutionException: io.grpc.StatusRuntimeException: UNIMPLEMENTED: HTTP status code 404
invalid content-type: null
trailers: Metadata(:status=404,vary=Origin, Access-Control-Request-Method, Access-Control-Request-Headers,date=Tue, 24 Nov 2026 03:51:31 GMT,content-length=0)

The error means Spring AI's `QdrantVectorStore` tried to connect to Qdrant over **gRPC**, but the server at the configured host/port returned a plain HTTP **404 Not Found** (`invalid content-type: null`) instead of a gRPC response.

This happens for one of three reasons:

### 1. Wrong Port Configured (HTTP Port `6333` instead of gRPC Port `6334`)

Qdrant exposes two separate ports:

* **`6333`** — REST / HTTP API (and Web UI)
* **`6334`** — **gRPC API** (required by Spring AI's `QdrantVectorStore`)

If `spring.ai.vectorstore.qdrant.port` is set to `6333`, the gRPC client sends gRPC traffic to Qdrant's REST server, which responds with `HTTP 404` and no gRPC content-type header.

**Fix:** Update your `application.properties` (or `application.yml`) to use port **`6334`**:

```properties
spring.ai.vectorstore.qdrant.host=localhost
spring.ai.vectorstore.qdrant.port=6334

```

### 2. Qdrant Docker Container Only Exposed Port `6333`

If you started Qdrant via Docker and only mapped `-p 6333:6333`, port `6334` isn't reachable from your host machine.

**Fix:** Expose both ports when running Qdrant:

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

```

### 3. Another Local Service Is Occupying Port `6334` (or `6333`)

Notice the response header in your stack trace:

```text
trailers: Metadata(:status=404,vary=Origin, Access-Control-Request-Method, Access-Control-Request-Headers,...)

```

Those CORS `vary` headers (`Origin, Access-Control-Request-Method, Access-Control-Request-Headers`) are typical of a standard Spring Boot / Tomcat web server or reverse proxy rather than Qdrant. If another Spring Boot app or web service is running on the configured port—or Qdrant isn't running at all—your app hits that HTTP server and receives a 404.

**Fix:**

1. Confirm Qdrant is running (`docker ps` or check `http://localhost:6333/dashboard` in your browser).
2. Ensure no other service is bound to port `6334`.
3. Restart your Spring Boot application and check that `QdrantVectorStore` initializes without the `BeanCreationException`.















