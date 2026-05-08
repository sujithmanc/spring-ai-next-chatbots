import Link from 'next/link'
import EmployeeDeleteButton from './EmployeeDeleteButton'

export default function EmployeeTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.city}</td>
              <td className="flex gap-2">
                <Link href={`/emp/${row.id}`} className="btn btn-xs btn-info">View</Link>
                <Link href={`/emp/${row.id}/edit`} className="btn btn-xs btn-warning">Edit</Link>
                <EmployeeDeleteButton id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
