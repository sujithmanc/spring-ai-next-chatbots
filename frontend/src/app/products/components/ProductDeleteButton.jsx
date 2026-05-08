'use client'

import { useTransition } from 'react'
import { deleteProductAction } from '../actions'

export default function ProductDeleteButton({ id }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this Product?')) return
    startTransition(async () => {
      await deleteProductAction(id)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="btn btn-xs btn-error">
      {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Delete'}
    </button>
  )
}
