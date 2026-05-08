package tech.suji.config;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.client.advisor.api.Advisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import tech.suji.advisor.JSONLogAdvisor;

@Configuration
public class ChatClientConfig {

//	@Bean
//	public ChatClient simpleChatClient_v1(ChatClient.Builder chatClientBuilder) {
//        return chatClientBuilder
//        		.defaultAdvisors(new SimpleLoggerAdvisor())
//        		.build();
//    }
//	
//	@Bean
//	public ChatClient basicChatClient_v1(ChatClient.Builder chatClientBuilder) {
//        return chatClientBuilder
//        		.defaultSystem("Must respond under 15 words")
//        		.defaultOptions(ChatOptions.builder().maxTokens(20).build())
//        		.build();
//    }
	
	@Bean
	public ChatClient openAiChatClient(OpenAiChatModel model) {
	    return ChatClient.builder(model).build();
	}

	@Bean
	public ChatClient ollamaChatClient(OllamaChatModel model) {
	    return ChatClient.builder(model).build();
	}
	
	@Bean("chatMemoryChatClient")
    public ChatClient chatClient(OpenAiChatModel model, ChatMemory chatMemory) {
        Advisor loggerAdvisor = new SimpleLoggerAdvisor();
        Advisor jsonLoggerAdvisor = new JSONLogAdvisor();
        Advisor memoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();
        
       return ChatClient.builder(model).defaultAdvisors(List.of(jsonLoggerAdvisor, memoryAdvisor)).build();
    }
	
}
