package tech.suji.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import tech.suji.model.ChatTokenUsageResponse;
import tech.suji.service.ChatMemoryService;

@Slf4j
@RestController
@RequestMapping("/api/chat-memory")
public class ChatMemoryController {

    @Autowired
    ChatMemoryService chatMemoryService;

    @GetMapping("/simple")
    public ResponseEntity<String> chatMemory(@RequestHeader("username") String username,
            @RequestParam("message") String message) {
    	
		String content = chatMemoryService.getChatMessage(username,message);
    	
    	log.info("User:{}  Message:{}", username, message);
        return ResponseEntity.ok(content);
    }
    
    @GetMapping("/token-usage")
    public ResponseEntity<ChatTokenUsageResponse> chatMemoryTokenUsage(@RequestHeader("username") String username,
            @RequestParam("message") String message) {
    	
    	ChatTokenUsageResponse content = chatMemoryService.getChatMessageWithTokenUsage(username, message);
    	
    	log.info("User:{}  Message:{}", username, message);
        return ResponseEntity.ok(content);
    }
}
