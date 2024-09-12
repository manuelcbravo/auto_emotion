import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

const InputComponent = ({ placeholder, value, onChangeText, keyboardType = 'default' }) => {
  const { colors } = useTheme();

  return (
    <TextInput
      mode="outlined"
      style={[styles.input, { backgroundColor: colors.surface }]} // Usar colors.surface aquí
      label={placeholder}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  );
};

const styles = StyleSheet.create({
  input: {
  },
});

export default InputComponent;
