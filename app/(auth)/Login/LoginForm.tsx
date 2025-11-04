// app/(auth)/login/LoginForm.tsx
import { Ionicons } from "@expo/vector-icons"; // Iconos de ojo
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "../../../services/authService";

// Tipamos la prop onLoginSuccess
type LoginFormProps = {
  onLoginSuccess?: () => void; // opcional, para que no rompa si no se pasa
};

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // estado para mostrar contraseña

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const { access_token, usuario } = await login(correo, contraseña);

      // Guardar token y usuario
      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("usuario", JSON.stringify(usuario));

      console.log("Usuario logueado:", usuario);
      Alert.alert("Éxito", "Inicio de sesión correcto ✅");

      // Si se pasó la función onLoginSuccess, llamarla; si no, hacer router.replace como fallback
     if (onLoginSuccess) {
  onLoginSuccess();
} else {
 router.push("/home" as any);
}

    } catch (error: any) {
      Alert.alert("Error", error.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Accede a tu cuenta</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Contenedor de la contraseña con el ojo */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Contraseña"
          style={[styles.input, { flex: 1 }]}
          secureTextEntry={!showPassword}
          value={contraseña}
          onChangeText={setContraseña}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>

      

      <TouchableOpacity style={styles.link}>
        <Text style={styles.linkText}>¿No tienes cuenta? Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  eyeButton: {
    padding: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#06765C",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    color: "#06765C",
    fontSize: 14,
  },
});
