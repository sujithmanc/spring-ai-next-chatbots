package tech.suji.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
	public ChatClient simpleChatClient(OpenAiChatModel model) {
	    return ChatClient.builder(model).build();
	}

	@Bean
	public ChatClient basicChatClient(OllamaChatModel model) {
	    return ChatClient.builder(model).build();
	}
	
}
