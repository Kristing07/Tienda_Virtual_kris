import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Categoria = (props) => {
  return (
    <TouchableOpacity
      style={styles.contenedor}
      onPress={props.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.circulo, props.activo && styles.circuloActivo]}>
        <Ionicons
          name={props.icono}
          size={26}
          color={props.activo ? "#FFFFFF" : "#7C7CFF"}
        />
      </View>

      <Text style={[styles.nombre, props.activo && styles.nombreActivo]}>
        {props.nombre}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  circulo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F5F4FC",
    alignItems: "center",
    justifyContent: "center",
  },
  circuloActivo: {
    backgroundColor: "#7C7CFF",
  },
  nombre: {
    fontSize: 11,
    color: "#7C7CFF",
    marginTop: 6,
  },
  nombreActivo: {
    fontWeight: "bold",
  },
});

export default Categoria;
