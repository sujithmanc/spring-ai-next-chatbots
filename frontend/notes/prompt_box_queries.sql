SELECT node_id, parent_id, user_id, node_name, content, GROUP_CONCAT(tag_name SEPARATOR ', ') AS all_tags FROM xyzdb.documents_with_tags_view GROUP BY 
    node_id, parent_id, user_id, node_name, content;
    
SELECT tag_id, tag_name, count(*) as count  FROM xyzdb.documents_with_tags_view group by tag_id;

SELECT * FROM xyzdb.documents_with_tags_view where tag_id = 1;

SELECT * FROM xyzdb.documents_with_tags_view where tag_id = 1 and parent_id=2;

SELECT * FROM xyzdb.documents_with_tags_view where parent_id=4;

SELECT * FROM xyzdb.documents_with_tags_view where tag_id = 1;

SELECT * FROM xyzdb.documents_with_tags_view where tag_id in (1);

SELECT * FROM nodes where type="folder";
SELECT * FROM nodes where type="document";

SELECT * FROM nodes where parent_id=1;

    
SELECT 
    n.id, 
    n.name, 
    GROUP_CONCAT(dt.tag_id) as tags_found
FROM nodes n
INNER JOIN document_tags dt ON n.id = dt.node_id
WHERE dt.tag_id IN (1, 2)
GROUP BY n.id
HAVING COUNT(DISTINCT dt.tag_id) = 2;
    
    
    
    
    
    