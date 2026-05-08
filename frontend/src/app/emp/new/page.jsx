import { createEmployeeAction, updateEmployeeAction } from '../actions'
import EmployeeForm from '../components/EmployeeForm'

export default function NewEmployeePage() {
  return (
    <div className="p-6 flex justify-center">
      <EmployeeForm action={updateEmployeeAction} />
    </div>
  )
}
