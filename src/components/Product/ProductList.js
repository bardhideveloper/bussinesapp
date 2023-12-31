import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductEditForm from './ProductEditForm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
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
    getAllProducts().then((data) => setProducts(data));
  }, []);

  const handleDeleteProduct = (productId) => {
    const apiUrl = `http://localhost:3000/api/products/${productId}`;

    axios.delete(apiUrl)
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setShowEditProductModal(true);
  };

  const updateProductInList = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleCloseEditForm = () => {
    setEditingProductId(null);
    setShowEditProductModal(false);
  };

  const handleShowAddProductModal = () => {
    setShowAddProductModal(true);
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * perPage;
  const indexOfFirstProduct = indexOfLastProduct - perPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const saveAsPDF = async () => {
    const allProducts = await getAllProducts();
    const rowCount = allProducts.length;
    const doc = new jsPDF();


    const rows = [];
    allProducts.forEach((product) => {
      rows.push([product.id, product.name, product.description, product.price, product.stock]);
    });

    const columnWidths = { 0: 10, 1: 40, 2: 60, 3: 10, 4: 60 };

    const fontSize = 10;

    doc.autoTable({
      head: [['ID', 'Name', 'Description', 'Price', 'Stock']],
      body: rows,
      columnStyles: columnWidths,
      margin: { top: 20 },
      styles: { fontSize: fontSize },
    });
    const smallTextSize = 8;
    doc.setFontSize(smallTextSize);
    doc.text(`Number of Rows: ${rowCount}`, 10, doc.autoTable.previous.finalY + 10);
    doc.save('product-list.pdf');
  };

  return (
    <div>
      <h2 className="mt-4 mb-4 display-6">Products</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button className="btn btn-success mb-3 shadow-sm" onClick={handleShowAddProductModal}>Add New Product</button>
      <button className="btn btn-primary mb-3 ms-2 shadow-sm" onClick={saveAsPDF}>Save as PDF</button>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>€{product.price}</td>
              <td>{product.stock}</td>
              <td>
                <button className="btn btn-primary me-3 shadow-sm" onClick={() => handleEditProduct(product.id)}><i className="fas fa-edit"></i></button>
                <button className="btn btn-danger shadow-sm" onClick={() => handleDeleteProduct(product.id)}><i className="fas fa-trash"></i></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className={`modal ${showAddProductModal ? 'show' : ''}`}
        style={{ display: showAddProductModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        {/* Add Product Modal */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Product</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseAddProductModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <ProductForm addProduct={addProduct} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${showEditProductModal ? 'show' : ''}`}
        style={{ display: showEditProductModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        {/* Edit Product Modal */}
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Product</h5>
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
              {editingProductId && (
                <ProductEditForm
                  productId={editingProductId}
                  onClose={handleCloseEditForm}
                  updateProductInList={updateProductInList}
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
        {Array.from({ length: Math.ceil(filteredProducts.length / perPage) }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(filteredProducts.length / perPage) ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
        </li>
      </ul>
    </div>
  );
}

export default ProductList;