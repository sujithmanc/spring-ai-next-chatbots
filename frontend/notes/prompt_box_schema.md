-- 1. Create the Users Table
CREATE TABLE prompt_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create the Nodes Table (The Hierarchy)
CREATE TABLE nodes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('folder', 'document') NOT NULL, 
    
    -- Soft delete implementation
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Relationships
    CONSTRAINT fk_node_parent 
        FOREIGN KEY (parent_id) 
        REFERENCES nodes(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_node_user 
        FOREIGN KEY (user_id) 
        REFERENCES prompt_users(id) 
        ON DELETE CASCADE,

    -- Indexes for performance and data integrity
    UNIQUE KEY uk_name_in_folder (parent_id, name),
    INDEX idx_user_nodes (user_id, deleted_at) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create the Document Contents Table (The Storage)
CREATE TABLE document_contents (
    node_id BIGINT UNSIGNED PRIMARY KEY,
    content LONGTEXT NOT NULL,
    word_count INT UNSIGNED DEFAULT 0,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    
    -- Relationships
    CONSTRAINT fk_content_node 
        FOREIGN KEY (node_id) 
        REFERENCES nodes(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Create the Tags Table (Stores unique tags globally)
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'tutorial', 'draft', 'mysql'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create the Document Tags Junction Table (Connects tags to documents)
CREATE TABLE document_tags (
    node_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    
    -- A document cannot have the exact same tag applied twice
    PRIMARY KEY (node_id, tag_id),
    
    -- Relationships
    CONSTRAINT fk_doctag_node 
        FOREIGN KEY (node_id) 
        REFERENCES nodes(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_doctag_tag 
        FOREIGN KEY (tag_id) 
        REFERENCES tags(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;