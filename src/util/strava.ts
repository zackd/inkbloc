const CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET as string;
const REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI as string;

const TOKEN_URL = 'https://www.strava.com/oauth/token';

export type StravaToken = {
    accessToken: string;
    refreshToken: string;
    expiresAt: number; // unix seconds
};

export type StravaActivity = {
    id: number;
    name: string;
    type: string;
    distance: number;       // metres
    moving_time: number;    // seconds
    start_date: string;
    map: { summary_polyline: string };
};

const STORAGE_KEY = 'strava_token';

export function loadStoredToken(): StravaToken | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as StravaToken;
    } catch {
        return null;
    }
}

export function saveToken(token: StravaToken): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
}

export function clearToken(): void {
    localStorage.removeItem(STORAGE_KEY);
}

export function buildAuthUrl(): string {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        approval_prompt: 'auto',
        scope: 'activity:read_all',
    });
    return `https://www.strava.com/oauth/authorize?${params}`;
}

type TokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
};

export async function exchangeCode(code: string): Promise<StravaToken> {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        }),
    });
    if (!res.ok) {
        throw new Error(`Token exchange failed: ${res.status}`);
    }
    const data = await res.json() as TokenResponse;
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
    };
}

export async function refreshAccessToken(refreshToken: string): Promise<StravaToken> {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });
    if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
    const data = await res.json() as TokenResponse;
    return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
    };
}

export async function getActivities(accessToken: string): Promise<StravaActivity[]> {
    const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Activities fetch failed: ${res.status}`);
    return res.json() as Promise<StravaActivity[]>;
}

export async function getActivity(accessToken: string, id: number): Promise<StravaActivity> {
    const res = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Activity fetch failed: ${res.status}`);
    return res.json() as Promise<StravaActivity>;
}
