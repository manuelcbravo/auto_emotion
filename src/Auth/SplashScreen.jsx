import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

const SplashScreen = () => {
  const { colors } = useTheme();
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de rebote continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 10, // Mover 10 unidades hacia abajo
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0, // Volver a la posición inicial
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceValue]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Logo animado */}
      <Animated.View 
        style={[styles.logoContainer, { transform: [{ translateY: bounceValue }] }]}
      >
        <Image
          source={require('../../assets/images/logo_blanco.png')} // Asegúrate que la ruta sea correcta
          style={styles.image}
          resizeMode="contain"
          onError={(error) => console.log('Error al cargar la imagen', error)} // Control de errores
        />
      </Animated.View>

      {/* Sombra debajo del logo */}
      <View style={styles.shadowContainer}>
      <Image
          source={require('../../assets/images/shadow2.png')}
          style={styles.imageShadow}

        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    // Sombra para Android
    elevation: 10,
  },
  image: {
    width: '100%',  // Usa el 100% del contenedor
    height: '100%', // Usa el 100% del contenedor
  },
  imageShadow: {
    width: '45%',  // Usa el 100% del contenedor
    height: '36%', // Usa el 100% del contenedor
  },
  shadowContainer: {
    marginTop: -360, // Ajustar para que la sombra esté más cerca del logo
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  shadow: {
    width: 150, // Ajusta el ancho de la sombra
    height: 15,  // Reduce la altura de la sombra para que sea más delgada
    backgroundColor: '#000',
    borderRadius: 75, // Redondea la sombra
    opacity: 0.2, // Baja la opacidad para hacerla más sutil
    transform: [{ scaleX: 1.5 }], // Alarga la sombra horizontalmente
  },
});

export default SplashScreen;
