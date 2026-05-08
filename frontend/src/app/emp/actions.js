// Project: Employee Management System
// Used to manage the whole employee system

'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { employeeSchema } from './validations'
import { createEmployee, updateEmployee, deleteEmployee } from './service'

export async function createEmployeeAction(prevState, formData, isFromHook) {
  console.info("From Data", formData);
  const raw = {
    name: formData.get('name'),
    age: formData.get('age'),
    dOB: formData.get('dOB'),
    desc: formData.get('desc'),
    gender: formData.get('gender'),
    skills: formData.getAll('skills'),
    city: formData.get('city'),
    active: formData.get('active') === 'on',
  }

  const parsed = employeeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  const { name, age, dOB, desc, gender, skills, city, active } = parsed.data

  try {
    await createEmployee({ name, age, dOB, desc, gender, skills, city, active })
  } catch {
    return { success: false, message: 'Failed to create Employee. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/emp')
  redirect('/emp')
}

export async function updateEmployeeAction(id, formData) {

  console.info("Inside::updateEmployeeAction: ID", id);
  console.info("Inside::updateEmployeeAction: FormData", formData);

  const raw = formData;
  const parsed = employeeSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: parsed.error.flatten().fieldErrors,
      values: raw
    }
  }

  try {
    if (id) {
      await updateEmployee(id, parsed.data)
    } else {
      await createEmployee(parsed.data)
    }

  } catch {
    return { success: false, message: 'Failed to update Employee. Please try again.', errors: {}, values: raw }
  }

  revalidatePath('/emp')
  redirect('/emp')
}

export async function deleteEmployeeAction(id) {
  try {
    await deleteEmployee(id)
  } catch {
    return { success: false, message: 'Failed to delete Employee.' }
  }
  revalidatePath('/emp')
}
