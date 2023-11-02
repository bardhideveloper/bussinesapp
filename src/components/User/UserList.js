import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import UserEditForm from './UserEditForm';
import Footer from '../Footer/Footer'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function UserList() {
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const addUser = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]);
  };

  const fetchUserRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user-roles');
      if (response.data && Array.isArray(response.data)) {
        const roleData = {};
        response.data.forEach((role) => {
          roleData[role.id] = role.name;
        });
        setUserRoles(roleData);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/users';

    axios.get(apiUrl)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
          fetchUserRoles();
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    const apiUrl = `http://localhost:3000/api/users/${userId}`;

    axios.delete(apiUrl)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    setShowEditUserModal(true);
  };

  const updateUserInList = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  const handleCloseEditForm = () => {
    setEditingUserId(null);
    setShowEditUserModal(false);
  };

  const handleShowAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const handleCloseAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();
    const rows = [];

    currentUsers.forEach((user) => {
      rows.push([user.id, user.name, user.email, user.age, user.address, user.password, userRoles[user.userRoleId]]);
    });

    const columnWidths = { 0: 10, 1: 40, 2: 60, 3: 10, 4: 60, 5: 40, 6: 40, };
    const fontSize = 10;
    
    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Age', 'Address', 'Password', 'Role']],
      body: rows,
      columnStyles: columnWidths,
      margin: { top: 20 },
      styles: { fontSize: fontSize },
    });

    doc.save('user-list.pdf');
  };

  return (
    <div>
      <h2 className="mt-4 mb-4 display-6">Users</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="btn btn-success mb-3 shadow-sm" onClick={handleShowAddUserModal}>Add New User</button>
      <button className="btn btn-primary mb-3 ms-2 shadow-sm" onClick={saveAsPDF}>Save as PDF</button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Address</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
              <td>{user.address}</td>
              <td>{user.password}</td>
              <td>{userRoles[user.userRoleId]}</td>
              <td>
                <button className="btn btn-primary me-3 shadow-sm" onClick={() => handleEditUser(user.id)}><i className="fas fa-edit"></i></button>
                <button className="btn btn-danger ml-2 shadow-sm" onClick={() => handleDeleteUser(user.id)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={`modal ${showAddUserModal ? 'show' : ''}`}
        style={{ display: showAddUserModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add User</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseAddUserModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <UserForm addUser={addUser} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${showEditUserModal ? 'show' : ''}`}
        style={{ display: showEditUserModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseEditForm}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {editingUserId && (
                <UserEditForm
                  userId={editingUserId}
                  onClose={handleCloseEditForm}
                  updateUserInList={updateUserInList}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
        </li>
        {Array.from({ length: Math.ceil(filteredUsers.length / perPage) }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(filteredUsers.length / perPage) ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
        </li>
      </ul>
      <Footer />
    </div>
  );
}

export default UserList;