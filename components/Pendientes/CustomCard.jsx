import React, { useState, useRef, useEffect  } from 'react';
import { Card, Text, Avatar, Button, useTheme, Divider } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, Platform   } from 'react-native';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomCard({ onPress, card }) {
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

  return (
    <TouchableOpacity  style={styles.container}>
      <Card style={styles.card} onPress={onPress} mode={ 'elevated' }>
        <Card.Content style={{ paddingBottom: 0}}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{ buscarEnOpciones(card.id_marca, opcionesMarca)  + ' ' + buscarEnOpciones(card.id_modelo, opcionesModelo)  } </Text>
            <Text style={[styles.date, { color: colors.text }]}>18/02/2019</Text>
          </View>
          <Text style={styles.cardSubTitle}>
            { card.version ?? '-' }
          </Text>
          <View style={{ backgroundColor: colors.primary, alignSelf: 'flex-start', padding: 1, borderRadius: 5 }}>
            <Text style={[styles.cardTitle, { color: colors.textWhite, fontSize: colors.fonSizeCard }]}>
              {card.placa ?? 'AAA000'}
            </Text>
          </View>
          <Text style={[styles.uppercaseText, { color: colors.text }]}>VENDEDOR: {card.valuador}</Text>
          <Text style={[styles.uppercaseText, { color: colors.text, fontSize: 12 }]}>CLIENTE: {card.cliente}</Text>

          <Divider style={styles.divider}/>

          <View style={styles.iconsContainer}>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="calendar-alt" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>/2024</Text>
            </View>
            <View style={styles.iconWrapper}>
              <AntDesign name="dashboard" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>-</Text>
            </View>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="paint-brush" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>{ card.kilometraje ?? '-' }</Text>
            </View>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="car-shift-pattern" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>0</Text>
            </View>
            <View style={styles.iconWrapper}>
              <MaterialCommunityIcons name="car-door" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>-</Text>
            </View>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="gas-pump" size={16} color={colors.text} />
              <Text style={{ color: colors.text, fontSize: colors.fonSizeCard }}>-</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity >
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
    marginBottom: 8,
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
  divider: {
    marginTop:10,
    marginBottom: 10
  }
});