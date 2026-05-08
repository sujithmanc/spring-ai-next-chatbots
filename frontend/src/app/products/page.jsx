// Project: Product Catalog
// Manage products, pricing and inventory

import Link from 'next/link'
import { getAllProducts } from './service'
import ProductTable from './components/ProductTable'

export default async function ProductListPage() {
  const rows = await getAllProducts()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <Link href="/products/new" className="btn btn-primary">Create New</Link>
      </div>
      <ProductTable rows={rows} />
    </div>
  )
}
