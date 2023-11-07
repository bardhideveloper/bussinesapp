import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../Footer/Footer'

function MakeOrder({ user }) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [addOrderStatus, setAddOrderStatus] = useState(null);
  const [stockStatus, setAddStockStatus] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const updateOrderTotal = () => {
    const newTotal = selectedProducts.reduce((total, product) => total + product.total_price, 0);
    setOrderTotal(newTotal);
  };

  const handleProductSelection = (product) => {
    const existingProduct = selectedProducts.find((p) => p.product_id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity < product.stock) {
        existingProduct.quantity += 1;
        existingProduct.total_price += product.price;
      } else {
        setAddStockStatus('error')
        return;
      }
    } else {
      if (product.stock > 0) {
        const newProduct = {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          unit_price: product.price,
          total_price: product.price,
        };
        setSelectedProducts([...selectedProducts, newProduct]);
      } else {
        setAddStockStatus('errorOutOfStock')
        return;
      }
    }
    // updateOrderTotal();
    setOrderTotal((prevTotal) => prevTotal + product.price);
  };

  const handleProductRemoval = (product_id) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.product_id !== product_id
    );

    setSelectedProducts(updatedSelectedProducts);

    if (updatedSelectedProducts.length === 0) {
      setOrderTotal(0);
    } else {
      const newTotal = updatedSelectedProducts.reduce((total, product) => total + product.total_price, 0);
      setOrderTotal(newTotal);
    }
  };

  const handleProductQuantityChange = (product_id, newQuantity) => {
    const updatedSelectedProducts = selectedProducts.map((product) => {
      if (product.product_id === product_id) {
        product.quantity = newQuantity;
        product.total_price = newQuantity * product.unit_price;
      }
      return product;
    });

    setSelectedProducts(updatedSelectedProducts);

    const newTotal = updatedSelectedProducts.reduce((total, product) => total + product.total_price, 0);
    setOrderTotal(newTotal);
  };

  const handleOrderPlacement = () => {

    if (orderTotal === 0 || address.trim() === '') {
      // Show an error message or handle the case where the total cost is 0 or the address is not filled
      setAddOrderStatus('error');
      return;
    }
    
    const orderData = {
      user_id: user.id,
      products: selectedProducts,
      address: address,
    };

    //console.log(user.id);


    axios.post('http://localhost:3000/api/orderitems', orderData)
      .then((response) => {
        setSelectedProducts([]);
        setOrderTotal(0);
        setAddOrderStatus('success');
      })
      .catch((error) => {
        console.error('Error placing the order:', error);
        setAddOrderStatus('error');
      });
  };

  const renderMessage = () => {
    if (addOrderStatus === 'success') {
      return <div className="alert alert-success mt-3">You have ordered successfully!</div>;
    } else if (addOrderStatus === 'error') {
      return <div className="alert alert-danger mt-3">You can't order now. Please try again.</div>;
    } 
    else {
      return null;
    }
  };

  useEffect(() => {
    if (addOrderStatus !== null) {
      const timer = setTimeout(() => {
        setAddOrderStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [addOrderStatus]);

  const renderStockMessage = () => {
    if (stockStatus === 'error') {
      return <div className='alert alert-danger mt-3'>Not enough stock available for this product.</div>
    }
    else if (stockStatus === 'errorOutOfStock') {
      return <div className='alert alert-danger mt-3'>This product is out of stock.</div>
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (stockStatus !== null) {
      const timer = setTimeout(() => {
        setAddStockStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [stockStatus]);

  return (
    <div className='container mt-5'>
      <h2 className='mt-4 mb-4 display-6'>Make an Order</h2>
      <div className="row">
        <div className='col-md-6'>
          <h3 className='mt-4 mb-4'>Available Products</h3>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Shop</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}€</td>
                  <td><button className='btn btn-outline-danger fa fa-shopping-cart' onClick={() => handleProductSelection(product)}></button></td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className='col-md-6'>
          <h3 className='mt-4 mb-4'>Your Order</h3>

          <input
            type="text"
            className="form-control"
            required
            name="address"
            placeholder="Address"
            style={{ maxWidth: '50%' }}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value); 
            }}
          />
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((selectedProduct) => (
                <tr key={selectedProduct.product_id}>
                  <td>{selectedProduct.product_name}</td>
                  <td>
                    <input
                      className='form-control'
                      type="number"
                      style={{ maxWidth: '50px' }}
                      value={selectedProduct.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        if (!isNaN(newQuantity)) {
                          handleProductQuantityChange(selectedProduct.product_id, newQuantity);
                        }
                      }}
                    />
                  </td>
                  <td>{(selectedProduct.quantity * selectedProduct.unit_price).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleProductRemoval(selectedProduct.product_id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className='lead'>Total Cost: €{parseFloat(orderTotal).toFixed(2)}</p>
          <button className='btn btn-success' onClick={handleOrderPlacement}>Place Order</button>
          {renderMessage()}
          {renderStockMessage()}
        </div>
      </div>
      <Footer />
    </div>

  );
}

export default MakeOrder;