package tech.suji.controller;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rag")
public class RAGController {

	private final ChatClient chatClient;
	private final VectorStore vectorStore;

	@Value("classpath:/promptTemplates/ragUnknownDataTemplate.st")
	Resource ragUnknownDataTemplate;

	public RAGController(@Qualifier("chatMemoryChatClient") ChatClient chatClient, VectorStore vectorStore) {
		this.chatClient = chatClient;
		this.vectorStore = vectorStore;
	}

	@GetMapping("/random/chat")
	public ResponseEntity<String> randomChat(@RequestHeader("username") String username,
			@RequestParam("message") String message) {
	
		
        SearchRequest searchRequest =
                SearchRequest.builder().query(message).topK(3).similarityThreshold(0.5).build();
        
  
        List<Document> similarDocs =  vectorStore.similaritySearch(searchRequest);
        String similarContext = similarDocs.stream()
                .map(Document::getText)
                .collect(Collectors.joining(System.lineSeparator()));
        
		String answer = chatClient.prompt()
				.system(promptSystemSpec -> promptSystemSpec.text(ragUnknownDataTemplate)
				.param("documents", similarContext))
				.advisors(a -> a.param(CONVERSATION_ID, username))
				.user(message)
				.call()
				.content();
		return ResponseEntity.ok(answer);
	}

}
