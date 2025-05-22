export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const units = [
    { max: 60, divisor: 1, singular: 'Sekunde', plural: 'Sekunden' },
    { max: 3600, divisor: 60, singular: 'Minute', plural: 'Minuten' },
    { max: 86400, divisor: 3600, singular: 'Stunde', plural: 'Stunden' },
    { max: 432000, divisor: 86400, singular: 'Tag', plural: 'Tagen' },
  ];

  for (const unit of units) {
    if (diffInSeconds < unit.max) {
      const value = Math.floor(diffInSeconds / unit.divisor);
      const word = value === 1 ? unit.singular : unit.plural;
      return `${value} ${word} her`;
    }
  }

  // Nach 5 Tagen: Datum anzeigen
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
