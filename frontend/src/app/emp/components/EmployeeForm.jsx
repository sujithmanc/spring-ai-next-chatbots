'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeSchema } from '../validations'
import { useState } from 'react'
import Link from 'next/link'

export default function EmployeeForm({
  action,
  initialData = null,
  cancelHref = '/emp',
  empId
}) {
  const isEdit = initialData !== null

  const [prevState, setPrevState] = useState({
    success: null,
    message: '',
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    clearErrors,
    setValue,
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      age: initialData?.age || '',
      dOB: initialData?.dOB || '',
      desc: initialData?.desc || '',
      gender: initialData?.gender || '',
      skills: Array.isArray(initialData?.skills)
        ? initialData.skills
        : JSON.parse(initialData?.skills || '[]'),
      city: initialData?.city || '',
      active: initialData?.active || false,
    },
  })

  const skills = watch('skills') || []

  const onSubmit = async (data) => {
    clearErrors()
    console.info("Inside Submit: ");
    const result = await action(empId, data)

    console.info("Results: ", JSON.stringify(result, null, 4))

    if (!result?.success) {
      // 🔴 Set field errors
      if (result?.errors) {
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (messages?.length > 0) {
            setError(field, {
              type: 'server',
              message: messages[0], // take first error
            })
          }
        })
      }

      // 🟡 Optional: restore values from server (important!)
      if (result?.values) {
        Object.entries(result.values).forEach(([key, value]) => {
          setValue(key, value, { shouldValidate: false })
        })
      }

      //🔵 Global message
      setPrevState({
        success: false,
        message: result.message,
      })

      return
    }

    //✅ Success
    setPrevState(result)
  }

  const inputClass = (field) =>
    `input input-bordered w-full ${errors[field]
      ? 'input-error'
      : touchedFields[field]
        ? 'input-success'
        : ''
    }`

  return (
    <div className="card w-full max-w-lg shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title">
          {isEdit ? 'Edit Employee' : 'New Employee'}
        </h2>
        {/* <pre>
          {
            JSON.stringify(errors, null, 4)
          }
        </pre> */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

          {/* Name */}
          <div className="form-control">
            <label className="label font-semibold">Name</label>
            <input {...register('name')} className={inputClass('name')} />
            {errors.name && (
              <span className="text-error text-xs">{errors.name.message}</span>
            )}
          </div>

          {/* Age */}
          <div className="form-control">
            <label className="label font-semibold">Age</label>
            <input
              type="number"
              {...register('age')}
              className={inputClass('age')}
            />
            {errors.age && (
              <span className="text-error text-xs">{errors.age.message}</span>
            )}
          </div>

          {/* DOB */}
          <div className="form-control">
            <label className="label font-semibold">DOB</label>
            <input
              type="date"
              {...register('dOB')}
              className={inputClass('dOB')}
            />
            {errors.dOB && (
              <span className="text-error text-xs">{errors.dOB.message}</span>
            )}
          </div>

          {/* Desc */}
          <div className="form-control">
            <label className="label font-semibold">Desc</label>
            <textarea
              {...register('desc')}
              className={`textarea textarea-bordered ${errors.desc ? 'textarea-error' : ''
                }`}
            />
            {errors.desc && (
              <span className="text-error text-xs">{errors.desc.message}</span>
            )}
          </div>

          {/* Gender */}
          <div className="form-control">
            <label className="label font-semibold">Gender</label>
            <div className="flex gap-4">
              <label className="cursor-pointer gap-2">
                <input type="radio" value="Male" {...register('gender')} />
                Male
              </label>
              <label className="cursor-pointer gap-2">
                <input type="radio" value="Female" {...register('gender')} />
                Female
              </label>
            </div>
            {errors.gender && (
              <span className="text-error text-xs">
                {errors.gender.message}
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="form-control">
            <label className="label font-semibold">Skills</label>
            <div className="flex gap-4">
              {['JavaScript', 'Java', 'Python'].map((skill) => (
                <label key={skill} className="cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    value={skill}
                    {...register('skills')}
                    checked={skills.includes(skill)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...skills, skill]
                        : skills.filter((s) => s !== skill)

                      setValue('skills', updated, {
                        shouldValidate: true,
                        shouldTouch: true,
                      })
                    }}
                  />
                  {skill}
                </label>
              ))}
            </div>
            {errors.skills && (
              <span className="text-error text-xs">
                {errors.skills.message}
              </span>
            )}
          </div>

          {/* City */}
          <div className="form-control">
            <label className="label font-semibold">City</label>
            <select
              {...register('city')}
              className={`select select-bordered ${errors.city ? 'select-error' : ''
                }`}
            >
              <option value="">-- Select City --</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
            {errors.city && (
              <span className="text-error text-xs">{errors.city.message}</span>
            )}
          </div>

          {/* Active */}
          <div className="form-control">
            <label className="label font-semibold">Active</label>
            <input
              type="checkbox"
              {...register('active')}
              className={`toggle ${errors.active ? 'toggle-error' : 'toggle-primary'
                }`}
            />
            {errors.active && (
              <span className="text-error text-xs">
                {errors.active.message}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-4 gap-2">
            <Link href={cancelHref} className="btn btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : isEdit
                  ? 'Update'
                  : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}