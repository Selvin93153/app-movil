// app/(home)/Reportes.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addReporte,
  getReportes,
  marcarReporteVisto,
  updateReporte,
  type Reporte,
  type Usuario,
} from "../../services/reportesService";

export default function ReportesScreen() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalDetalle, setModalDetalle] = useState<Reporte | null>(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState<Reporte | null>(null);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setLoading(true);
    try {
      const data = await getReportes();
      setReportes(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar reportes.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerReporte = async (reporte: Reporte) => {
    setModalDetalle(reporte);

    if (!(reporte as any).visto) {
      try {
        await marcarReporteVisto(reporte.id_reporte);
        cargarReportes();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditarReporte = (reporte: Reporte) => {
    setModalEditar(reporte);
    setEditTitulo(reporte.titulo);
    setEditDescripcion(reporte.descripcion || "");
  };

  const guardarEdicion = async () => {
    if (!modalEditar) return;
    try {
      await updateReporte(modalEditar.id_reporte, {
        titulo: editTitulo,
        descripcion: editDescripcion,
      });
      setModalEditar(null);
      cargarReportes();
    } catch (err) {
      console.error(err);
    }
  };

  const crearNuevoReporte = async () => {
    if (!nuevoTitulo) return Alert.alert("Error", "Debe ingresar un título");
    try {
      const storedUser = await AsyncStorage.getItem("usuario");
      const id_usuario = storedUser ? JSON.parse(storedUser).id_usuario : null;
      if (!id_usuario) {
        Alert.alert("Error", "No se encontró un usuario en sesión.");
        return;
      }

      await addReporte({
        id_usuario,
        titulo: nuevoTitulo,
        descripcion: nuevaDescripcion,
      });
      setNuevoTitulo("");
      setNuevaDescripcion("");
      setModalNuevo(false);
      cargarReportes();
    } catch (err) {
      console.error(err);
    }
  };

  const renderItem = ({ item }: { item: Reporte }) => {
    const usuario = item.id_usuario as Usuario;
    const colorFondo = (item as any).visto ? "#c6f7f3ff" : "#fbeec6ff";

    return (
      <View style={[styles.card, { backgroundColor: colorFondo }]}>
        <Text style={styles.cardTitulo}>{item.titulo}</Text>
        <Text style={styles.cardInfo}>Enviado por: {usuario?.nombres} {usuario?.apellidos}</Text>
        <Text style={styles.cardInfo}>
          Fecha: {new Date(item.fecha_creacion).toLocaleDateString()}
        </Text>
        <Text style={[styles.cardEstado, { color: (item as any).visto ? "#06765C" : "#d32f2f" }]}>
          {(item as any).visto ? "VISTO" : "NUEVO"}
        </Text>
        <View style={styles.botonesRow}>
          <TouchableOpacity style={styles.boton} onPress={() => handleVerReporte(item)}>
            <Text style={styles.botonText}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton, styles.botonEditar]} onPress={() => handleEditarReporte(item)}>
            <Text style={styles.botonText}>Editar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06765C" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>📋 Reportes</Text>
        <TouchableOpacity style={styles.botonNuevo} onPress={() => setModalNuevo(true)}>
          <Text style={styles.botonText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id_reporte.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal Detalle */}
      <Modal visible={!!modalDetalle} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitulo}>{modalDetalle?.titulo}</Text>
              <Text style={styles.modalDesc}>{modalDetalle?.descripcion}</Text>
              <Text style={styles.modalInfo}>
                Enviado por: {(modalDetalle?.id_usuario as Usuario)?.nombres} {(modalDetalle?.id_usuario as Usuario)?.apellidos}
              </Text>
              <Text style={styles.modalInfo}>
                Fecha: {modalDetalle && new Date(modalDetalle.fecha_creacion).toLocaleString()}
              </Text>
              <TouchableOpacity style={[styles.boton, { alignSelf: "flex-end", marginTop: 15 }]} onPress={() => setModalDetalle(null)}>
                <Text style={styles.botonText}>Cerrar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Editar */}
      <Modal visible={!!modalEditar} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Reporte</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={editTitulo}
              onChangeText={setEditTitulo}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descripción"
              multiline
              value={editDescripcion}
              onChangeText={setEditDescripcion}
            />
            <View style={styles.botonesRow}>
              <TouchableOpacity style={styles.boton} onPress={() => setModalEditar(null)}>
                <Text style={styles.botonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.boton, styles.botonEditar]} onPress={guardarEdicion}>
                <Text style={styles.botonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Nuevo */}
      <Modal visible={modalNuevo} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Nuevo Reporte</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={nuevoTitulo}
              onChangeText={setNuevoTitulo}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Descripción"
              multiline
              value={nuevaDescripcion}
              onChangeText={setNuevaDescripcion}
            />
            <View style={styles.botonesRow}>
              <TouchableOpacity style={styles.boton} onPress={() => setModalNuevo(false)}>
                <Text style={styles.botonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.boton, styles.botonEditar]} onPress={crearNuevoReporte}>
                <Text style={styles.botonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 75, paddingHorizontal: 25, backgroundColor: "#e0f2f1" }, // ✨ margen superior y lateral
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  title: { fontSize: 24, fontWeight: "bold", color: "#06765C" },
  botonNuevo: { backgroundColor: "#06765C", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  botonText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 }, // ✨ margen inferior extra
  cardTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardInfo: { fontSize: 14, color: "#333" },
  cardEstado: { fontWeight: "bold", marginTop: 5 },
  botonesRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  boton: { backgroundColor: "#1976d2", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, marginLeft: 10 },
  botonEditar: { backgroundColor: "#ff9800" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 10 },
  modalContainer: { width: "90%", backgroundColor: "#fff", borderRadius: 15, padding: 20 },
  modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalDesc: { fontSize: 16, marginBottom: 10 },
  modalInfo: { fontSize: 14, color: "gray", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
});
