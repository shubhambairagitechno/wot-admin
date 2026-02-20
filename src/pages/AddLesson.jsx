import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addLesson } from '../api/lessons';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AddLesson() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    content_type: 'text',
    duration: '',
    order: '',
    media: null,
  });

  const contentTypeOptions = ['text', 'video', 'audio', 'doc', 'pdf'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        media: file,
      }));
      setMediaPreview(file.name);
    }
  };

  const handleCancel = () => {
    if (courseId) {
      navigate(`/course/${courseId}/lessons`);
    } else {
      navigate('/lessons');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter lesson title',
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter lesson description',
      });
      return;
    }

    if (!formData.content_type) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please select content type',
      });
      return;
    }

    if (!formData.order) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter lesson order',
      });
      return;
    }

    if (!formData.media) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please upload media file',
      });
      return;
    }

    // If content_type is text, content is required
    if (formData.content_type === 'text' && !formData.content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter text content',
      });
      return;
    }

    setIsLoading(true);

    const result = await addLesson(courseId || 1, formData, token);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Lesson Created',
        text: result.message || 'Lesson created successfully!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        if (courseId) {
          navigate(`/course/${courseId}/lessons`);
        } else {
          navigate('/lessons');
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Lesson',
        text: result.message || 'An error occurred while creating the lesson',
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
                <h5>Add New Lesson</h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link 
                      className="btn btn-primary" 
                      to={courseId ? `/course/${courseId}/lessons` : '/lessons'}
                    >
                      <i className="fa fa-plus-circle me-2"></i>View All
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-8">
                      <label className="form-label">Lesson Title <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter lesson title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Content Type <span className="text-danger">*</span></label>
                      <select 
                        className="form-select"
                        name="content_type"
                        value={formData.content_type}
                        onChange={handleInputChange}
                      >
                        {contentTypeOptions.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Lesson Order <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="1"
                        name="order"
                        value={formData.order}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Duration</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g., 20 min"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Lesson Description <span className="text-danger">*</span></label>
                      <textarea 
                        className="form-control" 
                        rows="3" 
                        placeholder="Enter lesson description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    {formData.content_type === 'text' && (
                      <div className="col-md-12">
                        <label className="form-label">Content Text <span className="text-danger">*</span></label>
                        <textarea 
                          className="form-control" 
                          rows="5" 
                          placeholder="Enter text content"
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                    )}

                    <div className="col-md-12">
                      <label className="form-label">Media File <span className="text-danger">*</span></label>
                      <input 
                        type="file" 
                        className="form-control"
                        onChange={handleMediaChange}
                        accept=".mp4,.webm,.mp3,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif"
                        required
                      />
                      {mediaPreview && (
                        <div className="mt-2">
                          <small className="text-muted">Selected: {mediaPreview}</small>
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
                        <i className="bi bi-check-circle"></i> {isLoading ? 'Creating...' : 'Create Lesson'}
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
