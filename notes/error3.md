org.springframework.beans.factory.UnsatisfiedDependencyException:

Error creating bean with name 'RAGController' defined in file RAGController.class: Unsatisfied dependency expressed through constructor parameter 1: No qualifying bean of type 'org.springframework.ai.chat.client.ChatClient' available: expected at least 1 bean which qualifies as autowire candidate.

Dependency annotations: {@org.springframework.beans.factory.annotation.Qualifier("webSearchRAGChatClient")}
	at org.springframework.beans.factory.support.ConstructorResolver.createArgumentArray(ConstructorResolver.java:804) ~[spring-beans-7.0.5.jar:7.0.5]
