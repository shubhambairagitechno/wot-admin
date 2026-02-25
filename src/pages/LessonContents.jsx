import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function LessonContents() {
  const { token } = useAuth();
  const { courseId, categoryId, chapterId, lessonId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId && categoryId && chapterId && lessonId) {
      fetchData();
    }
  }, [courseId, categoryId, chapterId, lessonId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Set lesson info
      setLesson({
        id: lessonId,
        title: `Lesson ${lessonId}`,
        description: 'Sample lesson description'
      });

      // Demo data for content list
      const demoContents = [
        {
          id: 1,
          title: 'Introduction to Topic',
          type: 'video',
          duration: '5:30',
          status: 'active',
          created_at: '2024-02-20',
          order_number: 1,
          description: 'Getting started with the basics'
        },
        {
          id: 2,
          title: 'Core Concepts',
          type: 'text',
          duration: '-',
          status: 'active',
          created_at: '2024-02-20',
          order_number: 2,
          description: 'Understanding fundamental principles'
        },
        {
          id: 3,
          title: 'Practice Exercise',
          type: 'pdf',
          duration: '-',
          status: 'active',
          created_at: '2024-02-21',
          order_number: 3,
          description: 'Hands-on practice materials'
        },
        {
          id: 4,
          title: 'Advanced Techniques',
          type: 'video',
          duration: '8:15',
          status: 'draft',
          created_at: '2024-02-21',
          order_number: 4,
          description: 'Moving beyond the basics'
        },
        {
          id: 5,
          title: 'Audio Lecture',
          type: 'audio',
          duration: '12:45',
          status: 'active',
          created_at: '2024-02-22',
          order_number: 5,
          description: 'Detailed lecture recording'
        },
      ];

      setContents(demoContents);
    } catch (error) {
      console.error('[v0] Error fetching contents:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching contents',
      });
      setContents([]);
    }
    
    setIsLoading(false);
  };

  const getContentTypeBadge = (type) => {
    const badgeMap = {
      'text': 'bg-info',
      'video': 'bg-danger',
      'audio': 'bg-primary',
      'doc': 'bg-warning',
      'pdf': 'bg-secondary',
      'image': 'bg-success',
    };
    return badgeMap[type?.toLowerCase()] || 'bg-dark';
  };

  const getContentTypeIcon = (type) => {
    const iconMap = {
      'text': 'fas fa-file-alt',
      'video': 'fas fa-video',
      'audio': 'fas fa-headphones',
      'doc': 'fas fa-file-word',
      'pdf': 'fas fa-file-pdf',
      'image': 'fas fa-image',
    };
    return iconMap[type?.toLowerCase()] || 'fas fa-file';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: 'bg-success',
      inactive: 'bg-danger',
      draft: 'bg-warning',
      published: 'bg-success',
      blocked: 'bg-danger',
      review: 'bg-info',
    };
    return statusMap[status?.toLowerCase()] || 'bg-secondary';
  };

  const handleDeleteContent = (contentId, contentTitle) => {
    Swal.fire({
      title: 'Delete Content',
      text: `Are you sure you want to delete "${contentTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Demo delete - in real implementation, call API
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Content deleted successfully',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          setContents(contents.filter(c => c.id !== contentId));
        });
      }
    });
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
                <h5>Contents{lesson && ` - ${lesson.title}`}</h5>
                {lesson?.description && (
                  <p className="text-muted small">{lesson.description}</p>
                )}
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapterId}/lessons`)}
                    >
                      <i className="fas fa-arrow-left me-2"></i>Back to Lessons
                    </button>
                  </li>
                  <li>
                    <div className="dropdown dropdown-action" data-bs-placement="bottom" data-bs-original-title="Download">
                      <a href="#" className="btn btn-primary" data-bs-toggle="dropdown" aria-expanded="false">
                        <span><i className="fe fe-download me-2"></i></span>Export
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <ul className="d-block">
                          <li>
                            <a className="d-flex align-items-center download-item" href="javascript:void(0);" download="">
                              <i className="far fa-file-text me-2"></i>Excel
                            </a>
                          </li>
                          <li>
                            <a className="d-flex align-items-center download-item" href="javascript:void(0);" download="">
                              <i className="far fa-file-pdf me-2"></i>PDF
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapterId}/lesson/${lessonId}/add-content`)}
                    >
                      <i className="fa fa-plus-circle me-2"></i>Add Content
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
                  {isLoading ? (
                    <GlobalLoader visible={true} size="medium" />
                  ) : contents.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No contents found for this lesson</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Content Title</th>
                            <th>Order</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contents.map((content) => (
                            <tr key={content.id}>
                              <td>
                                <div>
                                  <span className="fw-bold">{content.title}</span>
                                  {content.description && (
                                    <p className="text-muted small mb-0">{content.description}</p>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{content.order_number}</span>
                              </td>
                              <td>
                                <span className={`badge ${getContentTypeBadge(content.type)}`}>
                                  <i className={`${getContentTypeIcon(content.type)} me-1`}></i>
                                  {content.type}
                                </span>
                              </td>
                              <td>
                                <span>{content.duration}</span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(content.status)}`}>
                                  {content.status}
                                </span>
                              </td>
                              <td>
                                {content.created_at ? new Date(content.created_at).toLocaleDateString() : '-'}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapterId}/lesson/${lessonId}/edit-content/${content.id}`)}
                                    title="Edit Content"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteContent(content.id, content.title)}
                                    title="Delete Content"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
