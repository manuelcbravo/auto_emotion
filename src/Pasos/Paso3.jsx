import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Appbar, Card, useTheme } from 'react-native-paper';
import { theme } from '../../core/theme'
import useForm from '../../components/Form/useForm'; // Importa tu hook useForm
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Wizard from '../../components/Form/Wizard';

export default function Paso3({ navigation, route }) {
  const { id, step } = route.params;
  const [loading, setLoading] = useState(true);
  const { values, handleChange, setValues } = useForm({});
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [parsedSession, setParsedSession] = useState({});
  const { colors } = useTheme();
  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);
  const [currentStep, setCurrentStep] = useState(3);

  const fetchData = useCallback(async () => {
    try {
      let session = null;
      if (Platform.OS === 'web') {
        session = localStorage.getItem('session_automotion');
      } else {
        session = await AsyncStorage.getItem('session_automotion');
      }

      if (session) {
        const parsedSessionObj = JSON.parse(session);
        setParsedSession(parsedSessionObj);
        
        const data_evaluation = evaluacion(parsedSessionObj.datos_api, id);

        setValues({
          ...data_evaluation,
        });
      }
    } catch (error) {
      console.error('Error fetching session or data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSubmit = () => {
    navigation.navigate('Paso4', {id});
  };

  const estatusTexto = (id) => {
    id = Number(id); // Asegúrate de que id es un número
    switch (id) {
      case 1:
        return 'Muy Bueno';
      case 2:
        return 'Bueno';
      case 3:
        return 'Regular';
      case 4:
        return 'Malo';
      case 5:
        return 'Muy Malo';
      default:
        return '-';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Inspección" />
      </Appbar.Header>
      <View style={styles.content}>
        <Wizard currentStep={currentStep} />
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 1 })}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Vidrios</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.vidrios?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.vidrios.costo_previsto}</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 2})}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Interior y Tapicería</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.interiores?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.interiores.costo_previsto }</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 3})}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Llantas y rines</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.llantas?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.llantas.costo_previsto }</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 4})}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Hojalatería y pintura</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.hojalateria?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.hojalateria.costo_previsto }</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 5})}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Mécanica</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.mecanica?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.mecanica.costo_previsto }</Text>
            </View>
          </View>
        </Card>
        <Card style={styles.card} onPress={() => navigation.navigate('Interiores', { id, step: 6})}>
          <View style={styles.row}>
            <View style={styles.col1}>
              <Text style={styles.text}>Prueba de manejo</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.status}>ESTATUS</Text>
              <Text style={styles.status}>{ estatusTexto(values.prueba?.id_estado) }</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.cost}>COSTO</Text>
              <Text style={styles.cost}>${ values.prueba.costo_previsto }</Text>
            </View>
          </View>
        </Card>
      </View>
      <View style={[styles.buttonContainer, { backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button} color={theme.colors.buttonPaso}>
          <Text style={styles.buttonText}>Guardar y avanzar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15, 
  },
  card: {
    width: '100%',
    marginVertical: 10,
   
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col1: {
    flex: 3,
    padding: 10
  },
  col2: {
    flex: 2,
    alignItems: 'center', 
    backgroundColor: '#D5D5D5'
  },
  col3: {
    flex: 2,
    alignItems: 'center', 
    backgroundColor: '#D5D5D5',
    borderTopRightRadius: 10.5,
    borderBottomRightRadius: 10.5,
  },
  text: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  status: {
    marginBottom: 5,
  },
  cost: {
    marginBottom: 5,
  },
  buttonContainer: {
    backgroundColor: theme.colors.buttonPaso, 
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 65 : 50, 
  },
  buttonText:{
    color: theme.colors.textWhite,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    height: theme.colors.tamanoAppBar,
  },
});
