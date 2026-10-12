import { useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/config";

// Si recibe un producto por parámetro de navegación, el formulario lo edita;
// si no, crea uno nuevo
const FormularioProductoScreen = ({ navigation, route }) => {
  const producto = route.params?.producto;
  const editando = Boolean(producto);

  // TextInput solo trabaja con texto, por eso los números se pasan con String()
  const [id, setId] = useState(producto ? String(producto.id ?? "") : "");
  const [categoriaId, setCategoriaId] = useState(
    producto ? String(producto.categoriaId ?? "") : ""
  );
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precio, setPrecio] = useState(
    producto ? String(producto.precio ?? "") : ""
  );
  const [color, setColor] = useState(producto?.color ?? "");
  const [imagen, setImagen] = useState(producto?.imagen ?? "");
  const [tiempo, setTiempo] = useState(producto?.tiempo ?? "");
  const [guardando, setGuardando] = useState(false);

  const guardarProducto = async () => {
    if (!id.trim() || !categoriaId.trim() || !nombre.trim() || !precio.trim()) {
      Alert.alert(
        "Faltan datos",
        "Complete al menos ID, ID categoría, nombre y precio."
      );
      return;
    }

    // id, categoriaId y precio se guardan como número, igual que los
    // productos existentes, para que el filtro por categoría siga funcionando
    const datos = {
      id: Number(id),
      categoriaId: Number(categoriaId),
      nombre: nombre.trim(),
      precio: Number(precio),
      color: color.trim(),
      imagen: imagen.trim(),
      tiempo: tiempo.trim(),
    };

    if ([datos.id, datos.categoriaId, datos.precio].some(Number.isNaN)) {
      Alert.alert("Datos inválidos", "ID, ID categoría y precio deben ser números.");
      return;
    }

    setGuardando(true);
    try {
      if (editando) {
        await updateDoc(doc(db, "Productos", producto.docId), datos);
        Alert.alert("Producto actualizado", `"${datos.nombre}" se actualizó correctamente.`);
      } else {
        await addDoc(collection(db, "Productos"), datos);
        Alert.alert("Producto agregado", `"${datos.nombre}" se guardó correctamente.`);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error guardando producto: ", error);
      Alert.alert("Error", "No se pudo guardar el producto.");
      setGuardando(false);
    }
  };

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.formulario}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.etiqueta}>ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 3"
        keyboardType="numeric"
        value={id}
        onChangeText={setId}
      />

      <Text style={styles.etiqueta}>ID Categoría</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 1"
        keyboardType="numeric"
        value={categoriaId}
        onChangeText={setCategoriaId}
      />

      <Text style={styles.etiqueta}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.etiqueta}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 27"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <Text style={styles.etiqueta}>Color</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. #F5AFC1"
        autoCapitalize="none"
        value={color}
        onChangeText={setColor}
      />

      <Text style={styles.etiqueta}>Imagen</Text>
      <TextInput
        style={styles.input}
        placeholder="URL de la imagen"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        value={imagen}
        onChangeText={setImagen}
      />

      <Text style={styles.etiqueta}>Tiempo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 10 hours ago"
        value={tiempo}
        onChangeText={setTiempo}
      />

      <TouchableOpacity
        style={[styles.boton, guardando && styles.botonDeshabilitado]}
        onPress={guardarProducto}
        disabled={guardando}
        activeOpacity={0.8}
      >
        {guardando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.textoBoton}>
            {editando ? "ACTUALIZAR PRODUCTO" : "GUARDAR PRODUCTO"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  formulario: {
    padding: 16,
    paddingBottom: 30,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#222",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#222",
  },
  boton: {
    height: 44,
    backgroundColor: "#2196F3",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default FormularioProductoScreen;
