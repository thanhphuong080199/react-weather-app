import type { Coordinates, CurrentWeather } from "./types"

interface OpenMeteoResponse {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
}

export async function fetchCurrentWeather(
  { latitude, longitude }: Coordinates,
  signal?: AbortSignal,
): Promise<CurrentWeather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", String(latitude))
  url.searchParams.set("longitude", String(longitude))
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
  )

  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`)
  }

  const data = (await response.json()) as OpenMeteoResponse
  const c = data.current
  return {
    time: c.time,
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
  }
}
