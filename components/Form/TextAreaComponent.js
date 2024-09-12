import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const TextAreaComponent = ({ label, value, onChangeText }) => {

  return (
      <TextInput
        label={label}
        onChangeText={onChangeText}
        multiline
        numberOfLines={4} // Ajusta el número de líneas visibles según sea necesario
        style={styles.textArea}
        value={value}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  textArea: {
    marginTop: 20,
    marginBottom: 20,
    height: 120, // Ajusta la altura según tus necesidades
  },
});

export default TextAreaComponent;
