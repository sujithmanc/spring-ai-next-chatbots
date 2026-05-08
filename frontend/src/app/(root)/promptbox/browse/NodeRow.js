"use client";

import { useRouter } from "next/navigation";
import { Folder, FileText, ChevronRight } from "lucide-react";

export default function NodeRow({ node }) {
    const router = useRouter();

    const handleDoubleClick = () => {
        if (node.type === "folder") {
            // Navigate by updating the URL search parameter
            router.push(`/promptbox/browse?folderId=${node.id}`);
        } else {
            // Logic for documents (e.g., redirect to an editor)
            router.push(`/promptbox/edit/${node.id}`);
        }
    };

    return (
        <tr
            onDoubleClick={handleDoubleClick}
            className="group hover:bg-base-300/50 cursor-pointer transition-colors select-none border-b border-base-300 last:border-0"
        >
            <td>
                <div className="flex items-center gap-4">
                    {node.type === 'folder' ? (
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Folder size={20} fill="currentColor" fillOpacity={0.2} />
                        </div>
                    ) : (
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-base-content group-hover:text-primary transition-colors">
                            {node.name}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">
                            {node.type}
                        </div>
                    </div>
                </div>
            </td>

            <td className="hidden sm:table-cell text-sm text-base-content/50">
                {new Date(node.updatedAt).toLocaleDateString()}
            </td>

            <td className="text-right">
                <button className="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} />
                </button>
            </td>
        </tr>
    );
}