import { create } from 'zustand'
import { LatLngTuple } from "@googlemaps/polyline-codec";
import { StravaToken, loadStoredToken, saveToken, clearToken } from '@/util/strava'

export type Marker = {
    color: string
}

export const defaultMarker = { color: '#0F0' }

interface MapStore {
    coordinates: LatLngTuple[]
    startMarker: Marker | null
    endMarker: Marker | null
    showStartMarker: boolean
    showEndMarker: boolean
    stravaToken: StravaToken | null
    selectedActivityId: number | null
    setCoordinates: (coordinates: LatLngTuple[]) => void
    setStartMarker: (marker: Marker) => void
    setEndMarker: (marker: Marker) => void
    toggleStartMarker: () => void
    toggleEndMarker: () => void
    setStravaToken: (token: StravaToken) => void
    clearStravaToken: () => void
    setSelectedActivityId: (id: number | null) => void
}

export const useMapStore = create<MapStore>((set) => ({

    coordinates: [],
    startMarker: null,
    endMarker: null,
    showStartMarker: false,
    showEndMarker: false,
    stravaToken: loadStoredToken(),
    selectedActivityId: null,

    setCoordinates: (coordinates) => set({ coordinates }),
    setStartMarker: (marker) => set({ startMarker: marker }),
    setEndMarker: (marker) => set({ endMarker: marker }),
    toggleStartMarker: () => set((state) => ({ showStartMarker: !state.showStartMarker })),
    toggleEndMarker: () => set((state) => ({ showEndMarker: !state.showEndMarker })),
    setStravaToken: (token) => { saveToken(token); set({ stravaToken: token }); },
    clearStravaToken: () => { clearToken(); set({ stravaToken: null }); },
    setSelectedActivityId: (id) => set({ selectedActivityId: id }),

}))

