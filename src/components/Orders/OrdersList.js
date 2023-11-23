import React, { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import OrderEditForm from './OrderEditForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderId, setOrderId] = useState({});
  const [filteredDate, setFilteredDate] = useState('');
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      if (response.data && Array.isArray(response.data)) {
        const idData = {};
        response.data.forEach((user) => {
          idData[user.id] = user.email; 
        });
        setOrderId(idData);
      }
    } catch (error) {
      console.error('Error fetching user id:', error);
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('Invalid response data:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };

  useEffect(() => {
    const apiUrl = 'http://localhost:3000/api/orders/';

    axios.get(apiUrl)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setOrders(response.data);
          fetchUserId();
        } else {
          console.error('Invalid response data:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDeleteOrder = (orderId) => {
    const apiUrl = `http://localhost:3000/api/orders/${orderId}`;

    axios.delete(apiUrl)
      .then(() => {
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditOrder = (orderId) => {
    setEditingOrderId(orderId);
    setShowEditOrderModal(true);
  };

  const updateOrderInList = (updatedOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleCloseEditForm = () => {
    setEditingOrderId(null);
    setShowEditOrderModal(false);
  };

  const currentOrders = orders.filter((order) => {
    if (filteredDate) {
      const orderDate = new Date(order.order_date).toLocaleDateString();
      return orderDate.includes(filteredDate);
    }
    return true;
  });

  const indexOfLastOrder = currentPage * perPage;
  const indexOfFirstOrder = indexOfLastOrder - perPage;
  const currentOrdersPage = currentOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const saveAsPDF = async () => {
    const doc = new jsPDF();
    const allOrders = await getAllOrders();
    const rowCount = allOrders.length;

    const rows = [];
    allOrders.forEach((order) => {
      rows.push([order.id, order.createdAt, order.total_cost,order.address,orderId[order.user_id]]);
    });
  
    const columnWidths = {0: 10,1: 40, 2: 60};
  
    const fontSize = 10;
  
    doc.autoTable({
      head: [['ID', 'Date', 'Total Cost','Address','User']],
      body: rows,
      columnStyles: columnWidths,
      margin: { top: 20 }, 
      styles: { fontSize: fontSize },
    });

    const smallTextSize = 8;
    doc.setFontSize(smallTextSize);
    doc.text(`Number of Rows: ${rowCount}`, 10, doc.autoTable.previous.finalY + 10);
    doc.save('order-list.pdf');
  };

  return (
    <div>
      <h2 className="mt-4 mb-4 display-6">Orders</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by date"
          value={filteredDate}
          onChange={(e) => setFilteredDate(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-3 shadow-sm" onClick={saveAsPDF}>Save as PDF</button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total Cost</th>
            <th>Address</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOrdersPage.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Invalid Date'}</td>
              <td>{order.total_cost}</td>
              <td>{order.address}</td>
              <td>{orderId[order.user_id]}</td>
              <td>
                <button className="btn btn-primary me-3 shadow-sm" onClick={() => handleEditOrder(order.id)}><i className="fas fa-edit"></i></button>
                <button className="btn btn-danger ml-2 shadow-sm" onClick={() => handleDeleteOrder(order.id)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
        </li>
        {Array.from({ length: Math.ceil(currentOrders.length / perPage) }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(currentOrders.length / perPage) ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
        </li>
      </ul>

      <div
        className={`modal ${showEditOrderModal ? 'show' : ''}`}
        style={{ display: showEditOrderModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Order</h5>
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
              {editingOrderId && (
                <OrderEditForm
                  orderId={editingOrderId}
                  onClose={handleCloseEditForm}
                  updateOrderInList={updateOrderInList}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersList;