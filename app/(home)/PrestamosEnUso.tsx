// app/(home)/PrestamosEnUso.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { getPrestamosEnUso, Prestamo } from "../../services/prestadosService";

export default function PrestamosEnUsoScreen() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("usuario");
        const id_usuario = storedUser ? JSON.parse(storedUser).id_usuario : null;

        if (!id_usuario) {
          setError("No se encontró el ID del usuario.");
          return;
        }

        const data = await getPrestamosEnUso(id_usuario);
        setPrestamos(data.prestamos);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los préstamos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06765C" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </View>
    );

  const renderItem = ({ item }: { item: Prestamo }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Clase:</Text>
        <Text style={styles.value}>{item.clase}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Marca:</Text>
        <Text style={styles.value}>{item.marca}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Calibre:</Text>
        <Text style={styles.value}>{item.calibre}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Serie:</Text>
        <Text style={styles.value}>{item.serie}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Estado:</Text>
        <Text
          style={[
            styles.value,
            {
              color: item.estado === "en uso" ? "#06765C" : "#d32f2f",
              fontWeight: "bold",
            },
          ]}
        >
          {item.estado.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Préstamos en Uso</Text>
      <Text style={styles.badge}>{prestamos.length}</Text>

      <FlatList
        data={prestamos}
        keyExtractor={(item) => item.id_prestamo.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay préstamos en uso</Text>}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0f2f1", // fondo suave
    paddingTop: 75,             // espacio superior
    paddingHorizontal: 25,      // separación lateral
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#06765C",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#06765C",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    borderRadius: 50,
    width: 40,
    height: 40,
    lineHeight: 40,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 5, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontWeight: "500",
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    marginTop: 20,
  },
});
