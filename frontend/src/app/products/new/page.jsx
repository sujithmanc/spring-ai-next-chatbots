import { updateProductAction } from '../actions'
import ProductForm from '../components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-6 flex justify-center">
      <ProductForm action={updateProductAction} />
    </div>
  )
}
