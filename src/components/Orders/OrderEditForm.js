import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderEditForm({ orderId, onClose, updateOrderInList }) {
  const [order, setOrder] = useState({});
  const [formData, setFormData] = useState({ order_date: '', total_cost: 0, user_id: '' });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const apiUrl = `http://localhost:3000/api/orders/${orderId}`;
    const usersUrl = 'http://localhost:3000/api/users/';

    axios.get(apiUrl)
      .then((response) => {
        setOrder(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    axios.get(usersUrl)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateOrder = () => {
    const apiUrl = `http://localhost:3000/api/orders/${orderId}`;

    axios
      .put(apiUrl, formData)
      .then((response) => {
        updateOrderInList(response.data);
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
          <label htmlFor="order_date">Order Date</label>
          <input
            type="text"
            className="form-control"
            name="order_date"
            placeholder="Order Date"
            value={formData.order_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="total_cost">Total Cost</label>
          <input
            type="number"
            className="form-control"
            name="total_cost"
            placeholder="Total Cost"
            value={formData.total_cost}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="user_id">User</label>
          <select
            className="form-control"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn btn-primary mt-3 me-3 shadow-sm" onClick={handleUpdateOrder}>Update</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2 shadow-sm" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default OrderEditForm;   