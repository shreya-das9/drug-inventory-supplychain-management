// // // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // // // import { authAPI } from '../services/auth.api';
// // // // import toast from 'react-hot-toast';

// // // // // Async thunks
// // // // export const loginUser = createAsyncThunk(
// // // //   'auth/login',
// // // //   async (credentials, { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await authAPI.login(credentials);
// // // //       localStorage.setItem('accessToken', response.data.accessToken);
// // // //       toast.success('Login successful!');
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       const message = error.response?.data?.message || 'Login failed';
// // // //       return rejectWithValue(message);
// // // //     }
// // // //   }
// // // // );

// // // // export const registerUser = createAsyncThunk(
// // // //   'auth/register',
// // // //   async (userData, { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await authAPI.register(userData);
// // // //       localStorage.setItem('accessToken', response.data.accessToken);
// // // //       toast.success('Registration successful!');
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       const message = error.response?.data?.message || 'Registration failed';
// // // //       return rejectWithValue(message);
// // // //     }
// // // //   }
// // // // );

// // // // export const logoutUser = createAsyncThunk(
// // // //   'auth/logout',
// // // //   async (_, { rejectWithValue }) => {
// // // //     try {
// // // //       await authAPI.logout();
// // // //       localStorage.removeItem('accessToken');
// // // //       toast.success('Logout successful!');
// // // //       return null;
// // // //     } catch (error) {
// // // //       // Even if logout fails on server, clear local storage
// // // //       localStorage.removeItem('accessToken');
// // // //       return null;
// // // //     }
// // // //   }
// // // // );

// // // // export const fetchUserProfile = createAsyncThunk(
// // // //   'auth/fetchProfile',
// // // //   async (_, { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await authAPI.getProfile();
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       const message = error.response?.data?.message || 'Failed to fetch profile';
// // // //       return rejectWithValue(message);
// // // //     }
// // // //   }
// // // // );

// // // // export const fetchDashboard = createAsyncThunk(
// // // //   'auth/fetchDashboard',
// // // //   async (role, { rejectWithValue }) => {
// // // //     try {
// // // //       const response = await authAPI.getDashboard(role);
// // // //       return response.data;
// // // //     } catch (error) {
// // // //       const message = error.response?.data?.message || 'Failed to fetch dashboard';
// // // //       return rejectWithValue(message);
// // // //     }
// // // //   }
// // // // );

// // // // // Initial state
// // // // const initialState = {
// // // //   user: null,
// // // //   token: localStorage.getItem('accessToken') || null,
// // // //   isAuthenticated: false,
// // // //   loading: false,
// // // //   error: null,
// // // //   dashboardData: null,
// // // // };

// // // // // Auth slice
// // // // const authSlice = createSlice({
// // // //   name: 'auth',
// // // //   initialState,
// // // //   reducers: {
// // // //     clearError: (state) => {
// // // //       state.error = null;
// // // //     },
// // // //     setCredentials: (state, action) => {
// // // //       state.user = action.payload.user;
// // // //       state.token = action.payload.accessToken;
// // // //       state.isAuthenticated = true;
// // // //     },
// // // //     logout: (state) => {
// // // //       state.user = null;
// // // //       state.token = null;
// // // //       state.isAuthenticated = false;
// // // //       state.dashboardData = null;
// // // //       localStorage.removeItem('accessToken');
// // // //     }
// // // //   },
// // // //   extraReducers: (builder) => {
// // // //     builder
// // // //       // Login
// // // //       .addCase(loginUser.pending, (state) => {
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(loginUser.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.user = action.payload.user;
// // // //         state.token = action.payload.accessToken;
// // // //         state.isAuthenticated = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(loginUser.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //         state.isAuthenticated = false;
// // // //       })
      
// // // //       // Register
// // // //       .addCase(registerUser.pending, (state) => {
// // // //         state.loading = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(registerUser.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.user = action.payload.user;
// // // //         state.token = action.payload.accessToken;
// // // //         state.isAuthenticated = true;
// // // //         state.error = null;
// // // //       })
// // // //       .addCase(registerUser.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //         state.isAuthenticated = false;
// // // //       })
      
// // // //       // Logout
// // // //       .addCase(logoutUser.fulfilled, (state) => {
// // // //         state.user = null;
// // // //         state.token = null;
// // // //         state.isAuthenticated = false;
// // // //         state.dashboardData = null;
// // // //         state.loading = false;
// // // //         state.error = null;
// // // //       })
      
// // // //       // Fetch Profile
// // // //       .addCase(fetchUserProfile.pending, (state) => {
// // // //         state.loading = true;
// // // //       })
// // // //       .addCase(fetchUserProfile.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.user = action.payload;
// // // //         state.isAuthenticated = true;
// // // //       })
// // // //       .addCase(fetchUserProfile.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //         state.isAuthenticated = false;
// // // //         state.token = null;
// // // //         localStorage.removeItem('accessToken');
// // // //       })
      
// // // //       // Fetch Dashboard
// // // //       .addCase(fetchDashboard.pending, (state) => {
// // // //         state.loading = true;
// // // //       })
// // // //       .addCase(fetchDashboard.fulfilled, (state, action) => {
// // // //         state.loading = false;
// // // //         state.dashboardData = action.payload;
// // // //       })
// // // //       .addCase(fetchDashboard.rejected, (state, action) => {
// // // //         state.loading = false;
// // // //         state.error = action.payload;
// // // //       });
// // // //   },
// // // // });

// // // // export const { clearError, setCredentials, logout } = authSlice.actions;
// // // // export default authSlice.reducer;







// // // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // // // Async thunks
// // // export const loginUser = createAsyncThunk(
// // //   'auth/loginUser',
// // //   async (credentials, { rejectWithValue }) => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/auth/login`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         credentials: 'include',
// // //         body: JSON.stringify(credentials),
// // //       });

// // //       const data = await response.json();
      
// // //       if (!response.ok) {
// // //         return rejectWithValue(data.error || 'Login failed');
// // //       }

// // //       localStorage.setItem('accessToken', data.accessToken);
// // //       return data;
// // //     } catch (error) {
// // //       return rejectWithValue(error.message);
// // //     }
// // //   }
// // // );

// // // export const registerUser = createAsyncThunk(
// // //   'auth/registerUser',
// // //   async (userData, { rejectWithValue }) => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/auth/register`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         credentials: 'include',
// // //         body: JSON.stringify(userData),
// // //       });

// // //       const data = await response.json();
      
// // //       if (!response.ok) {
// // //         return rejectWithValue(data.error || 'Registration failed');
// // //       }

// // //       localStorage.setItem('accessToken', data.accessToken);
// // //       return data;
// // //     } catch (error) {
// // //       return rejectWithValue(error.message);
// // //     }
// // //   }
// // // );

// // // export const refreshToken = createAsyncThunk(
// // //   'auth/refreshToken',
// // //   async (_, { rejectWithValue }) => {
// // //     try {
// // //       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
// // //         method: 'POST',
// // //         credentials: 'include',
// // //       });

// // //       const data = await response.json();
      
// // //       if (!response.ok) {
// // //         return rejectWithValue(data.error || 'Token refresh failed');
// // //       }

// // //       localStorage.setItem('accessToken', data.accessToken);
// // //       return data;
// // //     } catch (error) {
// // //       return rejectWithValue(error.message);
// // //     }
// // //   }
// // // );

// // // export const logoutUser = createAsyncThunk(
// // //   'auth/logoutUser',
// // //   async (_, { rejectWithValue }) => {
// // //     try {
// // //       await fetch(`${API_BASE_URL}/auth/logout`, {
// // //         method: 'POST',
// // //         credentials: 'include',
// // //         headers: {
// // //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
// // //         }
// // //       });
      
// // //       localStorage.removeItem('accessToken');
// // //       return null;
// // //     } catch (error) {
// // //       localStorage.removeItem('accessToken');
// // //       return rejectWithValue(error.message);
// // //     }
// // //   }
// // // );

// // // const authSlice = createSlice({
// // //   name: 'auth',
// // //   initialState: {
// // //     user: null,
// // //     accessToken: localStorage.getItem('accessToken'),
// // //     isLoading: false,
// // //     error: null,
// // //     isAuthenticated: !!localStorage.getItem('accessToken'),
// // //   },
// // //   reducers: {
// // //     clearError: (state) => {
// // //       state.error = null;
// // //     },
// // //     resetAuth: (state) => {
// // //       state.user = null;
// // //       state.accessToken = null;
// // //       state.isAuthenticated = false;
// // //       state.error = null;
// // //       localStorage.removeItem('accessToken');
// // //     },
// // //   },
// // //   extraReducers: (builder) => {
// // //     builder
// // //       // Login
// // //       .addCase(loginUser.pending, (state) => {
// // //         state.isLoading = true;
// // //         state.error = null;
// // //       })
// // //       .addCase(loginUser.fulfilled, (state, action) => {
// // //         state.isLoading = false;
// // //         state.user = action.payload.user;
// // //         state.accessToken = action.payload.accessToken;
// // //         state.isAuthenticated = true;
// // //       })
// // //       .addCase(loginUser.rejected, (state, action) => {
// // //         state.isLoading = false;
// // //         state.error = action.payload;
// // //         state.isAuthenticated = false;
// // //       })
// // //       // Register
// // //       .addCase(registerUser.pending, (state) => {
// // //         state.isLoading = true;
// // //         state.error = null;
// // //       })
// // //       .addCase(registerUser.fulfilled, (state, action) => {
// // //         state.isLoading = false;
// // //         state.user = action.payload.user;
// // //         state.accessToken = action.payload.accessToken;
// // //         state.isAuthenticated = true;
// // //       })
// // //       .addCase(registerUser.rejected, (state, action) => {
// // //         state.isLoading = false;
// // //         state.error = action.payload;
// // //         state.isAuthenticated = false;
// // //       })
// // //       // Logout
// // //       .addCase(logoutUser.fulfilled, (state) => {
// // //         state.user = null;
// // //         state.accessToken = null;
// // //         state.isAuthenticated = false;
// // //       })
// // //       // Refresh
// // //       .addCase(refreshToken.fulfilled, (state, action) => {
// // //         state.user = action.payload.user;
// // //         state.accessToken = action.payload.accessToken;
// // //         state.isAuthenticated = true;
// // //       })
// // //       .addCase(refreshToken.rejected, (state) => {
// // //         state.user = null;
// // //         state.accessToken = null;
// // //         state.isAuthenticated = false;
// // //         localStorage.removeItem('accessToken');
// // //       });
// // //   },
// // // });

// // // export const { clearError, resetAuth } = authSlice.actions;
// // // export default authSlice.reducer;

// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // // -------- Thunks --------
// // export const loginUser = createAsyncThunk(
// //   'auth/loginUser',
// //   async (credentials, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/auth/login`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify(credentials),
// //       });

// //       const data = await response.json();
// //       if (!response.ok) return rejectWithValue(data.error || 'Login failed');

// //       localStorage.setItem('accessToken', data.accessToken);
// //       localStorage.setItem('user', JSON.stringify(data.user));
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// // export const registerUser = createAsyncThunk(
// //   'auth/registerUser',
// //   async (userData, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/auth/register`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify(userData),
// //       });

// //       const data = await response.json();
// //       if (!response.ok) return rejectWithValue(data.error || 'Registration failed');

// //       localStorage.setItem('accessToken', data.accessToken);
// //       localStorage.setItem('user', JSON.stringify(data.user));
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// // export const refreshToken = createAsyncThunk(
// //   'auth/refreshToken',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
// //         method: 'POST',
// //         credentials: 'include',
// //       });

// //       const data = await response.json();
// //       if (!response.ok) return rejectWithValue(data.error || 'Token refresh failed');

// //       localStorage.setItem('accessToken', data.accessToken);
// //       localStorage.setItem('user', JSON.stringify(data.user));
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(error.message);
// //     }
// //   }
// // );

// // export const logoutUser = createAsyncThunk(
// //   'auth/logoutUser',
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       await fetch(`${API_BASE_URL}/auth/logout`, {
// //         method: 'POST',
// //         credentials: 'include',
// //         headers: {
// //           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
// //         }
// //       });
// //     } catch (error) {
// //       return rejectWithValue(error.message);
// //     } finally {
// //       localStorage.removeItem('accessToken');
// //       localStorage.removeItem('user');
// //     }
// //     return null;
// //   }
// // );

// // // -------- Slice --------
// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: {
// //     user: JSON.parse(localStorage.getItem('user')) || null,
// //     accessToken: localStorage.getItem('accessToken'),
// //     isLoading: false,
// //     error: null,
// //     isAuthenticated: !!localStorage.getItem('accessToken'),
// //   },
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //     resetAuth: (state) => {
// //       state.user = null;
// //       state.accessToken = null;
// //       state.isAuthenticated = false;
// //       state.error = null;
// //       localStorage.removeItem('accessToken');
// //       localStorage.removeItem('user');
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Login
// //       .addCase(loginUser.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(loginUser.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload.user;
// //         state.accessToken = action.payload.accessToken;
// //         state.isAuthenticated = true;
// //       })
// //       .addCase(loginUser.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //         state.isAuthenticated = false;
// //       })
// //       // Register
// //       .addCase(registerUser.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload.user;
// //         state.accessToken = action.payload.accessToken;
// //         state.isAuthenticated = true;
// //       })
// //       .addCase(registerUser.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       })
// //       // Logout
// //       .addCase(logoutUser.fulfilled, (state) => {
// //         state.user = null;
// //         state.accessToken = null;
// //         state.isAuthenticated = false;
// //       })
// //       // Refresh
// //       .addCase(refreshToken.fulfilled, (state, action) => {
// //         state.user = action.payload.user;
// //         state.accessToken = action.payload.accessToken;
// //         state.isAuthenticated = true;
// //       })
// //       .addCase(refreshToken.rejected, (state) => {
// //         state.user = null;
// //         state.accessToken = null;
// //         state.isAuthenticated = false;
// //         localStorage.removeItem('accessToken');
// //         localStorage.removeItem('user');
// //       });
// //   },
// // });

// // export const { clearError, resetAuth } = authSlice.actions;
// // export default authSlice.reducer;




// // src/store/authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // -------- Thunks --------

// // Register
// export const registerUser = createAsyncThunk(
//   'auth/registerUser',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || 'Registration failed');

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Login
// export const loginUser = createAsyncThunk(
//   'auth/loginUser',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(credentials),
//       });

//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || 'Login failed');

//       // persist
//       localStorage.setItem('accessToken', data.accessToken);
//       localStorage.setItem('user', JSON.stringify(data.user));

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Logout
// export const logoutUser = createAsyncThunk(
//   'auth/logoutUser',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });

//       if (!response.ok) return rejectWithValue('Logout failed');

//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('user');
//       return true;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Fetch profile
// export const fetchUserProfile = createAsyncThunk(
//   'auth/fetchUserProfile',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/users/profile`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch profile');

//       localStorage.setItem('user', JSON.stringify(data));
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // Fetch dashboard (NEW)
// export const fetchDashboard = createAsyncThunk(
//   'auth/fetchDashboard',
//   async (role, { rejectWithValue }) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/dashboard/${role}`, {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch dashboard');

//       return data;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // -------- Slice --------
// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     accessToken: localStorage.getItem('accessToken'),
//     isLoading: false,
//     error: null,
//     isAuthenticated: !!localStorage.getItem('accessToken'),
//     dashboardData: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     resetAuth: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       state.dashboardData = null;
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('user');
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })

//       // Login
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.isAuthenticated = true;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })

//       // Logout
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.accessToken = null;
//         state.isAuthenticated = false;
//         state.dashboardData = null;
//       })

//       // Profile
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload;
//         state.isAuthenticated = true;
//       })
//       .addCase(fetchUserProfile.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })

//       // Dashboard
//       .addCase(fetchDashboard.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboard.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.dashboardData = action.payload;
//       })
//       .addCase(fetchDashboard.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, resetAuth } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL?.replace(/\/+$/, '')) || 'http://localhost:5000/api';

// ---------- Thunks ----------

// Register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.error || 'Registration failed');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.error || 'Login failed');

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    // If your backend has /auth/logout, call it; otherwise just clear storage.
    // await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return rejectWithValue('No token');

      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.error || 'Failed to fetch profile');

      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Dashboard
export const fetchDashboard = createAsyncThunk(
  'auth/fetchDashboard',
  async (role, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return rejectWithValue('No token');

      const res = await fetch(`${API_BASE_URL}/dashboard/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return rejectWithValue('Unauthorized');
      }

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data?.error || 'Failed to fetch dashboard');
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ---------- Slice ----------
const tokenFromLS = localStorage.getItem('accessToken');
const userFromLS = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromLS ? JSON.parse(userFromLS) : null,
    accessToken: tokenFromLS && tokenFromLS !== 'undefined' && tokenFromLS !== 'null' ? tokenFromLS : null,
    isLoading: false,
    error: null,
    isAuthenticated: !!(tokenFromLS && tokenFromLS !== 'undefined' && tokenFromLS !== 'null'),
    dashboardData: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.dashboardData = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.isLoading = false; })
      .addCase(registerUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      // login
      .addCase(loginUser.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      // logout
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
        s.isAuthenticated = false;
        s.dashboardData = null;
      })

      // profile
      .addCase(fetchUserProfile.pending, (s) => { s.isLoading = true; })
      .addCase(fetchUserProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      // dashboard
      .addCase(fetchDashboard.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchDashboard.fulfilled, (s, a) => { s.isLoading = false; s.dashboardData = a.payload; })
      .addCase(fetchDashboard.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
