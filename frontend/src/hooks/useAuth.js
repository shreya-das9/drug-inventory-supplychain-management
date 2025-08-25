import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchUserProfile, 
  fetchDashboard,
  clearError 
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { 
    user, 
    token, 
    isAuthenticated, 
    loading, 
    error, 
    dashboardData 
  } = useSelector((state) => state.auth);

  // Check if user is authenticated on app load
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, dispatch]);

  const login = async (credentials) => {
    return dispatch(loginUser(credentials)).unwrap();
  };

  const register = async (userData) => {
    return dispatch(registerUser(userData)).unwrap();
  };

  const logout = async () => {
    return dispatch(logoutUser()).unwrap();
  };

  const getDashboard = async () => {
    if (user?.role) {
      return dispatch(fetchDashboard(user.role)).unwrap();
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    dashboardData,
    login,
    register,
    logout,
    getDashboard,
    clearAuthError,
  };
};