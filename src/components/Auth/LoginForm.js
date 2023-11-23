import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import "./loginForm.scss";

function LoginForm({ setUserRole, setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));



        if (user && user.role !== undefined) {
          const userRole = user.role;
          //console.log('userRole before setting in localStorage:', userRole); 
          setUserRole(userRole);
          //console.log('The user role:' , userRole)

          setUser(user);

          navigate('/');
        } else {
          setErrorMessage('Role information is missing in the response.');
        }
      } else {
        setErrorMessage('Invalid Credentials. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login Failed', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className='login d-flex align-items-center justify-content-center'>
            <h2 className="display-6">Login into the BussinesApp ➡</h2>
          </div>
        </div>
        <div className='col-md-4'>
          <div className="login-form">
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control custom-input"
                  required
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control custom-input"
                  required
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-success w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

export default LoginForm;