import Link from 'next/link'

export default function ProductDetails({ record, id }) {
  return (
    <div className="card w-full max-w-2xl shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl">Product Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">name</div>
        <div className="stat-value text-lg">{record.name}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">price</div>
        <div className="stat-value text-lg">{record.price}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">category</div>
        <div className="stat-value text-lg">{record.category}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">description</div>
        <div className="stat-value text-lg">{record.description}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">launchDate</div>
        <div className="stat-value text-lg">{record.launchDate}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">tags</div>
        <div className="stat-value text-lg">{(Array.isArray(record.tags) ? record.tags : JSON.parse(record.tags || '[]')).join(', ')}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">inStock</div>
        <div className="stat-value text-lg">{record.inStock ? 'Yes' : 'No'}</div>
      </div>
        </div>
        <div className="card-actions justify-end mt-6 gap-2">
          <Link href="/products" className="btn btn-ghost">Back</Link>
          <Link href={`/products/${id}/edit`} className="btn btn-warning">Edit</Link>
        </div>
      </div>
    </div>
  )
}
