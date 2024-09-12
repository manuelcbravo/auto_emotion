import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Appbar, Card, TextInput, Button, MD3Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importa el ícono de cámara
import CameraComponent from '../../components/CamaraComponent';
import { theme } from '../../core/theme'

export default function InteriorTapiceriaScreen({ navigation }) {
  const [estado, setEstado] = useState('Bueno');
  const [observaciones, setObservaciones] = useState('Sin observaciones');
  const [costo, setCosto] = useState('$0');
  const [showCamera, setShowCamera] = useState(false);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  const handleSave = () => {
    // Aquí podrías manejar la lógica para guardar los datos
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    setShowCamera(true);
    setEstado('aqui')
  };

  const takePicture = async () => {

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo.uri);
      setImage(photo.uri);
      setShowCamera(false);
    }
  };

  return (
    <View style={styles.container}>
        {!showCamera && (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Vidrios" />
            </Appbar.Header>
            <View style={styles.content}>
                <Card style={styles.card}>
                <Card.Title title="Estado y Costos" />
                <Card.Content>
                    <TextInput
                    label="Estado del Artículo"
                    value={estado}
                    onChangeText={setEstado}
                    style={styles.input}
                    mode="outlined"
                    />
                    <TextInput
                    label="Observaciones"
                    value={observaciones}
                    onChangeText={setObservaciones}
                    style={styles.input}
                    mode="outlined"
                    />
                    <TextInput
                    label="Costo Previsto"
                    value={costo}
                    onChangeText={setCosto}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="numeric"
                    />
                </Card.Content>
                </Card>
                <Card style={styles.card}>
                  <Card.Title title="Fotos" />
                  <Card.Content style={styles.photoCardContent}>
                      {image ? (
                          <TouchableOpacity onPress={() => console.log("Foto presionada")}>
                              <Image source={{ uri: image }} style={styles.image} />
                          </TouchableOpacity>
                      ) : (
                          <Text style={styles.photoText}>No hay foto</Text>
                      )}
                  </Card.Content>
                  <View>
                      <Button
                      mode="contained"
                      onPress={handleAddPhoto}
                      style={styles.fullButton}
                      icon={({ size, color }) => (
                          <Icon name="camera" size={size} color={color} />
                      )}
                      >
                      Tomar Foto
                      </Button>
                  </View>
                  
                </Card>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleSave} style={styles.button} color={theme.colors.buttonPaso}>
                <Text style={styles.buttonText}>Guardar y avanzar</Text>
              </TouchableOpacity>
            </View>
        </View>)}
        {showCamera && (
            <CameraComponent takePicture={takePicture} setShowCamera={setShowCamera} cameraRef={cameraRef} />
          )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
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
    height: theme.colors.tamanoAppBar, 
  },
  photoCardContent: {
    paddingBottom: 0, 
  },
  photoText: {
    textAlign: 'center', 
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover', // Esto ajusta la imagen para que cubra el tamaño especificado
    borderRadius: 8, // O cualquier otro radio de borde que desees
  },
});