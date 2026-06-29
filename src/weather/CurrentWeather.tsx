import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { describeWeather } from "./weatherCodes"
import { useGeolocation } from "./useGeolocation"
import { useLocationName } from "./useLocationName"
import { useWeather } from "./useWeather"

export function CurrentWeather() {
  const geo = useGeolocation()
  const weather = useWeather(geo.coords)
  const locationName = useLocationName(geo.coords)

  if (geo.loading) {
    return <StatusMessage spinner>Finding your location…</StatusMessage>
  }

  if (geo.error) {
    return <StatusMessage tone="error">{geo.error}</StatusMessage>
  }

  if (weather.loading) {
    return <StatusMessage spinner>Loading current weather…</StatusMessage>
  }

  if (weather.error) {
    return <StatusMessage tone="error">{weather.error}</StatusMessage>
  }

  if (!weather.data) return null

  const { temperature, apparentTemperature, humidity, windSpeed, weatherCode } =
    weather.data
  const { label, emoji } = describeWeather(weatherCode)

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderRadius="xl"
      p={{ base: 6, md: 8 }}
      shadow="sm"
    >
      <Stack gap={6}>
        <Stack gap={1} textAlign="center">
          {locationName && (
            <Text fontSize="sm" fontWeight="medium" color="fg.muted">
              📍 {locationName}
            </Text>
          )}
          <Text fontSize="5xl" lineHeight="1">
            {emoji}
          </Text>
          <Heading size="3xl">{Math.round(temperature)}°C</Heading>
          <Text color="fg.muted">{label}</Text>
          <Text fontSize="sm" color="fg.muted">
            Feels like {Math.round(apparentTemperature)}°C
          </Text>
        </Stack>

        <SimpleGrid columns={2} gap={4}>
          <Detail label="Humidity" value={`${Math.round(humidity)}%`} />
          <Detail label="Wind" value={`${Math.round(windSpeed)} km/h`} />
        </SimpleGrid>
      </Stack>
    </Box>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <Box bg="bg.subtle" borderRadius="md" p={3} textAlign="center">
      <Text fontSize="xs" color="fg.muted" textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize="lg" fontWeight="semibold">
        {value}
      </Text>
    </Box>
  )
}

function StatusMessage({
  children,
  spinner,
  tone,
}: {
  children: React.ReactNode
  spinner?: boolean
  tone?: "error"
}) {
  return (
    <HStack
      justify="center"
      gap={3}
      py={8}
      color={tone === "error" ? "fg.error" : "fg.muted"}
    >
      {spinner && <Spinner size="sm" />}
      <Text>{children}</Text>
    </HStack>
  )
}
