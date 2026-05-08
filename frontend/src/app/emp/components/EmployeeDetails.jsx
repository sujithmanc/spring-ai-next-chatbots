import Link from 'next/link'

export default function EmployeeDetails({ record, id }) {
  return (
    <div className="card w-full max-w-2xl shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl">Employee Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Name</div>
        <div className="stat-value text-lg">{record.name}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Age</div>
        <div className="stat-value text-lg">{record.age}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">DOB</div>
        <div className="stat-value text-lg">{record.dOB}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">desc</div>
        <div className="stat-value text-lg">{record.desc}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Gender</div>
        <div className="stat-value text-lg">{record.gender}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Skills</div>
        <div className="stat-value text-lg">{(Array.isArray(record.skills) ? record.skills : JSON.parse(record.skills || '[]')).join(', ')}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">City</div>
        <div className="stat-value text-lg">{record.city}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Active</div>
        <div className="stat-value text-lg">{record.active ? 'Yes' : 'No'}</div>
      </div>
        </div>
        <div className="card-actions justify-end mt-6 gap-2">
          <Link href="/emp" className="btn btn-ghost">Back</Link>
          <Link href={`/emp/${id}/edit`} className="btn btn-warning">Edit</Link>
        </div>
      </div>
    </div>
  )
}
