import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Catalogo from './Screens/Catalogo';
import Administrador from './Screens/Administrador';

const SECCIONES = [
  { id: 'catalogo', nombre: 'Catálogo', icono: 'storefront-outline', iconoActivo: 'storefront' },
  { id: 'admin', nombre: 'Administrador', icono: 'settings-outline', iconoActivo: 'settings' },
];

export default function App() {
  const [seccion, setSeccion] = useState('catalogo');

  return (
    <View style={styles.container}>
      {/* Cada sección se monta al seleccionarla, así el catálogo vuelve a
          consultar Firestore y muestra los productos recién agregados */}
      <View style={styles.contenido}>
        {seccion === 'catalogo' ? <Catalogo /> : <Administrador />}
      </View>

      <View style={styles.barra}>
        {SECCIONES.map((s) => {
          const activo = s.id === seccion;
          return (
            <TouchableOpacity
              key={s.id}
              style={styles.pestana}
              onPress={() => setSeccion(s.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={activo ? s.iconoActivo : s.icono}
                size={22}
                color={activo ? '#7C7CFF' : '#B5B5D5'}
              />
              <Text style={[styles.textoPestana, activo && styles.textoActivo]}>
                {s.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contenido: {
    flex: 1,
  },
  barra: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5F0',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: 24,
  },
  pestana: {
    flex: 1,
    alignItems: 'center',
  },
  textoPestana: {
    fontSize: 11,
    color: '#B5B5D5',
    marginTop: 2,
  },
  textoActivo: {
    color: '#7C7CFF',
    fontWeight: 'bold',
  },
});
