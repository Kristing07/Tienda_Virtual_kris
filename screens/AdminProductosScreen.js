import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../firebase/config";

const AdminProductosScreen = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Se ejecuta cada vez que la pantalla recibe el foco, así la lista se
  // actualiza sola al regresar del formulario
  useFocusEffect(
    useCallback(() => {
      obtenerProductos();
    }, [])
  );

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const datos = [];
      querySnapshot.forEach((documento) => {
        // docId es el ID del documento en Firestore (para editar y eliminar);
        // "id" es el campo numérico guardado dentro del producto
        datos.push({ ...documento.data(), docId: documento.id });
      });
      setProductos(datos);
    } catch (error) {
      console.error("Error obteniendo productos: ", error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = (producto) => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que desea eliminar "${producto.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Productos", producto.docId));
              obtenerProductos();
            } catch (error) {
              console.error("Error eliminando producto: ", error);
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          },
        },
      ]
    );
  };

  const editarProducto = (producto) => {
    navigation.navigate("FormularioProducto", { producto });
  };

  return (
    <View style={styles.pantalla}>
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate("FormularioProducto")}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotonAgregar}>+ Agregar producto</Text>
      </TouchableOpacity>

      {cargando && productos.length === 0 ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#7C7CFF" />
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.docId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          onRefresh={obtenerProductos}
          refreshing={cargando}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tarjeta}
              onPress={() => editarProducto(item)}
              activeOpacity={0.8}
            >
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.precio}>C$ {item.precio}</Text>
                <Text style={styles.detalle}>Color: {item.color}</Text>
                <Text style={styles.detalle}>ID categoría: {item.categoriaId}</Text>
                <Text style={styles.detalle}>ID documento: {item.docId}</Text>
                <Text style={styles.tiempo}>{item.tiempo}</Text>
              </View>

              <View style={styles.acciones}>
                <TouchableOpacity
                  style={[styles.botonCircular, styles.botonEditar]}
                  onPress={() => editarProducto(item)}
                >
                  <Ionicons name="pencil" size={16} color="#E0A800" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.botonCircular, styles.botonEliminar]}
                  onPress={() => eliminarProducto(item)}
                >
                  <Ionicons name="trash" size={16} color="#8A8A8A" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name="cube-outline" size={48} color="#D5D5EE" />
              <Text style={styles.mensaje}>No hay productos registrados.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  botonAgregar: {
    backgroundColor: "#7C7CFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  textoBotonAgregar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  lista: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  precio: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C7CFF",
    marginTop: 4,
    marginBottom: 4,
  },
  detalle: {
    fontSize: 11,
    color: "#777",
    marginTop: 1,
  },
  tiempo: {
    fontSize: 10,
    color: "#AAAAAA",
    marginTop: 4,
  },
  acciones: {
    flexDirection: "row",
    marginLeft: 8,
  },
  botonCircular: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  botonEditar: {
    backgroundColor: "#FFF4D6",
  },
  botonEliminar: {
    backgroundColor: "#EDEDED",
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  mensaje: {
    marginTop: 10,
    fontSize: 13,
    color: "#9A9AB5",
    textAlign: "center",
  },
});

export default AdminProductosScreen;
