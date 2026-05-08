export const formatDate = (date) => {
  const d = new Date(date)
  const day   = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleString('en-GB', { month: 'short' })
  const year  = d.getFullYear()
  return `${day}-${month}-${year}`
}
