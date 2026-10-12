import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import { db } from "../firebase/config";

// Colores de fondo disponibles para la tarjeta del producto
const COLORES = ["#F5F4FC", "#FFE9E3", "#E3F6FF", "#E8FFE3", "#FFF6D9", "#F3E3FF"];

// Si recibe "producto", el formulario edita ese producto; si no, crea uno nuevo
const FormularioProducto = ({ categorias, producto, onCancelar, onGuardado }) => {
  const editando = Boolean(producto);
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [precio, setPrecio] = useState(
    producto?.precio != null ? String(producto.precio) : ""
  );
  const [tiempo, setTiempo] = useState(producto?.tiempo ?? "");
  const [imagen, setImagen] = useState(producto?.imagen ?? "");
  const [color, setColor] = useState(producto?.color ?? COLORES[0]);
  const [categoriaId, setCategoriaId] = useState(
    producto?.categoriaId != null ? String(producto.categoriaId) : null
  );
  const [guardando, setGuardando] = useState(false);

  const guardarProducto = async () => {
    const precioNumero = Number(precio.replace(",", "."));

    if (!nombre.trim()) {
      Alert.alert("Falta información", "Ingrese el nombre del producto.");
      return;
    }
    if (!String(precio).trim() || Number.isNaN(precioNumero) || precioNumero < 0) {
      Alert.alert("Precio inválido", "Ingrese un precio numérico válido.");
      return;
    }
    if (categoriaId === null) {
      Alert.alert("Falta información", "Seleccione una categoría.");
      return;
    }

    setGuardando(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        precio: precioNumero,
        tiempo: tiempo.trim(),
        imagen: imagen.trim(),
        color,
        // Mismo formato que el id del documento de la categoría, que es
        // con lo que filtra el catálogo
        categoriaId,
      };
      if (editando) {
        await updateDoc(doc(db, "Productos", producto.id), datos);
        Alert.alert("Producto actualizado", `"${datos.nombre}" se actualizó correctamente.`);
      } else {
        await addDoc(collection(db, "Productos"), datos);
        Alert.alert("Producto agregado", `"${datos.nombre}" se guardó correctamente.`);
      }
      onGuardado();
    } catch (error) {
      console.error("Error guardando producto: ", error);
      Alert.alert("Error", "No se pudo guardar el producto.");
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={onCancelar} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.titulo}>
          {editando ? "Editar producto" : "Nuevo producto"}
        </Text>
      </View>

      <View style={styles.linea} />

      <ScrollView
        contentContainerStyle={styles.formulario}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.vistaPrevia, { backgroundColor: color }]}>
          {imagen.trim() ? (
            <Image source={{ uri: imagen.trim() }} style={styles.imagen} />
          ) : (
            <Ionicons name="image-outline" size={48} color="#B5B5D5" />
          )}
        </View>

        <Text style={styles.etiqueta}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Audífonos inalámbricos"
          placeholderTextColor="#B5B5D5"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.etiqueta}>Precio *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 25.99"
          placeholderTextColor="#B5B5D5"
          keyboardType="decimal-pad"
          value={precio}
          onChangeText={setPrecio}
        />

        <Text style={styles.etiqueta}>Tiempo de entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 2-3 días"
          placeholderTextColor="#B5B5D5"
          value={tiempo}
          onChangeText={setTiempo}
        />

        <Text style={styles.etiqueta}>URL de la imagen</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          placeholderTextColor="#B5B5D5"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          value={imagen}
          onChangeText={setImagen}
        />

        <Text style={styles.etiqueta}>Color de fondo</Text>
        <View style={styles.colores}>
          {COLORES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.color,
                { backgroundColor: c },
                c === color && styles.colorActivo,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Text style={styles.etiqueta}>Categoría *</Text>
        <View style={styles.categorias}>
          {categorias.map((c) => {
            const activo = String(c.id) === categoriaId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.chip, activo && styles.chipActivo]}
                onPress={() => setCategoriaId(String(c.id))}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={c.icono}
                  size={16}
                  color={activo ? "#FFFFFF" : "#7C7CFF"}
                />
                <Text style={[styles.textoChip, activo && styles.textoChipActivo]}>
                  {c.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
          {categorias.length === 0 && (
            <Text style={styles.mensaje}>No hay categorías registradas.</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
          onPress={guardarProducto}
          disabled={guardando}
          activeOpacity={0.8}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotonGuardar}>
              {editando ? "Guardar cambios" : "Guardar producto"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    alignItems: "center",
    marginTop: 12,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 12,
  },
  linea: {
    height: 1,
    backgroundColor: "#E5E5F0",
    marginHorizontal: -10,
  },
  formulario: {
    paddingVertical: 15,
  },
  vistaPrevia: {
    height: 170,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  imagen: {
    width: "70%",
    height: "90%",
    resizeMode: "contain",
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: "#F5F4FC",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#222",
  },
  colores: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  color: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E5E5F0",
  },
  colorActivo: {
    borderWidth: 3,
    borderColor: "#7C7CFF",
  },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F4FC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActivo: {
    backgroundColor: "#7C7CFF",
  },
  textoChip: {
    fontSize: 12,
    color: "#7C7CFF",
    marginLeft: 6,
  },
  textoChipActivo: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  mensaje: {
    fontSize: 13,
    color: "#9A9AB5",
  },
  botonGuardar: {
    height: 52,
    backgroundColor: "#7C7CFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonGuardar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default FormularioProducto;
