export function formatDate(dateString, t) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  const units = [
    { key: 'seconds', max: 60, divisor: 1 },
    { key: 'minutes', max: 3600, divisor: 60 },
    { key: 'hours', max: 86400, divisor: 3600 },
    { key: 'days', max: 432000, divisor: 86400 }
  ]

  for (const unit of units) {
    if (diff < unit.max) {
      const n = Math.floor(diff / unit.divisor)
      const pluralKey = n === 1 ? 'one' : 'other'
      return t(`time.${unit.key}.${pluralKey}`, { n })
    }
  }

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
