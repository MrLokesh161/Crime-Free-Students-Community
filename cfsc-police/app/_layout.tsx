import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="studentform" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="staffhome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
      <Stack.Screen name="location" />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="red" options={{ headerShown: false }} />
      <Stack.Screen name="assignDuty" options={{ headerShown: false }} />
      <Stack.Screen name="selfAssignTask" options={{ headerShown: false }} />
      <Stack.Screen name="feedback" options={{ headerShown: false }} />
      <Stack.Screen name="broadcast" options={{ headerShown: false }} />
    </Stack>
  );
}
