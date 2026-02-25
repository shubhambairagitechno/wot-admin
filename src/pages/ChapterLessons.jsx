import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getCourseById } from '../api/courses';
import { getLessonsByChapter, deleteLesson } from '../api/lessons';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function ChapterLessons() {
  const { token } = useAuth();
  const { courseId, categoryId, chapterId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (courseId && categoryId && chapterId) {
      fetchData();
    }
  }, [courseId, categoryId, chapterId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch course details
      const courseResult = await getCourseById(courseId, token);
      if (courseResult.success) {
        setCourse(courseResult.data);
      }
      
      // Fetch lessons for this chapter from API
      const lessonsResult = await getLessonsByChapter(chapterId, token);
      
      if (lessonsResult.success) {
        // Extract chapter info from lessons if available
        if (lessonsResult.chapterId) {
          setChapter({
            id: chapterId,
            title: `Chapter ${chapterId}`,
            order_number: lessonsResult.chapterId
          });
        }
        
        // Process lessons data from API
        const processedLessons = lessonsResult.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          content_type: lesson.content_type || 'Text',
          order_number: lesson.order_number,
          duration: lesson.duration || '-',
          status: lesson.status || 'active',
          created_at: lesson.created_at,
          description: lesson.description
        }));
        
        setLessons(processedLessons);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: lessonsResult.message || 'Failed to fetch lessons',
        });
        setLessons([]);
      }
    } catch (error) {
      console.error('[v0] Error fetching lessons:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching lessons',
      });
      setLessons([]);
    }
    
    setIsLoading(false);
  };

  const getContentTypeBadge = (contentType) => {
    const badgeMap = {
      'text': 'bg-info',
      'video': 'bg-danger',
      'audio': 'bg-primary',
      'doc': 'bg-warning',
      'pdf': 'bg-secondary',
    };
    return badgeMap[contentType?.toLowerCase()] || 'bg-dark';
  };

  const getContentTypeIcon = (contentType) => {
    const iconMap = {
      'text': 'fas fa-file-alt',
      'video': 'fas fa-video',
      'audio': 'fas fa-headphones',
      'doc': 'fas fa-file-word',
      'pdf': 'fas fa-file-pdf',
    };
    return iconMap[contentType?.toLowerCase()] || 'fas fa-file';
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

  const handleDeleteLesson = (lessonId, lessonTitle) => {
    Swal.fire({
      title: 'Delete Lesson',
      text: `Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = await deleteLesson(lessonId, token);

        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: deleteResult.message || 'Lesson deleted successfully',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            fetchData();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to Delete',
            text: deleteResult.message || 'An error occurred while deleting the lesson',
          });
        }
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
                <h5>Lessons{chapter && ` - ${chapter.title}`}</h5>
                {chapter?.description && (
                  <p className="text-muted small">{chapter.description}</p>
                )}
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapters`)}
                    >
                      <i className="fas fa-arrow-left me-2"></i>Back to Chapters
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
                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapterId}/add-lesson`)}
                    >
                      <i className="fa fa-plus-circle me-2"></i>Add Lesson
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
                  ) : lessons.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No lessons found for this chapter</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Lesson Title</th>
                            <th>Order</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => (
                            <tr key={lesson.id}>
                              <td>
                                <div>
                                  <span className="fw-bold">{lesson.title}</span>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-secondary">{lesson.order_number}</span>
                              </td>
                              <td>
                                <span className={`badge ${getContentTypeBadge(lesson.content_type)}`}>
                                  <i className={`${getContentTypeIcon(lesson.content_type)} me-1`}></i>
                                  {lesson.content_type}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusBadge(lesson.status)}`}>
                                  {lesson.status}
                                </span>
                              </td>
                              <td>
                                {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : '-'}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapterId}/lesson/${lesson.id}/edit`)}
                                    title="Edit Lesson"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                    title="Delete Lesson"
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
