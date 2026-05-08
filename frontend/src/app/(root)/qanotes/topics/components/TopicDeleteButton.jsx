'use client'

import { useTransition } from 'react'
import { deleteTopicAction } from '../actions'
import { useModal } from '@/context/ModalContext';

export default function TopicDeleteButton({ id }) {
  const [isPending, startTransition] = useTransition()
  const { showModal } = useModal();

  const handleDelete = () => {
    showModal({
      title: "Delete Note",
      message: "Are you sure you want to delete this note?",
      onConfirm: async () => startTransition(async () => {
        await deleteTopicAction(id)
      }),
    });
  };

  return (
    <button onClick={handleDelete} disabled={isPending} className="btn btn-xs btn-error">
      {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Delete'}
    </button>
  )
}
