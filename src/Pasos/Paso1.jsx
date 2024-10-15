import React, { useState, useRef, useEffect  } from 'react';
import { View, ScrollView, StyleSheet, Button, KeyboardAvoidingView, Platform, Modal, Text, Switch, Pressable, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Appbar, Card, Button as ButtonP, useTheme, Text as TextPaper } from 'react-native-paper';
import InputComponent from '../../components/Form/InputComponent';
import CustomSelect from '../../components/Form/CustomSelect';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../core/theme'
import CamaraPrincipalComponent from '../../components/CamaraPrincipalComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { getEvaluacion, getVersion } from '../../axiosConfig'; 
import useForm from '../../components/Form/useForm'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import DropDownPicker from 'react-native-dropdown-picker';
import Wizard from '../../components/Form/Wizard';


export default function Paso1({ navigation, route }) {
  const { colors } = useTheme();
  const { id, step } = route.params;
  const [loading, setLoading] = useState(true);
  const [loadingVersion, setLoadingVersion] = useState(false);
  const [error, setError] = useState(null);
  const [fetchCompleted, setFetchCompleted] = useState(false); 
  const [opcionesPuertas, setOpcionesPuertas] = useState([]);
  const [opcionesColor, setOpcionesColor] = useState([]);
  const [opcionesTransmision, setOpcionesTransmision] = useState([]);
  const [opcionesProcedencia, setOpcionesProcedencia] = useState([]);
  const [opcionesCombustible, setOpcionesCombustible] = useState([]);
  const [opcionesMarca, setOpcionesMarca] = useState([]);
  const [opcionesModelo, setOpcionesModelo] = useState([]);
  const [modelo, setModelo] = useState([]);
  const [opcionesAnioLanzamiento, setOpcionesAnioLanzamiento] = useState([]);
  const [opcionesVersion, setOpcionesVersion] = useState([]);
  const [proceed, setProceed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const initialValues = {
    cliente: '',
    celular: '',
    email: '',
    id: '',
    id_vendedor: '',
    id_cliente: '',
    id_tipo_evaluacion: '',
    id_estatus_evaluacion: 1,
    id_modelo: '',
    id_marca: '',
    id_version: '',
    vin: '',
    dinero_expectativa: '0.00',
    observacion_primer_comentario: '',
    android_apple: false,
    airbags: false,
    airbags_laterales: false,
    airbags_cortina: false,
    aire_automatico: false,
    aire: false,
    alarma: false,
    asiento_electrico: false,
    asiento_aquecidos: false,
    bluetooth: false,
    bola_remolque: false,
    caja_automatica: false,
    cambios_volante: false,
    compu_viaje: false,
    cristales: false,
    cruise: false,
    direccion_asistida: false,
    quemacocos: false,
    auxiliar: false,
    usb: false,
    espejos_electricos: false,
    f_niebla: false,
    f_xenon: false,
    f_xenon_bi: false,
    gps: false,
    isofix: false,
    llantas_refaccion: false,
    cajuela_electrica: false,
    quemacocos_abatible: false,
    radio_cd: false,
    dvd: false,
    sensores_atras: false,
    sensores_frente: false,
    sensores_lluvia: false,
    sensores_luces: false,
    sensores_llantas: false,
    suspension: false,
    tapiceria: false,
    tapiceria_piel: false,
    techo: false,
    vidrios_electricos_f: false,
    volante_multifunciones: false,
    sellos_concesionado: false,
    vehiculo_financiado: false,
    primer_dueño: false,
    fumaban_auto: false,
    historial_servicio: false,
    manual_propietario: false,
    siniestro: false,
    duplicado_llaves: false,
    factura: false,
    tenencia: false,
    tarjeta_circulacion: false,
    multas: false,
    clasificacion: '',
    finalidad: '',
    gasto_previsto: '',
    valor_compra: '',
    valor_venta: '',
    descripcion: '',
    id_anio_fabricacion: '',
    kilometraje: '',
    id_color: '',
    id_combustible: '',
    id_transmision: '',
    id_procedencia: '',
    placa: '',
    id_cantidad_puertas: '',
    id_anio: '',
    guardado: false,
    local: false,
    version: '',
    id_solicitante: '',
    id_empresa: '',
    fotos_general : [],
    vidrios: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 1, 
    "observaciones": "",
    "fotos": []},
    interiores: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 2, 
    "observaciones": "",
    "fotos": []},
    llantas: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 3, 
    "observaciones": "",
    "fotos": []},
    hojalateria: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 4, 
    "observaciones": "",
    "fotos": []},
    mecanica: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 5, 
    "observaciones": "",
    "fotos": []},
    prueba: {"costo_previsto": "0", 
    "id_estado": 0, 
    "id_evaluacion": "", 
    "id_tipo": 6, 
    "observaciones": "",
    "fotos": []}
  };


  const { values, handleChange, setValues } = useForm(initialValues);
  const evaluacion = (session, evalId) => session.find(item => item.id === evalId);

  //camara
  const [showCamera, setShowCamera] = useState(false);
  const [parsedSession, setParsedSession] = useState({});
  // const [image, setImage] = useState([]);
  const cameraRef = useRef(null);

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
          const nombre = parsedSessionObj.nombre;
          const id_valuador = parsedSessionObj.id;
          const id_empresa = parsedSessionObj.id_empresa;
          
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

          const opcionesProcedencia = data_form.procedencias.map((procedencia) => ({
            label: procedencia.nombre,
            value: procedencia.id.toString(),
          }));
          setOpcionesProcedencia(opcionesProcedencia);

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

          const opcionesModelo = data_form.modelos;
          setModelo(opcionesModelo);

          const opcionesAnioLanzamiento = data_form.anios.map((anio) => ({
            label: anio.name,
            value: anio.id.toString(),
          }));
          setOpcionesAnioLanzamiento(opcionesAnioLanzamiento);

          if(id !== 0){
            const data_evaluation = evaluacion(parsedSessionObj.datos_api, id);

            if (!data_evaluation.guardado) {
              const response = await getEvaluacion(id);
              const data = response.data;
              setValues({
                ...data,
                guardado: false
              });
              
            } else {
              setValues({
                ...data_evaluation,
                guardado: true
              });
            }

          }else{
            setValues({
              ...initialValues, // Aquí se agregan los valores de initialValues
              local: true,
              id: uuid.v4(),
              id_vendedor: id_valuador,
              valuador: nombre,
              id_solicitante: id_valuador,
              id_empresa: id_empresa,
            });

          }
        }
      } catch (error) {
        console.error('Error fetching session or data:', error);
        setError(error);
      } finally {
        setFetchCompleted(true);
      }
      setLoading(false);
    };

    if (!fetchCompleted) {
      fetchData();
    }
  }, [id, fetchCompleted]);

  useEffect(() => {
    const opcionesModeloLlenar = () => {
      const modelosFiltrados = modelo.filter((modelo) => modelo.id_marca === values.id_marca.toString());
    
      const opcionesModelo = modelosFiltrados.map((modelo) => ({
        label: modelo.name,
        value: modelo.id.toString(),
      }));
    
      // Actualizar el estado con las opciones
      setOpcionesModelo(opcionesModelo);
    };
    opcionesModeloLlenar();
  }, [values.id_marca]); 

  useEffect(() => {
    const fetchVersiones = async () => {
      if (values.id_marca && values.id_modelo && values.id_anio) {
        try {
          setLoadingVersion(true);
          const response = await getVersion(values.id_modelo, values.id_marca, values.id_anio);
          const versiones = response.data.map(version => ({
            label: version.name, // O la propiedad que corresponda en tu JSON
            value: version.id.toString()
          }));
          setOpcionesVersion(versiones);
        } catch (error) {
          console.error('Error al cargar versiones:', error);
        } finally {
          setLoadingVersion(false);
        }
      }
    };

    fetchVersiones();
  }, [values.id_modelo, values.id_marca, values.id_anio]); 

  const handleChangeValue = (field, value) => {
    setValues({
      ...values,
      [field]: value,
    });

    if (field === 'id_modelo') setIdModelo(value);
    if (field === 'id_marca') setIdMarca(value);
    if (field === 'id_anio') setIdAnio(value);
  };

  useEffect(() => {
    if (proceed) {
      saveAndAdvance();
    }
  }, [values, proceed]);
  
  const saveAndAdvance = async () => {
    let updatedDatosApi;

    if(id !== 0){
      updatedDatosApi = parsedSession.datos_api.map(item => {
        if (item.id === values.id) {
          return values; 
        }
        return item; 
      });
    }else{
      updatedDatosApi = [...parsedSession.datos_api, values];
    }
  
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
  
    setProceed(false);
    let id_valor = id; 
    if(id === 0){
      id_valor = values.id
    }
    navigation.navigate('Paso2', { id: id_valor });
  };
  
  const handleSaveAndAdvance = () => {
    if (parsedSession && parsedSession.datos_api && values) {
      if (step !== 3) {
        setValues({...values,
          guardado: true,
          id_estatus_evaluacion: 2});
      }
      setProceed(true);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const data = [
    { label: 'ANDROID Y APPLE CARPLAY', value: values.android_apple, key: 'android_apple' },
    { label: 'AIRBAG FRONTALES', value: values.airbags, key: 'airbags' },
    { label: 'AIRBAG FRONTALES/LATERALES', value: values.airbags_laterales, key: 'airbags_laterales' },
    { label: 'AIRBAG FRONTALES/LATERALES/CORTINAS', value: values.airbags_cortina, key: 'airbags_cortina' },
    { label: 'AIRE ACONDICIONADO', value: values.aire_automatico, key: 'aire_automatico' },
    { label: 'AIRE ACONDICIONADO AUTOMÁICO', value: values.aire, key: 'aire' },
    { label: 'ALARMA', value: values.alarma, key: 'alarma' },
    { label: 'ASIENTO ELÉCTRICO', value: values.asiento_electrico, key: 'asiento_electrico' },
    { label: 'ASIENTOS CALEFACCIÓN', value: values.asiento_aquecidos, key: 'asiento_aquecidos' },
    { label: 'BLUETOOTH', value: values.bluetooth, key: 'bluetooth' },
    { label: 'BOLA DE REMOLQUE', value: values.bola_remolque, key: 'bola_remolque' },
    { label: 'CAJA AUTOMÁTICA', value: values.caja_automatica, key: 'caja_automatica' },
    { label: 'CAMBIOS AL VOLANTE', value: values.cambios_volante, key: 'cambios_volante' },
    { label: 'COMPUTADORA DE VIAJE', value: values.compu_viaje, key: 'compu_viaje' },
    { label: 'CRISTALES ELÉCTRICOS', value: values.cristales, key: 'cristales' },
    { label: 'CRUISE CONTROL', value: values.cruise, key: 'cruise' },
    { label: 'DIRECCIÓN ASISTIDA', value: values.direccion_asistida, key: 'direccion_asistida' },
    { label: 'DOBLE QUEMACOCOS', value: values.quemacocos, key: 'quemacocos' },
    { label: 'ENTRADA AUXILIAR', value: values.auxiliar, key: 'auxiliar' },
    { label: 'ENTRADA USB', value: values.usb, key: 'usb' },
    { label: 'ESPEJOS ELÉCTRICOS', value: values.espejos_electricos, key: 'espejos_electricos' },
    { label: 'FAROS DE NIEBLA', value: values.f_niebla, key: 'f_niebla' },
    { label: 'FAROS XENON', value: values.f_xenon, key: 'f_xenon' },
    { label: 'FAROS XENON BI-DIRECCIONALES', value: values.f_xenon_bi, key: 'f_xenon_bi' },
    { label: 'GPS', value: values.gps, key: 'gps' },
    { label: 'ISOFIX', value: values.isofix, key: 'isofix' },
    { label: 'LLANTA DE REFACCIÓN', value: values.llantas_refaccion, key: 'llantas_refaccion' },
    { label: 'CAJUELA ELÉCTRICA', value: values.cajuela_electrica, key: 'cajuela_electrica' },
    { label: 'QUEMACOCOS', value: values.quemacocos_abatible, key: 'quemacocos_abatible' },
    { label: 'RADIO CON CD', value: values.radio_cd, key: 'radio_cd' },
    { label: 'REPRODUCTOR DVD', value: values.dvd, key: 'dvd' },
    { label: 'SENSORES DELANTEROS', value: values.sensores_atras, key: 'sensores_atras' },
    { label: 'SENSORES TRASEROS', value: values.sensores_frente, key: 'sensores_frente' },
    { label: 'SENSORES LLUVIA', value: values.sensores_lluvia, key: 'sensores_lluvia' },
    { label: 'SENSORES LUCES', value: values.sensores_luces, key: 'sensores_luces' },
    { label: 'SENSORES LLANTAS', value: values.sensores_llantas, key: 'sensores_llantas' },
    { label: 'SUSPENCIÓN NEUMÁTICA', value: values.suspension, key: 'suspension' },
    { label: 'TAPICERIA_TELA', value: values.tapiceria, key: 'tapiceria' },
    { label: 'TAPICERIA_PIEL', value: values.tapiceria_piel, key: 'tapiceria_piel' },
    { label: 'TECHO PANORAMICO', value: values.techo, key: 'techo' },
    { label: 'VIDRIOS ELECTRICOS', value: values.vidrios_electricos_f, key: 'vidrios_electricos_f' },
    { label: 'VOLANTE MULTIFUNCIONES', value: values.volante_multifunciones, key: 'volante_multifunciones' },
  ];

  const equipamientoTrue = data.filter(item => item.value === true);

  // Función para renderizar los elementos filtrados
  const renderEquipamiento = () => {
    if (equipamientoTrue.length === 0) {
      return <Text style={{ ...styles.photoText, margin:10}}>No hay equipamiento</Text>;
    }

    return equipamientoTrue.map((item, index) => (
      <Text style={styles.equipoText} key={index}> - {item.label}</Text>
    ));
  };

  const fotos_texto = [
    "Parte delantera",
    "Vista de tres cuartos delantera derecha",
    "Vista de tres cuartos delantera izquierda",
    "Vista de tres cuartos trasera",
    "Lado izquierdo",
    "Lado derecho",
    "Parte trasera",
    "Interiores",
    "Cuadro de instrumentos",
    "interior delantero",
    "interior trasero",
    "Debajo cofre",
    "Maletero",
    "Ruedas y llantas",
    "Kilometraje",
    "Detalle 1",
    "Detalle 2",
    "Detalle 3",
    "Detalle 4",
    "Detalle 5",
    "Detalle 6",
  ];
  
  const renderCards = () => {
    return data.map((item, index) => (
      <Card key={index} style={styles.card_modal}>
        <Card.Content style={styles.cardContent_modal}>
          <Text style={styles.cardText}>{item.label}</Text>
          <Switch 
            value={item.value} 
            onValueChange={(value) => handleChange(item.key, value)}
          />
        </Card.Content>
      </Card>
    ));
  };

  const handleAddPhoto = () => {
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true});
      const index = values.fotos_general.length;
      handleChange('fotos_general', [...values.fotos_general, { uri: photo.uri, index, guardado: 0, tipo: 0 }])

      if(fotos_texto.length == values.fotos_general.length+1){
        setShowCamera(false);
      }
     }
  };

  const years = [];
  for (let i = 2010; i <= 2024; i++) {
    years.push({ label: `${i}`, value: `${i}` });
  }
  
  const [openFabricacion, setOpenFabricacion] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openTransmision, setOpenTransmision] = useState(false);
  const [openProcedencia, setOpenProcedencia] = useState(false);
  const [openCombustible, setOpenCombustible] = useState(false);
  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [openAnio, setOpenAnio] = useState(false);
  const [openPuerta, setOpenPuerta] = useState(false);
  const [openVersion, setOpenVersion] = useState(false);

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
      {!showCamera && (
        <>
      <Appbar.Header style={[styles.header]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Vehículo" />
      </Appbar.Header>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollView} nestedScrollEnabled={true}>
          <Wizard currentStep={currentStep} />
          
          <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 10 }}>
          Información del Propietario
          </TextPaper>

          <InputComponent
            placeholder="Propietario"
            value={values.cliente}
            onChangeText={(text) => handleChange('cliente', text)}
            required={true}
          />
          <InputComponent
            placeholder="Teléfono"
            value={values.celular}
            onChangeText={(text) => handleChange('celular', text)}
            keyboardType="phone-pad"
            required={true}
          />
          <InputComponent
            placeholder="Correo Electrónico"
            value={values.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
          />

          <TextPaper variant="titleMedium" style={{ fontWeight: 400, marginBottom: 10, marginTop: 15 }}>
            Información del Vehículo
          </TextPaper>
          
          <InputComponent
            placeholder="VIN"
            value={values.vin}
            onChangeText={(text) => handleChange('vin', text)}
          />
          <View style={styles.selectorsContainer }>

            <CustomSelect
              open={openAnio}
              value={values.id_anio}
              items={opcionesAnioLanzamiento}
              setOpen={setOpenAnio}
              onChangeValue={(value) => handleChange('id_anio', value)}
              placeholder="Año del vehículo"
            />
            <View style={styles.space} />
            <CustomSelect
              open={openFabricacion}
              value={values.id_anio_fabricacion}
              items={years}
              setOpen={setOpenFabricacion}
              onChangeValue={(value) => handleChange('id_anio_fabricacion', value)}
              placeholder="Año de fabricación"
            />
          </View>
          <View style={[styles.selectorsContainer, {marginBottom:0} ]}>

            <InputComponent
              placeholder="Kilometraje"
              value={values.kilometraje}
              onChangeText={(text) => handleChange('kilometraje', text)}
              keyboardType="numeric"
            />
            <View style={styles.space} />
              <InputComponent
              placeholder="Placa"
              value={values.placa}
              onChangeText={(text) => handleChange('placa', text)}
            />
          </View>

          <View style={[styles.espacio, Platform.OS === 'ios' ? {zIndex: 800} : {}]}> 
            <CustomSelect
                open={openMarca}
                value={values.id_marca}
                items={opcionesMarca}
                setOpen={setOpenMarca}
                onChangeValue={(value) => handleChange('id_marca', value)}
                placeholder="Marca"
              />
          </View>
          <View style={[styles.espacio, Platform.OS === 'ios' ? {zIndex: 700} : {}]}> 
            <CustomSelect
                open={openModelo}
                value={values.id_modelo}
                items={opcionesModelo}
                setOpen={setOpenModelo}
                onChangeValue={(value) => handleChange('id_modelo', value)}
                placeholder="Modelo"
              />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginBottom: 20, }}>
              <Text style={{ color: '#5d5d5d', 
                fontSize: 14,
                marginBottom: 5,
                }}>{ loadingVersion ? 'Cargando versiones...' : 'Versión' }</Text>
              <DropDownPicker
                    open={openVersion}
                    value={values.id_version}
                    items={opcionesVersion}
                    setOpen={setOpenVersion}
                    onSelectItem={(item) => {
                      setValues({
                        ...values,
                        id_version: item.value,
                        version: item.label
                      });
                    }}
                    placeholder={'Seleccione'}
                    listMode={'MODAL'}
                    modalTitle={ loadingVersion ? 'Cargando versiones...' : 'Versión'}
                    modalAnimationType="slide" 
                    style={{
                      zIndex: 1000,
                      height: 40, 
                      borderWidth: 1,
                      borderColor: '#dcdcdc', 
                      borderRadius: 5, 
                      paddingHorizontal: 10,
                      // Sombra para iOS
                      shadowColor: '#000', // Color de la sombra
                      shadowOffset: { width: 2, height: 2 }, // Sombra solo hacia la derecha y abajo
                      shadowOpacity: 0.1, // Opacidad suave para que sea tenue
                      shadowRadius: 5, // Suaviza los bordes de la sombra
                      
                      // Sombra para Android
                      elevation: 1, // Nivel de elevación bajo para una sombra suave en Android
                    }}
                />
            </View>
            {loadingVersion && (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{ marginLeft: 10 }} // Espacio entre el select y el spinner
              />
            )}
          </View>
          <View style={styles.selectorsContainer }>
            <CustomSelect
              open={openCombustible}
              value={values.id_combustible}
              items={opcionesCombustible}
              setOpen={setOpenCombustible}
              onChangeValue={(text) => handleChange('id_combustible', text)}
              placeholder="Combustible"
            />
            <View style={styles.space} />
            <CustomSelect
              open={openColor}
              value={values.id_color}
              items={opcionesColor}
              setOpen={setOpenColor}
              onChangeValue={(text) => handleChange('id_color', text)}
              placeholder="Color"
            />
          </View>
          <View style={styles.selectorsContainer }>
            <CustomSelect
                open={openTransmision}
                value={values.id_transmision}
                items={opcionesTransmision}
                setOpen={setOpenTransmision}
                onChangeValue={(text) => handleChange('id_transmision', text)}
                placeholder="Tipo de transmisión"
              />
            <View style={styles.space} />

            <CustomSelect
              open={openProcedencia}
              value={values.id_procedencia}
              items={opcionesProcedencia}
              setOpen={setOpenProcedencia}
              onChangeValue={(text) => handleChange('id_procedencia', text)}
              placeholder="Procedencia"
            />
          </View>
          
          <View style={[styles.espacio, Platform.OS === 'ios' ? {zIndex: 500} : {}]}> 
            <CustomSelect
              open={openPuerta}
              value={values.id_cantidad_puertas}
              items={opcionesPuertas}
              setOpen={setOpenPuerta}
              onChangeValue={(text) => handleChange('id_cantidad_puertas', text)}
              placeholder="Cantidad de puertas"
            />
          </View>
            

          <Card style={{ ...styles.card, zIndex: 4 }} onPress={handleCardPress}>
            <Card.Title title="Equipamiento" />
            <Card.Content style={styles.photoCardContent}>
              {renderEquipamiento()}
            </Card.Content>
          </Card>
          <Card style={styles.card_final2}>
            <Card.Title title="Fotos" />
            <Card.Content style={styles.photoCardContent}>
              {values.fotos_general && values.fotos_general.length > 0 ? (
                  <View style={styles.container_photo}>
                    {values.fotos_general.map((imgSrc, index) => (
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
                <ButtonP
                mode="contained"
                onPress={handleAddPhoto}
                style={styles.fullButton}
                icon={({ size, color }) => (
                    <Icon name="camera" size={size} color={color} />
                )}
                >
                Tomar Foto
                </ButtonP>
            </View>
          </Card>
        
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.buttonContainer, { backgroundColor: colors.primary}]}>
        <TouchableOpacity onPress={handleSaveAndAdvance} style={[styles.button, { backgroundColor: colors.primary}]} color={theme.colors.buttonPaso}>
          <Text style={styles.buttonText}>Guardar y avanzar</Text>
        </TouchableOpacity>
      </View>
      </>
      )}
      {showCamera && (
          <CamaraPrincipalComponent takePicture={takePicture} setShowCamera={setShowCamera} cameraRef={cameraRef} bottomText={fotos_texto[values.fotos_general.length]} />
        )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
        propagateSwipe={true}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.titleContainer, { backgroundColor: colors.secondary}]}>
            <Text style={styles.title}>Equipamiento</Text>
            <Pressable onPress={handleCloseModal}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          <ScrollView style={styles.scrollView_modal}>
              {renderCards()}
          </ScrollView>
          <View style={[styles.buttonContainer_modal, { backgroundColor: colors.primary}]}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.button} color={theme.colors.buttonPaso}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            {/* <Button title="Guardar" onPress={handleSave} color="white"/> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  espacio: {
    marginBottom: 12,
  },
  selectorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      ios: { zIndex: 100 },
      android: {},
    }),
  },
  space: {
    width: 10, 
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 15,
  },
  scrollView_modal: {
    padding: 10,
    flex: 1
  },
  content: {
    flex: 1
  },
  card: {
    marginVertical: 10,
  },
  card_final: {
    marginVertical: 10,
    marginBottom: 20,
  },
  card_final2: {
    marginVertical: 10,
    paddingBottom: 0,
  },
  buttonContainer: {
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 65 : 50, 
  },
  buttonText:{
    color: theme.colors.textWhite,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    height: theme.colors.tamanoAppBar, // Reducir la altura en un 30% (60 es la altura predeterminada)
  },
  modalContainer: {
    height: '90%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white', // Fondo semi-transparente
  },
  modalContent: {
    height:100
  },
  card_modal: {
    marginVertical: 10,
  },
  cardContent_modal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer_modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 1,
    borderTopWidth: 1,
    borderTopColor: 'lightgray', 
    alignItems: 'center',

  },
  titleContainer: {
    height: '8%',
    flexDirection: 'row', // Alinea los hijos en fila
    justifyContent: 'space-between', // Espacia el título y el ícono para que estén en los extremos
    alignItems: 'center', // Centra verticalmente el contenido
    paddingHorizontal: 10, // Espaciado horizontal
    paddingVertical: 5, // Espaciado vertical
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  cardText: {
    flex: 1, // El texto tomará el espacio restante
    marginRight: 10, // Margen derecho para separar el texto del interruptor
  },
  photoCardContent: {
    paddingBottom: 0, 
  },
  photoText: {
    textAlign: 'center', 
    marginBottom: 10,
  },
  equipoText: {
    marginBottom: 5,
  },
  container_photo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Esto añade espacio entre las imágenes
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10, // Añade un margen inferior para separar las líneas de imágenes
  },
  fullButton: {
    marginTop: 10,
    width: '100%', 
    borderRadius: 0,
  },
});

