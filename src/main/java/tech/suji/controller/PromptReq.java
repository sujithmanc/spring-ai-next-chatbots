package tech.suji.controller;

import lombok.Data;

@Data
public class PromptReq {
 	private String prompt;
 	private String model;
 	private String systemPrompt;
}
