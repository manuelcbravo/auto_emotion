import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, IconButton } from 'react-native-paper';
import { theme } from '../../core/theme';
import { Feather } from '@expo/vector-icons';

export default function PasswordTextInput({ errorText, description, value, onChangeText, ...props }) {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  // Función para manejar el cambio en el texto
  const handleChangeText = (text) => {
    // Convertir el texto a minúsculas
    const lowerCaseText = text.toLowerCase();
    // Llamar a la función onChangeText pasada como prop
    onChangeText(lowerCaseText);
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={theme.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        value={value}
        onChangeText={handleChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        left={
          <Input.Icon
            icon={() => (
              <Feather name="key" size={20} color={theme.colors.gris} />
            )}
          />
        }
        theme={{
          roundness: 15,
        }}
        {...props}
      />
      <IconButton
        icon={secureTextEntry ? 'eye-off' : 'eye'}
        iconColor={theme.colors.gris}   
        size={20}
        onPress={toggleSecureEntry}
        style={styles.toggleButton}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingRight: 45, // Espacio para el botón de ocultar/mostrar contraseña
  },
  toggleButton: {
    position: 'absolute',
    right: 0,
    top: 12,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});
