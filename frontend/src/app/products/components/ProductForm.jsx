'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../validations'
import Link from 'next/link'

export default function ProductForm({ action, initialData = null, cancelHref = '/products', productId }) {
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
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      category: initialData?.category || '',
      description: initialData?.description || '',
      launchDate: initialData?.launchDate || '',
      tags: Array.isArray(initialData?.tags) ? initialData.tags : JSON.parse(initialData?.tags || '[]'),
      inStock: initialData?.inStock || false,
    },
  })

  const tagsValues = watch('tags') || []

  const onSubmit = async (data) => {
    clearErrors()
    const result = await action(productId, data)

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
        <h2 className="card-title">{isEdit ? 'Edit Product' : 'New Product'}</h2>

        {prevState.message && (
          <div className={`alert ${prevState.success ? 'alert-success' : 'alert-error'} text-sm`}>
            {prevState.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          
          {/* name */}
          <div className="form-control">
            <label className="label font-semibold">name</label>
            <input type="text" {...register('name')} className={inputClass('name')} />
            {errors.name && <span className="text-error text-xs">{errors.name.message}</span>}
          </div>

          {/* price */}
          <div className="form-control">
            <label className="label font-semibold">price</label>
            <input type="number" {...register('price')} className={inputClass('price')} />
            {errors.price && <span className="text-error text-xs">{errors.price.message}</span>}
          </div>

          {/* category */}
          <div className="form-control">
            <label className="label font-semibold">category</label>
            <select {...register('category')}
              className={`select select-bordered ${errors.category ? 'select-error' : ''}`}>
              <option value="">-- Select category --</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Books">Books</option>
            </select>
            {errors.category && <span className="text-error text-xs">{errors.category.message}</span>}
          </div>

          {/* description */}
          <div className="form-control">
            <label className="label font-semibold">description</label>
            <textarea {...register('description')}
              className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`} />
            {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
          </div>

          {/* launchDate */}
          <div className="form-control">
            <label className="label font-semibold">launchDate</label>
            <input type="date" {...register('launchDate')} className={inputClass('launchDate')} />
            {errors.launchDate && <span className="text-error text-xs">{errors.launchDate.message}</span>}
          </div>

          {/* tags */}
          <div className="form-control">
            <label className="label font-semibold">tags</label>
            <div className="flex gap-4">
              
              <label key="New" className="cursor-pointer gap-2">
                <input type="checkbox" value="New" {...register('tags')}
                  checked={tagsValues.includes('New')}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...tagsValues, 'New']
                      : tagsValues.filter(s => s !== 'New')
                    setValue('tags', updated, { shouldValidate: true, shouldTouch: true })
                  }} />
                New
              </label>
              <label key="Sale" className="cursor-pointer gap-2">
                <input type="checkbox" value="Sale" {...register('tags')}
                  checked={tagsValues.includes('Sale')}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...tagsValues, 'Sale']
                      : tagsValues.filter(s => s !== 'Sale')
                    setValue('tags', updated, { shouldValidate: true, shouldTouch: true })
                  }} />
                Sale
              </label>
              <label key="Featured" className="cursor-pointer gap-2">
                <input type="checkbox" value="Featured" {...register('tags')}
                  checked={tagsValues.includes('Featured')}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...tagsValues, 'Featured']
                      : tagsValues.filter(s => s !== 'Featured')
                    setValue('tags', updated, { shouldValidate: true, shouldTouch: true })
                  }} />
                Featured
              </label>
              <label key="Limited" className="cursor-pointer gap-2">
                <input type="checkbox" value="Limited" {...register('tags')}
                  checked={tagsValues.includes('Limited')}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...tagsValues, 'Limited']
                      : tagsValues.filter(s => s !== 'Limited')
                    setValue('tags', updated, { shouldValidate: true, shouldTouch: true })
                  }} />
                Limited
              </label>
            </div>
            {errors.tags && <span className="text-error text-xs">{errors.tags.message}</span>}
          </div>

          {/* inStock */}
          <div className="form-control">
            <label className="label font-semibold">inStock</label>
            <input type="checkbox" {...register('inStock')}
              className={`toggle ${errors.inStock ? 'toggle-error' : 'toggle-primary'}`} />
            {errors.inStock && <span className="text-error text-xs">{errors.inStock.message}</span>}
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
