import { formatDistanceToNow, format } from 'date-fns'

export function relativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function now(): string {
  return new Date().toISOString()
}
