import React, { useState } from 'react';
import axios from 'axios';


function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', });
  const [addMessageStatus, setAddMessageStatus] = useState(null);

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
      .post('http://localhost:3000/api/contactus', formData)
      .then((response) => {
        //const newMessage = response.data;
        //addMessage(newMessage); 
        setFormData({ name: '', email: '', message: '' });
        setAddMessageStatus('success');
      })
      .catch((error) => {
        console.error('Error:', error);
        setAddMessageStatus('error');
      });
  };

  const renderMessage = () => {
    if (addMessageStatus === 'success') {
      return <div className="alert alert-success mt-3">Message sent successfully!</div>;
    } else if (addMessageStatus === 'error') {
      return <div className="alert alert-danger mt-3">Error while sending message. Please try again.</div>;
    } else {
      return null;
    }
  };

  return (
    <div className="container mt-5">
      {renderMessage()}
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1 className="display-4 text-center">Contact Us</h1>
          <p className="lead text-center">Have questions or feedback? Contact us below.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name"></label>
              <input type="text" className="form-control" name='name' placeholder="Your Name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email"></label>
              <input type="email" className="form-control" name='email' placeholder="Your Email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message"></label>
              <textarea className="form-control" name='message' rows="4" placeholder="Your Message" value={formData.message} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;