import { describe, it, expect } from 'vitest';
import {
    formatDistance,
    formatDuration,
    formatSpeed,
    formatElevation,
    buildElevationPath,
} from './format';

describe('formatDistance', () => {
    it('converts metres to km with 1 decimal place', () => {
        expect(formatDistance(9500)).toBe('9.5km');
        expect(formatDistance(1000)).toBe('1.0km');
        expect(formatDistance(500)).toBe('0.5km');
        expect(formatDistance(100)).toBe('0.1km');
    });
});

describe('formatDuration', () => {
    it('formats sub-hour durations as M:SS', () => {
        expect(formatDuration(65)).toBe('1:05');
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(3599)).toBe('59:59');
        expect(formatDuration(0)).toBe('0:00');
    });

    it('formats durations >= 1 hour as H:MM:SS', () => {
        expect(formatDuration(3600)).toBe('1:00:00');
        expect(formatDuration(3634)).toBe('1:00:34');
        expect(formatDuration(7384)).toBe('2:03:04');
    });

    it('zero-pads minutes and seconds', () => {
        expect(formatDuration(3661)).toBe('1:01:01');
    });
});

describe('formatSpeed', () => {
    it('returns an em dash for undefined', () => {
        expect(formatSpeed(undefined)).toBe('—');
    });

    it('converts m/s to km/h with 1 decimal place', () => {
        expect(formatSpeed(1)).toBe('3.6km/h');
        expect(formatSpeed(2.5)).toBe('9.0km/h');
        expect(formatSpeed(0)).toBe('0.0km/h');
    });
});

describe('formatElevation', () => {
    it('returns an em dash for undefined', () => {
        expect(formatElevation(undefined)).toBe('—');
    });

    it('rounds to the nearest metre', () => {
        expect(formatElevation(254.4)).toBe('254m');
        expect(formatElevation(254.6)).toBe('255m');
        expect(formatElevation(0)).toBe('0m');
    });
});

describe('buildElevationPath', () => {
    it('returns empty string for 0 or 1 data points', () => {
        expect(buildElevationPath([], 300, 60)).toBe('');
        expect(buildElevationPath([100], 300, 60)).toBe('');
    });

    it('produces a closed SVG path starting and ending at the bottom', () => {
        const path = buildElevationPath([100, 200, 100], 300, 60);
        expect(path).toMatch(/^M0,60 /);
        expect(path).toMatch(/ Z$/);
        expect(path).toContain('L300,60');
    });

    it('handles flat data without division by zero', () => {
        const path = buildElevationPath([100, 100, 100], 300, 60);
        expect(path).not.toBe('');
        expect(path).toMatch(/^M0,60 /);
    });

    it('peaks are higher (lower y value) than troughs', () => {
        // data: trough, peak, trough — peak maps to smallest y in SVG coords
        const path = buildElevationPath([0, 100, 0], 300, 60);
        const allY = [...path.matchAll(/[\d.]+,([\d.]+)/g)].map((m) => parseFloat(m[1]));
        // Peak at 100% of range → y = height - height*0.85 = height*0.15 = 9
        expect(Math.min(...allY)).toBeLessThan(30);
    });

    it('downsamples large datasets to at most ~300 points', () => {
        const data = Array.from({ length: 900 }, (_, i) => Math.sin(i) * 100 + 200);
        const path = buildElevationPath(data, 300, 60);
        // step = floor(900/300) = 3, so ~300 sampled points
        const pointCount = (path.match(/L/g) ?? []).length;
        expect(pointCount).toBeLessThanOrEqual(302); // sampled points + 2 closing L commands
    });
});
