import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchableDropdown } from '@luciodale/react-searchable-dropdown';
import type { TObjectDropdownOption } from '@luciodale/react-searchable-dropdown';
import '@luciodale/react-searchable-dropdown/dist/assets/single-style.css';
import { useMapStore } from '@/components/mapStore';
import { buildAuthUrl, getActivities, getActivity, refreshAccessToken } from '@/util/strava';
import type { StravaActivity } from '@/util/strava';
import { decode as decodePolyline } from '@googlemaps/polyline-codec';

const STRAVA_URL_RE = /strava\.com\/activities\/(\d+)/;

function toOption(a: StravaActivity): TObjectDropdownOption {
    return { label: a.name, value: String(a.id) };
}

export function Activities() {
    const stravaToken = useMapStore((state) => state.stravaToken);
    const setStravaToken = useMapStore((state) => state.setStravaToken);
    const clearStravaToken = useMapStore((state) => state.clearStravaToken);
    const setSelectedActivityId = useMapStore((state) => state.setSelectedActivityId);
    const setCoordinates = useMapStore((state) => state.setCoordinates);

    const [dropdownValue, setDropdownValue] = useState<TObjectDropdownOption | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const [urlActivityId, setUrlActivityId] = useState<number | null>(null);

    const getToken = async () => {
        if (!stravaToken) throw new Error('No token');
        let token = stravaToken;
        if (token.expiresAt < Date.now() / 1000) {
            token = await refreshAccessToken(token.refreshToken);
            setStravaToken(token);
        }
        return token;
    };

    const { data: activities, isLoading, isError } = useQuery({
        queryKey: ['strava-activities'],
        enabled: stravaToken !== null,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const token = await getToken();
            return getActivities(token.accessToken);
        },
    });

    const { data: fetchedActivity, isLoading: isFetchingUrl, isError: isFetchUrlError } = useQuery({
        queryKey: ['strava-activity', urlActivityId],
        enabled: urlActivityId !== null && stravaToken !== null,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const token = await getToken();
            return getActivity(token.accessToken, urlActivityId!);
        },
    });

    useEffect(() => {
        if (!fetchedActivity) return;
        setDropdownValue(toOption(fetchedActivity));
        setSelectedActivityId(fetchedActivity.id);
        setCoordinates(decodePolyline(fetchedActivity.map.summary_polyline));
        setSearchQuery(undefined);
        setUrlActivityId(null);
    }, [fetchedActivity]);

    const handleSetValue = (option: TObjectDropdownOption) => {
        const activity = activities?.find((a) => String(a.id) === option.value);
        if (!activity) return;
        setDropdownValue(option);
        setSelectedActivityId(activity.id);
        setCoordinates(decodePolyline(activity.map.summary_polyline));
    };

    const handleSearchQueryChange = (q: string | undefined) => {
        setSearchQuery(q);
        if (!q) {
            setUrlActivityId(null);
            return;
        }
        const match = STRAVA_URL_RE.exec(q);
        if (!match) {
            setUrlActivityId(null);
            return;
        }
        const id = Number(match[1]);
        const found = activities?.find((a) => a.id === id);
        if (found) {
            setDropdownValue(toOption(found));
            setSelectedActivityId(found.id);
            setCoordinates(decodePolyline(found.map.summary_polyline));
            setSearchQuery(undefined);
        } else {
            setUrlActivityId(id);
        }
    };

    if (stravaToken === null) {
        return (
            <div className="toolbar-panel">
                <h2 className="title">Add Strava Activities</h2>
                <button className="strava-connect-btn" onClick={() => { window.location.href = buildAuthUrl(); }}>
                    Connect with <span className="strava-connect-btn__brand">Strava</span>
                </button>
            </div>
        );
    }

    return (
        <div className="toolbar-panel">
            <div className="toolbar-panel-header">
                <h2 className="title">Strava Activities</h2>
            </div>
            {isLoading && <p className="placeholder">Loading activities…</p>}
            {isError && <p className="placeholder">Failed to load activities.</p>}
            {isFetchingUrl && <p className="placeholder">Loading activity…</p>}
            {isFetchUrlError && <p className="placeholder">Could not load that activity.</p>}
            {activities && (
                <SearchableDropdown
                    options={activities.map(toOption)}
                    value={dropdownValue}
                    setValue={handleSetValue}
                    searchOptionKeys={['label']}
                    searchQuery={searchQuery}
                    onSearchQueryChange={handleSearchQueryChange}
                    createNewOptionIfNoMatch={false}
                    dropdownOptionNoMatchLabel="No Match"
                    placeholder="Search or paste a Strava link…"
                    classNameSearchableDropdownContainer="xsa-container"
                    classNameSearchQueryInput="xsa-input"
                    classNameDropdownOptions="xsa-options"
                    classNameDropdownOption="xsa-option"
                    classNameDropdownOptionFocused="xsa-option-focused"
                    classNameDropdownOptionSelected="xsa-option-selected"
                    classNameDropdownOptionLabel="xsa-option-label"
                    classNameDropdownOptionLabelFocused="xsa-option-label-focused"
                    classNameDropdownOptionNoMatch="xsa-option-no-match"
                />
            )}
            <div className="toolbar-panel-footer">
                <button className="strava-disconnect" onClick={clearStravaToken}>Logout from Strava</button>
            </div>
        </div>
    );
}
