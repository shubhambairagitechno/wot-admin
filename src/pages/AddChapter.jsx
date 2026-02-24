import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { createChapter, getCourseById } from '../api/courses';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function AddChapter() {
  const { token } = useAuth();
  const { courseId, categoryId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    chapter_number: '',
    duration: '',
    total_duration: '',
    is_locked: false,
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    setCourseLoading(true);
    const result = await getCourseById(courseId, token);
    if (result.success) {
      setCourse(result.data);
    }
    setCourseLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      Swal.fire('Error', 'Chapter title is required', 'error');
      return;
    }

    setIsLoading(true);
    const result = await createChapter(categoryId, formData, token);

    if (result.success) {
      Swal.fire('Success', 'Chapter created successfully', 'success');
      navigate(`/course/${courseId}/category/${categoryId}/chapters`);
    } else {
      Swal.fire('Error', result.message || 'Failed to create chapter', 'error');
    }
    setIsLoading(false);
  };

  if (courseLoading) {
    return <GlobalLoader visible={true} size="medium" />;
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <div>
                <h5>Add Chapter</h5>
                {course && (
                  <p className="text-muted small">Course: {course.title}</p>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-12">
                        <label className="form-label">Chapter Title <span className="text-danger">*</span></label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Enter chapter title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Chapter Number</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="Enter chapter number"
                          name="chapter_number"
                          value={formData.chapter_number}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select 
                          className="form-control"
                          name="is_locked"
                          value={formData.is_locked}
                          onChange={handleInputChange}
                        >
                          <option value={false}>Unlocked</option>
                          <option value={true}>Locked</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Duration (minutes)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="Enter duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Total Duration (minutes)</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          placeholder="Enter total duration"
                          name="total_duration"
                          value={formData.total_duration}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea 
                          className="form-control" 
                          placeholder="Enter chapter description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="4"
                        ></textarea>
                      </div>

                      <div className="col-md-12">
                        <div className="d-flex gap-2 justify-content-end">
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapters`)}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-save me-2"></i>Create Chapter
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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
