package tech.suji.model;

import lombok.Data;

@Data
public class ChatTokenUsageResponse {
	private String message;
	private int promptTokens;
	private int totalTokens;
	private int completionTokens;
}
