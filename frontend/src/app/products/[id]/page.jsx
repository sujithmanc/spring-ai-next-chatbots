import { getProductById } from '../service'
import ProductDetails from '../components/ProductDetails'
import { formatDate } from '../util/util'

export default async function ProductViewPage({ params }) {
  const { id } = await params
  const record = await getProductById(id)

  record.launchDate = formatDate(record.launchDate)
  return (
    <div className="p-6 flex justify-center">
      <ProductDetails record={record} id={id} />
    </div>
  )
}
