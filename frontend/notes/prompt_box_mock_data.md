-- Create the User
INSERT INTO users (id, username, email) VALUES 
(1, 'alex_dev', 'alex@example.com');

-- Create 6 Tags
INSERT INTO tags (id, name) VALUES 
(1, 'Work'),
(2, 'Personal'),
(3, 'Ideas'),
(4, 'Database'),
(5, 'Project X'),
(6, 'Urgent');

INSERT INTO nodes (id, parent_id, user_id, name, type) VALUES 
(1, NULL, 1, 'ROOT', 'folder'),
(2, 1, 1, 'Work', 'folder'),
(3, 1, 1, 'Personal', 'folder'),
(4, 2, 1, 'Current Projects', 'folder'), -- Subfolder of Work (parent_id = 2)
(5, 1, 1, 'Archive', 'folder');

INSERT INTO nodes (id, parent_id, user_id, name, type) VALUES 
-- Inside ROOT (parent_id = 1)
(6, 1, 1, 'Daily Scratchpad', 'document'),

-- Inside Work (parent_id = 2)
(7, 2, 1, 'Weekly Team Sync', 'document'),
(8, 2, 1, 'Q3 OKRs', 'document'),

-- Inside Personal (parent_id = 3)
(9, 3, 1, 'Grocery List', 'document'),
(10, 3, 1, 'Workout Routine', 'document'),
(11, 3, 1, 'Travel Ideas 2025', 'document'),

-- Inside Current Projects (parent_id = 4)
(12, 4, 1, 'MySQL Schema V1', 'document'),
(13, 4, 1, 'API Requirements', 'document'),
(14, 4, 1, 'UI Mockup Feedback', 'document'),
(15, 4, 1, 'Launch Checklist', 'document'),

-- Inside Archive (parent_id = 5)
(16, 5, 1, 'Old 2023 Goals', 'document');



INSERT INTO document_contents (node_id, content, word_count, status) VALUES 
(6, '<h1>Scratchpad</h1><p>Just a place for random thoughts.</p>', 10, 'draft'),
(7, '<h1>Team Sync</h1><ul><li>Discussed schema design.</li><li>Reviewed API endpoints.</li></ul>', 15, 'published'),
(8, '<h1>Q3 OKRs</h1><p>1. Launch the new folder feature.</p>', 11, 'published'),
(9, '<ul><li>Milk</li><li>Eggs</li><li>Coffee beans</li></ul>', 6, 'draft'),
(10, '<h1>Push Day</h1><p>Bench press, overhead press, tricep extensions.</p>', 9, 'published'),
(11, '<p>Maybe Japan or Italy next year?</p>', 7, 'draft'),
(12, '<h1>Schema Design</h1><p>Using Adjacency List for folder structure.</p>', 9, 'published'),
(13, '<h2>Endpoints</h2><p>GET /api/nodes/:id</p><p>POST /api/nodes</p>', 6, 'draft'),
(14, '<p>The Bootstrap cards look good, but we need better icons.</p>', 11, 'draft'),
(15, '<p>1. Run migrations. 2. Start servers. 3. Monitor logs.</p>', 10, 'draft'),
(16, '<p>This is all outdated. Do not use.</p>', 8, 'archived');




INSERT INTO document_tags (node_id, tag_id) VALUES 
-- Daily Scratchpad (id: 6) -> tagged 'Ideas'
(6, 3), 

-- Weekly Team Sync (id: 7) -> tagged 'Work'
(7, 1), 

-- Q3 OKRs (id: 8) -> tagged 'Work', 'Urgent'
(8, 1), 
(8, 6), 

-- Grocery List, Workout, Travel (ids: 9, 10, 11) -> tagged 'Personal'
(9, 2), 
(10, 2), 
(11, 2),
(11, 3), -- Travel also tagged 'Ideas'

-- MySQL Schema V1 (id: 12) -> tagged 'Work', 'Database', 'Project X'
(12, 1), 
(12, 4), 
(12, 5), 

-- API Requirements & Launch Checklist (ids: 13, 15) -> tagged 'Work', 'Project X'
(13, 1), 
(13, 5), 
(15, 1), 
(15, 5), 
(15, 6); -- Checklist also tagged 'Urgent'