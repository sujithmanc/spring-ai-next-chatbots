import { documentContents, documentsWithTagsView, nodes } from "@/drizzle/schema";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import db from "@/drizzle";



export default async function PromptBoxPage() {
    // You're code here
    const data = await db.select().from(documentContents);
    const documents = await db.select().from(documentsWithTagsView);

    const documentsWithGroupedTags = await db.select({
        nodeId: documentsWithTagsView.noteId, // Or whichever alias you settled on for node.id
        parentId: documentsWithTagsView.parentId,
        userId: documentsWithTagsView.userId,
        nodeName: documentsWithTagsView.nodeName,
        content: documentsWithTagsView.content,
        allTags: sql`GROUP_CONCAT(${documentsWithTagsView.tagName} SEPARATOR ', ')`.as("all_tags"),
    })
        .from(documentsWithTagsView)
        .groupBy(
            documentsWithTagsView.noteId,
            documentsWithTagsView.parentId,
            documentsWithTagsView.userId,
            documentsWithTagsView.nodeName,
            documentsWithTagsView.content
        );

    const tagCounts = await db.select({
        tagId: documentsWithTagsView.tagId,
        tagName: documentsWithTagsView.tagName,
        count: count(),
    })
        .from(documentsWithTagsView)
        .groupBy(documentsWithTagsView.tagId);

    const docsByTag = await db.select()
        .from(documentsWithTagsView)
        .where(eq(documentsWithTagsView.tagId, 1));


    const specificDocs = await db.select()
        .from(documentsWithTagsView)
        .where(
            and(
                eq(documentsWithTagsView.tagId, 1),
                eq(documentsWithTagsView.parentId, 2)
            )
        );

    const docsByMultipleTags = await db.select()
        .from(documentsWithTagsView)
        .where(inArray(documentsWithTagsView.tagId, [1, 2, 3]));

    const folders = await db.select()
        .from(nodes)
        .where(eq(nodes.type, "document"));

    const childNodes = await db.select()
        .from(nodes)
        .where(eq(nodes.parentId, 1));

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* <pre>{JSON.stringify(data, null, 2)}</pre>
            <pre>{JSON.stringify(documents, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(documentsWithGroupedTags, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(tagCounts, null, 2)}</pre>
            <pre>{JSON.stringify(docsByTag, null, 2)}</pre>
            <pre>{JSON.stringify(specificDocs, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(docsByMultipleTags, null, 2)}</pre>
            <pre>{JSON.stringify(folders, null, 2)}</pre> */}
            <pre>{JSON.stringify(childNodes, null, 2)}</pre>
        </div>
    );
}