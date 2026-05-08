'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

const initialState = { success: null, message: '', errors: {}, values: {} }

function SubmitButton({ label }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? <span className="loading loading-spinner loading-sm" /> : label}
    </button>
  )
}

export default function EmployeeForm({ action, initialData = null, cancelHref = '/emp' }) {
  const isEdit = initialData !== null
  const [state, formAction] = useActionState(action, initialState)

  const [values, setValues] = useState({
    name: state.values?.name ?? initialData?.name ?? '',
    age: state.values?.age ?? initialData?.age ?? '',
    dOB: state.values?.dOB ?? initialData?.dOB ?? '',
    desc: state.values?.desc ?? initialData?.desc ?? '',
    gender: state.values?.gender ?? initialData?.gender ?? '',
    skills: state.values?.skills ?? (Array.isArray(initialData?.skills) ? initialData.skills : JSON.parse(initialData?.skills || '[]')),
    city: state.values?.city ?? initialData?.city ?? '',
    active: state.values?.active ?? initialData?.active ?? false,
  })

  useEffect(() => {
    if (state.values && Object.keys(state.values).length > 0) {
      setValues(v => ({ ...v, ...state.values }))
    }
  }, [state.values])

  return (
    <div className="card w-full max-w-lg shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title">{isEdit ? 'Edit Employee' : 'New Employee'}</h2>

        {state.message && (
          <div className={`alert ${state.success ? 'alert-success' : 'alert-error'} text-sm`}>
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3">

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Name</span>
            </label>
            <input type="text" name="name" id="name"
              placeholder="Enter Name"
              value={values.name}
              onChange={e => setValues(v => ({ ...v, name: e.target.value }))}
              className="input input-bordered w-full" />
            {state.errors?.name && (
              <span className="text-error text-xs mt-1">{state.errors.name[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Age</span>
            </label>
            <input type="number" name="age" id="age"
              placeholder="Enter Age"
              value={values.age}
              onChange={e => setValues(v => ({ ...v, age: e.target.value }))}
              className="input input-bordered w-full" />
            {state.errors?.age && (
              <span className="text-error text-xs mt-1">{state.errors.age[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">DOB</span>
            </label>
            <input type="date" name="dOB" id="dob"
              placeholder="Enter DOB"
              value={values.dOB}
              onChange={e => setValues(v => ({ ...v, dOB: e.target.value }))}
              className="input input-bordered w-full" />
            {state.errors?.dOB && (
              <span className="text-error text-xs mt-1">{state.errors.dOB[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">desc</span>
            </label>
            <textarea name="desc" id="desc"
              placeholder="Enter desc"
              value={values.desc}
              onChange={e => setValues(v => ({ ...v, desc: e.target.value }))}
              className="textarea textarea-bordered w-full" rows={3} />
            {state.errors?.desc && (
              <span className="text-error text-xs mt-1">{state.errors.desc[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Gender</span>
            </label>
            <div className="flex gap-4">

              <label className="label cursor-pointer gap-2">
                <input type="radio" name="gender" value="Male"
                  checked={values.gender === 'Male'}
                  onChange={e => setValues(v => ({ ...v, gender: e.target.value }))}
                  className="radio radio-primary" />
                <span className="label-text">Male</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input type="radio" name="gender" value="Female"
                  checked={values.gender === 'Female'}
                  onChange={e => setValues(v => ({ ...v, gender: e.target.value }))}
                  className="radio radio-primary" />
                <span className="label-text">Female</span>
              </label>
            </div>
            {state.errors?.gender && (
              <span className="text-error text-xs mt-1">{state.errors.gender[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Skills</span>
            </label>
            <div className="flex gap-4">

              <label className="label cursor-pointer gap-2">
                <input type="checkbox" name="skills" value="JavaScript"
                  checked={(Array.isArray(values.skills) ? values.skills : []).includes('JavaScript')}
                  onChange={e => setValues(v => ({
                    ...v,
                    skills: e.target.checked
                      ? [...(Array.isArray(v.skills) ? v.skills : []), 'JavaScript']
                      : (Array.isArray(v.skills) ? v.skills : []).filter(x => x !== 'JavaScript')
                  }))}
                  className="checkbox checkbox-primary" />
                <span className="label-text">JavaScript</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" name="skills" value="Java"
                  checked={(Array.isArray(values.skills) ? values.skills : []).includes('Java')}
                  onChange={e => setValues(v => ({
                    ...v,
                    skills: e.target.checked
                      ? [...(Array.isArray(v.skills) ? v.skills : []), 'Java']
                      : (Array.isArray(v.skills) ? v.skills : []).filter(x => x !== 'Java')
                  }))}
                  className="checkbox checkbox-primary" />
                <span className="label-text">Java</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" name="skills" value="Python"
                  checked={(Array.isArray(values.skills) ? values.skills : []).includes('Python')}
                  onChange={e => setValues(v => ({
                    ...v,
                    skills: e.target.checked
                      ? [...(Array.isArray(v.skills) ? v.skills : []), 'Python']
                      : (Array.isArray(v.skills) ? v.skills : []).filter(x => x !== 'Python')
                  }))}
                  className="checkbox checkbox-primary" />
                <span className="label-text">Python</span>
              </label>
            </div>
            {state.errors?.skills && (
              <span className="text-error text-xs mt-1">{state.errors.skills[0]}</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">City</span>
            </label>
            <select name="city" id="city"
              value={values.city}
              onChange={e => setValues(v => ({ ...v, city: e.target.value }))}
              className="select select-bordered w-full">
              <option value="">-- Select City --</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>
            {state.errors?.city && (
              <span className="text-error text-xs mt-1">{state.errors.city[0]}</span>
            )}
          </div>
          <div className="form-control w-full">
            <label className="label cursor-pointer">
              <label className="label">
                <span className="label-text font-semibold">Active</span>
              </label>
              <input type="checkbox" name="active"
                checked={values.active}
                onChange={e => setValues(v => ({ ...v, active: e.target.checked }))}
                className="toggle toggle-primary" />
            </label>
            {state.errors?.active && (
              <span className="text-error text-xs mt-1">{state.errors.active[0]}</span>
            )}
          </div>

          <div className="card-actions justify-end mt-4 gap-2">
            <a href={cancelHref} className="btn btn-ghost">Cancel</a>
            <SubmitButton label={isEdit ? 'Update' : 'Submit'} />
          </div>
        </form>
      </div>
    </div>
  )
}
