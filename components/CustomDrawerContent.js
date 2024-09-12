import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Drawer, Avatar, Title, Button, useTheme } from 'react-native-paper';
import { useSession } from '../ctx';

export default function CustomDrawerContent(props) {
  const { session, signOut } = useSession();
  const { colors } = useTheme(); // Obtén los colores del tema de react-native-paper

  let nombre = '';
  if (session) {
    nombre = session.nombre.trim();
  }

  const inicial = nombre ? nombre[0].toUpperCase() : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Drawer.Section style={styles.drawerSection}>
        <View style={[styles.drawerHeader, { backgroundColor: colors.surface }]}>
          <Avatar.Text
            label={inicial}
            size={60}
            color={colors.textWhite} // Color del texto
            style={{ backgroundColor: colors.primary }} // Color de fondo del círculo
          />
          <View style={styles.profileInfo}>
            <Title style={[styles.profileName]}>{nombre}</Title>
          </View>
        </View>
        {/* <Drawer.Item
          label="Home"
          labelStyle={{ color: colors.text }}
          onPress={() => props.navigation.navigate('HomeTabs')}
        /> */}
        {/* <View style={styles.switchContainer}>
          <Text style={{ color: colors.text }}>Dark Mode</Text>
          <Switch
            value={isDarkTheme}
            onValueChange={toggleTheme}
          />
        </View> */}
      </Drawer.Section>
      <Button 
        mode="contained"
        onPress={signOut}
        style={[styles.logoutButton, { backgroundColor: colors.primary }]}
        labelStyle={[styles.logoutLabel, { color: colors.textWhite }]}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    alignSelf: 'center',
    width: '50%',
    height: 40,
  },
  logoutLabel: {
    fontSize: 12, // Asegura que el texto del botón sea legible
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
});
