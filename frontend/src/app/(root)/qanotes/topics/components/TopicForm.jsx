'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { topicSchema } from '../validations'
import Link from 'next/link'

export default function TopicForm({ action, initialData = null, cancelHref = '/topics', topicId }) {
  const isEdit = initialData !== null
  const [prevState, setPrevState] = useState({ success: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    clearErrors,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(topicSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
    },
  })



  const onSubmit = async (data) => {
    clearErrors()
    const result = await action(topicId, data)

    if (!result?.success) {
      if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (messages?.length > 0) {
            setError(field, { type: 'server', message: messages[0] })
          }
        })
      }
      if (result?.values) {
        Object.entries(result.values).forEach(([key, value]) => {
          setValue(key, value, { shouldValidate: false })
        })
      }
      setPrevState({ success: false, message: result.message })
      return
    }

    setPrevState(result)
  }

  const inputClass = (field) =>
    `input input-bordered w-full ${errors[field] ? 'input-error' : touchedFields[field] ? 'input-success' : ''}`

  return (
    <div className="card w-full max-w-lg shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title">{isEdit ? 'Edit Topic' : 'New Topic'}</h2>

        {prevState.message && (
          <div className={`alert ${prevState.success ? 'alert-success' : 'alert-error'} text-sm`}>
            {prevState.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          
          {/* Name */}
          <div className="form-control">
            <label className="label font-semibold">Name</label>
            <input type="text" {...register('name')} className={inputClass('name')} />
            {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
          </div>

          <div className="card-actions justify-end mt-4 gap-2">
            <Link href={cancelHref} className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : isEdit ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
