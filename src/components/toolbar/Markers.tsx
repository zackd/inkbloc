import { useMapStore } from '@/components/mapStore';

export function Markers() {

  const showStartMarker = useMapStore((state) => state.showStartMarker)
  const toggleStartMarker = useMapStore((state) => state.toggleStartMarker)

  const showEndMarker = useMapStore((state) => state.showEndMarker)
  const toggleEndMarker = useMapStore((state) => state.toggleEndMarker)

    return (
        <div className='toolbar-panel'>
            <h2 className="title">Markers</h2>

            <button onClick={toggleStartMarker}>{showStartMarker ? 'Hide' : 'Show'} Start Marker</button>
            <button onClick={toggleEndMarker}>{showEndMarker ? 'Hide' : 'Show'} End Marker</button>
        </div>
    )
}
