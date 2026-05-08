import Link from "next/link";
import DeleteButton from "@/app/users/[id]/delete-button";

export default function UserTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th><th>Username</th><th>Email</th>
            <th>Role</th><th>Skills</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>@{user.username}</td>
              <td>{user.email}</td>
              <td><span className="badge badge-neutral">{user.role}</span></td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {user.skills?.map((s) => (
                    <span key={s} className="badge badge-outline badge-sm">{s}</span>
                  ))}
                </div>
              </td>
              <td className="flex gap-2">
                <Link href={`/users/${user.id}`} className="btn btn-sm btn-ghost">
                  Edit
                </Link>
                <DeleteButton id={user.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}