import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSetToken = useCallback((accessToken) => {
    setToken(accessToken);
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, []); 

  const logout = useCallback(async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error("Server logout failed, but clearing client state anyway.", error);
    } finally {
      handleSetToken(null);
    }
  }, [handleSetToken]); 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      handleSetToken(tokenFromUrl);
      navigate(location.pathname, { replace: true });
    }

    setIsLoading(false);
  }, [location.search, handleSetToken, navigate, location.pathname]);


  const value = { token, login: handleSetToken, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);