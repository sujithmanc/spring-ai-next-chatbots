package tech.suji.controller;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import tech.suji.advisor.JSONLogAdvisor;

@Slf4j
@RestController
@RequestMapping("/api")
public class ChatController {

	private final ChatClient ollamaChatClient;
	private final ChatClient openAiChatClient;

	public ChatController(ChatClient openAiChatClient, ChatClient ollamaChatClient) {
		this.ollamaChatClient = ollamaChatClient;
		this.openAiChatClient = openAiChatClient;
	}

	@PostMapping("/multimodels")
	public String chat(@RequestBody PromptReq req) {
		if (req.getModel().equalsIgnoreCase("ChatGPT")) {
			return openAiChatClient.prompt(req.getPrompt()).call().content();
		} else {
			return ollamaChatClient.prompt(req.getPrompt()).call().content();
		}
	}

	@GetMapping("/chat")
	public String chat(@RequestParam("msg") String message) {
		String filter = "Act as if you don't know anything";
		CallResponseSpec spec = ollamaChatClient.prompt(message)
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
				Respond at most 20 words.
				""";

		SimpleLoggerAdvisor simpleLoggerAdvisor = new SimpleLoggerAdvisor();

		SimpleLoggerAdvisor customLogger = new SimpleLoggerAdvisor(
				request -> "Custom request: " + request.prompt().getUserMessage(),
				response -> "Custom response: " + response.getResult(), 0);

		return ResponseEntity.ok(ollamaChatClient.prompt().system(systemMessage).user(message)
				.advisors(simpleLoggerAdvisor).call().content());
	}

	@GetMapping("/v2/simple-chat")
	public ResponseEntity<String> simpleChatV2(@RequestHeader("username") String username,
			@RequestParam("message") String message) {
		
		log.info("Inside:simpleChatV2");

		String systemMessage = """
				You should act like a human. You're name Sujith, age 27. You like Java and NextJs.
				You stay in India/Telangana/Hyderabad.
				""";
		
		String systemMessage2 = """
				Blessy is a cute lady, loves reading Bible, marriage meterial. Execellet voice, Super cute. Age 27.
				Telanga/Karim nagar
				""";

		JSONLogAdvisor jsonLogAdvisor = new JSONLogAdvisor();
		// temperature max tokens model topP frequency penalty presence penalty
		 
		return ResponseEntity.ok(
				openAiChatClient.prompt()
				.system(systemMessage)
//				.options(ChatOptions
//						.builder()
//						.temperature(0.8)
//						.build()
//						)
				.user(message)
				.advisors(jsonLogAdvisor)
				.call()
				.content()
				);
	}

}
