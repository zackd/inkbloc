import { Map } from '@/components/Map';
import { Activities } from '@/components/toolbar/Activities';
import { Frame } from '@/components/toolbar/Frame';
import { Markers } from '@/components/toolbar/Markers';

export function Editor() {
    return (
        <>
            <Map />
            <div className="editor-toolbar">
                <Activities />
                <Frame />
                <Markers />
            </div>
        </>
    );
}
