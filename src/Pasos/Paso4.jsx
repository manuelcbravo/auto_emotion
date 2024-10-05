import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { Appbar, Card, useTheme, Text as TextPaper  } from 'react-native-paper';
import InputComponent from '../../components/Form/InputComponent';
import TextAreaComponent from '../../components/Form/TextAreaComponent';
import { theme } from '../../core/theme'
import { setEvaluacionGuardarFoto, setEvaluacionGuardar } from '../../axiosConfig'; 
import Wizard from '../../components/Form/Wizard';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useForm from '../../components/Form/useForm'; // Importa tu hook useForm
import CustomSelect from '../../components/Form/CustomSelect';

export default function Paso4({ navigation, route }) {
  const { id, step } = route.params;
  const [proposito, setProposito] = React.useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedSession, setParsedSession] = useState({});
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);
  const { values, handleChange, setValues } = useForm({});
  const [opcionesVarlor, setOpcionesValor] = useState([]);
  const [openPuerta, setOpenPuerta] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [photosSentCount, setPhotosSentCount] = useState(0);
  const [photosTotal, setPhotosTotal] = useState([]);
  const [gastos, setGastos] = useState(0);
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(4);

  const formatoDinero = (cantidad) => {
    const numero = Number(cantidad);
  
    if (isNaN(numero)) {
      return '-';
    }
  
    return numero.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN', 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2, 
    });
  };

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
          const data_form = parsedSessionObj.datos_formulario;

          console.log(data_evaluation);

          setValues({
            ...data_evaluation,
              id_estatus_evaluacion: 3
          });

          let newPhotosTotal  = [];

          if (data_evaluation.fotos_general && data_evaluation.fotos_general.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.fotos_general];
          }
          if (data_evaluation.vidrios && data_evaluation.vidrios.fotos && data_evaluation.vidrios.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.vidrios.fotos];
          }
          if (data_evaluation.interiores && data_evaluation.interiores.fotos && data_evaluation.interiores.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.interiores.fotos];
          }
          if (data_evaluation.llantas && data_evaluation.llantas.fotos && data_evaluation.llantas.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.llantas.fotos];
          }
          if (data_evaluation.hojalateria && data_evaluation.hojalateria.fotos && data_evaluation.hojalateria.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.hojalateria.fotos];
          }
          if (data_evaluation.mecanica && data_evaluation.mecanica.fotos && data_evaluation.mecanica.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.mecanica.fotos];
          }
          if (data_evaluation.prueba && data_evaluation.prueba.fotos && data_evaluation.prueba.fotos.length > 0) {
            newPhotosTotal  = [...newPhotosTotal , ...data_evaluation.prueba.fotos];
          }

          setPhotosTotal(newPhotosTotal );

          const opcionesVarlor = data_form.estatus_vehiculo.map((inspeccion_estatus) => ({
            label: inspeccion_estatus.nombre,
            value: inspeccion_estatus.id.toString(),
          }));

          setOpcionesValor(opcionesVarlor);

          const sumaGastos = (data) => {
            const { vidrios, interiores, llantas, hojalateria, mecanica, prueba } = data;
          
            // Verificar que cada valor esté definido y sea numérico; si no, usar 0 como valor por defecto.
            const vidriosCosto = Number(vidrios?.costo_previsto) || 0;
            const interioresCosto = Number(interiores?.costo_previsto) || 0;
            const llantasCosto = Number(llantas?.costo_previsto) || 0;
            const hojalateriaCosto = Number(hojalateria?.costo_previsto) || 0;
            const mecanicaCosto = Number(mecanica?.costo_previsto) || 0;
            const pruebaCosto = Number(prueba?.costo_previsto) || 0;
          
            // Sumar los valores
            return vidriosCosto + interioresCosto + llantasCosto + hojalateriaCosto + mecanicaCosto + pruebaCosto;
          };

          setGastos(sumaGastos(data_evaluation));

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

  const handleTerminar = () => {
    handleSave();
  }
  
  const handleSave = async () => {
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
    
    try {

      const response = await setEvaluacionGuardar(id, values);
      if (response.data.respuesta){
        if(photosTotal.length > 0) {
          setModalVisible(true); // Mostrar el modal de carga
          for (let image of photosTotal) {
            const formData = new FormData();
            formData.append('photo', {
              uri: image.uri,
              type: 'image/jpeg',
              name: `photo_${image.index}.jpg`,
            });
            formData.append('tipo', image.tipo);
            formData.append('index', image.index);
            formData.append('guardado', image.guardado);

            await setEvaluacionGuardarFoto(response.data.id, formData);

            // Incrementar el contador de fotos enviadas
            setPhotosSentCount(prevCount => prevCount + 1);
            
          }
          setModalVisible(false);
          setPhotosSentCount(0)
          Alert.alert("Éxito", "Las fotos se han subido correctamente.");
          navigation.navigate('Drawer', { screen: 'RealizadoScreen' });
        }else{
          Alert.alert("Éxito", "Las información fue subida correctamente.");
          navigation.navigate('Drawer', { screen: 'RealizadoScreen' });
        }
      }  else {
        Alert.alert(
          "Error",
          "Algo salió mal. Intente más tarde.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Drawer', { screen: 'PendienteScreen' })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error encountered:', error);
      if (error.response) {
        // El servidor respondió con un código de estado que está fuera del rango de 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error('Error request:', error.request);
      } else {
        // Algo pasó al configurar la solicitud que desencadenó un error
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Valuación" />
      </Appbar.Header>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Wizard currentStep={currentStep} />
         
        <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 10 }}>
          Clasificación y Propósito
        </TextPaper>

          <CustomSelect
              open={openPuerta}
              setOpen={setOpenPuerta}
              value={values.id_estado_vehiculo} // Asegúrate de usar el valor del estado actualizado
              items={opcionesVarlor}
              onChangeValue={(value) => handleChange('id_estado_vehiculo', value)}
              placeholder="Clasificación"
            />
          <InputComponent
            label="Propósito"
            value={proposito}
            onChangeText={setProposito}
            placeholder="Ingrese el propósito"
          />

          <Card style={styles.card}>
            <Card.Title title="Valores de Referencia"/>
            <Card.Content>
            <View style={styles.containerTable}>
              <View style={styles.section}>
                <Text style={styles.headerTable2}>REFERENCIAS PARA VENTA</Text>
                <View style={[styles.row, styles.rowHeader]}>
                  <Text style={styles.label}></Text>
                  <Text style={styles.value}>Min</Text>
                  <Text style={styles.value}>Med</Text>
                  <Text style={styles.value}>Max</Text>
                </View>
                <View style={[styles.row, styles.rowEven]}>
                  <Text style={styles.label}>ESTÁNDAR</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                </View>
                <View style={[styles.row, styles.rowOdd]}>
                  <Text style={styles.label}>LIBRO AMARILLO</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                </View>
                <View style={[styles.row, styles.rowEven]}>
                  <Text style={styles.label}>MERCADO LIBRE</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                </View>
              </View>
              <View style={styles.section}>
                <Text style={styles.headerTable}>REFERENCIAS PARA COMPRA</Text>
                <View style={[styles.row, styles.rowHeader]}>
                  <Text style={styles.label}></Text>
                  <Text style={styles.value}>Min</Text>
                  <Text style={styles.value}>Med</Text>
                  <Text style={styles.value}>Max</Text>
                </View>
                <View style={[styles.row, styles.rowEven]}>
                  <Text style={styles.label}>ESTÁNDAR</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                </View>
                <View style={[styles.row, styles.rowOdd]}>
                  <Text style={styles.label}>LIBRO AMARILLO</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                  <Text style={styles.value}>$0</Text>
                </View>
              </View>
            </View>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <Text>Gasto Previsto:</Text>
                <Text>{ formatoDinero(gastos) }</Text>
              </View>
            </Card.Content>
          </Card>
          <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 10 }}>
          Valores de Compra
          </TextPaper>
          <InputComponent
            value={values.valor_compra}
            onChangeText={(text) => handleChange('valor_compra', text)}
            placeholder="Valor de compra"
            keyboardType="numeric"
            required={true}
          />
          <InputComponent
            label="Valor de Venta"
            value={values.valor_venta}
            onChangeText={(text) => handleChange('valor_venta', text)}
            placeholder="Valor de venta"
            keyboardType="numeric"
            required={true}
          />
          <TextAreaComponent 
            label="Observaciones" 
            value={values.observacion_primer_comentario}                
            onChangeText={(text) => handleChange('observacion_primer_comentario', text)}
          />
            
        </ScrollView>
      </KeyboardAvoidingView>  
      <View style={[styles.buttonContainer, { backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={handleTerminar} style={styles.button} color={theme.colors.buttonPaso}>
          <Text style={styles.buttonText}>Terminar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Enviando fotos: {photosSentCount} de {photosTotal.length}</Text>
          </View>
        </View>
      </Modal>
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
  },
  scrollViewContent: {
    padding: 15,
  },
  card: {
    marginBottom: 10,
  },
  containerTable: {
    flex: 1,
    padding: 0,
  },
  section: {
    marginBottom: 10,
  },
  headerTable: {
    fontSize: 12, // Tamaño de letra más pequeño
    fontWeight: 'bold',
    backgroundColor: 'red',
    color: 'white',
    padding: 8,
    textAlign: 'center',
  },
  headerTable2: {
    fontSize: 12, // Tamaño de letra más pequeño
    fontWeight: 'bold',
    backgroundColor: 'green',
    color: 'white',
    padding: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rowHeader: {
    backgroundColor: '#f0f0f0',
  },
  rowOdd: {
    backgroundColor: '#e0e0e0',
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  label: {
    flex: 1,
    marginRight: 10,
    fontSize: 11
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    backgroundColor: theme.colors.buttonPaso, 
    height: Platform.OS === 'ios' ? 65 : 50, 
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});
