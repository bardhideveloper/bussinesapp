import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Footer from '../Footer/Footer'

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [usersAddedToday, setUsersAddedToday] = useState(0);
  const [productsAddedToday, setProductsAddedToday] = useState(0);
  const [ordersAddedToday, setOrdersAddedToday] = useState(0);
  const [messagesAddedToday, setMessagesAddedToday] = useState(0)
  const [productsUpdatedToday, setProductsUpdatedToday] = useState(0);
  const [usersUpdatedToday, setUsersUpdatedToday] = useState(0);
  const [ordersUpdatedToday, setOrdersUpdatedToday] = useState(0);
  const [messagesUpdatedToday, setMessagesUpdatedToday] = useState(0);

  useEffect(() => {
    const userApiUrl = 'http://localhost:3000/api/users';
    const productApiUrl = 'http://localhost:3000/api/products';
    const orderApiUrl = "http://localhost:3000/api/orders";
    const messageApiUrl = "http://localhost:3000/api/contactus";

    //total users 
    axios.get(userApiUrl)
      .then((response) => {
        setUserCount(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching total users:', error);
      });

    //total products
    axios.get(productApiUrl)
      .then((response) => {
        setProductCount(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching total products:', error);
      });

    //total orders
    axios.get(orderApiUrl)
      .then((response) => {
        setOrderCount(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching total orders:', error);
      })

    //total messages
    axios.get(messageApiUrl)
      .then((response) => {
        setMessageCount(response.data.length);
      })
      .catch((error) => {
        console.error('Error fetching total messages', error);
      })

    //users added today
    axios.get(userApiUrl)
      .then((response) => {
        const userData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const usersAddedToday = userData.filter((user) => {
          const userTimestamp = new Date(user.createdAt).getTime();
          return userTimestamp >= todayStartTimestamp && userTimestamp <= todayEndTimestamp;
        });
        setUsersAddedToday(usersAddedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching users added today:', error);
      });

    //users updated today
    axios.get(userApiUrl)
      .then((response) => {
        const userData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const usersUpdatedToday = userData.filter((user) => {
          const userTimestamp = new Date(user.updatedAt).getTime();
          return userTimestamp >= todayStartTimestamp && userTimestamp <= todayEndTimestamp;
        });
        setUsersUpdatedToday(usersUpdatedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching users updated today:', error);
      });

    //products added today
    axios.get(productApiUrl)
      .then((response) => {
        const productData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const productsAddedToday = productData.filter((product) => {
          const productTimestamp = new Date(product.createdAt).getTime();
          return productTimestamp >= todayStartTimestamp && productTimestamp <= todayEndTimestamp;
        });
        setProductsAddedToday(productsAddedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching products added today:', error);
      });

    //products updated today
    axios.get(productApiUrl)
      .then((response) => {
        const productData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const productsUpdatedToday = productData.filter((product) => {
          const productTimestamp = new Date(product.updatedAt).getTime();
          return productTimestamp >= todayStartTimestamp && productTimestamp <= todayEndTimestamp;
        });
        setProductsUpdatedToday(productsUpdatedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching products updated today:', error);
      });

    //orders added today
    axios.get(orderApiUrl)
      .then((response) => {
        const OrderData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const ordersAddedToday = OrderData.filter((order) => {
          const orderTimestamp = new Date(order.createdAt).getTime();
          return orderTimestamp >= todayStartTimestamp && orderTimestamp <= todayEndTimestamp;
        });
        setOrdersAddedToday(ordersAddedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching orders added today:', error);
      });

    //orders updated today
    axios.get(orderApiUrl)
      .then((response) => {
        const orderData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const ordersUpdatedToday = orderData.filter((order) => {
          const orderTimestamp = new Date(order.updatedAt).getTime();
          return orderTimestamp >= todayStartTimestamp && orderTimestamp <= todayEndTimestamp;
        });
        setOrdersUpdatedToday(ordersUpdatedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching orders updated today:', error);
      });

    //messages added today
    axios.get(messageApiUrl)
      .then((response) => {
        const messageData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const messagesAddedToday = messageData.filter((message) => {
          const messageTimestamp = new Date(message.createdAt).getTime();
          return messageTimestamp >= todayStartTimestamp && messageTimestamp <= todayEndTimestamp;
        });
        setMessagesAddedToday(messagesAddedToday.length);
      })
      .catch((error) => {
        console.error('Error fetching messages added today:', error);
      });

    //messages updated today
    axios.get(messageApiUrl)
      .then((response) => {
        const messageData = response.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStartTimestamp = today.getTime();
        today.setHours(23, 59, 59, 999);
        const todayEndTimestamp = today.getTime();

        const messagesUpdatedToday = messageData.filter((message) => {
          const messageTimestamp = new Date(message.updatedAt).getTime();
          return messageTimestamp >= todayStartTimestamp && messageTimestamp <= todayEndTimestamp;
        });
        setMessagesUpdatedToday(messagesUpdatedToday.length);
        //console.log("Messages Updated Today:", messagesUpdatedToday)
      })
      .catch((error) => {
        console.error('Error fetching messages updated today:', error);
      });

  }, []);

  const saveAsPDF = () => {
    const doc = new jsPDF();
    const data = [
      ['Category', 'Total', 'Added Today', 'Updated Today'],
      ['Users', userCount, usersAddedToday, usersUpdatedToday],
      ['Products', productCount, productsAddedToday, productsUpdatedToday],
      ['Orders', orderCount, ordersAddedToday, ordersUpdatedToday],
      ['Messages', messageCount, messagesAddedToday, messagesUpdatedToday],
    ];

    doc.autoTable({
      head: [data[0]],
      body: data.slice(1),
    });

    // Save the PDF
    doc.save('dashboard.pdf');
  };

  return (
    <div className="container-fluid mt-5 ">
      <h2 className="display-4">Welcome to Admin Dashboard</h2>
      <p className='lead'>We're excited to have you on board. Explore our admin panel and discover everything we have for this application.</p>
      <button className="btn btn-primary mb-3" onClick={saveAsPDF}>Save as PDF</button>  
      <div className='row'>
        <div className='col-md-3'>
          <h4 className='mt-4 mb-4'>User Information</h4>
        </div>

        <div className='col-md-3'>
          <h4 className='mt-4 mb-4'>Product Information</h4>
        </div>

        <div className='col-md-3'>
          <h4 className='mt-4 mb-4'>Order Information</h4>
        </div>

        <div className='col-md-3'>
          <h4 className='mt-4 mb-4'>Message Information</h4>
        </div>

      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Total Users:</h5>
              <p className="card-text fs-4">{userCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Total Products:</h5>
              <p className="card-text fs-4">{productCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Total Orders:</h5>
              <p className="card-text fs-4">{orderCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Total Messages:</h5>
              <p className="card-text fs-4">{messageCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light ">
            <div className="card-body">
              <h5 className="card-title">Users Added Today:</h5>
              <p className="card-text fs-4">{usersAddedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Products Added Today:</h5>
              <p className="card-text fs-4">{productsAddedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Orders Added Today:</h5>
              <p className="card-text fs-4">{ordersAddedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Messages Added Today:</h5>
              <p className="card-text fs-4">{messagesAddedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Users Updated Today:</h5>
              <p className='card-text fs-4'>{usersUpdatedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Products Updated Today:</h5>
              <p className="card-text fs-4">{productsUpdatedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Orders Updated Today:</h5>
              <p className="card-text fs-4">{ordersUpdatedToday}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-3">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title">Messages Updated Today:</h5>
              <p className="card-text fs-4">{messagesUpdatedToday}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Dashboard;