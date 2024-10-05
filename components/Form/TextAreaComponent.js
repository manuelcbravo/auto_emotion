import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

const TextAreaComponent = ({ label, value, onChangeText }) => {

  return (
    <View style={styles.container}>

      <Text style={styles.label}>{label}</Text>
      <TextInput
      mode="flat"
      style={[styles.input, { backgroundColor: 'white' }]}
      value={value}
      onChangeText={onChangeText}
      underlineColor="transparent" 
      outlineStyle={{ borderRadius: 5 }} 
      theme={{
        colors: {
          placeholder: '#7d7d7d', 
          text: '#000000',
          primary: '#7d7d7d', 
        },
      }}
        multiline
        numberOfLines={4} // Ajusta el número de líneas visibles según sea necesario

      />

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, 

  },
  label: {
    color: '#5d5d5d', 
    fontSize: 14,
    marginBottom: 5, 
  },
  textArea: {
    marginTop: 20,
    marginBottom: 20,
    height: 120,
    borderWidth: 1,
    borderColor: '#dcdcdc', 
    borderRadius: 5, 
    paddingHorizontal: 10, 
  },
});

export default TextAreaComponent;
