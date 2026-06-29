import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react"

function App() {
  return (
    <Box minH="100dvh" bg="bg.subtle" py={{ base: 8, md: 16 }}>
      <Container maxW="md">
        <Stack gap={4} textAlign="center">
          <Heading size="2xl">🌤️ Weather App</Heading>
          <Text color="fg.muted">
            Built with Vite + React + Chakra UI. Current conditions and 7-day
            forecasts, powered by Open-Meteo.
          </Text>
          <Text fontSize="sm" color="fg.muted">
            Search and forecast features coming next.
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
