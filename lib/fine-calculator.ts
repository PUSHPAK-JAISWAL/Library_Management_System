export const FINE_RATE = 10 // ₹10 per day
export const GRACE_PERIOD = 7 // 7 days grace period

export function calculateFine(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  const daysOverdue = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))

  // Fine starts after grace period
  if (daysOverdue > GRACE_PERIOD) {
    return (daysOverdue - GRACE_PERIOD) * FINE_RATE
  }

  return 0
}

export function getDaysOverdue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  return Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date()
  const due = new Date(dueDate)
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}
