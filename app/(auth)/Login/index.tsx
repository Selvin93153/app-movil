import React from "react";
import { View } from "react-native";
import LoginForm from "./LoginForm";
import { router } from "expo-router";

export default function LoginScreen() {
  // Cuando el login sea exitoso, navega al Home
  const handleLoginSuccess = () => {
    router.push("/home" as any);
 // o la ruta que tengas para después del login
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </View>
  );
}
