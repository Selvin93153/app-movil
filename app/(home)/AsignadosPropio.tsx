import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { EquipoAsignado, getMisEquipos } from "../../services/equiposService";

export default function AsignadosPropioScreen() {
  const [equipos, setEquipos] = useState<EquipoAsignado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await getMisEquipos();
        setEquipos(data.equipos);
      } catch (err: any) {
        setError(err.message || "Error al cargar equipos");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  if (loading)
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#06765C" />
      </View>
    );

  if (error) return <Text style={styles.centerText}>{error}</Text>;
  if (equipos.length === 0) return <Text style={styles.centerText}>No hay equipos asignados</Text>;

  const renderItem = ({ item }: { item: EquipoAsignado }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.clase} - {item.serie}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Marca:</Text>
        <Text style={styles.value}>{item.marca || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Calibre:</Text>
        <Text style={styles.value}>{item.calibre || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{item.tipo?.nombre || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Usuario:</Text>
        <Text style={styles.value}>{item.usuario?.nombres} {item.usuario?.apellidos}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Estado:</Text>
        <Text
          style={[
            styles.value,
            item.estado === "guardado"
              ? { color: "green", fontWeight: "700" }
              : item.estado === "en uso"
              ? { color: "red", fontWeight: "700" }
              : {},
          ]}
        >
          {item.estado}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Mis Equipos Asignados</Text>
      <FlatList
        data={equipos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_asignacion.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 75, // triple margen superior
    paddingHorizontal: 30, // margen lateral
    paddingBottom: 20,
    backgroundColor: "#e0f2f1", // color de fondo general
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f2f1", // mismo fondo general
    marginTop: 75, // triple margen superior
    paddingHorizontal: 20,
  },
  centerText: {
    textAlign: "center",
    marginTop: 75, // triple margen superior
    fontSize: 16,
    color: "#777",
    paddingHorizontal: 20,
    backgroundColor: "#e0f2f1", // fondo general
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#06765C",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    fontSize: 14,
  },
  value: {
    fontWeight: "500",
    color: "#333",
    fontSize: 14,
  },
});
