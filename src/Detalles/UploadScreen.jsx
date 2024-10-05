import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView, Alert, Image, Modal, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, useTheme, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import CustomSelect from '../../components/Form/CustomSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useForm from '../../components/Form/useForm'; 
import { theme } from '../../core/theme';
import { setEvaluacionArchivo } from '../../axiosConfig'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import Entypo from '@expo/vector-icons/Entypo';

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
        if(result.assets[0].size < 2550330){
          setFileUri(result.assets[0].uri);
          handleChange('name', result.assets[0].name)
          handleChange('fileUri', result.assets[0].uri)
        }else{
          Alert.alert(
            'Archivo demasiado grande', // Título del alerta
            'El archivo seleccionado supera el tamaño máximo permitido de 2.5 MB.', // Mensaje
            [{ text: 'OK' }] // Botón de acción
          );
        }
      }
    } catch (error) {
      console.error('Error seleccionando archivo: ', error);
    }
  };

  const handleDelete = () => {
    handleChange('fileUri', '')
    handleChange('name', '')
    setFileUri('')
  }

  console.log(values);

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
        <Appbar.Content title="Subir Documentos" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomSelect
          open={openArchivo}
          value={values.id_tipo_archivo}
          items={tipoId === 1 ? clientes : vehiculos} // Corregir la lista de items
          setOpen={setOpenArchivo}
          onChangeValue={(value) => handleChange('id_tipo_archivo', value)}
          placeholder="Tipo de archivo"
        />
        {!fileUri && (
          <>
            <Text style={styles.instructions}>
              Tomar foto o sube un archivo
            </Text>

            <View style={styles.uploadBox}>
            <View style={styles.buttonContainer}>
              <Button icon="camera" 
                onPress={pickImage} 
                labelStyle={{ color: colors.textWhite }}
                style={{ backgroundColor: colors.primary, color: colors.textWhite }}
                >
                Tomar Foto
              </Button>
              <View style={styles.separatorContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.line} />
              </View>
              <Button icon="folder" 
                onPress={pickDocument}
                labelStyle={{ color: colors.textWhite }}
                style={{ backgroundColor: colors.primary, color: colors.textWhite }} >
                Seleccionar Archivo
              </Button>
            </View>
            <Text style={styles.supportedFiles}>
              Tamaño maximo de 2.5 mb
            </Text>
          </View> 
          </>
          )}

        {fileUri && (
          <View style={styles.card}>
           
              {fileUri.endsWith('.jpg') || fileUri.endsWith('.png') || fileUri.endsWith('.jpeg') ? (
                <Image source={{ uri: fileUri }} style={styles.image} />
              ) : (
                <>
                <Entypo name="folder" size={80} color={colors.primary} />
                  <Text style={styles.supportedFiles}>
                    { values.name}
                  </Text>
                </>
              )}
          </View>
        )}

        {fileUri && (
          <View style={styles.BorrarButtonContainer}>
            <Button icon="delete" 
              onPress={handleDelete}  
              labelStyle={{ color: colors.textWhite }}
              style={[styles.button, { backgroundColor: colors.danger, color: colors.textWhite }]}>
              Borrar
            </Button>
          </View>
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
    marginTop: 30,
    alignItems: 'center', // Centrar los textos en las columnas
  },
  header: {
    height: theme.colors.tamanoAppBar,
  },
  buttonContainer: {
    marginVertical: 10, 
  },
  BorrarButtonContainer: {
    marginTop: 20,
  },
  submitButtonContainer: {
    marginTop: 10,
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
  containerDetail: {
    padding: 10, 
  },

  instructions: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 20
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    marginBottom: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16, // Espacio arriba y abajo del separador
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d3d3', // Color gris claro
    marginHorizontal: 10, // Espacio entre la línea y el texto
  },
  orText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  browseButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  supportedFiles: {
    fontSize: 12,
    marginBottom: 20,
    color: 'gray',
  },
 
});

export default UploadScreen;
