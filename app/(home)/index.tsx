import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            try {
              // Eliminar token y usuario guardados
              await AsyncStorage.multiRemove(["token", "usuario"]);

              // Redirigir al login
              router.replace("/(auth)/Login");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
              Alert.alert(
                "Error",
                "No se pudo cerrar la sesión correctamente."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f4f8" }}>
      <View style={styles.container}>
        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesion</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🏠 Bienvenido</Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(home)/Perfil")}
          >
            <Text style={styles.cardTitle}>👤 Perfil</Text>
            <Text style={styles.cardDesc}>Ver y editar tus datos personales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(home)/AsignadosPropio")}
          >
            <Text style={styles.cardTitle}>📦 Equipos Cargados</Text>
            <Text style={styles.cardDesc}>Consulta los equipos registrados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(home)/PrestamosEnUso")}
          >
            <Text style={styles.cardTitle}>🔧 Equipo Prestado</Text>
            <Text style={styles.cardDesc}>Revisa tus equipos en préstamo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/(home)/Reportes")}
          >
            <Text style={styles.cardTitle}>📋 Reportes</Text>
            <Text style={styles.cardDesc}>
              Publica algún error o percance
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  logoutButton: {
    position: "absolute",
    top: 75,
    left: 230,
    backgroundColor: "#ff4d4d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50, 
    marginBottom: 0,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
  },
});
