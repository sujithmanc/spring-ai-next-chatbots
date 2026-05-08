package tech.suji.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class ChatMemoryConfig {

	@Bean
	ChatMemory chatMemory(JdbcChatMemoryRepository jdbcChatMemoryRepository) {
		log.info("jdbcChatMemoryRepository : {}", jdbcChatMemoryRepository);
		return MessageWindowChatMemory.builder().maxMessages(10).chatMemoryRepository(jdbcChatMemoryRepository).build();
	}
}
