import { useEffect, useState } from 'react';
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCourseById } from '../api/courses';
import { getLessonsByCourse, deleteLesson } from '../api/lessons';
import { useAuth } from '../context/AuthContext';
import GlobalLoader from '../components/GlobalLoader';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function CourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch course details
    const courseResult = await getCourseById(courseId, token);
    if (courseResult.success) {
      setCourseData(courseResult.data);
    }

    // Fetch lessons for this course
    const lessonsResult = await getLessonsByCourse(courseId, token);
    
    if (lessonsResult.success) {
      setLessons(lessonsResult.data || []);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Lessons',
        text: lessonsResult.message || 'An error occurred while fetching lessons',
      });
      setLessons([]);
    }
    
    setIsLoading(false);
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

  const handleViewLesson = (lesson) => {
    setExpandedLessonId(expandedLessonId === lesson.id ? null : lesson.id);
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
                <button 
                  onClick={() => navigate('/courses')}
                  className="btn btn-link p-0 me-2"
                >
                  <i className="fas fa-arrow-left"></i>
                </button>
                <h5 style={{ display: 'inline' }}>
                  {courseData?.title} - Lessons
                </h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link className="btn btn-primary" to={`/add-lesson?courseId=${courseId}`}>
                      <i className="fa fa-plus-circle me-2"></i>
                      Add Lesson
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
                  {isLoading ? (
                    <div className="d-flex justify-content-center">
                      <GlobalLoader visible={true} size="medium" />
                    </div>
                  ) : lessons.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No lessons found for this course</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Order</th>
                            <th>Lesson Title</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => (
                            <React.Fragment key={lesson.id}>
                              <tr>
                                <td>
                                  <span className="badge bg-primary">{lesson.order || '-'}</span>
                                </td>
                                <td>{lesson.title}</td>
                                <td>
                                  <span className={`badge ${getContentTypeBadge(lesson.content_type)}`}>
                                    <i className={`${getContentTypeIcon(lesson.content_type)} me-1`}></i>
                                    {lesson.content_type}
                                  </span>
                                </td>
                                <td>{lesson.duration || '-'}</td>
                                <td>{lesson.description || '-'}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      className={`btn btn-sm ${expandedLessonId === lesson.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                      onClick={() => handleViewLesson(lesson)}
                                      title="View/Expand Content"
                                    >
                                      <i className={`fas ${expandedLessonId === lesson.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-warning"
                                      onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}/edit`)}
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

                              {expandedLessonId === lesson.id && (
                                <tr>
                                  <td colSpan="6">
                                    <div className="p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                      {lesson.content_type === 'text' && lesson.content && (
                                        <div>
                                          <h6>Text Content:</h6>
                                          <div className="alert alert-info">{lesson.content}</div>
                                        </div>
                                      )}

                                      {lesson.content_type === 'video' && lesson.video_url && (
                                        <div>
                                          <h6>Video Content:</h6>
                                          <video 
                                            width="100%" 
                                            height="400" 
                                            controls 
                                            style={{ borderRadius: '8px', backgroundColor: '#000', maxWidth: '100%' }}
                                          >
                                            <source src={lesson.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                          </video>
                                        </div>
                                      )}

                                      {lesson.content_type === 'audio' && lesson.file_url && (
                                        <div>
                                          <h6>Audio Content:</h6>
                                          <audio 
                                            controls 
                                            style={{ width: '100%' }}
                                          >
                                            <source src={lesson.file_url} type="audio/webm" />
                                            Your browser does not support the audio element.
                                          </audio>
                                        </div>
                                      )}

                                      {lesson.content_type === 'doc' && lesson.file_url && (
                                        <div>
                                          <h6>Document Content:</h6>
                                          <div className="mt-3">
                                            <a href={lesson.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                                              <i className="fas fa-file-download me-2"></i>Open Document
                                            </a>
                                          </div>
                                        </div>
                                      )}

                                      {lesson.content_type === 'pdf' && lesson.file_url && (
                                        <div>
                                          <h6>PDF Content:</h6>
                                          <div className="mt-3 mb-3">
                                            <iframe 
                                              src={`${lesson.file_url}#toolbar=1`}
                                              width="100%" 
                                              height="600" 
                                              style={{ border: '1px solid #ddd', borderRadius: '8px' }}
                                              title="PDF Viewer"
                                            />
                                          </div>
                                          <a href={lesson.file_url} download className="btn btn-outline-secondary btn-sm">
                                            <i className="fas fa-download me-2"></i>Download PDF
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
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
