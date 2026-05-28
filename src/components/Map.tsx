import { useEffect, useRef } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { useMapStore, defaultMarker } from '@/components/mapStore';

const MAPBOXGL_ACCESS_TOKEN = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN as string;

mapboxgl.accessToken = MAPBOXGL_ACCESS_TOKEN;

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapLoaded = useRef(false);
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const endMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const coordinates = useMapStore((state) => state.coordinates);
  const showStartMarker = useMapStore((state) => state.showStartMarker);
  const showEndMarker = useMapStore((state) => state.showEndMarker);

  // Init map once with empty track source
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/xackd/cmj0f820e007701s2353nh9wp',
      center: [-2.5578, 54.5074], // TODO: set initial lat, lon from user location
      zoom: 5,
    });

    map.current.on('load', () => {
      map.current!.addSource('gpx-track', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
      });

      map.current!.addLayer({
        id: 'gpx-track-line',
        type: 'line',
        source: 'gpx-track',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#ff5500', 'line-width': 3 },
      });

      mapLoaded.current = true;
    });

    return () => {
      map.current?.remove();
      map.current = null;
      mapLoaded.current = false;
    };
  }, []);

  // Update track whenever coordinates change
  useEffect(() => {
    if (!mapLoaded.current || !map.current) return;
    if (coordinates.length === 0) return;

    const lineCoords = coordinates.map((c) => [c[1], c[0]]);

    (map.current.getSource('gpx-track') as GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: lineCoords },
    });

    // Reposition start/end markers
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    if (!startMarkerRef.current) {
      startMarkerRef.current = new mapboxgl.Marker(defaultMarker)
    }
    startMarkerRef.current.setLngLat([first[1], first[0]]);
    if (showStartMarker) startMarkerRef.current.addTo(map.current);

    if (!endMarkerRef.current) {
      endMarkerRef.current = new mapboxgl.Marker(defaultMarker);
    }
    endMarkerRef.current.setLngLat([last[1], last[0]]);
    if (showEndMarker) endMarkerRef.current.addTo(map.current);

    // Fit map to track
    const bounds = new mapboxgl.LngLatBounds();
    lineCoords.forEach((c) => bounds.extend(c as [number, number]));
    map.current.fitBounds(bounds, { padding: 50, duration: 0 });
  }, [coordinates]);

  // Toggle start marker visibility
  useEffect(() => {
    if (!startMarkerRef.current || !map.current) {
      return;
    }
    if (showStartMarker) {
      startMarkerRef.current.addTo(map.current);
    } else {
      startMarkerRef.current.remove();
    }
  }, [showStartMarker]);

  // Toggle end marker visibility
  useEffect(() => {
    if (!endMarkerRef.current || !map.current) {
      return;
    }
    if (showEndMarker) {
      endMarkerRef.current.addTo(map.current);
    } else {
      endMarkerRef.current.remove();
    }
  }, [showEndMarker]);

  return <div ref={mapContainer} className="map" />;
}
