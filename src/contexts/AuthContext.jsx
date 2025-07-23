import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const ROLES = {
  GERENCIA: 'Gerência',
  VENDEDOR: 'Vendedor',
  TECNICO: 'Técnico',
  MASTER: 'Master'
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('sistema_usuarios')
        .select('*')
        .eq('usuario', username)
        .eq('senha', password)
        .single();

      if (error || !data) {
        throw new Error('Usuário ou senha inválidos');
      }

      const userData = {
        id: data.id,
        usuario: data.usuario,
        cargo: data.cargo,
        nome: data.nome || data.usuario
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (requiredRoles) => {
    if (!user || !user.cargo) return false;
    return requiredRoles.includes(user.cargo);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    hasRole,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};