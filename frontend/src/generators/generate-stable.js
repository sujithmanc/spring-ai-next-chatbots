const fs = require('fs')
const path = require('path')

const inputFile = process.argv[2]
if (!inputFile) {
  console.error('Usage: node generate-v12.js <model.json>')
  process.exit(1)
}

const model = JSON.parse(fs.readFileSync(inputFile, 'utf-8'))
const { project, desc, base_route, schema_name, fields, view = [] } = model

function toEntityName(s) {
  return s
    .replace(/[_-]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, c => c.toUpperCase())
    .replace(/s$/, '')
}

const entity      = toEntityName(schema_name)
const entityLower = entity.toLowerCase()

const now = new Date()
const mm  = String(now.getMonth() + 1).padStart(2, '0')
const dd  = String(now.getDate()).padStart(2, '0')
const hh  = String(now.getHours()).padStart(2, '0')
const mn  = String(now.getMinutes()).padStart(2, '0')
const folderName = `${base_route}-${mm}${dd}-${hh}${mn}`

const idDir         = path.join(folderName, '[id]')
const editDir       = path.join(idDir, 'edit')
const newDir        = path.join(folderName, 'new')
const componentsDir = path.join(folderName, 'components')
const utilDir       = path.join(folderName, 'util')

;[folderName, idDir, editDir, newDir, componentsDir, utilDir].forEach(d => fs.mkdirSync(d, { recursive: true }))

const fileHeader   = `// Project: ${project}\n// ${desc}\n`
function toId(f)   { return f.toLowerCase().replace(/\s+/g, '_') }
function toCamel(f){ const k = f.replace(/\s+/g, ''); return k.charAt(0).toLowerCase() + k.slice(1) }
function isReq(f)  { return f.require === true || f.required === true }

const checkboxFields = fields.filter(f => f.type === 'checkbox').map(f => toCamel(f.field))
const dateFields     = fields.filter(f => f.type === 'date').map(f => toCamel(f.field))
const hasCheckbox    = checkboxFields.length > 0
const hasDate        = dateFields.length > 0
const fieldKeys      = fields.map(f => toCamel(f.field))
const viewFields     = view.length > 0
  ? fields.filter(f => view.includes(toCamel(f.field)) || view.includes(f.field))
  : fields

// ================================================================
// util/util.js
// ================================================================
const utilJs = `export const formatDate = (date) => {
  const d = new Date(date)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleString('en-GB', { month: 'short' })
  const year  = d.getFullYear()
  return \`\${day}-\${month}-\${year}\`
}
`

// ================================================================
// schema.js
// ================================================================
function drizzleType(f) {
  switch (f.type) {
    case 'number':   return `int('${toCamel(f.field)}')`
    case 'date':     return `date('${toCamel(f.field)}')`
    case 'switch':   return `boolean('${toCamel(f.field)}').default(false)`
    case 'textarea': return `text('${toCamel(f.field)}')`
    case 'checkbox': return `json('${toCamel(f.field)}')` // stored as JSON array
    default:         return `varchar('${toCamel(f.field)}', { length: 255 })`
  }
}

const schemaJs = `${fileHeader}
import { mysqlTable, int, varchar, text, date, boolean, serial, json } from 'drizzle-orm/mysql-core'

export const ${schema_name} = mysqlTable('${schema_name}', {
  id: serial('id').primaryKey(),
${fields.map(f => `  ${toCamel(f.field)}: ${drizzleType(f)},`).join('\n')}
})
`

// ================================================================
// validations.js
// ================================================================
function zodType(f) {
  const req = isReq(f)
  switch (f.type) {
    case 'text':
    case 'textarea': {
      let c = 'z.string()'
      if (req || f.minSize) c += `.min(${f.minSize ?? 1}, '${f.field} is required')`
      if (f.maxSize)        c += `.max(${f.maxSize}, '${f.field} must be at most ${f.maxSize} characters')`
      if (!req && !f.minSize) c += `.optional()`
      return c
    }
    case 'number': {
      let c = 'z.coerce.number()'
      if (f.min != null) c += `.min(${f.min}, '${f.field} must be at least ${f.min}')`
      if (f.max != null) c += `.max(${f.max}, '${f.field} must be at most ${f.max}')`
      if (!req)          c += `.optional()`
      return c
    }
    case 'date': {
      let c = 'z.string()'
      const r = []
      if (f.min) r.push(`  .refine(v => new Date(v) >= new Date('${f.min}'), '${f.field} must be after ${f.min}')`)
      if (f.max) r.push(`  .refine(v => new Date(v) <= new Date('${f.max}'), '${f.field} must be before ${f.max}')`)
      if (!req)  c += `.optional()`
      return c + (r.length ? '\n' + r.join('\n') : '')
    }
    case 'radio':
    case 'dropdown':
      return req ? `z.string().min(1, '${f.field} is required')` : `z.string().optional()`
    case 'checkbox': {
      const m = typeof f.require === 'number' ? f.require : (req ? 1 : 0)
      let c = 'z.array(z.string())'
      if (m > 0) c += `.min(${m}, 'Select at least ${m} option${m > 1 ? 's' : ''} for ${f.field}')`
      return c
    }
    case 'switch':
      return req
        ? `z.literal(true, { errorMap: () => ({ message: '${f.field} must be enabled' }) })`
        : `z.boolean().optional()`
    default:
      return 'z.string().optional()'
  }
}

const validationsJs = `${fileHeader}
import { z } from 'zod'

export const ${entityLower}Schema = z.object({
${fields.map(f => `  ${toCamel(f.field)}: ${zodType(f)},`).join('\n')}
})
`

// ================================================================
// repository.js
// ================================================================
const checkboxBlock = hasCheckbox ? `
function serialize(data) {
  const d = { ...data }
${checkboxFields.map(k => `  if (Array.isArray(d.${k})) d.${k} = JSON.stringify(d.${k})`).join('\n')}
  return d
}

function deserialize(row) {
  if (!row) return row
  const d = { ...row }
${checkboxFields.map(k => `  if (typeof d.${k} === 'string') d.${k} = JSON.parse(d.${k})`).join('\n')}
  return d
}
` : ''

const repositoryJs = `${fileHeader}
import db from '@/drizzle'
import { ${schema_name} } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
${checkboxBlock}
export async function findAll() {
  const rows = await db.select().from(${schema_name})
  return ${hasCheckbox ? 'rows.map(deserialize)' : 'rows'}
}

export async function findById(id) {
  const rows = await db.select().from(${schema_name}).where(eq(${schema_name}.id, id))
  return ${hasCheckbox ? 'deserialize(rows[0] ?? null)' : 'rows[0] ?? null'}
}

export async function insert(data) {
  return db.insert(${schema_name}).values(${hasCheckbox ? 'serialize(data)' : 'data'})
}

export async function update(id, data) {
  return db.update(${schema_name}).set(${hasCheckbox ? 'serialize(data)' : 'data'}).where(eq(${schema_name}.id, id))
}

export async function remove(id) {
  return db.delete(${schema_name}).where(eq(${schema_name}.id, id))
}
`

// ================================================================
// service.js
// ================================================================
const serviceJs = `${fileHeader}
import { findAll, findById, insert, update, remove } from './repository'

export async function getAll${entity}s() {
  return findAll()
}

export async function get${entity}ById(id) {
  const record = await findById(Number(id))
  if (!record) throw new Error('${entity} not found')
  return record
}

export async function create${entity}(data) {
  return insert(data)
}

export async function update${entity}(id, data) {
  await get${entity}ById(id)
  return update(Number(id), data)
}

export async function delete${entity}(id) {
  await get${entity}ById(id)
  return remove(Number(id))
}
`

// ================================================================
// actions.js
// — createAction: prevState + FormData (server action pattern)
// — updateAction: id + plain object (called from RHF onSubmit)
// ================================================================
function parseFormDataField(f) {
  const key = toCamel(f.field)
  if (f.type === 'number')   return `    ${key}: formData.get('${key}'),`
  if (f.type === 'switch')   return `    ${key}: formData.get('${key}') === 'on',`
  if (f.type === 'checkbox') return `    ${key}: formData.getAll('${key}'),`
  return `    ${key}: formData.get('${key}'),`
}

const actionsJs = `${fileHeader}
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ${entityLower}Schema } from './validations'
import { create${entity}, update${entity}, delete${entity} } from './service'

export async function create${entity}Action(prevState, formData) {
  const raw = {
${fields.map(parseFormDataField).join('\n')}
  }

  const parsed = ${entityLower}Schema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  const { ${fieldKeys.join(', ')} } = parsed.data

  try {
    await create${entity}({ ${fieldKeys.join(', ')} })
  } catch {
    return { success: false, message: 'Failed to create ${entity}. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/${base_route}')
  redirect('/${base_route}')
}

export async function update${entity}Action(id, formData) {
  const raw = formData

  const parsed = ${entityLower}Schema.safeParse(raw)
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
      await update${entity}(id, parsed.data)
    } else {
      await create${entity}(parsed.data)
    }
  } catch {
    return { success: false, message: 'Failed to update ${entity}. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/${base_route}')
  redirect('/${base_route}')
}

export async function delete${entity}Action(id) {
  try {
    await delete${entity}(id)
  } catch {
    return { success: false, message: 'Failed to delete ${entity}.' }
  }
  revalidatePath('/${base_route}')
}
`

// ================================================================
// components/Timer.js
// ================================================================
const timerJs = `'use client'

import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds]   = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const formatTime = (total) => {
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`
  }

  useEffect(() => {
    let interval
    if (isRunning) interval = setInterval(() => setSeconds(p => p + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
      <h1 className="text-4xl font-bold mb-6">{formatTime(seconds)}</h1>
      <div className="flex gap-4">
        <button onClick={() => setIsRunning(p => !p)}
          className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setIsRunning(false); setSeconds(0) }}
          className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition">
          Reset
        </button>
      </div>
    </div>
  )
}
`

// ================================================================
// layout.js
// ================================================================
const layoutJs = `import Timer from './components/Timer'

export default function ${entity}Layout({ children }) {
  return (
    <>
      <Timer />
      {children}
    </>
  )
}
`

// ================================================================
// components/EntityDeleteButton.jsx
// ================================================================
const deleteButtonJsx = `'use client'

import { useTransition } from 'react'
import { delete${entity}Action } from '../actions'

export default function ${entity}DeleteButton({ id }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this ${entity}?')) return
    startTransition(async () => {
      await delete${entity}Action(id)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="btn btn-xs btn-error">
      {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Delete'}
    </button>
  )
}
`

// ================================================================
// components/EntityTable.jsx  — Server Component
// ================================================================
function renderCell(f) {
  const key = toCamel(f.field)
  if (f.type === 'switch')   return `<td>{row.${key} ? 'Yes' : 'No'}</td>`
  if (f.type === 'checkbox') return `<td>{(Array.isArray(row.${key}) ? row.${key} : JSON.parse(row.${key} || '[]')).join(', ')}</td>`
  return `<td>{row.${key}}</td>`
}

const tableJsx = `import Link from 'next/link'
import ${entity}DeleteButton from './${entity}DeleteButton'

export default function ${entity}Table({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            ${viewFields.map(f => `<th>${f.field}</th>`).join('\n            ')}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              ${viewFields.map(renderCell).join('\n              ')}
              <td className="flex gap-2">
                <Link href={\`/${base_route}/\${row.id}\`} className="btn btn-xs btn-info">View</Link>
                <Link href={\`/${base_route}/\${row.id}/edit\`} className="btn btn-xs btn-warning">Edit</Link>
                <${entity}DeleteButton id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
`

// ================================================================
// components/EntityDetails.jsx  — Server Component, stat cards
// ================================================================
function renderDetailField(f) {
  const key = toCamel(f.field)
  let val
  if (f.type === 'switch')
    val = `{record.${key} ? 'Yes' : 'No'}`
  else if (f.type === 'checkbox')
    val = `{(Array.isArray(record.${key}) ? record.${key} : JSON.parse(record.${key} || '[]')).join(', ')}`
  else
    val = `{record.${key}}`

  return `
      <div className="stat bg-base-200 rounded-xl">
        <div className="stat-title">${f.field}</div>
        <div className="stat-value text-lg">${val}</div>
      </div>`
}

const detailsJsx = `import Link from 'next/link'

export default function ${entity}Details({ record, id }) {
  return (
    <div className="card w-full max-w-2xl shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-xl">${entity} Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          ${fields.map(renderDetailField).join('')}
        </div>
        <div className="card-actions justify-end mt-6 gap-2">
          <Link href="/${base_route}" className="btn btn-ghost">Back</Link>
          <Link href={\`/${base_route}/\${id}/edit\`} className="btn btn-warning">Edit</Link>
        </div>
      </div>
    </div>
  )
}
`

// ================================================================
// components/EntityForm.jsx  — Client, react-hook-form + zodResolver
// ================================================================
function renderRHFField(f) {
  const key  = toCamel(f.field)
  const type = f.type

  switch (type) {
    case 'text':
    case 'number':
    case 'date':
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <input type="${type}" {...register('${key}')} className={inputClass('${key}')} />
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`

    case 'textarea':
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <textarea {...register('${key}')}
              className={\`textarea textarea-bordered \${errors.${key} ? 'textarea-error' : ''}\`} />
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`

    case 'radio':
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <div className="flex gap-4">
              ${f.options.map(opt => `
              <label className="cursor-pointer gap-2">
                <input type="radio" value="${opt}" {...register('${key}')} /> ${opt}
              </label>`).join('')}
            </div>
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`

    case 'checkbox': {
      const optLines = f.options.map(opt => `
              <label key="${opt}" className="cursor-pointer gap-2">
                <input type="checkbox" value="${opt}" {...register('${key}')}
                  checked={${key}Values.includes('${opt}')}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...${key}Values, '${opt}']
                      : ${key}Values.filter(s => s !== '${opt}')
                    setValue('${key}', updated, { shouldValidate: true, shouldTouch: true })
                  }} />
                ${opt}
              </label>`).join('')
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <div className="flex gap-4">
              ${optLines}
            </div>
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`
    }

    case 'dropdown':
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <select {...register('${key}')}
              className={\`select select-bordered \${errors.${key} ? 'select-error' : ''}\`}>
              <option value="">-- Select ${f.field} --</option>
              ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('\n              ')}
            </select>
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`

    case 'switch':
      return `
          {/* ${f.field} */}
          <div className="form-control">
            <label className="label font-semibold">${f.field}</label>
            <input type="checkbox" {...register('${key}')}
              className={\`toggle \${errors.${key} ? 'toggle-error' : 'toggle-primary'}\`} />
            {errors.${key} && <span className="text-error text-xs">{errors.${key}.message}</span>}
          </div>`

    default:
      return `{/* Unsupported: ${type} */}`
  }
}

// watch lines for checkbox fields
const checkboxWatchLines = fields
  .filter(f => f.type === 'checkbox')
  .map(f => {
    const key = toCamel(f.field)
    return `  const ${key}Values = watch('${key}') || []`
  }).join('\n')

// defaultValues for RHF
const defaultValues = fields.map(f => {
  const key = toCamel(f.field)
  if (f.type === 'checkbox') {
    return `      ${key}: Array.isArray(initialData?.${key}) ? initialData.${key} : JSON.parse(initialData?.${key} || '[]'),`
  }
  if (f.type === 'switch') return `      ${key}: initialData?.${key} || false,`
  return `      ${key}: initialData?.${key} || '',`
}).join('\n')

const formJsx = `'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ${entityLower}Schema } from '../validations'
import Link from 'next/link'

export default function ${entity}Form({ action, initialData = null, cancelHref = '/${base_route}', ${entityLower}Id }) {
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
    resolver: zodResolver(${entityLower}Schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
${defaultValues}
    },
  })

${checkboxWatchLines}

  const onSubmit = async (data) => {
    clearErrors()
    const result = await action(${entityLower}Id, data)

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
    \`input input-bordered w-full \${errors[field] ? 'input-error' : touchedFields[field] ? 'input-success' : ''}\`

  return (
    <div className="card w-full max-w-lg shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title">{isEdit ? 'Edit ${entity}' : 'New ${entity}'}</h2>

        {prevState.message && (
          <div className={\`alert \${prevState.success ? 'alert-success' : 'alert-error'} text-sm\`}>
            {prevState.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          ${fields.map(renderRHFField).join('\n')}

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
`

// ================================================================
// page.jsx  (list)
// ================================================================
const listPageJsx = `${fileHeader}
import Link from 'next/link'
import { getAll${entity}s } from './service'
import ${entity}Table from './components/${entity}Table'

export default async function ${entity}ListPage() {
  const rows = await getAll${entity}s()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${project}</h1>
        <Link href="/${base_route}/new" className="btn btn-primary">Create New</Link>
      </div>
      <${entity}Table rows={rows} />
    </div>
  )
}
`

// ================================================================
// new/page.jsx  — passes updateAction (matches your pattern)
// ================================================================
const newPageJsx = `import { update${entity}Action } from '../actions'
import ${entity}Form from '../components/${entity}Form'

export default function New${entity}Page() {
  return (
    <div className="p-6 flex justify-center">
      <${entity}Form action={update${entity}Action} />
    </div>
  )
}
`

// ================================================================
// [id]/page.jsx  — formatDate for date fields
// ================================================================
const dateImport = hasDate ? `\nimport { formatDate } from '../util/util'` : ''

const dateFormatLines = dateFields
  .map(key => `  record.${key} = formatDate(record.${key})`)
  .join('\n')

const viewPageJsx = `import { get${entity}ById } from '../service'
import ${entity}Details from '../components/${entity}Details'${dateImport}

export default async function ${entity}ViewPage({ params }) {
  const { id } = await params
  const record = await get${entity}ById(id)
${hasDate ? '\n' + dateFields.map(key => `  record.${key} = formatDate(record.${key})`).join('\n') : ''}
  return (
    <div className="p-6 flex justify-center">
      <${entity}Details record={record} id={id} />
    </div>
  )
}
`

// ================================================================
// [id]/edit/page.jsx  — toISOString date format for input[type=date]
// ================================================================
const dateFormatEditLines = dateFields
  .map(key => `  const ${key}Formatted = new Date(raw.${key}).toISOString().split('T')[0]`)
  .join('\n')

const recordSpread = hasDate
  ? `  const record = { ...raw, ${dateFields.map(k => `${k}: ${k}Formatted`).join(', ')} }`
  : `  const record = raw`

const editPageJsx = `import { update${entity}Action } from '../../actions'
import { get${entity}ById } from '../../service'
import ${entity}Form from '../../components/${entity}Form'

export default async function Edit${entity}Page({ params }) {
  const { id } = await params
  const raw = await get${entity}ById(id)
${hasDate ? '\n' + dateFormatEditLines + '\n' + recordSpread : '  const record = raw'}

  return (
    <div className="p-6 flex justify-center">
      <${entity}Form action={update${entity}Action} initialData={record} ${entityLower}Id={id} cancelHref="/${base_route}" />
    </div>
  )
}
`

// ================================================================
// Write all files
// ================================================================
const files = [
  [folderName,    'schema.js',                 schemaJs],
  [folderName,    'validations.js',            validationsJs],
  [folderName,    'repository.js',             repositoryJs],
  [folderName,    'service.js',                serviceJs],
  [folderName,    'actions.js',                actionsJs],
  [folderName,    'layout.js',                 layoutJs],
  [utilDir,       'util.js',                   utilJs],
  [componentsDir, 'Timer.js',                  timerJs],
  [componentsDir, `${entity}DeleteButton.jsx`, deleteButtonJsx],
  [componentsDir, `${entity}Table.jsx`,        tableJsx],
  [componentsDir, `${entity}Details.jsx`,      detailsJsx],
  [componentsDir, `${entity}Form.jsx`,         formJsx],
  [folderName,    'page.jsx',                  listPageJsx],
  [newDir,        'page.jsx',                  newPageJsx],
  [idDir,         'page.jsx',                  viewPageJsx],
  [editDir,       'page.jsx',                  editPageJsx],
]

files.forEach(([dir, name, content]) => fs.writeFileSync(path.join(dir, name), content))

console.log(`\nGenerated: ${folderName}/`)
console.log(`  layout.js`)
console.log(`  page.jsx`)
console.log(`  new/page.jsx`)
console.log(`  [id]/page.jsx`)
console.log(`  [id]/edit/page.jsx`)
console.log(`  components/Timer.js`)
console.log(`  components/${entity}DeleteButton.jsx`)
console.log(`  components/${entity}Table.jsx`)
console.log(`  components/${entity}Details.jsx`)
console.log(`  components/${entity}Form.jsx`)
console.log(`  schema.js`)
console.log(`  validations.js`)
console.log(`  repository.js`)
console.log(`  service.js`)
console.log(`  actions.js`)
console.log(`  util/util.js`)
