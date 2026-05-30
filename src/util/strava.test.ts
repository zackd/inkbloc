import { describe, it, expect, beforeEach } from 'vitest';
import { loadStoredToken, saveToken, clearToken } from './strava';
import type { StravaToken } from './strava';

const mockToken: StravaToken = {
    accessToken: 'access_abc123',
    refreshToken: 'refresh_xyz456',
    expiresAt: 9999999999,
};

describe('saveToken / loadStoredToken / clearToken', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('loadStoredToken returns null when nothing is stored', () => {
        expect(loadStoredToken()).toBeNull();
    });

    it('saveToken persists the token and loadStoredToken retrieves it', () => {
        saveToken(mockToken);
        expect(loadStoredToken()).toEqual(mockToken);
    });

    it('clearToken removes the stored token', () => {
        saveToken(mockToken);
        clearToken();
        expect(loadStoredToken()).toBeNull();
    });

    it('loadStoredToken returns null for malformed JSON', () => {
        localStorage.setItem('strava_token', 'not valid json {{{');
        expect(loadStoredToken()).toBeNull();
    });

    it('saveToken overwrites a previously stored token', () => {
        saveToken(mockToken);
        const updatedToken: StravaToken = { ...mockToken, accessToken: 'new_access' };
        saveToken(updatedToken);
        expect(loadStoredToken()?.accessToken).toBe('new_access');
    });
});
