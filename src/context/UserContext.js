// src/context/UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../api/supabase';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener la sesión actual cuando el componente se monta
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    // Suscribirse a los cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      if (authListener) {
        authListener();  // Llamamos a la función directamente para cancelar la suscripción
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
