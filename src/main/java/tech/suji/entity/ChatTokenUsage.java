package tech.suji.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "CHAT_TOKEN_USAGE")
public class ChatTokenUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "CONVERSATION_ID", nullable = false)
    private String conversationId;

    @Column(name = "PROMPT_TOKENS", nullable = false)
    private int promptTokens;

    @Column(name = "REASONING_TOKENS", nullable = false)
    private int reasoningTokens;

    @Column(name = "OTHER_COMPLETION_TOKENS", nullable = false)
    private int otherCompletionTokens;

    @Column(name = "TOTAL_TOKENS", nullable = false)
    private int totalTokens;

    @Column(name = "CREATED_AT", nullable = false)
    private Instant createdAt;

    // Getters, setters, constructors omitted for brevity
}