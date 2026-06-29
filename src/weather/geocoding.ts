import type { Coordinates } from "./types"

interface ReverseGeocodeResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
}

/**
 * Reverse-geocodes coordinates into a human-readable place name using
 * BigDataCloud's free, keyless client-side endpoint. Best-effort: returns
 * a "City, Country" string, falling back through coarser fields.
 */
export async function fetchLocationName(
  { latitude, longitude }: Coordinates,
  signal?: AbortSignal,
): Promise<string> {
  const url = new URL(
    "https://api.bigdatacloud.net/data/reverse-geocode-client",
  )
  url.searchParams.set("latitude", String(latitude))
  url.searchParams.set("longitude", String(longitude))
  url.searchParams.set("localityLanguage", "en")

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Reverse geocoding failed (${response.status})`)
  }

  const data = (await response.json()) as ReverseGeocodeResponse
  const place = data.city || data.locality || data.principalSubdivision
  return [place, data.countryName].filter(Boolean).join(", ")
}
