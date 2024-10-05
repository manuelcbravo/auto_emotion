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
  },
});

export default InputComponent;
