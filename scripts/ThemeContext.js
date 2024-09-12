// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

const ThemeContext = createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  const baseTheme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors, // Mantén los colores originales del tema
      primary: '#0E4690',
      secondary: '#3B75BA',
      contraste: '#a7aabc',
      tercero: '#900E46',
      cuarto: '#46900E',
      text: '#000000',
      textWhite: '#ffffff',
      error: '#f13a59',
      buttonPaso: '#38B40A',
      disabledBackground: '#E0E0E0',
      disabledText: '#A0A0A0',
      fonSizeCard: 11
    },
    myOwnProperty: true, // Añade propiedades personalizadas si lo necesitas
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}
