package tech.suji.controller;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatController {

	private final ChatClient simpleChatClient;
	private final ChatClient basicChatClient;

	public ChatController(ChatClient simpleChatClient, ChatClient basicChatClient) {
		this.simpleChatClient = simpleChatClient;
		this.basicChatClient = basicChatClient;
	}
	
	@PostMapping("/multimodels")
	public String chat(@RequestBody PromptReq req) {
		if(req.getModel().equalsIgnoreCase("ChatGPT") ) {
			return simpleChatClient.prompt(req.getPrompt()).call().content();
		}else {
			return basicChatClient.prompt(req.getPrompt()).call().content();
		}
	}
	
	@GetMapping("/chat")
	public String chat(@RequestParam("msg") String message) {
		String filter = "Act as if you don't know anything";
		CallResponseSpec spec = basicChatClient.prompt(message)
				.system(prompt -> prompt.text("Say Hi to the client {name}").param("name", message))
				// .user(promptUserSpec -> promptUserSpec.text("Helo {name}, How are you man!"
				// ).param("name", message))
				.options(ChatOptions.builder().temperature(1.0).build()).call();
		String content = spec.content();

		return content;
	}
	// http://localhost:8080/api/chat?message=Hello
	
	
	@GetMapping("/simple-chat")
    public ResponseEntity<String> chatMemory(@RequestHeader("username") String username,
            @RequestParam("message") String message) {
		
		String systemMessage = """
				You should act like a human. You're name Sujith, age 27. You like Java and NextJs.
				You stay in India/Telangana/Hyderabad.
				Respond at most 100 words.
				""";
		
		
        return ResponseEntity.ok(basicChatClient.prompt().system(systemMessage).user(message).advisors(
                    advisorSpec -> advisorSpec.param(CONVERSATION_ID, username)
                )
                .call().content());
    }
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
