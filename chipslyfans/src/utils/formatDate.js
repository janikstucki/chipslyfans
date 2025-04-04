export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return `${Math.floor(diff)} Sekunden her`;
    if (diff < 3600) return `${Math.floor(diff / 60)} Minuten her`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} Stunden her`;
    if (diff < 432000) return `${Math.floor(diff / 86400)} Tagen her`;
    
    // Nach 5 Tagen als Datum anzeigen
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}