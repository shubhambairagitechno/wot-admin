import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCourseById, updateCourse } from '../api/courses';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function EditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    duration: '',
    level: 'beginner',
    status: 'active',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    setIsLoading(true);
    const result = await getCourseById(courseId, token);

    if (result.success) {
      const course = result.data;
      setFormData({
        title: course.title || '',
        description: course.description || '',
        objectives: course.objectives || '',
        duration: course.duration || '',
        level: course.level || 'beginner',
        status: course.status || 'active',
        image: null,
      });
      setImagePreview(course.image_url);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Course',
        text: result.message || 'An error occurred while fetching course details',
      });
      navigate('/courses');
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
    navigate('/courses');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter course title',
      });
      return;
    }

    if (!formData.description.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter course description',
      });
      return;
    }

    if (!formData.objectives.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter course objectives',
      });
      return;
    }

    if (!formData.duration.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter course duration',
      });
      return;
    }

    setIsSubmitting(true);

    const result = await updateCourse(courseId, formData, token);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Course Updated',
        text: result.message || 'Course updated successfully!',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      }).then(() => {
        navigate('/courses');
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Update Course',
        text: result.message || 'An error occurred while updating the course',
      });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <GlobalLoader visible={true} size="medium" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
                <h5>Edit Course</h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <a className="btn btn-primary" href="/courses"><i className="fa fa-arrow-left me-2"></i>Back</a>
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
                      <label className="form-label">Course Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter course title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Level <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Duration <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., 5 weeks"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Course Description <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter detailed course description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Course Objectives <span className="text-danger">*</span></label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Enter course objectives/learning outcomes"
                        name="objectives"
                        value={formData.objectives}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Course Thumbnail</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
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
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-check-circle"></i> {isSubmitting ? 'Updating...' : 'Update Course'}
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
