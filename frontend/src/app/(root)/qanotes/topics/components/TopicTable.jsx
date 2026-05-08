import Link from 'next/link'
import TopicDeleteButton from './TopicDeleteButton'
import { HOME_PAGE } from '../util/constants'

export default function TopicTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td className="flex gap-2">
                <Link href={`${HOME_PAGE}/${row.id}`} className="btn btn-xs btn-info">View</Link>
                <Link href={`${HOME_PAGE}/${row.id}/edit`} className="btn btn-xs btn-warning">Edit</Link>
                <TopicDeleteButton id={row.id} />
                <Link href={`/qanotes/subtopics`} className="btn btn-xs btn-success">Add Subtopics</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
