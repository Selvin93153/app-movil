import { Ionicons } from "@expo/vector-icons"; // Para los íconos de ojo
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { changePassword, getUsuarioById } from "../../services/profileService";

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estados para toggle de visibilidad
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");
      const storedUser = JSON.parse(await AsyncStorage.getItem("usuario") || "{}");

      if (!token || !storedUser.id_usuario) {
        setError("No se encontró información del usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await getUsuarioById(storedUser.id_usuario, token);
        setUsuario(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");
    router.replace("/(auth)/Login");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    try {
      const res = await changePassword(currentPassword, newPassword);
      setSuccessMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  if (loading) return <Text style={styles.center}>Cargando...</Text>;
  if (error) return <Text style={styles.center}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{usuario.nombres} {usuario.apellidos}</Text>
        <Text style={styles.subtitle}>{usuario.correo}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>NIP:</Text>
          <Text style={styles.info}>{usuario.nip}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.info}>{usuario.rol?.nombre_rol}</Text>
        </View>

        <Button
          title={showChangePassword ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
          onPress={() => setShowChangePassword(!showChangePassword)}
          color="#06765C"
        />

        {showChangePassword && (
          <View style={styles.form}>
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            {/* Contraseña actual */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Contraseña actual"
                secureTextEntry={!showCurrent}
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>
                <Ionicons name={showCurrent ? "eye" : "eye-off"} size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Nueva contraseña */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Nueva contraseña"
                secureTextEntry={!showNew}
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                <Ionicons name={showNew ? "eye" : "eye-off"} size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Confirmar nueva contraseña */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirmar nueva contraseña"
                secureTextEntry={!showConfirm}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                <Ionicons name={showConfirm ? "eye" : "eye-off"} size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <Button title="Guardar cambios" onPress={handlePasswordChange} color="#4CAF50" />
          </View>
        )}

        <View style={styles.logoutButton}>
          <Button title="Cerrar sesión" color="#FF4D4D" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f4f8",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 50,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center", color: "#555" },
  infoContainer: { flexDirection: "row", marginBottom: 10 },
  label: { fontWeight: "bold", marginRight: 5, color: "#333" },
  info: { color: "#666" },
  form: { marginVertical: 15 },
  passwordContainer: {
    position: "relative",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    paddingRight: 40, // espacio para el ícono
    backgroundColor: "#f9f9f9",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  success: { color: "green", marginBottom: 10, textAlign: "center" },
  logoutButton: { marginTop: 25 },
});
