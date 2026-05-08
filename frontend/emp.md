# 📦 emp Code Export

## 📑 Table of Contents

- [[id]\edit\page.jsx](#[id]editpagejsx)
- [[id]\page.jsx](#[id]pagejsx)
- [actions.js](#actionsjs)
- [components\EmployeeDeleteButton.jsx](#componentsemployeedeletebuttonjsx)
- [components\EmployeeDetails.jsx](#componentsemployeedetailsjsx)
- [components\EmployeeForm copy.jsx](#componentsemployeeform copyjsx)
- [components\EmployeeForm.jsx](#componentsemployeeformjsx)
- [components\EmployeeTable.jsx](#componentsemployeetablejsx)
- [components\Timer.js](#componentstimerjs)
- [layout.js](#layoutjs)
- [new\page.jsx](#newpagejsx)
- [page.jsx](#pagejsx)
- [repository.js](#repositoryjs)
- [schema.js](#schemajs)
- [service.js](#servicejs)
- [util\util.js](#utilutiljs)
- [validations.js](#validationsjs)

---

## 📄 page.jsx
**Path:** `[id]\edit\page.jsx`

<a id="[id]editpagejsx"></a>

```jsx
import { updateEmployeeAction } from '../../actions'
import { getEmployeeById } from '../../service'
import EmployeeForm from '../../components/EmployeeForm'

export default async function EditEmployeePage({ params }) {
  const { id } = await params
  const raw = await getEmployeeById(id)

  const formatted = new Date(raw.dOB).toISOString().split("T")[0];
  const record = { ...raw, dOB: formatted }

  //const boundAction = updateEmployeeAction.bind(null, id)

  return (
    <div className="p-6 flex justify-center">
      <EmployeeForm action={updateEmployeeAction} initialData={record} empId={id} cancelHref="/emp" />
    </div>
  )
}

```

---

## 📄 page.jsx
**Path:** `[id]\page.jsx`

<a id="[id]pagejsx"></a>

```jsx
import { getEmployeeById } from '../service'
import EmployeeDetails from '../components/EmployeeDetails'
import { formatDate } from '../util/util';

export default async function EmployeeViewPage({ params }) {
  const { id } = await params;
  const raw = await getEmployeeById(id);

  raw.map(parseField).join('\n')

  const record = { ...raw, dOB: formatDate(raw.dOB) }

  return (
    <div className="p-6 flex justify-center">
      <EmployeeDetails record={record} id={id} />
    </div>
  )
}

```

---

## 📄 actions.js
**Path:** `actions.js`

<a id="actionsjs"></a>

```javascript
// Project: Employee Management System
// Used to manage the whole employee system

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { employeeSchema } from './validations'
import { createEmployee, updateEmployee, deleteEmployee } from './service'

export async function createEmployeeAction(prevState, formData, isFromHook) {
  console.info("From Data", formData);
  const raw = {
    name: formData.get('name'),
    age: formData.get('age'),
    dOB: formData.get('dOB'),
    desc: formData.get('desc'),
    gender: formData.get('gender'),
    skills: formData.getAll('skills'),
    city: formData.get('city'),
    active: formData.get('active') === 'on',
  }

  const parsed = employeeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  const { name, age, dOB, desc, gender, skills, city, active } = parsed.data

  try {
    await createEmployee({ name, age, dOB, desc, gender, skills, city, active })
  } catch {
    return { success: false, message: 'Failed to create Employee. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/emp')
  redirect('/emp')
}

export async function updateEmployeeAction(id, formData) {

  console.info("Inside::updateEmployeeAction: ID", id);
  console.info("Inside::updateEmployeeAction: FormData", formData);

  const raw = formData;
  const parsed = employeeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  try {
    if (id) {
      await updateEmployee(id, parsed.data)
    } else {
      await createEmployee(parsed.data)
    }

  } catch {
    return { success: false, message: 'Failed to update Employee. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/emp')
  redirect('/emp')
}

export async function deleteEmployeeAction(id) {
  try {
    await deleteEmployee(id)
  } catch {
    return { success: false, message: 'Failed to delete Employee.' }
  }
  revalidatePath('/emp')
}

```

---

## 📄 EmployeeDeleteButton.jsx
**Path:** `components\EmployeeDeleteButton.jsx`

<a id="componentsemployeedeletebuttonjsx"></a>

```jsx
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

```

---

## 📄 EmployeeDetails.jsx
**Path:** `components\EmployeeDetails.jsx`

<a id="componentsemployeedetailsjsx"></a>

```jsx
import Link from 'next/link'

export default function EmployeeDetails({ record, id }) {
  return (
    <div className="card w-full max-w-2xl shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl">Employee Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Name</div>
        <div className="stat-value text-lg">{record.name}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Age</div>
        <div className="stat-value text-lg">{record.age}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">DOB</div>
        <div className="stat-value text-lg">{record.dOB}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">desc</div>
        <div className="stat-value text-lg">{record.desc}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Gender</div>
        <div className="stat-value text-lg">{record.gender}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Skills</div>
        <div className="stat-value text-lg">{(Array.isArray(record.skills) ? record.skills : JSON.parse(record.skills || '[]')).join(', ')}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">City</div>
        <div className="stat-value text-lg">{record.city}</div>
      </div>
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">Active</div>
        <div className="stat-value text-lg">{record.active ? 'Yes' : 'No'}</div>
      </div>
        </div>
        <div className="card-actions justify-end mt-6 gap-2">
          <Link href="/emp" className="btn btn-ghost">Back</Link>
          <Link href={`/emp/${id}/edit`} className="btn btn-warning">Edit</Link>
        </div>
      </div>
    </div>
  )
}

```

---

## 📄 EmployeeForm copy.jsx
**Path:** `components\EmployeeForm copy.jsx`

<a id="componentsemployeeform copyjsx"></a>

```jsx
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

```

---

## 📄 EmployeeForm.jsx
**Path:** `components\EmployeeForm.jsx`

<a id="componentsemployeeformjsx"></a>

```jsx
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
```

---

## 📄 EmployeeTable.jsx
**Path:** `components\EmployeeTable.jsx`

<a id="componentsemployeetablejsx"></a>

```jsx
import Link from 'next/link'
import EmployeeDeleteButton from './EmployeeDeleteButton'

export default function EmployeeTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.city}</td>
              <td className="flex gap-2">
                <Link href={`/emp/${row.id}`} className="btn btn-xs btn-info">View</Link>
                <Link href={`/emp/${row.id}/edit`} className="btn btn-xs btn-warning">Edit</Link>
                <EmployeeDeleteButton id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

```

---

## 📄 Timer.js
**Path:** `components\Timer.js`

<a id="componentstimerjs"></a>

```javascript
"use client";

import { useEffect, useState } from "react";

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Format time -> mm:ss
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold mb-6">
                {formatTime(seconds)}
            </h1>

            <div className="flex gap-4">
                <button
                    onClick={handleStartPause}
                    className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition"
                >
                    {isRunning ? "Pause" : "Start"}
                </button>

                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
```

---

## 📄 layout.js
**Path:** `layout.js`

<a id="layoutjs"></a>

```javascript
import Timer from "./components/Timer";


export default function EmpLayout({ children }) {

    return (
        <>
            <Timer />
            {children}
        </>
    )
}
```

---

## 📄 page.jsx
**Path:** `new\page.jsx`

<a id="newpagejsx"></a>

```jsx
import { createEmployeeAction, updateEmployeeAction } from '../actions'
import EmployeeForm from '../components/EmployeeForm'

export default function NewEmployeePage() {
  return (
    <div className="p-6 flex justify-center">
      <EmployeeForm action={updateEmployeeAction} />
    </div>
  )
}

```

---

## 📄 page.jsx
**Path:** `page.jsx`

<a id="pagejsx"></a>

```jsx
// Project: Employee Management System
// Used to manage the whole employee system

import Link from 'next/link'
import { getAllEmployees } from './service'
import EmployeeTable from './components/EmployeeTable'

export default async function EmployeeListPage() {
  const rows = await getAllEmployees()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management System</h1>
        <Link href="/emp/new" className="btn btn-primary">Create New</Link>
      </div>
      <EmployeeTable rows={rows} />
    </div>
  )
}

```

---

## 📄 repository.js
**Path:** `repository.js`

<a id="repositoryjs"></a>

```javascript
// Project: Employee Management System
// Used to manage the whole employee system

import db from '@/drizzle'
import { employees } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

function serialize(data) {
  const d = { ...data }
  if (Array.isArray(d.skills)) d.skills = JSON.stringify(d.skills)
  return d
}

function deserialize(row) {
  if (!row) return row
  const d = { ...row }
  if (typeof d.skills === 'string') d.skills = JSON.parse(d.skills)
  return d
}

export async function findAll() {
  const rows = await db.select().from(employees)
  return rows.map(deserialize)
}

export async function findById(id) {
  const rows = await db.select().from(employees).where(eq(employees.id, id))
  return deserialize(rows[0] ?? null)
}

export async function insert(data) {
  return db.insert(employees).values(serialize(data))
}

export async function update(id, data) {
  return db.update(employees).set(serialize(data)).where(eq(employees.id, id))
}

export async function remove(id) {
  return db.delete(employees).where(eq(employees.id, id))
}

```

---

## 📄 schema.js
**Path:** `schema.js`

<a id="schemajs"></a>

```javascript
// Project: Employee Management System
// Used to manage the whole employee system

import { mysqlTable, int, varchar, text, date, boolean, serial, json } from 'drizzle-orm/mysql-core'

export const employees = mysqlTable('employees', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  age: int('age'),
  dOB: date('dOB'),
  desc: text('desc'),
  gender: varchar('gender', { length: 255 }),
  skills: json('skills'),
  city: varchar('city', { length: 255 }),
  active: boolean('active').default(false),
})

```

---

## 📄 service.js
**Path:** `service.js`

<a id="servicejs"></a>

```javascript
// Project: Employee Management System
// Used to manage the whole employee system

import { findAll, findById, insert, update, remove } from './repository'

export async function getAllEmployees() {
  return findAll()
}

export async function getEmployeeById(id) {
  const record = await findById(Number(id))
  if (!record) throw new Error('Employee not found')
  return record
}

export async function createEmployee(data) {
  return insert(data)
}

export async function updateEmployee(id, data) {
  await getEmployeeById(id)
  return update(Number(id), data)
}

export async function deleteEmployee(id) {
  await getEmployeeById(id)
  return remove(Number(id))
}

```

---

## 📄 util.js
**Path:** `util\util.js`

<a id="utilutiljs"></a>

```javascript
export const formatDate = (date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};
```

---

## 📄 validations.js
**Path:** `validations.js`

<a id="validationsjs"></a>

```javascript
// Project: Employee Management System
// Used to manage the whole employee system

import { z } from 'zod'

export const employeeSchema = z.object({
  name: z.string().min(4, 'Name is required').max(16, 'Name must be at most 16 characters'),
  age: z.coerce.number().min(18, 'Age must be at least 18').max(60, 'Age must be at most 60'),
  dOB: z.string().optional()
  .refine(v => new Date(v) >= new Date('2000-01-01'), 'DOB must be after 2000-01-01')
  .refine(v => new Date(v) <= new Date('2030-01-01'), 'DOB must be before 2030-01-01'),
  desc: z.string().optional(),
  gender: z.string().min(1, 'Gender is required'),
  skills: z.array(z.string()).min(2, 'Select at least 2 options for Skills'),
  city: z.string().min(1, 'City is required'),
  active: z.literal(true, { errorMap: () => ({ message: 'Active must be enabled' }) }),
})

```

---
