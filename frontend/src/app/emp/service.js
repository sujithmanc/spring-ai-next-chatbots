// Project: Employee Management System
// Used to manage the whole employee system

import { findAll, findById, insert, update, remove } from './repository'

export async function getAllEmployees() {
  return findAll()
}

export async function getEmployeeById(id) {
  const record = await findById(Number(id))
  if (!record) throw new Error('Employee not found')
  return record
}

export async function createEmployee(data) {
  return insert(data)
}

export async function updateEmployee(id, data) {
  await getEmployeeById(id)
  return update(Number(id), data)
}

export async function deleteEmployee(id) {
  await getEmployeeById(id)
  return remove(Number(id))
}
