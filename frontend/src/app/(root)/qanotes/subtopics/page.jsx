

import { getAllTopics } from '../topics/service';
import { HOME_PAGE } from '../topics/util/constants';
import { addSubtopics, loadSubtopics } from './actions'
import SubtopicForm from './SubtopicForm';

export default async function AddSubtopicsPage() {
    const record = await getAllTopics();


    return (
        <div className="p-6 flex justify-center">
            <SubtopicForm action={addSubtopics} loadSubtopics={loadSubtopics} topics={record} initialData={record} cancelHref={HOME_PAGE} />
        </div>
    )
}
