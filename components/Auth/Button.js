import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import { theme } from '../../core/theme';

export default function Button({ mode, style, loading, ...props }) {

  const { colors } = useTheme(); // Usar el tema actual para obtener los colores

  return (
    <View style={styles.container}>
      <PaperButton
          style={[
            styles.button,
            { backgroundColor: loading ? colors.disabledBackground : colors.primary } // Cambia el color de fondo si está deshabilitado
          ]}
          labelStyle={[styles.text, { color: loading ? colors.disabledText : colors.textWhite }]} // Cambia el color del texto si está deshabilitado
          mode={mode}
          disabled={loading}
          {...props}
        >
          {loading ? 'Cargando...' : props.children}
      </PaperButton>
      {loading && <ActivityIndicator size="small" color={theme.colors.primary} style={styles.spinner} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
  spinner: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjust for vertical centering
  },
});
