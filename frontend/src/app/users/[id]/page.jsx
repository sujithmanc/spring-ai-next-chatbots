import { getUserById } from "@/queries/user-queries";
import UserForm from "@/components/users/user-form";
import { updateUser } from "@/actions/user-actions";
import { notFound } from "next/navigation";

export default async function EditUserPage({ params }) {
    const { id } = await params;
    const user = await getUserById(id);
    if (!user) notFound();

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit User</h1>
            <UserForm action={updateUser} defaultValues={user} userId={user.id} />
        </main>
    );
}