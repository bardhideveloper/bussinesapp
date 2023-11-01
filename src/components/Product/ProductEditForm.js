import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductEditForm({ productId, onClose, updateProductInList }) {
  const [product, setProduct] = useState({});
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  // const [updateProductStatus, setUpdateProductStatus] = useState(null);

  useEffect(() => {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;

    axios.get(apiUrl)
      .then((response) => {
        setProduct(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateProduct = () => {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;

    axios.put(apiUrl, formData)
      .then((response) => {
        updateProductInList(response.data);
        onClose();
        // setUpdateProductStatus('success');

      })
      .catch((error) => {
        console.error('Error:', error);
        // setUpdateProductStatus('error');
      });
  };

  // const renderMessage = () => {
  //   if (updateProductStatus === 'success') {
  //     return <div className="alert alert-success mt-3">Product updated successfully!</div>;

  //   } else if (updateProductStatus === 'error') {
  //     return <div className="alert alert-danger mt-3">Error while updating product. Please try again.</div>;
  //   } else {
  //     return null;
  //   }
  // };

  return (
    <div>
      {/* {renderMessage()} */}
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
          <label htmlFor="name">Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
        <button type="button" className="btn btn-primary mt-3 me-3 shadow-sm" onClick={handleUpdateProduct}>Update</button>
        <button type="button" className="btn btn-secondary mt-3 ml-2 shadow-sm" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default ProductEditForm;

