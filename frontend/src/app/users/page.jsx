import { Suspense } from "react";
import Link from "next/link";
import UserTable from "@/components/users/user-table";
import { getAllUsers } from "@/queries/user-queries";

export default async function UsersPage() {
  const users = await getAllUsers();
  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/users/new" className="btn btn-primary">+ New User</Link>
      </div>
      <Suspense fallback={<span className="loading loading-spinner" />}>
        <UserTable users={users} />
      </Suspense>
    </main>
  );
}