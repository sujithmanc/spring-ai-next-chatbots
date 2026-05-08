CREATE TABLE `employees` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`age` int,
	`dOB` date,
	`desc` text,
	`gender` varchar(255),
	`skills` varchar(255),
	`city` varchar(255),
	`active` boolean DEFAULT false,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`price` int,
	`category` varchar(255),
	`description` text,
	`launchDate` date,
	`tags` json,
	`inStock` boolean DEFAULT false,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `qa_notes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`que` text NOT NULL,
	`ans` text NOT NULL,
	`date` varchar(10) NOT NULL,
	`topic` varchar(16) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `qa_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subtopics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(32) NOT NULL,
	`topic_id` bigint unsigned NOT NULL,
	CONSTRAINT `subtopics_id` PRIMARY KEY(`id`),
	CONSTRAINT `subtopics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(16),
	CONSTRAINT `topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `topics_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`username` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`dob` date,
	`gender` enum('Male','Female','Other'),
	`role` enum('guest','user','admin') DEFAULT 'guest',
	`skills` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `document_contents` (
	`node_id` bigint NOT NULL,
	`content` text NOT NULL,
	`word_count` int DEFAULT 0,
	`status` enum('draft','published','archived') DEFAULT 'draft',
	CONSTRAINT `document_contents_node_id` PRIMARY KEY(`node_id`)
);
--> statement-breakpoint
CREATE TABLE `document_tags` (
	`node_id` bigint NOT NULL,
	`tag_id` bigint NOT NULL,
	CONSTRAINT `document_tags_node_id_tag_id_pk` PRIMARY KEY(`node_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`parent_id` bigint,
	`user_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('folder','document') NOT NULL,
	`deleted_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_name_in_folder` UNIQUE(`parent_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `prompt_users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prompt_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompt_users_username_unique` UNIQUE(`username`),
	CONSTRAINT `prompt_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `subtopics` ADD CONSTRAINT `subtopics_topic_id_topics_id_fk` FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_contents` ADD CONSTRAINT `document_contents_node_id_nodes_id_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_tags` ADD CONSTRAINT `document_tags_node_id_nodes_id_fk` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `document_tags` ADD CONSTRAINT `document_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_parent_id_nodes_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `nodes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_user_id_prompt_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `prompt_users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_user_nodes` ON `nodes` (`user_id`,`deleted_at`);--> statement-breakpoint
CREATE ALGORITHM = undefined
SQL SECURITY definer
VIEW `documents_with_tags_view` AS (select `nodes`.`id`, `nodes`.`parent_id`, `nodes`.`user_id`, `nodes`.`name`, `nodes`.`type`, `nodes`.`deleted_at`, `nodes`.`created_at`, `nodes`.`updated_at`, `document_tags`.`node_id`, `document_tags`.`tag_id`, `tags`.`id`, `tags`.`name`, `tags`.`created_at` from `nodes` inner join `document_tags` on `nodes`.`id` = `document_tags`.`node_id` inner join `tags` on `document_tags`.`tag_id` = `tags`.`id`);