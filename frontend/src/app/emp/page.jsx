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
