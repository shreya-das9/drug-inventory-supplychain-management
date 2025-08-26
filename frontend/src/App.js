// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { Toaster } from 'react-hot-toast';
// import Login from './components/auth/Login';
// import Signup from './components/auth/Signup';
// import AdminDashboard from './components/dashboards/AdminDashboard';
// import WarehouseDashboard from './components/dashboards/WarehouseDashboard';
// import RetailerDashboard from './components/dashboards/RetailerDashboard';
// import UserDashboard from './components/dashboards/UserDashboard';
// import { refreshToken } from './store/authSlice';

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
  
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
//     return <Navigate to="/unauthorized" />;
//   }
  
//   return children;
// };

// const DashboardRouter = () => {
//   const { user } = useSelector((state) => state.auth);
  
//   switch (user?.role) {
//     case 'ADMIN':
//       return <AdminDashboard />;
//     case 'WAREHOUSE':
//       return <WarehouseDashboard />;
//     case 'RETAILER':
//       return <RetailerDashboard />;
//     case 'USER':
//       return <UserDashboard />;
//     default:
//       return <Navigate to="/login" />;
//   }
// };

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (localStorage.getItem('accessToken')) {
//       dispatch(refreshToken());
//     }
//   }, [dispatch]);

//   return (
//     <Router>
//       <div className="App">
//         <Toaster position="top-right" />
//         <Routes>
//           <Route 
//             path="/login" 
//             element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
//           />
//           <Route 
//             path="/signup" 
//             element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
//           />
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <DashboardRouter />
//               </ProtectedRoute>
//             } 
//           />
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;




import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from './store/authSlice';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import DashboardRouter from './components/DashboardRouter';

const Protected = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(refreshToken());
    }
  }, [dispatch]);

  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/dashboard" element={<Protected><DashboardRouter /></Protected>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
