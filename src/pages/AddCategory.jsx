import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createCategory } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AddCategory() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    order_number: 0,
    status: 'active',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    
    if (name === 'order_number') {
      finalValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate(`/course/${courseId}/categories`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter category name',
      });
      return;
    }

    if (!formData.image) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please upload category image',
      });
      return;
    }

    setIsLoading(true);

    const result = await createCategory(courseId, formData, token);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Category Created',
        text: result.message || 'Category created successfully!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/course/${courseId}/categories`);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Category',
        text: result.message || 'An error occurred while creating the category',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <div>
                <h5>Add New Category</h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/course/${courseId}/categories`)}
                    >
                      <i className="fa fa-arrow-left me-2"></i>Back to Categories
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Category Name <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter category name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Order Number</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="0"
                        name="order_number"
                        value={formData.order_number}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        placeholder="Enter category description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Category Image <span className="text-danger">*</span></label>
                      <input 
                        type="file" 
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <img 
                            src={imagePreview} 
                            alt="Image Preview" 
                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-md-12 text-end mt-3">
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary ms-2"
                        disabled={isLoading}
                      >
                        <i className="bi bi-check-circle"></i> {isLoading ? 'Creating...' : 'Create Category'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
