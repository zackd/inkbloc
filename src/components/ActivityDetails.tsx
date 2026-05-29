import { useQuery } from '@tanstack/react-query';
import type { StravaActivity } from '@/util/strava';
import { getActivityStreams } from '@/util/strava';

type Props = {
    activity: StravaActivity;
    accessToken: string;
};

function formatDistance(metres: number): string {
    return `${(metres / 1000).toFixed(1)}km`;
}

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${m}:${String(s).padStart(2, '0')}`;
}

function formatSpeed(ms: number | undefined): string {
    if (ms == null) return '—';
    return `${((ms * 3600) / 1000).toFixed(1)}km/h`;
}

function formatElevation(metres: number | undefined): string {
    if (metres == null) return '—';
    return `${Math.round(metres)}m`;
}

function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function buildElevationPath(data: number[], width: number, height: number): string {
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

function ElevationChart({ data }: { data: number[] }) {
    const W = 300;
    const H = 60;
    if (data.length < 2) {
        return <div className="elevation-chart elevation-chart--empty" />;
    }
    return (
        <svg
            className="elevation-chart"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path d={buildElevationPath(data, W, H)} />
        </svg>
    );
}

function StatItem({ value, label }: { value: string; label: string }) {
    return (
        <div className="stat-item">
            <span className="stat-item__value">{value}</span>
            <span className="stat-item__label">{label}</span>
        </div>
    );
}

export function ActivityDetails({ activity, accessToken }: Props) {
    const { data: streams } = useQuery({
        queryKey: ['strava-streams', activity.id],
        staleTime: 10 * 60 * 1000,
        queryFn: () => getActivityStreams(accessToken, activity.id),
    });

    const altitudeData = streams?.altitude?.data ?? [];

    return (
        <div className="activity-details">
            <ElevationChart data={altitudeData} />
            <div className="activity-details__body">
                <h2 className="activity-details__name">{activity.name}</h2>
                <p className="activity-details__date">{formatDate(activity.start_date)}</p>
                <div className="activity-details__stats">
                    <StatItem value={formatDistance(activity.distance)} label="Distance" />
                    <StatItem value={formatDuration(activity.moving_time)} label="Time" />
                    <StatItem value={formatElevation(activity.total_elevation_gain)} label="Elev Gain" />
                    <StatItem value={formatSpeed(activity.average_speed)} label="Avg Speed" />
                    <StatItem value={formatSpeed(activity.max_speed)} label="Max Speed" />
                    <StatItem
                        value={activity.calories != null ? String(activity.calories) : '—'}
                        label="Calories"
                    />
                </div>
            </div>
        </div>
    );
}
