export function formatDistance(metres: number): string {
    return `${(metres / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${m}:${String(s).padStart(2, '0')}`;
}

export function formatSpeed(ms: number | undefined): string {
    if (ms == null) return '—';
    return `${((ms * 3600) / 1000).toFixed(1)}km/h`;
}

export function formatElevation(metres: number | undefined): string {
    if (metres == null) return '—';
    return `${Math.round(metres)}m`;
}

export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function buildElevationPath(data: number[], width: number, height: number): string {
    if (data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = Math.max(1, Math.floor(data.length / 300));
    const sampled = data.filter((_, i) => i % step === 0);
    const pts = sampled.map((v, i) => {
        const x = (i / (sampled.length - 1)) * width;
        const y = height - ((v - min) / range) * (height * 0.85);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M0,${height} L${pts.join(' L')} L${width},${height} Z`;
}
