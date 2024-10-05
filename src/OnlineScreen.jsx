import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet, Platform, Button, Text } from 'react-native';
import { Card, Chip, Menu, IconButton, Divider, Avatar, useTheme, Button as Btn } from 'react-native-paper';
import { FlatList } from 'react-native';
import { getEvaluacionTotal } from '../axiosConfig'; // Import the axios instance from axiosConfig.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import CustomCard from '../components/Online/CustomCard';

const data = [
  { id: 1, nombre: 'Juan Perez', vehiculo: 'Toyota Corolla', version: 'XLE 2021', estatus: 'Activo' },
  { id: 2, nombre: 'Maria Lopez', vehiculo: 'Ford Fiesta', version: 'Titanium 2020', estatus: 'Inactivo' },
  { id: 3, nombre: 'Carlos García', vehiculo: 'Nissan Altima', version: 'SR 2022', estatus: 'En Proceso' },
];

export default function OnlineScreen({ navigation }) {
  const [visibleMenu, setVisibleMenu] = useState(null); // Para controlar el menú desplegable
  const [refreshing, setRefreshing] = useState(false);
  const [cards, setCards] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [routes, setRoutes] = useState(null);
  const { colors } = useTheme(); // Obtener los colores del tema actual

  const fetchSession = useCallback(async () => {
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
        setRoutes(parsedSession.route);
        setCards(parsedSession.datos_api ?? []);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSession();
    }, [fetchSession])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await getEvaluacionTotal();
      const newCards = response.data;
  
      // Actualizamos sessionData.datos_api de acuerdo a las reglas establecidas
      const updatedCards = sessionData.datos_api.map(sessionCard => {
        const existingCard = newCards.find(card => card.id === sessionCard.id);
  
        if (existingCard) {
          // Si el id_estatus_evaluacion de newCards es 1 o 3, se mantiene el de newCards
          if (existingCard.id_estatus_evaluacion === 1 || existingCard.id_estatus_evaluacion === 3) {
            return existingCard;
          }
          // Si el id_estatus_evaluacion de newCards es 2, se mantiene el de sessionData.datos_api
          if (existingCard.id_estatus_evaluacion === 2) {
            return sessionCard;
          }
        }
  
        // Si no hay coincidencia o no cumple las condiciones, mantiene el de sessionData.datos_api
        return sessionCard;
      });
  
      // Agregamos los elementos de newCards que no existen en sessionData.datos_api
      const newCardsToAdd = newCards.filter(newCard => 
        !sessionData.datos_api.some(sessionCard => sessionCard.id === newCard.id)
      );
  
      // Combinamos updatedCards con los nuevos elementos de newCards
      const finalUpdatedCards = [...updatedCards, ...newCardsToAdd];
  
      // Actualizamos sessionData con los nuevos datos
      const updatedSessions = { ...sessionData, datos_api: finalUpdatedCards };
  
      // Guardamos los datos en localStorage o AsyncStorage según la plataforma
      if (Platform.OS === 'web') {
        localStorage.setItem('session_automotion', JSON.stringify(updatedSessions));
      } else {
        await AsyncStorage.setItem('session_automotion', JSON.stringify(updatedSessions));
      }
  
      // Actualizamos el estado
      setSessionData(updatedSessions);
      setCards(finalUpdatedCards);
  
    } catch (error) {
      console.error('Error fetching new data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [sessionData]);

  const cardsWithStatus4 = cards ? cards.filter(card => (card.id_estatus_evaluacion === 0 || card.id_estatus_evaluacion === 1) && !card.online ) : [];
  const countWithStatus4 = cardsWithStatus4.length;

  const handleNavigateToPasos = (id) => {
    navigation.navigate('OnlinePaso1', { id, step: 1 }); // Navega a la pantalla Paso1 dentro de PasosNavigation
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <Button title="Refresh" onPress={onRefresh} disabled={refreshing} />
      )}
        <ScrollView
          contentContainerStyle={countWithStatus4 === 0 ? styles.noDataContainer : styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {countWithStatus4 === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No hay datos</Text>
              <Btn icon="plus" mode="contained" onPress={ () => handleNavigateToPasos(0) }
              style={{ marginTop: 20}}>
                Agregar solicitud
              </Btn>
            </View>
          ) : (
            cardsWithStatus4.map((card, index) => (
              
                <CustomCard
                  key={index}
                  card={card}
                  onPress={() => handleShowCardDetails(card.id)}
                  route={routes}
                />
              
            ))
          )}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
  },
  chip: {
    margin: 4,
  },
  preference: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  button: {
    borderRadius: 12,
  },
  customCardRadius: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  customCoverRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 24,
  },
});
