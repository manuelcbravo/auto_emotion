// CameraComponent.js

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CameraComponent({ takePicture, setShowCamera, cameraRef, bottomText }) {
  const [permission, requestPermission] = useCameraPermissions();

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

  return (
    <View style={styles.containerCamera}>
      <CameraView style={styles.cameraCamera} ref={cameraRef}>
        <View style={styles.buttonContainerCamera}>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <View style={styles.buttonCircle}>
              <Icon name="camera" size={50} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => setShowCamera(false)}>
            <View style={styles.closeCircle}>
              <Icon name="close" size={30} color={'white'} />
            </View>
        </TouchableOpacity>
      </CameraView>
      <Text style={styles.bottomText}>{bottomText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    margin: 70,
  },
  buttonCamera: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  buttonCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right:20,
  },
  closeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    padding:15,
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    backgroundColor: "#000000"
  },
});
