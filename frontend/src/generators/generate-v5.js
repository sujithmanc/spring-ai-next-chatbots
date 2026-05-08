const fs = require('fs')
const path = require('path')

const inputFile = process.argv[2]
if (!inputFile) {
  console.error('Usage: node generate-v5.js <model.json>')
  process.exit(1)
}

const model = JSON.parse(fs.readFileSync(inputFile, 'utf-8'))
const { entity, fields, view = [] } = model

// --- folder name ---
const now = new Date()
const mm  = String(now.getMonth() + 1).padStart(2, '0')
const dd  = String(now.getDate()).padStart(2, '0')
const hh  = String(now.getHours()).padStart(2, '0')
const min = String(now.getMinutes()).padStart(2, '0')
const folderName = `${entity.toLowerCase()}s-${mm}${dd}-${hh}${min}`

const idDir         = path.join(folderName, '[id]')
const editDir       = path.join(idDir, 'edit')
const newDir        = path.join(folderName, 'new')
const componentsDir = path.join(folderName, 'components')

;[folderName, idDir, editDir, newDir, componentsDir].forEach(d => fs.mkdirSync(d, { recursive: true }))

// --- helpers ---
function toId(field)    { return field.toLowerCase().replace(/\s+/g, '_') }
function toCamel(field) { const k = field.replace(/\s+/g, ''); return k.charAt(0).toLowerCase() + k.slice(1) }
function isRequired(f)  { return f.require === true || f.required === true }
function plural()       { return `${entity.toLowerCase()}s` }

// ================================================================
// schema.js
// ================================================================
function drizzleType(f) {
  switch (f.type) {
    case 'number':   return `int('${toCamel(f.field)}')`
    case 'date':     return `date('${toCamel(f.field)}')`
    case 'switch':   return `boolean('${toCamel(f.field)}').default(false)`
    case 'textarea': return `text('${toCamel(f.field)}')`
    default:         return `varchar('${toCamel(f.field)}', { length: 255 })`
  }
}

const schemaJs = `import { mysqlTable, int, varchar, text, date, boolean, serial } from 'drizzle-orm/mysql-core'

export const ${plural()} = mysqlTable('${plural()}', {
  id: serial('id').primaryKey(),
${fields.map(f => `  ${toCamel(f.field)}: ${drizzleType(f)},`).join('\n')}
})
`

// ================================================================
// validations.js
// ================================================================
function zodType(f) {
  const req = isRequired(f)
  switch (f.type) {
    case 'text':
    case 'textarea': {
      let c = 'z.string()'
      if (req || f.minSize) c += `.min(${f.minSize ?? 1}, '${f.field} is required')`
      if (f.maxSize) c += `.max(${f.maxSize}, '${f.field} must be at most ${f.maxSize} characters')`
      if (!req && !f.minSize) c += `.optional()`
      return c
    }
    case 'number': {
      let c = 'z.coerce.number()'
      if (f.min != null) c += `.min(${f.min}, '${f.field} must be at least ${f.min}')`
      if (f.max != null) c += `.max(${f.max}, '${f.field} must be at most ${f.max}')`
      if (!req) c += `.optional()`
      return c
    }
    case 'date': {
      let c = `z.string()`
      const r = []
      if (f.min) r.push(`  .refine(v => new Date(v) >= new Date('${f.min}'), '${f.field} must be after ${f.min}')`)
      if (f.max) r.push(`  .refine(v => new Date(v) <= new Date('${f.max}'), '${f.field} must be before ${f.max}')`)
      if (!req) c += `.optional()`
      return c + (r.length ? '\n' + r.join('\n') : '')
    }
    case 'radio':
    case 'dropdown':
      return req ? `z.string().min(1, '${f.field} is required')` : `z.string().optional()`
    case 'checkbox': {
      const m = typeof f.require === 'number' ? f.require : (req ? 1 : 0)
      let c = `z.array(z.string())`
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

const validationsJs = `import { z } from 'zod'

export const ${entity.toLowerCase()}Schema = z.object({
${fields.map(f => `  ${toCamel(f.field)}: ${zodType(f)},`).join('\n')}
})
`

// ================================================================
// repository.js
// ================================================================
const repositoryJs = `import db from '@/drizzle'
import { ${plural()} } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function findAll() {
  return db.select().from(${plural()})
}

export async function findById(id) {
  const rows = await db.select().from(${plural()}).where(eq(${plural()}.id, id))
  return rows[0] ?? null
}

export async function insert(data) {
  return db.insert(${plural()}).values(data)
}

export async function update(id, data) {
  return db.update(${plural()}).set(data).where(eq(${plural()}.id, id))
}

export async function remove(id) {
  return db.delete(${plural()}).where(eq(${plural()}.id, id))
}
`

// ================================================================
// service.js
// ================================================================
const serviceJs = `import { findAll, findById, insert, update, remove } from './repository'

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
// ================================================================
function parseField(f) {
  const key = toCamel(f.field)
  if (f.type === 'number')   return `    ${key}: formData.get('${key}'),`
  if (f.type === 'switch')   return `    ${key}: formData.get('${key}') === 'on',`
  if (f.type === 'checkbox') return `    ${key}: formData.getAll('${key}'),`
  return `    ${key}: formData.get('${key}'),`
}

const actionsJs = `'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ${entity.toLowerCase()}Schema } from './validations'
import { create${entity}, update${entity}, delete${entity} } from './service'

export async function create${entity}Action(prevState, formData) {
  const raw = {
${fields.map(parseField).join('\n')}
  }

  const parsed = ${entity.toLowerCase()}Schema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors
    }
  }

  try {
    await create${entity}(parsed.data)
  } catch {
    return { success: false, message: 'Failed to create ${entity}. Please try again.', errors: {} }
  }

  revalidatePath('/${plural()}')
  redirect('/${plural()}')
}

export async function update${entity}Action(id, prevState, formData) {
  const raw = {
${fields.map(parseField).join('\n')}
  }

  const parsed = ${entity.toLowerCase()}Schema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors
    }
  }

  try {
    await update${entity}(id, parsed.data)
  } catch {
    return { success: false, message: 'Failed to update ${entity}. Please try again.', errors: {} }
  }

  revalidatePath('/${plural()}')
  redirect('/${plural()}')
}

export async function delete${entity}Action(id) {
  try {
    await delete${entity}(id)
  } catch {
    return { success: false, message: 'Failed to delete ${entity}.' }
  }
  revalidatePath('/${plural()}')
}
`

// ================================================================
// components/EntityTable.jsx
// ================================================================
const viewFields = view.length > 0
  ? fields.filter(f => view.includes(toCamel(f.field)) || view.includes(f.field))
  : fields

function renderCell(f) {
  const key = toCamel(f.field)
  if (f.type === 'switch')   return `<td>{row.${key} ? 'Yes' : 'No'}</td>`
  if (f.type === 'checkbox') return `<td>{(row.${key} || []).join(', ')}</td>`
  return `<td>{row.${key}}</td>`
}

const tableJsx = `'use client'

import Link from 'next/link'
import { delete${entity}Action } from '../actions'

export default function ${entity}Table({ rows }) {
  const handleDelete = async (id) => {
    if (!confirm('Delete this ${entity}?')) return
    await delete${entity}Action(id)
  }

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
                <Link href={\`/${plural()}/\${row.id}\`} className="btn btn-xs btn-info">View</Link>
                <Link href={\`/${plural()}/\${row.id}/edit\`} className="btn btn-xs btn-warning">Edit</Link>
                <button onClick={() => handleDelete(row.id)} className="btn btn-xs btn-error">Delete</button>
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
// components/EntityForm.jsx
// ================================================================
function renderFormField(f) {
  const id  = toId(f.field)
  const key = toCamel(f.field)
  const label = `
          <label className="label">
            <span className="label-text font-semibold">${f.field}</span>
          </label>`
  const err = `
          {state.errors?.${key} && (
            <span className="text-error text-xs mt-1">{state.errors.${key}[0]}</span>
          )}`

  switch (f.type) {
    case 'text':
    case 'number':
    case 'date':
      return `
        <div className="form-control w-full">${label}
          <input type="${f.type}" name="${key}" id="${id}"
            placeholder="Enter ${f.field}"
            defaultValue={initialData?.${key} || ''}
            className="input input-bordered w-full" />${err}
        </div>`
    case 'textarea':
      return `
        <div className="form-control w-full">${label}
          <textarea name="${key}" id="${id}"
            placeholder="Enter ${f.field}"
            defaultValue={initialData?.${key} || ''}
            className="textarea textarea-bordered w-full" rows={3} />${err}
        </div>`
    case 'radio':
      return `
        <div className="form-control w-full">${label}
          <div className="flex gap-4">
            ${f.options.map(opt => `
            <label className="label cursor-pointer gap-2">
              <input type="radio" name="${key}" value="${opt}"
                defaultChecked={initialData?.${key} === '${opt}'}
                className="radio radio-primary" />
              <span className="label-text">${opt}</span>
            </label>`).join('')}
          </div>${err}
        </div>`
    case 'checkbox':
      return `
        <div className="form-control w-full">${label}
          <div className="flex gap-4">
            ${f.options.map(opt => `
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" name="${key}" value="${opt}"
                defaultChecked={(initialData?.${key} || []).includes('${opt}')}
                className="checkbox checkbox-primary" />
              <span className="label-text">${opt}</span>
            </label>`).join('')}
          </div>${err}
        </div>`
    case 'dropdown':
      return `
        <div className="form-control w-full">${label}
          <select name="${key}" id="${id}"
            defaultValue={initialData?.${key} || ''}
            className="select select-bordered w-full">
            <option value="">-- Select ${f.field} --</option>
            ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('\n            ')}
          </select>${err}
        </div>`
    case 'switch':
      return `
        <div className="form-control w-full">
          <label className="label cursor-pointer">${label}
            <input type="checkbox" name="${key}"
              defaultChecked={initialData?.${key} || false}
              className="toggle toggle-primary" />
          </label>${err}
        </div>`
    default:
      return `{/* Unsupported: ${f.type} */}`
  }
}

const formJsx = `'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { create${entity}Action, update${entity}Action } from '../actions'

const initialState = { success: null, message: '', errors: {} }

function SubmitButton({ label }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? <span className="loading loading-spinner loading-sm" /> : label}
    </button>
  )
}

export default function ${entity}Form({ initialData = null, cancelHref = '/${plural()}' }) {
  const isEdit = initialData !== null
  const action = isEdit
    ? update${entity}Action.bind(null, initialData.id)
    : create${entity}Action

  const [state, formAction] = useActionState(action, initialState)

  return (
    <div className="card w-full max-w-lg shadow-md bg-base-100">
      <div className="card-body">
        <h2 className="card-title">{isEdit ? 'Edit ${entity}' : 'New ${entity}'}</h2>

        {state.message && (
          <div className={\`alert \${state.success ? 'alert-success' : 'alert-error'} text-sm\`}>
            {state.message}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-3">
          ${fields.map(renderFormField).join('\n')}

          <div className="card-actions justify-end mt-4 gap-2">
            <a href={cancelHref} className="btn btn-ghost">Cancel</a>
            <SubmitButton label={isEdit ? 'Update' : 'Submit'} />
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
const listPageJsx = `import Link from 'next/link'
import { getAll${entity}s } from './service'
import ${entity}Table from './components/${entity}Table'

export default async function ${entity}ListPage() {
  const rows = await getAll${entity}s()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">${entity}s</h1>
        <Link href="/${plural()}/new" className="btn btn-primary">Create New</Link>
      </div>
      <${entity}Table rows={rows} />
    </div>
  )
}
`

// ================================================================
// new/page.jsx
// ================================================================
const newPageJsx = `import ${entity}Form from '../components/${entity}Form'

export default function New${entity}Page() {
  return (
    <div className="p-6 flex justify-center">
      <${entity}Form />
    </div>
  )
}
`

// ================================================================
// [id]/page.jsx  (view)
// ================================================================
const viewPageJsx = `import Link from 'next/link'
import { get${entity}ById } from '../service'

export default async function ${entity}ViewPage({ params }) {
  const record = await get${entity}ById(params.id)

  return (
    <div className="p-6 flex justify-center">
      <div className="card w-full max-w-lg shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">${entity} Details</h2>
          <div className="flex flex-col gap-3 mt-2">
            ${fields.map(f => {
              const key = toCamel(f.field)
              const val = f.type === 'switch'
                ? `{record.${key} ? 'Yes' : 'No'}`
                : f.type === 'checkbox'
                  ? `{(record.${key} || []).join(', ')}`
                  : `{record.${key}}`
              return `<div className="flex flex-col">
              <span className="text-sm text-base-content/60">${f.field}</span>
              <span className="font-medium">${val}</span>
            </div>`
            }).join('\n            ')}
          </div>
          <div className="card-actions justify-end mt-6 gap-2">
            <Link href="/${plural()}" className="btn btn-ghost">Back</Link>
            <Link href={\`/${plural()}/\${params.id}/edit\`} className="btn btn-warning">Edit</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
`

// ================================================================
// [id]/edit/page.jsx
// ================================================================
const editPageJsx = `import { get${entity}ById } from '../../service'
import ${entity}Form from '../../components/${entity}Form'

export default async function Edit${entity}Page({ params }) {
  const record = await get${entity}ById(params.id)

  return (
    <div className="p-6 flex justify-center">
      <${entity}Form initialData={record} cancelHref="/${plural()}" />
    </div>
  )
}
`

// ================================================================
// Write all files
// ================================================================
const files = [
  [folderName,    'schema.js',              schemaJs],
  [folderName,    'validations.js',         validationsJs],
  [folderName,    'repository.js',          repositoryJs],
  [folderName,    'service.js',             serviceJs],
  [folderName,    'actions.js',             actionsJs],
  [componentsDir, `${entity}Table.jsx`,     tableJsx],
  [componentsDir, `${entity}Form.jsx`,      formJsx],
  [folderName,    'page.jsx',               listPageJsx],
  [newDir,        'page.jsx',               newPageJsx],
  [idDir,         'page.jsx',               viewPageJsx],
  [editDir,       'page.jsx',               editPageJsx],
]

files.forEach(([dir, name, content]) => fs.writeFileSync(path.join(dir, name), content))

console.log(`\nGenerated: ${folderName}/`)
console.log(`  page.jsx`)
console.log(`  new/page.jsx`)
console.log(`  [id]/page.jsx`)
console.log(`  [id]/edit/page.jsx`)
console.log(`  components/${entity}Table.jsx`)
console.log(`  components/${entity}Form.jsx`)
console.log(`  schema.js`)
console.log(`  validations.js`)
console.log(`  repository.js`)
console.log(`  service.js`)
console.log(`  actions.js`)
