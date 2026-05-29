import { Map } from '@/components/Map';
import { Activities } from '@/components/toolbar/Activities';
import { Frame } from '@/components/toolbar/Frame';
import { Markers } from '@/components/toolbar/Markers';
import { ActivityDetails } from '@/components/ActivityDetails';
import { useMapStore } from '@/components/mapStore';

export function Editor() {
    const selectedActivity = useMapStore((state) => state.selectedActivity);
    const stravaToken = useMapStore((state) => state.stravaToken);

    return (
        <>
            <div className="map-container">
                <Map />
                {selectedActivity && stravaToken && (
                    <ActivityDetails
                        activity={selectedActivity}
                        accessToken={stravaToken.accessToken}
                    />
                )}
            </div>
            <div className="editor-toolbar">
                <Activities />
                <Frame />
                <Markers />
            </div>
        </>
    );
}
