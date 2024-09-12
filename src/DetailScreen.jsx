import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, Modal, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Importamos los íconos
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useForm from '../components/Form/useForm'; // Importa tu hook useForm

const DetailScreen = ({ navigation, route }) => {
  const { id, routes } = route.params;
  const { values, handleChange, setValues } = useForm({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [parsedSession, setParsedSession] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { colors } = useTheme();
  const [fetchCompleted, setFetchCompleted] = useState(false); // Estado para controlar si la solicitud ya se ha completado
  const [opcionesPuertas, setOpcionesPuertas] = useState([]);
  const [opcionesColor, setOpcionesColor] = useState([]);
  const [opcionesTransmision, setOpcionesTransmision] = useState([]);
  const [opcionesCombustible, setOpcionesCombustible] = useState([]);
  const [opcionesMarca, setOpcionesMarca] = useState([]);
  const [opcionesModelo, setOpcionesModelo] = useState([]);
  const [archivosClientes, setArchivosClientes] = useState([]);
  const [archivosVehiculos, setArchivosVehiculos] = useState([]);
  const [opcionesAnioLanzamiento, setOpcionesAnioLanzamiento] = useState([]);

  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);

  const buscarEnOpciones = (id, opciones) => {
    const resultado = opciones.find(opcion => opcion.value === id?.toString());
    if (resultado) {
      // Elimina los paréntesis y su contenido
      return resultado.label.replace(/\s*\(.*?\)\s*/g, '').trim();
    }
    return '-';
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
          const data_form = parsedSessionObj.datos_formulario;

          const opcionesPuertas = data_form.puertas.map((puerta) => ({
            label: puerta.nombre,
            value: puerta.id.toString(),
          }));
          setOpcionesPuertas(opcionesPuertas);

          const opcionesColor = data_form.colores.map((color) => ({
            label: color.nombre,
            value: color.id.toString(),
          }));
          setOpcionesColor(opcionesColor);

          const opcionesTransmision = data_form.transmisiones.map((transmision) => ({
            label: transmision.nombre,
            value: transmision.id.toString(),
          }));
          setOpcionesTransmision(opcionesTransmision);


          const opcionesCombustible = data_form.combustibles.map((combustible) => ({
            label: combustible.nombre,
            value: combustible.id.toString(),
          }));
          setOpcionesCombustible(opcionesCombustible);

          const opcionesMarca = data_form.marcas.map((marca) => ({
            label: marca.name,
            value: marca.id.toString(),
          }));
          setOpcionesMarca(opcionesMarca);

          const opcionesModelo = data_form.modelos.map((modelo) => ({
            label: modelo.name,
            value: modelo.id.toString(),
          }));
          setOpcionesModelo(opcionesModelo);

          const opcionesAnioLanzamiento = data_form.anios.map((anio) => ({
            label: anio.name,
            value: anio.id.toString(),
          }));
          setOpcionesAnioLanzamiento(opcionesAnioLanzamiento); 

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

  const obtenerFoto = (card) => {
    if (card.foto_general && card.foto_general.length > 0) {
      return card.foto_general[0];
    } else if (card.foto_principal) {
      return card.foto_principal;
    } else {
      return "fotos/NA";
    }
  };

  const abrirModal = (direccion) => {
    setModalContent(routes + 'api/archivos/' + direccion);
    setModalVisible(true);
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          let session = Platform.OS === 'web' ? localStorage.getItem('session_automotion') : await AsyncStorage.getItem('session_automotion');

          if (session) {
            const parsedSessionObj = JSON.parse(session);
            setParsedSession(parsedSessionObj);

            const data_evaluation = evaluacion(parsedSessionObj.datos_api, id);
            setArchivosClientes(Array.isArray(values.archivos_clientes) ? values.archivos_clientes : JSON.parse(values.archivos_clientes || '[]'));
            setArchivosVehiculos(Array.isArray(values.archivos_vehiculos) ? values.archivos_vehiculos : JSON.parse(values.archivos_vehiculos || '[]'));

            if (data_evaluation) {
              setValues({
                  ...data_evaluation,
              });
            } else {
              setError(new Error('No se encontró la evaluación.'));
            }
          } else {
            setError(new Error('No se encontró la sesión.'));
          }
        } catch (error) {
          console.error('Error fetching session or data:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
  }, [id]);

  const handleCardPress = (tipo) => {
    navigation.navigate('UploadScreen', { tipoId: tipo, id: id, routes: routes });
  };

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

  

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalles" />
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollView} nestedScrollEnabled={true}>
          <Card style={{ margin: 10 }}>
            <Card.Cover source={{ uri:  routes + 'api/archivos/' + obtenerFoto(values) }} />
            <Card.Content>
              <Title>{values.cliente}</Title>
              <Paragraph>Marca: {buscarEnOpciones(values.id_marca, opcionesMarca)}</Paragraph>
              <Paragraph>Modelo: {buscarEnOpciones(values.id_modelo, opcionesModelo)}</Paragraph>
              <Paragraph>Versión: { values.version ?? '-'}</Paragraph>
              <Paragraph>Año: {buscarEnOpciones(values.id_anio, opcionesAnioLanzamiento)}</Paragraph>
              <Paragraph>Cliente: {values.cliente}</Paragraph>
              <Paragraph>Kilometraje: {values.kilometraje} km</Paragraph>
              <Paragraph>Placa: {values.placa}</Paragraph>
              <Paragraph>V.I.N.: {values.vin}</Paragraph>
              <Paragraph>Vendedor: {values.valuador}</Paragraph>
            </Card.Content>
          </Card>

          {/* Archivos Cliente */}
          <Card style={{ margin: 10 }} onPress={() => handleCardPress(1)}>
            <Card.Content>
              <Title>Archivos Cliente</Title>
              { archivosClientes && archivosClientes.length > 0 ? (
                archivosClientes.map((archivo, index) => (
                  <TouchableOpacity key={index} onPress={() => abrirModal(archivo.direccion)} style={styles.archivoItem}>
                    <View style={styles.archivoContainer}>
                      <MaterialIcons name="insert-drive-file" size={50} color={colors.primary} />
                      <Paragraph style={styles.archivoNombre}>{archivo.nombre}</Paragraph>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Paragraph>No hay archivos disponibles, da click para subir los archivos.</Paragraph>
              )}
            </Card.Content>
          </Card>
          <Card style={{ margin: 10 }} onPress={() => handleCardPress(2)}>
            <Card.Content>
              <Title>Archivos Vehículos</Title>
              { archivosVehiculos && archivosVehiculos.length > 0 ? (
                archivosVehiculos.map((archivo, index) => (
                  <TouchableOpacity key={index} onPress={() => abrirModal(archivo.direccion)} style={styles.archivoItem}>
                    <View style={styles.archivoContainer}>
                      <MaterialIcons name="insert-drive-file" size={50} color={colors.primary} />
                      <Paragraph style={styles.archivoNombre}>{archivo.nombre}</Paragraph>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Paragraph>No hay archivos disponibles, da click para subir los archivos.</Paragraph>
              )}
          </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal para previsualizar archivos */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Image source={{ uri: modalContent }} style={styles.image} />
            <Button onPress={() => setModalVisible(false)}>Cerrar</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  header: {
    height: theme.colors.tamanoAppBar,
  },
  scrollView: {
    paddingBottom: 10
  },
  archivoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  archivosGrid: {
    flexDirection: 'row', // Asegura que los elementos se posicionen en fila
    flexWrap: 'wrap', // Permite que los elementos bajen a la siguiente línea si no caben en la fila
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
  },
  archivoItem: {
    width: '22%', // Aproximadamente 22% del ancho para permitir 4 ítems en la fila
    marginBottom: 15, // Espacio vertical entre las filas
    alignItems: 'center', // Centra el ícono y el texto horizontalmente
    marginHorizontal: '1%', // Espacio horizontal entre ítems
  },
  archivoContainer: {
    alignItems: 'center', // Centra el contenido dentro de cada ítem
  },
  archivoNombre: {
    marginTop: 5, // Espacio entre el ícono y el nombre
    textAlign: 'center', // Centra el texto debajo del ícono
    fontSize: 12, // Tamaño pequeño para el texto
  },
});

export default DetailScreen;
