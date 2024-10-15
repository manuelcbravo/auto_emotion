import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Switch, Button, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, Card, useTheme } from 'react-native-paper';
import { theme } from '../../core/theme';
import useForm from '../../components/Form/useForm'; // Importa tu hook useForm
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wizard from '../../components/Form/Wizard';

export default function Paso2({ navigation, route }) {
  const { id, step } = route.params;
  const [loading, setLoading] = useState(true);
  const { values, handleChange, setValues } = useForm({});
  const [fetchCompleted, setFetchCompleted] = useState(false); // Estado para controlar si la solicitud ya se ha completado
  const [error, setError] = useState(null);
  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);
  const [parsedSession, setParsedSession] = useState({});
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
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
        setFetchCompleted(true);
      }
    };

    if (!fetchCompleted) {
      fetchData();
    }
  }, [id, fetchCompleted]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Error" />
        </Appbar.Header>
        <View style={styles.loading}>
          <Text>Error: {error.message}</Text>
        </View>
      </>
    );
  }

  const data = [
    { label: '¿El historial de servicio contiene los sellos del concesionario?', value: values.sellos_concesionado , key: 'sellos_concesionado' },
    { label: '¿El vehículo está financiado?', value: values.vehiculo_financiado, key: 'vehiculo_financiado' },
    { label: '¿Es el primer dueño?', value: values.primer_dueño, key: 'primer_dueño' },
    { label: '¿Fumaban dentro del auto?', value: values.fumaban_auto, key: 'fumaban_auto' },
    { label: '¿Tiene el historial de servicio?', value: values.historial_servicio, key: 'historial_servicio' },
    { label: '¿Tiene manual de propietario?', value: values.manual_propietario, key: 'manual_propietario' },
    { label: '¿Tuvo algún siniestro?', value: values.siniestro, key: 'siniestro' },
    { label: '¿Tiene duplicado de llaves?', value: values.duplicado_llaves, key: 'duplicado_llaves' },
    { label: '¿Tiene factura de agencia?', value: values.factura, key: 'factura' },
    { label: '¿Tiene tenencias/impuesto pagado al año?', value: values.tenencia, key: 'tenencia' },
    { label: '¿Tiene tarjeta de circulación?', value: values.tarjeta_circulacion, key: 'tarjeta_circulacion' },
    { label: '¿Tiene multas?', value: values.multas, key: 'multas' },
  ];

  const renderCards = () => {
    return data.map((item, index) => (
      <Card key={index} style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.cardText}>{item.label}</Text>
          <Switch 
            value={item.value} 
            onValueChange={(value) => handleChange(item.key, value)}
          />
        </Card.Content>
      </Card>
    ));
  };

  const handleSubmit = async () => {
    if (parsedSession && parsedSession.datos_api && values) {

      const updatedDatosApi = parsedSession.datos_api.map(item => {
        
        if (item.id === values.id) {
          return values; 
        }
        return item; 
      });

      const updatedSession = {
        ...parsedSession,
        datos_api: updatedDatosApi,
      };

      try {
        const serializedValue = JSON.stringify(updatedSession);
        if (Platform.OS === 'web') {
          localStorage.setItem('session_automotion', serializedValue);
        } else {
          await AsyncStorage.setItem('session_automotion', serializedValue);
        }
      } catch (error) {
        console.error('Error al guardar en AsyncStorage:', error);
      }
    }

    navigation.navigate('Paso3', {id});
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Complementos" />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <Wizard currentStep={currentStep} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
          {renderCards()}
          <View style={styles.card_final}></View>
        </KeyboardAvoidingView>  
      </ScrollView>
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
    padding: 5,
  },
  scrollView: {
    flex: 1,
    padding: 10
  },
  card: {
    marginVertical: 10,
   
  },
  card_final: {
    marginVertical: 10,
    marginBottom: 20,
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    flex: 1, // El texto tomará el espacio restante
    marginRight: 10, // Margen derecho para separar el texto del interruptor
  },
  header: {
    height: theme.colors.tamanoAppBar, // Reducir la altura en un 30% (60 es la altura predeterminada)
  },
});
