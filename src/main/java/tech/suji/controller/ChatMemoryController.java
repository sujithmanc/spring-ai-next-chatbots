package tech.suji.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import org.jspecify.annotations.Nullable;

@Slf4j
@RestController
@RequestMapping("/api/chat-memory")
public class ChatMemoryController {

    private final ChatClient chatClient;

    public ChatMemoryController(@Qualifier("chatMemoryChatClient") ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping
    public ResponseEntity<String> chatMemory(@RequestHeader("username") String username,
            @RequestParam("message") String message) {
    	
		String content = chatClient.prompt()
				.user(message)
				.advisors(advSpec -> advSpec.param(ChatMemory.CONVERSATION_ID, username))
				.call()
				.content();
    	
    	log.info("User:{}  Message:{}", username, message);
        return ResponseEntity.ok(content);
    }
}
