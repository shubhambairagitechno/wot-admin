import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getAllCourses } from '../api/courses';
import { getLessonsByCourse, deleteLesson } from '../api/lessons';
import GlobalLoader from '../components/GlobalLoader';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Lessons() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [allLessons, setAllLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    // Handle pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setLessons(allLessons.slice(startIndex, endIndex));
  }, [currentPage, allLessons]);

  const fetchLessons = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    
    // First fetch all courses to map IDs to titles
    const coursesResult = await getAllCourses(token);
    let coursesList = {};
    
    if (coursesResult.success) {
      coursesResult.data?.forEach(course => {
        coursesList[course.id] = course;
      });
      setCoursesMap(coursesList);
    }

    // Fetch lessons for all courses
    const allLessonsList = [];
    if (coursesResult.success && coursesResult.data?.length > 0) {
      for (const course of coursesResult.data) {
        const lessonsResult = await getLessonsByCourse(course.id, token);
        if (lessonsResult.success && lessonsResult.data?.length > 0) {
          allLessonsList.push(...lessonsResult.data.map(lesson => ({
            ...lesson,
            courseId: course.id,
            courseName: course.title
          })));
        }
      }
    }

    if (allLessonsList.length > 0) {
      setAllLessons(allLessonsList);
    } else {
      setAllLessons([]);
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

  const handleDeleteLesson = (lessonId, lessonTitle, courseId) => {
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
            fetchLessons();
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
                <h5>Lessons</h5>
              </div>
              <div className="list-btn">
                <ul className="filter-list">
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
                      <p className="text-muted">No lessons found. Create lessons within courses.</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Lesson Title</th>
                              <th>Course</th>
                              <th>Type</th>
                              <th>Order</th>
                              <th>Duration</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lessons.map((lesson) => (
                              <tr key={lesson.id}>
                                <td>{lesson.title}</td>
                                <td>
                                  <Link to={`/course/${lesson.courseId}/lessons`} className="text-decoration-none">
                                    {lesson.courseName}
                                  </Link>
                                </td>
                                <td>
                                  <span className={`badge ${getContentTypeBadge(lesson.content_type)}`}>
                                    <i className={`${getContentTypeIcon(lesson.content_type)} me-1`}></i>
                                    {lesson.content_type}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge bg-primary">{lesson.order || '-'}</span>
                                </td>
                                <td>{lesson.duration || '-'}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <Link 
                                      to={`/course/${lesson.courseId}/lesson/${lesson.id}/edit`}
                                      className="btn btn-sm btn-outline-warning"
                                      title="Edit Lesson"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </Link>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteLesson(lesson.id, lesson.title, lesson.courseId)}
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
                      <Pagination 
                        currentPage={currentPage}
                        totalPages={Math.ceil(allLessons.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={allLessons.length}
                        isLoading={isLoading}
                      />
                    </>
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
