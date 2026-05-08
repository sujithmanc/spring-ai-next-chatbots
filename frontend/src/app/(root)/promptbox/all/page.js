import { FileText, Tag, Folder, User, Calendar } from "lucide-react";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import db from "@/drizzle";
import { documentsWithTagsView } from "@/drizzle/promptbox-schema";

export default async function AllPrompts() {
    const documentsWithGroupedTags = await db.select({
        nodeId: documentsWithTagsView.noteId,
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

    return (
        <div className="p-8 bg-base-200 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <FileText className="text-primary" />
                            All Documents
                        </h1>
                        <p className="text-base-content/60">Manage your synced prompts and snippets</p>
                    </div>
                    <button className="btn btn-primary btn-sm">New Document</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documentsWithGroupedTags.map((doc) => (
                        <div key={doc.nodeId} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border border-base-300">
                            <div className="card-body">
                                {/* Title and Folder Info */}
                                <div className="flex items-start justify-between">
                                    <h2 className="card-title text-lg font-bold line-clamp-1">
                                        {doc.nodeName}
                                    </h2>
                                    <div className="badge badge-ghost gap-1 text-xs">
                                        <Folder size={12} /> {doc.parentId ?? 'Root'}
                                    </div>
                                </div>

                                {/* Content Preview (Stripping HTML tags for preview) */}
                                <div
                                    className="text-sm text-base-content/70 line-clamp-3 my-2 h-12"
                                    dangerouslySetInnerHTML={{ __html: doc.content }}
                                />

                                {/* Tags Section */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {doc.allTags?.split(', ').map((tag) => (
                                        <div key={tag} className="badge badge-outline badge-secondary gap-1 py-3">
                                            <Tag size={10} />
                                            {tag}
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Action */}
                                <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                                    <button className="btn btn-ghost btn-xs gap-1">
                                        <User size={14} /> ID: {doc.userId}
                                    </button>
                                    <button className="btn btn-primary btn-sm px-6">Open</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {documentsWithGroupedTags.length === 0 && (
                    <div className="alert alert-info">
                        <span>No documents found matching your criteria.</span>
                    </div>
                )}
            </div>
        </div>
    );
}