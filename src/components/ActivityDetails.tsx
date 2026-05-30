import { useQuery } from '@tanstack/react-query';
import type { StravaActivity } from '@/util/strava';
import { getActivityStreams } from '@/util/strava';
import {
    formatDistance,
    formatDuration,
    formatSpeed,
    formatElevation,
    formatDate,
    buildElevationPath,
} from '@/util/format';

type Props = {
    activity: StravaActivity;
    accessToken: string;
};

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
