import { describe, it, expect, beforeEach } from 'vitest';
import { useMapStore } from './mapStore';
import type { StravaToken, StravaActivity } from '@/util/strava';

const mockToken: StravaToken = {
    accessToken: 'access_abc123',
    refreshToken: 'refresh_xyz456',
    expiresAt: 9999999999,
};

const mockActivity: StravaActivity = {
    id: 123,
    name: 'I Got Hills',
    type: 'Run',
    distance: 9500,
    moving_time: 3634,
    start_date: '2026-05-22T09:00:00Z',
    map: { summary_polyline: '' },
    total_elevation_gain: 254,
    average_speed: 2.61,
    max_speed: 3.94,
    calories: 572,
};

function resetStore() {
    useMapStore.setState({
        coordinates: [],
        startMarker: null,
        endMarker: null,
        showStartMarker: false,
        showEndMarker: false,
        stravaToken: null,
        selectedActivityId: null,
        selectedActivity: null,
    });
}

describe('mapStore', () => {
    beforeEach(() => {
        localStorage.clear();
        resetStore();
    });

    describe('coordinates', () => {
        it('setCoordinates updates coordinates', () => {
            useMapStore.getState().setCoordinates([[51.5, -0.1]]);
            expect(useMapStore.getState().coordinates).toEqual([[51.5, -0.1]]);
        });

        it('setCoordinates replaces previous coordinates', () => {
            useMapStore.getState().setCoordinates([[51.5, -0.1]]);
            useMapStore.getState().setCoordinates([[53.0, -1.5], [54.0, -2.0]]);
            expect(useMapStore.getState().coordinates).toHaveLength(2);
        });
    });

    describe('markers', () => {
        it('toggleStartMarker flips showStartMarker', () => {
            expect(useMapStore.getState().showStartMarker).toBe(false);
            useMapStore.getState().toggleStartMarker();
            expect(useMapStore.getState().showStartMarker).toBe(true);
            useMapStore.getState().toggleStartMarker();
            expect(useMapStore.getState().showStartMarker).toBe(false);
        });

        it('toggleEndMarker flips showEndMarker', () => {
            expect(useMapStore.getState().showEndMarker).toBe(false);
            useMapStore.getState().toggleEndMarker();
            expect(useMapStore.getState().showEndMarker).toBe(true);
            useMapStore.getState().toggleEndMarker();
            expect(useMapStore.getState().showEndMarker).toBe(false);
        });

        it('toggleStartMarker and toggleEndMarker are independent', () => {
            useMapStore.getState().toggleStartMarker();
            expect(useMapStore.getState().showStartMarker).toBe(true);
            expect(useMapStore.getState().showEndMarker).toBe(false);
        });
    });

    describe('stravaToken', () => {
        it('setStravaToken updates state and persists to localStorage', () => {
            useMapStore.getState().setStravaToken(mockToken);
            expect(useMapStore.getState().stravaToken).toEqual(mockToken);
            const stored = JSON.parse(localStorage.getItem('strava_token')!);
            expect(stored).toEqual(mockToken);
        });

        it('clearStravaToken sets stravaToken to null', () => {
            useMapStore.getState().setStravaToken(mockToken);
            useMapStore.getState().clearStravaToken();
            expect(useMapStore.getState().stravaToken).toBeNull();
        });

        it('clearStravaToken removes token from localStorage', () => {
            useMapStore.getState().setStravaToken(mockToken);
            useMapStore.getState().clearStravaToken();
            expect(localStorage.getItem('strava_token')).toBeNull();
        });

        it('clearStravaToken also clears selectedActivity', () => {
            useMapStore.getState().setStravaToken(mockToken);
            useMapStore.getState().setSelectedActivity(mockActivity);
            useMapStore.getState().clearStravaToken();
            expect(useMapStore.getState().selectedActivity).toBeNull();
        });
    });

    describe('selectedActivity', () => {
        it('setSelectedActivity updates selectedActivity', () => {
            useMapStore.getState().setSelectedActivity(mockActivity);
            expect(useMapStore.getState().selectedActivity).toEqual(mockActivity);
        });

        it('setSelectedActivity can be set to null', () => {
            useMapStore.getState().setSelectedActivity(mockActivity);
            useMapStore.getState().setSelectedActivity(null);
            expect(useMapStore.getState().selectedActivity).toBeNull();
        });

        it('setSelectedActivityId and setSelectedActivity are independent', () => {
            useMapStore.getState().setSelectedActivityId(42);
            useMapStore.getState().setSelectedActivity(mockActivity);
            expect(useMapStore.getState().selectedActivityId).toBe(42);
            expect(useMapStore.getState().selectedActivity).toEqual(mockActivity);
        });
    });
});
