import { getTopicById } from '../service'
import TopicDetails from '../components/TopicDetails'

export default async function TopicViewPage({ params }) {
  const { id } = await params
  const record = await getTopicById(id)

  return (
    <div className="p-6 flex justify-center">
      <TopicDetails record={record} id={id} />
    </div>
  )
}
