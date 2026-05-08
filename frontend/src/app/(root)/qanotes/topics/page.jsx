// Project: Flash card Topics
// Used to manage the whole employee system

import Link from 'next/link'
import { getAllTopics } from './service'
import TopicTable from './components/TopicTable'
import { HOME_PAGE } from './util/constants'

export default async function TopicListPage() {
  const rows = await getAllTopics()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flash card Topics</h1>
        <Link href={`${HOME_PAGE}/new`} className="btn btn-primary">Create New</Link>
      </div>
      <TopicTable rows={rows} />
    </div>
  )
}
