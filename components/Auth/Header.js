import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, useTheme  } from 'react-native-paper'

export default function Header(props) {
  const { colors } = useTheme(); // Usar el tema actual para obtener los colores

  const styles = StyleSheet.create({
    header: {
      fontSize: 21,
      color: colors.primary, // Usar color primario desde el tema
      fontWeight: 'bold',
      paddingVertical: 12,
    },
  });

  return <Text style={styles.header} {...props} />;
}