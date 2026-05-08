'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'

const initialState = {
  success: null,
  message: '',
  errors: {},
  results: [],
  stats: { total: 0, added: 0, dupes: 0 },
}

export default function SubtopicForm({ action, loadSubtopics, topics, cancelHref = '/subtopics' }) {

  const [loading, setLoading] = useState(false)
  const [subtopicText, setSubtopicText] = useState('')

  const handleLoad = async () => {
    const topicId = document.getElementById('topic-select').value
    if (!topicId) {
      alert('Please select a topic first.')
      return
    }
    setLoading(true)
    const existing = await loadSubtopics(parseInt(topicId))
    setSubtopicText(existing.map(s => s.name).join('\n'))
    setLoading(false)
  }

  const formAction = async (prevState, formData) => {
    const topicId = formData.get('topicId')
    const raw = formData.get('subtopics') || ''
    const lines = raw.split('\n').map(s => s.trim()).filter(Boolean)

    if (!topicId) {
      return { ...initialState, success: false, message: 'Please select a topic.' }
    }
    if (lines.length === 0) {
      return { ...initialState, success: false, message: 'Please enter at least one subtopic.' }
    }

    const result = await action({ topicId: parseInt(topicId), subtopics: lines })
    return result
  }

  const [state, dispatch, isPending] = useActionState(formAction, initialState)

  return (
    <div className="card w-full max-w-xl bg-base-100 shadow-md">
      <div className="card-body gap-4">
        <h2 className="card-title">Add Subtopics</h2>

        {/* Stats */}
        {state.stats?.total > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-base-200 rounded-box p-3 text-center">
              <p className="text-xs text-base-content/60 mb-1">Submitted</p>
              <p className="text-2xl font-semibold">{state.stats.total}</p>
            </div>
            <div className="bg-base-200 rounded-box p-3 text-center">
              <p className="text-xs text-base-content/60 mb-1">Added</p>
              <p className="text-2xl font-semibold text-success">{state.stats.added}</p>
            </div>
            <div className="bg-base-200 rounded-box p-3 text-center">
              <p className="text-xs text-base-content/60 mb-1">Duplicates</p>
              <p className="text-2xl font-semibold text-warning">{state.stats.dupes}</p>
            </div>
          </div>
        )}

        {/* Alert */}
        {state.message && (
          <div className={`alert text-sm ${state.success ? 'alert-success' : 'alert-error'}`}>
            {state.message}
          </div>
        )}

        <form action={dispatch} className="flex flex-col gap-4">

          {/* Topic + Load */}
          <div className="form-control">
            <label className="label font-semibold">Topic</label>
            <div className="flex gap-2">
              <select
                id="topic-select"
                name="topicId"
                className={`select select-bordered flex-1 ${state.errors?.topicId ? 'select-error' : ''}`}
                defaultValue=""
              >
                <option value="" disabled>Select a topic</option>
                {topics?.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleLoad}
                disabled={loading}
              >
                {loading
                  ? <span className="loading loading-spinner loading-sm" />
                  : 'Load'}
              </button>
            </div>
            {state.errors?.topicId && (
              <span className="text-error text-xs mt-1">{state.errors.topicId}</span>
            )}
          </div>

          {/* Subtopics */}
          <div className="form-control">
            <label className="label font-semibold">
              Subtopics
              <span className="label-text-alt text-base-content/50">one per line</span>
            </label>
            <textarea
              name="subtopics"
              className={`textarea textarea-bordered w-full ${state.errors?.subtopics ? 'textarea-error' : ''}`}
              rows={6}
              placeholder={'Closures\nPromises\nAsync/Await\nEvent Loop'}
              value={subtopicText}
              onChange={e => setSubtopicText(e.target.value)}
            />
            {state.errors?.subtopics && (
              <span className="text-error text-xs mt-1">{state.errors.subtopics}</span>
            )}
          </div>

          <div className="card-actions justify-end gap-2">
            <Link href={cancelHref} className="btn btn-ghost">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Subtopics'}
            </button>
          </div>
        </form>

        {/* Per-line results */}
        {state.results?.length > 0 && (
          <div className="border border-base-300 rounded-box overflow-hidden">
            {state.results.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2 text-sm border-b border-base-300 last:border-b-0"
              >
                <span className="flex-1">{row.name}</span>
                {row.status === 'added' ? (
                  <span className="badge badge-success badge-sm">Added</span>
                ) : (
                  <span className="badge badge-warning badge-sm">Duplicate</span>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}