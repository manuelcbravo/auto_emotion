import React, { useState, useRef, useEffect  } from 'react';
import { Card, Text, Avatar, Button, useTheme, Divider, Menu, IconButton } from 'react-native-paper';
import { StyleSheet, View, TouchableOpacity, Platform   } from 'react-native';
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomCard({ onPress, card }) {
  const { colors } = useTheme();
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [opcionesMarca, setOpcionesMarca] = useState([]);
  const [opcionesModelo, setOpcionesModelo] = useState([]);
  const [visibleMenu, setVisibleMenu] = useState(null); 

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

  const openMenu = (id) => setVisibleMenu(id);
  const closeMenu = () => setVisibleMenu(null);

  return (
    <TouchableOpacity  style={styles.container}>
      <Card style={styles.card} onPress={onPress} mode={ 'elevated' }>
        <Card.Title
          title={buscarEnOpciones(card.id_marca, opcionesMarca)  + ' ' + buscarEnOpciones(card.id_modelo, opcionesModelo)}
          titleStyle={{ fontSize: 16, fontWeight: 'bold', marginBottom: -4 }} // Ajusta el margen inferior
          subtitle={ card.version ?? '-' }
          subtitleStyle={{ fontSize: 16, marginTop: -4 }} // Ajusta el margen superior
          left={(props: any) => <Avatar.Icon {...props} icon="car" />}
          right={(props: any) => (
            <Menu
              visible={visibleMenu === card.id}
              onDismiss={closeMenu}
              anchor={
                <IconButton icon="dots-vertical" onPress={() => openMenu(card.id)} />
              }
            >
              <Menu.Item onPress={() => console.log('Eliminar')} title="Eliminar" icon="delete" />
              <Divider />
              <Menu.Item onPress={() => console.log('Copiar')} title="Copiar" icon="content-copy" />
            </Menu>
          )}
        />
        <Card.Content style={{ paddingBottom: 0}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[styles.uppercaseText, { color: colors.text, fontSize: 14 }]}>{card.cliente}</Text>
          <View style={{ backgroundColor: card.estatus === 'Activo' ? '#4caf50' : card.estatus === 'Inactivo' ? '#f44336' : '#ff9800', padding: 1, borderRadius: 5 }}>
            <Text style={[styles.cardTitle, { color: colors.textWhite, fontSize: colors.fonSizeCard, backgroundColor: card.estatus === 'Activo' ? '#4caf50' : card.estatus === 'Inactivo' ? '#f44336' : '#ff9800' }]}>
              {card.estatus ?? 'AAA000'}
            </Text>
          </View>
        </View>
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
  cardSubTitle: {
    fontSize: 14
  },
  divider: {
    marginTop:10,
    marginBottom: 10
  }
});