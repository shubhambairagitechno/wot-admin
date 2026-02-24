import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { getCourseById } from '../api/courses';
import GlobalLoader from '../components/GlobalLoader';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Chapters() {
  const { token } = useAuth();
  const { courseId, categoryId } = useParams();
  const navigate = useNavigate();
  const [allChapters, setAllChapters] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [category, setCategory] = useState(null);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (courseId && categoryId) {
      fetchData();
    }
  }, [courseId, categoryId]);

  useEffect(() => {
    // Handle pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setChapters(allChapters.slice(startIndex, endIndex));
  }, [currentPage, allChapters]);

  const fetchData = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    
    // Fetch course details
    const courseResult = await getCourseById(courseId, token);
    if (courseResult.success) {
      setCourse(courseResult.data);
    }
    
    // TODO: Fetch chapters from API when endpoint is available
    // For now using demo data
    setCategory({
      id: categoryId,
      title: 'Foundations of Technical Analysis',
      description: 'Learn the basics of technical analysis'
    });

    const demoChapters = [
      {
        id: 1,
        title: 'Chapter 1: Market Structure Basics',
        description: 'Understanding market structure and price action',
        order_number: 1,
        lesson_count: 5,
        status: 'Published',
        created_at: '2024-01-15T10:30:00'
      },
      {
        id: 2,
        title: 'Chapter 2: Support & Resistance Levels',
        description: 'Identifying key support and resistance levels',
        order_number: 2,
        lesson_count: 4,
        status: 'Published',
        created_at: '2024-01-20T14:22:00'
      },
      {
        id: 3,
        title: 'Chapter 3: Trendlines & Channels',
        description: 'Drawing and using trendlines effectively',
        order_number: 3,
        lesson_count: 3,
        status: 'Draft',
        created_at: '2024-02-01T09:15:00'
      },
      {
        id: 4,
        title: 'Chapter 4: Advanced Price Action',
        description: 'Advanced techniques in price action trading',
        order_number: 4,
        lesson_count: 6,
        status: 'Published',
        created_at: '2024-02-05T11:45:00'
      },
      {
        id: 5,
        title: 'Chapter 5: Market Analysis',
        description: 'Complete market analysis framework',
        order_number: 5,
        lesson_count: 8,
        status: 'Review',
        created_at: '2024-02-10T13:20:00'
      }
    ];

    setAllChapters(demoChapters);
    setIsLoading(false);
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

  const handleDeleteChapter = (chapterId, chapterTitle) => {
    Swal.fire({
      title: 'Delete Chapter',
      text: `Are you sure you want to delete "${chapterTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // TODO: Implement delete chapter API call when endpoint is available
        Swal.fire({
          icon: 'info',
          title: 'Delete Feature',
          text: 'Delete chapter feature will be available soon',
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
                <h5>Chapters{category && ` - ${category.title}`}</h5>
                {category?.description && (
                  <p className="text-muted small">{category.description}</p>
                )}
              </div>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(`/course/${courseId}/categories`)}
                    >
                      <i className="fas fa-arrow-left me-2"></i>Back to Categories
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
                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/add-chapter`)}
                    >
                      <i className="fa fa-plus-circle me-2"></i>Add Chapter
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
                  ) : chapters.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No chapters found for this category</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Chapter Title</th>
                              <th>Order</th>
                              <th>Lessons</th>
                              <th>Status</th>
                              <th>Created Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chapters.map((chapter) => (
                              <tr key={chapter.id}>
                                <td>
                                  <div>
                                    <span className="fw-bold">{chapter.title}</span>
                                    <br />
                                    <small className="text-muted">{chapter.description}</small>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-secondary">{chapter.order_number}</span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-link text-primary p-0"
                                    onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapter.id}/lessons`)}
                                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                                    title="View Lessons"
                                  >
                                    <span className="badge bg-primary">{chapter.lesson_count || 0}</span>
                                  </button>
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadge(chapter.status)}`}>
                                    {chapter.status}
                                  </span>
                                </td>
                                <td>
                                  {chapter.created_at ? new Date(chapter.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      className="btn btn-sm btn-outline-warning"
                                      onClick={() => navigate(`/course/${courseId}/category/${categoryId}/chapter/${chapter.id}/edit`)}
                                      title="Edit Chapter"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteChapter(chapter.id, chapter.title)}
                                      title="Delete Chapter"
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
                        totalPages={Math.ceil(allChapters.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={allChapters.length}
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
