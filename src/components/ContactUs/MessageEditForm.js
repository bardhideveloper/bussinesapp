import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MessageEditForm({ messageId, onClose, updateMessageInList }) {
  const [contactus, setContactUs] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const apiUrl = `http://localhost:3000/api/contactus/${messageId}`;

    axios.get(apiUrl)
      .then((response) => {
        setContactUs(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }, [messageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateMessage = () => {

    const apiUrl = `http://localhost:3000/api/contactus/${messageId}`;

    //console.log('PUT Request URL:', apiUrl); 
    //console.log('PUT Request Data:', formData);
    axios
      .put(apiUrl, formData)
      .then((response) => {
        updateMessageInList(response.data);
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
          <label htmlFor="name">Message</label>
          <input
            type="text"
            className="form-control"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button type="button" className="btn btn-primary mt-3 me-3 shadow-sm" onClick={handleUpdateMessage}>Update</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2 shadow-sm" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default MessageEditForm;