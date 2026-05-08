# How to Use the Next.js CRUD Generator

A CLI code generator that reads a JSON model file and produces a complete, production-ready Next.js App Router feature — including pages, components, server actions, Drizzle schema, Zod validation, and more.

---

## Prerequisites

Before running the generator, make sure your Next.js project has the following installed:

```bash
npm install drizzle-orm react-hook-form @hookform/resolvers zod
npm install -D drizzle-kit
```

Your project should also have DaisyUI configured in Tailwind CSS.

The generator assumes the following path exists in your project:

```
src/
  drizzle/
    index.js     ← exports default db instance
    schema.js    ← exports all your table definitions
```

---

## Running the Generator

Place `generate-v12.js` in the root of your project alongside your model file, then run:

```bash
node generate-v12.js model.json
```

This will create a timestamped folder in the current directory:

```
emp-0319-1840/
```

---

## Output Folder Structure

```
{base_route}-MMDD-HHmm/
  layout.js                     ← Route layout wrapping children with Timer
  page.jsx                      ← List page (Server Component)
  new/
    page.jsx                    ← Create page
  [id]/
    page.jsx                    ← View/detail page
    edit/
      page.jsx                  ← Edit page
  components/
    {Entity}Form.jsx            ← Client form (react-hook-form + Zod)
    {Entity}Table.jsx           ← Server table with view fields
    {Entity}Details.jsx         ← Server detail stat cards
    {Entity}DeleteButton.jsx    ← Client delete with useTransition
    Timer.js                    ← Client countdown timer
  util/
    util.js                     ← formatDate helper
  schema.js                     ← Drizzle MySQL table definition
  validations.js                ← Zod schema with all field rules
  repository.js                 ← Raw Drizzle queries only
  service.js                    ← Business logic, calls repository
  actions.js                    ← Server Actions, calls service
```

---

## Integrating into Your Project

Copy the generated folder into your Next.js app directory:

```bash
cp -r emp-0319-1840/* src/app/emp/
```

Then export your new table from your shared Drizzle schema file:

```js
// src/drizzle/schema.js
export { employees } from '@/app/emp/schema'
```

Run the Drizzle migration to create the table in your database:

```bash
npx drizzle-kit push
```

---

## The Model File

The model file is a JSON file that defines your entire entity. Here is the full structure with all supported options:

```json
{
  "project": "Employee Management System",
  "desc": "Used to manage the whole employee system",
  "base_route": "emp",
  "schema_name": "employees",
  "view": ["name", "age", "city"],
  "fields": [...]
}
```

### Top-level Fields

| Field | Description |
|---|---|
| `project` | Display name shown as the page heading on the list page |
| `desc` | Short description added as a comment at the top of every generated file |
| `base_route` | URL route prefix and folder name prefix (e.g. `emp` → `/emp`, `/emp/new`, `/emp/[id]/edit`) |
| `schema_name` | Database table name and Drizzle export name (e.g. `employees`). Also used to derive the component/function prefix — `employees` → `Employee` |
| `view` | Array of camelCase field names to show as columns in the list table. If omitted, all fields are shown |

---

## Supported Field Types

Every field in the `fields` array requires at minimum a `field` name and a `type`.

### text

```json
{ "field": "Name", "type": "text", "minSize": 4, "maxSize": 100, "require": true }
```

Renders as `<input type="text">`. Zod uses `z.string().min().max()`.

### number

```json
{ "field": "Age", "type": "number", "min": 18, "max": 60, "require": true }
```

Renders as `<input type="number">`. Zod uses `z.coerce.number().min().max()`.

### date

```json
{ "field": "DOB", "type": "date", "min": "2000-01-01", "max": "2030-12-31" }
```

Renders as `<input type="date">`. Zod validates range using `.refine()`. In the edit page, the value is automatically formatted to `YYYY-MM-DD` for the input. In the view page, it is displayed as `DD-Mon-YYYY` using `formatDate()`.

### textarea

```json
{ "field": "Description", "type": "textarea" }
```

Renders as `<textarea>`. No min/max options — mark as optional by omitting `require`.

### radio

```json
{ "field": "Gender", "type": "radio", "options": ["Male", "Female"], "require": true }
```

Renders as a group of radio inputs. `options` is required. Zod uses `z.string().min(1)` when required.

### checkbox

```json
{ "field": "Skills", "type": "checkbox", "options": ["JavaScript", "Java", "Python"], "require": 2 }
```

Renders as a group of checkboxes. Values are stored as a **JSON array** in MySQL using Drizzle's `json()` column type. `require: 2` means at least 2 must be selected. `require: true` means at least 1.

### dropdown

```json
{ "field": "City", "type": "dropdown", "options": ["Hyderabad", "Mumbai", "Delhi"], "require": true }
```

Renders as a `<select>`. Zod uses `z.string().min(1)` when required.

### switch

```json
{ "field": "Active", "type": "switch", "require": true }
```

Renders as a DaisyUI toggle. `require: true` means the toggle must be ON — Zod uses `z.literal(true)`. Without `require`, it is an optional boolean.

---

## Validation Rules Reference

| Option | Applies To | Effect |
|---|---|---|
| `require: true` | All types | Field is mandatory. Switch must be ON |
| `require: N` | checkbox | At least N options must be selected |
| `minSize` | text, textarea | Minimum character length |
| `maxSize` | text, textarea | Maximum character length |
| `min` | number | Minimum value |
| `max` | number | Maximum value |
| `min` | date | Earliest allowed date (YYYY-MM-DD) |
| `max` | date | Latest allowed date (YYYY-MM-DD) |

Both `require` and `required` spellings are supported.

---

## Architecture Overview

The generated code follows a strict layered architecture. Each layer only communicates with the layer directly below it.

```
pages / components
      ↓
  actions.js         ← Server Actions, parses input, calls service
      ↓
  service.js         ← Business logic, calls repository
      ↓
 repository.js       ← Raw Drizzle queries, only file touching the DB
      ↓
  DB (MySQL)
```

### Swapping the Data Layer

If you want to replace Drizzle with a REST API or a different ORM, you only need to rewrite `repository.js`. The service, actions, and all UI components are completely unaffected — they call the same function names regardless of what is behind them.

---

## Form Behaviour

### Create mode

Navigate to `/{base_route}/new`. The form submits via `react-hook-form`. On success it redirects to the list page. On failure it shows field-level errors inline without clearing any input values.

### Edit mode

Navigate to `/{base_route}/[id]/edit`. The page fetches the record server-side, formats any date fields to `YYYY-MM-DD`, and passes the data to the form as `initialData`. On success it redirects to the list page.

### Validation

Validation runs client-side on every `onChange` event using `zodResolver`. The same Zod schema is also used server-side in the action for double validation. Field borders turn red on error and green when valid and touched.

---

## Example Models

Five ready-to-use models are included:

| File | Description |
|---|---|
| `product.json` | Product Catalog — pricing, category, tags, stock status |
| `student.json` | Student Management — courses, grades, enrollment |
| `task.json` | Task Tracker — priority, status, due date, tags |
| `doctor.json` | Hospital Doctor Registry — specialization, languages, availability |
| `book.json` | Library Book Manager — genre, author, borrow status |

Run any of them:

```bash
node generate-v12.js product.json
node generate-v12.js student.json
node generate-v12.js task.json
node generate-v12.js doctor.json
node generate-v12.js book.json
```

---

## Generator Version History

| Version | Key Changes |
|---|---|
| v1 | Bootstrap HTML form from model |
| v2 | Next.js Client Component with REST API calls |
| v3 | Server Actions + Drizzle schema + Zod validations |
| v4 | Full folder with pages, components, service, repository |
| v5 | Flattened folder structure (no pages/ wrapper) |
| v6 | Replaced `entity` with `project`, `base_route`, `schema_name`, `desc` |
| v7 | Fixed column count insert error, values persistence on failed submit |
| v8 | Checkbox fields stored as JSON column in MySQL |
| v9 | Added EntityDetails, EntityDeleteButton (useTransition), Server Component table |
| v12 | react-hook-form + zodResolver, Timer, layout, util/formatDate, date auto-format |

---

## Notes

- The generator is zero-dependency — it uses only Node.js built-ins (`fs`, `path`).
- Generated files use JavaScript (`.js` / `.jsx`), not TypeScript.
- DaisyUI class names are used throughout all components.
- The `Timer` component in the layout is a demonstration component and can be safely removed from `layout.js` if not needed.
