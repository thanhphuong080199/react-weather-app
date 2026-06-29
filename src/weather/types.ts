export interface Coordinates {
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
  time: string
}
