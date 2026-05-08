import { createOrUpdateTopicAction } from '../actions'
import TopicForm from '../components/TopicForm'

export default function NewTopicPage() {
  return (
    <div className="p-6 flex justify-center">
      <TopicForm action={createOrUpdateTopicAction} />
    </div>
  )
}
