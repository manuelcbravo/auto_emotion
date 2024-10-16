import React from 'react';
import { login } from './axiosConfig'; // Import the axios instance from axiosConfig.js
import { useStorageState } from './useStorageState';
// import Toast from 'react-native-toast-message';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<void>; // Modifica el tipo de signIn
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(), // Modifica el valor de signIn
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session_automotion');

  const signIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      if(response.data.status){
        setSession(response.data);
      }
    } catch (error) {      
      if (error.response && error.response.status == 401) {
        Toast.show({
          type: ALERT_TYPE.DANGER, // Cambia el tipo a DANGER para indicar error
          title: 'Error de autenticación',
          textBody: 'Credenciales incorrectas, intente nuevamente.',
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error',
          textBody: 'Hubo un problema con el servidor. Por favor intente más tarde.',
        });
        throw error;
      }
    }
  };

  return (
      <AuthContext.Provider
        value={{
          signIn,
          signOut: () => {
            setSession(null);
          },
          session,
          isLoading,
        }}>
        {props.children}
      </AuthContext.Provider>
  );
}
