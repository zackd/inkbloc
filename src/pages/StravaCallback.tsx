import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCode } from '@/util/strava';
import { useMapStore } from '@/components/mapStore';

export function StravaCallback() {
    const navigate = useNavigate();
    const setStravaToken = useMapStore((state) => state.setStravaToken);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) {
            navigate('/');
            return;
        }
        exchangeCode(code).then((token) => {
            setStravaToken(token);
            navigate('/');
        }).catch(() => {
            navigate('/');
        });
    }, []);

    return <p>Connecting to Strava…</p>;
}
