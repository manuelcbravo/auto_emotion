import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useSession } from '../../ctx';
import { useTheme, Text, HelperText } from 'react-native-paper';
import Button from '../../components/Auth/Button';
import TextInput from '../../components/Auth/TextInput';
import TextInputPassword from '../../components/Auth/TextInputPassword';

export default function LoginScreen() {
  const { signIn } = useSession();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  // Estado para almacenar los valores de correo electrónico y contraseña
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Estado para almacenar los errores de validación
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  // Función para manejar el cambio en los inputs
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    if (value !== '') {
      setErrors({ ...errors, [key]: false });
    }
  };

  // Validación de los campos
  const validateFields = () => {
    let valid = true;
    let newErrors = { email: false, password: false };

    if (formData.email === '') {
      newErrors.email = true;
      valid = false;
    }

    if (formData.password === '') {
      newErrors.password = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (validateFields()) {
      setLoading(true);
      try {
        await signIn(formData.email, formData.password);
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Parte superior con logo y fondo primario */}
      <View style={styles.topSection(colors)}>
        <Image
          source={require('../../assets/images/logo_blanco.png')} // Asegúrate de usar la ruta correcta a tu logo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Parte inferior con inputs */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Bienvenido</Text>

        <TextInput
          label="Email"
          returnKeyType="next"
          value={formData.email}
          onChangeText={(email) => handleInputChange('email', email)}
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          error={errors.email} // Cambiar el borde del input a rojo
          style={styles.input}
        />
        <HelperText type="error" visible={errors.email} style={styles.helperText}>
          El correo electrónico es obligatorio.
        </HelperText>

        <TextInputPassword
          label="Contraseña"
          value={formData.password}
          onChangeText={(password) => handleInputChange('password', password)}
          error={errors.password} // Cambiar el borde del input a rojo
          style={styles.input}
        />
        <HelperText type="error" visible={errors.password} style={[styles.helperText, {marginBottom: -10}]}>
          La contraseña es obligatoria.
        </HelperText>

        <Button
          loading={loading}
          mode="contained"
          onPress={handleSignIn}
          style={styles.button}
        >
          Iniciar sesión
        </Button>
      </View>

      {/* Línea inferior con color secundario */}
      <View style={styles.bottomStrip(colors)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // Fondo blanco para la parte de los inputs
  },
  topSection: (colors) => ({
    flex: 1.2, // Parte superior ocupa 2/5
    backgroundColor: colors.primary, // Fondo primario
    justifyContent: 'center',
    alignItems: 'center',
  }),
  logo: {
    width: 150,
    height: 150,
  },
  bottomSection: {
    flex: 3, // Parte inferior ocupa 3/5
    padding: 16,
    justifyContent: 'center',
    marginTop: -120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#003A70', // Cambia este color si es necesario
  },
  input: {
    marginBottom: 5, // Reduce el espacio entre el input y el texto de ayuda
  },
  helperText: {
    marginBottom: -15, // Controla el espacio entre el helper text y el siguiente input
    marginTop: -22, // Reduce la separación adicional
  },
  button: {
    backgroundColor: '#003A70', // Botón azul
    borderRadius: 25,
    marginTop: 100
  },
  bottomStrip: (colors) => ({
    height: 22, // Franja delgada en la parte inferior
    backgroundColor: colors.secondary, // Fondo secundario
  }),
});
