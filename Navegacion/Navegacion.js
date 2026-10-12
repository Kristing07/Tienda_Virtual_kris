import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import CatalogoScreen from "../screens/CatalogoScreen";
import DetalleProductoScreen from "../screens/DetalleProductoScreen";
import AdminProductosScreen from "../screens/AdminProductosScreen";
import FormularioProductoScreen from "../screens/FormularioProductoScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack de la primera pestaña: catálogo y detalle del producto
function StackCatalogo() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Catalogo"
        component={CatalogoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleProducto"
        component={DetalleProductoScreen}
        options={{ title: "Detalle del producto" }}
      />
    </Stack.Navigator>
  );
}

// Stack de la segunda pestaña: listado de administración y formulario
function StackAdminProductos() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminProductos"
        component={AdminProductosScreen}
        options={{ title: "Administrar productos" }}
      />
      <Stack.Screen
        name="FormularioProducto"
        component={FormularioProductoScreen}
        options={({ route }) => ({
          title: route.params?.producto ? "Editar producto" : "Nuevo producto",
        })}
      />
    </Stack.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#7C7CFF",
          tabBarInactiveTintColor: "#B5B5D5",
        }}
      >
        <Tab.Screen
          name="TabCatalogo"
          component={StackCatalogo}
          options={{
            title: "Catálogo",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TabAdminProductos"
          component={StackAdminProductos}
          options={{
            title: "Admin Productos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
