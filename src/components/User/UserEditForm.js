import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserEditForm({ userId, onClose, updateUserInList }) {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', age: '', address: '', password: '', userRoleId: '' });
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const apiUrl = `http://localhost:3000/api/users/${userId}`;
    const roleUrl = 'http://localhost:3000/api/user-roles/'

    axios.get(apiUrl)
      .then((response) => {
        setUser(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    axios.get(roleUrl)
      .then((response) => {
        setUserRoles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user roles:', error);
      });

  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateUser = () => {

    const apiUrl = `http://localhost:3000/api/users/${userId}`;

    //console.log('PUT Request URL:', apiUrl); 
    //console.log('PUT Request Data:', formData);
    axios
      .put(apiUrl, formData)
      .then((response) => {
        updateUserInList(response.data);
        onClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Age</label>
          <input
            type="text"
            className="form-control"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userRoleId">Role</label>
          <select
            className="form-control"
            name="userRoleId"
            value={formData.userRoleId}
            onChange={handleChange}
          >
            <option value="">Select a role</option>
            {userRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-primary mt-3 me-3 shadow-sm" onClick={handleUpdateUser}>Update</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2 shadow-sm" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default UserEditForm;