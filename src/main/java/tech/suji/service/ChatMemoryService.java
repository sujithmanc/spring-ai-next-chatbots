package tech.suji.service;

import java.time.Instant;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.metadata.Usage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import lombok.Data;
import tech.suji.entity.ChatTokenUsage;
import tech.suji.model.ChatTokenUsageResponse;
import tech.suji.repository.ChatTokenUsageRepository;

@Data
@Service
public class ChatMemoryService {
	
	private final ChatClient chatClient;
	private final ChatTokenUsageRepository chatTokenUsageRepository;

    public ChatMemoryService(@Qualifier("chatMemoryChatClient") ChatClient chatClient,
    		@Qualifier("chatTokenUsageRepository") ChatTokenUsageRepository  chatTokenUsageRepository) {
        this.chatClient = chatClient;
        this.chatTokenUsageRepository = chatTokenUsageRepository;
    }
	
    
    public ChatTokenUsageResponse getChatMessageWithTokenUsage(String username, String message) {
		ChatResponse response = chatClient.prompt()
	            .user(message)
	            .advisors(advSpec -> advSpec.param(ChatMemory.CONVERSATION_ID, username))
	            .system("Keep answers under 100 words. Do not repeat the question. Avoid unnecessary introductions and conclusions.")	
	            .call()
	            .chatResponse();

	    Usage usage = (response != null && response.getMetadata() != null)
	            ? response.getMetadata().getUsage()
	            : null;
	    
	    ChatTokenUsageResponse res = new ChatTokenUsageResponse();

	    if (usage != null) {
	        int promptTokens = usage.getPromptTokens();
	        int totalCompletionTokens = usage.getCompletionTokens();
	        int totalTokens = usage.getTotalTokens();
	     
	        int otherCompletionTokens = Math.max(0, totalCompletionTokens);

	        ChatTokenUsage record = new ChatTokenUsage();
	        record.setConversationId(username);
	        record.setPromptTokens(promptTokens);
	        record.setOtherCompletionTokens(otherCompletionTokens);
	        record.setTotalTokens(totalTokens);
	        record.setCreatedAt(Instant.now());

	        chatTokenUsageRepository.save(record);
	        
	        String content = (response != null && response.getResult() != null)
	                ? response.getResult().getOutput().getText()
	                : "";
	        
	        res.setMessage(content);
	        res.setTotalTokens(totalTokens);
	        res.setPromptTokens(promptTokens);
	        res.setCompletionTokens(otherCompletionTokens);
	        return res;	    
	        }
	    return res;
	}
    
	public String getChatMessage(String username, String message) {
		ChatResponse response = chatClient.prompt()
	            .user(message)
	            .advisors(advSpec -> advSpec.param(ChatMemory.CONVERSATION_ID, username))
	            .call()
	            .chatResponse();

	    Usage usage = (response != null && response.getMetadata() != null)
	            ? response.getMetadata().getUsage()
	            : null;

	    if (usage != null) {
	        int promptTokens = usage.getPromptTokens();
	        int totalCompletionTokens = usage.getCompletionTokens();
	        int totalTokens = usage.getTotalTokens();
	     
	        int otherCompletionTokens = Math.max(0, totalCompletionTokens);

	        ChatTokenUsage record = new ChatTokenUsage();
	        record.setConversationId(username);
	        record.setPromptTokens(promptTokens);
	        record.setOtherCompletionTokens(otherCompletionTokens);
	        record.setTotalTokens(totalTokens);
	        record.setCreatedAt(Instant.now());

	        chatTokenUsageRepository.save(record);
	        
	        String content = (response != null && response.getResult() != null)
	                ? response.getResult().getOutput().getText()
	                : "";
	        
	        return content;
	    }
	    return "error";
	}
	
}
