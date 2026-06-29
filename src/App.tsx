import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react"
import { CurrentWeather } from "./weather/CurrentWeather"

function App() {
  return (
    <Box minH="100dvh" bg="bg.subtle" py={{ base: 8, md: 16 }}>
      <Container maxW="md">
        <Stack gap={6}>
          <Stack gap={2} textAlign="center">
            <Heading size="2xl">🌤️ Weather App</Heading>
            <Text color="fg.muted">
              Current conditions for your location, powered by Open-Meteo.
            </Text>
          </Stack>
          <CurrentWeather />
        </Stack>
      </Container>
    </Box>
  )
}

export default App
