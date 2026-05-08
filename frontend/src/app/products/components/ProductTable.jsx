import Link from 'next/link'
import ProductDeleteButton from './ProductDeleteButton'

export default function ProductTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>name</th>
            <th>price</th>
            <th>category</th>
            <th>inStock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.price}</td>
              <td>{row.category}</td>
              <td>{row.inStock ? 'Yes' : 'No'}</td>
              <td className="flex gap-2">
                <Link href={`/products/${row.id}`} className="btn btn-xs btn-info">View</Link>
                <Link href={`/products/${row.id}/edit`} className="btn btn-xs btn-warning">Edit</Link>
                <ProductDeleteButton id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
