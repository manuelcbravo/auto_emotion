import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView, Alert, Image, Modal, ActivityIndicator, Text } from 'react-native';
import { Appbar, Card, Title, Paragraph, useTheme, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import CustomSelect from '../../components/Form/CustomSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useForm from '../../components/Form/useForm'; 
import { theme } from '../../core/theme';
import { setEvaluacionArchivo } from '../../axiosConfig'; 
import { MaterialIcons } from '@expo/vector-icons'; 

const UploadScreen = ({ navigation, route }) => {
  const { tipoId, id, routes } = route.params; 
  const [fileUri, setFileUri] = useState(null);
  const [openArchivo, setOpenArchivo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();
  const [fetchCompleted, setFetchCompleted] = useState(false); // Estado para controlar si la solicitud ya se ha completado

  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

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
          const data_form = parsedSessionObj.datos_formulario;

          const opcionesVehiculos = data_form.cat_archivos_vehiculos.map((puerta) => ({
            label: puerta.nombre,
            value: puerta.id.toString(),
          }));
          setClientes(opcionesVehiculos)

          const opcionesClientes = data_form.cat_archivos_clientes.map((puerta) => ({
            label: puerta.nombre,
            value: puerta.id.toString(),
          }));
          setVehiculos(opcionesClientes)
        
        }
      } catch (error) {
        console.error('Error fetching session or data:', error);
        setError(error);
      } finally {
        setFetchCompleted(true);
      }
    };

    if (!fetchCompleted) {
      fetchData();
    }
  }, [fetchCompleted]);

  const initialValues =  {
    id_evaluacion: id,
    id_tipo: tipoId,
    fileUri: '',
    id_tipo_archivo: ''
  }

  const { values, handleChange, setValues } = useForm(initialValues);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFileUri(result.assets[0].uri);
      handleChange('fileUri', result.assets[0].uri)
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled) {
        setFileUri(result.assets[0].uri);
        handleChange('fileUri', result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error seleccionando archivo: ', error);
    }
  };

  const handleSubmit = async () => {
    // Validación antes de enviar los datos
    if (!values.id_tipo_archivo || !values.fileUri) {
      Alert.alert("Error", "Seleccione el tipo de archivo y suba una imagen o archivo.");
      return;
    }

      const formData = new FormData();
      formData.append('archivo', {
        uri: values.fileUri,
        type: 'image/jpeg',
        name: 'file.jpg',
      });
      formData.append('id_evaluacion', id); 
      formData.append('id_tipo', values.id_tipo);
      formData.append('id_tipo_archivo', values.id_tipo_archivo);
      try {
        setModalVisible(true); // Mostrar el modal de carga
        const response =  await setEvaluacionArchivo(id, formData);
        if (response.status === 200){
          Alert.alert("Éxito", "El archivo se ha subido correctamente.");
          navigation.navigate('Detail', { id, routes });
        }else{
          Alert.alert("Error", "Algo salio mal.");
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
      } finally {
        setModalVisible(false);
      }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Archivos" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Seleccionar Tipo de Archivo</Title>
            <CustomSelect
              open={openArchivo}
              value={values.id_tipo_archivo}
              items={tipoId === 1 ? clientes : vehiculos} // Corregir la lista de items
              setOpen={setOpenArchivo}
              onChangeValue={(value) => handleChange('id_tipo_archivo', value)}
              placeholder="Tipo de archivo"
            />
            <Paragraph>Elija una opción para subir una imagen o archivo.</Paragraph>
            <View style={styles.buttonContainer}>
              <Button icon="camera" 
                onPress={pickImage} 
                labelStyle={{ color: colors.textWhite }}
                style={{ backgroundColor: colors.primary, color: colors.textWhite }}
               >
                Tomar Foto
              </Button>
            </View>
            <View style={styles.buttonContainer}>
              <Button icon="folder" 
                onPress={pickDocument}
                labelStyle={{ color: colors.textWhite }}
                style={{ backgroundColor: colors.primary, color: colors.textWhite }} >
                Seleccionar Archivo
              </Button>
            </View>
          </Card.Content>
        </Card>

        {fileUri && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Archivo Seleccionado</Title>
              {fileUri.endsWith('.jpg') || fileUri.endsWith('.png') || fileUri.endsWith('.jpeg') ? (
                <Image source={{ uri: fileUri }} style={styles.image} />
              ) : (
                <MaterialIcons name="attach-file" size={40} color={colors.primary} />
              )}
            </Card.Content>
          </Card>
        )}

        <View style={styles.submitButtonContainer}>
          <Button icon="upload" 
            onPress={handleSubmit}  
            labelStyle={{ color: colors.textWhite }}
            style={[styles.button, { backgroundColor: colors.primary, color: colors.textWhite }]}>
            Subir
          </Button>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Subiendo</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    padding: 10,
  },
  card: {
    marginBottom: 20,
  },
  header: {
    height: theme.colors.tamanoAppBar,
  },
  buttonContainer: {
    marginVertical: 10, 
  },
  submitButtonContainer: {
    marginTop: 20,
    marginBottom: 50,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 50,
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

export default UploadScreen;
