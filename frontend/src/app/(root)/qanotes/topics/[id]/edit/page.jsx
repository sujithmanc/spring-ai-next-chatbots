import { createOrUpdateTopicAction } from '../../actions'
  import { getTopicById } from '../../service'
import TopicForm from '../../components/TopicForm'
import { HOME_PAGE } from '../../util/constants'

export default async function EditTopicPage({ params }) {
  const { id } = await params
  const raw = await getTopicById(id)
  const record = raw

  return (
    <div className="p-6 flex justify-center">
      <TopicForm action={createOrUpdateTopicAction} initialData={record} topicId={id} cancelHref={HOME_PAGE} />
    </div>
  )
}
