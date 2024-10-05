import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Appbar, Card, TextInput, Button, useTheme, Text as TextPaper } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa el ícono de cámara
import { CameraView, useCameraPermissions } from 'expo-camera';
import CamaraPrincipalComponent from '../../components/CamaraPrincipalComponent';
import CustomSelect from '../../components/Form/CustomSelect';
import useForm from '../../components/Form/useForm'; // Importa tu hook useForm
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../../core/theme'
import InputComponent from '../../components/Form/InputComponent';

export default function InteriorTapiceriaScreen({ navigation, route }) {
  const { id, step } = route.params;
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // Crea una referencia para la cámara
  const [image, setImage] = useState([]);
  const { values, handleChange, setValues, handleChangeNested } = useForm({});
  const [fetchCompleted, setFetchCompleted] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);
  const [parsedSession, setParsedSession] = useState({});
  const [opcionesVarlor, setOpcionesValor] = useState([]);
  const [openPuerta, setOpenPuerta] = useState(false);
  const { colors } = useTheme();

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

          setValues({
            ...data_evaluation,
          });

          const opcionesVarlor = data_form.inspeccion_estatus.map((inspeccion_estatus) => ({
            label: inspeccion_estatus.nombre,
            value: inspeccion_estatus.id.toString(),
          }));
          setOpcionesValor(opcionesVarlor);
          
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

  const getValorTexto = (id) => {
    switch (id) {
      case 1:
        return "vidrios";
      case 2:
        return "interiores";
      case 3:
        return "llantas";
      case 4:
        return "hojalateria";
      case 5:
        return "mecanica";
      case 6:
        return "prueba";
      default:
        return "ID no válido";
    }
  };
  
  const valor_texto = getValorTexto(step);
  
  const texto_titulos = [
    "Vidrios",
    "Interior y Tapiceria",
    "Llantas y rines",
    "Hojalatería y pintura",
    "Mecánica",
    "Prueba de manejo",
  ];

  const fotos_texto = [
    "Detalle 1",
    "Detalle 2",
    "Detalle 3",
    "Detalle 4",
    "Detalle 5",
    "Detalle 6",
  ];

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleSave = async () => {
    if (parsedSession && parsedSession.datos_api && values) {

      const updatedDatosApi = parsedSession.datos_api.map(item => {
        // Si encontramos un sub-arreglo con el mismo id que values.id, lo reemplazamos
        if (item.id === values.id) {
          return values; // Reemplazamos con todo el objeto values
        }
        return item; // Mantenemos el sub-arreglo sin cambios si no es el que buscamos
      });

      // Actualizamos parsedSession con los datos actualizados de datos_api
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
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
      const index = (values?.[valor_texto]?.fotos?.length ?? 0);
  
      const newPhoto = { uri: photo.uri, index, guardado: 0, tipo: step };
  
      // Verificar si existe values[valor_texto].fotos
      if (!values?.[valor_texto]?.fotos) {
        // Si no existe, inicializar con un arreglo que contenga la nueva foto
        setValues({
          ...values,
          [valor_texto]: {
            ...values[valor_texto],
            fotos: [newPhoto]
          }
        });
      } else {
        // Si existe, agregar la nueva foto al arreglo existente
        handleChangeNested(`${valor_texto}.fotos`, [...values[valor_texto].fotos, newPhoto]);
  
        // Verificar si se han tomado todas las fotos necesarias
        if (fotos_texto.length === (values[valor_texto].fotos.length + 1)) {
          setShowCamera(false);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
        {!showCamera && (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={ texto_titulos[step-1] } />
            </Appbar.Header>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
              <ScrollView contentContainerStyle={styles.scrollView} nestedScrollEnabled={true}>
              
                <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 10 }}>
                  Estado y Costos
                </TextPaper>
                
                <View style={styles.selectorsContainer }>
                  <CustomSelect
                    open={openPuerta}
                    setOpen={setOpenPuerta}
                    value={values[valor_texto]?.id_estado} // Asegúrate de usar el valor del estado actualizado
                    items={opcionesVarlor}
                    onChangeValue={(value) => handleChangeNested(`${valor_texto}.id_estado`, value)}
                    placeholder="Estado del artículo"
                  />
                </View>
                <InputComponent
                  placeholder="Observaciones"
                  value={values[valor_texto]?.observaciones} // Asegúrate de usar el valor del estado actualizado
                  onChangeText={(text) => handleChangeNested(`${valor_texto}.observaciones`, text)}
                />
                <InputComponent
                  placeholder="Costo Previsto"
                  value={values[valor_texto]?.costo_previsto} // Asegúrate de usar el valor del estado actualizado
                  onChangeText={(text) => handleChangeNested(`${valor_texto}.costo_previsto`, text)}
                  keyboardType="numeric"
                />
                
                <Card style={styles.card}>
                  <Card.Title title="Fotos" />
                  <Card.Content style={styles.photoCardContent}>
                    {values[valor_texto] && values[valor_texto].fotos && values[valor_texto].fotos.length > 0 ? (
                      <View style={styles.container_photo}>
                        {values[valor_texto].fotos.map((imgSrc, index) => (
                          <TouchableOpacity key={index} onPress={() => console.log("Foto presionada", imgSrc)}>
                            <Image source={{ uri: imgSrc.uri }} style={styles.image} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.photoText}>No hay foto</Text>
                    )}
                  </Card.Content>
                  <View>
                      <Button
                      mode="contained"
                      onPress={handleAddPhoto}
                      style={[styles.fullButton, { backgroundColor: colors.primary}]}
                      icon={({ size, color }) => (
                          <Icon name="camera" size={size} color={color} />
                      )}
                      >
                      Tomar Foto
                      </Button>
                  </View>
                </Card>
              </ScrollView>
            </KeyboardAvoidingView>
            <View style={[styles.buttonContainer, { backgroundColor: colors.primary}]}>
              <TouchableOpacity onPress={handleSave} style={styles.button} color={theme.colors.buttonPaso}>
                <Text style={styles.buttonText}>Guardar y avanzar</Text>
              </TouchableOpacity>
            </View>
        </View>)}
        {showCamera && (
            <CamaraPrincipalComponent takePicture={takePicture} setShowCamera={setShowCamera} cameraRef={cameraRef} bottomText={fotos_texto[(values[valor_texto]?.fotos?.length ?? 0)]} />
          )}
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    marginVertical: 10,
    paddingBottom: 0,
  },
  input: {
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: theme.colors.buttonPaso, 
    alignItems: 'center',
  },
  buttonText:{
    color: theme.colors.textWhite,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullButton: {
    marginTop: 10,
    width: '100%', 
    backgroundColor: theme.colors.buttonPaso,
    borderRadius: 0,
  },
  header: {
    height: 60 * 0.7, 
  },
  photoCardContent: {
    paddingBottom: 0, 
  },
  photoText: {
    textAlign: 'center', 
    marginBottom: 10,
  },
  containerCamera: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraCamera: {
    flex: 1,
  },
  buttonContainerCamera: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  buttonCamera: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  textCamera: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover', // Esto ajusta la imagen para que cubra el tamaño especificado
    borderRadius: 8, // O cualquier otro radio de borde que desees
  },
  selectorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      ios: { zIndex: 100 },
      android: {},
      // Puedes agregar más plataformas si es necesario
    }),
  },
  container_photo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Esto añade espacio entre las imágenes
  },
  scrollView: {
    padding: 15,
  },
  content: {
    flex: 1
  },
});