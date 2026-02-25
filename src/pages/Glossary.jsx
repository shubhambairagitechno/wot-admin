import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGlossary } from '../api/glossary';
import Swal from 'sweetalert2';

export default function Glossary() {
  const { token } = useAuth();
  const [glossaryData, setGlossaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    fetchGlossary();
  }, [currentPage]);

  const fetchGlossary = async () => {
    setLoading(true);
    try {
      const result = await getGlossary(token, currentPage, itemsPerPage);

      if (result.success) {
        setGlossaryData(result.data || []);
        setTotalPages(Math.ceil(result.total / itemsPerPage));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Failed to fetch glossary',
        });
      }
    } catch (error) {
      console.error('Error fetching glossary:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while fetching glossary',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredData = glossaryData.filter((item) =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.short_form.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category) => {
    const colors = {
      'SMC': 'bg-primary',
      'Technical Analysis': 'bg-success',
      'ICT': 'bg-warning',
      'Price Action': 'bg-info',
    };
    return colors[category] || 'bg-secondary';
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header d-print-none">
          <div className="row align-items-center">
            <div className="col">
              <h2 className="page-title">Trading Glossary</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by term, short form, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Term</th>
                        <th>Short Form</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span className="fw-bold">{item.term}</span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{item.short_form}</span>
                            </td>
                            <td>
                              <span className={`badge ${getCategoryBadge(item.category)}`}>
                                {item.category}
                              </span>
                            </td>
                            <td>
                              <small>{item.description}</small>
                            </td>
                            <td>
                              {item.created_at
                                ? new Date(item.created_at).toLocaleDateString()
                                : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4">
                            No glossary terms found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <nav className="d-flex justify-content-center mt-4">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>

                    {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                      const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                      if (pageNumber > totalPages) return null;
                      return (
                        <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </li>
                  </ul>
                </nav>

                <div className="text-center text-muted small mt-2">
                  Page {currentPage} of {totalPages} | Total: {filteredData.length} items
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
