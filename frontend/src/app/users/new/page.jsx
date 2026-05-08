import UserForm from "@/components/users/user-form";
import { createUser } from "@/actions/user-actions";

export default function NewUserPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">New User</h1>
      <UserForm action={createUser} />
    </main>
  );
}