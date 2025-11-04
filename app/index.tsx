// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  // Cuando abras la app, redirige automáticamente al Login
  return <Redirect href="/(auth)/Login" />;
}
