import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageEditForm from './MessageEditForm';
import Footer from '../Footer/Footer'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ContactUsList() {

  const [conctactUs, setContactUs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditContactUsModal, setShowEditContactUsModal] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/contactus';

    axios.get(apiUrl)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setContactUs(response.data);
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDeleteMessage = (messageId) => {
    const apiUrl = `http://localhost:3000/api/contactus/${messageId}`;

    axios.delete(apiUrl)
      .then(() => {
        setContactUs((prevContactUs) => prevContactUs.filter((contactus) => contactus.id !== messageId));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditMessage = (messageId) => {
    setEditingMessageId(messageId);
    setShowEditContactUsModal(true);
  };

  const updateMessageInList = (updatedMessage) => {
    setContactUs((prevContactUs) =>
      prevContactUs.map((contactus) =>
        contactus.id === updatedMessage.id ? updatedMessage : contactus
      )
    );
  };

  const handleCloseEditForm = () => {
    setEditingMessageId(null);
    setShowEditContactUsModal(false);
  };

  const filteredContactUs = conctactUs.filter((contactus) =>
    contactus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMessage = currentPage * perPage;
  const indexOfFirstMessage = indexOfLastMessage - perPage;
  const currentMessage = filteredContactUs.slice(indexOfFirstMessage, indexOfLastMessage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();
    const rows = [];
    currentMessage.forEach((message) => {
      rows.push([message.id, message.name, message.email, message.message]);
    });

    const columnWidths = { 0: 10, 1: 40, 2: 60, 3: 10 };
    const fontSize = 10;

    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Message']],
      body: rows,
      columnStyles: columnWidths,
      margin: { top: 20 },
      styles: { fontSize: fontSize },
    });

    doc.save('message-list.pdf');
  };

  return (

    <div>
      <h2 className="mt-4 mb-4 display-6">Contact Us Messages</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-3 shadow-sm" onClick={saveAsPDF}>Save as PDF</button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentMessage.map((contactus) => (
            <tr key={contactus.id}>
              <td>{contactus.id}</td>
              <td>{contactus.name}</td>
              <td>{contactus.email}</td>
              <td>{contactus.message}</td>
              <td>
                <button className="btn btn-primary me-3 shadow-sm" onClick={() => handleEditMessage(contactus.id)}><i className="fas fa-edit"></i></button>
                <button className="btn btn-danger ml-2 shadow-sm" onClick={() => handleDeleteMessage(contactus.id)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={`modal ${showEditContactUsModal ? 'show' : ''}`}
        style={{ display: showEditContactUsModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Message</h5>
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
              {editingMessageId && (
                <MessageEditForm
                  messageId={editingMessageId}
                  onClose={handleCloseEditForm}
                  updateMessageInList={updateMessageInList}
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
        {Array.from({ length: Math.ceil(filteredContactUs.length / perPage) }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(filteredContactUs.length / perPage) ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
        </li>
      </ul>
      <Footer />
    </div>
  )

}

export default ContactUsList;