import axios from "axios";
import React, { useState, useEffect } from "react";

function UserForm({ addUser }) {
  const [formData, setFormData] = useState({ name: '', email: '', age: '', address: '', password: '', userRoleId: '' });
  const [roles, setRoles] = useState([]);
  const [addUserStatus, setAddUserStatus] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user-roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3000/api/users', formData)
      .then((response) => {
        const newUser = response.data;
        addUser(newUser);
        setFormData({ name: '', email: '', age: '', address: '', password: '', userRoleId: '' });
        setAddUserStatus('success');
      })
      .catch((error) => {
        console.error('Error:', error);
        setAddUserStatus('error');
      });
  };

  const renderMessage = () => {
    if (addUserStatus === 'success') {
      return <div className="alert alert-success mt-3">User added successfully!</div>;
    } else if (addUserStatus === 'error') {
      return <div className="alert alert-danger mt-3">Error while adding user. Please try again.</div>;
    } else {
      return null;
    }
  };

  return (
    <div className="container mt-4">
      {renderMessage()}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            required
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            required
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            required
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            required
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
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
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-control"
            required
            name="userRoleId"
            value={formData.userRoleId}
            onChange={handleChange}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">Add User</button>
      </form>
    </div>
  );
}

export default UserForm;