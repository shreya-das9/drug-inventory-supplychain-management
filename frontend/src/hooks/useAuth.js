// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect } from 'react';
// import { 
//   loginUser, 
//   registerUser, 
//   logoutUser, 
//   fetchUserProfile, 
//   fetchDashboard,
//   clearError 
// } from '../store/authSlice';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const { 
//     user, 
//     token, 
//     isAuthenticated, 
//     loading, 
//     error, 
//     dashboardData 
//   } = useSelector((state) => state.auth);

//   // Check if user is authenticated on app load
//   useEffect(() => {
//     if (token && !user) {
//       dispatch(fetchUserProfile());
//     }
//   }, [token, user, dispatch]);

//   const login = async (credentials) => {
//     return dispatch(loginUser(credentials)).unwrap();
//   };

//   const register = async (userData) => {
//     return dispatch(registerUser(userData)).unwrap();
//   };

//   const logout = async () => {
//     return dispatch(logoutUser()).unwrap();
//   };

//   // const getDashboard = async () => {
//   //   if (user?.role) {
//   //     return dispatch(fetchDashboard(user.role)).unwrap();
//   //   }
//   // };
//   const getDashboard = async () => {
//   try {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return;

// const res = await fetch(`/api/dashboard/${user.role}`, {
//   headers: { Authorization: `Bearer ${token}` },
// });



//     if (res.status === 401) {
//       localStorage.clear();
//       return; // stop retrying
//     }

//     const data = await res.json();
//     setDashboardData(data);
//   } catch (err) {
//     console.error("Failed to fetch dashboard:", err);
//   }
// };


//   const clearAuthError = () => {
//     dispatch(clearError());
//   };

//   return {
//     user,
//     token,
//     isAuthenticated,
//     loading,
//     error,
//     dashboardData,
//     login,
//     register,
//     logout,
//     getDashboard,
//     clearAuthError,
//   };
// };

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchUserProfile,
  fetchDashboard,
  clearError,
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();

  const {
    user,
    accessToken,      // ✅ use the correct key
    isAuthenticated,
    isLoading,         // ✅ use the correct key
    error,
    dashboardData,
  } = useSelector((state) => state.auth);

  // fetch profile once if we have a token but no user
  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchUserProfile());
    }
  }, [accessToken, user, dispatch]);

  const login = (credentials) => dispatch(loginUser(credentials)).unwrap();
  const register = (userData) => dispatch(registerUser(userData)).unwrap();
  const logout = () => dispatch(logoutUser()).unwrap();

  // use the thunk; do NOT fetch /api directly here
  const getDashboard = useCallback(async () => {
    if (!user?.role || !accessToken) return;
    try {
      await dispatch(fetchDashboard(user.role)).unwrap();
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    }
  }, [dispatch, user?.role, accessToken]);

  const clearAuthError = () => dispatch(clearError());

  return {
    user,
    accessToken,
    isAuthenticated,
    loading: isLoading,     // keep the external name "loading"
    error,
    dashboardData,
    login,
    register,
    logout,
    getDashboard,
    clearAuthError,
  };
};
