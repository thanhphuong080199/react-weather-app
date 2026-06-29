import { useEffect, useState } from "react"
import { fetchLocationName } from "./geocoding"
import type { Coordinates } from "./types"

/**
 * Best-effort place name for the given coordinates. Failures are swallowed
 * (returns null) since the location label is non-critical decoration over the
 * weather data.
 */
export function useLocationName(coords: Coordinates | null): string | null {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (!coords) {
      setName(null)
      return
    }

    const controller = new AbortController()
    fetchLocationName(coords, controller.signal)
      .then((value) => setName(value || null))
      .catch(() => {
        if (!controller.signal.aborted) setName(null)
      })

    return () => controller.abort()
  }, [coords])

  return name
}
