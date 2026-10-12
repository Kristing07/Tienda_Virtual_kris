import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/config";
import Categoria from "../components/Categoria";
import Producto from "../components/Producto";

// Opción adicional (Reto): muestra todos los productos sin filtrar
const TODOS = { id: 0, nombre: "Todos", icono: "apps-outline" };

const Catalogo = () => {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState(TODOS.id);
  const [cargando, setCargando] = useState(true);
  // Identifica la última consulta de productos, para ignorar respuestas viejas
  // si el usuario toca varias categorías seguidas
  const ultimaConsulta = useRef(0);

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categorias"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      // Ordena por el id numérico asignado manualmente en Firestore
      datos.sort((a, b) => a.id - b.id);
      console.log(datos);
      setCategorias(datos);
    } catch (error) {
      console.error("Error obteniendo categorías: ", error);
    }
  };

  const obtenerProductos = async () => {
    const consultaActual = ++ultimaConsulta.current;
    setCargando(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const datos = [];
      querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
      });
      if (consultaActual === ultimaConsulta.current) setProductos(datos);
    } catch (error) {
      console.error("Error obteniendo productos: ", error);
    } finally {
      if (consultaActual === ultimaConsulta.current) setCargando(false);
    }
  };

  const obtenerProductosPorCategoria = async (categoriaId) => {
    const consultaActual = ++ultimaConsulta.current;
    setCargando(true);
    try {
      const consulta = query(
        collection(db, "Productos"),
        where("categoriaId", "==", categoriaId)
      );
      const consultaSnapshot = await getDocs(consulta);

      const datos = [];
      consultaSnapshot.forEach((documento) => {
        datos.push({ id: documento.id, ...documento.data() });
      });
      if (consultaActual === ultimaConsulta.current) setProductos(datos);
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error);
    } finally {
      if (consultaActual === ultimaConsulta.current) setCargando(false);
    }
  };

  const seleccionarCategoria = (categoriaId) => {
    setCategoriaActiva(categoriaId);
    if (categoriaId === TODOS.id) {
      obtenerProductos();
    } else {
      obtenerProductosPorCategoria(categoriaId);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    (producto.nombre ?? "").toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  const nombreCategoriaActiva =
    [TODOS, ...categorias].find((c) => c.id === categoriaActiva)?.nombre ??
    TODOS.nombre;

  return (
    <View style={styles.pantalla}>
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={18} color="#7C7CFF" />
        <TextInput
          placeholder="Buscar producto"
          placeholderTextColor="#B5B5D5"
          style={styles.input}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={18} color="#B5B5D5" />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categorias}
          data={[TODOS, ...categorias]}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Categoria
              nombre={item.nombre}
              icono={item.icono}
              activo={item.id === categoriaActiva}
              onPress={() => seleccionarCategoria(item.id)}
            />
          )}
        />
      </View>

      <View style={styles.linea} />

      <View style={styles.encabezado}>
        <Text style={styles.titulo}>
          {categoriaActiva === TODOS.id ? "News" : nombreCategoriaActiva}
        </Text>
        <Text style={styles.contador}>
          {productosFiltrados.length}{" "}
          {productosFiltrados.length === 1 ? "producto" : "productos"}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#7C7CFF" />
          <Text style={styles.mensaje}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          style={styles.contenedor}
          data={productosFiltrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnas}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaProductos}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Producto
              nombre={item.nombre}
              precio={item.precio}
              tiempo={item.tiempo}
              color={item.color}
              imagen={item.imagen}
            />
          )}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Ionicons name="cube-outline" size={48} color="#D5D5EE" />
              <Text style={styles.mensaje}>
                {busqueda
                  ? `No hay productos que coincidan con "${busqueda}"`
                  : "No hay productos en esta categoría"}
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
  buscador: {
    height: 55,
    backgroundColor: "#F5F4FC",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: "#222",
  },
  categorias: {
    marginBottom: 12,
  },
  linea: {
    height: 1,
    backgroundColor: "#E5E5F0",
    marginHorizontal: -10,
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 15,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  contador: {
    fontSize: 12,
    color: "#AAAAAA",
  },
  contenedor: {
    flex: 1,
  },
  columnas: {
    justifyContent: "space-between",
  },
  listaProductos: {
    paddingBottom: 20,
    flexGrow: 1,
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

export default Catalogo;
