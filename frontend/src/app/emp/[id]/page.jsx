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
