import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, useTheme, HelperText } from 'react-native-paper';

const InputComponent = ({ placeholder, value, onChangeText, keyboardType = 'default', required = false }) => {
  const { colors } = useTheme();
  const [isTouched, setIsTouched] = useState(false);

  const hasErrors = () => {
    return required && isTouched && !value; 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>

      <TextInput
        mode="flat"
        style={[styles.input, { backgroundColor: 'white' }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        underlineColor="transparent" 
        outlineStyle={{ borderRadius: 5 }} 
        theme={{
          colors: {
            placeholder: '#7d7d7d', 
            text: '#000000',
            primary: '#7d7d7d', 
          },
        }}
        onFocus={() => {
          setIsTouched(true);
        }} 
      />
      {hasErrors() && (
        <HelperText type="error" visible={hasErrors()}>
          {placeholder} es requerido.
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, 
    flex:1
  },
  label: {
    color: '#5d5d5d', 
    fontSize: 14,
    marginBottom: 5, 
  },
  input: {
    height: 40, 
    borderWidth: 1,
    borderColor: '#dcdcdc', 
    borderRadius: 5, 
    paddingHorizontal: 10, 
    // Sombra para iOS
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 2, height: 2 }, // Sombra solo hacia la derecha y abajo
    shadowOpacity: 0.1, // Opacidad suave para que sea tenue
    shadowRadius: 4, // Suaviza los bordes de la sombra
    
    // Sombra para Android
    elevation: 1, // Nivel de elevación bajo para una sombra suave en Android
  },
});

export default InputComponent;
