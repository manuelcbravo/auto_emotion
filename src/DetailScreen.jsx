import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity, Modal, Image, FlatList, SectionList } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, useTheme, Text as TextPaper, Chip } from 'react-native-paper';
import { MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons'; // Importamos los íconos
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
            

            if (data_evaluation) {
              setValues({
                  ...data_evaluation,
              });

              setArchivosClientes(Array.isArray(data_evaluation.archivos_clientes) ? data_evaluation.archivos_clientes : JSON.parse(data_evaluation.archivos_clientes || '[]'));
              setArchivosVehiculos(Array.isArray(data_evaluation.archivos_vehiculos) ? data_evaluation.archivos_vehiculos : JSON.parse(data_evaluation.archivos_vehiculos || '[]'));
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


  const ArchivoItem = ({ archivo }) => (
    <TouchableOpacity style={[styles.itemContainer, { backgroundColor: 'white' }]} onPress={() => abrirModal(archivo.direccion)}>
      <Entypo name="folder" size={50} color={colors.primary} />
      <Text style={styles.nombre}>{archivo.nombre}</Text>
    </TouchableOpacity>
  );
  
  const renderGridItems = (items) => {
    const numColumns = 3;

    const rows = [];
    for (let i = 0; i < items.length; i += numColumns) {
      rows.push(items.slice(i, i + numColumns));
    }

    return rows.map((rowItems, rowIndex) => {    
      return (
        <View key={rowIndex} style={styles.row}>
          {rowItems.map((item) => (
            <ArchivoItem key={item.id} archivo={item} />
          ))}
    
          {rowItems.length < numColumns &&
            Array.from({ length: numColumns - rowItems.length }).map((_, emptyIndex) => (
              <View key={`empty-${rowIndex}-${emptyIndex}`} style={[styles.itemContainer, { opacity: 0 }]} />
            ))}
        </View>
      );
    });
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} nestedScrollEnabled={true}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: routes + 'api/archivos/' + obtenerFoto(values) }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.containerDetail}>
          <TextPaper variant="titleLarge" style={{ fontWeight: 600 }}>
            {buscarEnOpciones(values.id_marca, opcionesMarca)} {buscarEnOpciones(values.id_modelo, opcionesModelo)}
          </TextPaper>
          <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 20 }}>
            { values.version ?? '-'}
          </TextPaper>

          <View style={styles.detailsContainer}>
            <View style={styles.detailColumn}>
              <TextPaper style={styles.label}>Año</TextPaper>
              <TextPaper style={styles.value}>{buscarEnOpciones(values.id_anio, opcionesAnioLanzamiento)}</TextPaper>

              <TextPaper style={styles.label}>Combustible</TextPaper>
              <TextPaper style={styles.value}>{buscarEnOpciones(values.id_combustible, opcionesCombustible)}</TextPaper>

              <TextPaper style={styles.label}>Placas</TextPaper>
              <TextPaper style={styles.value}>{values.placa ?? '-'}</TextPaper>
            </View>

            <View style={styles.detailColumn}>
              <TextPaper style={styles.label}>Color</TextPaper>
              <TextPaper style={styles.value}>{buscarEnOpciones(values.id_color, opcionesColor)}</TextPaper>

              <TextPaper style={styles.label}>Puertas</TextPaper>
              <TextPaper style={styles.value}>{values.id_cantidad_puertas ?? '-'}</TextPaper>

              <TextPaper style={styles.label}>Precio compra</TextPaper>
              <TextPaper style={styles.value2}>${values.valor_compra ?? '4500000.00'}</TextPaper>
            </View>

            <View style={styles.detailColumn}>
              <TextPaper style={styles.label}>Kilometraje</TextPaper>
              <TextPaper style={styles.value}>{values.kilometraje ?? '-'} km</TextPaper>

              <TextPaper style={styles.label}>Transmisión</TextPaper>
              <TextPaper style={styles.value}>{buscarEnOpciones(values.id_transmision, opcionesTransmision)}</TextPaper>

              <TextPaper style={styles.label}>Precio venta</TextPaper>
              <TextPaper style={styles.value2}>${values.valor_venta ?? '4500000.00'}</TextPaper>
            </View>
          </View>
          <View style={styles.detail2Column}>
            <TextPaper style={styles.label}>V.I.N.</TextPaper>
            <TextPaper style={styles.value}>{values.vin ?? '-'}</TextPaper>
          </View>
          <View style={styles.detail2Column}>
            <TextPaper style={styles.label}>Asesor</TextPaper>
            <TextPaper style={styles.value}>{values.valuador}</TextPaper>
          </View>
        </View>

        <View style={styles.containerHeader}>
          <View style={styles.detailsContainer}>
            <TextPaper variant="titleMedium" style={{ fontWeight: 400}}>
              Archivos Cliente
            </TextPaper>
            <Chip icon={() => (
                      <MaterialIcons name="add" size={11} color="white" />
                  )} 
                  onPress={() => handleCardPress(1)} 
                  style={{
                    backgroundColor: colors.secondary,
                    height: 32,
                    borderRadius: 15,
                  }}
                  selectedColor={colors.textWhite}
                  textStyle={{
                    fontSize: 11,  // Tamaño más pequeño de la letra
                    color: colors.textWhite,
                  }}
                  >
                    Agregar
            </Chip>
          </View>
        </View>
        
        { archivosClientes && archivosClientes.length > 0 ? (
          renderGridItems(archivosClientes)
        ) : (
          <Card style={{ margin: 10 }}>
            <Card.Content>
              <Paragraph>No hay archivos disponibles.</Paragraph>
            </Card.Content>
          </Card>
        )}
          

        <View style={[styles.containerHeader, {marginTop: 20}]}>
          <View style={styles.detailsContainer}>
            <TextPaper variant="titleMedium" style={{ fontWeight: 400}}>
              Archivos Vehículos
            </TextPaper>
            <Chip icon={() => (
                      <MaterialIcons name="add" size={11} color="white" />
                  )} 
                  onPress={() => handleCardPress(2)} 
                  style={{
                    backgroundColor: colors.secondary,
                    height: 32,
                    borderRadius: 15,
                  }}
                  selectedColor={colors.textWhite}
                  textStyle={{
                    fontSize: 11,  // Tamaño más pequeño de la letra
                    color: colors.textWhite,
                  }}
                  >
                    Agregar
            </Chip>
          </View>
        </View>
        
        { archivosVehiculos && archivosVehiculos.length > 0 ? (
          renderGridItems(archivosVehiculos)
        ) : (
          <Card style={{ margin: 10 }}>
            <Card.Content>
              <Paragraph>No hay archivos disponibles.</Paragraph>
            </Card.Content>
          </Card>
        )}
        
      </ScrollView>

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
    height: 250,
    resizeMode: 'cover',
  },
  archivosGrid: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
  },
  archivoItem: {
    width: '22%',
    marginBottom: 15, 
    alignItems: 'center', 
    marginHorizontal: '1%', 
  },
  archivoContainer: {
    alignItems: 'center', 
  },
  archivoNombre: {
    marginTop: 5, 
    textAlign: 'center', 
    fontSize: 12, 
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 8,
    alignItems: 'center', 
  },
  imageContainer: {
    position: 'relative', 
    width: '100%', 
    height: 250, 
    backgroundColor: '#ccc', 
  },

  containerDetail: {
    padding: 16, 
  },
  containerHeader: {
    paddingLeft: 10, 
    paddingRight: 10, 
  },
  detailsContainer: {
    flexDirection: 'row', // Columnas
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
    alignItems: 'left', // Centrar los textos en las columnas
  },
  detail2Column: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: 'gray',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8, // Espacio entre los pares label/valor
  },
  value2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009040',
    marginBottom: 8, // Espacio entre los pares label/valor
  },
  gridContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espacio entre los elementos
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  nombre: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default DetailScreen;
