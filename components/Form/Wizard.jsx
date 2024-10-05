import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

const Wizard = ({ currentStep }) => {
  const { colors } = useTheme();
  const totalSteps = 4;

  // Etiquetas para los pasos
  const stepLabels = ['Vehículo', 'complementos', 'Inspección', 'Valiación'];

  return (
    <View style={styles.container}>
      {/* Contenedor para los círculos y líneas */}
      <View style={styles.stepsContainer}>
        {[...Array(totalSteps).keys()].map((_, index) => (
          <View key={index} style={styles.step}>
            <View
              style={[
                styles.circle,
                currentStep === index + 1
                  ? styles.activeCircle // Paso activo en azul
                  : currentStep > index + 1 // Pasos completados en verde
                  ? styles.completedCircle
                  : styles.inactiveCircle, // Pasos futuros en gris
              ]}
            >
              {currentStep > index + 1 ? ( // Si el paso está completado
                <IconButton
                  icon="check" // Ícono de éxito
                  size={20}
                  color="white"
                  style={styles.icon}
                />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    currentStep === index + 1
                      ? styles.activeText 
                      : styles.inactiveText,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.line,
                  currentStep > index + 1 ? styles.activeLine : styles.inactiveLine,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.labelsContainer}>
        {[...Array(totalSteps).keys()].map((_, index) => (
          <View key={index} style={styles.labelContainer}>
            <Text style={styles.stepLabel}>{stepLabels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    justifyContent: 'center', 
  },
  stepsContainer: {
    flexDirection: 'row', // Los círculos y líneas se alinean en fila
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#4586d5', // Azul para el paso activo
  },
  completedCircle: {
    backgroundColor: '#22c55e', // Verde para los pasos completados
  },
  inactiveCircle: {
    backgroundColor: '#0E4690', // Gris oscuro para los pasos inactivos
  },
  stepText: {
    fontSize: 16,
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: 'white',
  },
  line: {
    width: 50,
    height: 2,
  },
  activeLine: {
    backgroundColor: '#22c55e', // Verde para la línea de pasos completados
  },
  inactiveLine: {
    backgroundColor: '#0E4690', // Gris oscuro para pasos inactivos
  },
  icon: {
    margin: 0, // Ajustar el ícono dentro del círculo
  },
  labelsContainer: {
    flexDirection: 'row', // Etiquetas alineadas en fila
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  labelContainer: {
    width: 90, // Asegura que cada etiqueta ocupe el mismo espacio
    alignItems: 'center',
  },
  stepLabel: {
    color: 'black', // Puedes cambiar el color según tu diseño
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Wizard;
