import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const CustomSelect = ({ open, value, items, setOpen, setValue, placeholder, onChangeValue }) => {

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ marginBottom: 5}}>{placeholder}</Text>
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
            style={{
              zIndex: 1000, // Asegúrate de que el zIndex sea suficientemente alto
            }}
        />
    </View>
  );
};

export default CustomSelect;
