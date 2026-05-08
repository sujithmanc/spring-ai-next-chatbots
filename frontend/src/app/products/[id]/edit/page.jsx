import { updateProductAction } from '../../actions'
import { getProductById } from '../../service'
import ProductForm from '../../components/ProductForm'

export default async function EditProductPage({ params }) {
  const { id } = await params
  const raw = await getProductById(id)

  const launchDateFormatted = new Date(raw.launchDate).toISOString().split('T')[0]
  const record = { ...raw, launchDate: launchDateFormatted }

  return (
    <div className="p-6 flex justify-center">
      <ProductForm action={updateProductAction} initialData={record} productId={id} cancelHref="/products" />
    </div>
  )
}
