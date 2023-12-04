import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard/Dashboard';
import AboutUs from './components/AboutUs/AboutUs';
import ContactUs from './components/ContactUs/ContactUs';
import UserList from './components/User/UserList';
import ProductList from './components/Product/ProductList';
import OrdersList from './components/Orders/OrdersList';
import MakeOrder from './components/Orders/MakeOrder';
import RegistrationForm from './components/Auth/RegistrationForm';
import LoginForm from './components/Auth/LoginForm';
import DashboardUser from './components/Dashboard/DashboardUser';
import ContactUsList from './components/ContactUs/ContactUsList';


function App() {

  const userData = JSON.parse(localStorage.getItem('user'));
  const initialUserRole = userData ? userData.role : 3;
  const [user, setUser] = useState(null);

  const [userRole, setUserRole] = useState(initialUserRole);
  //console.log('USER ROLE' , userRole)

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setUserRole(parseInt(storedUserRole, 10));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserRole(3);
  };

  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            {userRole === 1 && (
              <div className="admin-nav">
                <nav className="pt-3">
                  <ul className="nav fs-5 d-block">
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminPanel/dashboard">📊 Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminPanel/users">👥 Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminPanel/products">🛍️ Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminPanel/orders">📦 Orders</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/adminPanel/contactus">✉️ Messages</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboardUser" onClick={handleLogout}>📴 Logout</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
            </div>

            {userRole === 2 && (
              <div className="user-nav">
                <nav className="pt-3">
                  <ul className="nav fs-5">
                    <li className="nav-item">
                      <Link className="nav-link" to="/userPanel/dashboardUser">🏠 Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/order-items">📦 Order Items</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contactUs">📞 Contact Us</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/aboutUs">ℹ️ About Us</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboardUser" onClick={handleLogout}>📴 Logout</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {userRole !== 1 && userRole !== 2 && (
              <div className="default-nav">
                <nav className="pt-3">
                  <ul className="nav fs-5">
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboardUser">🏠 Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contactUs">📞 Contact Us</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/aboutUs">ℹ️ About Us</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/registrationform">📝 Register</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/loginform">🚪 Login</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          

          <div className="col-md-10">
            <Routes>
              <Route path="/" element={<Navigate to={userRole === 1 ? '/adminPanel/dashboard' : (userRole === 2 ? '/userPanel/dashboardUser' : '/dashboardUser')} />} />
              <Route path="/loginform" element={<LoginForm setUserRole={setUserRole} setUser={setUser} />} />

              {userRole === 1 && (
                <Route path="/adminPanel/*">
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="orders" element={<OrdersList />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="contactus" element={<ContactUsList />} />
                </Route>
              )}

              {userRole === 2 && (
                <Route path="/userPanel/*">
                  <Route path="dashboardUser" element={<DashboardUser />} />
                </Route>
              )}

              <Route path="dashboardUser" element={<DashboardUser />} />
              <Route path="/order-items" element={<MakeOrder user={user} />} />
              <Route path="/registrationform" element={<RegistrationForm />} />
              <Route path="/aboutUs" element={<AboutUs />} />
              <Route path="/contactUs" element={<ContactUs />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;