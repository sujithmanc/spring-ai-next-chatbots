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
