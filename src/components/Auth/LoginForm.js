import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from  '../Footer/Footer'

function LoginForm({ setUserRole }) {
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
          setUserRole(userRole);

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
        <div className="col-md-4">
          <h2 className="display-6">Login Form</h2>
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
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
                className="form-control"
                required
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-success">Login</button>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
  
}

export default LoginForm;