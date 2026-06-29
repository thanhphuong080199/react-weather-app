import { useEffect, useState } from "react"
import { fetchCurrentWeather } from "./api"
import type { Coordinates, CurrentWeather } from "./types"

interface WeatherState {
  data: CurrentWeather | null
  error: string | null
  loading: boolean
}

export function useWeather(coords: Coordinates | null): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    if (!coords) return

    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })

    fetchCurrentWeather(coords, controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof Error ? error.message : "Failed to load weather."
        setState({ data: null, error: message, loading: false })
      })

    return () => controller.abort()
  }, [coords])

  return state
}
