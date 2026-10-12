import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

const DetalleProductoScreen = ({ route }) => {
  const { producto } = route.params;

  return (
    <ScrollView style={styles.pantalla}>
      <View style={[styles.contenedorImagen, { backgroundColor: producto.color }]}>
        <Image source={{ uri: producto.imagen }} style={styles.imagen} />
      </View>

      <View style={styles.informacion}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.precio}>$ {producto.precio}</Text>
        <Text style={styles.tiempo}>{producto.tiempo}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenedorImagen: {
    height: 320,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: {
    width: "80%",
    height: "85%",
    resizeMode: "contain",
  },
  informacion: {
    padding: 20,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  precio: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7C7CFF",
    marginTop: 8,
  },
  tiempo: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 8,
  },
});

export default DetalleProductoScreen;
