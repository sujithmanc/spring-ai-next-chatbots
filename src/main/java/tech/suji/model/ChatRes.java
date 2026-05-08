package tech.suji.model;

import java.util.List;

import org.springframework.ai.chat.prompt.ChatOptions.Builder;

public class ChatRes {
		String model;
		Double frequencyPenalty;
		Integer maxTokens;
		Double presencePenalty;
		List<String> stopSequences;
		Double temperature;
		Builder topK;
		Builder topP;
}
