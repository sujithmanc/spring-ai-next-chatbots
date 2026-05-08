package tech.suji.advisor;

import org.springframework.ai.chat.client.ChatClientRequest;
import org.springframework.ai.chat.client.ChatClientResponse;
import org.springframework.ai.chat.client.advisor.api.CallAdvisor;
import org.springframework.ai.chat.client.advisor.api.CallAdvisorChain;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.model.ModelOptionsUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JSONLogAdvisor implements CallAdvisor {

	@Override
	public String getName() {
		return "JSONLogAdvisor";
	}

	@Override
	public int getOrder() {
		return 0;
	}

	@Override
	public ChatClientResponse adviseCall(ChatClientRequest chatClientRequest, CallAdvisorChain callAdvisorChain) {
		
		ChatClientResponse chatClientResponse = callAdvisorChain.nextCall(chatClientRequest);
		ChatResponse chatResponse = chatClientResponse.chatResponse();

		String req = ModelOptionsUtils.toJsonStringPrettyPrinter(chatClientRequest);
		log.info(req);

		String res = ModelOptionsUtils.toJsonStringPrettyPrinter(chatResponse);
		log.info(res);

		return chatClientResponse;
	}

}
