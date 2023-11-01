import axios from "axios";
import React, { useState } from "react";

function ProductForm({ addProduct }) {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  const [addProductStatus, setAddProductStatus] = useState(null);

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
      .post('http://localhost:3000/api/products', formData)
      .then((response) => {
        const newProduct = response.data;
        addProduct(newProduct);
        setFormData({ name: '', description: '', price: '', stock: '' });
        setAddProductStatus('success');
      })
      .catch((error) => {
        console.error('Gabim:', error);
        setAddProductStatus('error');
      });
  };

  const renderMessage = () => {
    if (addProductStatus === 'success') {
      return <div className="alert alert-success mt-3">Product added successfully!</div>;
    } else if (addProductStatus === 'error') {
      return <div className="alert alert-danger mt-3">Error while adding product. Please try again.</div>;
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
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            required
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            required
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default ProductForm;