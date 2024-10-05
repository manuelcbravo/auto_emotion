import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const CustomSelect = ({ open, value, items, setOpen, setValue, placeholder, onChangeValue }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
       <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            onSelectItem={(item) => {
              onChangeValue(item.value)
            }}
            placeholder={'Seleccione'}
            listMode={'MODAL'}
            modalTitle={placeholder}
            modalAnimationType="slide" 
            style={[styles.input, { backgroundColor: 'white', zIndex: 1000, }]}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, 
    flex: 1
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

export default CustomSelect;
