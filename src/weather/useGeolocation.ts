import { useEffect, useState } from "react"
import type { Coordinates } from "./types"

interface GeolocationState {
  coords: Coordinates | null
  error: string | null
  loading: boolean
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({
        coords: null,
        error: "Geolocation is not supported by your browser.",
        loading: false,
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        })
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied. Please allow access to see local weather."
            : "Unable to determine your location."
        setState({ coords: null, error: message, loading: false })
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  return state
}
