import React, { useState, useRef, useEffect  } from 'react';
import { Card, Text, Avatar, Button, useTheme, Divider  } from 'react-native-paper';
import { StyleSheet, View,TouchableOpacity, Platform  } from 'react-native';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomCard({ onPress, card, route }) {
  const { colors } = useTheme();
  const [fetchCompleted, setFetchCompleted] = useState(false); // Estado para controlar si la solicitud ya se ha completado
  const [opcionesPuertas, setOpcionesPuertas] = useState([]);
  const [opcionesColor, setOpcionesColor] = useState([]);
  const [opcionesTransmision, setOpcionesTransmision] = useState([]);
  const [opcionesCombustible, setOpcionesCombustible] = useState([]);
  const [opcionesMarca, setOpcionesMarca] = useState([]);
  const [opcionesModelo, setOpcionesModelo] = useState([]);
  const [opcionesAnioLanzamiento, setOpcionesAnioLanzamiento] = useState([]);

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

  // console.log(route + 'api/archivos/' + obtenerFoto(card));

  return (
    <TouchableOpacity style={styles.container}>
    <Card style={styles.card} onPress={onPress} mode={'elevated'}>
      <Card.Cover 
        source={{ uri: route + 'api/archivos/' + obtenerFoto(card) }} 
        style={styles.image}
      />
      <Card.Content style={{ paddingBottom: 0}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{ buscarEnOpciones(card.id_marca, opcionesMarca)  + ' ' + buscarEnOpciones(card.id_modelo, opcionesModelo)  } </Text>
          <Text style={[styles.date, { color: colors.text }]}>18/02/2019</Text>
        </View>
        <Text style={styles.cardSubTitle}>
          { card.version ?? '-' }
        </Text>
        <View style={{ backgroundColor: colors.primary, alignSelf: 'flex-start', padding: 0, borderRadius: 5 }}>
          <Text style={[styles.cardTitle, { color: colors.textWhite, fontSize: colors.fonSizeCard }]}>
            {card.placa ?? 'AAA000'}
          </Text>
        </View>
        <Text style={[styles.uppercaseText, { color: colors.text }]}>VENDEDOR: {card.valuador}</Text>
        <Text style={[styles.uppercaseText, { color: colors.text, fontSize: 12 }]}>CLIENTE: {card.cliente}</Text>
        
        <Divider style={styles.divider}/>

        <View style={styles.iconsContainer}>
          <View style={styles.iconWrapper}>
            <FontAwesome5 name="calendar-alt" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard}}>{buscarEnOpciones(card.id_anio, opcionesAnioLanzamiento)}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <AntDesign name="dashboard" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{ card.kilometraje ?? '-'}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <FontAwesome5 name="paint-brush" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{buscarEnOpciones(card.id_color, opcionesColor)}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="car-shift-pattern" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{buscarEnOpciones(card.id_transmision, opcionesTransmision)}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="car-door" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{card.id_cantidad_puertas ?? '-'}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <FontAwesome5 name="gas-pump" size={14} color={colors.text} />
            <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{buscarEnOpciones(card.id_combustible, opcionesCombustible)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  card: {
    width: '100%',
    borderRadius: 10, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    margin: 3,
  },
  date: {
    fontSize: 12,
  },
  observaciones: {
    marginVertical: 16,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3
  },
  iconWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  alternativeContainer: {
    borderRadius: 4,
    marginVertical: 2,
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 120,
  },
  headerText:{
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardSubTitle: {
    fontSize: 14
  },
  divider: {
    marginTop:10,
    marginBottom: 10
  }
});