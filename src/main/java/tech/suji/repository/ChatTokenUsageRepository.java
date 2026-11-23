package tech.suji.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tech.suji.entity.ChatTokenUsage;

public interface ChatTokenUsageRepository extends JpaRepository<ChatTokenUsage, Long> {
}