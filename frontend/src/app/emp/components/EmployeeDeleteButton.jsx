'use client'

import { useTransition } from 'react'
import { deleteEmployeeAction } from '../actions'

export default function EmployeeDeleteButton({ id }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this Employee?')) return
    startTransition(async () => {
      await deleteEmployeeAction(id)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-xs btn-error"
    >
      {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Delete'}
    </button>
  )
}
