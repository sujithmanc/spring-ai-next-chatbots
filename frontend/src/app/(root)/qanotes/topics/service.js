// Project: Flash card Topics
// Used to manage the whole employee system

import { findAll, findById, insert, update, remove } from './repository'

export async function getAllTopics() {
  return findAll()
}

export async function getTopicById(id) {
  const record = await findById(Number(id))
  if (!record) throw new Error('Topic not found')
  return record
}

export async function createTopic(data) {
  return insert(data)
}

export async function updateTopic(id, data) {
  await getTopicById(id)
  return update(Number(id), data)
}

export async function deleteTopic(id) {
  await getTopicById(id)
  return remove(Number(id))
}
