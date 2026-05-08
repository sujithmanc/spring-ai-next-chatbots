import Link from 'next/link'
import { HOME_PAGE } from '../util/constants'

export default function TopicDetails({ record, id }) {
  return (
    <div className="card w-full max-w-2xl shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl">Topic Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">

          <div className="stat bg-base-200 rounded-xl">
            <div className="stat-title">Name</div>
            <div className="stat-value text-lg">{record.name}</div>
          </div>
        </div>
        <div className="card-actions justify-end mt-6 gap-2">
          <Link href={HOME_PAGE} className="btn btn-ghost">Back</Link>
          <Link href={`${HOME_PAGE}/${id}/edit`} className="btn btn-warning">Edit</Link>
        </div>
      </div>
    </div>
  )
}
