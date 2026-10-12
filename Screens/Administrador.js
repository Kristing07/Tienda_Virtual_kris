import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../firebase/config";
import FormularioProducto from "../components/FormularioProducto";

const Administrador = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Producto que se está editando; null cuando el formulario crea uno nuevo
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const [productosSnapshot, categoriasSnapshot] = await Promise.all([
        getDocs(collection(db, "Productos")),
        getDocs(collection(db, "Categorias")),
      ]);

      const datosProductos = [];
      productosSnapshot.forEach((documento) => {
        datosProductos.push({ id: documento.id, ...documento.data() });
      });
      datosProductos.sort((a, b) =>
        (a.nombre ?? "").localeCompare(b.nombre ?? "")
      );

      const datosCategorias = [];
      categoriasSnapshot.forEach((documento) => {
        datosCategorias.push({ id: documento.id, ...documento.data() });
      });
      datosCategorias.sort((a, b) => a.id - b.id);

      setProductos(datosProductos);
      setCategorias(datosCategorias);
    } catch (error) {
      console.error("Error obteniendo datos de administración: ", error);
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
              await deleteDoc(doc(db, "Productos", producto.id));
              setProductos((actuales) =>
                actuales.filter((p) => p.id !== producto.id)
              );
            } catch (error) {
              console.error("Error eliminando producto: ", error);
              Alert.alert("Error", "No se pudo eliminar el producto.");
            }
          },
        },
      ]
    );
  };

  const nombreCategoria = (categoriaId) =>
    categorias.find((c) => String(c.id) === String(categoriaId))?.nombre ??
    "Sin categoría";

  const abrirFormulario = (producto = null) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  if (mostrarFormulario) {
    return (
      <FormularioProducto
        categorias={categorias}
        producto={productoEditando}
        onCancelar={cerrarFormulario}
        onGuardado={() => {
          cerrarFormulario();
          obtenerDatos();
        }}
      />
    );
  }

  return (
    <View style={styles.pantalla}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.titulo}>Administrador</Text>
          <Text style={styles.contador}>
            {productos.length}{" "}
            {productos.length === 1 ? "producto" : "productos"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.botonAgregar}
          onPress={() => abrirFormulario()}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.textoBotonAgregar}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.linea} />

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#7C7CFF" />
          <Text style={styles.mensaje}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          onRefresh={obtenerDatos}
          refreshing={cargando}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <View
                style={[
                  styles.miniatura,
                  { backgroundColor: item.color ?? "#F5F4FC" },
                ]}
              >
                {item.imagen ? (
                  <Image source={{ uri: item.imagen }} style={styles.imagen} />
                ) : (
                  <Ionicons name="image-outline" size={22} color="#B5B5D5" />
                )}
              </View>

              <View style={styles.info}>
                <Text style={styles.nombre} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <Text style={styles.detalle}>
                  $ {item.precio} · {nombreCategoria(item.categoriaId)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.accion}
                onPress={() => abrirFormulario(item)}
                hitSlop={10}
              >
                <Ionicons name="create-outline" size={20} color="#7C7CFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.accion}
                onPress={() => eliminarProducto(item)}
                hitSlop={10}
              >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name="cube-outline" size={48} color="#D5D5EE" />
              <Text style={styles.mensaje}>
                Aún no hay productos. Toque "Nuevo" para agregar uno.
              </Text>
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
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  contador: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  botonAgregar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7C7CFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textoBotonAgregar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 4,
  },
  linea: {
    height: 1,
    backgroundColor: "#E5E5F0",
    marginHorizontal: -10,
  },
  lista: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },
  miniatura: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imagen: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  info: {
    flex: 1,
    marginHorizontal: 12,
  },
  nombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  detalle: {
    fontSize: 12,
    color: "#9A9AB5",
    marginTop: 3,
  },
  accion: {
    padding: 4,
    marginLeft: 6,
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

export default Administrador;
