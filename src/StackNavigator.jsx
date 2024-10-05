import React, { useState, useEffect, useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Image, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons  } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as theme, IconButton } from 'react-native-paper';
import { useSession } from '../ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Importar tus pantallas
import LoginScreen from './Auth/LoginScreen';
import SplashScreen from './Auth/SplashScreen';
import HomeScreen from './HomeScreen';
import RealizadoScreen from './RealizadoScreen';
import PendienteScreen from './PendienteScreen';
import OnlineScreen from './OnlineScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Paso1 from './Pasos/Paso1';
import OnlinePaso1 from './Online/Paso1';
import Paso2 from './Pasos/Paso2';
import Paso3 from './Pasos/Paso3';
import Paso4 from './Pasos/Paso4';
import InterioresScreen from './Inspeccion/Interiores';
import UploadScreen from './Detalles/UploadScreen';
import DetailScreen from './DetailScreen'; // La nueva pantalla de detalles

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bot = Platform.OS === 'ios' ? insets.bottom - 12 : 0;
  const { colors } = theme(); // Obtén los colores del tema actual
  const [numero, setNumero] = useState(0);
  const [sessionData, setSessionData] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Function to fetch session data
    async function fetchSession() {
      try {
        let parsedSession = null;

        if (Platform.OS === 'web') {
          const session = localStorage.getItem('session_automotion');
          if (session) {
            parsedSession = JSON.parse(session);
          }
        } else {
          const session = await AsyncStorage.getItem('session_automotion');
          if (session) {
            parsedSession = JSON.parse(session);
          }
        }

        if (parsedSession) {
          setSessionData(parsedSession);
          setCards(parsedSession.datos_api ?? []);
          const cardsWithStatus1 = parsedSession.datos_api ? parsedSession.datos_api.filter(card => card.id_estatus_evaluacion === 1) : [];
          setNumero(cardsWithStatus1.length);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    }

    fetchSession();
  }, []); // Empty dependency array to run only once on mount

  useFocusEffect(
    useCallback(() => {
      if (sessionData) {
        const cardsWithStatus1 = cards.filter(card => card.id_estatus_evaluacion === 1);
        setNumero(cardsWithStatus1.length);
      }
    }, [sessionData, cards])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 5 + (bot),
          height: 60 + (bot),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.contraste,
      }}
    >
      <Tab.Screen 
        name="Proceso" 
        component={HomeScreen} 
        options={({ navigation }) => ({ 
          tabBarLabel: 'Proceso',
          tabBarIcon: ({ color }) => <FontAwesome5 name="file-alt" size={22} color={color} />,
          headerLeft: () => (
            <IconButton
              icon="menu"
              iconColor={colors.textWhite}
              size={24}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo_carro_blanco.png')} // Ruta de tu imagen de logo
              style={{ width: 120, height: 27 }} // Ajusta el tamaño de la imagen según sea necesario
            />
          ),
          headerRight: () => (
            <IconButton
              icon="plus"
              iconColor={colors.textWhite}
              size={24}
              onPress={() => 
                navigation.navigate('Paso1', { id: 0, step: 1 }) // Navega a la pantalla Paso1 dentro de PasosNavigation
              }
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primary, 
          },
          headerTintColor: colors.textWhite, 
        })} 
      />
      <Tab.Screen 
        name="Realizado" 
        component={RealizadoScreen} 
        options={({ navigation }) => ({ 
          tabBarLabel: 'Realizado',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={22} color={color} />,
          headerLeft: () => (
            <IconButton
              icon="menu"
              color={colors.textWhite}
              size={24}
              iconColor={colors.textWhite}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo_carro_blanco.png')} // Ruta de tu imagen de logo
              style={{ width: 120, height: 27 }} // Ajusta el tamaño de la imagen según sea necesario
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primary, 
          },
        })} 
      />
      <Tab.Screen 
        name="Pendiente" 
        component={PendienteScreen} 
        options={({ navigation }) => ({ 
          tabBarLabel: 'Pendiente',
          tabBarBadge: numero,  // Aquí debes usar el valor directamente
          tabBarIcon: ({ color }) => <FontAwesome5 name="clock" size={22} color={color} />,
          headerLeft: () => (
            <IconButton
              icon="menu"
              color={colors.textWhite}
              size={24}
              iconColor={colors.textWhite}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo_carro_blanco.png')} // Ruta de tu imagen de logo
              style={{ width: 120, height: 27 }} // Ajusta el tamaño de la imagen según sea necesario
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primary, 
          },
        })} 
      />
      <Tab.Screen 
        name="Online" 
        component={OnlineScreen} 
        options={({ navigation }) => ({ 
          tabBarLabel: 'E. Online',
          tabBarIcon: ({ color }) => <MaterialIcons name="alternate-email" size={22} color={color} />,
          headerLeft: () => (
            <IconButton
              icon="menu"
              iconColor={colors.textWhite}
              size={24}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo_carro_blanco.png')} // Ruta de tu imagen de logo
              style={{ width: 120, height: 27 }} // Ajusta el tamaño de la imagen según sea necesario
            />
          ),
          headerRight: () => (
            <IconButton
              icon="plus"
              iconColor={colors.textWhite}
              size={24}
              onPress={() => 
                navigation.navigate('OnlinePaso1', { id: 0, step: 1 }) // Navega a la pantalla Paso1 dentro de PasosNavigation
              }
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primary, 
          },
          headerTintColor: colors.textWhite, 
        })} 
      />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

export default function StackNavigator() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Group>
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="Paso1" component={Paso1} />
          <Stack.Screen name="OnlinePaso1" component={OnlinePaso1} />
          <Stack.Screen name="Paso2" component={Paso2} />
          <Stack.Screen name="Paso3" component={Paso3} />
          <Stack.Screen name="Paso4" component={Paso4} />
          <Stack.Screen name="Interiores" component={InterioresScreen} />
          <Stack.Screen name="UploadScreen" component={UploadScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detalle' }} />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
});
